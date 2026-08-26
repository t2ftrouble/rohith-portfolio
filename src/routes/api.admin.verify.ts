import { createFileRoute } from "@tanstack/react-router";
import { verifyAdminToken } from "@/lib/admin-session";

export const Route = createFileRoute("/api/admin/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const cookieHeader = request.headers.get('cookie');
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
          
          if (!adminSessionMatch || !adminSessionMatch[1]) {
            return new Response(JSON.stringify({ authenticated: false }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const isValid = await verifyAdminToken(adminSessionMatch[1]);
          return new Response(JSON.stringify({ authenticated: isValid }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error("Session verification error:", error);
          return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    },
  },
});
