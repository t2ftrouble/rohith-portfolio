import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";
import { defaultEditingProjectsSeed, extractGoogleDriveFileId } from "@/lib/editing-projects-cms";

const STORAGE_PATH = "config/editing-projects.json";

function getDefaultProjectsWithIds(): any[] {
  return defaultEditingProjectsSeed.map((p, idx) => ({
    id: `seed-editing-${p.slug}`,
    title: p.title,
    slug: p.slug,
    projectNumber: p.projectNumber || String(idx + 5).padStart(2, "0"),
    category: "EDITING",
    clientName: p.clientName || "",
    year: p.year || "2024",
    role: p.role || "Editor",
    description: p.description || "",
    synopsis: p.synopsis || p.description || "",
    logline: p.logline || "",
    thumbnailUrl: p.thumbnailUrl || "",
    heroImageUrl: p.heroImageUrl || "",
    tags: p.tags || [],
    tools: p.tools || [],
    editingBreakdown: p.editingBreakdown || [],
    credits: p.credits || "",
    status: p.status || "Completed",
    featured: Boolean(p.featured),
    published: p.published !== false,
    displayOrder: idx + 1,
    notice: p.notice || "",
    sectionVisibility: p.sectionVisibility || {},
    seoSettings: p.seoSettings || {},
    videos: p.videos.map((v, vIdx) => ({
      id: `seed-video-${p.slug}-${vIdx + 1}`,
      projectId: `seed-editing-${p.slug}`,
      title: v.title,
      videoNumber: v.videoNumber || `Film ${String(vIdx + 1).padStart(2, "0")}`,
      driveUrl: v.driveUrl || `https://drive.google.com/file/d/${v.driveFileId}/view`,
      driveFileId: extractGoogleDriveFileId(v.driveFileId || v.driveUrl || ""),
      thumbnailUrl: v.thumbnailUrl || "",
      description: v.description || "",
      duration: v.duration || "",
      published: v.published !== false,
      displayOrder: vIdx + 1,
    })),
  }));
}

function deduplicateProjects(list: any[]): any[] {
  const seen = new Set<string>();
  return list.filter((p) => {
    const key = p.id || p.slug;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function loadFromStorage(): Promise<any[] | null> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from("portfolio-media")
      .download(STORAGE_PATH);

    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return deduplicateProjects(parsed);
      }
    }
  } catch (err) {
    console.warn("Storage download warning:", err);
  }
  return null;
}

async function saveToStorage(projectsList: any[]): Promise<void> {
  try {
    const buffer = Buffer.from(JSON.stringify(projectsList, null, 2), "utf-8");
    await supabaseAdmin.storage
      .from("portfolio-media")
      .upload(STORAGE_PATH, buffer, {
        contentType: "application/json",
        upsert: true,
      });
  } catch (err) {
    console.warn("Storage upload warning:", err);
  }
}

export function formatEditingProjectForClient(row: any, videosRows: any[] = []): any {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    projectNumber: row.project_number || "01",
    category: "EDITING",
    clientName: row.client_name || "",
    year: row.year || "2024",
    role: row.role || "Editor",
    description: row.description || "",
    synopsis: row.synopsis || row.description || "",
    logline: row.logline || "",
    thumbnailUrl: row.thumbnail_url || "",
    heroImageUrl: row.hero_image_url || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    tools: Array.isArray(row.tools) ? row.tools : [],
    editingBreakdown: Array.isArray(row.editing_breakdown) ? row.editing_breakdown : [],
    credits: row.credits || "",
    status: row.status || "Completed",
    featured: Boolean(row.featured),
    published: row.published !== false,
    displayOrder: row.display_order ?? 0,
    notice: row.notice || "",
    sectionVisibility: row.section_visibility || {},
    seoSettings: row.seo_settings || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    videos: (videosRows || [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((v) => ({
        id: v.id,
        projectId: v.project_id,
        title: v.title,
        videoNumber: v.video_number || "Film",
        driveUrl: v.drive_url || "",
        driveFileId: v.drive_file_id || extractGoogleDriveFileId(v.drive_url || ""),
        thumbnailUrl: v.thumbnail_url || "",
        description: v.description || "",
        duration: v.duration || "",
        published: v.published !== false,
        displayOrder: v.display_order ?? 0,
        createdAt: v.created_at,
        updatedAt: v.updated_at,
      })),
  };
}

export const Route = createFileRoute("/api/editing-projects")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const singleId = url.searchParams.get("id");
          const singleSlug = url.searchParams.get("slug");
          const includeDrafts = url.searchParams.get("includeDrafts") === "true";

          // 1. Try fetching from Supabase DB table first
          try {
            let query = (supabaseAdmin as any)
              .from("editing_projects")
              .select("*, editing_project_videos(*)")
              .order("display_order", { ascending: true });

            if (singleId) {
              query = query.eq("id", singleId);
            } else if (singleSlug) {
              query = query.eq("slug", singleSlug);
            } else if (!includeDrafts) {
              query = query.eq("published", true);
            }

            const { data, error } = await query;

            if (!error && data && data.length > 0) {
              if (singleId || singleSlug) {
                const project = formatEditingProjectForClient(data[0], data[0].editing_project_videos || []);
                return new Response(JSON.stringify({ project }), {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                });
              }

              const projects = data.map((row: any) =>
                formatEditingProjectForClient(row, row.editing_project_videos || [])
              );
              return new Response(JSON.stringify({ projects }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }
          } catch (dbErr) {
            console.warn("DB query skipped/failed, checking storage fallback:", dbErr);
          }

          // 2. Fallback to Supabase Storage config/editing-projects.json
          const storageProjects = (await loadFromStorage()) || getDefaultProjectsWithIds();
          const filtered = includeDrafts ? storageProjects : storageProjects.filter((p) => p.published !== false);

          if (singleId || singleSlug) {
            const found = storageProjects.find((p) => p.id === singleId || p.slug === singleSlug);
            if (found) {
              return new Response(JSON.stringify({ project: found }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }
          }

          return new Response(JSON.stringify({ projects: filtered }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Unexpected error in GET /api/editing-projects, returning default seed:", err);
          return new Response(JSON.stringify({ projects: getDefaultProjectsWithIds() }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      POST: async ({ request }) => {
        try {
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please login as admin." }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const body = await request.json();

          // Load current project list from storage or defaults
          let currentList = (await loadFromStorage()) || getDefaultProjectsWithIds();

          // Action 1: Reorder
          if (body.action === "reorder" && Array.isArray(body.orderedIds)) {
            const { orderedIds } = body as { orderedIds: string[] };
            const reorderedList: any[] = [];
            for (let i = 0; i < orderedIds.length; i++) {
              const id = orderedIds[i];
              const item = currentList.find((p) => p.id === id);
              if (item) {
                item.displayOrder = i + 1;
                item.projectNumber = String(i + 5).padStart(2, "0");
                reorderedList.push(item);
              }
            }
            // Append any items that were not in orderedIds
            currentList.forEach((p) => {
              if (!reorderedList.find((r) => r.id === p.id)) {
                reorderedList.push(p);
              }
            });
            await saveToStorage(reorderedList);

            // Also attempt DB update if table exists
            try {
              for (let i = 0; i < orderedIds.length; i++) {
                await (supabaseAdmin as any)
                  .from("editing_projects")
                  .update({ display_order: i + 1, project_number: String(i + 5).padStart(2, "0") })
                  .eq("id", orderedIds[i]);
              }
            } catch {}

            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Action 2: Duplicate
          if (body.action === "duplicate" && body.id) {
            const { id } = body as { id: string };
            const target = currentList.find((p) => p.id === id);
            if (!target) {
              return new Response(JSON.stringify({ error: "Original project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
              });
            }

            const newId = `edit-proj-${Date.now()}`;
            const newSlug = `${target.slug}-copy-${Date.now().toString(36).slice(-4)}`;
            const cloned: any = {
              ...target,
              id: newId,
              title: `${target.title} (Copy)`,
              slug: newSlug,
              published: false,
              displayOrder: currentList.length + 1,
              videos: (target.videos || []).map((v: any, vIdx: number) => ({
                ...v,
                id: `vid-${newId}-${vIdx + 1}`,
                projectId: newId,
              })),
            };

            currentList.push(cloned);
            await saveToStorage(currentList);

            return new Response(JSON.stringify({ project: cloned }), {
              status: 201,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Action 3: Create Project
          const { project } = body as { project: any };
          if (!project || !project.title || !project.slug) {
            return new Response(JSON.stringify({ error: "Title and slug are required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const newId = `edit-proj-${Date.now()}`;
          const newProject: any = {
            id: newId,
            title: project.title,
            slug: project.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
            projectNumber: project.projectNumber || String(currentList.length + 5).padStart(2, "0"),
            category: "EDITING",
            clientName: project.clientName || "",
            year: project.year || "2024",
            role: project.role || "Editor",
            description: project.description || "",
            synopsis: project.synopsis || project.description || "",
            logline: project.logline || "",
            thumbnailUrl: project.thumbnailUrl || "",
            heroImageUrl: project.heroImageUrl || "",
            tags: Array.isArray(project.tags) ? project.tags : [],
            tools: Array.isArray(project.tools) ? project.tools : [],
            editingBreakdown: Array.isArray(project.editingBreakdown) ? project.editingBreakdown : [],
            credits: project.credits || "",
            status: project.status || "Completed",
            featured: Boolean(project.featured),
            published: project.published !== false,
            displayOrder: currentList.length + 1,
            notice: project.notice || "",
            sectionVisibility: project.sectionVisibility || {},
            seoSettings: project.seoSettings || {},
            videos: (project.videos || []).map((v: any, idx: number) => ({
              id: `vid-${newId}-${idx + 1}`,
              projectId: newId,
              title: v.title || `Film ${String(idx + 1).padStart(2, "0")}`,
              videoNumber: v.videoNumber || `Film ${String(idx + 1).padStart(2, "0")}`,
              driveUrl: v.driveUrl || "",
              driveFileId: extractGoogleDriveFileId(v.driveFileId || v.driveUrl || ""),
              thumbnailUrl: v.thumbnailUrl || "",
              description: v.description || "",
              duration: v.duration || "",
              published: v.published !== false,
              displayOrder: idx + 1,
            })),
          };

          currentList.push(newProject);
          await saveToStorage(currentList);

          return new Response(JSON.stringify({ project: newProject }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Error in POST /api/editing-projects:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },

      PUT: async ({ request }) => {
        try {
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please login as admin." }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const body = await request.json();
          const { id, project } = body as { id: string; project: any };

          if (!id || !project) {
            return new Response(JSON.stringify({ error: "Missing id or project payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          let currentList = (await loadFromStorage()) || getDefaultProjectsWithIds();
          const targetIndex = currentList.findIndex((p) => p.id === id || p.slug === id || p.slug === project.slug);

          let updatedItem: any = null;

          if (targetIndex >= 0) {
            const existing = currentList[targetIndex];
            updatedItem = {
              ...existing,
              ...project,
              id: existing.id,
              videos: Array.isArray(project.videos)
                ? project.videos.map((v: any, idx: number) => ({
                    id: v.id || `vid-${existing.id}-${idx + 1}`,
                    projectId: existing.id,
                    title: v.title || `Film ${String(idx + 1).padStart(2, "0")}`,
                    videoNumber: v.videoNumber || `Film ${String(idx + 1).padStart(2, "0")}`,
                    driveUrl: v.driveUrl || "",
                    driveFileId: extractGoogleDriveFileId(v.driveFileId || v.driveUrl || ""),
                    thumbnailUrl: v.thumbnailUrl || "",
                    description: v.description || "",
                    duration: v.duration || "",
                    published: v.published !== false,
                    displayOrder: idx + 1,
                  }))
                : existing.videos,
            };
            currentList[targetIndex] = updatedItem;
          } else {
            updatedItem = {
              ...project,
              id: id.startsWith("seed-") || id.startsWith("edit-proj-") ? id : `edit-proj-${Date.now()}`,
              videos: Array.isArray(project.videos)
                ? project.videos.map((v: any, idx: number) => ({
                    id: v.id || `vid-${id}-${idx + 1}`,
                    projectId: id,
                    title: v.title || `Film ${String(idx + 1).padStart(2, "0")}`,
                    videoNumber: v.videoNumber || `Film ${String(idx + 1).padStart(2, "0")}`,
                    driveUrl: v.driveUrl || "",
                    driveFileId: extractGoogleDriveFileId(v.driveFileId || v.driveUrl || ""),
                    thumbnailUrl: v.thumbnailUrl || "",
                    description: v.description || "",
                    duration: v.duration || "",
                    published: v.published !== false,
                    displayOrder: idx + 1,
                  }))
                : [],
            };
            currentList.push(updatedItem);
          }

          await saveToStorage(currentList);

          return new Response(JSON.stringify({ project: updatedItem }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Error in PUT /api/editing-projects:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },

      DELETE: async ({ request }) => {
        try {
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please login as admin." }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const url = new URL(request.url);
          let id = url.searchParams.get("id");

          if (!id) {
            try {
              const body = await request.json();
              id = body?.id;
            } catch {}
          }

          if (!id) {
            return new Response(JSON.stringify({ error: "Missing project id to delete" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          let currentList = (await loadFromStorage()) || getDefaultProjectsWithIds();
          currentList = currentList.filter((p) => p.id !== id && p.slug !== id);
          await saveToStorage(currentList);

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Error in DELETE /api/editing-projects:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
