import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";
import { defaultSocialLinks, isValidUrl, normalizeUrl, type SocialLinksData } from "@/lib/social-links";

const STORAGE_PATH = "config/social-links.json";

export const Route = createFileRoute("/api/social-links")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Download config/social-links.json from Supabase Storage
          const { data, error } = await supabaseAdmin.storage
            .from("portfolio-media")
            .download(STORAGE_PATH);

          if (error || !data) {
            console.warn("[GET /api/social-links] Storage file not found, returning defaults");
            return new Response(JSON.stringify(defaultSocialLinks), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const text = await data.text();
          const parsed = JSON.parse(text);

          const socialLinks: SocialLinksData = {
            youtube: normalizeUrl(parsed.youtube),
            instagram: normalizeUrl(parsed.instagram),
            linkedin: normalizeUrl(parsed.linkedin),
          };

          return new Response(JSON.stringify(socialLinks), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=60, s-maxage=60",
            },
          });
        } catch (err) {
          console.error("[GET /api/social-links] Error:", err);
          return new Response(JSON.stringify(defaultSocialLinks), {
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

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please login as admin." }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const body = await request.json();
          const { socialLinks } = body as { socialLinks: Partial<SocialLinksData> };

          if (!socialLinks) {
            return new Response(JSON.stringify({ error: "Missing socialLinks in request body" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const youtube = normalizeUrl(socialLinks.youtube);
          const instagram = normalizeUrl(socialLinks.instagram);
          const linkedin = normalizeUrl(socialLinks.linkedin);

          // Validation
          if (youtube && !isValidUrl(youtube)) {
            return new Response(JSON.stringify({ error: "Invalid YouTube URL format. Must start with http:// or https://" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (instagram && !isValidUrl(instagram)) {
            return new Response(JSON.stringify({ error: "Invalid Instagram URL format. Must start with http:// or https://" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (linkedin && !isValidUrl(linkedin)) {
            return new Response(JSON.stringify({ error: "Invalid LinkedIn URL format. Must start with http:// or https://" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const payloadToSave: SocialLinksData & { updatedAt: string } = {
            youtube,
            instagram,
            linkedin,
            updatedAt: new Date().toISOString(),
          };

          const jsonBuffer = Buffer.from(JSON.stringify(payloadToSave, null, 2), "utf-8");

          const { error: uploadError } = await supabaseAdmin.storage
            .from("portfolio-media")
            .upload(STORAGE_PATH, jsonBuffer, {
              contentType: "application/json",
              upsert: true,
            });

          if (uploadError) {
            console.error("[PUT /api/social-links] Supabase Storage upload error:", uploadError);
            return new Response(JSON.stringify({ error: "Failed to persist social links to Supabase Storage" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          console.log("[PUT /api/social-links] Successfully updated in Supabase:", payloadToSave);

          return new Response(JSON.stringify({ success: true, socialLinks: payloadToSave }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("[PUT /api/social-links] Unexpected error:", err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
