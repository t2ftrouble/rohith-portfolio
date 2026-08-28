import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";

export const Route = createFileRoute("/api/comments")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const projectSlug = url.searchParams.get("projectSlug");
          const all = url.searchParams.get("all") === "true";

          // Admin check if querying all (including unapproved)
          if (all) {
            const cookieHeader = request.headers.get("cookie");
            const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
            if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
              return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
              });
            }

            let query = (supabaseAdmin.from("project_comments") as any).select("*").order("created_at", { ascending: false });
            if (projectSlug) {
              query = query.eq("project_slug", projectSlug);
            }
            const { data, error } = await query;
            if (error) {
              return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
            return new Response(JSON.stringify({ comments: data || [] }), { status: 200, headers: { "Content-Type": "application/json" } });
          }

          // Public request: only return APPROVED comments for project
          if (!projectSlug) {
            return new Response(JSON.stringify({ comments: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
          }

          const { data, error } = await (supabaseAdmin.from("project_comments") as any)
            .select("*")
            .eq("project_slug", projectSlug)
            .eq("status", "APPROVED")
            .order("created_at", { ascending: false });

          if (error) {
            // If table doesn't exist yet, return empty list gracefully
            return new Response(JSON.stringify({ comments: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
          }

          return new Response(JSON.stringify({ comments: data || [] }), { status: 200, headers: { "Content-Type": "application/json" } });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message, comments: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
      },

      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { projectSlug, userId, userName, userEmail, userAvatar, content } = body;

          if (!projectSlug || !userId || !userName || !content) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const { data, error } = await (supabaseAdmin.from("project_comments") as any)
            .insert({
              project_slug: projectSlug,
              user_id: userId,
              user_name: userName,
              user_email: userEmail || "",
              user_avatar: userAvatar || null,
              content: content.slice(0, 1000),
              status: "PENDING", // Moderation required by default
            })
            .select()
            .single();

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true, comment: data }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      PUT: async ({ request }) => {
        try {
          const body = await request.json();
          const { id, userId, content, status } = body;

          // Check if admin is updating status
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
          const isAdmin = adminSessionMatch?.[1] && (await verifyAdminToken(adminSessionMatch[1]));

          if (status && isAdmin) {
            const { data, error } = await (supabaseAdmin.from("project_comments") as any)
              .update({ status })
              .eq("id", id)
              .select()
              .single();

            if (error) throw error;
            return new Response(JSON.stringify({ success: true, comment: data }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // User editing own comment
          if (!id || !userId || !content) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const { data, error } = await (supabaseAdmin.from("project_comments") as any)
            .update({ content: content.slice(0, 1000), status: "PENDING" })
            .eq("id", id)
            .eq("user_id", userId)
            .select()
            .single();

          if (error) throw error;
          return new Response(JSON.stringify({ success: true, comment: data }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      DELETE: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const id = url.searchParams.get("id");
          const userId = url.searchParams.get("userId");

          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
          const isAdmin = adminSessionMatch?.[1] && (await verifyAdminToken(adminSessionMatch[1]));

          if (!id) {
            return new Response(JSON.stringify({ error: "Missing ID" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          let query = (supabaseAdmin.from("project_comments") as any).delete().eq("id", id);
          if (!isAdmin) {
            if (!userId) {
              return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
              });
            }
            query = query.eq("user_id", userId);
          }

          const { error } = await query;
          if (error) throw error;

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
