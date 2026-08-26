import { createFileRoute } from "@tanstack/react-router";
import { verifyAdminPassword, createAdminSession } from "@/lib/admin-session";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { password } = body as { password: string };
          
          if (!verifyAdminPassword(password)) {
            return new Response(JSON.stringify({ success: false, error: "Invalid password" }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Create secure session in Supabase
          const token = await createAdminSession();
          
          // Set HttpOnly cookie via response headers
          const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
          const isSecure = request.url.startsWith('https://') || process.env['NODE_ENV'] === 'production';
          const secureFlag = isSecure ? '; Secure' : '';
          const cookieString = `admin_session=${token}; HttpOnly${secureFlag}; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
          
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Set-Cookie': cookieString
            }
          });
        } catch (error) {
          console.error("Login API error:", error);
          return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Authentication error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    },
  },
});
