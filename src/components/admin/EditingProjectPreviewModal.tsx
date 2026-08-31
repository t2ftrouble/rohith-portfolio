import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  X,
  Play,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  Film,
  Sparkles,
  Layers,
} from "lucide-react";
import type { EditingProjectFormData } from "@/lib/editing-projects-cms";
import { extractGoogleDriveFileId, getGoogleDrivePreviewUrl, getGoogleDriveViewUrl } from "@/lib/editing-projects-cms";

interface EditingProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: EditingProjectFormData;
}

export function EditingProjectPreviewModal({
  isOpen,
  onClose,
  project,
}: EditingProjectPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"detail" | "card" | "video">("detail");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  if (!isOpen) return null;

  const validVideos = (project.videos || []).filter((v) => v.published !== false);
  const activeVideo = validVideos[activeVideoIndex] || validVideos[0];
  const fileId = activeVideo ? extractGoogleDriveFileId(activeVideo.driveFileId || activeVideo.driveUrl || "") : "";
  const previewUrl = fileId ? getGoogleDrivePreviewUrl(fileId) : "";
  const viewUrl = fileId ? getGoogleDriveViewUrl(fileId) : "";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-charcoal/90 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-navy border border-border/80 rounded-lg shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-navy/80">
            <div className="flex items-center gap-3">
              <span className="label-track !text-[9px] bg-gold/10 text-gold border border-gold/30 px-2.5 py-1 rounded">
                CMS LIVE PREVIEW
              </span>
              <h2 className="title-card text-lg text-ivory truncate max-w-xs sm:max-w-md">
                {project.title || "Untitled Editing Project"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Preview mode switcher */}
              <div className="flex bg-charcoal/80 p-1 border border-border/60 rounded">
                <button
                  type="button"
                  onClick={() => setActiveTab("detail")}
                  className={`label-track px-3 py-1 !text-[8px] rounded transition-all cursor-pointer ${
                    activeTab === "detail" ? "bg-gold text-charcoal font-bold" : "text-ivory/70 hover:text-ivory"
                  }`}
                >
                  Detail Case Study
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("card")}
                  className={`label-track px-3 py-1 !text-[8px] rounded transition-all cursor-pointer ${
                    activeTab === "card" ? "bg-gold text-charcoal font-bold" : "text-ivory/70 hover:text-ivory"
                  }`}
                >
                  Portfolio Card
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("video")}
                  className={`label-track px-3 py-1 !text-[8px] rounded transition-all cursor-pointer ${
                    activeTab === "video" ? "bg-gold text-charcoal font-bold" : "text-ivory/70 hover:text-ivory"
                  }`}
                >
                  Drive Player ({validVideos.length})
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="text-ivory/70 hover:text-gold p-1.5 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-charcoal/40">
            {/* VIEW 1: PORTFOLIO CARD PREVIEW */}
            {activeTab === "card" && (
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="label-track text-gold !text-[9px]">HOW IT APPEARS ON /PORTFOLIO</p>
                <div className="border border-border/70 bg-navy/30 p-6 rounded group">
                  <div className="grid gap-6 md:grid-cols-12 items-center">
                    <div className="md:col-span-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="title-card text-3xl text-gold font-mono">{project.projectNumber || "05"}</span>
                        <span className="label-track border border-border/80 px-2 py-0.5 !text-[8px] text-gold/80 bg-navy/30">
                          EDITING
                        </span>
                      </div>
                      <h3 className="title-card text-2xl text-ivory">{project.title || "Project Title"}</h3>
                      <p className="label-track text-gold !text-[9px]">{project.clientName || "Freelance / Personal Client Work"}</p>
                      <p className="text-xs text-muted-foreground line-clamp-3">{project.description}</p>
                      <div className="pt-2 flex items-center gap-2 text-gold text-xs">
                        <span className="label-track !text-[9px]">View project →</span>
                      </div>
                    </div>

                    <div className="md:col-span-7 relative aspect-video overflow-hidden border border-border/60 bg-navy rounded">
                      <img
                        src={project.thumbnailUrl || project.heroImageUrl || "/assets/about-editroom.webp"}
                        alt={project.title}
                        className="h-full w-full object-cover opacity-85"
                      />
                      {validVideos.length > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-gold/90 text-charcoal flex items-center justify-center shadow-lg">
                            <Play size={20} className="fill-charcoal ml-0.5" />
                          </div>
                        </div>
                      )}
                      <span className="label-track absolute right-3 top-3 border border-border/80 bg-charcoal/85 px-2 py-0.5 !text-[8px] text-ivory/80">
                        {project.year || "2024"}
                      </span>
                      <span className="label-track absolute left-3 top-3 border border-gold/50 bg-charcoal/85 px-2 py-0.5 !text-[8px] text-gold">
                        {validVideos.length} VIDEO{validVideos.length !== 1 ? "S" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2 & 3: FULL DETAIL CASE STUDY & VIDEO STREAM */}
            {(activeTab === "detail" || activeTab === "video") && (
              <div className="space-y-8">
                {/* Hero Header */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden border border-border/80 rounded bg-black">
                  <img
                    src={project.heroImageUrl || project.thumbnailUrl || "/assets/about-editroom.webp"}
                    alt={project.title}
                    className="h-full w-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
                    <span className="title-card text-3xl text-gold font-mono">{project.projectNumber || "05"}</span>
                    <h1 className="title-card text-3xl sm:text-5xl text-ivory">{project.title}</h1>
                    <p className="label-track mt-2 text-gold/90 text-xs">
                      {project.clientName || "Freelance / Personal Client Work"} • {project.year || "2024"} • {validVideos.length} FILMS
                    </p>
                  </div>
                </div>

                {/* Google Drive Video Stream Player */}
                <div className="border border-border/80 bg-navy/30 p-6 rounded space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="label-track text-gold !text-[9px]">STREAM PROJECT REEL</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                      </div>
                      <h3 className="title-card mt-1 text-xl text-ivory">
                        {activeVideo?.title || `${project.title} — Film`}
                      </h3>
                    </div>

                    {validVideos.length > 1 && (
                      <div className="flex items-center gap-2">
                        <span className="label-track text-muted-foreground !text-[8px] font-mono">
                          FILM {String(activeVideoIndex + 1).padStart(2, "0")} / {String(validVideos.length).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveVideoIndex((p) => Math.max(0, p - 1))}
                          disabled={activeVideoIndex === 0}
                          className="label-track px-2.5 py-1 !text-[8px] bg-navy border border-border text-ivory/80 hover:text-gold disabled:opacity-30 rounded"
                        >
                          ← PREV
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveVideoIndex((p) => Math.min(validVideos.length - 1, p + 1))}
                          disabled={activeVideoIndex === validVideos.length - 1}
                          className="label-track px-2.5 py-1 !text-[8px] bg-navy border border-border text-ivory/80 hover:text-gold disabled:opacity-30 rounded"
                        >
                          NEXT →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Multi-video switcher tabs */}
                  {validVideos.length > 1 && (
                    <div className="flex flex-wrap gap-2 p-2 bg-charcoal/50 border border-border/50 rounded">
                      {validVideos.map((v, i) => (
                        <button
                          key={v.id || i}
                          type="button"
                          onClick={() => setActiveVideoIndex(i)}
                          className={`label-track px-3 py-1.5 !text-[8px] rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeVideoIndex === i
                              ? "bg-gold text-charcoal font-bold"
                              : "bg-navy border border-border text-ivory/70 hover:text-ivory"
                          }`}
                        >
                          <Play size={10} className={activeVideoIndex === i ? "fill-charcoal" : "text-gold"} />
                          <span>{v.videoNumber || `Film ${i + 1}`}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 16:9 Embedded Iframe */}
                  {fileId ? (
                    <div className="relative aspect-video w-full overflow-hidden border border-border/80 bg-black rounded shadow-xl">
                      <iframe
                        key={fileId}
                        src={previewUrl}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={activeVideo?.title || "Video Preview"}
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full flex flex-col items-center justify-center border border-dashed border-border/80 bg-navy/20 rounded text-center p-6">
                      <Film size={36} className="text-muted-foreground mb-2" />
                      <p className="text-sm text-ivory font-medium">No Google Drive Video Attached</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add a Google Drive file ID or URL in the editor to enable embedded playback.
                      </p>
                    </div>
                  )}

                  {fileId && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span className="label-track !text-[8px] bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded">
                        GOOGLE DRIVE 1080P STREAM
                      </span>
                      <a
                        href={viewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label-track inline-flex items-center gap-1.5 text-gold text-[9px] hover:underline"
                      >
                        <span>Open in Google Drive</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Case Study Story & Tools Breakdown */}
                {activeTab === "detail" && (
                  <div className="grid gap-6 md:grid-cols-12">
                    <div className="md:col-span-8 border border-border/60 bg-navy/20 p-6 rounded space-y-4">
                      <p className="label-track text-gold !text-[9px]">OVERVIEW & SCOPE</p>
                      <p className="text-base text-ivory/90 leading-relaxed font-light whitespace-pre-line">
                        {project.synopsis || project.description}
                      </p>

                      {project.tools && project.tools.length > 0 && (
                        <div className="pt-4 border-t border-border/40">
                          <p className="label-track text-gold !text-[8px] mb-2">TOOLS USED</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tools.map((t) => (
                              <span key={t} className="label-track !text-[8px] bg-charcoal border border-border px-2.5 py-1 text-ivory/80 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-4 border border-border/60 bg-navy/20 p-6 rounded space-y-4">
                      <p className="label-track text-gold !text-[9px]">MY ROLE & CREDITS</p>
                      <p className="text-sm text-ivory font-medium">{project.role}</p>

                      {project.tags && project.tags.length > 0 && (
                        <div className="pt-3 border-t border-border/40 flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span key={tag} className="label-track !text-[7px] border border-border/60 bg-navy/50 px-2 py-0.5 text-ivory/70 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Editing Breakdown */}
                {activeTab === "detail" && project.editingBreakdown && project.editingBreakdown.length > 0 && (
                  <div className="space-y-4">
                    <p className="label-track text-gold !text-[9px]">POST-PRODUCTION BREAKDOWN</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {project.editingBreakdown.map((item, idx) => (
                        <div key={idx} className="border border-border/60 bg-navy/20 p-5 rounded space-y-2">
                          <div className="flex items-center justify-between border-b border-border/30 pb-2">
                            <h4 className="title-card text-sm text-ivory font-semibold">{item.title}</h4>
                            <span className="label-track !text-[8px] text-gold font-mono">{String(idx + 1).padStart(2, "0")}</span>
                          </div>
                          <p className="text-xs text-ivory/80 leading-relaxed font-light">{item.description}</p>
                          {item.tools && item.tools.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {item.tools.map((t) => (
                                <span key={t} className="label-track !text-[7px] bg-charcoal border border-gold/40 text-gold px-1.5 py-0.5 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/60 bg-navy/80 text-xs">
            <span className="text-muted-foreground font-mono text-[10px]">
              Slug: /portfolio/{project.slug || "your-slug"} • Status: {project.published ? "PUBLISHED" : "DRAFT"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="label-track bg-gold px-4 py-2 !text-[9px] !text-charcoal font-bold rounded hover:bg-gold/90 transition-all cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
