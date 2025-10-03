-- Add new fields from Figma design to user_profiles table
-- Run this in Supabase SQL Editor if table already exists

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS job_title text,
ADD COLUMN IF NOT EXISTS current_role text,
ADD COLUMN IF NOT EXISTS company_website text,
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS sub_domain text,
ADD COLUMN IF NOT EXISTS professional_summary text;

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_profiles'
  AND column_name IN ('job_title', 'current_role', 'company_website', 'industry', 'sub_domain', 'professional_summary');
