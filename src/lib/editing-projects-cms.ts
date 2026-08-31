import type { Project, ProjectDriveVideo, EditingBreakdownItem, SectionVisibility, ProjectSEOSettings } from "@/data/projects";
import { defaultSectionVisibility } from "@/data/projects";
import { resolveImageUrl } from "./asset-resolver";

export interface EditingProjectVideoFormData {
  id?: string;
  title: string;
  videoNumber: string; // e.g. "Film 01"
  driveUrl?: string;
  driveFileId: string;
  thumbnailUrl?: string;
  description?: string;
  duration?: string;
  published: boolean;
  displayOrder: number;
}

export interface EditingProjectVideoCMSData extends EditingProjectVideoFormData {
  id: string;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EditingProjectFormData {
  title: string;
  slug: string;
  projectNumber: string;
  category: "EDITING";
  clientName?: string;
  year?: string;
  role: string;
  description: string;
  synopsis?: string;
  logline?: string;
  thumbnailUrl?: string;
  heroImageUrl?: string;
  tags: string[];
  tools: string[];
  editingBreakdown: EditingBreakdownItem[];
  credits?: string;
  status?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  notice?: string;
  sectionVisibility?: SectionVisibility;
  seoSettings?: ProjectSEOSettings;
  videos: EditingProjectVideoFormData[];
}

export interface EditingProjectCMSData extends Omit<EditingProjectFormData, "videos"> {
  id: string;
  videos: EditingProjectVideoCMSData[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Extracts Google Drive file ID from various URL formats or returns the raw ID if already clean.
 * Supports:
 * - https://drive.google.com/file/d/14DyIUsAOckUlDhnncV-vvwV1A4lKRG4f/view?usp=drive_link
 * - https://drive.google.com/file/d/14DyIUsAOckUlDhnncV-vvwV1A4lKRG4f/preview
 * - https://drive.google.com/open?id=14DyIUsAOckUlDhnncV-vvwV1A4lKRG4f
 * - https://drive.google.com/uc?id=14DyIUsAOckUlDhnncV-vvwV1A4lKRG4f
 * - 14DyIUsAOckUlDhnncV-vvwV1A4lKRG4f
 */
export function extractGoogleDriveFileId(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();

  // If already clean alphanumeric ID with common Drive ID characters
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return trimmed;
  }

  // Match /file/d/FILE_ID/
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Match id=FILE_ID
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // Fallback: strip URL parts
  const lastSegment = trimmed.split("/").filter(Boolean).pop()?.split("?")[0];
  return lastSegment || trimmed;
}

export function getGoogleDrivePreviewUrl(fileId: string): string {
  const cleanId = extractGoogleDriveFileId(fileId);
  return `https://drive.google.com/file/d/${cleanId}/preview`;
}

export function getGoogleDriveViewUrl(fileId: string): string {
  const cleanId = extractGoogleDriveFileId(fileId);
  return `https://drive.google.com/file/d/${cleanId}/view`;
}

/**
 * Initial 5 default editing projects and 18 videos with complete metadata.
 * Used for database seeding and instant fallback.
 */
export const defaultEditingProjectsSeed: EditingProjectFormData[] = [
  {
    title: "Personal Edits",
    slug: "personal-edits",
    projectNumber: "05",
    category: "EDITING",
    clientName: "Freelance / Personal Clients",
    year: "2024",
    role: "Editor — footage enhancement, clean cuts, pacing, colour correction, subtitles, music, visual polish and After Effects finishing.",
    description:
      "Personal editing work created for friends, student creators and individual clients who approach me for small paid editing projects. I take their raw footage and shape it into a finished video with clean cuts, pacing, enhancement, colour correction, music, subtitles and visual polish. The work includes videos for political influencers and college students, adapting each edit to its purpose and audience.",
    synopsis:
      "Personal editing work created for friends, student creators and individual clients who approach me for small paid editing projects. I take their raw footage and shape it into a finished video with clean cuts, pacing, enhancement, colour correction, music, subtitles and visual polish. The work includes videos for political influencers and college students, adapting each edit to its purpose and audience.",
    logline: "Shaping raw client and student footage into pacing-accurate, polished video content.",
    thumbnailUrl: "/assets/about-editroom-BKvPVbuz.webp",
    heroImageUrl: "/assets/about-editroom-BKvPVbuz.webp",
    tags: ["Personal Work", "Social Media", "Colour Correction", "After Effects"],
    tools: ["Premiere Pro", "DaVinci Resolve", "After Effects", "Photoshop"],
    editingBreakdown: [
      {
        title: "Footage Enhancement & Clean Cuts",
        description: "Removing awkward pauses, noise cleanup, stabilizing jittery shots, and setting a sharp, engaging baseline.",
        tools: ["Premiere Pro", "DaVinci Resolve"],
      },
      {
        title: "Colour Correction & Skin Tone Balance",
        description: "Transforming mismatched lighting and varied camera profiles into cohesive, natural skin tones with cinematic depth.",
        tools: ["DaVinci Resolve"],
      },
      {
        title: "Music & Beat Synchronization",
        description: "Aligning key moments and narrative transitions with musical accents for high viewer retention.",
        tools: ["Premiere Pro"],
      },
      {
        title: "Subtitles & After Effects Finishing",
        description: "High-contrast dynamic subtitles, clean lower thirds, visual overlays, and brand graphics.",
        tools: ["After Effects", "Photoshop"],
      },
    ],
    credits: "Role: Editor\n\nEditing, Enhancement, Colour Correction, Subtitles, Music & After Effects Finishing: Rohith V",
    status: "Completed",
    featured: false,
    published: true,
    displayOrder: 1,
    sectionVisibility: defaultSectionVisibility,
    seoSettings: {
      seoTitle: "Personal Edits | Rohith V — Editing Portfolio",
      metaDescription: "Personal editing work created for friends, student creators and individual clients with clean cuts, pacing, colour correction, and visual polish by Rohith V.",
    },
    videos: [
      {
        title: "Personal Edit — Video 01",
        videoNumber: "Film 01",
        driveUrl: "https://drive.google.com/file/d/14DyIUsAOckUlDhnncV-vvwV1A4lKRG4f/view",
        driveFileId: "14DyIUsAOckUlDhnncV-vvwV1A4lKRG4f",
        description: "Social media dynamic cut with rhythm pacing and beat synchronization.",
        duration: "0:45",
        published: true,
        displayOrder: 1,
      },
      {
        title: "Personal Edit — Video 02",
        videoNumber: "Film 02",
        driveUrl: "https://drive.google.com/file/d/18JZLgyNq6bDacWY0yKT8FbX3dDvp9T6i/view",
        driveFileId: "18JZLgyNq6bDacWY0yKT8FbX3dDvp9T6i",
        description: "Influencer narrative edit with colour balance and dynamic captions.",
        duration: "1:15",
        published: true,
        displayOrder: 2,
      },
      {
        title: "Personal Edit — Video 03",
        videoNumber: "Film 03",
        driveUrl: "https://drive.google.com/file/d/1DetEXBoQEMIs53thvgz4_LWAZ09LTmJD/view",
        driveFileId: "1DetEXBoQEMIs53thvgz4_LWAZ09LTmJD",
        description: "Student creator portfolio piece featuring multi-camera assembly and music sync.",
        duration: "1:00",
        published: true,
        displayOrder: 3,
      },
      {
        title: "Personal Edit — Video 04",
        videoNumber: "Film 04",
        driveUrl: "https://drive.google.com/file/d/1K_Dy4b_p6d2Z6_LQMWAAzpj6ETHnPI7i/view",
        driveFileId: "1K_Dy4b_p6d2Z6_LQMWAAzpj6ETHnPI7i",
        description: "Polished promotional cut with After Effects visual finishing.",
        duration: "0:55",
        published: true,
        displayOrder: 4,
      },
    ],
  },
  {
    title: "Skytree Solution",
    slug: "skytree-solution",
    projectNumber: "06",
    category: "EDITING",
    clientName: "Skytree Solution",
    year: "2024",
    role: "Editor — information edit, subtitles, visual assets, pacing and post-production.",
    description:
      "An information-focused video created for Skytree Solution. The team provided the original shoot footage, and I handled the post-production — structuring the information clearly, editing the footage, adding subtitles, sourcing and placing visual assets and refining the presentation for a professional final output.",
    synopsis:
      "An information-focused video created for Skytree Solution. The team provided the original shoot footage, and I handled the post-production — structuring the information clearly, editing the footage, adding subtitles, sourcing and placing visual assets and refining the presentation for a professional final output.",
    logline: "Clarity meets precision in corporate communication.",
    thumbnailUrl: "/assets/hero-street-C3qppsKj.webp",
    heroImageUrl: "/assets/hero-street-C3qppsKj.webp",
    tags: ["Corporate", "Information Video", "Subtitles", "Assets"],
    tools: ["Premiere Pro", "After Effects", "Photoshop"],
    editingBreakdown: [
      {
        title: "Information Structuring & Flow",
        description: "Organizing corporate talking points into an engaging, progressive narrative hierarchy.",
        tools: ["Premiere Pro"],
      },
      {
        title: "Visual Asset Integration",
        description: "Sourcing, placing, and animating custom corporate graphics, charts, and screen assets.",
        tools: ["After Effects", "Photoshop"],
      },
      {
        title: "Professional Subtitles & Branding",
        description: "Clean on-brand typography and subtitles engineered for clarity and accessibility.",
        tools: ["Premiere Pro"],
      },
    ],
    credits: "Client: Skytree Solution\n\nPost-Production & Information Edit: Rohith V",
    status: "Completed",
    featured: false,
    published: true,
    displayOrder: 2,
    sectionVisibility: defaultSectionVisibility,
    seoSettings: {
      seoTitle: "Skytree Solution | Rohith V — Editing Portfolio",
      metaDescription: "Information video created for Skytree Solution with structured narrative editing, subtitles, and visual assets by Rohith V.",
    },
    videos: [
      {
        title: "Skytree Solution — Master Cut",
        videoNumber: "Master Video",
        driveUrl: "https://drive.google.com/file/d/1PI2kVk5fRUQCaa0leyduwXKUw_-vaS01/view",
        driveFileId: "1PI2kVk5fRUQCaa0leyduwXKUw_-vaS01",
        description: "Complete corporate information video featuring asset placements and subtitles.",
        duration: "2:30",
        published: true,
        displayOrder: 1,
      },
    ],
  },
  {
    title: "Tiruvannamalai Polytechnic",
    slug: "tiruvannamalai-polytechnic",
    projectNumber: "07",
    category: "EDITING",
    clientName: "Government Polytechnic College, Tiruvannamalai",
    year: "2024",
    role: "Editor — online footage selection, assembly, pacing and promotional edit.",
    description:
      "A promotional and admission-oriented edit created for students interested in joining a Government Polytechnic College in Tiruvannamalai. I built the edit using relevant online footage, arranging the visuals and pacing to communicate the college and its admission message clearly.",
    synopsis:
      "A promotional and admission-oriented edit created for students interested in joining a Government Polytechnic College in Tiruvannamalai. I built the edit using relevant online footage, arranging the visuals and pacing to communicate the college and its admission message clearly.",
    logline: "Inspiring the next generation through energetic educational storytelling.",
    thumbnailUrl: "/assets/about-editroom-BKvPVbuz.webp",
    heroImageUrl: "/assets/about-editroom-BKvPVbuz.webp",
    tags: ["Education", "Promotional", "Online Footage", "College"],
    tools: ["Premiere Pro", "After Effects", "Photoshop"],
    editingBreakdown: [
      {
        title: "Footage Curation & Story Assembly",
        description: "Selecting impactful archival and online footage to showcase academic life and infrastructure.",
        tools: ["Premiere Pro"],
      },
      {
        title: "Pacing & Message Delivery",
        description: "Balancing energetic youth cuts with vital admission details and course highlights.",
        tools: ["Premiere Pro"],
      },
      {
        title: "Visual Polish & Callouts",
        description: "Admission banners, department callout cards, and audio balance.",
        tools: ["After Effects"],
      },
    ],
    credits: "Client: Government Polytechnic College, Tiruvannamalai\n\nPromotional Edit & Visual Assembly: Rohith V",
    status: "Completed",
    featured: false,
    published: true,
    displayOrder: 3,
    sectionVisibility: defaultSectionVisibility,
    seoSettings: {
      seoTitle: "Tiruvannamalai Polytechnic | Rohith V — Editing Portfolio",
      metaDescription: "College promotional and admission-oriented edit created with online footage assembly and pacing by Rohith V.",
    },
    videos: [
      {
        title: "Tiruvannamalai Polytechnic — Admission Promo",
        videoNumber: "Master Video",
        driveUrl: "https://drive.google.com/file/d/1Nu0gD0TD4heEAOcMnPwrtDyJoGmsbaQZ/view",
        driveFileId: "1Nu0gD0TD4heEAOcMnPwrtDyJoGmsbaQZ",
        description: "Promotional admission film highlighting technical courses and campus opportunities.",
        duration: "2:10",
        published: true,
        displayOrder: 1,
      },
    ],
  },
  {
    title: "TV Show",
    slug: "tv-show",
    projectNumber: "08",
    category: "EDITING",
    clientName: "Self-Produced Television Pilot",
    year: "2024",
    role: "Concept, Planning, Script, Shoot, Re-lighting, Editing and Post-production.",
    description:
      "A television-format project developed and executed by me from concept to production. I planned the format, worked on the script, handled the shoot and designed the re-lighting and visual presentation before editing the final episode.",
    synopsis:
      "A television-format project developed and executed by me from concept to production. I planned the format, worked on the script, handled the shoot and designed the re-lighting and visual presentation before editing the final episode.",
    logline: "From concept to broadcast screen — complete creative ownership.",
    thumbnailUrl: "/assets/hero-street-C3qppsKj.webp",
    heroImageUrl: "/assets/hero-street-C3qppsKj.webp",
    tags: ["Television", "Self-Produced", "Script", "Shoot", "Re-lighting"],
    tools: ["Premiere Pro", "DaVinci Resolve", "Studio Lighting", "After Effects"],
    editingBreakdown: [
      {
        title: "Broadcast Format & Episode Assembly",
        description: "Structuring commercial segments, interview blocks, and transitions.",
        tools: ["Premiere Pro"],
      },
      {
        title: "Re-lighting & Contrast Design",
        description: "Enhancing studio mood, backlights, and actor separation in post-production.",
        tools: ["DaVinci Resolve"],
      },
      {
        title: "Audio Mastering & Broadcast Mix",
        description: "Multi-microphone leveling, room tone reduction, and music bed balance.",
        tools: ["Premiere Pro"],
      },
    ],
    credits: "Concept, Script, Direction, Cinematography, Re-lighting & Editing: Rohith V",
    status: "Completed",
    featured: false,
    published: true,
    displayOrder: 4,
    notice: "Additional TV-show episodes and videos will be added directly through the CMS.",
    sectionVisibility: defaultSectionVisibility,
    seoSettings: {
      seoTitle: "TV Show | Rohith V — Editing Portfolio",
      metaDescription: "Self-produced television format project created, planned, shot, re-lit, and edited by Rohith V.",
    },
    videos: [
      {
        title: "TV Show — Episode 01",
        videoNumber: "Episode 01",
        driveUrl: "https://drive.google.com/file/d/10V-hEqSaC93iYi1jmH-oclTr2qh_U6dz/view",
        driveFileId: "10V-hEqSaC93iYi1jmH-oclTr2qh_U6dz",
        description: "Pilot broadcast episode featuring custom lighting, pacing, and editorial flow.",
        duration: "3:45",
        published: true,
        displayOrder: 1,
      },
    ],
  },
  {
    title: "Vels Global School",
    slug: "vels-global-school",
    projectNumber: "09",
    category: "EDITING",
    clientName: "Vels Global School",
    year: "2024",
    role: "Editor — slow-paced cuts, music, pacing, After Effects, visual finishing and promotional post-production.",
    description:
      "A collection of promotional videos edited for Vels Global School during a promotional month. The production team provided the footage, and I handled the post-production with a focus on slow, controlled pacing, clean cuts, music and professional visual finishing. I used After Effects where needed to elevate the presentation and deliver a polished result that satisfied the team.",
    synopsis:
      "A collection of promotional videos edited for Vels Global School during a promotional month. The production team provided the footage, and I handled the post-production with a focus on slow, controlled pacing, clean cuts, music and professional visual finishing. I used After Effects where needed to elevate the presentation and deliver a polished result that satisfied the team.",
    logline: "Multi-video promotional campaign crafted with controlled pacing, elegant music, and After Effects visual finishing.",
    thumbnailUrl: "/assets/about-editroom-BKvPVbuz.webp",
    heroImageUrl: "/assets/about-editroom-BKvPVbuz.webp",
    tags: ["School Promotion", "Promotional Campaign", "After Effects", "Music", "Pacing"],
    tools: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
    editingBreakdown: [
      {
        title: "Slow-Paced Editorial Cadence",
        description: "Carefully calibrated shot durations allowing emotional expressions and school facilities to be appreciated without rush.",
        tools: ["Premiere Pro"],
      },
      {
        title: "Motion Typography & After Effects",
        description: "Elegantly animated school accolades, program features, and logo reveals.",
        tools: ["After Effects"],
      },
      {
        title: "Warm Cinematic Color Palette",
        description: "Enhancing natural sunlight and campus greenery for an inviting, vibrant look.",
        tools: ["DaVinci Resolve"],
      },
      {
        title: "Acoustic Audio Sync",
        description: "Syncing joyful moments to acoustic melodies with clean dialogue and ambient campus presence.",
        tools: ["Premiere Pro"],
      },
    ],
    credits: "Client: Vels Global School\n\nEditor — Slow-paced cuts, music, pacing, After Effects, visual finishing and promotional post-production: Rohith V",
    status: "Completed",
    featured: false,
    published: true,
    displayOrder: 5,
    sectionVisibility: defaultSectionVisibility,
    seoSettings: {
      seoTitle: "Vels Global School | Rohith V — Editing Portfolio",
      metaDescription: "Collection of 11 promotional films edited for Vels Global School with slow-paced cuts, music, and After Effects visual finishing by Rohith V.",
    },
    videos: [
      {
        title: "Vels Global School — Promo 01",
        videoNumber: "Film 01",
        driveUrl: "https://drive.google.com/file/d/1-BU1tuMwiYmrbXJkmO4Ocomy4CLBeVji/view",
        driveFileId: "1-BU1tuMwiYmrbXJkmO4Ocomy4CLBeVji",
        description: "Campus lifestyle and student learning environment.",
        duration: "0:45",
        published: true,
        displayOrder: 1,
      },
      {
        title: "Vels Global School — Promo 02",
        videoNumber: "Film 02",
        driveUrl: "https://drive.google.com/file/d/18-EBZZAxbMk_STve6qT1HsKsf9FkugMM/view",
        driveFileId: "18-EBZZAxbMk_STve6qT1HsKsf9FkugMM",
        description: "Academic curriculum and classroom engagement.",
        duration: "0:50",
        published: true,
        displayOrder: 2,
      },
      {
        title: "Vels Global School — Promo 03",
        videoNumber: "Film 03",
        driveUrl: "https://drive.google.com/file/d/1QW6ygLMztpNBwzddJ1LomXK38dp5dneu/view",
        driveFileId: "1QW6ygLMztpNBwzddJ1LomXK38dp5dneu",
        description: "Faculty guidance and student-teacher interactions.",
        duration: "0:40",
        published: true,
        displayOrder: 3,
      },
      {
        title: "Vels Global School — Promo 04",
        videoNumber: "Film 04",
        driveUrl: "https://drive.google.com/file/d/1QYN765jBLU8q0WEPKfQVdykW8N70O247/view",
        driveFileId: "1QYN765jBLU8q0WEPKfQVdykW8N70O247",
        description: "Science laboratories and experiential exploration.",
        duration: "0:48",
        published: true,
        displayOrder: 4,
      },
      {
        title: "Vels Global School — Promo 05",
        videoNumber: "Film 05",
        driveUrl: "https://drive.google.com/file/d/1UA6DVZgrcZyeBVptlevK1EmWSxV59qNH/view",
        driveFileId: "1UA6DVZgrcZyeBVptlevK1EmWSxV59qNH",
        description: "Sports, physical education, and outdoor athletics.",
        duration: "0:52",
        published: true,
        displayOrder: 5,
      },
      {
        title: "Vels Global School — Promo 06",
        videoNumber: "Film 06",
        driveUrl: "https://drive.google.com/file/d/1cakvM1_kGLgG6hLItlXOnpCNx1Toi4Yt/view",
        driveFileId: "1cakvM1_kGLgG6hLItlXOnpCNx1Toi4Yt",
        description: "Arts, music, and creative expression.",
        duration: "0:45",
        published: true,
        displayOrder: 6,
      },
      {
        title: "Vels Global School — Promo 07",
        videoNumber: "Film 07",
        driveUrl: "https://drive.google.com/file/d/1gIWapFh7kfeWlSwhn4AICQ9IPhfyo7tj/view",
        driveFileId: "1gIWapFh7kfeWlSwhn4AICQ9IPhfyo7tj",
        description: "Campus safety, security, and transportation facilities.",
        duration: "0:38",
        published: true,
        displayOrder: 7,
      },
      {
        title: "Vels Global School — Promo 08",
        videoNumber: "Film 08",
        driveUrl: "https://drive.google.com/file/d/1k5C_j99Ah9NPUqtSFOu1lOG4Dz2qEtsW/view",
        driveFileId: "1k5C_j99Ah9NPUqtSFOu1lOG4Dz2qEtsW",
        description: "Early childhood education and kindergarten care.",
        duration: "0:42",
        published: true,
        displayOrder: 8,
      },
      {
        title: "Vels Global School — Promo 09",
        videoNumber: "Film 09",
        driveUrl: "https://drive.google.com/file/d/1p56IODwZcFSp6QlByZyervFlQX8zBUlc/view",
        driveFileId: "1p56IODwZcFSp6QlByZyervFlQX8zBUlc",
        description: "Technological learning, smart boards, and computer labs.",
        duration: "0:50",
        published: true,
        displayOrder: 9,
      },
      {
        title: "Vels Global School — Promo 10",
        videoNumber: "Film 10",
        driveUrl: "https://drive.google.com/file/d/1reyuAbDjZcx5j3pi2KlUYK7iU2-5NnAz/view",
        driveFileId: "1reyuAbDjZcx5j3pi2KlUYK7iU2-5NnAz",
        description: "Parent testimonials and administrative support.",
        duration: "0:55",
        published: true,
        displayOrder: 10,
      },
      {
        title: "Vels Global School — Promo 11",
        videoNumber: "Film 11",
        driveUrl: "https://drive.google.com/file/d/1u7kmvkP5mUgdqha43VecsT-NgaQh8zmd/view",
        driveFileId: "1u7kmvkP5mUgdqha43VecsT-NgaQh8zmd",
        description: "Grand campaign overview and admissions call-to-action.",
        duration: "1:00",
        published: true,
        displayOrder: 11,
      },
    ],
  },
];

// Helper to convert EditingProjectCMSData into the universal Project type
export function editingProjectToUniversalProject(cms: EditingProjectCMSData): Project {
  const publishedVideos = (cms.videos || []).filter((v) => v.published !== false);
  const driveVideos: ProjectDriveVideo[] = publishedVideos.map((v) => ({
    id: v.id || v.driveFileId,
    title: v.title,
    driveFileId: extractGoogleDriveFileId(v.driveFileId || v.driveUrl || ""),
    thumbnailLabel: v.videoNumber || "Film",
    notes: v.description || undefined,
  }));

  const mainDriveVideo = driveVideos[0];
  const coverImg = cms.thumbnailUrl || cms.heroImageUrl || "/assets/about-editroom-BKvPVbuz.webp";

  return {
    slug: cms.slug,
    number: cms.projectNumber || "05",
    title: cms.title,
    type: cms.clientName ? `${cms.clientName}` : "Freelance / Personal Client Work",
    role: cms.role,
    year: cms.year || "2024",
    status: cms.status || "Completed",
    description: cms.description,
    synopsis: cms.synopsis || cms.description,
    logline: cms.logline || undefined,
    duration: driveVideos.length > 1 ? `${driveVideos.length} FILMS` : "1 FILM",
    formatSpecs: driveVideos.length > 1 ? "16:9 • MULTI-VIDEO REEL" : "16:9 • GOOGLE DRIVE STREAM",
    tags: cms.tags || [],
    process: [
      "Reviewing and cataloging raw client footage",
      "Assembly and rhythm-based rough cutting",
      "Colour correction and contrast balancing",
      "Music sync and audio enhancement",
      "Subtitles, typography and After Effects finishing",
    ],
    visuals: `${driveVideos.length} Video Edit${driveVideos.length > 1 ? "s" : ""}, Social Media Cuts, After Effects Assets`,
    image: resolveImageUrl(coverImg),
    heroImage: resolveImageUrl(cms.heroImageUrl || coverImg),
    thumbnailImage: resolveImageUrl(cms.thumbnailUrl || coverImg),
    featuredThumbnail: resolveImageUrl(cms.thumbnailUrl || coverImg),
    category: "EDITING",
    emotionalDescriptor: cms.logline || "Every cut shapes the story.",
    whatIFelt: `Working on ${cms.title} taught me how to shape client footage into purposeful visual pacing.`,
    publishStatus: cms.published ? "PUBLISHED" : "DRAFT",
    hasVideo: driveVideos.length > 0,
    videoId: mainDriveVideo ? mainDriveVideo.driveFileId : undefined,
    driveVideos,
    toolsUsed: cms.tools || [],
    editingBreakdown: cms.editingBreakdown || [],
    notice: cms.notice || undefined,
    seoSettings: cms.seoSettings,
    sectionVisibility: cms.sectionVisibility || defaultSectionVisibility,
    fullCredits: cms.credits || `Role: Editor\n\nEditing, Enhancement, Colour Correction & Finishing: Rohith V`,
  };
}

// Client API functions

export async function fetchEditingProjectsFromApi(includeDrafts = false): Promise<EditingProjectCMSData[]> {
  try {
    const url = `/api/editing-projects${includeDrafts ? "?includeDrafts=true" : ""}`;
    const res = await fetch(url, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        return data.projects;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch editing projects from API, using fallback seed:", err);
  }

  // Fallback to seed data with generated IDs
  return defaultEditingProjectsSeed
    .filter((p) => includeDrafts || p.published)
    .map((p, idx) => ({
      ...p,
      id: `seed-editing-${p.slug}`,
      videos: p.videos.map((v, vIdx) => ({
        ...v,
        id: `seed-video-${p.slug}-${vIdx + 1}`,
        projectId: `seed-editing-${p.slug}`,
      })),
    }));
}

export async function createEditingProject(project: EditingProjectFormData): Promise<EditingProjectCMSData> {
  const res = await fetch("/api/editing-projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ project }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Failed to create editing project" }));
    throw new Error(errorData.error || "Failed to create editing project");
  }

  const data = await res.json();
  return data.project;
}

export async function updateEditingProject(id: string, updates: Partial<EditingProjectFormData>): Promise<EditingProjectCMSData> {
  const res = await fetch("/api/editing-projects", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id, project: updates }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Failed to update editing project" }));
    throw new Error(errorData.error || "Failed to update editing project");
  }

  const data = await res.json();
  return data.project;
}

export async function deleteEditingProject(id: string): Promise<boolean> {
  const res = await fetch(`/api/editing-projects?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Failed to delete editing project" }));
    throw new Error(errorData.error || "Failed to delete editing project");
  }

  const data = await res.json();
  return data.success;
}

export async function duplicateEditingProject(id: string): Promise<EditingProjectCMSData> {
  const res = await fetch("/api/editing-projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action: "duplicate", id }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Failed to duplicate editing project" }));
    throw new Error(errorData.error || "Failed to duplicate editing project");
  }

  const data = await res.json();
  return data.project;
}

export async function reorderEditingProjects(orderedIds: string[]): Promise<boolean> {
  const res = await fetch("/api/editing-projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action: "reorder", orderedIds }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Failed to reorder editing projects" }));
    throw new Error(errorData.error || "Failed to reorder editing projects");
  }

  return true;
}
