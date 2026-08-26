-- Add emotional storytelling fields to projects table
-- These fields are optional and enhance the cinematic presentation

ALTER TABLE projects ADD COLUMN IF NOT EXISTS emotional_descriptor TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS what_i_felt TEXT;

-- Add comments to document the purpose
COMMENT ON COLUMN projects.emotional_descriptor IS 'Short emotional tagline for project listings (e.g., "A story about letting go.")';
COMMENT ON COLUMN projects.what_i_felt IS 'Personal creative note about the project for Behind the Frame section';
