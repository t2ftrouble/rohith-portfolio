import { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Upload,
  Play,
  Film,
  ArrowUp,
  ArrowDown,
  Copy,
  ExternalLink,
  Eye,
  Sparkles,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import type { EditingProjectFormData, EditingProjectVideoFormData } from "@/lib/editing-projects-cms";
import { extractGoogleDriveFileId, getGoogleDrivePreviewUrl } from "@/lib/editing-projects-cms";
import { EditingProjectPreviewModal } from "./EditingProjectPreviewModal";

interface EditingProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: EditingProjectFormData) => Promise<void>;
  initialData?: EditingProjectFormData | null;
  isSaving: boolean;
}

const COMMON_TOOLS = [
  "Adobe Premiere Pro",
  "Adobe After Effects",
  "DaVinci Resolve",
  "Adobe Photoshop",
  "Adobe Audition",
  "Studio Lighting",
];

export function EditingProjectEditorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving,
}: EditingProjectEditorModalProps) {
  const [formData, setFormData] = useState<EditingProjectFormData>(() => {
    if (initialData) return initialData;
    return {
      title: "",
      slug: "",
      projectNumber: "05",
      category: "EDITING",
      clientName: "",
      year: "2024",
      role: "Editor — footage enhancement, clean cuts, pacing, colour correction, subtitles, music and visual finishing.",
      description: "",
      synopsis: "",
      logline: "",
      thumbnailUrl: "",
      heroImageUrl: "",
      tags: ["Editing", "Colour Correction"],
      tools: ["Premiere Pro", "DaVinci Resolve", "After Effects"],
      editingBreakdown: [
        {
          title: "Footage Enhancement & Clean Cuts",
          description: "Removing awkward pauses, noise cleanup, and establishing crisp rhythm.",
          tools: ["Premiere Pro"],
        },
      ],
      credits: "Role: Editor\n\nPost-Production & Visual Finishing: Rohith V",
      status: "Completed",
      featured: false,
      published: true,
      displayOrder: 1,
      notice: "",
      videos: [
        {
          title: "Master Video",
          videoNumber: "Film 01",
          driveUrl: "",
          driveFileId: "",
          description: "",
          duration: "1:00",
          published: true,
          displayOrder: 1,
        },
      ],
    };
  });

  const [activeTab, setActiveTab] = useState<"info" | "videos" | "media" | "tools" | "breakdown" | "seo">("info");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [customTagInput, setCustomTagInput] = useState("");
  const [customToolInput, setCustomToolInput] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  // Auto-generate slug from title if slug was empty or matches old title
  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => {
      const shouldUpdateSlug = !prev.slug || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return {
        ...prev,
        title: newTitle,
        slug: shouldUpdateSlug ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : prev.slug,
      };
    });
  };

  // Upload file helper via /api/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "thumbnailUrl" | "heroImageUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    setUploadError(null);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "covers");

      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: data,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(errJson.error || "Upload failed");
      }

      const json = await res.json();
      if (json.url) {
        setFormData((prev) => ({ ...prev, [fieldName]: json.url }));
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingField(null);
    }
  };

  // Videos management
  const handleAddVideo = () => {
    setFormData((prev) => {
      const nextOrder = prev.videos.length + 1;
      const newVideo: EditingProjectVideoFormData = {
        title: `Video ${String(nextOrder).padStart(2, "0")}`,
        videoNumber: `Film ${String(nextOrder).padStart(2, "0")}`,
        driveUrl: "",
        driveFileId: "",
        description: "",
        duration: "1:00",
        published: true,
        displayOrder: nextOrder,
      };
      return {
        ...prev,
        videos: [...prev.videos, newVideo],
      };
    });
  };

  const handleUpdateVideo = (index: number, updates: Partial<EditingProjectVideoFormData>) => {
    setFormData((prev) => {
      const newVideos = [...prev.videos];
      const current = newVideos[index];
      if (!current) return prev;

      const target: EditingProjectVideoFormData = {
        ...current,
        ...updates,
      };

      // If user pasted a driveUrl, automatically extract the driveFileId
      if (updates.driveUrl !== undefined) {
        const extracted = extractGoogleDriveFileId(updates.driveUrl);
        if (extracted) {
          target.driveFileId = extracted;
        }
      } else if (updates.driveFileId !== undefined) {
        target.driveFileId = extractGoogleDriveFileId(updates.driveFileId);
      }

      newVideos[index] = target;
      return { ...prev, videos: newVideos };
    });
  };

  const handleDeleteVideo = (index: number) => {
    if (formData.videos.length <= 1) {
      alert("A project must contain at least one video.");
      return;
    }
    setFormData((prev) => {
      const newVideos = prev.videos.filter((_, i) => i !== index).map((v, i) => ({
        ...v,
        displayOrder: i + 1,
      }));
      return { ...prev, videos: newVideos };
    });
  };

  const handleMoveVideo = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const newVideos = [...prev.videos];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newVideos.length) return prev;

      const temp = newVideos[index];
      const target = newVideos[targetIndex];
      if (!temp || !target) return prev;

      newVideos[index] = target;
      newVideos[targetIndex] = temp;

      return {
        ...prev,
        videos: newVideos.map((v, i) => ({ ...v, displayOrder: i + 1 })),
      };
    });
  };

  const handleDuplicateVideo = (index: number) => {
    setFormData((prev) => {
      const source = prev.videos[index];
      if (!source) return prev;

      const duplicate: EditingProjectVideoFormData = {
        title: `${source.title} (Copy)`,
        videoNumber: `Film ${String(prev.videos.length + 1).padStart(2, "0")}`,
        driveUrl: source.driveUrl || "",
        driveFileId: source.driveFileId || "",
        description: source.description || "",
        duration: source.duration || "",
        thumbnailUrl: source.thumbnailUrl || "",
        published: source.published !== false,
        displayOrder: prev.videos.length + 1,
      };
      return {
        ...prev,
        videos: [...prev.videos, duplicate],
      };
    });
  };

  // Tags
  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || formData.tags.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    setCustomTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  // Tools
  const handleAddTool = (tool: string) => {
    const trimmed = tool.trim();
    if (!trimmed || formData.tools.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, tools: [...prev.tools, trimmed] }));
    setCustomToolInput("");
  };

  const handleRemoveTool = (tool: string) => {
    setFormData((prev) => ({ ...prev, tools: prev.tools.filter((t) => t !== tool) }));
  };

  // Breakdown
  const handleAddBreakdown = () => {
    setFormData((prev) => ({
      ...prev,
      editingBreakdown: [
        ...prev.editingBreakdown,
        {
          title: "New Editorial Task",
          description: "Description of the editing craft, grading, or audio balance applied.",
          tools: ["Premiere Pro"],
        },
      ],
    }));
  };

  const handleUpdateBreakdown = (index: number, updates: Partial<{ title: string; description: string; tools: string[] }>) => {
    setFormData((prev) => {
      const newItems = [...prev.editingBreakdown];
      const current = newItems[index];
      if (!current) return prev;

      newItems[index] = {
        title: updates.title !== undefined ? updates.title : current.title,
        description: updates.description !== undefined ? updates.description : current.description,
        tools: updates.tools !== undefined ? updates.tools : (current.tools || []),
      };
      return { ...prev, editingBreakdown: newItems };
    });
  };

  const handleDeleteBreakdown = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      editingBreakdown: prev.editingBreakdown.filter((_, i) => i !== index),
    }));
  };

  // Validation and submit
  const handleSubmit = async (publishOverride?: boolean) => {
    const errors: string[] = [];
    if (!formData.title.trim()) errors.push("Project Title is required");
    if (!formData.slug.trim()) errors.push("Project Slug is required");
    if (!formData.role.trim()) errors.push("Role description is required");

    if (formData.videos.length === 0) {
      errors.push("At least one video is required");
    } else {
      formData.videos.forEach((v, idx) => {
        if (!v.driveFileId && !v.driveUrl) {
          errors.push(`Film ${idx + 1} is missing a Google Drive File ID or URL`);
        }
      });
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    const payload = {
      ...formData,
      published: publishOverride !== undefined ? publishOverride : formData.published,
      category: "EDITING" as const,
    };

    await onSave(payload);
  };

  return (
    <>
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-2 sm:p-4 bg-charcoal/90 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-5xl bg-navy border border-border/80 rounded-lg shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-navy/80">
            <div>
              <p className="label-track text-gold !text-[9px]">
                {initialData ? "EDIT EDITING PROJECT" : "NEW EDITING PROJECT"}
              </p>
              <h2 className="title-card mt-1 text-xl text-ivory">
                {formData.title || "Untitled Project"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="label-track flex items-center gap-1.5 px-3 py-1.5 !text-[9px] bg-charcoal border border-gold/60 text-gold hover:bg-gold hover:!text-charcoal rounded transition-all cursor-pointer font-bold shadow-sm"
              >
                <Eye size={13} />
                <span>PREVIEW</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="text-ivory/70 hover:text-gold p-1.5 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap border-b border-border/60 bg-charcoal/40 px-6 pt-2 gap-2">
            {[
              { id: "info", label: "Project Info" },
              { id: "videos", label: `Videos (${formData.videos.length})` },
              { id: "media", label: "Media & Covers" },
              { id: "tools", label: "Tools & Tags" },
              { id: "breakdown", label: "Breakdown Cards" },
              { id: "seo", label: "SEO & Publishing" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`label-track px-4 py-2.5 !text-[9px] border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "border-gold text-gold font-bold bg-navy/40"
                    : "border-transparent text-muted-foreground hover:text-ivory"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {formErrors.length > 0 && (
            <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={14} />
                <span>Please fix the following issues before saving:</span>
              </div>
              <ul className="list-disc list-inside pl-2">
                {formErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Scrollable Form Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: PROJECT INFO */}
            {activeTab === "info" && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-12">
                  <div className="sm:col-span-8">
                    <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                      PROJECT TITLE *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Personal Edits"
                      className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                      PROJECT NUMBER
                    </label>
                    <input
                      type="text"
                      value={formData.projectNumber}
                      onChange={(e) => setFormData((p) => ({ ...p, projectNumber: e.target.value }))}
                      placeholder="05"
                      className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded font-mono"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-12">
                  <div className="sm:col-span-6">
                    <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                      URL SLUG (/portfolio/slug) *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                      placeholder="e.g. personal-edits"
                      className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                      CLIENT / ORGANIZATION
                    </label>
                    <input
                      type="text"
                      value={formData.clientName || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, clientName: e.target.value }))}
                      placeholder="e.g. Skytree Solution"
                      className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                      YEAR
                    </label>
                    <input
                      type="text"
                      value={formData.year || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                      placeholder="2024"
                      className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                    MY ROLE & SCOPE *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                    placeholder="Editor — footage enhancement, clean cuts, pacing, colour correction..."
                    className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded"
                  />
                </div>

                <div>
                  <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                    SHORT LOGLINE / EMOTIONAL DESCRIPTOR
                  </label>
                  <input
                    type="text"
                    value={formData.logline || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, logline: e.target.value }))}
                    placeholder="e.g. Shaping raw client and student footage into pacing-accurate, polished video content."
                    className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded"
                  />
                </div>

                <div>
                  <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                    PROJECT DESCRIPTION / SYNOPSIS *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value, synopsis: e.target.value }))}
                    placeholder="Detailed project context, client requirements, workflow and post-production execution..."
                    className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded resize-y"
                  />
                </div>

                <div>
                  <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                    SERIES NOTICE / FUTURE NOTE (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notice || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, notice: e.target.value }))}
                    placeholder="e.g. Additional episodes will be added directly through the CMS."
                    className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: VIDEOS / FILMS MANAGEMENT */}
            {activeTab === "videos" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                  <div>
                    <h3 className="title-card text-lg text-ivory">Google Drive Videos ({formData.videos.length})</h3>
                    <p className="text-xs text-muted-foreground">
                      Add any number of videos (1, 4, 11, 20+). Paste Google Drive share URLs or File IDs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVideo}
                    className="label-track flex items-center gap-1.5 bg-gold px-4 py-2 !text-[9px] !text-charcoal font-bold rounded hover:bg-gold/90 transition-all cursor-pointer shadow-md self-start sm:self-auto"
                  >
                    <Plus size={13} />
                    <span>ADD VIDEO</span>
                  </button>
                </div>

                {/* Video Items List */}
                <div className="space-y-4">
                  {formData.videos.map((vid, idx) => {
                    const cleanFileId = extractGoogleDriveFileId(vid.driveFileId || vid.driveUrl || "");
                    const streamPreview = cleanFileId ? getGoogleDrivePreviewUrl(cleanFileId) : "";

                    return (
                      <div
                        key={idx}
                        className="border border-border/70 bg-charcoal/40 p-5 rounded-lg space-y-4 transition-colors hover:border-border"
                      >
                        {/* Header bar of video card */}
                        <div className="flex items-center justify-between border-b border-border/40 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="label-track !text-[9px] bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded font-mono">
                              #{idx + 1}
                            </span>
                            <h4 className="title-card text-base text-ivory">
                              {vid.title || `Film ${String(idx + 1).padStart(2, "0")}`}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleMoveVideo(idx, "up")}
                              disabled={idx === 0}
                              title="Move Up"
                              className="p-1.5 bg-navy border border-border text-ivory/70 hover:text-gold disabled:opacity-30 rounded cursor-pointer"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveVideo(idx, "down")}
                              disabled={idx === formData.videos.length - 1}
                              title="Move Down"
                              className="p-1.5 bg-navy border border-border text-ivory/70 hover:text-gold disabled:opacity-30 rounded cursor-pointer"
                            >
                              <ArrowDown size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicateVideo(idx)}
                              title="Duplicate Video"
                              className="p-1.5 bg-navy border border-border text-ivory/70 hover:text-gold rounded cursor-pointer"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVideo(idx)}
                              title="Delete Video"
                              className="p-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Video inputs grid */}
                        <div className="grid gap-4 sm:grid-cols-12">
                          <div className="sm:col-span-6">
                            <label className="label-track block !text-[8px] text-muted-foreground mb-1">
                              VIDEO TITLE *
                            </label>
                            <input
                              type="text"
                              value={vid.title}
                              onChange={(e) => handleUpdateVideo(idx, { title: e.target.value })}
                              placeholder="e.g. Personal Edit — Video 01"
                              className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory rounded focus:border-gold focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="label-track block !text-[8px] text-muted-foreground mb-1">
                              FILM TAB LABEL
                            </label>
                            <input
                              type="text"
                              value={vid.videoNumber}
                              onChange={(e) => handleUpdateVideo(idx, { videoNumber: e.target.value })}
                              placeholder="e.g. Film 01"
                              className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory rounded focus:border-gold focus:outline-none font-mono"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="label-track block !text-[8px] text-muted-foreground mb-1">
                              DURATION
                            </label>
                            <input
                              type="text"
                              value={vid.duration || ""}
                              onChange={(e) => handleUpdateVideo(idx, { duration: e.target.value })}
                              placeholder="e.g. 0:45"
                              className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory rounded focus:border-gold focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        {/* Google Drive URL & File ID */}
                        <div className="grid gap-4 sm:grid-cols-12">
                          <div className="sm:col-span-8">
                            <label className="label-track block !text-[8px] text-muted-foreground mb-1">
                              GOOGLE DRIVE URL OR FILE ID *
                            </label>
                            <input
                              type="text"
                              value={vid.driveUrl || vid.driveFileId}
                              onChange={(e) => handleUpdateVideo(idx, { driveUrl: e.target.value })}
                              placeholder="https://drive.google.com/file/d/14DyIUsAOckUlDhnncV-vvwV1A4lKRG4f/view"
                              className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory rounded focus:border-gold focus:outline-none font-mono"
                            />
                            {cleanFileId && (
                              <p className="text-[10px] text-gold mt-1 font-mono">
                                Clean File ID: {cleanFileId}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-4">
                            <label className="label-track block !text-[8px] text-muted-foreground mb-1">
                              SHORT NOTES / CUT PURPOSE
                            </label>
                            <input
                              type="text"
                              value={vid.description || ""}
                              onChange={(e) => handleUpdateVideo(idx, { description: e.target.value })}
                              placeholder="Social media cut, beat sync..."
                              className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory rounded focus:border-gold focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Embedded Playback Check */}
                        {cleanFileId ? (
                          <div className="pt-2">
                            <details className="text-xs text-muted-foreground">
                              <summary className="label-track !text-[8px] text-gold cursor-pointer select-none hover:underline">
                                ▶ Test In-Page Google Drive Player (Click to expand)
                              </summary>
                              <div className="mt-3 relative aspect-video w-full max-w-md overflow-hidden border border-border rounded bg-black">
                                <iframe
                                  src={streamPreview}
                                  className="h-full w-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  title={vid.title}
                                />
                              </div>
                            </details>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: MEDIA & COVERS */}
            {activeTab === "media" && (
              <div className="space-y-6">
                {uploadError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                    {uploadError}
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Thumbnail / Card Cover */}
                  <div className="border border-border/70 bg-charcoal/30 p-5 rounded space-y-4">
                    <label className="label-track block text-[9px] text-gold">PORTFOLIO CARD THUMBNAIL</label>
                    <p className="text-xs text-muted-foreground">
                      Used on `/portfolio` cards and video preview backdrops.
                    </p>

                    <div className="relative aspect-video w-full overflow-hidden border border-border/80 bg-navy rounded">
                      <img
                        src={formData.thumbnailUrl || "/assets/about-editroom.webp"}
                        alt="Thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="label-track inline-flex items-center gap-2 bg-navy border border-border px-3.5 py-2 !text-[9px] text-ivory hover:border-gold hover:text-gold rounded cursor-pointer transition-all">
                        <Upload size={13} />
                        <span>{uploadingField === "thumbnailUrl" ? "Uploading..." : "Upload New"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "thumbnailUrl")}
                          disabled={uploadingField !== null}
                          className="hidden"
                        />
                      </label>

                      {formData.thumbnailUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, thumbnailUrl: "" }))}
                          className="label-track !text-[9px] text-red-400 hover:text-red-300"
                        >
                          Reset to default
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hero Banner Image */}
                  <div className="border border-border/70 bg-charcoal/30 p-5 rounded space-y-4">
                    <label className="label-track block text-[9px] text-gold">HERO HEADER BANNER</label>
                    <p className="text-xs text-muted-foreground">
                      Large cinematic banner at the top of the `/portfolio/$slug` case study page.
                    </p>

                    <div className="relative aspect-video w-full overflow-hidden border border-border/80 bg-navy rounded">
                      <img
                        src={formData.heroImageUrl || formData.thumbnailUrl || "/assets/about-editroom.webp"}
                        alt="Hero"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="label-track inline-flex items-center gap-2 bg-navy border border-border px-3.5 py-2 !text-[9px] text-ivory hover:border-gold hover:text-gold rounded cursor-pointer transition-all">
                        <Upload size={13} />
                        <span>{uploadingField === "heroImageUrl" ? "Uploading..." : "Upload Hero"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "heroImageUrl")}
                          disabled={uploadingField !== null}
                          className="hidden"
                        />
                      </label>

                      {formData.heroImageUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, heroImageUrl: "" }))}
                          className="label-track !text-[9px] text-red-400 hover:text-red-300"
                        >
                          Reset to default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: TOOLS & TAGS */}
            {activeTab === "tools" && (
              <div className="space-y-6">
                {/* Tools / Software */}
                <div className="border border-border/70 bg-charcoal/30 p-5 rounded space-y-4">
                  <div>
                    <label className="label-track block text-[9px] text-gold">EDITING TOOLS & SOFTWARE</label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rendered as interactive software badges on the project detail case study.
                    </p>
                  </div>

                  {/* Active tools */}
                  <div className="flex flex-wrap gap-2">
                    {formData.tools.map((tool) => (
                      <span
                        key={tool}
                        className="label-track flex items-center gap-1.5 bg-navy border border-gold/40 text-gold px-3 py-1.5 !text-[9px] rounded"
                      >
                        <span>{tool}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(tool)}
                          className="text-gold/60 hover:text-red-400 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Quick-add buttons */}
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-2">Quick Add Suggestions:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_TOOLS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleAddTool(t)}
                          disabled={formData.tools.includes(t)}
                          className="label-track px-2.5 py-1 !text-[8px] bg-navy border border-border text-ivory/70 hover:text-gold disabled:opacity-30 rounded cursor-pointer"
                        >
                          + {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom tool add */}
                  <div className="flex items-center gap-2 max-w-sm pt-2">
                    <input
                      type="text"
                      value={customToolInput}
                      onChange={(e) => setCustomToolInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTool(customToolInput);
                        }
                      }}
                      placeholder="Add custom software..."
                      className="w-full bg-navy border border-border px-3 py-1.5 text-xs text-ivory rounded focus:border-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTool(customToolInput)}
                      className="label-track bg-navy border border-border px-3 py-1.5 !text-[8px] text-gold hover:border-gold rounded cursor-pointer"
                    >
                      ADD
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="border border-border/70 bg-charcoal/30 p-5 rounded space-y-4">
                  <div>
                    <label className="label-track block text-[9px] text-gold">PROJECT TAGS</label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rendered as #tags on portfolio cards and case studies.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="label-track flex items-center gap-1.5 bg-navy border border-border px-3 py-1.5 !text-[9px] text-ivory/80 rounded"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-muted-foreground hover:text-red-400 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag(customTagInput);
                        }
                      }}
                      placeholder="Add tag (e.g. Social Media)..."
                      className="w-full bg-navy border border-border px-3 py-1.5 text-xs text-ivory rounded focus:border-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag(customTagInput)}
                      className="label-track bg-navy border border-border px-3 py-1.5 !text-[8px] text-gold hover:border-gold rounded cursor-pointer"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BREAKDOWN CARDS */}
            {activeTab === "breakdown" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div>
                    <h3 className="title-card text-lg text-ivory">Post-Production Breakdown Cards</h3>
                    <p className="text-xs text-muted-foreground">
                      Craft breakdown section highlighting specific cutting, colour grading, or music synchronization details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddBreakdown}
                    className="label-track flex items-center gap-1.5 bg-gold px-3.5 py-1.5 !text-[9px] !text-charcoal font-bold rounded hover:bg-gold/90 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus size={13} />
                    <span>ADD CARD</span>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {formData.editingBreakdown.map((item, idx) => (
                    <div key={idx} className="border border-border/70 bg-charcoal/40 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="label-track !text-[8px] text-gold font-mono">
                          TASK #{String(idx + 1).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteBreakdown(idx)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div>
                        <label className="label-track block !text-[8px] text-muted-foreground mb-1">
                          CARD TITLE
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateBreakdown(idx, { title: e.target.value })}
                          placeholder="e.g. Colour Correction & Skin Tone Balance"
                          className="w-full bg-navy border border-border px-3 py-1.5 text-xs text-ivory rounded focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="label-track block !text-[8px] text-muted-foreground mb-1">
                          DESCRIPTION
                        </label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => handleUpdateBreakdown(idx, { description: e.target.value })}
                          placeholder="Details of the editing process..."
                          className="w-full bg-navy border border-border px-3 py-1.5 text-xs text-ivory rounded focus:border-gold focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: SEO & PUBLISHING */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                <div className="border border-border/70 bg-charcoal/30 p-5 rounded space-y-4">
                  <h3 className="title-card text-base text-ivory">Publishing Status</h3>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData((p) => ({ ...p, published: e.target.checked }))}
                        className="h-4 w-4 rounded accent-gold"
                      />
                      <div>
                        <span className="text-sm font-medium text-ivory">Publicly Published</span>
                        <p className="text-xs text-muted-foreground">
                          Visible on the public portfolio under the EDITING filter.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
                        className="h-4 w-4 rounded accent-gold"
                      />
                      <div>
                        <span className="text-sm font-medium text-ivory">Featured Project</span>
                        <p className="text-xs text-muted-foreground">Highlight in featured selections.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="border border-border/70 bg-charcoal/30 p-5 rounded space-y-4">
                  <h3 className="title-card text-base text-ivory">SEO & Meta Tags</h3>

                  <div>
                    <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                      CUSTOM SEO TITLE
                    </label>
                    <input
                      type="text"
                      value={formData.seoSettings?.seoTitle || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          seoSettings: { ...p.seoSettings, seoTitle: e.target.value },
                        }))
                      }
                      placeholder={`${formData.title || "Project Title"} | Rohith V — Editing Portfolio`}
                      className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded"
                    />
                  </div>

                  <div>
                    <label className="label-track block text-[10px] text-muted-foreground mb-1.5">
                      META DESCRIPTION
                    </label>
                    <textarea
                      rows={3}
                      value={formData.seoSettings?.metaDescription || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          seoSettings: { ...p.seoSettings, metaDescription: e.target.value },
                        }))
                      }
                      placeholder={formData.description}
                      className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors rounded resize-none"
                    />
                  </div>
                </div>

                <div className="border border-border/70 bg-charcoal/30 p-5 rounded space-y-3">
                  <label className="label-track block text-[10px] text-muted-foreground">
                    END CREDITS
                  </label>
                  <textarea
                    rows={3}
                    value={formData.credits || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, credits: e.target.value }))}
                    placeholder="Role: Editor..."
                    className="w-full bg-charcoal border border-border px-3.5 py-2.5 text-sm text-ivory font-mono focus:border-gold focus:outline-none rounded resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/60 bg-navy/80">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="label-track flex items-center gap-1.5 px-3 py-2 !text-[9px] bg-charcoal border border-border text-ivory hover:border-gold hover:text-gold rounded transition-all cursor-pointer"
              >
                <Eye size={13} />
                <span>PREVIEW PROJECT</span>
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="label-track px-4 py-2.5 !text-[9px] text-muted-foreground hover:text-ivory transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={isSaving}
                className="label-track px-4 py-2.5 !text-[9px] bg-charcoal border border-border text-ivory hover:border-gold hover:text-gold rounded transition-all cursor-pointer disabled:opacity-40"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isSaving}
                className="label-track bg-gold px-6 py-2.5 !text-[10px] !text-charcoal font-bold rounded hover:bg-gold/90 transition-all cursor-pointer disabled:opacity-50 shadow-md flex items-center gap-2"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Save & Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <EditingProjectPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        project={formData}
      />
    </>
  );
}
