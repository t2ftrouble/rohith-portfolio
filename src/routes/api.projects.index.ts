import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";

export function formatProjectForSupabase(project: any) {
  const supabaseProject: Record<string, any> = {
    slug: project.slug,
    number: project.number || "01",
    title: project.title,
    type: project.type || "Short Film",
    role: project.role || "Director",
    category: project.category || "FILMMAKING",
    description: project.description || "",
    visuals: project.visuals || "Film stills",
    image: project.image || "",
    process: Array.isArray(project.process) ? project.process : [],
    year: project.year || null,
    status: project.status || null,
    has_video: Boolean(project.hasVideo || project.videoConfig?.videoId || project.videoConfig?.videoUrl),
    video_id: project.videoId || project.videoConfig?.videoId || null,
    poster_image: project.posterImage || null,
    show_before_after: Boolean(project.showBeforeAfter || (Array.isArray(project.beforeAfterPairs) && project.beforeAfterPairs.length > 0)),
    before_image: project.beforeImage || null,
    after_image: project.afterImage || null,
    full_credits: project.fullCredits || null,
    client: project.client || null,
    emotional_descriptor: project.emotionalDescriptor || null,
    what_i_felt: project.whatIFelt || null,
    gallery_images: Array.isArray(project.galleryImages) ? project.galleryImages : [],
    publish_status: project.publishStatus === "DRAFT" ? "DRAFT" : "PUBLISHED",

    // CMS v2 columns
    hero_image: project.heroImage || null,
    thumbnail_image: project.thumbnailImage || null,
    featured_thumbnail: project.featuredThumbnail || null,
    og_image: project.ogImage || null,
    image_alt: project.imageAlt || null,
    logline: project.logline || null,
    synopsis: project.synopsis || null,
    director_note: project.directorNote || null,
    duration: project.duration || null,
    format_specs: project.formatSpecs || null,
    tags: Array.isArray(project.tags) ? project.tags : [],
    gallery_items: Array.isArray(project.galleryItems) ? project.galleryItems : [],
    before_after_pairs: Array.isArray(project.beforeAfterPairs) ? project.beforeAfterPairs : [],
    vfx_breakdowns: Array.isArray(project.vfxBreakdowns) ? project.vfxBreakdowns : [],
    team_credits: Array.isArray(project.teamCredits) ? project.teamCredits : [],
    awards: Array.isArray(project.awards) ? project.awards : [],
    project_links: Array.isArray(project.projectLinks) ? project.projectLinks : [],
    section_visibility: project.sectionVisibility || {},
    video_config: project.videoConfig || {},
    seo_settings: project.seoSettings || {},
  };

  return supabaseProject;
}

export const Route = createFileRoute("/api/projects/")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Public read access - fetch from Supabase using server client
          const { data, error } = await supabaseAdmin
            .from("projects")
            .select("*")
            .order("number", { ascending: true });

          if (error) {
            console.error("Error fetching projects from Supabase:", error);
            return new Response(JSON.stringify({ error: error.message || "Failed to fetch projects" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ projects: data }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Unexpected error in GET /api/projects:", err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { project } = body as { project: any };

          // Check for admin session cookie
          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please login again." }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const supabaseProject = formatProjectForSupabase(project);

          const { data: newProject, error } = await (supabaseAdmin.from("projects") as any)
            .insert(supabaseProject)
            .select()
            .single();

          if (error) {
            console.error("[API POST /api/projects] Error creating project:", error);
            return new Response(JSON.stringify({ error: error.message || "Failed to create project" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ project: newProject }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Unexpected error in POST /api/projects:", err);
          return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
