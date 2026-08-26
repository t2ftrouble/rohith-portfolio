import oneLastDay from "@/assets/project-one-last-day.webp";
import kadalar from "@/assets/project-kadalar.webp";
import radhal from "@/assets/project-radhal.webp";
import toothpaste from "@/assets/project-toothpaste.webp";
import oneLastDayPoster from "@/assets/one-last-day-poster.webp";
import oneLastDayBefore from "@/assets/one-last-day-before-cg.webp";
import oneLastDayAfter from "@/assets/one-last-day-after-cg.webp";
import { resolveImageUrl } from "@/lib/asset-resolver";
import { supabase } from "@/integrations/supabase/client";

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
  image: string;
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
    posterImage: oneLastDayPoster,
    showBeforeAfter: true,
    beforeImage: oneLastDayBefore,
    afterImage: oneLastDayAfter,
    galleryImages: [oneLastDay, oneLastDayPoster],
    hasVideo: true,
    videoId: "tUnBO1O66Fc",
    fullCredits:
      "Written / Story / Screenplay / Directed / Edited / DI: Rohith V\n\nCast:\nYash Vijay as Deva\nVarsha\n\nAssistant Director / Script Supervisor:\nYashwanth VK\n\nAssistant Directors:\nRamu\nYukesh\n\nDOP:\nYashwanth VK\nBhuvana\n\nMusic:\nDanny\nGovarthan\n\nDubbing:\nDharshan Karthi as Loran\nYukendiran — VO\n\nCrew:\nRitesh\nYabees\nSalvador Madhavan\n\nSpecial Thanks:\nRegan\nFarwys\n\nShot with: iPhone\nBudget: Zero\nLanguage: Tamil with English essence",
    category: "FILMMAKING",
    emotionalDescriptor: "A story about letting go.",
    whatIFelt:
      "My first film was about learning through mistakes. Every limitation became creative opportunity. The silence in the film reflects how I learned to let frames breathe.",
  },
  {
    slug: "toothpaste",
    number: "02",
    title: "Toothpaste",
    type: "Short Film",
    role: "Story • Direction • Editing",
    year: "2024",
    status: "Completed",
    description:
      "A suspenseful and mind-bending short film that turns an everyday morning routine into something unsettling. Shot entirely on iPhone and created with friends in 2024. The project explores suspense, visual storytelling and an unexpected twist using minimal resources.",
    process: ["Story development", "Direction on set", "Editing and post-production"],
    visuals: "Video, poster, film stills",
    image: toothpaste,
    galleryImages: [toothpaste],
    hasVideo: true,
    videoId: "JBkb8iHCOh4",
    fullCredits:
      "Story / Direction / Editing: Rohith V\n\nDOP: Yashwanth VK\n\nAssistant Directors:\nYukesh\nYash Vijay\n\nCast:\nRamu\nYashwanth VK\n\nMusic: Govarthan",
    category: "FILMMAKING",
    emotionalDescriptor: "An idea turned into a visual experience.",
    whatIFelt:
      "The everyday can become unsettling with the right perspective. This film taught me that suspense lives in the details we usually ignore.",
  },
  {
    slug: "kadalar",
    number: "03",
    title: "Kadalar",
    type: "Pilot Film",
    role: "CG Artist — Selected CGI Contribution",
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
    galleryImages: [kadalar],
    fullCredits:
      "Director: Siva Murugan\n\nCG Artist — Selected CGI Contribution: Rohith V\n\n(Contributed to Candle CGI and News CGI)",
    category: "VFX / CG",
    emotionalDescriptor: "Where the frame carries the feeling.",
    whatIFelt:
      "Collaborating on a pilot film showed me how CGI should serve the story, not just look cool. Every effect had to have emotional weight.",
  },
  {
    slug: "radhal",
    number: "04",
    title: "Radhal",
    type: "Pilot Film",
    role: "Assistant Writer — Script & Screenplay",
    status: "In Pre-Production",
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
    galleryImages: [radhal],
    fullCredits: "Status: In Pre-Production\n\nRole: Assistant Writer — Script & Screenplay",
    category: "FILMMAKING",
    emotionalDescriptor: "A story that stays after the frame ends.",
    whatIFelt:
      "Screenwriting taught me that every line must earn its place. This ongoing project is about patience and finding the right word at the right moment.",
  },
];

function transformSupabaseProject(p: any): Project {
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
    image: resolveImageUrl(p.image),
    hasVideo: Boolean(p.has_video),
    videoId: p.video_id || undefined,
    fullCredits: p.full_credits || undefined,
    category: p.category || "FILMMAKING",
    posterImage: p.poster_image ? resolveImageUrl(p.poster_image) : undefined,
    showBeforeAfter: Boolean(p.show_before_after),
    beforeImage: p.before_image ? resolveImageUrl(p.before_image) : undefined,
    afterImage: p.after_image ? resolveImageUrl(p.after_image) : undefined,
    galleryImages: Array.isArray(p.gallery_images)
      ? p.gallery_images.map(resolveImageUrl)
      : [],
    client: p.client || undefined,
    emotionalDescriptor: p.emotional_descriptor || undefined,
    whatIFelt: p.what_i_felt || undefined,
  };
}

// Get projects from Supabase (works universally in SSR, server, and client)
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("number", { ascending: true });

    if (error) {
      console.error("Error loading projects from Supabase SDK:", error);
      // Try API route fallback if fetch is available
      if (typeof window !== "undefined") {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const apiData = await response.json();
          if (apiData.projects && Array.isArray(apiData.projects)) {
            return apiData.projects.map(transformSupabaseProject);
          }
        }
      }
      throw new Error(error.message || "Failed to load projects");
    }

    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid projects data from database");
    }

    return data.map(transformSupabaseProject);
  } catch (error) {
    console.error("getProjects error:", error);
    throw error;
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
      .single();

    if (!error && data) {
      return transformSupabaseProject(data);
    }
  } catch (err) {
    console.warn("getProject single fetch fallback to list:", err);
  }

  const projectsList = await getProjects();
  return projectsList.find((p) => p.slug === slug);
};
