-- Add missing tables for Supabase integration
-- This script safely adds only tables that don't exist

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table only if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
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

-- Create email_otps table only if it doesn't exist
CREATE TABLE IF NOT EXISTS email_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create mobile_otps table only if it doesn't exist
CREATE TABLE IF NOT EXISTS mobile_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mobile VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create gdpr_consents table only if it doesn't exist
CREATE TABLE IF NOT EXISTS gdpr_consents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  consents JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add missing columns to orders table if they don't exist
-- Check and add order_number column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'order_number' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN order_number VARCHAR(50) UNIQUE;
  END IF;
END $$;

-- Check and add customer_name column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'customer_name' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN customer_name VARCHAR(200);
  END IF;
END $$;

-- Check and add phone_number column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'phone_number' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN phone_number VARCHAR(20);
  END IF;
END $$;

-- Check and add card_config JSONB column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'card_config' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN card_config JSONB;
  END IF;
END $$;

-- Check and add shipping JSONB column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'shipping' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping JSONB;
  END IF;
END $$;

-- Check and add pricing JSONB column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'pricing' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN pricing JSONB;
  END IF;
END $$;

-- Check and add emails_sent JSONB column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'emails_sent' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN emails_sent JSONB DEFAULT '{}';
  END IF;
END $$;

-- Check and add estimated_delivery column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'estimated_delivery' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN estimated_delivery VARCHAR(50);
  END IF;
END $$;

-- Check and add tracking_number column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'tracking_number' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(100);
  END IF;
END $$;

-- Check and add tracking_url column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'tracking_url' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_url TEXT;
  END IF;
END $$;

-- Check and add proof_images column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'proof_images' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN proof_images TEXT[];
  END IF;
END $$;

-- Check and add notes column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'notes' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN notes TEXT;
  END IF;
END $$;

-- Add status column with constraint if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'status' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
    ALTER TABLE orders ADD CONSTRAINT orders_status_check 
      CHECK (status IN ('pending', 'confirmed', 'production', 'shipped', 'delivered', 'cancelled'));
  END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps(email);
CREATE INDEX IF NOT EXISTS idx_email_otps_expires_at ON email_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_mobile ON mobile_otps(mobile);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_expires_at ON mobile_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gdpr_consents_email ON gdpr_consents(email);

-- Enable Row Level Security on new tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (will skip if they already exist)
DO $$
BEGIN
    -- Users policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own data') THEN
        EXECUTE 'CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> ''email'' = email)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update their own data') THEN
        EXECUTE 'CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id OR auth.jwt() ->> ''email'' = email)';
    END IF;
    
    -- Email OTPs policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_otps' AND policyname = 'Allow anonymous access to email OTPs') THEN
        EXECUTE 'CREATE POLICY "Allow anonymous access to email OTPs" ON email_otps FOR ALL USING (true)';
    END IF;
    
    -- Mobile OTPs policies  
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mobile_otps' AND policyname = 'Allow anonymous access to mobile OTPs') THEN
        EXECUTE 'CREATE POLICY "Allow anonymous access to mobile OTPs" ON mobile_otps FOR ALL USING (true)';
    END IF;
    
    -- Orders policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view their own orders') THEN
        EXECUTE 'CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (email = auth.jwt() ->> ''email'')';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Allow anonymous order creation') THEN
        EXECUTE 'CREATE POLICY "Allow anonymous order creation" ON orders FOR INSERT WITH CHECK (true)';
    END IF;
    
    -- Service role policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Service role can manage all users') THEN
        EXECUTE 'CREATE POLICY "Service role can manage all users" ON users FOR ALL USING (auth.jwt() ->> ''role'' = ''service_role'')';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Service role can manage all orders') THEN  
        EXECUTE 'CREATE POLICY "Service role can manage all orders" ON orders FOR ALL USING (auth.jwt() ->> ''role'' = ''service_role'')';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Some policies could not be created: %', SQLERRM;
END $$;

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (will replace if they exist)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create or replace the clean expired OTPs function
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

-- Success message
SELECT 'Database setup completed successfully! 🎉' as result;