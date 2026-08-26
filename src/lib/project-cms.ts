import type { Project } from "@/data/projects";
import { resolveImageUrl } from "./asset-resolver";

export type ProjectFormData = {
  slug: string;
  number: string;
  title: string;
  type: string;
  role: string;
  description: string;
  process: string[];
  visuals: string;
  image: string; // URL or path for cover image
  category: "FILMMAKING" | "VFX / CG" | "EDITING" | "DESIGN" | "CONTENT";
  year?: string | null | undefined;
  status?: string | null | undefined;
  hasVideo?: boolean | undefined;
  videoId?: string | null | undefined;
  credits?:
    | {
        role: string;
        name: string;
      }[]
    | undefined;
  fullCredits?: string | null | undefined;
  galleryImages?: string[] | undefined; // Array of image URLs
  client?: string | null | undefined;
  createdAt?: string | null | undefined;
  posterImage?: string | null | undefined; // Poster image URL
  showBeforeAfter?: boolean | undefined; // Whether to show before/after slider
  beforeImage?: string | null | undefined; // Before image URL
  afterImage?: string | null | undefined; // After image URL
  emotionalDescriptor?: string | null | undefined; // Short emotional tagline
  whatIFelt?: string | null | undefined; // Personal creative note
};

export type ProjectCMSData = {
  id: string; // Unique ID for CRUD operations
} & ProjectFormData;

// Get all projects from Supabase via API
export async function getProjects(): Promise<ProjectCMSData[]> {
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("Failed to fetch projects from API:", errorData);
      throw new Error(errorData.error || "Failed to fetch projects");
    }
    const data = await response.json();

    if (!data.projects || !Array.isArray(data.projects)) {
      console.error("Invalid response format from API:", data);
      throw new Error("Invalid response format from API");
    }

    // Transform Supabase data to CMS format
    return data.projects.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      number: p.number,
      title: p.title,
      type: p.type,
      role: p.role,
      year: p.year || "",
      status: p.status || "",
      description: p.description || "",
      process: p.process || [],
      visuals: p.visuals || "",
      image: p.image || "",
      category: p.category || "FILMMAKING",
      hasVideo: Boolean(p.has_video),
      videoId: p.video_id || "",
      credits: [],
      fullCredits: p.full_credits || "",
      galleryImages: Array.isArray(p.gallery_images) ? p.gallery_images : [],
      client: p.client || "",
      createdAt: p.created_at,
      posterImage: p.poster_image || "",
      showBeforeAfter: Boolean(p.show_before_after),
      beforeImage: p.before_image || "",
      afterImage: p.after_image || "",
      emotionalDescriptor: p.emotional_descriptor || "",
      whatIFelt: p.what_i_felt || "",
    }));
  } catch (error) {
    console.error("Error loading projects from Supabase:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to load projects from database");
  }
}

// Get a single project by ID
export async function getProjectById(id: string): Promise<ProjectCMSData | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}

// Add a new project
export async function addProject(project: ProjectFormData): Promise<ProjectCMSData> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ project }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Failed to create project" }));
    throw new Error(errorData.error || "Failed to create project");
  }

  const data = await response.json();
  return data.project;
}

// Update an existing project
export async function updateProject(id: string, updates: Partial<ProjectFormData>): Promise<ProjectCMSData> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ project: updates }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Failed to update project" }));
    throw new Error(errorData.error || "Failed to update project");
  }

  const data = await response.json();
  return data.project;
}

// Delete a project
export async function deleteProject(id: string): Promise<boolean> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Failed to delete project" }));
    throw new Error(errorData.error || "Failed to delete project");
  }

  const data = await response.json();
  return data.success;
}

// Convert CMS data to Project type for use in display components
export function cmsToProject(cms: ProjectCMSData): Project {
  return {
    slug: cms.slug,
    number: cms.number,
    title: cms.title,
    type: cms.type,
    role: cms.role,
    year: cms.year ? cms.year : undefined,
    status: cms.status ? cms.status : undefined,
    description: cms.description,
    process: cms.process,
    visuals: cms.visuals,
    image: resolveImageUrl(cms.image),
    category: cms.category,
    hasVideo: cms.hasVideo,
    videoId: cms.videoId ? cms.videoId : undefined,
    fullCredits: cms.fullCredits ? cms.fullCredits : undefined,
    posterImage: cms.posterImage ? resolveImageUrl(cms.posterImage) : undefined,
    showBeforeAfter: cms.showBeforeAfter,
    beforeImage: cms.beforeImage ? resolveImageUrl(cms.beforeImage) : undefined,
    afterImage: cms.afterImage ? resolveImageUrl(cms.afterImage) : undefined,
    galleryImages: cms.galleryImages ? cms.galleryImages.map(resolveImageUrl) : undefined,
    client: cms.client ? cms.client : undefined,
    emotionalDescriptor: cms.emotionalDescriptor ? cms.emotionalDescriptor : undefined,
    whatIFelt: cms.whatIFelt ? cms.whatIFelt : undefined,
  };
}

// Get projects as Project array for display components
export async function getProjectsForDisplay(): Promise<Project[]> {
  const cmsProjects = await getProjects();
  return cmsProjects.map(cmsToProject);
}