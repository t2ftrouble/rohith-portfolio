import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";
import { defaultShowreel, type ShowreelData } from "@/lib/showreel";

const STORAGE_PATH = "config/showreel.json";

export const Route = createFileRoute("/api/showreel")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { data, error } = await supabaseAdmin.storage
            .from("portfolio-media")
            .download(STORAGE_PATH);

          if (error || !data) {
            return new Response(JSON.stringify(defaultShowreel), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const text = await data.text();
          const parsed = JSON.parse(text);
          const showreel: ShowreelData = {
            ...defaultShowreel,
            ...parsed,
          };

          return new Response(JSON.stringify(showreel), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=60, s-maxage=60",
            },
          });
        } catch (err) {
          console.error("[GET /api/showreel] Error:", err);
          return new Response(JSON.stringify(defaultShowreel), {
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
          const { showreel } = body as { showreel: Partial<ShowreelData> };

          if (!showreel) {
            return new Response(
              JSON.stringify({ error: "Missing showreel in request body" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          let currentShowreel = { ...defaultShowreel };
          try {
            const { data: currentData } = await supabaseAdmin.storage
              .from("portfolio-media")
              .download(STORAGE_PATH);
            if (currentData) {
              const text = await currentData.text();
              currentShowreel = { ...currentShowreel, ...JSON.parse(text) };
            }
          } catch {
            // Use defaults
          }

          const mergedPayload: ShowreelData = {
            ...currentShowreel,
            ...showreel,
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
            console.error("[PUT /api/showreel] Storage upload error:", uploadError);
            return new Response(
              JSON.stringify({
                error: `Failed to save showreel: ${uploadError.message}`,
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
              showreel: mergedPayload,
              message: "Showreel configuration updated successfully in Supabase",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Internal server error";
          console.error("[PUT /api/showreel] Server exception:", err);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
