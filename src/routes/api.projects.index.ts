import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";

function formatProjectForSupabase(project: any) {
  const supabaseProject: Record<string, any> = {
    slug: project.slug,
    number: project.number || "01",
    title: project.title,
    type: project.type || "Short Film",
    role: project.role || "Director",
    category: project.category || "FILMMAKING",
    description: project.description || "",
    visuals: project.visuals || "Film stills",
    image: project.image || "",
    process: Array.isArray(project.process) ? project.process : [],
    year: project.year || null,
    status: project.status || null,
    has_video: Boolean(project.hasVideo),
    video_id: project.videoId || null,
    poster_image: project.posterImage || null,
    show_before_after: Boolean(project.showBeforeAfter),
    before_image: project.beforeImage || null,
    after_image: project.afterImage || null,
    full_credits: project.fullCredits || null,
    client: project.client || null,
    emotional_descriptor: project.emotionalDescriptor || null,
    what_i_felt: project.whatIFelt || null,
    gallery_images: Array.isArray(project.galleryImages) ? project.galleryImages : [],
    publish_status: project.publishStatus === "DRAFT" ? "DRAFT" : "PUBLISHED",
  };

  return supabaseProject;
}

export const Route = createFileRoute("/api/projects/")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Public read access - fetch from Supabase using server client
          const { data, error } = await supabaseAdmin
            .from('projects')
            .select('*')
            .order('number', { ascending: true });

          if (error) {
            console.error('Error fetching projects from Supabase:', error);
            return new Response(JSON.stringify({ error: error.message || 'Failed to fetch projects' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          return new Response(JSON.stringify({ projects: data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          console.error('Unexpected error in GET /api/projects:', err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
      
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { project } = body as { project: any };

          console.log('[API POST /api/projects] Received data:', project);

          // Check for admin session cookie
          const cookieHeader = request.headers.get('cookie');
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: 'Unauthorized. Please login again.' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const supabaseProject = formatProjectForSupabase(project);
          console.log('[API POST /api/projects] Transformed for Supabase:', supabaseProject);

          const { data: newProject, error } = await (supabaseAdmin.from('projects') as any)
            .insert(supabaseProject)
            .select()
            .single();

          if (error) {
            console.error('[API POST /api/projects] Error creating project:', error);
            return new Response(JSON.stringify({ error: error.message || 'Failed to create project' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          console.log('[API POST /api/projects] Create successful:', newProject);

          return new Response(JSON.stringify({ project: newProject }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          console.error('Unexpected error in POST /api/projects:', err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    },
  },
});
