// Showreel Data Layer & Types

export interface ShowreelData {
  enabled: boolean;
  videoId: string; // e.g. "lYLTsC9RM9U"
  videoUrl?: string; // e.g. direct mp4 or YouTube link
  title: string;
  category: string;
  description: string;
  posterImage?: string;
  updatedAt?: string;
}

export const defaultShowreel: ShowreelData = {
  enabled: true,
  videoId: "lYLTsC9RM9U",
  videoUrl: "https://www.youtube.com/watch?v=lYLTsC9RM9U",
  title: "VFX Showreel",
  category: "VFX / CG",
  description: "Selected visual effects, CG contribution, and post-production work.",
  posterImage: "",
};

export async function getShowreel(): Promise<ShowreelData> {
  try {
    if (typeof window !== "undefined") {
      const response = await fetch("/api/showreel");
      if (response.ok) {
        const data = await response.json();
        return {
          ...defaultShowreel,
          ...data,
        };
      }
    }

    const publicUrl =
      "https://rgbzjfyosfcvskfkzecu.supabase.co/storage/v1/object/public/portfolio-media/config/showreel.json";
    const res = await fetch(publicUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        ...defaultShowreel,
        ...data,
      };
    }
  } catch (error) {
    console.warn("Failed to load showreel config from Supabase, using default:", error);
  }

  return defaultShowreel;
}

export async function updateShowreel(
  showreel: Partial<ShowreelData>
): Promise<ShowreelData> {
  const response = await fetch("/api/showreel", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ showreel }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update showreel");
  }

  const result = await response.json();
  return result.showreel;
}
