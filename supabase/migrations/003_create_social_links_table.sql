-- Migration: 003_create_social_links_table.sql
-- Description: Create social_links table for managing YouTube, Instagram, and LinkedIn channels

CREATE TABLE IF NOT EXISTS public.social_links (
  id TEXT PRIMARY KEY DEFAULT 'default',
  youtube TEXT,
  instagram TEXT,
  linkedin TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public read access for social_links"
  ON public.social_links
  FOR SELECT
  TO public
  USING (true);

-- Allow service role / admin full write access
CREATE POLICY "Service role full access for social_links"
  ON public.social_links
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert default row
INSERT INTO public.social_links (id, youtube, instagram, linkedin)
VALUES (
  'default',
  'https://www.youtube.com/@trouble_rohii',
  'https://www.instagram.com/trouble_rohii/',
  'https://www.linkedin.com/in/rohith-vijayaragavan-8b0996314/'
)
ON CONFLICT (id) DO NOTHING;
