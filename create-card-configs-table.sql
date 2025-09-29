-- Add card_configs table to store configuration data
CREATE TABLE card_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  company VARCHAR(200) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20),
  website TEXT,
  linkedin VARCHAR(200),
  instagram VARCHAR(200),
  twitter VARCHAR(200),
  profile_image TEXT, -- Base64 or URL
  background_image TEXT, -- Base64 or URL
  quantity INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'ordered')),
  mobile_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for better performance
CREATE INDEX idx_card_configs_email ON card_configs(email);
CREATE INDEX idx_card_configs_status ON card_configs(status);
CREATE INDEX idx_card_configs_created_at ON card_configs(created_at DESC);

-- Add RLS policy for card configs
ALTER TABLE card_configs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to create card configs (for the form)
CREATE POLICY "Allow anonymous card config creation" ON card_configs
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own card configs by email
CREATE POLICY "Users can view their own card configs" ON card_configs
  FOR SELECT USING (email = auth.jwt() ->> 'email' OR true); -- Allow anonymous for now

-- Allow service role to manage all card configs
CREATE POLICY "Service role can manage all card configs" ON card_configs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Add trigger to update updated_at
CREATE TRIGGER update_card_configs_updated_at 
  BEFORE UPDATE ON card_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();