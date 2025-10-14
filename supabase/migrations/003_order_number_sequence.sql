-- Migration: Add order number sequence for LFND-000001 format
-- Date: 2025-10-13
-- Purpose: Create a sequence for generating sequential order numbers with LFND-XXXXXX format

-- Create a sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1;

-- Create a function to generate order numbers in LFND-000001 format
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_val INTEGER;
  order_num TEXT;
BEGIN
  -- Get the next sequence value
  next_val := nextval('order_number_seq');

  -- Format as LFND-000001 (6 digits with leading zeros)
  order_num := 'LFND-' || LPAD(next_val::TEXT, 6, '0');

  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Comment on the sequence
COMMENT ON SEQUENCE order_number_seq IS 'Sequence for generating LFND order numbers';

-- Comment on the function
COMMENT ON FUNCTION generate_order_number() IS 'Generates order numbers in format LFND-000001';

-- Optional: Set the sequence to start from existing order count + 1
-- This ensures new orders don't conflict with existing ones
DO $$
DECLARE
  max_order_count INTEGER;
BEGIN
  -- Count existing orders
  SELECT COUNT(*) INTO max_order_count FROM orders;

  -- Set sequence to start from next number
  IF max_order_count > 0 THEN
    PERFORM setval('order_number_seq', max_order_count + 1, false);
  END IF;
END $$;
