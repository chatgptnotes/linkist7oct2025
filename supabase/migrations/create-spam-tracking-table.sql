-- Spam Tracking Table for WhatsApp/SMS abuse prevention
-- Tracks phone number attempts, suspicious patterns, and enforces rate limits

CREATE TABLE IF NOT EXISTS phone_spam_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,

  -- Attempt tracking
  attempt_count INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  last_attempt_at TIMESTAMPTZ DEFAULT NOW(),

  -- Spam indicators
  is_blocked BOOLEAN DEFAULT FALSE,
  block_reason TEXT,
  blocked_until TIMESTAMPTZ,

  -- Pattern detection
  attempts_last_hour INTEGER DEFAULT 1,
  attempts_last_day INTEGER DEFAULT 1,
  different_ips_count INTEGER DEFAULT 1,

  -- Bot detection scores
  velocity_score DECIMAL DEFAULT 0, -- How fast are requests coming
  pattern_score DECIMAL DEFAULT 0,  -- Suspicious patterns
  total_risk_score DECIMAL DEFAULT 0, -- Combined risk assessment

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes for performance
  CONSTRAINT unique_phone_tracking UNIQUE(phone_number)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_phone_spam_tracking_phone ON phone_spam_tracking(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_spam_tracking_ip ON phone_spam_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_phone_spam_tracking_blocked ON phone_spam_tracking(is_blocked, blocked_until);
CREATE INDEX IF NOT EXISTS idx_phone_spam_tracking_last_attempt ON phone_spam_tracking(last_attempt_at);

-- Blocked Numbers Table - Permanent blacklist
CREATE TABLE IF NOT EXISTS blocked_phone_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL UNIQUE,
  block_reason TEXT NOT NULL,
  blocked_by TEXT, -- admin user or 'system'
  blocked_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocked_numbers_phone ON blocked_phone_numbers(phone_number);

-- Suspicious IP Addresses - Track IPs making too many requests
CREATE TABLE IF NOT EXISTS suspicious_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  phone_numbers_attempted TEXT[], -- Array of phone numbers from this IP
  total_attempts INTEGER DEFAULT 1,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT FALSE,
  risk_score DECIMAL DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suspicious_ips_ip ON suspicious_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_suspicious_ips_blocked ON suspicious_ips(is_blocked);

-- Function to clean up old tracking data (run periodically)
CREATE OR REPLACE FUNCTION cleanup_spam_tracking()
RETURNS void AS $$
BEGIN
  -- Delete tracking records older than 30 days that aren't blocked
  DELETE FROM phone_spam_tracking
  WHERE updated_at < NOW() - INTERVAL '30 days'
    AND is_blocked = FALSE;

  -- Reset hourly/daily counters for old records
  UPDATE phone_spam_tracking
  SET
    attempts_last_hour = 0,
    attempts_last_day = 0
  WHERE last_attempt_at < NOW() - INTERVAL '1 day';

  -- Unblock expired temporary blocks
  UPDATE phone_spam_tracking
  SET
    is_blocked = FALSE,
    block_reason = NULL,
    blocked_until = NULL
  WHERE is_blocked = TRUE
    AND blocked_until IS NOT NULL
    AND blocked_until < NOW();

  -- Clean suspicious IPs older than 60 days
  DELETE FROM suspicious_ips
  WHERE last_seen_at < NOW() - INTERVAL '60 days'
    AND is_blocked = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE phone_spam_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspicious_ips ENABLE ROW LEVEL SECURITY;

-- Policies for service role only (admin access)
CREATE POLICY "Service role can manage spam tracking" ON phone_spam_tracking
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage blocked numbers" ON blocked_phone_numbers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage suspicious IPs" ON suspicious_ips
  FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON phone_spam_tracking TO service_role;
GRANT ALL ON blocked_phone_numbers TO service_role;
GRANT ALL ON suspicious_ips TO service_role;

COMMENT ON TABLE phone_spam_tracking IS 'Tracks phone number OTP request patterns for spam/bot detection';
COMMENT ON TABLE blocked_phone_numbers IS 'Permanent blacklist of phone numbers that have been blocked';
COMMENT ON TABLE suspicious_ips IS 'Tracks IP addresses making suspicious or excessive OTP requests';
