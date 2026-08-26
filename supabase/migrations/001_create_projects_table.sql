-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  role TEXT NOT NULL,
  year TEXT,
  status TEXT,
  category TEXT NOT NULL CHECK (category IN ('FILMMAKING', 'VFX / CG', 'EDITING', 'DESIGN', 'CONTENT')),
  description TEXT NOT NULL,
  process TEXT[] NOT NULL,
  visuals TEXT NOT NULL,
  image TEXT NOT NULL,
  poster_image TEXT,
  has_video BOOLEAN DEFAULT false,
  video_id TEXT,
  show_before_after BOOLEAN DEFAULT false,
  before_image TEXT,
  after_image TEXT,
  full_credits TEXT,
  gallery_images TEXT[],
  client TEXT,
  emotional_descriptor TEXT,
  what_i_felt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access for projects
CREATE POLICY "Public read access for projects"
ON projects FOR SELECT
TO public
USING (true);

-- IMPORTANT: No INSERT/UPDATE/DELETE policies for authenticated users
-- All write operations are handled server-side using service role key
-- with admin session verification in the application layer
-- This ensures only verified admin sessions can perform writes

-- Create admin_sessions table for production-safe session storage
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on token for fast lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Clean up expired sessions periodically
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ language 'plpgsql';
