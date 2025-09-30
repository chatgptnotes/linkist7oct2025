-- Fix missing columns in orders table
-- Run this in your Supabase SQL Editor

-- Add missing unit_price column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2) DEFAULT 499.00;

-- Create missing gdpr_consents table if it doesn't exist
CREATE TABLE IF NOT EXISTS gdpr_consents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  consents JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index and RLS for gdpr_consents
CREATE INDEX IF NOT EXISTS idx_gdpr_consents_email ON gdpr_consents(email);
ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;

-- Update RLS policies to be more restrictive
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;

-- More restrictive RLS policies
CREATE POLICY "Service role full access on users" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access on orders" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow anonymous OTP operations (needed for verification flow)
CREATE POLICY "Anonymous OTP operations" ON email_otps
  FOR ALL USING (true);

CREATE POLICY "Anonymous OTP operations mobile" ON mobile_otps
  FOR ALL USING (true);

-- Allow anonymous order creation (for checkout)
CREATE POLICY "Anonymous order creation" ON orders
  FOR INSERT WITH CHECK (true);

-- Verify tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'orders', 'email_otps', 'mobile_otps', 'gdpr_consents')
ORDER BY table_name;