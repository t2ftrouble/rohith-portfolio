# Supabase Setup Guide

## Step 1: Get Service Role Key

1. Go to: https://supabase.com/dashboard/project/dayxdgaupyhqygzqtuxf/settings/api
2. Scroll down to "Project API keys"
3. Copy the "service_role" secret key (NOT the anon/public key)
4. Paste it into your `.env` file as `SUPABASE_SERVICE_ROLE_KEY`
5. The line should look like: `SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`

## Step 2: Execute Database Migration

### Option A: Using Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/dayxdgaupyhqygzqtuxf/sql/new
2. Copy the contents of `supabase/migrations/001_create_projects_table.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the migration
5. Verify the following were created:
   - `projects` table with all columns
   - `admin_sessions` table for session storage
   - `cleanup_expired_sessions()` function

### Option B: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

## Step 3: Execute Storage Migration

### Option A: Using Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/dayxdgaupyhqygzqtuxf/sql/new
2. Copy the contents of `supabase/migrations/002_create_storage_bucket.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the migration
5. Verify the `portfolio-media` bucket was created successfully

### Option B: Using Supabase CLI

```bash
supabase db push
```

## Step 4: Verify Setup

1. Go to: https://supabase.com/dashboard/project/dayxdgaupyhqygzqtuxf/database/tables
2. Verify the `projects` table exists with all columns
3. Verify the `admin_sessions` table exists for session storage
4. Go to: https://supabase.com/dashboard/project/dayxdgaupyhqygzqtuxf/storage/buckets
5. Verify the `portfolio-media` bucket exists

## Step 5: Run Project Migration

After the database and storage are set up, run the migration script:

```bash
npx tsx scripts/migrate-projects.ts
```

This will populate the database with the existing 4 projects.

## Step 6: Upload Assets

The existing assets are currently using local paths. You have two options:

### Option A: Upload via Admin Panel (Recommended)

1. Start the development server: `npm run dev`
2. Go to: http://localhost:5173/admin
3. Login with your admin password
4. Edit each project and upload the images via the Admin form
5. This will upload images to Supabase Storage automatically

### Option B: Manual Upload

1. Go to: https://supabase.com/dashboard/project/dayxdgaupyhqygzqtuxf/storage/buckets/portfolio-media
2. Create folders: `covers/`, `posters/`, `vfx/`, `gallery/`
3. Upload your local assets to the appropriate folders
4. Update the project records with the new Supabase Storage URLs

## Step 7: Test the Application

1. Start the development server: `npm run dev`
2. Test admin login: http://localhost:5173/admin
3. Test public site: http://localhost:5173/
4. Test project CRUD operations
5. Test cross-browser persistence (see TESTING.md)

## Security Features Implemented

### Session Storage
- **Production-safe**: Sessions stored in Supabase `admin_sessions` table
- **Persists across server restarts**: ✅
- **Works with multiple instances**: ✅
- **Automatic cleanup**: Expired sessions removed

### Cookie Security
- **SameSite=Strict**: CSRF protection ✅
- **Secure flag**: Set automatically on HTTPS ✅
- **7-day expiration**: Configurable session duration
- **Server-side verification**: All admin operations verify session

### Authorization
- **Public visitors**: Read-only access via publishable key
- **Admin users**: Write via service role key + session verification
- **Generic auth users**: No write access (RLS policies removed)

## Troubleshooting

### Migration Fails

- Ensure you have the correct service role key
- Check that the Supabase project is active
- Verify your network connection

### Authentication Fails

- Verify ADMIN_PASSWORD is set correctly in .env
- Check that the admin session is being created in Supabase
- Look for console errors in the browser

### Upload Fails

- Verify the service role key has storage permissions
- Check that the bucket exists and is public
- Ensure file size is under 5MB
- Check file type is one of: JPG, PNG, WEBP
