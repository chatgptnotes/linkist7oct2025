# Voucher System Database Setup

## SQL Schema

Run this SQL in your Supabase SQL Editor to create the vouchers table:

```sql
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

-- Create indexes for better performance
CREATE INDEX idx_vouchers_code ON public.vouchers(code);
CREATE INDEX idx_vouchers_active ON public.vouchers(is_active);
CREATE INDEX idx_vouchers_valid_until ON public.vouchers(valid_until);

-- Enable Row Level Security (RLS)
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage vouchers
CREATE POLICY "Admins can manage vouchers" ON public.vouchers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vouchers_updated_at
  BEFORE UPDATE ON public.vouchers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample vouchers
INSERT INTO public.vouchers (code, description, discount_type, discount_value, usage_limit, valid_until, is_active)
VALUES
  ('FOUNDER50', 'Founder member 50% discount', 'percentage', 50, 100, NOW() + INTERVAL '1 year', true),
  ('WELCOME20', 'Welcome 20% discount for new customers', 'percentage', 20, 500, NOW() + INTERVAL '6 months', true),
  ('LINKIST10', 'Standard 10% discount', 'percentage', 10, NULL, NULL, true),
  ('EARLY100', 'Early adopter 100% discount', 'percentage', 100, 50, NOW() + INTERVAL '3 months', true);

-- Create voucher_usage tracking table (optional - for per-user tracking)
CREATE TABLE IF NOT EXISTS public.voucher_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voucher_id UUID NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
  user_id UUID,
  user_email VARCHAR(255),
  order_id UUID,
  discount_amount NUMERIC NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_voucher_usage_voucher_id ON public.voucher_usage(voucher_id);
CREATE INDEX idx_voucher_usage_user_email ON public.voucher_usage(user_email);
CREATE INDEX idx_voucher_usage_order_id ON public.voucher_usage(order_id);

-- Enable RLS for voucher_usage
ALTER TABLE public.voucher_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow voucher usage tracking" ON public.voucher_usage
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Verification

After running the SQL, verify the tables were created:

```sql
-- Check vouchers table
SELECT * FROM public.vouchers;

-- Check voucher_usage table
SELECT * FROM public.voucher_usage;
```

## Adding voucher_code to orders table

If your orders table doesn't have voucher tracking, add these columns:

```sql
-- Add voucher columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS voucher_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS voucher_discount NUMERIC DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_orders_voucher_code ON public.orders(voucher_code);
```
