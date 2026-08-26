import { useState, useEffect } from "react";
import type { ProjectFormData, ProjectCMSData } from "@/lib/project-cms";
import { assetOptions, getAssetById, getAssetByPathOrFilename } from "@/lib/asset-registry";
import { resolveImageUrl, getImageLabel } from "@/lib/asset-resolver";
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
  });

  const [coverImage, setCoverImage] = useState<string>(project?.image || "");
  const [posterImage, setPosterImage] = useState<string>(project?.posterImage || "");
  const [useBeforeAfter, setUseBeforeAfter] = useState<boolean>(Boolean(project?.showBeforeAfter));
  const [beforeImage, setBeforeImage] = useState<string>(project?.beforeImage || "");
  const [afterImage, setAfterImage] = useState<string>(project?.afterImage || "");
  const [galleryImages, setGalleryImages] = useState<string[]>(project?.galleryImages || []);

  const [processText, setProcessText] = useState<string>(project?.process?.join("\n") || "");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync state if project changes
  useEffect(() => {
    if (project) {
      setFormData({
        slug: project.slug,
        number: project.number,
        title: project.title,
        type: project.type,
        role: project.role,
        year: project.year || "",
        status: project.status || "",
        description: project.description,
        visuals: project.visuals || "",
        category: project.category || "FILMMAKING",
        hasVideo: Boolean(project.hasVideo),
        videoId: project.videoId || "",
        fullCredits: project.fullCredits || "",
        client: project.client || "",
        emotionalDescriptor: project.emotionalDescriptor || "",
        whatIFelt: project.whatIFelt || "",
      });
      setCoverImage(project.image || "");
      setPosterImage(project.posterImage || "");
      setUseBeforeAfter(Boolean(project.showBeforeAfter));
      setBeforeImage(project.beforeImage || "");
      setAfterImage(project.afterImage || "");
      setGalleryImages(project.galleryImages || []);
      setProcessText(project.process?.join("\n") || "");
    }
  }, [project]);

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
    folder: string = "covers"
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
      if (!data.url) {
        throw new Error("No URL returned from upload server");
      }

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

  const cleanVideoId = (input: string): string => {
    if (!input) return "";
    const match = input.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match && match[1] ? match[1] : input.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    const payload: ProjectFormData = {
      slug: formData.slug.trim() || slugify(formData.title),
      number: formData.number.trim() || "01",
      title: formData.title.trim(),
      type: formData.type.trim() || "Short Film",
      role: formData.role.trim() || "Director",
      description: formData.description.trim(),
      process,
      visuals: formData.visuals.trim() || "Film stills",
      image: coverImage.trim(),
      category: formData.category,
      year: formData.year.trim() || null,
      status: formData.status.trim() || null,
      hasVideo: Boolean(videoId),
      videoId: videoId || null,
      fullCredits: formData.fullCredits.trim() || null,
      client: formData.client.trim() || null,
      posterImage: posterImage.trim() || null,
      showBeforeAfter: useBeforeAfter,
      beforeImage: useBeforeAfter ? beforeImage.trim() || null : null,
      afterImage: useBeforeAfter ? afterImage.trim() || null : null,
      galleryImages: galleryImages.filter((img) => Boolean(img && img.trim())),
      emotionalDescriptor: formData.emotionalDescriptor.trim() || null,
      whatIFelt: formData.whatIFelt.trim() || null,
    };

    onSave(payload);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 bg-charcoal">
      {/* Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="label-track text-gold">ADMIN CMS</span>
          <h2 className="title-card mt-2 text-3xl text-ivory">
            {project ? `Edit: ${project.title}` : "Add New Portfolio Project"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Changes are saved directly to your Supabase database and persist across the site.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
              Form Editor
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
              Live Preview
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
        <div className="p-3 bg-gold/10 border border-gold/40 text-gold text-xs rounded">
          {uploadStatus}
        </div>
      )}

      {formError && (
        <div className="p-4 bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded">
          {formError}
        </div>
      )}

      {/* LIVE PREVIEW TAB */}
      {activeTab === "preview" && (
        <div className="space-y-8 rounded border border-gold/40 bg-navy/20 p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <p className="label-track text-gold flex items-center gap-2">
              <Eye size={14} /> LIVE PREVIEW (HOW IT LOOKS ON SITE)
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
            <p className="label-track text-gold mb-4">HOMEPAGE & PORTFOLIO CHAPTER PREVIEW:</p>
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
                {formData.emotionalDescriptor && (
                  <p className="mt-1 text-sm text-gold/80 italic">{formData.emotionalDescriptor}</p>
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
                    No cover image uploaded yet
                  </div>
                )}
                {formData.videoId && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-charcoal">
                      <Play size={20} className="fill-charcoal translate-x-0.5" />
                    </div>
                  </div>
                )}
                {formData.status && (
                  <span className="label-track absolute left-3 top-3 bg-charcoal/80 px-2.5 py-1 !text-[8px] text-gold border border-gold/40">
                    {formData.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details & Images Preview */}
          <div className="space-y-4 border border-border/60 bg-charcoal/80 p-6">
            <p className="label-track text-gold">MEDIA ASSETS PREVIEW:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {coverImage && (
                <div className="border border-border p-2 bg-navy/40">
                  <p className="text-[10px] text-gold font-bold mb-1">COVER</p>
                  <img src={resolveImageUrl(coverImage)} alt="Cover" className="aspect-video w-full object-cover" />
                </div>
              )}
              {posterImage && (
                <div className="border border-border p-2 bg-navy/40">
                  <p className="text-[10px] text-gold font-bold mb-1">POSTER</p>
                  <img src={resolveImageUrl(posterImage)} alt="Poster" className="aspect-[2/3] w-full object-contain" />
                </div>
              )}
              {useBeforeAfter && beforeImage && (
                <div className="border border-border p-2 bg-navy/40">
                  <p className="text-[10px] text-gold font-bold mb-1">BEFORE (RAW)</p>
                  <img src={resolveImageUrl(beforeImage)} alt="Before" className="aspect-video w-full object-cover" />
                </div>
              )}
              {useBeforeAfter && afterImage && (
                <div className="border border-border p-2 bg-navy/40">
                  <p className="text-[10px] text-gold font-bold mb-1">AFTER (VFX)</p>
                  <img src={resolveImageUrl(afterImage)} alt="After" className="aspect-video w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className={`space-y-8 ${activeTab === "preview" ? "hidden" : "block"}`}
      >
        {/* 1. BASIC INFORMATION */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              1
            </span>
            <h3 className="title-card text-xl text-ivory">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                Project Title <span className="text-gold">*</span>
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
              <label className="block text-xs font-semibold text-ivory/90 mb-2">Status Badge</label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="e.g. Released, In Pre-Production, Completed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                Chapter Number (e.g. 01, 02)
              </label>
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
          </div>
        </div>

        {/* 2. STORY & CONTRIBUTION */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              2
            </span>
            <h3 className="title-card text-xl text-ivory">Story & Contribution</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Project Description / Story <span className="text-gold">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none leading-relaxed"
              placeholder="Tell the story of the project, background context, creative approach..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Contribution Steps (Type one per line)
            </label>
            <textarea
              value={processText}
              onChange={(e) => setProcessText(e.target.value)}
              rows={4}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none"
              placeholder="Story and screenplay development&#10;Direction on set&#10;Shot planning and scene composition&#10;Editing and post-production"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                Emotional Tagline (Short phrase beneath title on homepage)
              </label>
              <input
                type="text"
                value={formData.emotionalDescriptor}
                onChange={(e) => setFormData({ ...formData, emotionalDescriptor: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder='e.g. "A story about letting go."'
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                Available Assets Note
              </label>
              <input
                type="text"
                value={formData.visuals}
                onChange={(e) => setFormData({ ...formData, visuals: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="e.g. Film video, poster, stills, VFX breakdown"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              What I Felt (Behind the Frame personal note)
            </label>
            <textarea
              value={formData.whatIFelt}
              onChange={(e) => setFormData({ ...formData, whatIFelt: e.target.value })}
              rows={3}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none"
              placeholder="A brief personal reflection on the creative experience..."
            />
          </div>
        </div>

        {/* 3. COVER & POSTER MEDIA PREVIEWS & MANAGEMENT */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              3
            </span>
            <h3 className="title-card text-xl text-ivory">Cover Image & Poster Management</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* COVER IMAGE */}
            <div className="space-y-3 p-4 bg-charcoal/90 border border-border rounded">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon size={14} /> Cover Image (16:9 Landscape) <span className="text-red-400">*</span>
                </label>
                {coverImage && (
                  <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 border border-green-500/30 rounded">
                    Active
                  </span>
                )}
              </div>

              {coverImage ? (
                <div className="relative aspect-video w-full overflow-hidden border border-gold/40 bg-navy">
                  <img
                    src={resolveImageUrl(coverImage)}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 rounded bg-red-600/90 p-1.5 text-white hover:bg-red-700 transition-colors shadow-lg"
                    title="Remove Cover Image"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-charcoal/90 px-3 py-1.5 border-t border-border/60">
                    <p className="text-[10px] text-ivory/90 truncate font-mono">
                      <span className="text-gold font-semibold">Current:</span> {getImageLabel(coverImage)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 bg-navy/40 p-8 text-center aspect-video">
                  <ImageIcon size={28} className="text-gold/60 mb-2" />
                  <p className="text-xs text-ivory font-medium">No cover image selected</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Upload a file or pick from built-in assets</p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => document.getElementById("cover-upload-input")?.click()}
                  disabled={isUploading}
                  className="label-track w-full border border-gold bg-gold/10 py-2.5 !text-[9px] text-gold hover:bg-gold hover:!text-charcoal transition-all text-center flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload size={13} />
                  {isUploading ? "Uploading..." : "Upload New Cover Image"}
                </button>
                <input
                  id="cover-upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, (url) => setCoverImage(url), "covers");
                  }}
                />

                <select
                  value={getAssetByPathOrFilename(coverImage)?.id || ""}
                  onChange={(e) => {
                    const asset = getAssetById(e.target.value);
                    if (asset) setCoverImage(asset.path);
                  }}
                  className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                >
                  <option value="">Or select built-in asset...</option>
                  {assetOptions
                    .filter((a) => a.category === "project" || a.category === "general")
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.filename})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* POSTER IMAGE */}
            <div className="space-y-3 p-4 bg-charcoal/90 border border-border rounded">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon size={14} /> Poster Image (2:3 Portrait - Optional)
                </label>
                {posterImage ? (
                  <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 border border-green-500/30 rounded">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground">Optional</span>
                )}
              </div>

              {posterImage ? (
                <div className="relative aspect-[2/3] max-h-56 mx-auto overflow-hidden border border-gold/40 bg-navy">
                  <img
                    src={resolveImageUrl(posterImage)}
                    alt="Poster preview"
                    className="h-full w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setPosterImage("")}
                    className="absolute top-2 right-2 rounded bg-red-600/90 p-1.5 text-white hover:bg-red-700 transition-colors shadow-lg"
                    title="Remove Poster"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-charcoal/90 px-3 py-1 border-t border-border/60">
                    <p className="text-[10px] text-ivory/90 truncate font-mono">
                      <span className="text-gold font-semibold">Current:</span> {getImageLabel(posterImage)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 bg-navy/40 p-6 text-center aspect-[2/3] max-h-56 mx-auto">
                  <ImageIcon size={28} className="text-gold/60 mb-2" />
                  <p className="text-xs text-ivory font-medium">No poster artwork</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Upload portrait poster</p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => document.getElementById("poster-upload-input")?.click()}
                  disabled={isUploading}
                  className="label-track w-full border border-gold bg-gold/10 py-2.5 !text-[9px] text-gold hover:bg-gold hover:!text-charcoal transition-all text-center flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload size={13} />
                  {isUploading ? "Uploading..." : "Upload Poster Image"}
                </button>
                <input
                  id="poster-upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, (url) => setPosterImage(url), "posters");
                  }}
                />

                <select
                  value={getAssetByPathOrFilename(posterImage)?.id || ""}
                  onChange={(e) => {
                    const asset = getAssetById(e.target.value);
                    if (asset) setPosterImage(asset.path);
                  }}
                  className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                >
                  <option value="">Or select built-in poster...</option>
                  {assetOptions.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.filename})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 4. VIDEO & VFX BEFORE / AFTER COMPARISON SLIDER */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              4
            </span>
            <h3 className="title-card text-xl text-ivory">Video & VFX Comparison Slider</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              YouTube Video URL or Video ID (Optional)
            </label>
            <input
              type="text"
              value={formData.videoId}
              onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none font-mono"
              placeholder="e.g. https://www.youtube.com/watch?v=tUnBO1O66Fc or tUnBO1O66Fc"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Paste the full YouTube URL or the 11-character video ID.
            </p>
          </div>

          {/* Before/After Toggle */}
          <div className="pt-4 border-t border-border/60">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useBeforeAfter}
                onChange={(e) => setUseBeforeAfter(e.target.checked)}
                className="h-5 w-5 accent-gold"
              />
              <div>
                <span className="text-sm font-semibold text-ivory flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-gold" />
                  Enable Interactive Before / After VFX Comparison Slider
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Displays an interactive slider comparing the RAW footage against the Final CG/Color grade.
                </p>
              </div>
            </label>

            {useBeforeAfter && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/40 pt-6">
                {/* BEFORE IMAGE */}
                <div className="space-y-3 p-4 bg-charcoal/90 border border-border rounded">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gold uppercase tracking-wider">
                      RAW / Before Image
                    </label>
                    {beforeImage && (
                      <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 border border-green-500/30 rounded">
                        Active
                      </span>
                    )}
                  </div>

                  {beforeImage ? (
                    <div className="relative aspect-video w-full overflow-hidden border border-gold/40 bg-navy">
                      <img
                        src={resolveImageUrl(beforeImage)}
                        alt="Before comparison"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setBeforeImage("")}
                        className="absolute top-2 right-2 rounded bg-red-600/90 p-1.5 text-white hover:bg-red-700 transition-colors shadow-lg"
                        title="Remove Before Image"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-charcoal/90 px-3 py-1 border-t border-border/60">
                        <p className="text-[10px] text-ivory/90 truncate font-mono">
                          <span className="text-gold font-semibold">Current:</span> {getImageLabel(beforeImage)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 bg-navy/40 p-6 text-center aspect-video">
                      <ImageIcon size={24} className="text-gold/60 mb-2" />
                      <p className="text-xs text-ivory font-medium">No Before image set</p>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById("before-upload-input")?.click()}
                      disabled={isUploading}
                      className="label-track w-full border border-gold bg-gold/10 py-2.5 !text-[9px] text-gold hover:bg-gold hover:!text-charcoal transition-all text-center flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Upload size={13} />
                      {isUploading ? "Uploading..." : "Upload Before Image"}
                    </button>
                    <input
                      id="before-upload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => setBeforeImage(url), "vfx");
                      }}
                    />

                    <select
                      value={getAssetByPathOrFilename(beforeImage)?.id || ""}
                      onChange={(e) => {
                        const asset = getAssetById(e.target.value);
                        if (asset) setBeforeImage(asset.path);
                      }}
                      className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                    >
                      <option value="">Or select built-in VFX asset...</option>
                      {assetOptions.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.filename})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* AFTER IMAGE */}
                <div className="space-y-3 p-4 bg-charcoal/90 border border-border rounded">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gold uppercase tracking-wider">
                      FINAL / After Image
                    </label>
                    {afterImage && (
                      <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 border border-green-500/30 rounded">
                        Active
                      </span>
                    )}
                  </div>

                  {afterImage ? (
                    <div className="relative aspect-video w-full overflow-hidden border border-gold/40 bg-navy">
                      <img
                        src={resolveImageUrl(afterImage)}
                        alt="After comparison"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setAfterImage("")}
                        className="absolute top-2 right-2 rounded bg-red-600/90 p-1.5 text-white hover:bg-red-700 transition-colors shadow-lg"
                        title="Remove After Image"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-charcoal/90 px-3 py-1 border-t border-border/60">
                        <p className="text-[10px] text-ivory/90 truncate font-mono">
                          <span className="text-gold font-semibold">Current:</span> {getImageLabel(afterImage)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 bg-navy/40 p-6 text-center aspect-video">
                      <ImageIcon size={24} className="text-gold/60 mb-2" />
                      <p className="text-xs text-ivory font-medium">No After image set</p>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById("after-upload-input")?.click()}
                      disabled={isUploading}
                      className="label-track w-full border border-gold bg-gold/10 py-2.5 !text-[9px] text-gold hover:bg-gold hover:!text-charcoal transition-all text-center flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Upload size={13} />
                      {isUploading ? "Uploading..." : "Upload After Image"}
                    </button>
                    <input
                      id="after-upload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => setAfterImage(url), "vfx");
                      }}
                    />

                    <select
                      value={getAssetByPathOrFilename(afterImage)?.id || ""}
                      onChange={(e) => {
                        const asset = getAssetById(e.target.value);
                        if (asset) setAfterImage(asset.path);
                      }}
                      className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                    >
                      <option value="">Or select built-in VFX asset...</option>
                      {assetOptions.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.filename})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. GALLERY IMAGES PREVIEWS & MANAGEMENT */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
                5
              </span>
              <h3 className="title-card text-xl text-ivory">Gallery Images ({galleryImages.length})</h3>
            </div>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((imgUrl, idx) => (
                <div key={idx} className="relative border border-border bg-charcoal p-2 rounded group">
                  <div className="relative aspect-video w-full overflow-hidden bg-navy">
                    <img
                      src={resolveImageUrl(imgUrl)}
                      alt={`Gallery item ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 rounded bg-red-600/90 p-1 text-white hover:bg-red-700 transition-colors shadow"
                      title="Remove gallery image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="mt-1.5 text-[10px] text-ivory/80 truncate font-mono">
                    #{idx + 1}: {getImageLabel(imgUrl)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No gallery images added yet.</p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => document.getElementById("gallery-upload-input")?.click()}
              disabled={isUploading}
              className="label-track border border-gold/80 bg-gold/10 px-4 py-2.5 !text-[9px] text-gold hover:bg-gold hover:!text-charcoal transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Upload size={12} />
              Add Image from Device
            </button>
            <input
              id="gallery-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(
                    file,
                    (url) => setGalleryImages((prev) => [...prev, url]),
                    "gallery"
                  );
                }
              }}
            />

            <select
              onChange={(e) => {
                const asset = getAssetById(e.target.value);
                if (asset) {
                  setGalleryImages((prev) => [...prev, asset.path]);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="bg-navy border border-border px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            >
              <option value="" disabled>
                + Add Built-in Asset to Gallery...
              </option>
              {assetOptions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.filename})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 6. CREDITS */}
        <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              6
            </span>
            <h3 className="title-card text-xl text-ivory">End Credits</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Full Credits (Director, Cast, DOP, Music, Crew, etc.)
            </label>
            <textarea
              value={formData.fullCredits}
              onChange={(e) => setFormData({ ...formData, fullCredits: e.target.value })}
              rows={6}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none font-mono"
              placeholder="Written & Directed by: Rohith V&#10;Cast: Yash Vijay as Deva&#10;DOP: Yashwanth VK&#10;Music: Danny&#10;Shot on: iPhone"
            />
          </div>
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="label-track bg-gold px-8 py-5 !text-[11px] !text-charcoal font-bold hover:bg-gold/90 transition-all shadow-xl min-h-[48px] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 size={16} />
            {isLoading ? "Saving to Supabase..." : project ? "SAVE & UPDATE PROJECT" : "PUBLISH NEW PROJECT"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            disabled={isLoading}
            className="label-track border border-gold/60 px-6 py-5 !text-[10px] !text-gold hover:bg-gold/10 transition-colors min-h-[48px] disabled:opacity-50 cursor-pointer"
          >
            Preview First
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="label-track border border-border px-6 py-5 !text-[10px] text-ivory/70 hover:text-ivory transition-colors min-h-[48px] disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
