// Website Site Images Data Layer & Utilities

import defaultHeroStreet from "@/assets/hero-street.webp";
import defaultAboutEditRoom from "@/assets/about-editroom.webp";
import defaultDmHero from "@/assets/digital marketing hero.jpg";
import defaultCreative1 from "@/assets/1-creative.jpg";
import defaultCreative2 from "@/assets/2-cerative.jpg";
import defaultCreative3 from "@/assets/3 creative.jpg";

export interface SiteImagesData {
  heroImage: string;
  aboutImage: string;
  digitalMarketingHero: string;
  creative1: string;
  creative2: string;
  creative3: string;
}

export const defaultSiteImages: SiteImagesData = {
  heroImage: defaultHeroStreet,
  aboutImage: defaultAboutEditRoom,
  digitalMarketingHero: defaultDmHero,
  creative1: defaultCreative1,
  creative2: defaultCreative2,
  creative3: defaultCreative3,
};

export interface SiteImageMeta {
  key: keyof SiteImagesData;
  label: string;
  description: string;
  aspectRatio: "16/9" | "21/9" | "3/4" | "4/3" | "square";
  category: "Homepage" | "About" | "Digital Marketing";
}

export const siteImageDefinitions: SiteImageMeta[] = [
  {
    key: "heroImage",
    label: "Homepage Hero Backdrop",
    description: "Rain-lit street / cinematic background for the main portfolio hero section.",
    aspectRatio: "16/9",
    category: "Homepage",
  },
  {
    key: "aboutImage",
    label: "About Page Editing Room Portrait",
    description: "Dimly lit edit room / filmmaker portrait on the About page.",
    aspectRatio: "3/4",
    category: "About",
  },
  {
    key: "digitalMarketingHero",
    label: "Digital Marketing Hero Banner",
    description: "Main visual banner for the Digital Marketing & Commercials page.",
    aspectRatio: "21/9",
    category: "Digital Marketing",
  },
  {
    key: "creative1",
    label: "01 — Cinematic Brand Films Cover",
    description: "Visual asset for story-driven brand commercials and documentaries.",
    aspectRatio: "16/9",
    category: "Digital Marketing",
  },
  {
    key: "creative2",
    label: "02 — Social Reels & Shorts Cover",
    description: "Visual asset for high-hook vertical video and episodic social content.",
    aspectRatio: "16/9",
    category: "Digital Marketing",
  },
  {
    key: "creative3",
    label: "03 — Performance Ad Creatives Cover",
    description: "Visual asset for direct-response Meta & Google video ad campaigns.",
    aspectRatio: "16/9",
    category: "Digital Marketing",
  },
];

import { resolveImageUrl } from "./asset-resolver";

/**
 * Normalizes URL string and resolves local/Supabase assets
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";
  return resolveImageUrl(url.trim());
}

/**
 * Fetches current website images from Supabase / API route
 */
export async function getSiteImages(): Promise<SiteImagesData> {
  try {
    // If client-side, try API route
    if (typeof window !== "undefined") {
      const response = await fetch("/api/site-images");
      if (response.ok) {
        const data = await response.json();
        return {
          heroImage: normalizeImageUrl(data.heroImage) || defaultSiteImages.heroImage,
          aboutImage: normalizeImageUrl(data.aboutImage) || defaultSiteImages.aboutImage,
          digitalMarketingHero:
            normalizeImageUrl(data.digitalMarketingHero) || defaultSiteImages.digitalMarketingHero,
          creative1: normalizeImageUrl(data.creative1) || defaultSiteImages.creative1,
          creative2: normalizeImageUrl(data.creative2) || defaultSiteImages.creative2,
          creative3: normalizeImageUrl(data.creative3) || defaultSiteImages.creative3,
        };
      }
    }

    // Direct Supabase storage public URL
    const publicUrl =
      "https://rgbzjfyosfcvskfkzecu.supabase.co/storage/v1/object/public/portfolio-media/config/site-images.json";
    const res = await fetch(publicUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        heroImage: normalizeImageUrl(data.heroImage) || defaultSiteImages.heroImage,
        aboutImage: normalizeImageUrl(data.aboutImage) || defaultSiteImages.aboutImage,
        digitalMarketingHero:
          normalizeImageUrl(data.digitalMarketingHero) || defaultSiteImages.digitalMarketingHero,
        creative1: normalizeImageUrl(data.creative1) || defaultSiteImages.creative1,
        creative2: normalizeImageUrl(data.creative2) || defaultSiteImages.creative2,
        creative3: normalizeImageUrl(data.creative3) || defaultSiteImages.creative3,
      };
    }
  } catch (error) {
    console.warn("Failed to load site images from Supabase, using default:", error);
  }

  return defaultSiteImages;
}

/**
 * Updates site images in Supabase via Admin API
 */
export async function updateSiteImages(images: Partial<SiteImagesData>): Promise<SiteImagesData> {
  const response = await fetch("/api/site-images", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ siteImages: images }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update website images in Supabase");
  }

  const result = await response.json();
  return result.siteImages;
}
