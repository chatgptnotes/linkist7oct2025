# Supabase Database Setup Instructions

## Problem
Data was not being saved to Supabase because:
1. The `user_profiles` table had a different schema than what the API expected
2. No Row Level Security (RLS) policies were configured
3. Missing columns for profile data storage

## Solution

### Step 1: Run the SQL Setup Script

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **SQL Editor** in the left sidebar
4. Open the file `supabase-setup.sql` from this project
5. Copy the entire contents
6. Paste into the Supabase SQL Editor
7. Click **Run** (or press Ctrl/Cmd + Enter)

### Step 2: Verify the Setup

After running the SQL, verify everything is set up correctly:

#### Check if table was created:
```sql
select schemaname, tablename, tableowner
from pg_tables
where tablename = 'user_profiles';
```

Should return: `public | user_profiles | postgres`

#### Check if RLS is enabled:
```sql
select tablename, rowsecurity
from pg_tables
where tablename = 'user_profiles';
```

Should return: `user_profiles | true`

#### Check policies:
```sql
select * from pg_policies where tablename = 'user_profiles';
```

Should show 4 policies:
- Public profiles are viewable by everyone
- Users can insert their own profiles
- Users can update their own profiles
- Users can delete their own profiles

### Step 3: Test the Profile Builder

1. Go to http://localhost:3000/profiles/builder
2. Fill in the profile information
3. Click "Save Profile"
4. Check Supabase Table Editor to see the saved data

### Step 4: View Saved Data

1. In Supabase Dashboard, go to **Table Editor**
2. Select **user_profiles** table
3. You should see your profile data

## What Was Fixed

### API Routes (`/app/api/profiles/route.ts`)
- ✅ Proper error handling (no more silent failures)
- ✅ Returns actual Supabase errors for debugging
- ✅ Validates data was saved successfully
- ✅ Supports guest users and authenticated users

### Database Schema
- ✅ Updated `user_profiles` table with correct columns
- ✅ Added proper indexes for performance
- ✅ Set up RLS policies for security
- ✅ Created storage bucket for profile images

## Table Schema

The `user_profiles` table includes:
- Basic info: first_name, last_name, email, phone
- Professional: title, company, position, bio
- Customization: template, theme, custom_url
- Media: profile_image_url, cover_image_url, gallery_urls
- Social: social_links (JSONB)
- Settings: visibility, allow_contact, show_analytics
- Skills: skills (array)

## Notes

- The `user_profiles` table now contains all profile data including:
  - User-facing profile information (name, bio, social links)
  - CRM-related data (orders, spending, VIP status)
  - Professional details (company, position, skills)
- All profile data is stored in a single unified table
