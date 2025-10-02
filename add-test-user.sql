-- Add test user cmd@hopehospital.com to custom users table
-- Password: test123456
-- Bcrypt hash generated with saltRounds=10

INSERT INTO users (
  email,
  first_name,
  last_name,
  phone_number,
  password_hash,
  role,
  email_verified,
  mobile_verified
)
VALUES (
  'cmd@hopehospital.com',
  'CMD',
  'User',
  '+919373111709',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password: test123456
  'user',
  true,
  false
)
ON CONFLICT (email)
DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  phone_number = EXCLUDED.phone_number,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email_verified = EXCLUDED.email_verified;

-- Also ensure admin user exists with proper hash
INSERT INTO users (
  email,
  first_name,
  last_name,
  password_hash,
  role,
  email_verified,
  mobile_verified
)
VALUES (
  'admin@linkist.com',
  'Admin',
  'User',
  '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', -- Password: admin123456
  'admin',
  true,
  true
)
ON CONFLICT (email)
DO UPDATE SET
  password_hash = EXCLUDED.password_hash;

-- Verify the users
SELECT
  email,
  first_name,
  last_name,
  role,
  email_verified,
  mobile_verified,
  CASE
    WHEN password_hash LIKE '$2a$%' THEN 'Bcrypt hashed ✓'
    ELSE 'Plain text (INSECURE)'
  END as password_status
FROM users
WHERE email IN ('cmd@hopehospital.com', 'admin@linkist.com')
ORDER BY email;
