export interface EditingVideoItem {
  id: string;
  title: string;
  driveUrlOrId: string;
  thumbnailLabel?: string;
  notes?: string;
}

export interface EditingProject {
  id: string;
  slug: string;
  number: string;
  title: string;
  role: string;
  type: string;
  category: "EDITING";
  description: string;
  detailedPoints?: string[];
  toolsUsed?: string[];
  aspectRatio?: "16:9" | "9:16";
  videos: EditingVideoItem[];
  tags: string[];
  featured?: boolean;
  moreEpisodesComing?: boolean;
}

/**
 * Helper to convert any Google Drive URL, embed URL, or raw file ID
 * into the clean file ID.
 */
export function extractDriveFileId(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();

  // If already clean file ID (alphanumeric, dashes, underscores, length ~25-50)
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle standard /file/d/FILE_ID/...
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Handle ?id=FILE_ID or &id=FILE_ID
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // Handle /open?id=FILE_ID
  const openMatch = trimmed.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch && openMatch[1]) {
    return openMatch[1];
  }

  // Handle /uc?id=FILE_ID
  const ucMatch = trimmed.match(/\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch && ucMatch[1]) {
    return ucMatch[1];
  }

  // Handle /folders/FOLDER_ID if passed by mistake
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }

  return trimmed;
}

/**
 * Returns a secure, responsive Google Drive preview embed URL:
 * https://drive.google.com/file/d/FILE_ID/preview
 */
export function getDriveEmbedUrl(driveUrlOrId: string): string {
  const fileId = extractDriveFileId(driveUrlOrId);
  if (!fileId) return "";
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Returns direct Google Drive view URL for fallback opening
 */
export function getDriveDirectUrl(driveUrlOrId: string): string {
  const fileId = extractDriveFileId(driveUrlOrId);
  if (!fileId) return "";
  return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Complete Editing Portfolio Projects Data
 * Total projects: 5
 * Total videos connected: 18 (4 + 1 + 1 + 1 + 11)
 */
export const editingProjectsData: EditingProject[] = [
  {
    id: "personal-edits",
    slug: "personal-edits",
    number: "01",
    title: "PERSONAL EDITS",
    role: "Editor — footage enhancement, clean cuts, pacing, colour correction, subtitles, music, visual polish and After Effects finishing.",
    type: "Personal Work & Social Media",
    category: "EDITING",
    description:
      "Personal editing work created for friends, student creators and individual clients who approach me for small paid editing projects. I take their raw footage and shape it into a finished video with clean cuts, pacing, enhancement, colour correction, music, subtitles and visual polish. The work includes videos for political influencers and college students, adapting each edit to its purpose and audience.",
    toolsUsed: ["Premiere Pro", "DaVinci Resolve", "After Effects", "Photoshop"],
    aspectRatio: "16:9",
    videos: [
      {
        id: "pe-1",
        title: "Personal Edit — Video 01",
        thumbnailLabel: "Film 01",
        driveUrlOrId: "14DyIUsAOckUlDhnncV-vvwV1A4lKRG4f",
      },
      {
        id: "pe-2",
        title: "Personal Edit — Video 02",
        thumbnailLabel: "Film 02",
        driveUrlOrId: "18JZLgyNq6bDacWY0yKT8FbX3dDvp9T6i",
      },
      {
        id: "pe-3",
        title: "Personal Edit — Video 03",
        thumbnailLabel: "Film 03",
        driveUrlOrId: "1DetEXBoQEMIs53thvgz4_LWAZ09LTmJD",
      },
      {
        id: "pe-4",
        title: "Personal Edit — Video 04",
        thumbnailLabel: "Film 04",
        driveUrlOrId: "1K_Dy4b_p6d2Z6_LQMWAAzpj6ETHnPI7i",
      },
    ],
    tags: ["Personal Work", "Social Media", "Colour Correction", "After Effects"],
    featured: true,
  },
  {
    id: "skytree-solution",
    slug: "skytree-solution",
    number: "02",
    title: "SKYTREE SOLUTION",
    role: "Editor — information edit, subtitles, visual assets, pacing and post-production.",
    type: "Corporate / Information Video",
    category: "EDITING",
    description:
      "An information-focused video created for Skytree Solution. The team provided the original shoot footage, and I handled the post-production — structuring the information clearly, editing the footage, adding subtitles, sourcing and placing visual assets and refining the presentation for a professional final output.",
    toolsUsed: ["Premiere Pro", "After Effects", "Photoshop"],
    aspectRatio: "16:9",
    videos: [
      {
        id: "skytree-1",
        title: "Skytree Solution Overview",
        thumbnailLabel: "Film 01",
        driveUrlOrId: "1PI2kVk5fRUQCaa0leyduwXKUw_-vaS01",
      },
    ],
    tags: ["Corporate", "Information Video", "Subtitles", "Assets"],
    featured: true,
  },
  {
    id: "tiruvannamalai-polytechnic",
    slug: "tiruvannamalai-polytechnic",
    number: "03",
    title: "TIRUVANNAMALAI POLYTECHNIC",
    role: "Editor — online footage selection, assembly, pacing and promotional edit.",
    type: "College Promotional / Admission Video",
    category: "EDITING",
    description:
      "A promotional and admission-oriented edit created for students interested in joining a Government Polytechnic College in Tiruvannamalai. I built the edit using relevant online footage, arranging the visuals and pacing to communicate the college and its admission message clearly.",
    toolsUsed: ["Premiere Pro", "DaVinci Resolve", "Photoshop"],
    aspectRatio: "16:9",
    videos: [
      {
        id: "tvm-poly-1",
        title: "Tiruvannamalai Polytechnic Admission Video",
        thumbnailLabel: "Film 01",
        driveUrlOrId: "1Nu0gD0TD4heEAOcMnPwrtDyJoGmsbaQZ",
      },
    ],
    tags: ["Education", "Promotional", "Online Footage", "College"],
    featured: false,
  },
  {
    id: "tv-show",
    slug: "tv-show",
    number: "04",
    title: "TV SHOW",
    role: "Concept, Planning, Script, Shoot, Re-lighting, Editing and Post-production.",
    type: "Television / News & Entertainment",
    category: "EDITING",
    description:
      "A television-format project developed and executed by me from concept to production. I planned the format, worked on the script, handled the shoot and designed the re-lighting and visual presentation before editing the final episode. Two additional TV-show videos will be added later.",
    toolsUsed: ["Premiere Pro", "After Effects", "Photoshop", "Studio Lighting"],
    aspectRatio: "16:9",
    videos: [
      {
        id: "tv-show-ep1",
        title: "TV Show — Episode 01",
        thumbnailLabel: "Film 01",
        driveUrlOrId: "10V-hEqSaC93iYi1jmH-oclTr2qh_U6dz",
      },
    ],
    tags: ["Television", "Self-Produced", "Script", "Shoot", "Re-lighting"],
    featured: true,
    moreEpisodesComing: true,
  },
  {
    id: "vels-global-school",
    slug: "vels-global-school",
    number: "05",
    title: "VELS GLOBAL SCHOOL",
    role: "Editor — slow-paced cuts, music, pacing, After Effects, visual finishing and promotional post-production.",
    type: "School Promotional Campaign",
    category: "EDITING",
    description:
      "A collection of promotional videos edited for Vels Global School during a promotional month. The production team provided the footage, and I handled the post-production with a focus on slow, controlled pacing, clean cuts, music and professional visual finishing. I used After Effects where needed to elevate the presentation and deliver a polished result that satisfied the team.",
    toolsUsed: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
    aspectRatio: "16:9",
    videos: [
      {
        id: "vels-1",
        title: "Vels Global School — Promo 01",
        thumbnailLabel: "Film 01",
        driveUrlOrId: "1-BU1tuMwiYmrbXJkmO4Ocomy4CLBeVji",
      },
      {
        id: "vels-2",
        title: "Vels Global School — Promo 02",
        thumbnailLabel: "Film 02",
        driveUrlOrId: "18-EBZZAxbMk_STve6qT1HsKsf9FkugMM",
      },
      {
        id: "vels-3",
        title: "Vels Global School — Promo 03",
        thumbnailLabel: "Film 03",
        driveUrlOrId: "1QW6ygLMztpNBwzddJ1LomXK38dp5dneu",
      },
      {
        id: "vels-4",
        title: "Vels Global School — Promo 04",
        thumbnailLabel: "Film 04",
        driveUrlOrId: "1QYN765jBLU8q0WEPKfQVdykW8N70O247",
      },
      {
        id: "vels-5",
        title: "Vels Global School — Promo 05",
        thumbnailLabel: "Film 05",
        driveUrlOrId: "1UA6DVZgrcZyeBVptlevK1EmWSxV59qNH",
      },
      {
        id: "vels-6",
        title: "Vels Global School — Promo 06",
        thumbnailLabel: "Film 06",
        driveUrlOrId: "1cakvM1_kGLgG6hLItlXOnpCNx1Toi4Yt",
      },
      {
        id: "vels-7",
        title: "Vels Global School — Promo 07",
        thumbnailLabel: "Film 07",
        driveUrlOrId: "1gIWapFh7kfeWlSwhn4AICQ9IPhfyo7tj",
      },
      {
        id: "vels-8",
        title: "Vels Global School — Promo 08",
        thumbnailLabel: "Film 08",
        driveUrlOrId: "1k5C_j99Ah9NPUqtSFOu1lOG4Dz2qEtsW",
      },
      {
        id: "vels-9",
        title: "Vels Global School — Promo 09",
        thumbnailLabel: "Film 09",
        driveUrlOrId: "1p56IODwZcFSp6QlByZyervFlQX8zBUlc",
      },
      {
        id: "vels-10",
        title: "Vels Global School — Promo 10",
        thumbnailLabel: "Film 10",
        driveUrlOrId: "1reyuAbDjZcx5j3pi2KlUYK7iU2-5NnAz",
      },
      {
        id: "vels-11",
        title: "Vels Global School — Promo 11",
        thumbnailLabel: "Film 11",
        driveUrlOrId: "1u7kmvkP5mUgdqha43VecsT-NgaQh8zmd",
      },
    ],
    tags: ["School Promotion", "Promotional Campaign", "After Effects", "Music", "Pacing"],
    featured: true,
  },
];
