import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";
import { mergeAndFormatProjectForSupabase, formatProjectForSupabase } from "./api.projects.index";

export const Route = createFileRoute("/api/projects/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { id } = params as { id: string };
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
          let query = (supabaseAdmin as any).from("projects").select("*");
          if (isUuid) {
            query = query.eq("id", id);
          } else {
            query = query.eq("slug", id);
          }
          const { data, error } = await query.maybeSingle();
          if (error || !data) {
            return new Response(JSON.stringify({ error: "Project not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify({ project: data }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        } catch (err) {
          console.error("[API GET /api/projects/$id] Error:", err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      PUT: async ({ request, params }) => {
        try {
          const body = await request.json();
          const { project } = body as { project: any };
          const { id } = params as { id: string };

          // Check for admin session cookie
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            console.warn(`[API PUT /api/projects/${id}] Unauthorized attempt`);
            return new Response(JSON.stringify({ error: "Unauthorized. Please login again." }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!project) {
            return new Response(JSON.stringify({ error: "Project payload is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

          // 1. Check if row exists in database by UUID or slug
          let existingRow: any = null;
          if (isUuid) {
            const { data } = await (supabaseAdmin as any)
              .from("projects")
              .select("*")
              .eq("id", id)
              .maybeSingle();
            existingRow = data;
          }

          if (!existingRow && (project.slug || id)) {
            const targetSlug = project.slug || id;
            const { data } = await (supabaseAdmin as any)
              .from("projects")
              .select("*")
              .eq("slug", targetSlug)
              .maybeSingle();
            existingRow = data;
          }

          // 2. Merge existing data with incoming updates to ensure no fields are lost
          const supabaseProject = mergeAndFormatProjectForSupabase(project, existingRow);

          let savedProject: any = null;

          if (existingRow) {
            // Update existing row
            const { data: updated, error: updateErr } = await (supabaseAdmin as any)
              .from("projects")
              .update(supabaseProject)
              .eq("id", existingRow.id)
              .select()
              .single();

            if (updateErr || !updated) {
              console.error(`[API PUT /api/projects/${id}] Update error:`, updateErr);
              return new Response(JSON.stringify({ error: updateErr?.message || "Failed to update project in database" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              });
            }
            savedProject = updated;
          } else {
            // If row does not exist yet (e.g. newly saving a default project), insert it
            const { data: inserted, error: insertErr } = await (supabaseAdmin as any)
              .from("projects")
              .insert(supabaseProject)
              .select()
              .single();

            if (insertErr || !inserted) {
              console.error(`[API PUT /api/projects/${id}] Insert error:`, insertErr);
              return new Response(JSON.stringify({ error: insertErr?.message || "Failed to persist project in database" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              });
            }
            savedProject = inserted;
          }

          return new Response(JSON.stringify({ project: savedProject }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        } catch (err) {
          console.error("[API PUT /api/projects/$id] Unexpected error:", err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const { id } = params as { id: string };

          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
          let deleteQuery = (supabaseAdmin as any).from("projects").delete();

          if (isUuid) {
            deleteQuery = deleteQuery.eq("id", id);
          } else {
            deleteQuery = deleteQuery.eq("slug", id);
          }

          const { error } = await deleteQuery;

          if (error) {
            console.error("Error deleting project:", error);
            return new Response(JSON.stringify({ error: error.message || "Failed to delete project" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        } catch (err) {
          console.error("[API DELETE /api/projects/$id] Error:", err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
