// Resume Manager Data Layer & Types
import localResumePdf from "@/assets/Rohith V Resume.pdf";

export interface ResumeData {
  enabled: boolean;
  url: string;
  filename: string;
  updatedAt?: string;
  sizeBytes?: number;
}

export const defaultResumeData: ResumeData = {
  enabled: true,
  url: localResumePdf,
  filename: "Rohith_V_Resume.pdf",
};

export async function getResumeData(): Promise<ResumeData> {
  try {
    if (typeof window !== "undefined") {
      const response = await fetch("/api/resume");
      if (response.ok) {
        const data = await response.json();
        return {
          ...defaultResumeData,
          ...data,
          url: data.url || defaultResumeData.url,
        };
      }
    }

    const publicUrl =
      "https://rgbzjfyosfcvskfkzecu.supabase.co/storage/v1/object/public/portfolio-media/config/resume.json";
    const res = await fetch(publicUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        ...defaultResumeData,
        ...data,
        url: data.url || defaultResumeData.url,
      };
    }
  } catch (error) {
    console.warn("Failed to load resume data from Supabase, using default:", error);
  }

  return defaultResumeData;
}

export async function updateResumeData(
  resumeData: Partial<ResumeData>
): Promise<ResumeData> {
  const response = await fetch("/api/resume", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ resume: resumeData }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update resume config");
  }

  const result = await response.json();
  return result.resume;
}
