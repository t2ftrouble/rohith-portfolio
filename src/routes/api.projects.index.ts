import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyAdminToken } from "@/lib/admin-session";

const defaultFilmProjectsSeed = [
  {
    slug: "one-last-day",
    number: "01",
    title: "One Last Day",
    type: "Short Film",
    role: "Story • Screenplay • Director • Editor • DI",
    category: "FILMMAKING",
    year: "2023",
    status: "Released",
    logline: "A heartfelt story of silence, regret, and final goodbyes.",
    synopsis:
      "A heartfelt story of silence, regret and final goodbyes. This was Rohith V's first short film attempt, made without prior filmmaking experience. Shot entirely on iPhone with zero budget. The project became a major learning experience through experimentation, mistakes, storytelling, direction, editing and teamwork.",
    director_note:
      "My first film was about learning through mistakes. Every limitation became creative opportunity. The silence in the film reflects how I learned to let frames breathe.",
    duration: "10 MIN",
    format_specs: "4K • COLOR • 2.39:1 • IPHONE",
    tags: ["FILMMAKING", "SHORT FILM", "DRAMA", "DIRECTION", "EDITING", "IPHONE"],
    description:
      "A heartfelt story of silence, regret and final goodbyes. This was Rohith V's first short film attempt, made without prior filmmaking experience. Shot entirely on iPhone with zero budget.",
    process: [
      "Story and screenplay development",
      "Direction on set",
      "Shot planning and scene composition",
      "Visual storytelling and blocking",
      "Editing and post-production through final cut",
      "DI (Digital Intermediate)",
    ],
    visuals: "Film video, poster, film stills, editing/VFX breakdown",
    image: "/assets/project-one-last-day.webp",
    hero_image: "/assets/project-one-last-day.webp",
    thumbnail_image: "/assets/project-one-last-day.webp",
    featured_thumbnail: "/assets/project-one-last-day.webp",
    poster_image: "/assets/one-last-day-poster.webp",
    has_video: true,
    video_id: "tUnBO1O66Fc",
    show_before_after: true,
    before_image: "/assets/one-last-day-before-cg.webp",
    after_image: "/assets/one-last-day-after-cg.webp",
    before_after_pairs: [
      {
        id: "pair-1",
        beforeImage: "/assets/one-last-day-before-cg.webp",
        afterImage: "/assets/one-last-day-after-cg.webp",
        beforeLabel: "BEFORE CG",
        afterLabel: "AFTER CG",
        title: "Color Grading & Atmosphere Pass",
        description: "Enhancing the emotive twilight hue and contrast in DaVinci Resolve.",
      },
    ],
    gallery_images: ["/assets/project-one-last-day.webp", "/assets/one-last-day-poster.webp"],
    gallery_items: [
      { url: "/assets/project-one-last-day.webp", category: "Film Stills", caption: "Deva contemplating the silent departure" },
      { url: "/assets/one-last-day-poster.webp", category: "Production", caption: "Official Festival Poster Artwork" },
    ],
    video_config: {
      videoId: "tUnBO1O66Fc",
      videoUrl: "https://www.youtube.com/watch?v=tUnBO1O66Fc",
      title: "One Last Day — Official Short Film",
      type: "youtube",
    },
    team_credits: [
      { name: "Rohith V", role: "Director / Writer / Editor / DI", visible: true },
      { name: "Yash Vijay", role: "Lead Actor (Deva)", visible: true },
      { name: "Yashwanth VK", role: "Assistant Director / DOP", visible: true },
      { name: "Danny & Govarthan", role: "Music & Score", visible: true },
    ],
    project_links: [
      { label: "Watch Film on YouTube", url: "https://www.youtube.com/watch?v=tUnBO1O66Fc", platform: "YouTube", visible: true },
    ],
    section_visibility: {
      hero: true,
      story: true,
      video: true,
      gallery: true,
      beforeAfter: true,
      vfxBreakdown: true,
      team: true,
      credits: true,
      awards: true,
      links: true,
      comments: true,
    },
    full_credits:
      "Written / Story / Screenplay / Directed / Edited / DI: Rohith V\n\nCast:\nYash Vijay as Deva\nVarsha\n\nAssistant Director / Script Supervisor:\nYashwanth VK\n\nAssistant Directors:\nRamu\nYukesh\n\nDOP:\nYashwanth VK\nBhuvana\n\nMusic:\nDanny\nGovarthan",
    emotional_descriptor: "A story about letting go.",
    what_i_felt:
      "My first film was about learning through mistakes. Every limitation became creative opportunity. The silence in the film reflects how I learned to let frames breathe.",
    publish_status: "PUBLISHED",
  },
  {
    slug: "toothpaste",
    number: "02",
    title: "Toothpaste",
    type: "Short Film",
    role: "Story • Direction • Editing",
    category: "FILMMAKING",
    year: "2024",
    status: "Completed",
    logline: "An everyday morning routine turns into an unsettling psychological twist.",
    synopsis:
      "A suspenseful and mind-bending short film that turns an everyday morning routine into something unsettling. Shot entirely on iPhone and created with friends in 2024. The project explores suspense, visual storytelling and an unexpected twist using minimal resources.",
    duration: "4 MIN",
    format_specs: "4K • COLOR • SUSPENSE",
    tags: ["FILMMAKING", "SHORT FILM", "SUSPENSE", "THRILLER", "IPHONE"],
    description:
      "A suspenseful and mind-bending short film that turns an everyday morning routine into something unsettling. Shot entirely on iPhone and created with friends in 2024.",
    process: ["Story development", "Direction on set", "Editing and post-production"],
    visuals: "Video, poster, film stills",
    image: "/assets/project-toothpaste.webp",
    hero_image: "/assets/project-toothpaste.webp",
    thumbnail_image: "/assets/project-toothpaste.webp",
    featured_thumbnail: "/assets/project-toothpaste.webp",
    gallery_images: ["/assets/project-toothpaste.webp"],
    gallery_items: [{ url: "/assets/project-toothpaste.webp", category: "Film Stills", caption: "Morning bathroom routine stillness" }],
    has_video: true,
    video_id: "JBkb8iHCOh4",
    video_config: {
      videoId: "JBkb8iHCOh4",
      videoUrl: "https://www.youtube.com/watch?v=JBkb8iHCOh4",
      title: "Toothpaste — Short Film",
      type: "youtube",
    },
    team_credits: [
      { name: "Rohith V", role: "Story / Direction / Editing", visible: true },
      { name: "Yashwanth VK", role: "DOP / Cast", visible: true },
      { name: "Ramu", role: "Cast", visible: true },
      { name: "Govarthan", role: "Music", visible: true },
    ],
    project_links: [
      { label: "Watch on YouTube", url: "https://www.youtube.com/watch?v=JBkb8iHCOh4", platform: "YouTube", visible: true },
    ],
    section_visibility: {
      hero: true,
      story: true,
      video: true,
      gallery: true,
      beforeAfter: false,
      vfxBreakdown: true,
      team: true,
      credits: true,
      awards: true,
      links: true,
      comments: true,
    },
    full_credits: "Story / Direction / Editing: Rohith V\n\nDOP: Yashwanth VK\n\nMusic: Govarthan",
    emotional_descriptor: "An idea turned into a visual experience.",
    what_i_felt:
      "The everyday can become unsettling with the right perspective. This film taught me that suspense lives in the details we usually ignore.",
    publish_status: "PUBLISHED",
  },
  {
    slug: "kadalar",
    number: "03",
    title: "Kadalar",
    type: "Pilot Film",
    role: "CG Artist — Selected CGI Contribution",
    category: "VFX / CG",
    year: "2024",
    status: "Completed",
    logline: "Atmospheric CGI enhancements for director Siva Murugan's narrative pilot.",
    synopsis:
      "Pilot film directed by Siva Murugan. Contributed to selected CGI work including Candle CGI and News CGI. Some CGI had already been worked on by another CG artist before this contribution.",
    duration: "PILOT",
    format_specs: "VFX / CGI INTEGRATION",
    tags: ["VFX", "CGI", "BLENDER", "PILOT FILM", "COMPOSITING"],
    description:
      "Pilot film directed by Siva Murugan. Contributed to selected CGI work including Candle CGI and News CGI. Some CGI had already been worked on by another CG artist before this contribution.",
    process: [
      "Candle CGI contribution",
      "News CGI contribution",
      "CG-based visual development",
      "Post-production support",
    ],
    visuals: "Images, actual before/after CGI images, VFX material",
    image: "/assets/project-kadalar.webp",
    hero_image: "/assets/project-kadalar.webp",
    thumbnail_image: "/assets/project-kadalar.webp",
    featured_thumbnail: "/assets/project-kadalar.webp",
    gallery_images: ["/assets/project-kadalar.webp"],
    gallery_items: [{ url: "/assets/project-kadalar.webp", category: "VFX", caption: "Key frame visual tone & lighting" }],
    vfx_breakdowns: [
      {
        id: "vfx-1",
        title: "Candle Light & Smoke CGI Simulation",
        finalMedia: "/assets/project-kadalar.webp",
        description: "Simulating dynamic candle flicker and volumetric smoke elements integrated seamlessly.",
        softwareTools: ["Blender", "After Effects"],
        order: 1,
      },
    ],
    team_credits: [
      { name: "Siva Murugan", role: "Director", visible: true },
      { name: "Rohith V", role: "CG Artist (Candle & News CGI)", visible: true },
    ],
    section_visibility: {
      hero: true,
      story: true,
      video: false,
      gallery: true,
      beforeAfter: true,
      vfxBreakdown: true,
      team: true,
      credits: true,
      awards: true,
      links: true,
      comments: true,
    },
    full_credits: "Director: Siva Murugan\n\nCG Artist — Selected CGI Contribution: Rohith V",
    emotional_descriptor: "Where the frame carries the feeling.",
    what_i_felt:
      "Collaborating on a pilot film showed me how CGI should serve the story, not just look cool. Every effect had to have emotional weight.",
    publish_status: "PUBLISHED",
  },
  {
    slug: "radhal",
    number: "04",
    title: "Radhal",
    type: "Pilot Film",
    role: "Assistant Writer — Script & Screenplay",
    category: "FILMMAKING",
    year: "2025",
    status: "In Pre-Production",
    logline: "An intense narrative screenplay exploring unspoken human depths.",
    synopsis:
      "Upcoming pilot film project. Currently serving as Assistant Writer for script and screenplay development. The screenplay is currently being developed.",
    duration: "IN DEVELOPMENT",
    format_specs: "SCREENPLAY / PRE-PRODUCTION",
    tags: ["WRITING", "SCREENPLAY", "PRE-PRODUCTION", "NARRATIVE"],
    description:
      "Upcoming pilot film project. Currently serving as Assistant Writer for script and screenplay development. The screenplay is currently being developed.",
    process: [
      "Story structure development",
      "Scene development",
      "Narrative planning",
      "Script and screenplay assistance",
    ],
    visuals: "Screenplay material, pre-production material",
    image: "/assets/project-radhal.webp",
    hero_image: "/assets/project-radhal.webp",
    thumbnail_image: "/assets/project-radhal.webp",
    featured_thumbnail: "/assets/project-radhal.webp",
    gallery_images: ["/assets/project-radhal.webp"],
    gallery_items: [{ url: "/assets/project-radhal.webp", category: "Production", caption: "Screenplay drafts & visual moodboard" }],
    team_credits: [
      { name: "Rohith V", role: "Assistant Writer — Script & Screenplay", visible: true },
    ],
    section_visibility: {
      hero: true,
      story: true,
      video: false,
      gallery: true,
      beforeAfter: false,
      vfxBreakdown: false,
      team: true,
      credits: true,
      awards: true,
      links: true,
      comments: true,
    },
    full_credits: "Status: In Pre-Production\n\nRole: Assistant Writer — Script & Screenplay",
    emotional_descriptor: "A story that stays after the frame ends.",
    what_i_felt:
      "Screenwriting taught me that every line must earn its place. This ongoing project is about patience and finding the right word at the right moment.",
    publish_status: "PUBLISHED",
  },
];

export async function ensureProjectsSeeded() {
  try {
    const { count, error } = await (supabaseAdmin as any)
      .from("projects")
      .select("*", { count: "exact", head: true });

    if (!error && (count === null || count === 0)) {
      console.log("Auto-seeding default film projects into Supabase...");
      for (const proj of defaultFilmProjectsSeed) {
        await (supabaseAdmin as any)
          .from("projects")
          .upsert(proj, { onConflict: "slug" });
      }
      console.log("✓ Successfully seeded film projects into Supabase");
    }
  } catch (err) {
    console.warn("Auto-seeding check error (table may be initializing):", err);
  }
}

export function formatProjectForSupabase(project: any) {
  const isDraft = project.publishStatus === "DRAFT" || project.status === "DRAFT";

  const supabaseProject: Record<string, any> = {
    slug: project.slug ? project.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") : "",
    number: project.number || "01",
    title: project.title || "",
    type: project.type || "Short Film",
    role: project.role || "Director",
    category: project.category || "FILMMAKING",
    description: project.description || project.synopsis || "",
    visuals: project.visuals || "Film stills",
    image: project.image || project.thumbnailImage || project.heroImage || "",
    process: Array.isArray(project.process) ? project.process : [],
    year: project.year || null,
    status: isDraft ? "DRAFT" : (project.status || "Completed"),
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
    publish_status: isDraft ? "DRAFT" : "PUBLISHED",

    // CMS v2 columns
    hero_image: project.heroImage || project.image || null,
    thumbnail_image: project.thumbnailImage || project.image || null,
    featured_thumbnail: project.featuredThumbnail || project.image || null,
    og_image: project.ogImage || null,
    image_alt: project.imageAlt || `${project.title || "Project"} — ${project.type || "Film"}`,
    logline: project.logline || null,
    synopsis: project.synopsis || project.description || null,
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
          await ensureProjectsSeeded();

          const { data, error } = await (supabaseAdmin as any)
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

          return new Response(JSON.stringify({ projects: data || [] }), {
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

          const cookieHeader = request.headers.get("cookie");
          const adminSessionMatch = cookieHeader?.match(/admin_session=([^;]+)/);

          if (!adminSessionMatch || !adminSessionMatch[1] || !(await verifyAdminToken(adminSessionMatch[1]))) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please login as admin." }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!project || !project.title || !project.slug) {
            return new Response(JSON.stringify({ error: "Project title and slug are required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const supabaseProject = formatProjectForSupabase(project);

          const { data: newProject, error } = await (supabaseAdmin as any)
            .from("projects")
            .insert(supabaseProject)
            .select()
            .single();

          if (error) {
            console.error("[API POST /api/projects] Error creating project:", error);
            return new Response(JSON.stringify({ error: error.message || "Failed to create project in database" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ project: newProject }), {
            status: 201,
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
