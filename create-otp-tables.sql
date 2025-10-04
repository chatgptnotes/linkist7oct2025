-- Create Email OTP Table
CREATE TABLE IF NOT EXISTS email_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps(email);
CREATE INDEX IF NOT EXISTS idx_email_otps_expires_at ON email_otps(expires_at);

-- Create Mobile OTP Table
CREATE TABLE IF NOT EXISTS mobile_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mobile VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster mobile lookups
CREATE INDEX IF NOT EXISTS idx_mobile_otps_mobile ON mobile_otps(mobile);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_expires_at ON mobile_otps(expires_at);

-- Enable Row Level Security (optional, can be disabled for service role access)
ALTER TABLE email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_otps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access to email_otps" ON email_otps
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to mobile_otps" ON mobile_otps
  FOR ALL
  USING (true)
  WITH CHECK (true);
