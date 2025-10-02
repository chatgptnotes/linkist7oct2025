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
CREATE INDEX idx_profiles_user_email ON profiles(user_email);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_visibility ON profiles(visibility);
CREATE INDEX idx_profiles_custom_url ON profiles(custom_url);

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

CREATE INDEX idx_profile_experience_profile_id ON profile_experience(profile_id);

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

CREATE INDEX idx_profile_education_profile_id ON profile_education(profile_id);

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

CREATE INDEX idx_profile_analytics_profile_id ON profile_analytics(profile_id);
CREATE INDEX idx_profile_analytics_event_type ON profile_analytics(event_type);
CREATE INDEX idx_profile_analytics_created_at ON profile_analytics(created_at);

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

CREATE INDEX idx_profile_link_clicks_profile_id ON profile_link_clicks(profile_id);
CREATE INDEX idx_profile_link_clicks_link_type ON profile_link_clicks(link_type);

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

CREATE INDEX idx_profile_media_profile_id ON profile_media(profile_id);
CREATE INDEX idx_profile_media_user_email ON profile_media(user_email);
CREATE INDEX idx_profile_media_file_type ON profile_media(file_type);

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
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_media ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  USING (visibility = 'public' OR visibility = 'unlisted');

CREATE POLICY "Users can manage their own profiles"
  ON profiles FOR ALL
  USING (auth.email() = user_email)
  WITH CHECK (auth.email() = user_email);

-- Experience policies
CREATE POLICY "Users can view experience on public profiles"
  ON profile_experience FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = profile_experience.profile_id
    AND (profiles.visibility = 'public' OR profiles.visibility = 'unlisted')
  ));

CREATE POLICY "Users can manage their own experience"
  ON profile_experience FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = profile_experience.profile_id
    AND profiles.user_email = auth.email()
  ));

-- Education policies
CREATE POLICY "Users can view education on public profiles"
  ON profile_education FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = profile_education.profile_id
    AND (profiles.visibility = 'public' OR profiles.visibility = 'unlisted')
  ));

CREATE POLICY "Users can manage their own education"
  ON profile_education FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = profile_education.profile_id
    AND profiles.user_email = auth.email()
  ));

-- Analytics policies (profiles can view their own analytics)
CREATE POLICY "Users can view their own analytics"
  ON profile_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = profile_analytics.profile_id
    AND profiles.user_email = auth.email()
  ));

CREATE POLICY "Allow analytics inserts for public profiles"
  ON profile_analytics FOR INSERT
  WITH CHECK (true);

-- Link clicks policies
CREATE POLICY "Users can view their own link clicks"
  ON profile_link_clicks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = profile_link_clicks.profile_id
    AND profiles.user_email = auth.email()
  ));

CREATE POLICY "Allow link click inserts for public profiles"
  ON profile_link_clicks FOR INSERT
  WITH CHECK (true);

-- Media policies
CREATE POLICY "Users can view media on public profiles"
  ON profile_media FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = profile_media.profile_id
    AND (profiles.visibility = 'public' OR profiles.visibility = 'unlisted')
  ));

CREATE POLICY "Users can manage their own media"
  ON profile_media FOR ALL
  USING (user_email = auth.email())
  WITH CHECK (user_email = auth.email());

-- Templates are viewable by everyone
CREATE POLICY "Anyone can view templates"
  ON profile_templates FOR SELECT
  USING (true);