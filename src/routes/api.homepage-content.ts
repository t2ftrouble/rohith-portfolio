import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";
import {
  defaultHomepageContent,
  type HomepageContentData,
} from "@/lib/homepage-content";

const STORAGE_PATH = "config/homepage-content.json";

export const Route = createFileRoute("/api/homepage-content")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { data, error } = await supabaseAdmin.storage
            .from("portfolio-media")
            .download(STORAGE_PATH);

          if (error || !data) {
            return new Response(JSON.stringify(defaultHomepageContent), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const text = await data.text();
          const parsed = JSON.parse(text);
          const content: HomepageContentData = {
            ...defaultHomepageContent,
            ...parsed,
          };

          return new Response(JSON.stringify(content), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=60, s-maxage=60",
            },
          });
        } catch (err) {
          console.error("[GET /api/homepage-content] Error:", err);
          return new Response(JSON.stringify(defaultHomepageContent), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      PUT: async ({ request }) => {
        try {
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (
            !adminSessionMatch ||
            !adminSessionMatch[1] ||
            !(await verifyAdminToken(adminSessionMatch[1]))
          ) {
            return new Response(
              JSON.stringify({ error: "Unauthorized. Please login as admin." }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const body = await request.json();
          const { homepageContent } = body as {
            homepageContent: Partial<HomepageContentData>;
          };

          if (!homepageContent) {
            return new Response(
              JSON.stringify({ error: "Missing homepageContent in request body" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Fetch current config to merge
          let currentContent = { ...defaultHomepageContent };
          try {
            const { data: currentData } = await supabaseAdmin.storage
              .from("portfolio-media")
              .download(STORAGE_PATH);
            if (currentData) {
              const text = await currentData.text();
              currentContent = { ...currentContent, ...JSON.parse(text) };
            }
          } catch {
            // Use defaults
          }

          const mergedPayload: HomepageContentData = {
            ...currentContent,
            ...homepageContent,
            updatedAt: new Date().toISOString(),
          };

          const jsonBlob = new Blob([JSON.stringify(mergedPayload, null, 2)], {
            type: "application/json",
          });

          const { error: uploadError } = await supabaseAdmin.storage
            .from("portfolio-media")
            .upload(STORAGE_PATH, jsonBlob, {
              upsert: true,
              contentType: "application/json",
            });

          if (uploadError) {
            console.error("[PUT /api/homepage-content] Storage upload error:", uploadError);
            return new Response(
              JSON.stringify({
                error: `Failed to save homepage content: ${uploadError.message}`,
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              homepageContent: mergedPayload,
              message: "Homepage content updated successfully in Supabase",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Internal server error";
          console.error("[PUT /api/homepage-content] Server exception:", err);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
