-- ============================================
-- Linkist Profile System - Supabase Setup
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- Drop existing table if it exists (WARNING: This will delete existing data!)
-- Comment out this line if you want to preserve existing data
drop table if exists public.user_profiles cascade;

-- Create user_profiles table with correct schema
create table public.user_profiles (
  id uuid not null default extensions.uuid_generate_v4(),
  user_email text not null,
  email text null,
  alternate_email text null,
  first_name text null,
  last_name text null,
  template text null,
  title text null,
  bio text null,
  phone text null,
  whatsapp text null,
  location text null,

  -- Professional Information (from Figma design)
  job_title text null,
  current_role text null,
  company text null,
  company_website text null,
  industry text null,
  sub_domain text null,
  professional_summary text null,

  -- Legacy professional fields
  position text null,
  skills text[] null default array[]::text[],
  social_links jsonb null default '{}'::jsonb,
  visibility text null default 'public',
  custom_url text null,
  theme text null default 'light',
  allow_contact boolean null default true,
  show_analytics boolean null default false,
  profile_image_url text null,
  cover_image_url text null,
  gallery_urls text[] null default array[]::text[],
  document_urls text[] null default array[]::text[],
  status text null default 'active',
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint user_profiles_pkey primary key (id),
  constraint user_profiles_custom_url_key unique (custom_url)
) tablespace pg_default;

-- Create trigger for updated_at
create trigger update_user_profiles_updated_at before update on user_profiles
for each row execute function update_updated_at_column();

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

-- RLS Policy: Public profiles viewable by everyone
create policy "Public profiles are viewable by everyone"
on user_profiles for select
using (visibility = 'public' or auth.uid()::text = user_email);

-- RLS Policy: Anyone can insert profiles (for guest mode)
create policy "Users can insert their own profiles"
on user_profiles for insert
with check (true);

-- RLS Policy: Users can update their own profiles
create policy "Users can update their own profiles"
on user_profiles for update
using (auth.uid()::text = user_email or user_email = 'guest@linkist.com');

-- RLS Policy: Users can delete their own profiles
create policy "Users can delete their own profiles"
on user_profiles for delete
using (auth.uid()::text = user_email);

-- Create index for faster lookups
create index user_profiles_user_email_idx on user_profiles(user_email);
create index user_profiles_custom_url_idx on user_profiles(custom_url);
create index user_profiles_status_idx on user_profiles(status);

-- ============================================
-- Storage bucket for profile images
-- ============================================

-- Create storage bucket (if not exists)
insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

-- Drop existing storage policies if they exist
drop policy if exists "Public can view profile images" on storage.objects;
drop policy if exists "Authenticated users can upload profile images" on storage.objects;
drop policy if exists "Users can update their own profile images" on storage.objects;
drop policy if exists "Users can delete their own profile images" on storage.objects;

-- Storage policy: Public can view images
create policy "Public can view profile images"
on storage.objects for select
to public
using (bucket_id = 'profile-images');

-- Storage policy: Authenticated users can upload
create policy "Authenticated users can upload profile images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'profile-images');

-- Storage policy: Users can update their own images
create policy "Users can update their own profile images"
on storage.objects for update
to authenticated
using (bucket_id = 'profile-images');

-- Storage policy: Users can delete their own images
create policy "Users can delete their own profile images"
on storage.objects for delete
to authenticated
using (bucket_id = 'profile-images');

-- ============================================
-- Verification
-- ============================================

-- Check if table was created
select
  schemaname,
  tablename,
  tableowner
from pg_tables
where tablename = 'user_profiles';

-- Check if RLS is enabled
select
  tablename,
  rowsecurity
from pg_tables
where tablename = 'user_profiles';

-- List all policies
select * from pg_policies where tablename = 'user_profiles';
