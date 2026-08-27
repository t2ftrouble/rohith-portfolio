import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";
import type { ContactEnquiry, EnquiryStatus } from "@/lib/enquiries";

const STORAGE_PATH = "config/enquiries.json";

async function getStoredEnquiries(): Promise<ContactEnquiry[]> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from("portfolio-media")
      .download(STORAGE_PATH);

    if (error || !data) {
      return [];
    }

    const text = await data.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Could not read enquiries from storage:", err);
    return [];
  }
}

async function saveStoredEnquiries(enquiries: ContactEnquiry[]): Promise<boolean> {
  const jsonBlob = new Blob([JSON.stringify(enquiries, null, 2)], {
    type: "application/json",
  });

  const { error } = await supabaseAdmin.storage
    .from("portfolio-media")
    .upload(STORAGE_PATH, jsonBlob, {
      upsert: true,
      contentType: "application/json",
    });

  if (error) {
    console.error("Failed to save enquiries to storage:", error);
    return false;
  }
  return true;
}

export const Route = createFileRoute("/api/enquiries")({
  server: {
    handlers: {
      // GET: Admin only - fetch all enquiries
      GET: async ({ request }) => {
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

          const enquiries = await getStoredEnquiries();
          // Sort newest first
          enquiries.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          return new Response(JSON.stringify({ enquiries }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Internal server error";
          console.error("[GET /api/enquiries] Error:", err);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      // POST: Public submission of contact form
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { enquiry } = body as {
            enquiry: Partial<ContactEnquiry>;
          };

          if (!enquiry || !enquiry.name || !enquiry.message) {
            return new Response(
              JSON.stringify({ error: "Name and message are required" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const newEnquiry: ContactEnquiry = {
            id: `enq_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
            name: enquiry.name.trim(),
            email: enquiry.email?.trim() || "",
            business: enquiry.business?.trim() || "",
            location: enquiry.location?.trim() || "",
            projectType: enquiry.projectType?.trim() || "OTHER",
            budget: enquiry.budget?.trim() || "",
            message: enquiry.message.trim(),
            status: "NEW",
            createdAt: new Date().toISOString(),
          };

          const currentList = await getStoredEnquiries();
          currentList.unshift(newEnquiry);
          await saveStoredEnquiries(currentList);

          return new Response(
            JSON.stringify({ success: true, id: newEnquiry.id }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Internal server error";
          console.error("[POST /api/enquiries] Error:", err);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      // PUT: Admin only - update enquiry status
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
          const { id, status } = body as { id: string; status: unknown };

          if (!id || typeof status !== "string") {
            return new Response(
              JSON.stringify({ error: "Missing id or status in request body" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const validStatuses: EnquiryStatus[] = ["NEW", "CONTACTED", "COMPLETED", "ARCHIVED"];
          if (!validStatuses.includes(status as EnquiryStatus)) {
            return new Response(
              JSON.stringify({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const validatedStatus = status as EnquiryStatus;
          const currentList = await getStoredEnquiries();
          const targetIndex = currentList.findIndex((item) => item.id === id);

          if (targetIndex === -1) {
            return new Response(JSON.stringify({ error: "Enquiry not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const existing = currentList[targetIndex];
          if (!existing) {
            return new Response(JSON.stringify({ error: "Enquiry not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const updatedEnquiry: ContactEnquiry = {
            id: existing.id,
            name: existing.name,
            projectType: existing.projectType,
            message: existing.message,
            createdAt: existing.createdAt,
            status: validatedStatus,
            updatedAt: new Date().toISOString(),
            ...(existing.email !== undefined ? { email: existing.email } : {}),
            ...(existing.business !== undefined ? { business: existing.business } : {}),
            ...(existing.location !== undefined ? { location: existing.location } : {}),
            ...(existing.budget !== undefined ? { budget: existing.budget } : {}),
          };

          currentList[targetIndex] = updatedEnquiry;
          await saveStoredEnquiries(currentList);

          return new Response(
            JSON.stringify({
              success: true,
              enquiry: updatedEnquiry,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Internal server error";
          console.error("[PUT /api/enquiries] Error:", err);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      // DELETE: Admin only - remove enquiry
      DELETE: async ({ request }) => {
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

          const url = new URL(request.url);
          const id = url.searchParams.get("id");

          if (!id) {
            return new Response(
              JSON.stringify({ error: "Missing id parameter" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const currentList = await getStoredEnquiries();
          const filtered = currentList.filter((item) => item.id !== id);
          await saveStoredEnquiries(filtered);

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Internal server error";
          console.error("[DELETE /api/enquiries] Error:", err);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
