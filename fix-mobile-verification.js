// Script to create missing OTP tables in Supabase
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://nyjduzifuibyowibhsjg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55amR1emlmdWlieW93aWJoc2pnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk0MTY0MywiZXhwIjoyMDcyNTE3NjQzfQ.1K6Ny2ZtNhXf_gQItroghc_-7j4xdxncCAGZqWHHNE0';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// SQL to create missing tables
const createTablesSQL = `
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create email_otps table only if it doesn't exist
CREATE TABLE IF NOT EXISTS email_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create mobile_otps table only if it doesn't exist
CREATE TABLE IF NOT EXISTS mobile_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mobile VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create users table only if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  email_verified BOOLEAN DEFAULT FALSE,
  mobile_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create gdpr_consents table only if it doesn't exist
CREATE TABLE IF NOT EXISTS gdpr_consents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  consents JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps(email);
CREATE INDEX IF NOT EXISTS idx_email_otps_expires_at ON email_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_mobile ON mobile_otps(mobile);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_expires_at ON mobile_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_gdpr_consents_email ON gdpr_consents(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$
BEGIN
    -- Email OTPs policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_otps' AND policyname = 'Allow anonymous access to email OTPs') THEN
        EXECUTE 'CREATE POLICY "Allow anonymous access to email OTPs" ON email_otps FOR ALL USING (true)';
    END IF;
    
    -- Mobile OTPs policies  
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mobile_otps' AND policyname = 'Allow anonymous access to mobile OTPs') THEN
        EXECUTE 'CREATE POLICY "Allow anonymous access to mobile OTPs" ON mobile_otps FOR ALL USING (true)';
    END IF;
    
    -- Users policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own data') THEN
        EXECUTE 'CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> ''email'' = email)';
    END IF;
    
    -- Service role policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Service role can manage all users') THEN
        EXECUTE 'CREATE POLICY "Service role can manage all users" ON users FOR ALL USING (auth.jwt() ->> ''role'' = ''service_role'')';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_otps' AND policyname = 'Service role can manage all email OTPs') THEN
        EXECUTE 'CREATE POLICY "Service role can manage all email OTPs" ON email_otps FOR ALL USING (auth.jwt() ->> ''role'' = ''service_role'')';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mobile_otps' AND policyname = 'Service role can manage all mobile OTPs') THEN
        EXECUTE 'CREATE POLICY "Service role can manage all mobile OTPs" ON mobile_otps FOR ALL USING (auth.jwt() ->> ''role'' = ''service_role'')';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Some policies could not be created: %', SQLERRM;
END $$;
`;

async function createTables() {
  try {
    console.log('🔧 Creating missing OTP tables in Supabase...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    
    if (error) {
      console.error('❌ Error creating tables:', error);
      return;
    }
    
    console.log('✅ Tables created successfully!');
    console.log('📱 Mobile phone verification should now work!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
createTables();
