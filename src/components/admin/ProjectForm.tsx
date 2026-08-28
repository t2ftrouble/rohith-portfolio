import { useState, useEffect } from "react";
import type { ProjectFormData, ProjectCMSData } from "@/lib/project-cms";
import type {
  GalleryItem,
  BeforeAfterPair,
  VFXBreakdownItem,
  TeamMember,
  AwardItem,
  ProjectLinkItem,
  SectionVisibility,
} from "@/data/projects";
import { defaultSectionVisibility } from "@/data/projects";
import { assetOptions, getAssetById, getAssetByPathOrFilename } from "@/lib/asset-registry";
import { resolveImageUrl, getImageLabel } from "@/lib/asset-resolver";
import { AIAssistantModal } from "./AIAssistantModal";
import { GoogleDriveImportModal } from "./GoogleDriveImportModal";
import {
  Play,
  Eye,
  Upload,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  SlidersHorizontal,
  Plus,
  Info,
  Sparkles,
  Cloud,
  ChevronDown,
  ChevronUp,
  Share2,
  Film,
  Award,
  Users,
  Search,
  Settings,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface ProjectFormProps {
  project?: ProjectCMSData | null;
  onSave: (project: ProjectFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectForm({ project, onSave, onCancel, isLoading = false }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    slug: project?.slug || "",
    number: project?.number || "01",
    title: project?.title || "",
    type: project?.type || "Short Film",
    role: project?.role || "Story • Director • Editor",
    year: project?.year || new Date().getFullYear().toString(),
    status: project?.status || "Released",
    description: project?.description || "",
    visuals: project?.visuals || "Film video, poster, stills",
    category: (project?.category || "FILMMAKING") as ProjectFormData["category"],
    hasVideo: project?.hasVideo || false,
    videoId: project?.videoId || "",
    fullCredits: project?.fullCredits || "",
    client: project?.client || "",
    emotionalDescriptor: project?.emotionalDescriptor || "",
    whatIFelt: project?.whatIFelt || "",
    publishStatus: (project?.publishStatus || "PUBLISHED") as "PUBLISHED" | "DRAFT",

    // New Fields
    logline: project?.logline || "",
    synopsis: project?.synopsis || "",
    directorNote: project?.directorNote || "",
    duration: project?.duration || "",
    formatSpecs: project?.formatSpecs || "",
    tags: project?.tags?.join(", ") || "",
    imageAlt: project?.imageAlt || "",
    seoTitle: project?.seoSettings?.seoTitle || "",
    metaDescription: project?.seoSettings?.metaDescription || "",
    keywords: project?.seoSettings?.keywords || "",
    ogTitle: project?.seoSettings?.ogTitle || "",
    ogDescription: project?.seoSettings?.ogDescription || "",
    canonicalUrl: project?.seoSettings?.canonicalUrl || "",
    videoTitle: project?.videoConfig?.title || "",
    videoUrl: project?.videoConfig?.videoUrl || "",
  });

  // Separate media assets
  const [coverImage, setCoverImage] = useState<string>(project?.image || "");
  const [heroImage, setHeroImage] = useState<string>(project?.heroImage || "");
  const [thumbnailImage, setThumbnailImage] = useState<string>(project?.thumbnailImage || "");
  const [featuredThumbnail, setFeaturedThumbnail] = useState<string>(project?.featuredThumbnail || "");
  const [posterImage, setPosterImage] = useState<string>(project?.posterImage || "");
  const [ogImage, setOgImage] = useState<string>(project?.ogImage || "");

  // Multiple Before/After Pairs
  const [beforeAfterPairs, setBeforeAfterPairs] = useState<BeforeAfterPair[]>(
    project?.beforeAfterPairs && project.beforeAfterPairs.length > 0
      ? project.beforeAfterPairs
      : project?.beforeImage && project?.afterImage
      ? [
          {
            id: "pair-1",
            beforeImage: project.beforeImage,
            afterImage: project.afterImage,
            beforeLabel: "BEFORE",
            afterLabel: "AFTER",
            title: "Color Grade & VFX Pass",
          },
        ]
      : []
  );

  // Gallery Items (Multi images + categories)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    project?.galleryItems && project.galleryItems.length > 0
      ? project.galleryItems
      : (project?.galleryImages || []).map((img, i) => ({
          url: img,
          category: "Film Stills",
          order: i,
        }))
  );

  // VFX Breakdown Items
  const [vfxBreakdowns, setVfxBreakdowns] = useState<VFXBreakdownItem[]>(
    project?.vfxBreakdowns || []
  );

  // Structured Team Credits
  const [teamCredits, setTeamCredits] = useState<TeamMember[]>(
    project?.teamCredits || []
  );

  // Awards
  const [awards, setAwards] = useState<AwardItem[]>(project?.awards || []);

  // External Links
  const [projectLinks, setProjectLinks] = useState<ProjectLinkItem[]>(
    project?.projectLinks || []
  );

  // Section Visibility
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(
    project?.sectionVisibility || defaultSectionVisibility
  );

  const [processText, setProcessText] = useState<string>(project?.process?.join("\n") || "");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Modals
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveTargetSetter, setDriveTargetSetter] = useState<((url: string) => void) | null>(null);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const newSlug =
        !project && (!prev.slug || prev.slug === slugify(prev.title)) ? slugify(val) : prev.slug;
      return { ...prev, title: val, slug: newSlug };
    });
  };

  const handleFileUpload = async (
    file: File,
    onSuccess: (url: string) => void,
    folder: string = "projects"
  ) => {
    if (!file || !file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (JPG, PNG, WEBP)");
      return;
    }

    setIsUploading(true);
    setUploadStatus(`Uploading ${file.name}...`);
    setFormError(null);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: uploadData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(errJson.error || "Upload failed");
      }

      const data = await response.json();
      if (!data.url) throw new Error("No URL returned from upload server");

      onSuccess(data.url);
      setUploadStatus(`✓ Uploaded ${file.name} successfully`);
      setTimeout(() => setUploadStatus(null), 3500);
    } catch (error) {
      console.error("Upload error:", error);
      setFormError(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultiGalleryUpload = async (files: FileList) => {
    setIsUploading(true);
    setUploadStatus(`Uploading ${files.length} gallery images...`);

    const newItems: GalleryItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || !file.type.startsWith("image/")) continue;
      try {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("folder", "gallery");

        const response = await fetch("/api/upload", {
          method: "POST",
          credentials: "include",
          body: uploadData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            newItems.push({
              url: data.url,
              category: "Film Stills",
              order: galleryItems.length + newItems.length,
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (newItems.length > 0) {
      setGalleryItems((prev) => [...prev, ...newItems]);
      setUploadStatus(`✓ Added ${newItems.length} gallery images`);
      setTimeout(() => setUploadStatus(null), 3500);
    }
    setIsUploading(false);
  };

  const cleanVideoId = (input: string): string => {
    if (!input) return "";
    const match = input.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match && match[1] ? match[1] : input.trim();
  };

  const submitWithStatus = (overrideStatus?: "PUBLISHED" | "DRAFT") => {
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError("Project Title is required");
      return;
    }

    if (!coverImage.trim()) {
      setFormError("Cover Image is required. Please upload or select a cover image.");
      return;
    }

    const process = processText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const videoId = cleanVideoId(formData.videoId);
    const publishStatus = overrideStatus || formData.publishStatus;

    const parsedTags = formData.tags
      .split(",")
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    const payload: ProjectFormData = {
      slug: formData.slug.trim() || slugify(formData.title),
      number: formData.number.trim() || "01",
      title: formData.title.trim(),
      type: formData.type.trim() || "Short Film",
      role: formData.role.trim() || "Director",
      description: formData.description.trim() || formData.synopsis.trim(),
      process,
      visuals: formData.visuals.trim() || "Film stills",
      image: coverImage.trim(),
      category: formData.category,
      year: formData.year.trim() || null,
      status: formData.status.trim() || null,
      hasVideo: Boolean(videoId || formData.videoUrl),
      videoId: videoId || null,
      fullCredits: formData.fullCredits.trim() || null,
      client: formData.client.trim() || null,
      posterImage: posterImage.trim() || null,
      showBeforeAfter: beforeAfterPairs.length > 0,
      beforeImage: beforeAfterPairs[0]?.beforeImage || null,
      afterImage: beforeAfterPairs[0]?.afterImage || null,
      galleryImages: galleryItems.map((g) => g.url),
      emotionalDescriptor: formData.emotionalDescriptor.trim() || null,
      whatIFelt: formData.whatIFelt.trim() || null,
      publishStatus,

      // Upgrade Fields
      heroImage: heroImage.trim() || coverImage.trim(),
      thumbnailImage: thumbnailImage.trim() || coverImage.trim(),
      featuredThumbnail: featuredThumbnail.trim() || coverImage.trim(),
      ogImage: ogImage.trim() || null,
      imageAlt: formData.imageAlt.trim() || `${formData.title} — ${formData.type}`,
      logline: formData.logline.trim() || null,
      synopsis: formData.synopsis.trim() || null,
      directorNote: formData.directorNote.trim() || null,
      duration: formData.duration.trim() || null,
      formatSpecs: formData.formatSpecs.trim() || null,
      tags: parsedTags.length > 0 ? parsedTags : [formData.category],
      galleryItems,
      beforeAfterPairs,
      vfxBreakdowns,
      teamCredits,
      awards,
      projectLinks,
      sectionVisibility,
      videoConfig: {
        videoId: videoId || undefined,
        videoUrl: formData.videoUrl.trim() || undefined,
        title: formData.videoTitle.trim() || undefined,
      },
      seoSettings: {
        seoTitle: formData.seoTitle.trim() || undefined,
        metaDescription: formData.metaDescription.trim() || undefined,
        keywords: formData.keywords.trim() || undefined,
        ogTitle: formData.ogTitle.trim() || undefined,
        ogDescription: formData.ogDescription.trim() || undefined,
        ogImage: ogImage.trim() || undefined,
        canonicalUrl: formData.canonicalUrl.trim() || undefined,
      },
    };

    onSave(payload);
  };

  const handleApplyAIFunctions = (generated: Record<string, any>) => {
    setFormData((prev) => ({
      ...prev,
      logline: (generated["logline"] as string) || prev.logline,
      synopsis: (generated["synopsis"] as string) || prev.synopsis,
      directorNote: (generated["directorNote"] as string) || prev.directorNote,
      seoTitle: (generated["seoTitle"] as string) || prev.seoTitle,
      metaDescription: (generated["metaDescription"] as string) || prev.metaDescription,
      keywords: (generated["keywords"] as string) || prev.keywords,
      ogTitle: (generated["ogTitle"] as string) || prev.ogTitle,
      ogDescription: (generated["ogDescription"] as string) || prev.ogDescription,
      imageAlt: (generated["imageAlt"] as string) || prev.imageAlt,
      tags: Array.isArray(generated["tags"]) ? (generated["tags"] as string[]).join(", ") : prev.tags,
    }));
    setUploadStatus("✓ AI proposals applied! Review and save below.");
    setTimeout(() => setUploadStatus(null), 4000);
  };

  const openDrivePicker = (setter: (url: string) => void) => {
    setDriveTargetSetter(() => setter);
    setIsDriveModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 bg-charcoal">
      {/* Top Bar with AI Assistant Trigger & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="label-track text-gold">CMS PROJECT STUDIO</span>
          <h2 className="title-card mt-2 text-3xl text-ivory">
            {project ? `Edit: ${project.title}` : "Add New Cinematic Film"}
          </h2>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span>Status:</span>
            <span
              className={`label-track px-2 py-0.5 !text-[8px] rounded font-bold ${
                formData.publishStatus === "PUBLISHED"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              {formData.publishStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAIModalOpen(true)}
            className="label-track flex items-center gap-2 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border border-gold px-4 py-2 !text-[9px] !text-gold hover:bg-gold hover:!text-charcoal transition-all rounded shadow-md cursor-pointer font-bold"
          >
            <Sparkles size={13} />
            AI Content Assistant
          </button>

          <div className="flex rounded border border-border bg-navy/40 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`label-track px-4 py-2 !text-[9px] transition-colors rounded ${
                activeTab === "edit"
                  ? "bg-gold !text-charcoal font-bold"
                  : "text-ivory/70 hover:text-ivory"
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`label-track flex items-center gap-1.5 px-4 py-2 !text-[9px] transition-colors rounded ${
                activeTab === "preview"
                  ? "bg-gold !text-charcoal font-bold"
                  : "text-ivory/70 hover:text-ivory"
              }`}
            >
              <Eye size={12} />
              Preview
            </button>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="label-track border border-border px-4 py-2 !text-[9px] text-ivory/80 hover:text-ivory transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-3 bg-gold/10 border border-gold/40 text-gold text-xs rounded font-mono">
          {uploadStatus}
        </div>
      )}

      {formError && (
        <div className="p-4 bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded">
          {formError}
        </div>
      )}

      {/* ---------------- LIVE PREVIEW TAB ---------------- */}
      {activeTab === "preview" && (
        <div className="space-y-8 rounded border border-gold/40 bg-navy/20 p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <p className="label-track text-gold flex items-center gap-2">
              <Eye size={14} /> LIVE CINEMATIC PREVIEW
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className="label-track text-xs text-gold hover:underline"
            >
              ← Back to editing
            </button>
          </div>

          {/* Chapter Card Preview */}
          <div className="border border-border/60 bg-charcoal/80 p-6">
            <p className="label-track text-gold mb-4">PORTFOLIO / HOMEPAGE DISPLAY:</p>
            <div className="grid gap-6 md:grid-cols-12 md:items-center">
              <div className="md:col-span-5">
                <div className="flex items-center gap-2">
                  <span className="title-card text-4xl text-slate">{formData.number || "01"}</span>
                  <span className="label-track border border-border px-2 py-0.5 !text-[8px] text-gold">
                    {formData.category}
                  </span>
                </div>
                <h3 className="title-card mt-2 text-2xl text-ivory md:text-3xl">
                  {formData.title || "Untitled Project"}
                </h3>
                {formData.logline && (
                  <p className="mt-1 text-sm text-gold/80 italic font-serif leading-snug">"{formData.logline}"</p>
                )}
                <p className="label-track mt-2 text-gold">{formData.type || "Short Film"}</p>
                <p className="label-track mt-1 text-muted-foreground">{formData.role || "Director"}</p>
                <p className="label-track mt-4 text-ivory/80">View film →</p>
              </div>

              <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy md:col-span-7 border border-border/60">
                {coverImage ? (
                  <img
                    src={resolveImageUrl(coverImage)}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                    No cover image uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- EDIT FORM ---------------- */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitWithStatus();
        }}
        className={`space-y-8 ${activeTab === "preview" ? "hidden" : "block"}`}
      >
        {/* 1. BASIC FILM SPECIFICATIONS */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              1
            </span>
            <h3 className="title-card text-xl text-ivory">Project Meta & Categorization</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                Film / Project Title <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="e.g. One Last Day"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                Category <span className="text-gold">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ProjectFormData["category"],
                  })
                }
                required
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
              >
                <option value="FILMMAKING">FILMMAKING</option>
                <option value="VFX / CG">VFX / CG</option>
                <option value="EDITING">EDITING</option>
                <option value="DESIGN">DESIGN</option>
                <option value="CONTENT">CONTENT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                Project Type <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="e.g. Short Film, Pilot Film, Commercial"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                Your Role <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="e.g. Story • Director • Editor • DI"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">Release Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="e.g. 2024"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="e.g. 12 MIN"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">Format / Aspect Specs</label>
              <input
                type="text"
                value={formData.formatSpecs}
                onChange={(e) => setFormData({ ...formData, formatSpecs: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="e.g. 4K • COLOR • 2.39:1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">Chapter Number</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="01"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">URL Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none font-mono"
                placeholder="e.g. one-last-day"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">Tags (Comma Separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="FILMMAKING, SHORT FILM, VFX, EDITING"
              />
            </div>
          </div>
        </div>

        {/* 2. STORY, LOGLINE & SYNOPSIS */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              2
            </span>
            <h3 className="title-card text-xl text-ivory">Story, Logline & Director's Note</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              1-Line Logline (Punchy film hook)
            </label>
            <input
              type="text"
              value={formData.logline}
              onChange={(e) => setFormData({ ...formData, logline: e.target.value })}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
              placeholder='e.g. "A heartfelt story of silence, regret, and final goodbyes."'
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Project Synopsis / Story <span className="text-gold">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none leading-relaxed"
              placeholder="Tell the full narrative story and case study context..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Director's Note / Creative Reflection ("What I Felt")
            </label>
            <textarea
              value={formData.whatIFelt}
              onChange={(e) => setFormData({ ...formData, whatIFelt: e.target.value })}
              rows={3}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none"
              placeholder="Personal reflections behind the camera and frame..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Contribution Steps (Type one per line)
            </label>
            <textarea
              value={processText}
              onChange={(e) => setProcessText(e.target.value)}
              rows={3}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none font-mono text-xs"
              placeholder="Story and screenplay development&#10;Direction on set&#10;Shot planning and scene composition"
            />
          </div>
        </div>

        {/* 3. SEPARATE MEDIA HUBS (Cover, Hero, Thumbnails, Posters) */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              3
            </span>
            <h3 className="title-card text-xl text-ivory">Independent Visual Asset Hubs</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* COVER IMAGE */}
            <div className="p-4 bg-charcoal border border-border rounded space-y-2">
              <label className="text-xs font-bold text-gold uppercase flex items-center justify-between">
                <span>Cover (16:9) *</span>
                {coverImage && <span className="text-[9px] text-green-400">Set</span>}
              </label>
              {coverImage ? (
                <img src={resolveImageUrl(coverImage)} alt="Cover" className="aspect-video w-full object-cover rounded border border-border" />
              ) : (
                <div className="aspect-video w-full bg-navy/40 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border">No cover</div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => document.getElementById("cover-input")?.click()}
                  className="w-full text-center py-2 text-[9px] border border-gold text-gold rounded hover:bg-gold hover:text-charcoal font-bold"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => openDrivePicker((url) => setCoverImage(url))}
                  className="px-3 py-2 text-[9px] border border-border text-ivory/80 rounded hover:border-gold"
                  title="Import from Google Drive"
                >
                  <Cloud size={12} />
                </button>
              </div>
              <input id="cover-input" type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f, (url) => setCoverImage(url), "covers");
              }} />
            </div>

            {/* HERO BANNER IMAGE */}
            <div className="p-4 bg-charcoal border border-border rounded space-y-2">
              <label className="text-xs font-bold text-gold uppercase flex items-center justify-between">
                <span>Hero Banner (Wide)</span>
                {heroImage && <span className="text-[9px] text-green-400">Set</span>}
              </label>
              {heroImage ? (
                <img src={resolveImageUrl(heroImage)} alt="Hero" className="aspect-video w-full object-cover rounded border border-border" />
              ) : (
                <div className="aspect-video w-full bg-navy/40 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border">Same as cover</div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => document.getElementById("hero-input")?.click()}
                  className="w-full text-center py-2 text-[9px] border border-gold text-gold rounded hover:bg-gold hover:text-charcoal font-bold"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => openDrivePicker((url) => setHeroImage(url))}
                  className="px-3 py-2 text-[9px] border border-border text-ivory/80 rounded hover:border-gold"
                >
                  <Cloud size={12} />
                </button>
              </div>
              <input id="hero-input" type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f, (url) => setHeroImage(url), "heroes");
              }} />
            </div>

            {/* POSTER ARTWORK */}
            <div className="p-4 bg-charcoal border border-border rounded space-y-2">
              <label className="text-xs font-bold text-gold uppercase flex items-center justify-between">
                <span>Poster (2:3)</span>
                {posterImage && <span className="text-[9px] text-green-400">Set</span>}
              </label>
              {posterImage ? (
                <img src={resolveImageUrl(posterImage)} alt="Poster" className="aspect-video w-full object-contain bg-navy/60 rounded border border-border" />
              ) : (
                <div className="aspect-video w-full bg-navy/40 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border">Optional</div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => document.getElementById("poster-input")?.click()}
                  className="w-full text-center py-2 text-[9px] border border-gold text-gold rounded hover:bg-gold hover:text-charcoal font-bold"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => openDrivePicker((url) => setPosterImage(url))}
                  className="px-3 py-2 text-[9px] border border-border text-ivory/80 rounded hover:border-gold"
                >
                  <Cloud size={12} />
                </button>
              </div>
              <input id="poster-input" type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f, (url) => setPosterImage(url), "posters");
              }} />
            </div>
          </div>
        </div>

        {/* 4. MULTI-CATEGORY CINEMATIC GALLERY */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
                4
              </span>
              <h3 className="title-card text-xl text-ivory">Cinematic Image Gallery ({galleryItems.length})</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => document.getElementById("multi-gallery-input")?.click()}
                className="label-track bg-gold px-4 py-2 !text-[9px] !text-charcoal font-bold rounded flex items-center gap-1.5 hover:bg-gold/90"
              >
                <Plus size={12} /> Add Multi Images
              </button>
              <input
                id="multi-gallery-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleMultiGalleryUpload(e.target.files);
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryItems.map((item, idx) => (
              <div key={idx} className="p-3 bg-charcoal border border-border rounded space-y-2">
                <img src={resolveImageUrl(item.url)} alt="Still" className="aspect-video w-full object-cover rounded border border-border" />
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={item.category || "Film Stills"}
                    onChange={(e) => {
                      const updated = [...galleryItems];
                      if (updated[idx]) {
                        updated[idx] = { ...updated[idx], category: e.target.value };
                        setGalleryItems(updated);
                      }
                    }}
                    className="bg-navy border border-border px-2 py-1 text-[10px] text-ivory"
                  >
                    <option value="Film Stills">Film Stills</option>
                    <option value="BTS">BTS</option>
                    <option value="VFX">VFX</option>
                    <option value="Production">Production</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setGalleryItems((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-muted-foreground hover:text-red-400 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. MULTIPLE BEFORE / AFTER PAIRS */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
                5
              </span>
              <h3 className="title-card text-xl text-ivory">Interactive Before / After Sliders ({beforeAfterPairs.length})</h3>
            </div>

            <button
              type="button"
              onClick={() => {
                setBeforeAfterPairs((prev) => [
                  ...prev,
                  {
                    id: `pair-${Date.now()}`,
                    beforeImage: "",
                    afterImage: "",
                    beforeLabel: "BEFORE",
                    afterLabel: "AFTER",
                    title: "Visual Grade Comparison",
                  },
                ]);
              }}
              className="label-track border border-gold px-3.5 py-1.5 !text-[9px] text-gold rounded hover:bg-gold hover:text-charcoal flex items-center gap-1 font-bold"
            >
              <Plus size={12} /> Add Pair
            </button>
          </div>

          <div className="space-y-4">
            {beforeAfterPairs.map((pair, idx) => (
              <div key={pair.id || idx} className="p-4 bg-charcoal border border-border rounded space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold">PAIR #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => setBeforeAfterPairs((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-ivory font-mono mb-1">Before Image URL (RAW / LOG)</label>
                    <input
                      type="text"
                      value={pair.beforeImage}
                      onChange={(e) => {
                        const updated = [...beforeAfterPairs];
                        if (updated[idx]) {
                          updated[idx] = { ...updated[idx], beforeImage: e.target.value };
                          setBeforeAfterPairs(updated);
                        }
                      }}
                      className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory focus:outline-none"
                      placeholder="URL or asset path"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-ivory font-mono mb-1">After Image URL (FINAL / VFX)</label>
                    <input
                      type="text"
                      value={pair.afterImage}
                      onChange={(e) => {
                        const updated = [...beforeAfterPairs];
                        if (updated[idx]) {
                          updated[idx] = { ...updated[idx], afterImage: e.target.value };
                          setBeforeAfterPairs(updated);
                        }
                      }}
                      className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory focus:outline-none"
                      placeholder="URL or asset path"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. PROJECT VIDEO & YOUTUBE */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              6
            </span>
            <h3 className="title-card text-xl text-ivory">Project Video Integration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                YouTube URL or Video ID
              </label>
              <input
                type="text"
                value={formData.videoId}
                onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none font-mono"
                placeholder="e.g. tUnBO1O66Fc or https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">Video Title</label>
              <input
                type="text"
                value={formData.videoTitle}
                onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="Official Film Release"
              />
            </div>
          </div>
        </div>

        {/* 7. STRUCTURED CREDITS & TEAM */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
                7
              </span>
              <h3 className="title-card text-xl text-ivory">Team & End Credits</h3>
            </div>

            <button
              type="button"
              onClick={() => {
                setTeamCredits((prev) => [
                  ...prev,
                  { name: "", role: "Assistant Director", visible: true },
                ]);
              }}
              className="label-track border border-gold px-3.5 py-1.5 !text-[9px] text-gold rounded hover:bg-gold hover:text-charcoal flex items-center gap-1 font-bold"
            >
              <Plus size={12} /> Add Team Member
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamCredits.map((member, idx) => (
              <div key={idx} className="p-3 bg-charcoal border border-border rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gold font-mono">MEMBER #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => setTeamCredits((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => {
                      const upd = [...teamCredits];
                      if (upd[idx]) {
                        upd[idx] = { ...upd[idx], name: e.target.value };
                        setTeamCredits(upd);
                      }
                    }}
                    placeholder="Name"
                    className="bg-navy border border-border p-2 text-xs text-ivory"
                  />
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => {
                      const upd = [...teamCredits];
                      if (upd[idx]) {
                        upd[idx] = { ...upd[idx], role: e.target.value };
                        setTeamCredits(upd);
                      }
                    }}
                    placeholder="Role (e.g. DOP)"
                    className="bg-navy border border-border p-2 text-xs text-ivory"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Full End Credits (Formatted Plaintext)
            </label>
            <textarea
              value={formData.fullCredits}
              onChange={(e) => setFormData({ ...formData, fullCredits: e.target.value })}
              rows={4}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-xs focus:border-gold focus:outline-none font-mono leading-relaxed"
              placeholder="Written / Directed: Rohith V&#10;Cast: Yash Vijay as Deva&#10;DOP: Yashwanth VK"
            />
          </div>
        </div>

        {/* 8. SECTION ON/OFF TOGGLES */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              8
            </span>
            <h3 className="title-card text-xl text-ivory">Section Visibility Controls</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.keys(sectionVisibility).map((key) => {
              const secKey = key as keyof SectionVisibility;
              return (
                <label
                  key={secKey}
                  className="flex items-center gap-2.5 p-3 bg-charcoal border border-border rounded cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={sectionVisibility[secKey]}
                    onChange={(e) =>
                      setSectionVisibility((prev) => ({ ...prev, [secKey]: e.target.checked }))
                    }
                    className="accent-gold h-4 w-4"
                  />
                  <span className="text-xs font-mono uppercase text-ivory">{secKey}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 9. INDEPENDENT SEO CONTROLS */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              9
            </span>
            <h3 className="title-card text-xl text-ivory">Project SEO & OpenGraph</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">SEO Title</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder={`${formData.title || "Project"} — Film Case Study | Rohith V`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">Keywords</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="Filmmaking, Direction, Short Film, VFX"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-ivory/90 mb-2">Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={2}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="Cinematic case study and narrative breakdown..."
              />
            </div>
          </div>
        </div>

        {/* 10. SAVE / DRAFT / PUBLISH ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => submitWithStatus("DRAFT")}
              className="label-track border border-border px-6 py-4 !text-[10px] text-ivory hover:border-gold/60 transition-all rounded min-h-[44px] cursor-pointer"
            >
              SAVE AS DRAFT
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className="label-track border border-gold/60 px-6 py-4 !text-[10px] text-gold hover:bg-gold/10 transition-all rounded min-h-[44px] cursor-pointer"
            >
              PREVIEW PROJECT
            </button>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => submitWithStatus("PUBLISHED")}
            className="label-track bg-gold px-10 py-4 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-all shadow-xl rounded min-h-[44px] cursor-pointer"
          >
            {isLoading ? "SAVING TO CMS..." : "PUBLISH PROJECT →"}
          </button>
        </div>
      </form>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        projectContext={{
          title: formData.title,
          type: formData.type,
          role: formData.role,
          category: formData.category,
          year: formData.year,
          description: formData.description,
          whatIFelt: formData.whatIFelt,
          fullCredits: formData.fullCredits,
          process: processText.split("\n"),
        }}
        onApplyFields={handleApplyAIFunctions}
      />

      {/* Google Drive Import Modal */}
      <GoogleDriveImportModal
        isOpen={isDriveModalOpen}
        onClose={() => {
          setIsDriveModalOpen(false);
          setDriveTargetSetter(null);
        }}
        onSelectImportedImage={(url) => {
          if (driveTargetSetter) {
            driveTargetSetter(url);
          }
        }}
      />
    </div>
  );
}
