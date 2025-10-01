-- Migration: Update order prefix from NFC- to LNK-
-- Date: 2025-10-01
-- Purpose: Change all existing order numbers from NFC- prefix to LNK- prefix

-- Update all orders that start with NFC- to LNK-
UPDATE orders
SET order_number = REPLACE(order_number, 'NFC-', 'LNK-')
WHERE order_number LIKE 'NFC-%';

-- Verify the update
SELECT
  COUNT(*) as total_orders,
  COUNT(CASE WHEN order_number LIKE 'LNK-%' THEN 1 END) as lnk_orders,
  COUNT(CASE WHEN order_number LIKE 'NFC-%' THEN 1 END) as nfc_orders
FROM orders;

-- Log the migration
COMMENT ON TABLE orders IS 'Order prefix updated from NFC- to LNK- on 2025-10-01';
