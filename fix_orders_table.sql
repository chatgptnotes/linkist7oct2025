-- Fix the existing orders table to work with Supabase integration
-- This script adds all missing columns safely

-- First, let's see what columns currently exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add all missing columns that our Supabase integration needs
-- Each column is added only if it doesn't exist

-- Add email column (required for our integration)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'email' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN email VARCHAR(255);
    RAISE NOTICE 'Added email column';
  ELSE
    RAISE NOTICE 'email column already exists';
  END IF;
END $$;

-- Add customer_name column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'customer_name' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN customer_name VARCHAR(200);
    RAISE NOTICE 'Added customer_name column';
  ELSE
    RAISE NOTICE 'customer_name column already exists';
  END IF;
END $$;

-- Add phone_number column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'phone_number' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN phone_number VARCHAR(20);
    RAISE NOTICE 'Added phone_number column';
  ELSE
    RAISE NOTICE 'phone_number column already exists';
  END IF;
END $$;

-- Add card_config JSONB column (essential for NFC card data)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'card_config' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN card_config JSONB;
    RAISE NOTICE 'Added card_config JSONB column';
  ELSE
    RAISE NOTICE 'card_config column already exists';
  END IF;
END $$;

-- Add shipping JSONB column (for shipping address)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'shipping' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping JSONB;
    RAISE NOTICE 'Added shipping JSONB column';
  ELSE
    RAISE NOTICE 'shipping column already exists';
  END IF;
END $$;

-- Add pricing JSONB column (for price breakdown)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'pricing' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN pricing JSONB;
    RAISE NOTICE 'Added pricing JSONB column';
  ELSE
    RAISE NOTICE 'pricing column already exists';
  END IF;
END $$;

-- Add emails_sent JSONB column (for email tracking)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'emails_sent' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN emails_sent JSONB DEFAULT '{}';
    RAISE NOTICE 'Added emails_sent JSONB column';
  ELSE
    RAISE NOTICE 'emails_sent column already exists';
  END IF;
END $$;

-- Add status column with proper constraint
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'status' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
    ALTER TABLE orders ADD CONSTRAINT orders_status_check 
      CHECK (status IN ('pending', 'confirmed', 'production', 'shipped', 'delivered', 'cancelled'));
    RAISE NOTICE 'Added status column with constraint';
  ELSE
    RAISE NOTICE 'status column already exists';
  END IF;
END $$;

-- Add estimated_delivery column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'estimated_delivery' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN estimated_delivery VARCHAR(50);
    RAISE NOTICE 'Added estimated_delivery column';
  ELSE
    RAISE NOTICE 'estimated_delivery column already exists';
  END IF;
END $$;

-- Add tracking_number column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'tracking_number' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(100);
    RAISE NOTICE 'Added tracking_number column';
  ELSE
    RAISE NOTICE 'tracking_number column already exists';
  END IF;
END $$;

-- Add tracking_url column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'tracking_url' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_url TEXT;
    RAISE NOTICE 'Added tracking_url column';
  ELSE
    RAISE NOTICE 'tracking_url column already exists';
  END IF;
END $$;

-- Add proof_images array column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'proof_images' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN proof_images TEXT[];
    RAISE NOTICE 'Added proof_images array column';
  ELSE
    RAISE NOTICE 'proof_images column already exists';
  END IF;
END $$;

-- Add notes column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'notes' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN notes TEXT;
    RAISE NOTICE 'Added notes column';
  ELSE
    RAISE NOTICE 'notes column already exists';
  END IF;
END $$;

-- Add created_at and updated_at if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'created_at' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
    RAISE NOTICE 'Added created_at column';
  ELSE
    RAISE NOTICE 'created_at column already exists';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'updated_at' AND table_schema = 'public'
  ) THEN
    ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
    RAISE NOTICE 'Added updated_at column';
  ELSE
    RAISE NOTICE 'updated_at column already exists';
  END IF;
END $$;

-- Create essential indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at (will replace if it exists)
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Now create the other missing tables
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

CREATE TABLE IF NOT EXISTS email_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS mobile_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mobile VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps(email);
CREATE INDEX IF NOT EXISTS idx_email_otps_expires_at ON email_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_mobile ON mobile_otps(mobile);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_expires_at ON mobile_otps(expires_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for our integration
DO $$
BEGIN
    -- Allow anonymous access to OTPs (needed for verification)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_otps' AND policyname = 'Allow anonymous access to email OTPs') THEN
        EXECUTE 'CREATE POLICY "Allow anonymous access to email OTPs" ON email_otps FOR ALL USING (true)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mobile_otps' AND policyname = 'Allow anonymous access to mobile OTPs') THEN
        EXECUTE 'CREATE POLICY "Allow anonymous access to mobile OTPs" ON mobile_otps FOR ALL USING (true)';
    END IF;
    
    -- Allow anonymous order creation (for checkout)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Allow anonymous order creation') THEN
        EXECUTE 'CREATE POLICY "Allow anonymous order creation" ON orders FOR INSERT WITH CHECK (true)';
    END IF;
    
    -- Allow service role to manage all data
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Service role can manage all orders') THEN  
        EXECUTE 'CREATE POLICY "Service role can manage all orders" ON orders FOR ALL USING (auth.jwt() ->> ''role'' = ''service_role'')';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Some policies already exist or could not be created: %', SQLERRM;
END $$;

-- Final verification - show the updated orders table structure
SELECT 'Orders table has been updated! Here are all columns:' as message;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '✅ Database fix completed successfully!' as result;