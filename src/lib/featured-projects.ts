// Featured Projects Data Layer & Types

export interface FeaturedProjectsData {
  featuredSlugs: string[]; // Order matters: 01, 02, 03...
  updatedAt?: string;
}

export const defaultFeaturedProjects: FeaturedProjectsData = {
  featuredSlugs: ["one-last-day", "toothpaste", "kadalar", "radhal"],
};

export async function getFeaturedProjects(): Promise<FeaturedProjectsData> {
  try {
    if (typeof window !== "undefined") {
      const response = await fetch("/api/featured-projects");
      if (response.ok) {
        const data = await response.json();
        return {
          ...defaultFeaturedProjects,
          ...data,
          featuredSlugs: Array.isArray(data.featuredSlugs) && data.featuredSlugs.length > 0
            ? data.featuredSlugs
            : defaultFeaturedProjects.featuredSlugs,
        };
      }
    }

    const publicUrl =
      "https://rgbzjfyosfcvskfkzecu.supabase.co/storage/v1/object/public/portfolio-media/config/featured-projects.json";
    const res = await fetch(publicUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        ...defaultFeaturedProjects,
        ...data,
        featuredSlugs: Array.isArray(data.featuredSlugs) && data.featuredSlugs.length > 0
          ? data.featuredSlugs
          : defaultFeaturedProjects.featuredSlugs,
      };
    }
  } catch (error) {
    console.warn("Failed to load featured projects from Supabase, using default:", error);
  }

  return defaultFeaturedProjects;
}

export async function updateFeaturedProjects(
  data: Partial<FeaturedProjectsData>
): Promise<FeaturedProjectsData> {
  const response = await fetch("/api/featured-projects", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ featuredProjects: data }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update featured projects");
  }

  const result = await response.json();
  return result.featuredProjects;
}
