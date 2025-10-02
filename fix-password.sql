-- Fix password for cmd@hopehospital.com
-- Correct bcrypt hash for password: test123456

UPDATE users
SET password_hash = '$2b$10$vdCe1MBPqfxmNOzK3ZQGbeiedsUnhCY4CMvNlInm4gkSJlca0zjVi'
WHERE email = 'cmd@hopehospital.com';

-- Verify the update
SELECT
  email,
  first_name,
  last_name,
  role,
  CASE
    WHEN password_hash LIKE '$2%' THEN '✓ Bcrypt hashed (correct)'
    ELSE '✗ Invalid hash'
  END as password_status
FROM users
WHERE email = 'cmd@hopehospital.com';
