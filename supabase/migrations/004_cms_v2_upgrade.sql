-- Migration 004: CMS v2 Upgrade
-- Non-destructive additions to support all 24 CMS features

-- 1. Add new columns to projects table if they do not already exist
DO $$
BEGIN
  -- Image separation columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'hero_image') THEN
    ALTER TABLE projects ADD COLUMN hero_image TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'thumbnail_image') THEN
    ALTER TABLE projects ADD COLUMN thumbnail_image TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'featured_thumbnail') THEN
    ALTER TABLE projects ADD COLUMN featured_thumbnail TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'og_image') THEN
    ALTER TABLE projects ADD COLUMN og_image TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'image_alt') THEN
    ALTER TABLE projects ADD COLUMN image_alt TEXT;
  END IF;

  -- Story & Film specs
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'logline') THEN
    ALTER TABLE projects ADD COLUMN logline TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'synopsis') THEN
    ALTER TABLE projects ADD COLUMN synopsis TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'director_note') THEN
    ALTER TABLE projects ADD COLUMN director_note TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'duration') THEN
    ALTER TABLE projects ADD COLUMN duration TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'format_specs') THEN
    ALTER TABLE projects ADD COLUMN format_specs TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'tags') THEN
    ALTER TABLE projects ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;

  -- Structured media & content collections (JSONB)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'gallery_items') THEN
    ALTER TABLE projects ADD COLUMN gallery_items JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'before_after_pairs') THEN
    ALTER TABLE projects ADD COLUMN before_after_pairs JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'vfx_breakdowns') THEN
    ALTER TABLE projects ADD COLUMN vfx_breakdowns JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'team_credits') THEN
    ALTER TABLE projects ADD COLUMN team_credits JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'awards') THEN
    ALTER TABLE projects ADD COLUMN awards JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'project_links') THEN
    ALTER TABLE projects ADD COLUMN project_links JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'section_visibility') THEN
    ALTER TABLE projects ADD COLUMN section_visibility JSONB DEFAULT '{"hero":true,"story":true,"video":true,"gallery":true,"beforeAfter":true,"vfxBreakdown":true,"team":true,"credits":true,"awards":true,"links":true,"comments":true}'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'video_config') THEN
    ALTER TABLE projects ADD COLUMN video_config JSONB DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'seo_settings') THEN
    ALTER TABLE projects ADD COLUMN seo_settings JSONB DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'publish_status') THEN
    ALTER TABLE projects ADD COLUMN publish_status TEXT DEFAULT 'PUBLISHED';
  END IF;
END $$;

-- 2. Create comments table for Google Sign-in Project comments & Moderation
CREATE TABLE IF NOT EXISTS project_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'HIDDEN', 'REJECTED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for comments
CREATE INDEX IF NOT EXISTS idx_project_comments_slug ON project_comments(project_slug);
CREATE INDEX IF NOT EXISTS idx_project_comments_status ON project_comments(status);
CREATE INDEX IF NOT EXISTS idx_project_comments_user ON project_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_created ON project_comments(created_at DESC);

-- Enable RLS on comments
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

-- Public can read approved comments
DROP POLICY IF EXISTS "Public read approved comments" ON project_comments;
CREATE POLICY "Public read approved comments"
ON project_comments FOR SELECT
TO public
USING (status = 'APPROVED');

-- Write operations handled through secure server API
