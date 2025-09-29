-- Supabase schema for Linkist NFC Card System
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  email_verified BOOLEAN DEFAULT FALSE,
  mobile_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Email OTPs table
CREATE TABLE email_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Mobile OTPs table
CREATE TABLE mobile_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mobile VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'production', 'shipped', 'delivered', 'cancelled')),
  customer_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  
  -- Card configuration (JSON)
  card_config JSONB NOT NULL,
  
  -- Shipping information (JSON)
  shipping JSONB NOT NULL,
  
  -- Pricing information (JSON)
  pricing JSONB NOT NULL,
  
  -- Email tracking (JSON)
  emails_sent JSONB DEFAULT '{}',
  
  -- Optional fields
  estimated_delivery VARCHAR(50),
  tracking_number VARCHAR(100),
  tracking_url TEXT,
  proof_images TEXT[], -- Array of image URLs
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- GDPR consents table
CREATE TABLE gdpr_consents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  consents JSONB NOT NULL, -- Store consent details
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_email_otps_email ON email_otps(email);
CREATE INDEX idx_email_otps_expires_at ON email_otps(expires_at);
CREATE INDEX idx_mobile_otps_mobile ON mobile_otps(mobile);
CREATE INDEX idx_mobile_otps_expires_at ON mobile_otps(expires_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_gdpr_consents_email ON gdpr_consents(email);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id OR auth.jwt() ->> 'email' = email);

-- RLS Policies for orders table (users can view their own orders)
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Allow anonymous access for OTPs (needed for verification flow)
CREATE POLICY "Allow anonymous access to email OTPs" ON email_otps
  FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to mobile OTPs" ON mobile_otps
  FOR ALL USING (true);

-- Allow anonymous order creation (for checkout flow)
CREATE POLICY "Allow anonymous order creation" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow service role to manage all data (for admin functions)
CREATE POLICY "Service role can manage all users" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all orders" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Functions to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean expired OTPs (run periodically)
CREATE OR REPLACE FUNCTION clean_expired_otps()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete expired email OTPs
    DELETE FROM email_otps WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete expired mobile OTPs
    DELETE FROM mobile_otps WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;