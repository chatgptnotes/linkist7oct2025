-- Add alternate_email and whatsapp columns to user_profiles table
-- Run this in Supabase SQL Editor if table already exists

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS alternate_email text,
ADD COLUMN IF NOT EXISTS whatsapp text;
