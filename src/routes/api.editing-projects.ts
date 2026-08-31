import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";
import { defaultEditingProjectsSeed, extractGoogleDriveFileId } from "@/lib/editing-projects-cms";

/**
 * Ensures initial 5 editing projects and 18 videos exist in Supabase database.
 * If tables are empty or newly created, seeds them automatically.
 */
async function ensureEditingProjectsSeeded() {
  try {
    const { count, error } = await (supabaseAdmin as any)
      .from("editing_projects")
      .select("*", { count: "exact", head: true });

    if (!error && (count === null || count === 0)) {
      console.log("Auto-seeding 5 editing projects and 18 videos into Supabase...");
      for (let i = 0; i < defaultEditingProjectsSeed.length; i++) {
        const seedProj = defaultEditingProjectsSeed[i];
        if (!seedProj) continue;

        const { data: createdProj, error: pErr } = await (supabaseAdmin as any)
          .from("editing_projects")
          .insert({
            title: seedProj.title,
            slug: seedProj.slug,
            project_number: seedProj.projectNumber,
            category: "EDITING",
            client_name: seedProj.clientName || null,
            year: seedProj.year || "2024",
            role: seedProj.role,
            description: seedProj.description,
            synopsis: seedProj.synopsis || seedProj.description,
            logline: seedProj.logline || null,
            thumbnail_url: seedProj.thumbnailUrl || null,
            hero_image_url: seedProj.heroImageUrl || null,
            tags: seedProj.tags || [],
            tools: seedProj.tools || [],
            editing_breakdown: seedProj.editingBreakdown || [],
            credits: seedProj.credits || null,
            status: seedProj.status || "Completed",
            featured: Boolean(seedProj.featured),
            published: seedProj.published !== false,
            display_order: i + 1,
            notice: seedProj.notice || null,
            section_visibility: seedProj.sectionVisibility || {},
            seo_settings: seedProj.seoSettings || {},
          })
          .select()
          .single();

        if (createdProj && !pErr && seedProj.videos && seedProj.videos.length > 0) {
          const videoInserts = seedProj.videos.map((v, vIdx) => ({
            project_id: createdProj.id,
            title: v.title,
            video_number: v.videoNumber || `Film ${String(vIdx + 1).padStart(2, "0")}`,
            drive_url: v.driveUrl || `https://drive.google.com/file/d/${v.driveFileId}/view`,
            drive_file_id: extractGoogleDriveFileId(v.driveFileId || v.driveUrl || ""),
            thumbnail_url: v.thumbnailUrl || null,
            description: v.description || null,
            duration: v.duration || null,
            published: v.published !== false,
            display_order: vIdx + 1,
          }));

          await (supabaseAdmin as any).from("editing_project_videos").insert(videoInserts);
        }
      }
      console.log("✓ Successfully seeded editing projects and videos into Supabase");
    }
  } catch (seedErr) {
    console.warn("Auto-seeding check failed (table might be initializing):", seedErr);
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
          await ensureEditingProjectsSeeded();

          const url = new URL(request.url);
          const singleId = url.searchParams.get("id");
          const singleSlug = url.searchParams.get("slug");
          const includeDrafts = url.searchParams.get("includeDrafts") === "true";

          if (singleId || singleSlug) {
            let singleQuery = (supabaseAdmin as any)
              .from("editing_projects")
              .select("*, editing_project_videos(*)");

            if (singleId) {
              singleQuery = singleQuery.eq("id", singleId);
            } else if (singleSlug) {
              singleQuery = singleQuery.eq("slug", singleSlug);
            }

            const { data: projectRow, error: pErr } = await singleQuery.maybeSingle();

            if (pErr || !projectRow) {
              return new Response(JSON.stringify({ error: "Editing project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
              });
            }

            const project = formatEditingProjectForClient(
              projectRow,
              projectRow.editing_project_videos || []
            );

            return new Response(JSON.stringify({ project }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          let query = (supabaseAdmin as any)
            .from("editing_projects")
            .select("*, editing_project_videos(*)")
            .order("display_order", { ascending: true });

          if (!includeDrafts) {
            query = query.eq("published", true);
          }

          const { data, error } = await query;

          if (error) {
            console.error("Error fetching editing projects from Supabase:", error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const projects = (data || []).map((row: any) =>
            formatEditingProjectForClient(row, row.editing_project_videos || [])
          );

          return new Response(JSON.stringify({ projects }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Unexpected error in GET /api/editing-projects:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
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

          // Action 1: Reorder
          if (body.action === "reorder" && Array.isArray(body.orderedIds)) {
            const { orderedIds } = body as { orderedIds: string[] };
            for (let i = 0; i < orderedIds.length; i++) {
              const id = orderedIds[i];
              if (id) {
                await (supabaseAdmin as any)
                  .from("editing_projects")
                  .update({ display_order: i + 1, project_number: String(i + 1).padStart(2, "0") })
                  .eq("id", id);
              }
            }
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Action 2: Duplicate
          if (body.action === "duplicate" && body.id) {
            const { id } = body as { id: string };
            const { data: original, error: origErr } = await (supabaseAdmin as any)
              .from("editing_projects")
              .select("*, editing_project_videos(*)")
              .eq("id", id)
              .single();

            if (origErr || !original) {
              return new Response(JSON.stringify({ error: "Original project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
              });
            }

            const newSlug = `${original.slug}-copy-${Date.now().toString(36).slice(-4)}`;
            const newTitle = `${original.title} (Copy)`;

            const { data: clonedProj, error: cloneErr } = await (supabaseAdmin as any)
              .from("editing_projects")
              .insert({
                title: newTitle,
                slug: newSlug,
                project_number: original.project_number,
                category: "EDITING",
                client_name: original.client_name,
                year: original.year,
                role: original.role,
                description: original.description,
                synopsis: original.synopsis,
                logline: original.logline,
                thumbnail_url: original.thumbnail_url,
                hero_image_url: original.hero_image_url,
                tags: original.tags || [],
                tools: original.tools || [],
                editing_breakdown: original.editing_breakdown || [],
                credits: original.credits,
                status: original.status,
                featured: false,
                published: false,
                display_order: (original.display_order ?? 0) + 1,
                notice: original.notice,
                section_visibility: original.section_visibility,
                seo_settings: original.seo_settings,
              })
              .select()
              .single();

            if (cloneErr || !clonedProj) {
              return new Response(JSON.stringify({ error: cloneErr?.message || "Failed to clone project" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              });
            }

            let clonedVideos: any[] = [];
            if (Array.isArray(original.editing_project_videos) && original.editing_project_videos.length > 0) {
              const videoInserts = original.editing_project_videos.map((v: any) => ({
                project_id: clonedProj.id,
                title: v.title,
                video_number: v.video_number,
                drive_url: v.drive_url,
                drive_file_id: v.drive_file_id,
                thumbnail_url: v.thumbnail_url,
                description: v.description,
                duration: v.duration,
                published: v.published,
                display_order: v.display_order,
              }));

              const { data: vData } = await (supabaseAdmin as any)
                .from("editing_project_videos")
                .insert(videoInserts)
                .select();

              if (vData) clonedVideos = vData;
            }

            const clientProject = formatEditingProjectForClient(clonedProj, clonedVideos);
            return new Response(JSON.stringify({ project: clientProject }), {
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

          const { data: createdProj, error: pErr } = await (supabaseAdmin as any)
            .from("editing_projects")
            .insert({
              title: project.title,
              slug: project.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
              project_number: project.projectNumber || "01",
              category: "EDITING",
              client_name: project.clientName || null,
              year: project.year || "2024",
              role: project.role || "Editor",
              description: project.description || "",
              synopsis: project.synopsis || project.description || "",
              logline: project.logline || null,
              thumbnail_url: project.thumbnailUrl || null,
              hero_image_url: project.heroImageUrl || null,
              tags: Array.isArray(project.tags) ? project.tags : [],
              tools: Array.isArray(project.tools) ? project.tools : [],
              editing_breakdown: Array.isArray(project.editingBreakdown) ? project.editingBreakdown : [],
              credits: project.credits || null,
              status: project.status || "Completed",
              featured: Boolean(project.featured),
              published: project.published !== false,
              display_order: Number(project.displayOrder) || 0,
              notice: project.notice || null,
              section_visibility: project.sectionVisibility || {},
              seo_settings: project.seoSettings || {},
            })
            .select()
            .single();

          if (pErr || !createdProj) {
            console.error("Error creating editing project:", pErr);
            return new Response(JSON.stringify({ error: pErr?.message || "Failed to create project" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          let createdVideos: any[] = [];
          if (Array.isArray(project.videos) && project.videos.length > 0) {
            const videoInserts = project.videos.map((v: any, vIdx: number) => ({
              project_id: createdProj.id,
              title: v.title || `Film ${String(vIdx + 1).padStart(2, "0")}`,
              video_number: v.videoNumber || `Film ${String(vIdx + 1).padStart(2, "0")}`,
              drive_url: v.driveUrl || "",
              drive_file_id: extractGoogleDriveFileId(v.driveFileId || v.driveUrl || ""),
              thumbnail_url: v.thumbnailUrl || null,
              description: v.description || null,
              duration: v.duration || null,
              published: v.published !== false,
              display_order: Number(v.displayOrder) || vIdx + 1,
            }));

            const { data: vData, error: vErr } = await (supabaseAdmin as any)
              .from("editing_project_videos")
              .insert(videoInserts)
              .select();

            if (!vErr && vData) {
              createdVideos = vData;
            }
          }

          const clientProject = formatEditingProjectForClient(createdProj, createdVideos);

          return new Response(JSON.stringify({ project: clientProject }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Unexpected error in POST /api/editing-projects:", err);
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

          const updatePayload: Record<string, any> = {};
          if (project.title !== undefined) updatePayload["title"] = project.title;
          if (project.slug !== undefined)
            updatePayload["slug"] = project.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
          if (project.projectNumber !== undefined) updatePayload["project_number"] = project.projectNumber;
          if (project.clientName !== undefined) updatePayload["client_name"] = project.clientName || null;
          if (project.year !== undefined) updatePayload["year"] = project.year || null;
          if (project.role !== undefined) updatePayload["role"] = project.role;
          if (project.description !== undefined) updatePayload["description"] = project.description;
          if (project.synopsis !== undefined) updatePayload["synopsis"] = project.synopsis;
          if (project.logline !== undefined) updatePayload["logline"] = project.logline || null;
          if (project.thumbnailUrl !== undefined) updatePayload["thumbnail_url"] = project.thumbnailUrl || null;
          if (project.heroImageUrl !== undefined) updatePayload["hero_image_url"] = project.heroImageUrl || null;
          if (project.tags !== undefined) updatePayload["tags"] = Array.isArray(project.tags) ? project.tags : [];
          if (project.tools !== undefined) updatePayload["tools"] = Array.isArray(project.tools) ? project.tools : [];
          if (project.editingBreakdown !== undefined)
            updatePayload["editing_breakdown"] = Array.isArray(project.editingBreakdown) ? project.editingBreakdown : [];
          if (project.credits !== undefined) updatePayload["credits"] = project.credits || null;
          if (project.status !== undefined) updatePayload["status"] = project.status || "Completed";
          if (project.featured !== undefined) updatePayload["featured"] = Boolean(project.featured);
          if (project.published !== undefined) updatePayload["published"] = Boolean(project.published);
          if (project.displayOrder !== undefined) updatePayload["display_order"] = Number(project.displayOrder);
          if (project.notice !== undefined) updatePayload["notice"] = project.notice || null;
          if (project.sectionVisibility !== undefined) updatePayload["section_visibility"] = project.sectionVisibility;
          if (project.seoSettings !== undefined) updatePayload["seo_settings"] = project.seoSettings;

          const { data: updatedProject, error: updateErr } = await (supabaseAdmin as any)
            .from("editing_projects")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

          if (updateErr || !updatedProject) {
            console.error("Error updating editing project:", updateErr);
            return new Response(JSON.stringify({ error: updateErr?.message || "Failed to update project" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          let currentVideos: any[] = [];
          if (Array.isArray(project.videos)) {
            await (supabaseAdmin as any).from("editing_project_videos").delete().eq("project_id", id);

            if (project.videos.length > 0) {
              const videoInserts = project.videos.map((v: any, idx: number) => ({
                project_id: id,
                title: v.title || `Film ${String(idx + 1).padStart(2, "0")}`,
                video_number: v.videoNumber || `Film ${String(idx + 1).padStart(2, "0")}`,
                drive_url: v.driveUrl || "",
                drive_file_id: extractGoogleDriveFileId(v.driveFileId || v.driveUrl || ""),
                thumbnail_url: v.thumbnailUrl || null,
                description: v.description || null,
                duration: v.duration || null,
                published: v.published !== false,
                display_order: Number(v.displayOrder) || idx + 1,
              }));

              const { data: vData, error: vErr } = await (supabaseAdmin as any)
                .from("editing_project_videos")
                .insert(videoInserts)
                .select();

              if (!vErr && vData) {
                currentVideos = vData;
              }
            }
          } else {
            const { data: existingVids } = await (supabaseAdmin as any)
              .from("editing_project_videos")
              .select("*")
              .eq("project_id", id)
              .order("display_order", { ascending: true });

            currentVideos = existingVids || [];
          }

          const clientProject = formatEditingProjectForClient(updatedProject, currentVideos);

          return new Response(JSON.stringify({ project: clientProject }), {
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

          const { error: delErr } = await (supabaseAdmin as any)
            .from("editing_projects")
            .delete()
            .eq("id", id);

          if (delErr) {
            console.error("Error deleting editing project:", delErr);
            return new Response(JSON.stringify({ error: delErr.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

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
