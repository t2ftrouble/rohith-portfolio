-- Migration: 006_create_project_comments.sql
-- Description: Create project_comments table for visitor film discussions and CMS moderation queue

CREATE TABLE IF NOT EXISTS public.project_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_slug TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT,
    user_avatar TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'HIDDEN', 'REJECTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_project_comments_slug_status ON public.project_comments(project_slug, status);
CREATE INDEX IF NOT EXISTS idx_project_comments_created_at ON public.project_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_comments_user_id ON public.project_comments(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Public visitors can view only APPROVED comments
CREATE POLICY "Public visitors can view approved comments"
    ON public.project_comments
    FOR SELECT
    USING (status = 'APPROVED');

-- RLS Policy 2: Authenticated users can insert their own comments with PENDING status
CREATE POLICY "Users can create comments"
    ON public.project_comments
    FOR INSERT
    WITH CHECK (status = 'PENDING');

-- RLS Policy 3: Users can update their own comments (resets to PENDING)
CREATE POLICY "Users can update own comments"
    ON public.project_comments
    FOR UPDATE
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true))
    WITH CHECK (status = 'PENDING');

-- RLS Policy 4: Users can delete their own comments
CREATE POLICY "Users can delete own comments"
    ON public.project_comments
    FOR DELETE
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- RLS Policy 5: Service Role has full administrative access (used by server route)
-- Note: Supabase service_role key automatically bypasses RLS
