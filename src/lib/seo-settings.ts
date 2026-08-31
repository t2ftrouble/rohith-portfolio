// SEO Settings Data Layer & Types

export interface SeoSettingsData {
  globalTitle: string;
  globalDescription: string;
  globalKeywords: string;
  globalOgImage: string;
  homeTitle: string;
  homeDescription: string;
  portfolioTitle: string;
  portfolioDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  digitalMarketingTitle: string;
  digitalMarketingDescription: string;
  editingTitle?: string;
  editingDescription?: string;
  contactTitle: string;
  contactDescription: string;
  updatedAt?: string;
}

export const defaultSeoSettings: SeoSettingsData = {
  globalTitle: "Rohith V — Filmmaker, Writer, Editor & VFX Artist",
  globalDescription:
    "Rohith V is a Visual Communication student and Filmmaker, Writer, Editor and VFX/CG Artist based in Chennai. Selected work includes One Last Day, Toothpaste, Kadalar and Radhal.",
  globalKeywords:
    "Rohith V, Filmmaker Chennai, Short Films, VFX Artist, Editor, Director, One Last Day, Toothpaste, Kadalar, Radhal, Visual Communication, Video Editing Portfolio",
  globalOgImage: "https://rgbzjfyosfcvskfkzecu.supabase.co/storage/v1/object/public/portfolio-media/hero-street.webp",
  homeTitle: "Rohith V — Filmmaker, Writer, Editor & VFX Artist",
  homeDescription:
    "A cinematic world of frames, story and cuts — selected work by Rohith V, filmmaker based in Chennai.",
  portfolioTitle: "Selected Work — Rohith V | Filmmaker",
  portfolioDescription:
    "Selected film work by Rohith V — short films, pilot films, CG and screenplay credits presented as cinematic chapters.",
  aboutTitle: "The Filmmaker — About Rohith V",
  aboutDescription:
    "Rohith V — Visual Communication student and emerging Filmmaker, Writer, Editor and VFX/CG Artist based in Chennai.",
  digitalMarketingTitle: "Digital Marketing & Video Ads — Rohith V | Cinematic Commercials",
  digitalMarketingDescription:
    "Cinematic commercials, social reels, and high-converting video ads crafted by a filmmaker. Storytelling that stops the scroll.",
  editingTitle: "Editing Portfolio | Rohith V",
  editingDescription:
    "Editing portfolio showcasing personal edits, promotional films, television work, corporate videos, colour correction, visual finishing and After Effects work by Rohith V.",
  contactTitle: "Contact — Rohith V | Filmmaker & Digital Creator",
  contactDescription:
    "Get in touch with Rohith V, Filmmaker and Digital Creator based in Chennai, Tamil Nadu — film projects, creative collaborations, and digital marketing.",
};

export async function getSeoSettings(): Promise<SeoSettingsData> {
  try {
    if (typeof window !== "undefined") {
      const response = await fetch("/api/seo-settings");
      if (response.ok) {
        const data = await response.json();
        return {
          ...defaultSeoSettings,
          ...data,
        };
      }
    }

    const publicUrl =
      "https://rgbzjfyosfcvskfkzecu.supabase.co/storage/v1/object/public/portfolio-media/config/seo-settings.json";
    const res = await fetch(publicUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        ...defaultSeoSettings,
        ...data,
      };
    }
  } catch (error) {
    console.warn("Failed to load SEO settings from Supabase, using default:", error);
  }

  return defaultSeoSettings;
}

export async function updateSeoSettings(
  settings: Partial<SeoSettingsData>
): Promise<SeoSettingsData> {
  const response = await fetch("/api/seo-settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ seoSettings: settings }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update SEO settings");
  }

  const result = await response.json();
  return result.seoSettings;
}
