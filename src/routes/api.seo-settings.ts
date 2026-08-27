import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";
import { defaultSeoSettings, type SeoSettingsData } from "@/lib/seo-settings";

const STORAGE_PATH = "config/seo-settings.json";

export const Route = createFileRoute("/api/seo-settings")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { data, error } = await supabaseAdmin.storage
            .from("portfolio-media")
            .download(STORAGE_PATH);

          if (error || !data) {
            return new Response(JSON.stringify(defaultSeoSettings), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const text = await data.text();
          const parsed = JSON.parse(text);
          const settings: SeoSettingsData = {
            ...defaultSeoSettings,
            ...parsed,
          };

          return new Response(JSON.stringify(settings), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=60, s-maxage=60",
            },
          });
        } catch (err) {
          console.error("[GET /api/seo-settings] Error:", err);
          return new Response(JSON.stringify(defaultSeoSettings), {
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
          const { seoSettings } = body as { seoSettings: Partial<SeoSettingsData> };

          if (!seoSettings) {
            return new Response(
              JSON.stringify({ error: "Missing seoSettings in request body" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          let currentSettings = { ...defaultSeoSettings };
          try {
            const { data: currentData } = await supabaseAdmin.storage
              .from("portfolio-media")
              .download(STORAGE_PATH);
            if (currentData) {
              const text = await currentData.text();
              currentSettings = { ...currentSettings, ...JSON.parse(text) };
            }
          } catch {
            // Use defaults
          }

          const mergedPayload: SeoSettingsData = {
            ...currentSettings,
            ...seoSettings,
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
            console.error("[PUT /api/seo-settings] Storage upload error:", uploadError);
            return new Response(
              JSON.stringify({
                error: `Failed to save SEO settings: ${uploadError.message}`,
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
              seoSettings: mergedPayload,
              message: "SEO settings updated successfully in Supabase",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Internal server error";
          console.error("[PUT /api/seo-settings] Server exception:", err);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
