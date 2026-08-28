import oneLastDay from "@/assets/project-one-last-day.webp";
import kadalar from "@/assets/project-kadalar.webp";
import radhal from "@/assets/project-radhal.webp";
import toothpaste from "@/assets/project-toothpaste.webp";
import oneLastDayPoster from "@/assets/one-last-day-poster.webp";
import oneLastDayBefore from "@/assets/one-last-day-before-cg.webp";
import oneLastDayAfter from "@/assets/one-last-day-after-cg.webp";
import { resolveImageUrl } from "@/lib/asset-resolver";

export interface GalleryItem {
  id?: string;
  url: string;
  category?: "Film Stills" | "BTS" | "VFX" | "Production" | string;
  caption?: string;
  order?: number;
}

export interface BeforeAfterPair {
  id: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  description?: string;
}

export interface VFXBreakdownItem {
  id: string;
  title: string;
  finalMedia: string;
  beforeMedia?: string;
  processMedia?: string;
  description?: string;
  softwareTools?: string[];
  order?: number;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  socialLink?: string;
  visible?: boolean;
}

export interface AwardItem {
  id?: string;
  name: string;
  organization?: string;
  year?: string;
  certificateUrl?: string;
  description?: string;
  visible?: boolean;
}

export interface ProjectLinkItem {
  id?: string;
  label: string;
  url: string;
  platform?: "YouTube" | "Vimeo" | "IMDb" | "Instagram" | "Watch Film" | "Other" | string;
  visible?: boolean;
}

export interface SectionVisibility {
  hero: boolean;
  story: boolean;
  video: boolean;
  gallery: boolean;
  beforeAfter: boolean;
  vfxBreakdown: boolean;
  team: boolean;
  credits: boolean;
  awards: boolean;
  links: boolean;
  comments: boolean;
}

export interface ProjectVideoConfig {
  videoUrl?: string | undefined;
  videoId?: string | undefined;
  title?: string | undefined;
  posterImage?: string | undefined;
  type?: "youtube" | "vimeo" | "mp4" | undefined;
  autoplay?: boolean | undefined;
  muted?: boolean | undefined;
}

export interface ProjectSEOSettings {
  seoTitle?: string | undefined;
  metaDescription?: string | undefined;
  keywords?: string | undefined;
  ogTitle?: string | undefined;
  ogDescription?: string | undefined;
  ogImage?: string | undefined;
  imageAlt?: string | undefined;
  canonicalUrl?: string | undefined;
}

export type Project = {
  slug: string;
  number: string;
  title: string;
  type: string;
  role: string;
  year?: string | undefined;
  status?: string | undefined;
  description: string;
  process: string[];
  visuals: string;
  image: string; // primary cover image
  hasVideo?: boolean | undefined;
  videoId?: string | undefined;
  credits?:
    | {
        role: string;
        name: string;
      }[]
    | undefined;
  fullCredits?: string | undefined;
  category: "FILMMAKING" | "VFX / CG" | "EDITING" | "DESIGN" | "CONTENT";
  posterImage?: string | undefined;
  showBeforeAfter?: boolean | undefined;
  beforeImage?: string | undefined;
  afterImage?: string | undefined;
  galleryImages?: string[] | undefined;
  client?: string | undefined;
  emotionalDescriptor?: string | undefined;
  whatIFelt?: string | undefined;
  publishStatus?: "PUBLISHED" | "DRAFT" | undefined;

  // New Upgrade Fields
  heroImage?: string | undefined;
  thumbnailImage?: string | undefined;
  featuredThumbnail?: string | undefined;
  ogImage?: string | undefined;
  imageAlt?: string | undefined;
  logline?: string | undefined;
  synopsis?: string | undefined;
  directorNote?: string | undefined;
  duration?: string | undefined;
  formatSpecs?: string | undefined;
  tags?: string[] | undefined;
  galleryItems?: GalleryItem[] | undefined;
  beforeAfterPairs?: BeforeAfterPair[] | undefined;
  vfxBreakdowns?: VFXBreakdownItem[] | undefined;
  teamCredits?: TeamMember[] | undefined;
  awards?: AwardItem[] | undefined;
  projectLinks?: ProjectLinkItem[] | undefined;
  sectionVisibility?: SectionVisibility | undefined;
  videoConfig?: ProjectVideoConfig | undefined;
  seoSettings?: ProjectSEOSettings | undefined;
};

export const defaultSectionVisibility: SectionVisibility = {
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
};

// Default fallback projects
export const defaultProjects: Project[] = [
  {
    slug: "one-last-day",
    number: "01",
    title: "One Last Day",
    type: "Short Film",
    role: "Story • Screenplay • Director • Editor • DI",
    year: "2023",
    status: "Released",
    logline: "A heartfelt story of silence, regret, and final goodbyes.",
    synopsis:
      "A heartfelt story of silence, regret and final goodbyes. This was Rohith V's first short film attempt, made without prior filmmaking experience. Shot entirely on iPhone with zero budget. The project became a major learning experience through experimentation, mistakes, storytelling, direction, editing and teamwork.",
    directorNote:
      "My first film was about learning through mistakes. Every limitation became creative opportunity. The silence in the film reflects how I learned to let frames breathe.",
    duration: "10 MIN",
    formatSpecs: "4K • COLOR • 2.39:1 • IPHONE",
    tags: ["FILMMAKING", "SHORT FILM", "DRAMA", "DIRECTION", "EDITING", "IPHONE"],
    description:
      "A heartfelt story of silence, regret and final goodbyes. This was Rohith V's first short film attempt, made without prior filmmaking experience. Shot entirely on iPhone with zero budget. The project became a major learning experience through experimentation, mistakes, storytelling, direction, editing and teamwork.",
    process: [
      "Story and screenplay development",
      "Direction on set",
      "Shot planning and scene composition",
      "Visual storytelling and blocking",
      "Editing and post-production through final cut",
      "DI (Digital Intermediate)",
    ],
    visuals: "Film video, poster, film stills, editing/VFX breakdown",
    image: oneLastDay,
    heroImage: oneLastDay,
    thumbnailImage: oneLastDay,
    featuredThumbnail: oneLastDay,
    posterImage: oneLastDayPoster,
    showBeforeAfter: true,
    beforeImage: oneLastDayBefore,
    afterImage: oneLastDayAfter,
    beforeAfterPairs: [
      {
        id: "pair-1",
        beforeImage: oneLastDayBefore,
        afterImage: oneLastDayAfter,
        beforeLabel: "BEFORE CG",
        afterLabel: "AFTER CG",
        title: "Color Grading & Atmosphere Pass",
        description: "Enhancing the emotive twilight hue and contrast in DaVinci Resolve.",
      },
    ],
    galleryImages: [oneLastDay, oneLastDayPoster],
    galleryItems: [
      { url: oneLastDay, category: "Film Stills", caption: "Deva contemplating the silent departure" },
      { url: oneLastDayPoster, category: "Production", caption: "Official Festival Poster Artwork" },
    ],
    hasVideo: true,
    videoId: "tUnBO1O66Fc",
    videoConfig: {
      videoId: "tUnBO1O66Fc",
      videoUrl: "https://www.youtube.com/watch?v=tUnBO1O66Fc",
      title: "One Last Day — Official Short Film",
      type: "youtube",
    },
    teamCredits: [
      { name: "Rohith V", role: "Director / Writer / Editor / DI", visible: true },
      { name: "Yash Vijay", role: "Lead Actor (Deva)", visible: true },
      { name: "Yashwanth VK", role: "Assistant Director / DOP", visible: true },
      { name: "Danny & Govarthan", role: "Music & Score", visible: true },
    ],
    projectLinks: [
      { label: "Watch Film on YouTube", url: "https://www.youtube.com/watch?v=tUnBO1O66Fc", platform: "YouTube", visible: true },
    ],
    sectionVisibility: { ...defaultSectionVisibility },
    fullCredits:
      "Written / Story / Screenplay / Directed / Edited / DI: Rohith V\n\nCast:\nYash Vijay as Deva\nVarsha\n\nAssistant Director / Script Supervisor:\nYashwanth VK\n\nAssistant Directors:\nRamu\nYukesh\n\nDOP:\nYashwanth VK\nBhuvana\n\nMusic:\nDanny\nGovarthan\n\nDubbing:\nDharshan Karthi as Loran\nYukendiran — VO\n\nCrew:\nRitesh\nYabees\nSalvador Madhavan\n\nSpecial Thanks:\nRegan\nFarwys\n\nShot with: iPhone\nBudget: Zero\nLanguage: Tamil with English essence",
    category: "FILMMAKING",
    emotionalDescriptor: "A story about letting go.",
    whatIFelt:
      "My first film was about learning through mistakes. Every limitation became creative opportunity. The silence in the film reflects how I learned to let frames breathe.",
    publishStatus: "PUBLISHED",
  },
  {
    slug: "toothpaste",
    number: "02",
    title: "Toothpaste",
    type: "Short Film",
    role: "Story • Direction • Editing",
    year: "2024",
    status: "Completed",
    logline: "An everyday morning routine turns into an unsettling psychological twist.",
    synopsis:
      "A suspenseful and mind-bending short film that turns an everyday morning routine into something unsettling. Shot entirely on iPhone and created with friends in 2024. The project explores suspense, visual storytelling and an unexpected twist using minimal resources.",
    duration: "4 MIN",
    formatSpecs: "4K • COLOR • SUSPENSE",
    tags: ["FILMMAKING", "SHORT FILM", "SUSPENSE", "THRILLER", "IPHONE"],
    description:
      "A suspenseful and mind-bending short film that turns an everyday morning routine into something unsettling. Shot entirely on iPhone and created with friends in 2024. The project explores suspense, visual storytelling and an unexpected twist using minimal resources.",
    process: ["Story development", "Direction on set", "Editing and post-production"],
    visuals: "Video, poster, film stills",
    image: toothpaste,
    heroImage: toothpaste,
    thumbnailImage: toothpaste,
    featuredThumbnail: toothpaste,
    galleryImages: [toothpaste],
    galleryItems: [{ url: toothpaste, category: "Film Stills", caption: "Morning bathroom routine stillness" }],
    hasVideo: true,
    videoId: "JBkb8iHCOh4",
    videoConfig: {
      videoId: "JBkb8iHCOh4",
      videoUrl: "https://www.youtube.com/watch?v=JBkb8iHCOh4",
      title: "Toothpaste — Short Film",
      type: "youtube",
    },
    teamCredits: [
      { name: "Rohith V", role: "Story / Direction / Editing", visible: true },
      { name: "Yashwanth VK", role: "DOP / Cast", visible: true },
      { name: "Ramu", role: "Cast", visible: true },
      { name: "Govarthan", role: "Music", visible: true },
    ],
    projectLinks: [
      { label: "Watch on YouTube", url: "https://www.youtube.com/watch?v=JBkb8iHCOh4", platform: "YouTube", visible: true },
    ],
    sectionVisibility: { ...defaultSectionVisibility, beforeAfter: false },
    fullCredits:
      "Story / Direction / Editing: Rohith V\n\nDOP: Yashwanth VK\n\nAssistant Directors:\nYukesh\nYash Vijay\n\nCast:\nRamu\nYashwanth VK\n\nMusic: Govarthan",
    category: "FILMMAKING",
    emotionalDescriptor: "An idea turned into a visual experience.",
    whatIFelt:
      "The everyday can become unsettling with the right perspective. This film taught me that suspense lives in the details we usually ignore.",
    publishStatus: "PUBLISHED",
  },
  {
    slug: "kadalar",
    number: "03",
    title: "Kadalar",
    type: "Pilot Film",
    role: "CG Artist — Selected CGI Contribution",
    year: "2024",
    status: "Completed",
    logline: "Atmospheric CGI enhancements for director Siva Murugan's narrative pilot.",
    synopsis:
      "Pilot film directed by Siva Murugan. Contributed to selected CGI work including Candle CGI and News CGI. Some CGI had already been worked on by another CG artist before this contribution.",
    duration: "PILOT",
    formatSpecs: "VFX / CGI INTEGRATION",
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
    image: kadalar,
    heroImage: kadalar,
    thumbnailImage: kadalar,
    featuredThumbnail: kadalar,
    galleryImages: [kadalar],
    galleryItems: [{ url: kadalar, category: "VFX", caption: "Key frame visual tone & lighting" }],
    vfxBreakdowns: [
      {
        id: "vfx-1",
        title: "Candle Light & Smoke CGI Simulation",
        finalMedia: kadalar,
        description: "Simulating dynamic candle flicker and volumetric smoke elements integrated seamlessly.",
        softwareTools: ["Blender", "After Effects"],
        order: 1,
      },
      {
        id: "vfx-2",
        title: "Broadcast Screen Replacement & News CGI",
        finalMedia: kadalar,
        description: "Realistic surface reflections, CRT scanline generation, and news overlay compositing.",
        softwareTools: ["After Effects", "Photoshop"],
        order: 2,
      },
    ],
    teamCredits: [
      { name: "Siva Murugan", role: "Director", visible: true },
      { name: "Rohith V", role: "CG Artist (Candle & News CGI)", visible: true },
    ],
    sectionVisibility: { ...defaultSectionVisibility, video: false },
    fullCredits:
      "Director: Siva Murugan\n\nCG Artist — Selected CGI Contribution: Rohith V\n\n(Contributed to Candle CGI and News CGI)",
    category: "VFX / CG",
    emotionalDescriptor: "Where the frame carries the feeling.",
    whatIFelt:
      "Collaborating on a pilot film showed me how CGI should serve the story, not just look cool. Every effect had to have emotional weight.",
    publishStatus: "PUBLISHED",
  },
  {
    slug: "radhal",
    number: "04",
    title: "Radhal",
    type: "Pilot Film",
    role: "Assistant Writer — Script & Screenplay",
    year: "2025",
    status: "In Pre-Production",
    logline: "An intense narrative screenplay exploring unspoken human depths.",
    synopsis:
      "Upcoming pilot film project. Currently serving as Assistant Writer for script and screenplay development. The screenplay is currently being developed.",
    duration: "IN DEVELOPMENT",
    formatSpecs: "SCREENPLAY / PRE-PRODUCTION",
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
    image: radhal,
    heroImage: radhal,
    thumbnailImage: radhal,
    featuredThumbnail: radhal,
    galleryImages: [radhal],
    galleryItems: [{ url: radhal, category: "Production", caption: "Screenplay drafts & visual moodboard" }],
    teamCredits: [
      { name: "Rohith V", role: "Assistant Writer — Script & Screenplay", visible: true },
    ],
    sectionVisibility: { ...defaultSectionVisibility, video: false, beforeAfter: false, vfxBreakdown: false },
    fullCredits: "Status: In Pre-Production\n\nRole: Assistant Writer — Script & Screenplay",
    category: "FILMMAKING",
    emotionalDescriptor: "A story that stays after the frame ends.",
    whatIFelt:
      "Screenwriting taught me that every line must earn its place. This ongoing project is about patience and finding the right word at the right moment.",
    publishStatus: "PUBLISHED",
  },
];

import { supabase } from "@/integrations/supabase/client";

export function transformSupabaseProject(p: any): Project {
  // Parse gallery items if structured, or convert string array
  let galleryItems: GalleryItem[] = [];
  if (Array.isArray(p.gallery_items) && p.gallery_items.length > 0) {
    galleryItems = p.gallery_items.map((item: any) => ({
      ...item,
      url: resolveImageUrl(item.url || item.image || ""),
    }));
  } else if (Array.isArray(p.gallery_images)) {
    galleryItems = p.gallery_images.map((img: string, i: number) => ({
      url: resolveImageUrl(img),
      category: "Film Stills",
      order: i,
    }));
  }

  // Parse before/after pairs
  let beforeAfterPairs: BeforeAfterPair[] = [];
  if (Array.isArray(p.before_after_pairs) && p.before_after_pairs.length > 0) {
    beforeAfterPairs = p.before_after_pairs.map((pair: any) => ({
      ...pair,
      beforeImage: resolveImageUrl(pair.beforeImage || pair.before_image || ""),
      afterImage: resolveImageUrl(pair.afterImage || pair.after_image || ""),
    }));
  } else if (p.before_image && p.after_image) {
    beforeAfterPairs = [
      {
        id: "pair-primary",
        beforeImage: resolveImageUrl(p.before_image),
        afterImage: resolveImageUrl(p.after_image),
        beforeLabel: "BEFORE",
        afterLabel: "AFTER",
      },
    ];
  }

  // Parse VFX breakdowns
  let vfxBreakdowns: VFXBreakdownItem[] = [];
  if (Array.isArray(p.vfx_breakdowns) && p.vfx_breakdowns.length > 0) {
    vfxBreakdowns = p.vfx_breakdowns.map((vfx: any) => ({
      ...vfx,
      finalMedia: resolveImageUrl(vfx.finalMedia || vfx.final_media || ""),
      beforeMedia: vfx.beforeMedia ? resolveImageUrl(vfx.beforeMedia) : undefined,
      processMedia: vfx.processMedia ? resolveImageUrl(vfx.processMedia) : undefined,
    }));
  }

  // Parse structured team credits
  let teamCredits: TeamMember[] = [];
  if (Array.isArray(p.team_credits) && p.team_credits.length > 0) {
    teamCredits = p.team_credits.map((m: any) => ({
      ...m,
      avatarUrl: m.avatarUrl ? resolveImageUrl(m.avatarUrl) : undefined,
      visible: m.visible !== false,
    }));
  }

  // Parse awards
  let awards: AwardItem[] = [];
  if (Array.isArray(p.awards) && p.awards.length > 0) {
    awards = p.awards.map((a: any) => ({
      ...a,
      certificateUrl: a.certificateUrl ? resolveImageUrl(a.certificateUrl) : undefined,
      visible: a.visible !== false,
    }));
  }

  // Parse project links
  let projectLinks: ProjectLinkItem[] = [];
  if (Array.isArray(p.project_links) && p.project_links.length > 0) {
    projectLinks = p.project_links.filter((l: any) => l.visible !== false);
  }

  // Parse section visibility
  const sectionVisibility: SectionVisibility = {
    ...defaultSectionVisibility,
    ...(typeof p.section_visibility === "object" && p.section_visibility !== null ? p.section_visibility : {}),
  };

  // Video config
  const videoConfig: ProjectVideoConfig = typeof p.video_config === "object" && p.video_config !== null
    ? {
        ...p.video_config,
        videoId: p.video_config.videoId || p.video_id || undefined,
        posterImage: p.video_config.posterImage ? resolveImageUrl(p.video_config.posterImage) : undefined,
      }
    : {
        videoId: p.video_id || undefined,
        posterImage: p.poster_image ? resolveImageUrl(p.poster_image) : undefined,
        type: "youtube",
      };

  // SEO settings
  const seoSettings: ProjectSEOSettings = typeof p.seo_settings === "object" && p.seo_settings !== null
    ? {
        ...p.seo_settings,
        ogImage: p.seo_settings.ogImage ? resolveImageUrl(p.seo_settings.ogImage) : undefined,
      }
    : {
        seoTitle: p.title ? `${p.title} — ${p.type || "Film"} | Rohith V` : undefined,
        metaDescription: p.description || undefined,
      };

  return {
    slug: p.slug,
    number: p.number,
    title: p.title,
    type: p.type,
    role: p.role,
    year: p.year || undefined,
    status: p.status || undefined,
    description: p.description || "",
    process: Array.isArray(p.process) ? p.process : [],
    visuals: p.visuals || "",
    image: resolveImageUrl(p.image || ""),
    hasVideo: Boolean(p.has_video || videoConfig.videoId || videoConfig.videoUrl),
    videoId: p.video_id || videoConfig.videoId || undefined,
    fullCredits: p.full_credits || undefined,
    category: p.category || "FILMMAKING",
    posterImage: p.poster_image ? resolveImageUrl(p.poster_image) : undefined,
    showBeforeAfter: Boolean(p.show_before_after || beforeAfterPairs.length > 0),
    beforeImage: p.before_image ? resolveImageUrl(p.before_image) : undefined,
    afterImage: p.after_image ? resolveImageUrl(p.after_image) : undefined,
    galleryImages: Array.isArray(p.gallery_images)
      ? p.gallery_images.map(resolveImageUrl)
      : galleryItems.map((g) => g.url),
    client: p.client || undefined,
    emotionalDescriptor: p.emotional_descriptor || undefined,
    whatIFelt: p.what_i_felt || undefined,
    publishStatus: (p.publish_status === "DRAFT" || p.status === "DRAFT") ? "DRAFT" : "PUBLISHED",

    // New Fields
    heroImage: p.hero_image ? resolveImageUrl(p.hero_image) : resolveImageUrl(p.image || ""),
    thumbnailImage: p.thumbnail_image ? resolveImageUrl(p.thumbnail_image) : resolveImageUrl(p.image || ""),
    featuredThumbnail: p.featured_thumbnail ? resolveImageUrl(p.featured_thumbnail) : resolveImageUrl(p.image || ""),
    ogImage: p.og_image ? resolveImageUrl(p.og_image) : (seoSettings.ogImage || resolveImageUrl(p.image || "")),
    imageAlt: p.image_alt || `${p.title} — ${p.type || "Film"}`,
    logline: p.logline || p.emotional_descriptor || undefined,
    synopsis: p.synopsis || p.description || undefined,
    directorNote: p.director_note || p.what_i_felt || undefined,
    duration: p.duration || undefined,
    formatSpecs: p.format_specs || undefined,
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : [p.category || "FILMMAKING"],
    galleryItems: galleryItems.length > 0 ? galleryItems : undefined,
    beforeAfterPairs: beforeAfterPairs.length > 0 ? beforeAfterPairs : undefined,
    vfxBreakdowns: vfxBreakdowns.length > 0 ? vfxBreakdowns : undefined,
    teamCredits: teamCredits.length > 0 ? teamCredits : undefined,
    awards: awards.length > 0 ? awards : undefined,
    projectLinks: projectLinks.length > 0 ? projectLinks : undefined,
    sectionVisibility,
    videoConfig,
    seoSettings,
  };
}

// Get projects directly from Supabase (works universally in SSR, serverless, and browser client)
export async function getProjects(includeDrafts = false): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("number", { ascending: true });

    if (!error && data && data.length > 0) {
      const transformed = data.map(transformSupabaseProject);
      return includeDrafts ? transformed : transformed.filter((p) => p.publishStatus !== "DRAFT");
    }

    if (error) {
      console.warn("Supabase query returned error, trying API endpoint:", error);
    }

    // If running in browser and direct query failed, try API route as secondary option
    if (typeof window !== "undefined") {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const json = await response.json();
        if (json.projects && Array.isArray(json.projects)) {
          const transformed = json.projects.map(transformSupabaseProject);
          return includeDrafts ? transformed : transformed.filter((p: Project) => p.publishStatus !== "DRAFT");
        }
      }
    }

    if (error) {
      throw error;
    }

    const transformed = (data || []).map(transformSupabaseProject);
    return includeDrafts ? transformed : transformed.filter((p: Project) => p.publishStatus !== "DRAFT");
  } catch (error) {
    console.error("getProjects error, falling back to default projects:", error);
    return includeDrafts ? defaultProjects : defaultProjects.filter((p) => p.publishStatus !== "DRAFT");
  }
}

// Legacy export for backward compatibility
export const projects = defaultProjects;

export const getProject = async (slug: string): Promise<Project | undefined> => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return transformSupabaseProject(data);
    }
  } catch (error) {
    console.warn(`Direct getProject query for ${slug} failed, checking project list:`, error);
  }

  const projectsList = await getProjects(true);
  return projectsList.find((p) => p.slug === slug);
};
