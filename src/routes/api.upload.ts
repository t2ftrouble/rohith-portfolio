import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // This is a FormData upload, we need to parse it differently
        const formData = await request.formData();
        
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string;
        
        // Verify admin authentication via cookie
        const cookieHeader = request.headers.get('cookie');
        const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
        
        if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (!file || !folder) {
          return new Response(JSON.stringify({ error: 'Missing file or folder' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
          return new Response(JSON.stringify({ error: 'Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          return new Response(JSON.stringify({ error: 'File too large. Maximum size is 5MB.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Generate unique filename
        const ext = file.name.split('.').pop();
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 15);
        const filename = `${timestamp}-${randomPart}.${ext}`;
        const path = `${folder}/${filename}`;
        
        // Convert File to ArrayBuffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('portfolio-media')
          .upload(path, uint8Array, {
            contentType: file.type,
            upsert: false
          });
        
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('portfolio-media')
          .getPublicUrl(path);
        
        return new Response(JSON.stringify({ url: publicUrl, path }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      },
    },
  },
});
