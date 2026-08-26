import { createFileRoute } from "@tanstack/react-router";
import { invalidateAdminToken } from "@/lib/admin-session";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cookieHeader = request.headers.get('cookie');
        const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);
        
        if (adminSessionMatch && adminSessionMatch[1]) {
          await invalidateAdminToken(adminSessionMatch[1]);
        }
        
        const isSecure = request.url.startsWith('https://') || process.env['NODE_ENV'] === 'production';
        const secureFlag = isSecure ? '; Secure' : '';
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `admin_session=; HttpOnly${secureFlag}; SameSite=Lax; Path=/; Max-Age=0`
          }
        });
      },
    },
  },
});
