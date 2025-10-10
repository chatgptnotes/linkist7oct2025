-- ================================================
-- ADD FOREIGN KEY CONSTRAINTS TO VOUCHER_USAGE
-- ================================================

-- Add foreign key from voucher_usage.voucher_id to vouchers.id
ALTER TABLE public.voucher_usage
DROP CONSTRAINT IF EXISTS voucher_usage_voucher_id_fkey;

ALTER TABLE public.voucher_usage
ADD CONSTRAINT voucher_usage_voucher_id_fkey
FOREIGN KEY (voucher_id)
REFERENCES public.vouchers(id)
ON DELETE CASCADE;

-- Add foreign key from voucher_usage.user_id to users.id (if users table exists)
-- Comment out if users table doesn't exist
ALTER TABLE public.voucher_usage
DROP CONSTRAINT IF EXISTS voucher_usage_user_id_fkey;

ALTER TABLE public.voucher_usage
ADD CONSTRAINT voucher_usage_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON DELETE SET NULL;

-- Add foreign key from voucher_usage.order_id to orders.id (if orders table exists)
-- Comment out if orders table doesn't exist
ALTER TABLE public.voucher_usage
DROP CONSTRAINT IF EXISTS voucher_usage_order_id_fkey;

ALTER TABLE public.voucher_usage
ADD CONSTRAINT voucher_usage_order_id_fkey
FOREIGN KEY (order_id)
REFERENCES public.orders(id)
ON DELETE SET NULL;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Foreign key constraints added successfully!';
  RAISE NOTICE 'voucher_usage.voucher_id -> vouchers.id (ON DELETE CASCADE)';
  RAISE NOTICE 'voucher_usage.user_id -> users.id (ON DELETE SET NULL)';
  RAISE NOTICE 'voucher_usage.order_id -> orders.id (ON DELETE SET NULL)';
END $$;
