// Social Media Links Data Layer & Utilities

export interface SocialLinksData {
  youtube: string;
  instagram: string;
  linkedin: string;
}

export const defaultSocialLinks: SocialLinksData = {
  youtube: "https://www.youtube.com/@trouble_rohii",
  instagram: "https://www.instagram.com/trouble_rohii/",
  linkedin: "https://www.linkedin.com/in/rohith-vijayaragavan-8b0996314/",
};

/**
 * Validates whether a string is a valid web URL or empty (to hide).
 */
export function isValidUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return true; // Empty is valid (means hidden)
  }
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Normalizes URL string
 */
export function normalizeUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";
  return url.trim();
}

/**
 * Fetches current social links from Supabase / API route
 */
export async function getSocialLinks(): Promise<SocialLinksData> {
  try {
    // If client-side, try API route
    if (typeof window !== "undefined") {
      const response = await fetch("/api/social-links");
      if (response.ok) {
        const data = await response.json();
        return {
          youtube: normalizeUrl(data.youtube),
          instagram: normalizeUrl(data.instagram),
          linkedin: normalizeUrl(data.linkedin),
        };
      }
    }

    // Direct Supabase storage public URL
    const publicUrl = "https://rgbzjfyosfcvskfkzecu.supabase.co/storage/v1/object/public/portfolio-media/config/social-links.json";
    const res = await fetch(publicUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        youtube: normalizeUrl(data.youtube),
        instagram: normalizeUrl(data.instagram),
        linkedin: normalizeUrl(data.linkedin),
      };
    }
  } catch (error) {
    console.warn("Failed to load social links from Supabase, using default:", error);
  }

  return defaultSocialLinks;
}

/**
 * Updates social links in Supabase via Admin API
 */
export async function updateSocialLinks(links: SocialLinksData): Promise<SocialLinksData> {
  // Validate URLs before sending
  if (!isValidUrl(links.youtube)) {
    throw new Error("Invalid YouTube URL. Must start with http:// or https://");
  }
  if (!isValidUrl(links.instagram)) {
    throw new Error("Invalid Instagram URL. Must start with http:// or https://");
  }
  if (!isValidUrl(links.linkedin)) {
    throw new Error("Invalid LinkedIn URL. Must start with http:// or https://");
  }

  const response = await fetch("/api/social-links", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      socialLinks: {
        youtube: normalizeUrl(links.youtube),
        instagram: normalizeUrl(links.instagram),
        linkedin: normalizeUrl(links.linkedin),
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Failed to update social links" }));
    throw new Error(errorData.error || "Failed to update social links");
  }

  const data = await response.json();
  return data.socialLinks;
}
