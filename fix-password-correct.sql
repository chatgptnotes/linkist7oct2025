-- Fix password for cmd@hopehospital.com (removing newline from previous update)
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
  LENGTH(password_hash) as hash_length,
  CASE
    WHEN password_hash = '$2b$10$vdCe1MBPqfxmNOzK3ZQGbeiedsUnhCY4CMvNlInm4gkSJlca0zjVi'
    THEN '✓ Correct hash'
    ELSE '✗ Incorrect hash'
  END as password_status
FROM users
WHERE email = 'cmd@hopehospital.com';
