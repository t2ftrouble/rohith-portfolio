-- Migration 005: Create Editing Projects and Videos CMS Tables
-- Supports full relational management of editing projects with multiple Google Drive videos, tools, thumbnails, and SEO

-- 1. Create editing_projects table
CREATE TABLE IF NOT EXISTS editing_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  project_number TEXT NOT NULL DEFAULT '01',
  category TEXT NOT NULL DEFAULT 'EDITING',
  client_name TEXT,
  year TEXT DEFAULT '2024',
  role TEXT NOT NULL DEFAULT 'Editor',
  description TEXT NOT NULL DEFAULT '',
  synopsis TEXT,
  logline TEXT,
  thumbnail_url TEXT,
  hero_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  editing_breakdown JSONB DEFAULT '[]'::jsonb,
  credits TEXT,
  status TEXT DEFAULT 'Completed',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  notice TEXT,
  section_visibility JSONB DEFAULT '{"hero":true,"story":true,"video":true,"gallery":true,"beforeAfter":false,"vfxBreakdown":false,"team":true,"credits":true,"awards":true,"links":true,"comments":true}'::jsonb,
  seo_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create editing_project_videos table (Relational 1-to-many relationship)
CREATE TABLE IF NOT EXISTS editing_project_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES editing_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_number TEXT NOT NULL DEFAULT 'Film 01',
  drive_url TEXT,
  drive_file_id TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  duration TEXT,
  published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for high performance
CREATE INDEX IF NOT EXISTS idx_editing_projects_slug ON editing_projects(slug);
CREATE INDEX IF NOT EXISTS idx_editing_projects_published ON editing_projects(published);
CREATE INDEX IF NOT EXISTS idx_editing_projects_display_order ON editing_projects(display_order);
CREATE INDEX IF NOT EXISTS idx_editing_project_videos_project_id ON editing_project_videos(project_id);
CREATE INDEX IF NOT EXISTS idx_editing_project_videos_display_order ON editing_project_videos(display_order);

-- 4. Create trigger for updated_at
DROP TRIGGER IF EXISTS update_editing_projects_updated_at ON editing_projects;
CREATE TRIGGER update_editing_projects_updated_at BEFORE UPDATE ON editing_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_editing_project_videos_updated_at ON editing_project_videos;
CREATE TRIGGER update_editing_project_videos_updated_at BEFORE UPDATE ON editing_project_videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE editing_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE editing_project_videos ENABLE ROW LEVEL SECURITY;

-- 6. Public read access policy for published projects and videos
DROP POLICY IF EXISTS "Public read access for published editing projects" ON editing_projects;
CREATE POLICY "Public read access for published editing projects"
ON editing_projects FOR SELECT
TO public
USING (published = true);

DROP POLICY IF EXISTS "Public read access for published editing project videos" ON editing_project_videos;
CREATE POLICY "Public read access for published editing project videos"
ON editing_project_videos FOR SELECT
TO public
USING (published = true);

-- Write operations handled through secure server-side API with admin session verification
