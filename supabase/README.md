# Supabase Database Setup

This directory contains SQL migrations for setting up the Supabase database tables required for the Linkist profile management system.

## Tables Created

### 1. **profiles**
Main table for storing user digital profiles including:
- Basic information (name, bio, contact details)
- Professional information (company, position, skills)
- Social links (stored as JSONB)
- Media URLs (profile image, cover image, gallery)
- Settings (visibility, theme, permissions)

### 2. **profile_experience**
Stores work experience entries for each profile:
- Company name and position
- Start/end dates
- Description
- Display order

### 3. **profile_education**
Stores education history:
- Institution and degree
- Field of study
- Graduation year
- Display order

### 4. **profile_analytics**
Tracks all profile interactions:
- Views, clicks, shares, contacts
- Visitor information (IP, device, browser, location)
- Referrer and metadata

### 5. **profile_link_clicks**
Specific tracking for link clicks within profiles:
- Link type and URL
- Visitor tracking
- Timestamp

### 6. **profile_media**
Media file management:
- File metadata (name, URL, type, size)
- Organization by folders
- User association

### 7. **profile_templates**
Pre-defined profile templates:
- Template configurations
- Categories and popularity
- Default templates included

## How to Apply Migrations

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. **First**, copy and run the contents of `migrations/create_profiles_tables_fixed.sql`
6. Click **Run** to execute
7. **Then**, copy and run the contents of `migrations/add_rls_policies.sql`
8. Click **Run** to execute

### Option 2: Using Supabase CLI

1. Install Supabase CLI if not already installed:
```bash
npm install -g supabase
```

2. Link to your project:
```bash
supabase link --project-ref your-project-ref
```

3. Run the migration:
```bash
supabase db push
```

### Option 3: Direct Connection

If you have direct database access:

```bash
psql -h your-db-host -U postgres -d postgres < migrations/create_profiles_tables.sql
```

## Environment Variables Required

Make sure these are set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (optional, for server-side operations)
```

## Row Level Security (RLS)

The migrations include RLS policies that ensure:
- Users can only modify their own profiles
- Public profiles are viewable by anyone
- Analytics data is only viewable by profile owners
- Media files follow profile visibility settings

## Important Notes

1. **Auth Dependency**: The RLS policies use `auth.email()` function which requires Supabase Auth to be configured
2. **Existing Data**: The migrations use `IF NOT EXISTS` clauses, so they're safe to run multiple times
3. **Templates**: Default profile templates are inserted automatically
4. **Indexes**: Appropriate indexes are created for optimal query performance

## Verifying the Setup

After running the migration, verify in Supabase Dashboard:

1. Go to **Table Editor**
2. Check that all tables are created
3. Verify RLS is enabled (shield icon should be active)
4. Check that default templates are inserted

## Troubleshooting

If you encounter errors:

1. **Permission Denied**: Make sure you're using the service role key for admin operations
2. **Function not found**: Ensure Supabase Auth is enabled in your project
3. **Table already exists**: The migrations are idempotent, but you may need to drop tables first if schema has changed

## Next Steps

After setting up the database:

1. Update your API routes to use the new tables
2. Test profile creation and retrieval
3. Verify analytics tracking is working
4. Check media upload functionality

For more information, see the [Supabase Documentation](https://supabase.com/docs).