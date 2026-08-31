import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData();
          const file = formData.get("file") as File;
          const folder = (formData.get("folder") as string) || "uploads";

          // Verify admin authentication via cookie
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please login as admin." }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!file) {
            return new Response(JSON.stringify({ error: "Missing file payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Validate file type (Images and PDFs)
          const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/avif",
            "image/svg+xml",
            "application/pdf",
          ];

          if (!allowedTypes.includes(file.type)) {
            return new Response(
              JSON.stringify({
                error: `Invalid file type (${file.type}). Allowed: JPG, PNG, WEBP, GIF, AVIF, SVG, PDF.`,
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Validate file size (max 15MB for high-res stills/PDFs)
          if (file.size > 15 * 1024 * 1024) {
            return new Response(
              JSON.stringify({ error: "File is too large. Maximum allowed size is 15MB." }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Ensure bucket exists in Supabase Storage
          try {
            await supabaseAdmin.storage.createBucket("portfolio-media", { public: true });
          } catch {
            // Bucket already exists, ignore
          }

          // Generate clean unique filename with sanitized extension
          const originalName = file.name || "upload";
          const rawExt = originalName.split(".").pop() || "webp";
          const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "");
          const timestamp = Date.now().toString(36);
          const randomPart = Math.random().toString(36).substring(2, 10);
          const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
          const path = `${sanitizedFolder}/${timestamp}-${randomPart}.${ext}`;

          // Convert File to ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          // Upload to Supabase Storage
          const { error: uploadError } = await supabaseAdmin.storage
            .from("portfolio-media")
            .upload(path, uint8Array, {
              contentType: file.type || "image/webp",
              upsert: true,
            });

          if (uploadError) {
            console.error("[API POST /api/upload] Supabase upload error:", uploadError);
            return new Response(
              JSON.stringify({
                error: `Supabase Storage upload failed: ${uploadError.message || "Unknown error"}`,
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabaseAdmin.storage.from("portfolio-media").getPublicUrl(path);

          return new Response(JSON.stringify({ url: publicUrl, path, size: file.size }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        } catch (err) {
          console.error("[API POST /api/upload] Unexpected error:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
