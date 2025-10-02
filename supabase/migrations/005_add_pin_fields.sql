-- Add PIN fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS pin_hash TEXT,
ADD COLUMN IF NOT EXISTS pin_set_at TIMESTAMP WITH TIME ZONE;

-- Add comments for documentation
COMMENT ON COLUMN users.pin_hash IS 'Bcrypt hashed 6-digit PIN for checkout authorization';
COMMENT ON COLUMN users.pin_set_at IS 'Timestamp when PIN was last set/updated';

-- Create index on pin_set_at for analytics
CREATE INDEX IF NOT EXISTS idx_users_pin_set_at ON users(pin_set_at);
