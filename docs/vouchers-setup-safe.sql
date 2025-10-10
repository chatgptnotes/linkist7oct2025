-- ================================================
-- VOUCHER SYSTEM DATABASE SETUP (SAFE VERSION)
-- Handles existing tables gracefully
-- ================================================

-- Drop existing objects if needed (optional - uncomment if you want fresh start)
-- DROP TABLE IF EXISTS public.voucher_usage CASCADE;
-- DROP TABLE IF EXISTS public.vouchers CASCADE;

-- Create vouchers table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value >= 0),
  min_order_value NUMERIC DEFAULT 0 CHECK (min_order_value >= 0),
  max_discount_amount NUMERIC CHECK (max_discount_amount IS NULL OR max_discount_amount >= 0),
  usage_limit INTEGER CHECK (usage_limit IS NULL OR usage_limit > 0),
  used_count INTEGER DEFAULT 0 CHECK (used_count >= 0),
  user_limit INTEGER DEFAULT 1 CHECK (user_limit > 0),
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes (skip if exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vouchers_code') THEN
    CREATE INDEX idx_vouchers_code ON public.vouchers(code);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vouchers_active') THEN
    CREATE INDEX idx_vouchers_active ON public.vouchers(is_active);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vouchers_valid_until') THEN
    CREATE INDEX idx_vouchers_valid_until ON public.vouchers(valid_until);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Create policy (drop old one if exists)
DROP POLICY IF EXISTS "Admins can manage vouchers" ON public.vouchers;
CREATE POLICY "Admins can manage vouchers" ON public.vouchers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_vouchers_updated_at ON public.vouchers;
CREATE TRIGGER update_vouchers_updated_at
  BEFORE UPDATE ON public.vouchers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample vouchers (skip if already exists)
INSERT INTO public.vouchers (code, description, discount_type, discount_value, usage_limit, valid_until, is_active)
VALUES
  ('FOUNDER50', 'Founder member 50% discount', 'percentage', 50, 100, NOW() + INTERVAL '1 year', true),
  ('WELCOME20', 'Welcome 20% discount for new customers', 'percentage', 20, 500, NOW() + INTERVAL '6 months', true),
  ('LINKIST10', 'Standard 10% discount', 'percentage', 10, NULL, NULL, true),
  ('EARLY100', 'Early adopter 100% discount', 'percentage', 100, 50, NOW() + INTERVAL '3 months', true)
ON CONFLICT (code) DO NOTHING;

-- Create voucher_usage table
CREATE TABLE IF NOT EXISTS public.voucher_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voucher_id UUID NOT NULL,
  user_id UUID,
  user_email VARCHAR(255),
  order_id UUID,
  discount_amount NUMERIC NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints
DO $$
BEGIN
  -- Add foreign key to vouchers table
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'voucher_usage_voucher_id_fkey'
  ) THEN
    ALTER TABLE public.voucher_usage
    ADD CONSTRAINT voucher_usage_voucher_id_fkey
    FOREIGN KEY (voucher_id)
    REFERENCES public.vouchers(id)
    ON DELETE CASCADE;
  END IF;

  -- Add foreign key to users table (if exists)
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users' AND schemaname = 'public') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'voucher_usage_user_id_fkey'
    ) THEN
      ALTER TABLE public.voucher_usage
      ADD CONSTRAINT voucher_usage_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES public.users(id)
      ON DELETE SET NULL;
    END IF;
  END IF;

  -- Add foreign key to orders table (if exists)
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'orders' AND schemaname = 'public') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'voucher_usage_order_id_fkey'
    ) THEN
      ALTER TABLE public.voucher_usage
      ADD CONSTRAINT voucher_usage_order_id_fkey
      FOREIGN KEY (order_id)
      REFERENCES public.orders(id)
      ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- Create indexes for voucher_usage (skip if exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_voucher_usage_voucher_id') THEN
    CREATE INDEX idx_voucher_usage_voucher_id ON public.voucher_usage(voucher_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_voucher_usage_user_email') THEN
    CREATE INDEX idx_voucher_usage_user_email ON public.voucher_usage(user_email);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_voucher_usage_order_id') THEN
    CREATE INDEX idx_voucher_usage_order_id ON public.voucher_usage(order_id);
  END IF;
END $$;

-- Enable RLS for voucher_usage
ALTER TABLE public.voucher_usage ENABLE ROW LEVEL SECURITY;

-- Create policy
DROP POLICY IF EXISTS "Allow voucher usage tracking" ON public.voucher_usage;
CREATE POLICY "Allow voucher usage tracking" ON public.voucher_usage
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add voucher columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS voucher_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS voucher_discount NUMERIC DEFAULT 0;

-- Create index for orders voucher (skip if exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_voucher_code') THEN
    CREATE INDEX idx_orders_voucher_code ON public.orders(voucher_code);
  END IF;
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Voucher system setup complete!';
  RAISE NOTICE 'Tables created: vouchers, voucher_usage';
  RAISE NOTICE 'Sample vouchers added: FOUNDER50, WELCOME20, LINKIST10, EARLY100';
END $$;
