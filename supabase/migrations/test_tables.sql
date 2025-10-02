-- Test query to verify all tables are created and show their structure

-- 1. Check if all tables exist
SELECT
  table_name,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles',
    'profile_experience',
    'profile_education',
    'profile_analytics',
    'profile_link_clicks',
    'profile_media',
    'profile_templates'
  )
GROUP BY table_name
ORDER BY table_name;

-- 2. Show profiles table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check foreign key relationships
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 4. Count rows in each table
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'profile_experience', COUNT(*) FROM profile_experience
UNION ALL
SELECT 'profile_education', COUNT(*) FROM profile_education
UNION ALL
SELECT 'profile_analytics', COUNT(*) FROM profile_analytics
UNION ALL
SELECT 'profile_link_clicks', COUNT(*) FROM profile_link_clicks
UNION ALL
SELECT 'profile_media', COUNT(*) FROM profile_media
UNION ALL
SELECT 'profile_templates', COUNT(*) FROM profile_templates
ORDER BY table_name;

-- 5. Check if templates were inserted
SELECT id, name, category, is_popular
FROM profile_templates
ORDER BY is_popular DESC, name;