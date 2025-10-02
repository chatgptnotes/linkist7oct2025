-- Create profiles table for storing user digital profiles
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  template TEXT,

  -- Basic Info
  first_name TEXT,
  last_name TEXT,
  title TEXT,
  bio TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  profile_image_url TEXT,

  -- Professional Info
  company TEXT,
  position TEXT,
  skills TEXT[], -- Array of skills

  -- Social Links (stored as JSONB)
  social_links JSONB DEFAULT '{}',

  -- Media
  cover_image_url TEXT,
  gallery_urls TEXT[], -- Array of image URLs
  document_urls TEXT[], -- Array of document URLs

  -- Settings
  visibility TEXT DEFAULT 'public', -- public, private, unlisted
  custom_url TEXT UNIQUE,
  theme TEXT DEFAULT 'light', -- light, dark, auto
  allow_contact BOOLEAN DEFAULT true,
  show_analytics BOOLEAN DEFAULT false,

  -- Metadata
  status TEXT DEFAULT 'active', -- active, draft, inactive
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_email ON profiles(user_email);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_visibility ON profiles(visibility);
CREATE INDEX IF NOT EXISTS idx_profiles_custom_url ON profiles(custom_url);

-- Create profile_experience table for work experience
CREATE TABLE IF NOT EXISTS profile_experience (
  id SERIAL PRIMARY KEY,
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  company TEXT,
  position TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  is_current BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_experience_profile_id ON profile_experience(profile_id);

-- Create profile_education table
CREATE TABLE IF NOT EXISTS profile_education (
  id SERIAL PRIMARY KEY,
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  institution TEXT,
  degree TEXT,
  field TEXT,
  graduation_year TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_education_profile_id ON profile_education(profile_id);

-- Create profile_analytics table for tracking views and interactions
CREATE TABLE IF NOT EXISTS profile_analytics (
  id SERIAL PRIMARY KEY,
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- view, click, share, contact
  visitor_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_analytics_profile_id ON profile_analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_analytics_event_type ON profile_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_profile_analytics_created_at ON profile_analytics(created_at);

-- Create profile_links table for tracking link clicks
CREATE TABLE IF NOT EXISTS profile_link_clicks (
  id SERIAL PRIMARY KEY,
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  link_type TEXT, -- social, website, email, phone, etc.
  link_url TEXT,
  visitor_id TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_link_clicks_profile_id ON profile_link_clicks(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_link_clicks_link_type ON profile_link_clicks(link_type);

-- Create profile_media table for storing media files
CREATE TABLE IF NOT EXISTS profile_media (
  id SERIAL PRIMARY KEY,
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT, -- image, document, video
  file_size BIGINT,
  mime_type TEXT,
  folder TEXT DEFAULT 'general',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_media_profile_id ON profile_media(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_media_user_email ON profile_media(user_email);
CREATE INDEX IF NOT EXISTS idx_profile_media_file_type ON profile_media(file_type);

-- Create profile_templates table
CREATE TABLE IF NOT EXISTS profile_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  thumbnail_url TEXT,
  is_popular BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default templates
INSERT INTO profile_templates (id, name, description, category, is_popular) VALUES
  ('professional', 'Professional', 'Perfect for business professionals and corporate networking', 'business', true),
  ('creative', 'Creative', 'Showcase your creative portfolio and artistic work', 'creative', false),
  ('developer', 'Developer', 'Display your coding projects and technical skills', 'tech', true),
  ('photographer', 'Photographer', 'Beautiful gallery layouts for your photography', 'creative', false),
  ('musician', 'Musician', 'Share your music and connect with fans', 'creative', false),
  ('influencer', 'Influencer', 'Perfect for social media personalities', 'social', true),
  ('minimal', 'Minimal', 'Clean and simple design for any purpose', 'general', false),
  ('custom', 'Custom', 'Start from scratch with a blank canvas', 'general', false)
ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();