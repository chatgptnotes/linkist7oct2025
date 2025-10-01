-- Drop existing users table if it exists (be careful in production!)
DROP TABLE IF EXISTS users CASCADE;

-- Create users table for authentication
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  email_verified BOOLEAN DEFAULT false,
  mobile_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create index on role for filtering
CREATE INDEX idx_users_role ON users(role);

-- Add Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY users_select_own
  ON users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Policy: Users can update their own data
CREATE POLICY users_update_own
  ON users
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Policy: Service role can do everything (for API endpoints)
CREATE POLICY users_service_role_all
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a test admin user (password: admin123456)
-- WARNING: Change this password in production!
INSERT INTO users (email, first_name, last_name, password_hash, role, email_verified, mobile_verified)
VALUES (
  'admin@linkist.com',
  'Admin',
  'User',
  'admin123456', -- In production, this should be bcrypt hashed
  'admin',
  true,
  true
)
ON CONFLICT (email) DO NOTHING;

-- Insert a test regular user (password: user123456)
INSERT INTO users (email, first_name, last_name, password_hash, role)
VALUES (
  'test@linkist.com',
  'Test',
  'User',
  'user123456', -- In production, this should be bcrypt hashed
  'user'
)
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE users IS 'Stores user account information for authentication and authorization';
COMMENT ON COLUMN users.id IS 'Unique user identifier (UUID)';
COMMENT ON COLUMN users.email IS 'User email address (unique, used for login)';
COMMENT ON COLUMN users.first_name IS 'User first name';
COMMENT ON COLUMN users.last_name IS 'User last name';
COMMENT ON COLUMN users.phone_number IS 'User phone number (optional)';
COMMENT ON COLUMN users.password_hash IS 'Hashed password (should use bcrypt in production)';
COMMENT ON COLUMN users.role IS 'User role: user or admin';
COMMENT ON COLUMN users.email_verified IS 'Whether email has been verified';
COMMENT ON COLUMN users.mobile_verified IS 'Whether mobile number has been verified';
COMMENT ON COLUMN users.created_at IS 'Timestamp when user was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when user was last updated';
