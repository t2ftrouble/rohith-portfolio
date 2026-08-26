import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";

function formatProjectForSupabase(project: any) {
  const supabaseProject: Record<string, any> = {};

  if (project.slug !== undefined) supabaseProject["slug"] = project.slug;
  if (project.number !== undefined) supabaseProject["number"] = project.number;
  if (project.title !== undefined) supabaseProject["title"] = project.title;
  if (project.type !== undefined) supabaseProject["type"] = project.type;
  if (project.role !== undefined) supabaseProject["role"] = project.role;
  if (project.category !== undefined) supabaseProject["category"] = project.category;
  if (project.description !== undefined) supabaseProject["description"] = project.description;
  if (project.visuals !== undefined) supabaseProject["visuals"] = project.visuals;
  if (project.image !== undefined) supabaseProject["image"] = project.image;

  if (project.process !== undefined) {
    supabaseProject["process"] = Array.isArray(project.process) ? project.process : [];
  }

  if (project.year !== undefined) supabaseProject["year"] = project.year || null;
  if (project.status !== undefined) supabaseProject["status"] = project.status || null;
  if (project.hasVideo !== undefined) supabaseProject["has_video"] = Boolean(project.hasVideo);
  if (project.videoId !== undefined) supabaseProject["video_id"] = project.videoId || null;
  if (project.posterImage !== undefined) supabaseProject["poster_image"] = project.posterImage || null;
  if (project.showBeforeAfter !== undefined) supabaseProject["show_before_after"] = Boolean(project.showBeforeAfter);
  if (project.beforeImage !== undefined) supabaseProject["before_image"] = project.beforeImage || null;
  if (project.afterImage !== undefined) supabaseProject["after_image"] = project.afterImage || null;
  if (project.fullCredits !== undefined) supabaseProject["full_credits"] = project.fullCredits || null;
  if (project.client !== undefined) supabaseProject["client"] = project.client || null;
  if (project.emotionalDescriptor !== undefined) supabaseProject["emotional_descriptor"] = project.emotionalDescriptor || null;
  if (project.whatIFelt !== undefined) supabaseProject["what_i_felt"] = project.whatIFelt || null;

  if (project.galleryImages !== undefined) {
    supabaseProject["gallery_images"] = Array.isArray(project.galleryImages) ? project.galleryImages : [];
  }

  return supabaseProject;
}

export const Route = createFileRoute("/api/projects/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { id } = params as { id: string };
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
          let query = supabaseAdmin.from('projects').select('*');
          if (isUuid) {
            query = query.eq('id', id);
          } else {
            query = query.eq('slug', id);
          }
          const { data, error } = await query.single();
          if (error || !data) {
            return new Response(JSON.stringify({ error: 'Project not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return new Response(JSON.stringify({ project: data }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=10, s-maxage=30'
            }
          });
        } catch (err) {
          console.error('[API GET /api/projects/$id] Error:', err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },

      PUT: async ({ request, params }) => {
        try {
          const body = await request.json();
          const { project } = body as { project: any };
          const { id } = params as { id: string };

          console.log(`[API PUT /api/projects/${id}] Received payload:`, project);

          // Check for admin session cookie
          const cookieHeader = request.headers.get('cookie');
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            console.warn(`[API PUT /api/projects/${id}] Unauthorized attempt`);
            return new Response(JSON.stringify({ error: 'Unauthorized. Please login again.' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const supabaseProject = formatProjectForSupabase(project);
          console.log(`[API PUT /api/projects/${id}] Transformed for Supabase:`, supabaseProject);

          const { data: updatedProject, error } = await (supabaseAdmin.from('projects') as any)
            .update(supabaseProject)
            .eq('id', id)
            .select()
            .single();

          if (error) {
            console.error(`[API PUT /api/projects/${id}] Supabase error:`, error);
            return new Response(JSON.stringify({ error: error.message || 'Failed to update project in database' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          console.log(`[API PUT /api/projects/${id}] Update successful for ${updatedProject?.slug}`);

          return new Response(JSON.stringify({ project: updatedProject }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          console.error('[API PUT /api/projects/$id] Unexpected error:', err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const { id } = params as { id: string };

          const cookieHeader = request.headers.get('cookie');
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
          
          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const { error } = await (supabaseAdmin.from('projects') as any)
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Error deleting project:', error);
            return new Response(JSON.stringify({ error: error.message || 'Failed to delete project' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          console.error('Unexpected error in DELETE /api/projects/$id:', err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    },
  },
});
