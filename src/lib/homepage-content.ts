// Homepage Content Data Layer & Types

export interface HomepagePhilosophyStep {
  step: string;
  word: string;
  subtitle: string;
  text: string;
}

export interface HomepageContentData {
  heroTitle: string;
  heroSubtitle: string;
  heroRole: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  aboutProfileTitle: string;
  aboutProfileText: string;
  aboutSubText: string;
  aboutCtaText: string;
  aboutCtaLink: string;
  statementTitle: string;
  statementText: string;
  philosophySteps: HomepagePhilosophyStep[];
  updatedAt?: string;
}

export const defaultHomepageContent: HomepageContentData = {
  heroTitle: "Rohith V",
  heroSubtitle: "Filmmaker",
  heroRole: "Writer • Editor • VFX / CG Artist",
  heroCtaText: "VIEW WORK →",
  heroCtaLink: "/portfolio",
  heroSecondaryCtaText: "START A PROJECT →",
  heroSecondaryCtaLink: "/contact",
  aboutProfileTitle: "The Filmmaker",
  aboutProfileText:
    "Visual Communication student and emerging Assistant Director, Writer, Editor and VFX/CG Artist with hands-on experience in filmmaking, screenplay development, editing and post-production.",
  aboutSubText:
    "My experience includes assisting in script and screenplay development for RADHAL, working as a CG Artist for KADALAR, and directing and editing independent short films.",
  aboutCtaText: "More about the work →",
  aboutCtaLink: "/about",
  statementTitle: "A Film Is More Than a Frame.",
  statementText: "I don't just create visuals.\nI create moments people remember.",
  philosophySteps: [
    {
      step: "01",
      word: "SEE",
      subtitle: "Visual Composition & Light",
      text: "Every frame begins with how we see — deliberate composition, lighting depth, spatial blocking and intentional camera movement.",
    },
    {
      step: "02",
      word: "FEEL",
      subtitle: "Atmosphere & Emotional Weight",
      text: "A film must make you feel before it makes you think — performance, tone and sonic atmosphere give the visual its soul.",
    },
    {
      step: "03",
      word: "TELL",
      subtitle: "Pacing & Narrative Truth",
      text: "Cinema is narrative honesty — pacing, restraint and moments that stay with the audience long after the screen goes black.",
    },
  ],
};

export async function getHomepageContent(): Promise<HomepageContentData> {
  try {
    if (typeof window !== "undefined") {
      const response = await fetch("/api/homepage-content");
      if (response.ok) {
        const data = await response.json();
        return {
          ...defaultHomepageContent,
          ...data,
          philosophySteps: Array.isArray(data.philosophySteps) && data.philosophySteps.length > 0
            ? data.philosophySteps
            : defaultHomepageContent.philosophySteps,
        };
      }
    }

    const publicUrl =
      "https://rgbzjfyosfcvskfkzecu.supabase.co/storage/v1/object/public/portfolio-media/config/homepage-content.json";
    const res = await fetch(publicUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        ...defaultHomepageContent,
        ...data,
        philosophySteps: Array.isArray(data.philosophySteps) && data.philosophySteps.length > 0
          ? data.philosophySteps
          : defaultHomepageContent.philosophySteps,
      };
    }
  } catch (error) {
    console.warn("Failed to load homepage content from Supabase, using default:", error);
  }

  return defaultHomepageContent;
}

export async function updateHomepageContent(
  content: Partial<HomepageContentData>
): Promise<HomepageContentData> {
  const response = await fetch("/api/homepage-content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ homepageContent: content }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update homepage content");
  }

  const result = await response.json();
  return result.homepageContent;
}
