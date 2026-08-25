import type { Project } from "@/data/projects";
import { projects as defaultProjects } from "@/data/projects";

export type ProjectFormData = {
  slug: string;
  number: string;
  title: string;
  type: string;
  role: string;
  description: string;
  process: string[];
  visuals: string;
  image: string; // URL for cover image
  category: "FILMMAKING" | "VFX / CG" | "EDITING" | "DESIGN" | "CONTENT";
  year?: string;
  status?: string;
  hasVideo?: boolean;
  videoId?: string;
  credits?: {
    role: string;
    name: string;
  }[];
  fullCredits?: string;
  galleryImages?: string[]; // Array of image URLs
  client?: string | null; // Optional client name
  createdAt?: string | null; // ISO timestamp
  posterImage?: string; // Poster image URL
  showBeforeAfter?: boolean; // Whether to show before/after slider
  beforeImage?: string; // Before image URL
  afterImage?: string; // After image URL
};

export type ProjectCMSData = {
  id: string; // Unique ID for CRUD operations
} & ProjectFormData;

const STORAGE_KEY = "rohith-portfolio-projects";

// Initialize localStorage with default projects if empty
export function initializeProjects(): void {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initialProjects = defaultProjects.map((p) => ({
      ...p,
      id: p.slug,
      galleryImages: [],
      client: undefined,
      createdAt: new Date().toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
  }
}

// Get all projects from localStorage
export function getProjects(): ProjectCMSData[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      initializeProjects();
      return getProjects();
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading projects from localStorage:", error);
    return [];
  }
}

// Get a single project by ID
export function getProjectById(id: string): ProjectCMSData | undefined {
  const projects = getProjects();
  return projects.find((p) => p.id === id);
}

// Add a new project
export function addProject(project: ProjectFormData): ProjectCMSData {
  const projects = getProjects();
  const newProject: ProjectCMSData = {
    id: project.slug || generateId(),
    slug: project.slug,
    number: project.number,
    title: project.title,
    type: project.type,
    role: project.role,
    description: project.description,
    process: project.process,
    visuals: project.visuals,
    image: project.image,
    category: project.category,
    galleryImages: project.galleryImages || [],
    client: project.client || null,
    createdAt: new Date().toISOString(),
  };

  // Add optional fields only if they exist
  if (project.year) newProject.year = project.year;
  if (project.status) newProject.status = project.status;
  if (project.hasVideo !== undefined) newProject.hasVideo = project.hasVideo;
  if (project.videoId) newProject.videoId = project.videoId;
  if (project.credits) newProject.credits = project.credits;
  if (project.fullCredits) newProject.fullCredits = project.fullCredits;
  if (project.posterImage) newProject.posterImage = project.posterImage;
  if (project.showBeforeAfter) newProject.showBeforeAfter = project.showBeforeAfter;
  if (project.beforeImage) newProject.beforeImage = project.beforeImage;
  if (project.afterImage) newProject.afterImage = project.afterImage;

  // Assign next number
  const maxNumber = projects.reduce((max, p) => {
    const num = parseInt(p.number, 10);
    return num > max ? num : max;
  }, 0);
  newProject.number = String(maxNumber + 1).padStart(2, "0");

  projects.push(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  
  // Dispatch custom event to notify other tabs/components
  window.dispatchEvent(new Event("custom-project-update"));
  
  return newProject;
}

// Update an existing project
export function updateProject(id: string, updates: Partial<ProjectFormData>): ProjectCMSData | null {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const existing = projects[index];
  if (!existing) return null;

  const updatedProject: ProjectCMSData = {
    id,
    slug: updates.slug || existing.slug,
    number: updates.number || existing.number,
    title: updates.title || existing.title,
    type: updates.type || existing.type,
    role: updates.role || existing.role,
    description: updates.description || existing.description,
    process: updates.process || existing.process,
    visuals: updates.visuals || existing.visuals,
    image: updates.image || existing.image,
    category: updates.category || existing.category,
    galleryImages: updates.galleryImages !== undefined ? updates.galleryImages : (existing.galleryImages || []),
    client: updates.client !== undefined ? updates.client : (existing.client || null),
    createdAt: existing.createdAt || null,
  };

  // Handle optional fields
  if (updates.year !== undefined) updatedProject.year = updates.year;
  else if (existing.year) updatedProject.year = existing.year;

  if (updates.status !== undefined) updatedProject.status = updates.status;
  else if (existing.status) updatedProject.status = existing.status;

  if (updates.hasVideo !== undefined) updatedProject.hasVideo = updates.hasVideo;
  else if (existing.hasVideo !== undefined) updatedProject.hasVideo = existing.hasVideo;

  if (updates.videoId !== undefined) updatedProject.videoId = updates.videoId;
  else if (existing.videoId) updatedProject.videoId = existing.videoId;

  if (updates.credits !== undefined) updatedProject.credits = updates.credits;
  else if (existing.credits) updatedProject.credits = existing.credits;

  if (updates.fullCredits !== undefined) updatedProject.fullCredits = updates.fullCredits;
  else if (existing.fullCredits) updatedProject.fullCredits = existing.fullCredits;

  if (updates.posterImage !== undefined) updatedProject.posterImage = updates.posterImage;
  else if (existing.posterImage) updatedProject.posterImage = existing.posterImage;

  if (updates.showBeforeAfter !== undefined) updatedProject.showBeforeAfter = updates.showBeforeAfter;
  else if (existing.showBeforeAfter) updatedProject.showBeforeAfter = existing.showBeforeAfter;

  if (updates.beforeImage !== undefined) updatedProject.beforeImage = updates.beforeImage;
  else if (existing.beforeImage) updatedProject.beforeImage = existing.beforeImage;

  if (updates.afterImage !== undefined) updatedProject.afterImage = updates.afterImage;
  else if (existing.afterImage) updatedProject.afterImage = existing.afterImage;

  projects[index] = updatedProject;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  
  // Dispatch custom event to notify other tabs/components
  window.dispatchEvent(new Event("custom-project-update"));
  
  return updatedProject;
}

// Delete a project
export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter((p) => p.id !== id);

  if (filtered.length === projects.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  
  // Dispatch custom event to notify other tabs/components
  window.dispatchEvent(new Event("custom-project-update"));
  
  return true;
}

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Convert CMS data to Project type for use in existing components
export function cmsToProject(cms: ProjectCMSData): Project {
  const { id, galleryImages, client, createdAt, ...project } = cms;
  return project;
}

// Get projects as Project array for existing components
export function getProjectsForDisplay(): Project[] {
  const cmsProjects = getProjects();
  return cmsProjects.map(cmsToProject);
}
