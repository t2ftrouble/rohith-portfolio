-- Create portfolio-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for portfolio-media
CREATE POLICY IF NOT EXISTS "Public read access for portfolio-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-media');

-- IMPORTANT: No INSERT/UPDATE/DELETE policies for authenticated users
-- All write operations are handled server-side using service role key
-- with admin session verification in the application layer
-- This ensures only verified admin sessions can perform writes
