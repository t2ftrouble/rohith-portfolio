import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";
import { defaultSiteImages, normalizeImageUrl, type SiteImagesData } from "@/lib/site-images";

const STORAGE_PATH = "config/site-images.json";

export const Route = createFileRoute("/api/site-images")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Download config/site-images.json from Supabase Storage
          const { data, error } = await supabaseAdmin.storage
            .from("portfolio-media")
            .download(STORAGE_PATH);

          if (error || !data) {
            return new Response(JSON.stringify(defaultSiteImages), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const text = await data.text();
          const parsed = JSON.parse(text);

          const siteImages: SiteImagesData = {
            heroImage: normalizeImageUrl(parsed.heroImage) || defaultSiteImages.heroImage,
            aboutImage: normalizeImageUrl(parsed.aboutImage) || defaultSiteImages.aboutImage,
            digitalMarketingHero:
              normalizeImageUrl(parsed.digitalMarketingHero) ||
              defaultSiteImages.digitalMarketingHero,
            creative1: normalizeImageUrl(parsed.creative1) || defaultSiteImages.creative1,
            creative2: normalizeImageUrl(parsed.creative2) || defaultSiteImages.creative2,
            creative3: normalizeImageUrl(parsed.creative3) || defaultSiteImages.creative3,
          };

          return new Response(JSON.stringify(siteImages), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=60, s-maxage=60",
            },
          });
        } catch (err) {
          console.error("[GET /api/site-images] Error:", err);
          return new Response(JSON.stringify(defaultSiteImages), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      PUT: async ({ request }) => {
        try {
          // Check for admin session cookie
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (
            !adminSessionMatch ||
            !adminSessionMatch[1] ||
            !(await verifyAdminToken(adminSessionMatch[1]))
          ) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please login as admin." }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const body = await request.json();
          const { siteImages } = body as { siteImages: Partial<SiteImagesData> };

          if (!siteImages) {
            return new Response(JSON.stringify({ error: "Missing siteImages in request body" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Fetch current config to merge
          let currentImages = { ...defaultSiteImages };
          try {
            const { data: currentData } = await supabaseAdmin.storage
              .from("portfolio-media")
              .download(STORAGE_PATH);
            if (currentData) {
              const text = await currentData.text();
              currentImages = { ...currentImages, ...JSON.parse(text) };
            }
          } catch {
            // Use defaults as base
          }

          const mergedPayload: SiteImagesData & { updatedAt: string } = {
            heroImage: normalizeImageUrl(siteImages.heroImage) || currentImages.heroImage,
            aboutImage: normalizeImageUrl(siteImages.aboutImage) || currentImages.aboutImage,
            digitalMarketingHero:
              normalizeImageUrl(siteImages.digitalMarketingHero) ||
              currentImages.digitalMarketingHero,
            creative1: normalizeImageUrl(siteImages.creative1) || currentImages.creative1,
            creative2: normalizeImageUrl(siteImages.creative2) || currentImages.creative2,
            creative3: normalizeImageUrl(siteImages.creative3) || currentImages.creative3,
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
            console.error("[PUT /api/site-images] Storage upload error:", uploadError);
            return new Response(
              JSON.stringify({
                error: `Failed to save images configuration: ${uploadError.message}`,
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              siteImages: mergedPayload,
              message: "Website images updated successfully in Supabase",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Internal server error";
          console.error("[PUT /api/site-images] Server exception:", err);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
