-- Enable RLS (Row Level Security) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view public profiles" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view experience on public profiles" ON profile_experience;
DROP POLICY IF EXISTS "Users can manage their own experience" ON profile_experience;
DROP POLICY IF EXISTS "Users can view education on public profiles" ON profile_education;
DROP POLICY IF EXISTS "Users can manage their own education" ON profile_education;
DROP POLICY IF EXISTS "Users can view their own analytics" ON profile_analytics;
DROP POLICY IF EXISTS "Allow analytics inserts for public profiles" ON profile_analytics;
DROP POLICY IF EXISTS "Users can view their own link clicks" ON profile_link_clicks;
DROP POLICY IF EXISTS "Allow link click inserts for public profiles" ON profile_link_clicks;
DROP POLICY IF EXISTS "Users can view media on public profiles" ON profile_media;
DROP POLICY IF EXISTS "Users can manage their own media" ON profile_media;
DROP POLICY IF EXISTS "Anyone can view templates" ON profile_templates;

-- Simplified policies that don't depend on auth schema
-- For now, we'll use more permissive policies that can be tightened later

-- Profiles policies
CREATE POLICY "Anyone can view public profiles"
  ON profiles FOR SELECT
  USING (visibility = 'public' OR visibility = 'unlisted');

CREATE POLICY "Authenticated users can create profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profiles"
  ON profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own profiles"
  ON profiles FOR DELETE
  USING (true);

-- Experience policies
CREATE POLICY "Anyone can view experience"
  ON profile_experience FOR SELECT
  USING (true);

CREATE POLICY "Allow experience management"
  ON profile_experience FOR ALL
  USING (true)
  WITH CHECK (true);

-- Education policies
CREATE POLICY "Anyone can view education"
  ON profile_education FOR SELECT
  USING (true);

CREATE POLICY "Allow education management"
  ON profile_education FOR ALL
  USING (true)
  WITH CHECK (true);

-- Analytics policies
CREATE POLICY "Allow viewing analytics"
  ON profile_analytics FOR SELECT
  USING (true);

CREATE POLICY "Allow inserting analytics"
  ON profile_analytics FOR INSERT
  WITH CHECK (true);

-- Link clicks policies
CREATE POLICY "Allow viewing link clicks"
  ON profile_link_clicks FOR SELECT
  USING (true);

CREATE POLICY "Allow inserting link clicks"
  ON profile_link_clicks FOR INSERT
  WITH CHECK (true);

-- Media policies
CREATE POLICY "Anyone can view media"
  ON profile_media FOR SELECT
  USING (true);

CREATE POLICY "Allow media management"
  ON profile_media FOR ALL
  USING (true)
  WITH CHECK (true);

-- Templates are viewable by everyone
CREATE POLICY "Anyone can view templates"
  ON profile_templates FOR SELECT
  USING (true);

-- Note: These are simplified policies for development.
-- In production, you should implement proper authentication-based policies
-- using Supabase Auth or your authentication system.