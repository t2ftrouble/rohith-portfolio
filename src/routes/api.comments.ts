import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";

export interface ApiComment {
  id: string;
  projectSlug: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  content: string;
  status: "PENDING" | "APPROVED" | "HIDDEN" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  // snake_case aliases for backwards compatibility
  project_slug?: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  user_avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export function formatCommentForClient(row: any): ApiComment {
  const projectSlug = row.project_slug || row.projectSlug || "";
  const userId = row.user_id || row.userId || "";
  const userName = row.user_name || row.userName || "Film Viewer";
  const userEmail = row.user_email || row.userEmail || "";
  const userAvatar = row.user_avatar || row.userAvatar || undefined;
  const content = row.content || "";
  const status = (row.status || "PENDING") as "PENDING" | "APPROVED" | "HIDDEN" | "REJECTED";
  const createdAt = row.created_at || row.createdAt || new Date().toISOString();
  const updatedAt = row.updated_at || row.updatedAt || createdAt;

  return {
    id: row.id,
    projectSlug,
    userId,
    userName,
    userEmail,
    userAvatar,
    content,
    status,
    createdAt,
    updatedAt,
    // Provide both casings
    project_slug: projectSlug,
    user_id: userId,
    user_name: userName,
    user_email: userEmail,
    user_avatar: userAvatar,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

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
              return new Response(JSON.stringify({ error: "Unauthorized. Admin session required." }), {
                status: 401,
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-cache, no-store, must-revalidate",
                },
              });
            }

            let query = (supabaseAdmin.from("project_comments") as any)
              .select("*")
              .order("created_at", { ascending: false });

            if (projectSlug && projectSlug !== "all") {
              query = query.eq("project_slug", projectSlug);
            }

            const { data, error } = await query;
            if (error) {
              console.error("[API GET /api/comments?all=true] Database error:", error);
              return new Response(JSON.stringify({ error: error.message || "Database query failed" }), {
                status: 500,
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-cache, no-store, must-revalidate",
                },
              });
            }

            const formattedComments = (data || []).map(formatCommentForClient);
            return new Response(JSON.stringify({ comments: formattedComments }), {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
              },
            });
          }

          // Public request: only return APPROVED comments for project
          if (!projectSlug) {
            return new Response(JSON.stringify({ comments: [] }), {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
              },
            });
          }

          const { data, error } = await (supabaseAdmin.from("project_comments") as any)
            .select("*")
            .eq("project_slug", projectSlug)
            .eq("status", "APPROVED")
            .order("created_at", { ascending: false });

          if (error) {
            console.error(`[API GET /api/comments?projectSlug=${projectSlug}] Database error:`, error);
            return new Response(JSON.stringify({ error: error.message || "Failed to fetch comments", comments: [] }), {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
              },
            });
          }

          const formattedComments = (data || []).map(formatCommentForClient);
          return new Response(JSON.stringify({ comments: formattedComments }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        } catch (err: any) {
          console.error("[API GET /api/comments] Unexpected error:", err);
          return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        }
      },

      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const projectSlug = body.projectSlug || body.project_slug;
          const userId = body.userId || body.user_id;
          const userName = body.userName || body.user_name;
          const userEmail = body.userEmail || body.user_email || "";
          const userAvatar = body.userAvatar || body.user_avatar || null;
          const rawContent = (body.content || "").trim();

          if (!projectSlug || !userId || !userName || !rawContent) {
            return new Response(
              JSON.stringify({ error: "Missing required fields: projectSlug, userId, userName, content" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          if (rawContent.length > 1000) {
            return new Response(
              JSON.stringify({ error: "Comment is too long. Maximum allowed length is 1000 characters." }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const { data, error } = await (supabaseAdmin.from("project_comments") as any)
            .insert({
              project_slug: projectSlug,
              user_id: userId,
              user_name: userName.slice(0, 100),
              user_email: userEmail.slice(0, 150),
              user_avatar: userAvatar,
              content: rawContent,
              status: "PENDING", // Requires moderation approval
            })
            .select()
            .single();

          if (error) {
            console.error("[API POST /api/comments] Supabase insert error:", error);
            return new Response(JSON.stringify({ error: error.message || "Failed to insert comment in database" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const formatted = formatCommentForClient(data);
          return new Response(JSON.stringify({ success: true, comment: formatted }), {
            status: 201,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        } catch (err: any) {
          console.error("[API POST /api/comments] Unexpected error:", err);
          return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      PUT: async ({ request }) => {
        try {
          const body = await request.json();
          const { id, userId, content, status } = body;

          if (!id) {
            return new Response(JSON.stringify({ error: "Missing comment ID" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Check if admin is updating status
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
          const isAdmin = adminSessionMatch?.[1] && (await verifyAdminToken(adminSessionMatch[1]));

          if (status) {
            if (!isAdmin) {
              return new Response(JSON.stringify({ error: "Unauthorized. Admin session required to change status." }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
              });
            }

            const allowedStatuses = ["PENDING", "APPROVED", "HIDDEN", "REJECTED"];
            if (!allowedStatuses.includes(status)) {
              return new Response(JSON.stringify({ error: `Invalid status. Allowed: ${allowedStatuses.join(", ")}` }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            const { data, error } = await (supabaseAdmin.from("project_comments") as any)
              .update({ status, updated_at: new Date().toISOString() })
              .eq("id", id)
              .select()
              .single();

            if (error) {
              console.error(`[API PUT /api/comments] Admin status update error for ${id}:`, error);
              return new Response(JSON.stringify({ error: error.message || "Failed to update comment status" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              });
            }

            const formatted = formatCommentForClient(data);
            return new Response(JSON.stringify({ success: true, comment: formatted }), {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
              },
            });
          }

          // User editing own comment content
          if (!userId || !content || !content.trim()) {
            return new Response(JSON.stringify({ error: "Missing userId or content payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const trimmedContent = content.trim();
          if (trimmedContent.length > 1000) {
            return new Response(JSON.stringify({ error: "Comment text exceeds 1000 characters limit" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // When user edits comment, it resets to PENDING for moderation
          const { data, error } = await (supabaseAdmin.from("project_comments") as any)
            .update({
              content: trimmedContent,
              status: "PENDING",
              updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .eq("user_id", userId)
            .select()
            .single();

          if (error) {
            console.error(`[API PUT /api/comments] User edit error for ${id}:`, error);
            return new Response(JSON.stringify({ error: error.message || "Failed to update comment" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const formatted = formatCommentForClient(data);
          return new Response(JSON.stringify({ success: true, comment: formatted }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        } catch (err: any) {
          console.error("[API PUT /api/comments] Unexpected error:", err);
          return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      DELETE: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const id = url.searchParams.get("id");
          const userId = url.searchParams.get("userId") || url.searchParams.get("user_id");

          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
          const isAdmin = adminSessionMatch?.[1] && (await verifyAdminToken(adminSessionMatch[1]));

          if (!id) {
            return new Response(JSON.stringify({ error: "Missing comment ID" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          let query = (supabaseAdmin.from("project_comments") as any).delete().eq("id", id);

          if (!isAdmin) {
            if (!userId) {
              return new Response(
                JSON.stringify({ error: "Unauthorized. You must be an admin or the comment author." }),
                {
                  status: 401,
                  headers: { "Content-Type": "application/json" },
                }
              );
            }
            query = query.eq("user_id", userId);
          }

          const { error } = await query;
          if (error) {
            console.error(`[API DELETE /api/comments] Delete error for ${id}:`, error);
            return new Response(JSON.stringify({ error: error.message || "Failed to delete comment from database" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true, message: "Comment deleted successfully" }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        } catch (err: any) {
          console.error("[API DELETE /api/comments] Unexpected error:", err);
          return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
