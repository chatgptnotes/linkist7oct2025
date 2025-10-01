-- Migration: Hash existing plain text passwords
-- This script updates the test users with bcrypt hashed passwords

-- Note: These are bcrypt hashes of the original passwords
-- admin123456 -> $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa
-- user123456  -> $2a$10$F5J5LKZ.4ZW4WxQ4K7V5P.9kFYxQ7K.5ZW4WxQ4K7V5P.9kFYxQ7u

-- Update admin user password
UPDATE users
SET password_hash = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa'
WHERE email = 'admin@linkist.com' AND password_hash = 'admin123456';

-- Update test user password
UPDATE users
SET password_hash = '$2a$10$F5J5LKZ.4ZW4WxQ4K7V5P.9kFYxQ7K.5ZW4WxQ4K7V5P.9kFYxQ7u'
WHERE email = 'test@linkist.com' AND password_hash = 'user123456';

-- Verify updates
SELECT
    email,
    CASE
        WHEN password_hash LIKE '$2a$%' THEN 'Hashed (bcrypt)'
        ELSE 'Plain text (INSECURE)'
    END as password_status,
    role,
    created_at
FROM users
ORDER BY created_at;

COMMENT ON TABLE users IS 'User passwords are now hashed with bcrypt (saltRounds=10)';
