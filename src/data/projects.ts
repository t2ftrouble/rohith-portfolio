import oneLastDay from "@/assets/project-one-last-day.webp";
import kadalar from "@/assets/project-kadalar.webp";
import radhal from "@/assets/project-radhal.webp";
import toothpaste from "@/assets/project-toothpaste.webp";
import oneLastDayPoster from "@/assets/one-last-day-poster.webp";
import oneLastDayBefore from "@/assets/one-last-day-before-cg.webp";
import oneLastDayAfter from "@/assets/one-last-day-after-cg.webp";
import aboutEditroom from "@/assets/about-editroom.webp";
import heroStreet from "@/assets/hero-street.webp";
import { resolveImageUrl } from "@/lib/asset-resolver";

export interface GalleryItem {
  id?: string;
  url: string;
  category?: "Film Stills" | "BTS" | "VFX" | "Production" | string;
  caption?: string;
  order?: number;
}

export interface BeforeAfterPair {
  id: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  description?: string;
}

export interface VFXBreakdownItem {
  id: string;
  title: string;
  finalMedia: string;
  beforeMedia?: string;
  processMedia?: string;
  description?: string;
  softwareTools?: string[];
  order?: number;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  socialLink?: string;
  order?: number;
  visible?: boolean;
}

export interface AwardItem {
  id?: string;
  title: string;
  festivalName: string;
  year?: string;
  category?: string;
  awardIconUrl?: string;
  order?: number;
}

export interface ProjectLinkItem {
  id?: string;
  label: string;
  url: string;
  platform?: "YouTube" | "Vimeo" | "IMDb" | "Behance" | "Instagram" | "Website" | string;
  icon?: string;
  visible?: boolean;
}

export interface SectionVisibility {
  hero: boolean;
  story: boolean;
  video: boolean;
  gallery: boolean;
  beforeAfter: boolean;
  vfxBreakdown: boolean;
  team: boolean;
  credits: boolean;
  awards: boolean;
  links: boolean;
  comments: boolean;
}

export interface ProjectVideoConfig {
  videoUrl?: string | undefined;
  videoId?: string | undefined;
  title?: string | undefined;
  posterImage?: string | undefined;
  type?: "youtube" | "vimeo" | "mp4" | undefined;
  autoplay?: boolean | undefined;
  muted?: boolean | undefined;
}

export interface ProjectDriveVideo {
  id: string;
  title: string;
  driveFileId: string;
  thumbnailLabel?: string;
  notes?: string;
}

export interface EditingBreakdownItem {
  title: string;
  description: string;
  tools?: string[];
}

export interface ProjectSEOSettings {
  seoTitle?: string | undefined;
  metaDescription?: string | undefined;
  keywords?: string | undefined;
  ogTitle?: string | undefined;
  ogDescription?: string | undefined;
  ogImage?: string | undefined;
  imageAlt?: string | undefined;
  canonicalUrl?: string | undefined;
}

export type Project = {
  slug: string;
  number: string;
  title: string;
  type: string;
  role: string;
  year?: string | undefined;
  status?: string | undefined;
  description: string;
  process: string[];
  visuals: string;
  image: string; // primary cover image
  hasVideo?: boolean | undefined;
  videoId?: string | undefined;
  credits?:
    | {
        role: string;
        name: string;
      }[]
    | undefined;
  fullCredits?: string | undefined;
  category: "FILMMAKING" | "VFX / CG" | "EDITING" | "DESIGN" | "CONTENT";
  posterImage?: string | undefined;
  showBeforeAfter?: boolean | undefined;
  beforeImage?: string | undefined;
  afterImage?: string | undefined;
  galleryImages?: string[] | undefined;
  client?: string | undefined;
  emotionalDescriptor?: string | undefined;
  whatIFelt?: string | undefined;
  publishStatus?: "PUBLISHED" | "DRAFT" | undefined;

  // New Upgrade Fields
  heroImage?: string | undefined;
  thumbnailImage?: string | undefined;
  featuredThumbnail?: string | undefined;
  ogImage?: string | undefined;
  imageAlt?: string | undefined;
  logline?: string | undefined;
  synopsis?: string | undefined;
  directorNote?: string | undefined;
  duration?: string | undefined;
  formatSpecs?: string | undefined;
  tags?: string[] | undefined;
  galleryItems?: GalleryItem[] | undefined;
  beforeAfterPairs?: BeforeAfterPair[] | undefined;
  vfxBreakdowns?: VFXBreakdownItem[] | undefined;
  teamCredits?: TeamMember[] | undefined;
  awards?: AwardItem[] | undefined;
  projectLinks?: ProjectLinkItem[] | undefined;
  sectionVisibility?: SectionVisibility | undefined;
  videoConfig?: ProjectVideoConfig | undefined;
  seoSettings?: ProjectSEOSettings | undefined;

  // Google Drive & Editing Specific Fields
  driveVideos?: ProjectDriveVideo[] | undefined;
  editingBreakdown?: EditingBreakdownItem[] | undefined;
  notice?: string | undefined;
  toolsUsed?: string[] | undefined;
};

export const defaultSectionVisibility: SectionVisibility = {
  hero: true,
  story: true,
  video: true,
  gallery: true,
  beforeAfter: true,
  vfxBreakdown: true,
  team: true,
  credits: true,
  awards: true,
  links: true,
  comments: true,
};

// Default fallback projects (Film, VFX & Editing)
export const defaultProjects: Project[] = [
  {
    slug: "one-last-day",
    number: "01",
    title: "One Last Day",
    type: "Short Film",
    role: "Story • Screenplay • Director • Editor • DI",
    year: "2023",
    status: "Released",
    logline: "A heartfelt story of silence, regret, and final goodbyes.",
    synopsis:
      "A heartfelt story of silence, regret and final goodbyes. This was Rohith V's first short film attempt, made without prior filmmaking experience. Shot entirely on iPhone with zero budget. The project became a major learning experience through experimentation, mistakes, storytelling, direction, editing and teamwork.",
    directorNote:
      "My first film was about learning through mistakes. Every limitation became creative opportunity. The silence in the film reflects how I learned to let frames breathe.",
    duration: "10 MIN",
    formatSpecs: "4K • COLOR • 2.39:1 • IPHONE",
    tags: ["FILMMAKING", "SHORT FILM", "DRAMA", "DIRECTION", "EDITING", "IPHONE"],
    description:
      "A heartfelt story of silence, regret and final goodbyes. This was Rohith V's first short film attempt, made without prior filmmaking experience. Shot entirely on iPhone with zero budget. The project became a major learning experience through experimentation, mistakes, storytelling, direction, editing and teamwork.",
    process: [
      "Story and screenplay development",
      "Direction on set",
      "Shot planning and scene composition",
      "Visual storytelling and blocking",
      "Editing and post-production through final cut",
      "DI (Digital Intermediate)",
    ],
    visuals: "Film video, poster, film stills, editing/VFX breakdown",
    image: oneLastDay,
    heroImage: oneLastDay,
    thumbnailImage: oneLastDay,
    featuredThumbnail: oneLastDay,
    posterImage: oneLastDayPoster,
    showBeforeAfter: true,
    beforeImage: oneLastDayBefore,
    afterImage: oneLastDayAfter,
    beforeAfterPairs: [
      {
        id: "pair-1",
        beforeImage: oneLastDayBefore,
        afterImage: oneLastDayAfter,
        beforeLabel: "BEFORE CG",
        afterLabel: "AFTER CG",
        title: "Color Grading & Atmosphere Pass",
        description: "Enhancing the emotive twilight hue and contrast in DaVinci Resolve.",
      },
    ],
    galleryImages: [oneLastDay, oneLastDayPoster],
    galleryItems: [
      { url: oneLastDay, category: "Film Stills", caption: "Deva contemplating the silent departure" },
      { url: oneLastDayPoster, category: "Production", caption: "Official Festival Poster Artwork" },
    ],
    hasVideo: true,
    videoId: "tUnBO1O66Fc",
    videoConfig: {
      videoId: "tUnBO1O66Fc",
      videoUrl: "https://www.youtube.com/watch?v=tUnBO1O66Fc",
      title: "One Last Day — Official Short Film",
      type: "youtube",
    },
    teamCredits: [
      { name: "Rohith V", role: "Director / Writer / Editor / DI", visible: true },
      { name: "Yash Vijay", role: "Lead Actor (Deva)", visible: true },
      { name: "Yashwanth VK", role: "Assistant Director / DOP", visible: true },
      { name: "Danny & Govarthan", role: "Music & Score", visible: true },
    ],
    projectLinks: [
      { label: "Watch Film on YouTube", url: "https://www.youtube.com/watch?v=tUnBO1O66Fc", platform: "YouTube", visible: true },
    ],
    sectionVisibility: { ...defaultSectionVisibility },
    fullCredits:
      "Written / Story / Screenplay / Directed / Edited / DI: Rohith V\n\nCast:\nYash Vijay as Deva\nVarsha\n\nAssistant Director / Script Supervisor:\nYashwanth VK\n\nAssistant Directors:\nRamu\nYukesh\n\nDOP:\nYashwanth VK\nBhuvana\n\nMusic:\nDanny\nGovarthan\n\nDubbing:\nDharshan Karthi as Loran\nYukendiran — VO\n\nCrew:\nRitesh\nYabees\nSalvador Madhavan\n\nSpecial Thanks:\nRegan\nFarwys\n\nShot with: iPhone\nBudget: Zero\nLanguage: Tamil with English essence",
    category: "FILMMAKING",
    emotionalDescriptor: "A story about letting go.",
    whatIFelt:
      "My first film was about learning through mistakes. Every limitation became creative opportunity. The silence in the film reflects how I learned to let frames breathe.",
    publishStatus: "PUBLISHED",
  },
  {
    slug: "toothpaste",
    number: "02",
    title: "Toothpaste",
    type: "Short Film",
    role: "Story • Direction • Editing",
    year: "2024",
    status: "Completed",
    logline: "An everyday morning routine turns into an unsettling psychological twist.",
    synopsis:
      "A suspenseful and mind-bending short film that turns an everyday morning routine into something unsettling. Shot entirely on iPhone and created with friends in 2024. The project explores suspense, visual storytelling and an unexpected twist using minimal resources.",
    duration: "4 MIN",
    formatSpecs: "4K • COLOR • SUSPENSE",
    tags: ["FILMMAKING", "SHORT FILM", "SUSPENSE", "THRILLER", "IPHONE"],
    description:
      "A suspenseful and mind-bending short film that turns an everyday morning routine into something unsettling. Shot entirely on iPhone and created with friends in 2024. The project explores suspense, visual storytelling and an unexpected twist using minimal resources.",
    process: ["Story development", "Direction on set", "Editing and post-production"],
    visuals: "Video, poster, film stills",
    image: toothpaste,
    heroImage: toothpaste,
    thumbnailImage: toothpaste,
    featuredThumbnail: toothpaste,
    galleryImages: [toothpaste],
    galleryItems: [{ url: toothpaste, category: "Film Stills", caption: "Morning bathroom routine stillness" }],
    hasVideo: true,
    videoId: "JBkb8iHCOh4",
    videoConfig: {
      videoId: "JBkb8iHCOh4",
      videoUrl: "https://www.youtube.com/watch?v=JBkb8iHCOh4",
      title: "Toothpaste — Short Film",
      type: "youtube",
    },
    teamCredits: [
      { name: "Rohith V", role: "Story / Direction / Editing", visible: true },
      { name: "Yashwanth VK", role: "DOP / Cast", visible: true },
      { name: "Ramu", role: "Cast", visible: true },
      { name: "Govarthan", role: "Music", visible: true },
    ],
    projectLinks: [
      { label: "Watch on YouTube", url: "https://www.youtube.com/watch?v=JBkb8iHCOh4", platform: "YouTube", visible: true },
    ],
    sectionVisibility: { ...defaultSectionVisibility, beforeAfter: false },
    fullCredits:
      "Story / Direction / Editing: Rohith V\n\nDOP: Yashwanth VK\n\nAssistant Directors:\nYukesh\nYash Vijay\n\nCast:\nRamu\nYashwanth VK\n\nMusic: Govarthan",
    category: "FILMMAKING",
    emotionalDescriptor: "An idea turned into a visual experience.",
    whatIFelt:
      "The everyday can become unsettling with the right perspective. This film taught me that suspense lives in the details we usually ignore.",
    publishStatus: "PUBLISHED",
  },
  {
    slug: "kadalar",
    number: "03",
    title: "Kadalar",
    type: "Pilot Film",
    role: "CG Artist — Selected CGI Contribution",
    year: "2024",
    status: "Completed",
    logline: "Atmospheric CGI enhancements for director Siva Murugan's narrative pilot.",
    synopsis:
      "Pilot film directed by Siva Murugan. Contributed to selected CGI work including Candle CGI and News CGI. Some CGI had already been worked on by another CG artist before this contribution.",
    duration: "PILOT",
    formatSpecs: "VFX / CGI INTEGRATION",
    tags: ["VFX", "CGI", "BLENDER", "PILOT FILM", "COMPOSITING"],
    description:
      "Pilot film directed by Siva Murugan. Contributed to selected CGI work including Candle CGI and News CGI. Some CGI had already been worked on by another CG artist before this contribution.",
    process: [
      "Candle CGI contribution",
      "News CGI contribution",
      "CG-based visual development",
      "Post-production support",
    ],
    visuals: "Images, actual before/after CGI images, VFX material",
    image: kadalar,
    heroImage: kadalar,
    thumbnailImage: kadalar,
    featuredThumbnail: kadalar,
    galleryImages: [kadalar],
    galleryItems: [{ url: kadalar, category: "VFX", caption: "Key frame visual tone & lighting" }],
    vfxBreakdowns: [
      {
        id: "vfx-1",
        title: "Candle Light & Smoke CGI Simulation",
        finalMedia: kadalar,
        description: "Simulating dynamic candle flicker and volumetric smoke elements integrated seamlessly.",
        softwareTools: ["Blender", "After Effects"],
        order: 1,
      },
      {
        id: "vfx-2",
        title: "Broadcast Screen Replacement & News CGI",
        finalMedia: kadalar,
        description: "Realistic surface reflections, CRT scanline generation, and news overlay compositing.",
        softwareTools: ["After Effects", "Photoshop"],
        order: 2,
      },
    ],
    teamCredits: [
      { name: "Siva Murugan", role: "Director", visible: true },
      { name: "Rohith V", role: "CG Artist (Candle & News CGI)", visible: true },
    ],
    sectionVisibility: { ...defaultSectionVisibility, video: false },
    fullCredits:
      "Director: Siva Murugan\n\nCG Artist — Selected CGI Contribution: Rohith V\n\n(Contributed to Candle CGI and News CGI)",
    category: "VFX / CG",
    emotionalDescriptor: "Where the frame carries the feeling.",
    whatIFelt:
      "Collaborating on a pilot film showed me how CGI should serve the story, not just look cool. Every effect had to have emotional weight.",
    publishStatus: "PUBLISHED",
  },
  {
    slug: "radhal",
    number: "04",
    title: "Radhal",
    type: "Pilot Film",
    role: "Assistant Writer — Script & Screenplay",
    year: "2025",
    status: "In Pre-Production",
    logline: "An intense narrative screenplay exploring unspoken human depths.",
    synopsis:
      "Upcoming pilot film project. Currently serving as Assistant Writer for script and screenplay development. The screenplay is currently being developed.",
    duration: "IN DEVELOPMENT",
    formatSpecs: "SCREENPLAY / PRE-PRODUCTION",
    tags: ["WRITING", "SCREENPLAY", "PRE-PRODUCTION", "NARRATIVE"],
    description:
      "Upcoming pilot film project. Currently serving as Assistant Writer for script and screenplay development. The screenplay is currently being developed.",
    process: [
      "Story structure development",
      "Scene development",
      "Narrative planning",
      "Script and screenplay assistance",
    ],
    visuals: "Screenplay material, pre-production material",
    image: radhal,
    heroImage: radhal,
    thumbnailImage: radhal,
    featuredThumbnail: radhal,
    galleryImages: [radhal],
    galleryItems: [{ url: radhal, category: "Production", caption: "Screenplay drafts & visual moodboard" }],
    teamCredits: [
      { name: "Rohith V", role: "Assistant Writer — Script & Screenplay", visible: true },
    ],
    sectionVisibility: { ...defaultSectionVisibility, video: false, beforeAfter: false, vfxBreakdown: false },
    fullCredits: "Status: In Pre-Production\n\nRole: Assistant Writer — Script & Screenplay",
    category: "FILMMAKING",
    emotionalDescriptor: "A story that stays after the frame ends.",
    whatIFelt:
      "Screenwriting taught me that every line must earn its place. This ongoing project is about patience and finding the right word at the right moment.",
    publishStatus: "PUBLISHED",
  },

  // ----------------------------------------------------
  // EDITING PORTFOLIO PROJECTS
  // ----------------------------------------------------
  {
    slug: "personal-edits",
    number: "05",
    title: "Personal Edits",
    type: "Freelance / Personal Client Work",
    role: "Editor — footage enhancement, clean cuts, pacing, colour correction, subtitles, music, visual polish and After Effects finishing.",
    year: "2024",
    status: "Completed",
    logline: "Shaping raw client and student footage into pacing-accurate, polished video content.",
    synopsis:
      "Personal editing work created for friends, student creators and individual clients who approach me for small paid editing projects. I take their raw footage and shape it into a finished video with clean cuts, pacing, enhancement, colour correction, music, subtitles and visual polish. The work includes videos for political influencers and college students, adapting each edit to its purpose and audience.",
    duration: "4 FILMS",
    formatSpecs: "16:9 • MULTI-VIDEO REEL",
    tags: ["Personal Work", "Social Media", "Colour Correction", "After Effects"],
    description:
      "Personal editing work created for friends, student creators and individual clients who approach me for small paid editing projects. I take their raw footage and shape it into a finished video with clean cuts, pacing, enhancement, colour correction, music, subtitles and visual polish. The work includes videos for political influencers and college students, adapting each edit to its purpose and audience.",
    process: [
      "Reviewing and cataloging raw client footage",
      "Assembly and rhythm-based rough cutting",
      "Colour correction and contrast balancing",
      "Music sync and audio enhancement",
      "Subtitles, typography and After Effects finishing",
    ],
    visuals: "4 Video Edits, Social Media Cuts, After Effects Assets",
    image: aboutEditroom,
    heroImage: aboutEditroom,
    thumbnailImage: aboutEditroom,
    featuredThumbnail: aboutEditroom,
    category: "EDITING",
    emotionalDescriptor: "Every cut shapes the story.",
    whatIFelt:
      "Working with diverse client raw footage taught me adaptability — finding the natural rhythm of every person's voice and keeping the viewer locked into every frame.",
    publishStatus: "PUBLISHED",
    driveVideos: [
      {
        id: "pe-1",
        title: "Personal Edit — Video 01",
        thumbnailLabel: "Film 01",
        driveFileId: "14DyIUsAOckUlDhnncV-vvwV1A4lKRG4f",
      },
      {
        id: "pe-2",
        title: "Personal Edit — Video 02",
        thumbnailLabel: "Film 02",
        driveFileId: "18JZLgyNq6bDacWY0yKT8FbX3dDvp9T6i",
      },
      {
        id: "pe-3",
        title: "Personal Edit — Video 03",
        thumbnailLabel: "Film 03",
        driveFileId: "1DetEXBoQEMIs53thvgz4_LWAZ09LTmJD",
      },
      {
        id: "pe-4",
        title: "Personal Edit — Video 04",
        thumbnailLabel: "Film 04",
        driveFileId: "1K_Dy4b_p6d2Z6_LQMWAAzpj6ETHnPI7i",
      },
    ],
    toolsUsed: ["Premiere Pro", "DaVinci Resolve", "After Effects", "Photoshop"],
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
    seoSettings: {
      seoTitle: "Personal Edits | Rohith V — Editing Portfolio",
      metaDescription: "Personal editing work created for friends, student creators and individual clients with clean cuts, pacing, colour correction, and visual polish by Rohith V.",
    },
    sectionVisibility: { ...defaultSectionVisibility, beforeAfter: false, vfxBreakdown: false },
    fullCredits: "Role: Editor\n\nEditing, Enhancement, Colour Correction, Subtitles, Music & After Effects Finishing: Rohith V",
  },

  {
    slug: "skytree-solution",
    number: "06",
    title: "Skytree Solution",
    type: "Corporate / Information Video",
    role: "Editor — information edit, subtitles, visual assets, pacing and post-production.",
    year: "2024",
    status: "Completed",
    logline: "Information-focused post-production structuring clear corporate messaging with professional asset placement.",
    synopsis:
      "An information-focused video created for Skytree Solution. The team provided the original shoot footage, and I handled the post-production — structuring the information clearly, editing the footage, adding subtitles, sourcing and placing visual assets and refining the presentation for a professional final output.",
    duration: "1 FILM",
    formatSpecs: "16:9 • CORPORATE POST-PRODUCTION",
    tags: ["Corporate", "Information Video", "Subtitles", "Assets"],
    description:
      "An information-focused video created for Skytree Solution. The team provided the original shoot footage, and I handled the post-production — structuring the information clearly, editing the footage, adding subtitles, sourcing and placing visual assets and refining the presentation for a professional final output.",
    process: [
      "Structuring information flow and corporate messaging",
      "Footage assembly and seamless transitions",
      "Subtitles and typographic hierarchy",
      "Visual asset placement and branding",
      "Audio balancing and master export",
    ],
    visuals: "Corporate Film, Motion Graphics, Subtitled Master",
    image: heroStreet,
    heroImage: heroStreet,
    thumbnailImage: heroStreet,
    featuredThumbnail: heroStreet,
    category: "EDITING",
    emotionalDescriptor: "Clarity meets precision.",
    whatIFelt:
      "Corporate edits demand absolute clarity. The goal was to make technical information easy to absorb while preserving a modern, professional polish.",
    publishStatus: "PUBLISHED",
    driveVideos: [
      {
        id: "skytree-1",
        title: "Skytree Solution Corporate Overview",
        thumbnailLabel: "Film 01",
        driveFileId: "1PI2kVk5fRUQCaa0leyduwXKUw_-vaS01",
      },
    ],
    toolsUsed: ["Premiere Pro", "After Effects", "Photoshop"],
    editingBreakdown: [
      {
        title: "Information Architecture & Pacing",
        description: "Structuring corporate talking points into a logical, quick-to-digest narrative timeline.",
        tools: ["Premiere Pro"],
      },
      {
        title: "Visual Assets & Screen Callouts",
        description: "Creating and animating screen callouts, icons, and graphic overlays supporting the speaker's points.",
        tools: ["After Effects", "Photoshop"],
      },
      {
        title: "Subtitles & Broadcast Typography",
        description: "Clear, modern typography designed for corporate social channels and presentations.",
        tools: ["Premiere Pro", "After Effects"],
      },
      {
        title: "Audio Mastering",
        description: "Voice equalization, background score ducking, and clean audio mastering.",
        tools: ["Premiere Pro"],
      },
    ],
    seoSettings: {
      seoTitle: "Skytree Solution | Rohith V — Editing Portfolio",
      metaDescription: "Information-focused video created for Skytree Solution with subtitles, visual assets, and post-production by Rohith V.",
    },
    sectionVisibility: { ...defaultSectionVisibility, beforeAfter: false, vfxBreakdown: false },
    fullCredits: "Client: Skytree Solution\n\nEditor — Information edit, subtitles, visual assets, pacing and post-production: Rohith V",
  },

  {
    slug: "tiruvannamalai-polytechnic",
    number: "07",
    title: "Tiruvannamalai Polytechnic",
    type: "College Promotional / Admission Video",
    role: "Editor — online footage selection, assembly, pacing and promotional edit.",
    year: "2024",
    status: "Completed",
    logline: "Promotional and admission-focused narrative assembled from online assets with clear student engagement.",
    synopsis:
      "A promotional and admission-oriented edit created for students interested in joining a Government Polytechnic College in Tiruvannamalai. I built the edit using relevant online footage, arranging the visuals and pacing to communicate the college and its admission message clearly.",
    duration: "1 FILM",
    formatSpecs: "16:9 • ADMISSION CAMPAIGN",
    tags: ["Education", "Promotional", "Online Footage", "College"],
    description:
      "A promotional and admission-oriented edit created for students interested in joining a Government Polytechnic College in Tiruvannamalai. I built the edit using relevant online footage, arranging the visuals and pacing to communicate the college and its admission message clearly.",
    process: [
      "Curating and evaluating existing online college footage",
      "Assembling an engaging, student-centric storyline",
      "Fast-paced cutting and visual momentum",
      "Clear admission deadline & department callouts",
      "Dynamic soundtrack alignment",
    ],
    visuals: "Promotional Video, Online Asset Assembly",
    image: aboutEditroom,
    heroImage: aboutEditroom,
    thumbnailImage: aboutEditroom,
    featuredThumbnail: aboutEditroom,
    category: "EDITING",
    emotionalDescriptor: "Inspiring the next generation.",
    whatIFelt:
      "When working with archived online footage, storytelling is everything. It was about creating rhythm and excitement to encourage students towards higher education.",
    publishStatus: "PUBLISHED",
    driveVideos: [
      {
        id: "tvm-poly-1",
        title: "Tiruvannamalai Polytechnic Admission Video",
        thumbnailLabel: "Film 01",
        driveFileId: "1Nu0gD0TD4heEAOcMnPwrtDyJoGmsbaQZ",
      },
    ],
    toolsUsed: ["Premiere Pro", "DaVinci Resolve", "Photoshop"],
    editingBreakdown: [
      {
        title: "Online Footage Selection & Upscaling",
        description: "Filtering online footage sources, color matching clips from multiple resolutions, and sharpening visual presentation.",
        tools: ["Premiere Pro", "DaVinci Resolve"],
      },
      {
        title: "Pacing & Student Engagement",
        description: "Upbeat rhythm designed to capture the attention of prospective polytechnic candidates.",
        tools: ["Premiere Pro"],
      },
      {
        title: "Call-to-Action & Information Overlays",
        description: "Admission procedures, contact numbers, and department highlights clearly presented.",
        tools: ["Photoshop", "Premiere Pro"],
      },
    ],
    seoSettings: {
      seoTitle: "Tiruvannamalai Polytechnic | Rohith V — Editing Portfolio",
      metaDescription: "Promotional and admission-oriented edit for Government Polytechnic College in Tiruvannamalai by Rohith V.",
    },
    sectionVisibility: { ...defaultSectionVisibility, beforeAfter: false, vfxBreakdown: false },
    fullCredits: "Project: Government Polytechnic College, Tiruvannamalai\n\nEditor — Online footage selection, assembly, pacing and promotional edit: Rohith V",
  },

  {
    slug: "tv-show",
    number: "08",
    title: "TV Show",
    type: "Television / News & Entertainment",
    role: "Concept, Planning, Script, Shoot, Re-lighting, Editing and Post-production.",
    year: "2024",
    status: "Completed",
    logline: "Television-format production developed end-to-end with broadcast pacing and studio aesthetics.",
    synopsis:
      "A television-format project developed and executed by me from concept to production. I planned the format, worked on the script, handled the shoot and designed the re-lighting and visual presentation before editing the final episode.",
    duration: "1 FILM (+ 2 IN PIPELINE)",
    formatSpecs: "16:9 • BROADCAST FORMAT",
    tags: ["Television", "Self-Produced", "Script", "Shoot", "Re-lighting"],
    description:
      "A television-format project developed and executed by me from concept to production. I planned the format, worked on the script, handled the shoot and designed the re-lighting and visual presentation before editing the final episode.",
    notice: "Two additional TV-show videos will be added later.",
    process: [
      "TV show concept development and rundown formatting",
      "Screenplay and host scripting",
      "Studio re-lighting and multi-cam setup",
      "Principal photography / shoot execution",
      "Broadcast editing, graphics, and master grading",
    ],
    visuals: "TV Episode, Multi-Cam Edits, Studio Graphics",
    image: heroStreet,
    heroImage: heroStreet,
    thumbnailImage: heroStreet,
    featuredThumbnail: heroStreet,
    category: "EDITING",
    emotionalDescriptor: "From concept to broadcast screen.",
    whatIFelt:
      "Owning every stage of a TV format—from the lighting grid and script to the edit timeline—gave me complete control over visual tone and viewer momentum.",
    publishStatus: "PUBLISHED",
    driveVideos: [
      {
        id: "tv-show-ep1",
        title: "TV Show — Episode 01",
        thumbnailLabel: "Film 01",
        driveFileId: "10V-hEqSaC93iYi1jmH-oclTr2qh_U6dz",
      },
    ],
    toolsUsed: ["Premiere Pro", "After Effects", "Photoshop", "Studio Lighting"],
    editingBreakdown: [
      {
        title: "Studio Lighting & Camera Alignment",
        description: "Custom key/fill/rim lighting design and camera multi-angle matching.",
        tools: ["Studio Lighting", "DaVinci Resolve"],
      },
      {
        title: "Multi-Angle Assembly & Cuts",
        description: "Seamless host and guest reaction switching with frame-accurate cues.",
        tools: ["Premiere Pro"],
      },
      {
        title: "Television Lower Thirds & Title Cards",
        description: "Broadcast-ready motion graphics, show identity, and lower thirds.",
        tools: ["After Effects", "Photoshop"],
      },
      {
        title: "Broadcast Audio Mastering",
        description: "Multi-track voice leveling, stingers, and ambient audio management.",
        tools: ["Premiere Pro"],
      },
    ],
    seoSettings: {
      seoTitle: "TV Show | Rohith V — Editing Portfolio",
      metaDescription: "Television-format project executed from concept to production, script, shoot, lighting, and post-production by Rohith V.",
    },
    sectionVisibility: { ...defaultSectionVisibility, beforeAfter: false, vfxBreakdown: false },
    fullCredits: "Format / Script / Shoot / Lighting / Editing: Rohith V\n\nNote: 2 additional TV-show episodes currently in post-production pipeline.",
  },

  {
    slug: "vels-global-school",
    number: "09",
    title: "Vels Global School",
    type: "School Promotional Campaign",
    role: "Editor — slow-paced cuts, music, pacing, After Effects, visual finishing and promotional post-production.",
    year: "2024",
    status: "Completed",
    logline: "Multi-video promotional campaign crafted with controlled pacing, elegant music, and After Effects visual finishing.",
    synopsis:
      "A collection of promotional videos edited for Vels Global School during a promotional month. The production team provided the footage, and I handled the post-production with a focus on slow, controlled pacing, clean cuts, music and professional visual finishing. I used After Effects where needed to elevate the presentation and deliver a polished result that satisfied the team.",
    duration: "11 FILMS",
    formatSpecs: "16:9 • MULTI-REEL CAMPAIGN",
    tags: ["School Promotion", "Promotional Campaign", "After Effects", "Music", "Pacing"],
    description:
      "A collection of promotional videos edited for Vels Global School during a promotional month. The production team provided the footage, and I handled the post-production with a focus on slow, controlled pacing, clean cuts, music and professional visual finishing. I used After Effects where needed to elevate the presentation and deliver a polished result that satisfied the team.",
    process: [
      "Reviewing extensive footage archives across multiple school activities",
      "Developing a calm, slow-paced aesthetic tailored for educational prestige",
      "After Effects title animations and badge placements",
      "Musical synchronization with warm acoustic compositions",
      "Color grading for vibrant student and campus visuals",
      "Exporting 11 distinct promotional cuts for marketing distribution",
    ],
    visuals: "11 Campaign Videos, Social Media Cuts, After Effects Assets",
    image: aboutEditroom,
    heroImage: aboutEditroom,
    thumbnailImage: aboutEditroom,
    featuredThumbnail: aboutEditroom,
    category: "EDITING",
    emotionalDescriptor: "Graceful pacing that captures learning.",
    whatIFelt:
      "Promotional videos often rush. For Vels Global School, letting the frames breathe and using soft, controlled cuts created an atmosphere of elegance and trust.",
    publishStatus: "PUBLISHED",
    driveVideos: [
      {
        id: "vels-1",
        title: "Vels Global School — Promo 01",
        thumbnailLabel: "Film 01",
        driveFileId: "1-BU1tuMwiYmrbXJkmO4Ocomy4CLBeVji",
      },
      {
        id: "vels-2",
        title: "Vels Global School — Promo 02",
        thumbnailLabel: "Film 02",
        driveFileId: "18-EBZZAxbMk_STve6qT1HsKsf9FkugMM",
      },
      {
        id: "vels-3",
        title: "Vels Global School — Promo 03",
        thumbnailLabel: "Film 03",
        driveFileId: "1QW6ygLMztpNBwzddJ1LomXK38dp5dneu",
      },
      {
        id: "vels-4",
        title: "Vels Global School — Promo 04",
        thumbnailLabel: "Film 04",
        driveFileId: "1QYN765jBLU8q0WEPKfQVdykW8N70O247",
      },
      {
        id: "vels-5",
        title: "Vels Global School — Promo 05",
        thumbnailLabel: "Film 05",
        driveFileId: "1UA6DVZgrcZyeBVptlevK1EmWSxV59qNH",
      },
      {
        id: "vels-6",
        title: "Vels Global School — Promo 06",
        thumbnailLabel: "Film 06",
        driveFileId: "1cakvM1_kGLgG6hLItlXOnpCNx1Toi4Yt",
      },
      {
        id: "vels-7",
        title: "Vels Global School — Promo 07",
        thumbnailLabel: "Film 07",
        driveFileId: "1gIWapFh7kfeWlSwhn4AICQ9IPhfyo7tj",
      },
      {
        id: "vels-8",
        title: "Vels Global School — Promo 08",
        thumbnailLabel: "Film 08",
        driveFileId: "1k5C_j99Ah9NPUqtSFOu1lOG4Dz2qEtsW",
      },
      {
        id: "vels-9",
        title: "Vels Global School — Promo 09",
        thumbnailLabel: "Film 09",
        driveFileId: "1p56IODwZcFSp6QlByZyervFlQX8zBUlc",
      },
      {
        id: "vels-10",
        title: "Vels Global School — Promo 10",
        thumbnailLabel: "Film 10",
        driveFileId: "1reyuAbDjZcx5j3pi2KlUYK7iU2-5NnAz",
      },
      {
        id: "vels-11",
        title: "Vels Global School — Promo 11",
        thumbnailLabel: "Film 11",
        driveFileId: "1u7kmvkP5mUgdqha43VecsT-NgaQh8zmd",
      },
    ],
    toolsUsed: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
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
    seoSettings: {
      seoTitle: "Vels Global School | Rohith V — Editing Portfolio",
      metaDescription: "Collection of 11 promotional films edited for Vels Global School with slow-paced cuts, music, and After Effects visual finishing by Rohith V.",
    },
    sectionVisibility: { ...defaultSectionVisibility, beforeAfter: false, vfxBreakdown: false },
    fullCredits: "Client: Vels Global School\n\nEditor — Slow-paced cuts, music, pacing, After Effects, visual finishing and promotional post-production: Rohith V",
  },
];

import { supabase } from "@/integrations/supabase/client";

export function transformSupabaseProject(p: any): Project {
  // Parse gallery items if structured, or convert string array
  let galleryItems: GalleryItem[] = [];
  if (Array.isArray(p.gallery_items) && p.gallery_items.length > 0) {
    galleryItems = p.gallery_items.map((item: any) => ({
      ...item,
      url: resolveImageUrl(item.url || item.image || ""),
    }));
  } else if (Array.isArray(p.gallery_images)) {
    galleryItems = p.gallery_images.map((img: string, i: number) => ({
      url: resolveImageUrl(img),
      category: "Film Stills",
      order: i,
    }));
  }

  // Parse before/after pairs
  let beforeAfterPairs: BeforeAfterPair[] = [];
  if (Array.isArray(p.before_after_pairs) && p.before_after_pairs.length > 0) {
    beforeAfterPairs = p.before_after_pairs.map((pair: any) => ({
      ...pair,
      beforeImage: resolveImageUrl(pair.beforeImage || pair.before_image || ""),
      afterImage: resolveImageUrl(pair.afterImage || pair.after_image || ""),
    }));
  } else if (p.before_image && p.after_image) {
    beforeAfterPairs = [
      {
        id: "pair-primary",
        beforeImage: resolveImageUrl(p.before_image),
        afterImage: resolveImageUrl(p.after_image),
        beforeLabel: "BEFORE",
        afterLabel: "AFTER",
      },
    ];
  }

  // Parse VFX breakdowns
  let vfxBreakdowns: VFXBreakdownItem[] = [];
  if (Array.isArray(p.vfx_breakdowns) && p.vfx_breakdowns.length > 0) {
    vfxBreakdowns = p.vfx_breakdowns.map((vfx: any) => ({
      ...vfx,
      finalMedia: resolveImageUrl(vfx.finalMedia || vfx.final_media || ""),
      beforeMedia: vfx.beforeMedia ? resolveImageUrl(vfx.beforeMedia) : undefined,
      processMedia: vfx.processMedia ? resolveImageUrl(vfx.processMedia) : undefined,
    }));
  }

  // Parse team credits
  let teamCredits: TeamMember[] = [];
  if (Array.isArray(p.team_credits) && p.team_credits.length > 0) {
    teamCredits = p.team_credits.map((m: any) => ({
      ...m,
      avatarUrl: m.avatarUrl || m.avatar_url ? resolveImageUrl(m.avatarUrl || m.avatar_url) : undefined,
    }));
  } else if (Array.isArray(p.credits) && p.credits.length > 0) {
    teamCredits = p.credits.map((c: any) => ({
      name: c.name,
      role: c.role,
      visible: true,
    }));
  }

  // Parse awards
  let awards: AwardItem[] = [];
  if (Array.isArray(p.awards) && p.awards.length > 0) {
    awards = p.awards.map((a: any) => ({
      ...a,
      awardIconUrl: a.awardIconUrl || a.award_icon_url ? resolveImageUrl(a.awardIconUrl || a.award_icon_url) : undefined,
    }));
  }

  // Parse project links
  let projectLinks: ProjectLinkItem[] = [];
  if (Array.isArray(p.project_links) && p.project_links.length > 0) {
    projectLinks = p.project_links;
  }

  // Section visibility
  const sectionVisibility: SectionVisibility = {
    ...defaultSectionVisibility,
    ...(p.section_visibility || {}),
  };

  // Video config
  const videoConfig: ProjectVideoConfig = {
    videoUrl: p.video_url,
    videoId: p.video_id,
    title: p.video_title,
    posterImage: p.video_poster ? resolveImageUrl(p.video_poster) : undefined,
    type: p.video_type || "youtube",
    autoplay: p.video_autoplay,
    muted: p.video_muted,
  };

  // SEO settings
  const seoSettings: ProjectSEOSettings = {
    seoTitle: p.seo_title,
    metaDescription: p.meta_description,
    keywords: p.keywords,
    ogTitle: p.og_title,
    ogDescription: p.og_description,
    ogImage: p.og_image ? resolveImageUrl(p.og_image) : undefined,
    imageAlt: p.image_alt,
    canonicalUrl: p.canonical_url,
  };

  // Drive videos & editing breakdown
  const driveVideos: ProjectDriveVideo[] = Array.isArray(p.drive_videos)
    ? p.drive_videos
    : Array.isArray(p.driveVideos)
    ? p.driveVideos
    : [];

  const editingBreakdown: EditingBreakdownItem[] = Array.isArray(p.editing_breakdown)
    ? p.editing_breakdown
    : Array.isArray(p.editingBreakdown)
    ? p.editingBreakdown
    : [];

  const image = resolveImageUrl(p.image || p.cover_image || p.hero_image || "");
  const heroImage = resolveImageUrl(p.hero_image || p.image || "");
  const thumbnailImage = resolveImageUrl(p.thumbnail_image || p.image || "");
  const featuredThumbnail = resolveImageUrl(p.featured_thumbnail || p.image || "");

  // Find matching default project for editing enrichments if present
  const defaultFallback = defaultProjects.find((dp) => dp.slug === p.slug);

  return {
    slug: p.slug,
    number: p.number ? String(p.number).padStart(2, "0") : "01",
    title: p.title,
    type: p.type || "Film Project",
    role: p.role || "Filmmaker",
    year: p.year ? String(p.year) : undefined,
    status: p.status,
    description: p.description || "",
    process: Array.isArray(p.process) ? p.process : [],
    visuals: p.visuals || "",
    image: image || defaultFallback?.image || "",
    heroImage: heroImage || defaultFallback?.heroImage || "",
    thumbnailImage: thumbnailImage || defaultFallback?.thumbnailImage || "",
    featuredThumbnail: featuredThumbnail || defaultFallback?.featuredThumbnail || "",
    posterImage: p.poster_image ? resolveImageUrl(p.poster_image) : defaultFallback?.posterImage,
    showBeforeAfter: p.show_before_after ?? p.showBeforeAfter ?? false,
    beforeImage: p.before_image ? resolveImageUrl(p.before_image) : defaultFallback?.beforeImage,
    afterImage: p.after_image ? resolveImageUrl(p.after_image) : defaultFallback?.afterImage,
    hasVideo: p.has_video ?? p.hasVideo ?? false,
    videoId: p.video_id || p.videoId || defaultFallback?.videoId,
    category: p.category || defaultFallback?.category || "FILMMAKING",
    fullCredits: p.full_credits || p.fullCredits || defaultFallback?.fullCredits,
    emotionalDescriptor: p.emotional_descriptor || defaultFallback?.emotionalDescriptor,
    whatIFelt: p.what_i_felt || defaultFallback?.whatIFelt,
    publishStatus: p.publish_status || "PUBLISHED",
    logline: p.logline || defaultFallback?.logline,
    synopsis: p.synopsis || p.description || defaultFallback?.synopsis,
    directorNote: p.director_note || defaultFallback?.directorNote,
    duration: p.duration || defaultFallback?.duration,
    formatSpecs: p.format_specs || defaultFallback?.formatSpecs,
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : defaultFallback?.tags || [],
    galleryItems: galleryItems.length > 0 ? galleryItems : defaultFallback?.galleryItems,
    galleryImages: galleryItems.length > 0 ? galleryItems.map((g) => g.url) : defaultFallback?.galleryImages,
    beforeAfterPairs: beforeAfterPairs.length > 0 ? beforeAfterPairs : defaultFallback?.beforeAfterPairs,
    vfxBreakdowns: vfxBreakdowns.length > 0 ? vfxBreakdowns : defaultFallback?.vfxBreakdowns,
    teamCredits: teamCredits.length > 0 ? teamCredits : defaultFallback?.teamCredits,
    awards: awards.length > 0 ? awards : defaultFallback?.awards,
    projectLinks: projectLinks.length > 0 ? projectLinks : defaultFallback?.projectLinks,
    sectionVisibility,
    videoConfig,
    seoSettings,
    driveVideos: driveVideos.length > 0 ? driveVideos : defaultFallback?.driveVideos,
    editingBreakdown: editingBreakdown.length > 0 ? editingBreakdown : defaultFallback?.editingBreakdown,
    notice: p.notice || defaultFallback?.notice,
    toolsUsed: Array.isArray(p.tools_used) ? p.tools_used : defaultFallback?.toolsUsed,
  };
}

// Get projects directly from Supabase with fallback to defaultProjects (Film, VFX and Editing)
export async function getProjects(includeDrafts = false): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("number", { ascending: true });

    if (!error && data && data.length > 0) {
      const transformed = data.map(transformSupabaseProject);
      // Merge in any default projects that aren't yet created in Supabase (e.g. the 5 editing projects)
      const existingSlugs = new Set(transformed.map((p) => p.slug));
      const missingDefaults = defaultProjects.filter((dp) => !existingSlugs.has(dp.slug));
      const combined = [...transformed, ...missingDefaults];
      return includeDrafts ? combined : combined.filter((p) => p.publishStatus !== "DRAFT");
    }

    if (error) {
      console.warn("Supabase query returned error, trying API endpoint:", error);
    }

    // If running in browser and direct query failed, try API route as secondary option
    if (typeof window !== "undefined") {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const json = await response.json();
        if (json.projects && Array.isArray(json.projects)) {
          const transformed = json.projects.map(transformSupabaseProject);
          const existingSlugs = new Set(transformed.map((p: Project) => p.slug));
          const missingDefaults = defaultProjects.filter((dp) => !existingSlugs.has(dp.slug));
          const combined = [...transformed, ...missingDefaults];
          return includeDrafts ? combined : combined.filter((p: Project) => p.publishStatus !== "DRAFT");
        }
      }
    }

    if (error) {
      throw error;
    }

    const transformed = (data || []).map(transformSupabaseProject);
    const existingSlugs = new Set(transformed.map((p) => p.slug));
    const missingDefaults = defaultProjects.filter((dp) => !existingSlugs.has(dp.slug));
    const combined = [...transformed, ...missingDefaults];
    return includeDrafts ? combined : combined.filter((p: Project) => p.publishStatus !== "DRAFT");
  } catch (error) {
    console.error("getProjects error, falling back to default projects:", error);
    return includeDrafts ? defaultProjects : defaultProjects.filter((p) => p.publishStatus !== "DRAFT");
  }
}

// Legacy export for backward compatibility
export const projects = defaultProjects;

export const getProject = async (slug: string): Promise<Project | undefined> => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return transformSupabaseProject(data);
    }
  } catch (error) {
    console.warn(`Direct getProject query for ${slug} failed, checking project list:`, error);
  }

  const projectsList = await getProjects(true);
  return projectsList.find((p) => p.slug === slug);
};
