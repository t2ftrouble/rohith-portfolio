import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  X,
  ExternalLink,
  Play,
  Film,
  AlertCircle,
  Tv,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  getDriveEmbedUrl,
  getDriveDirectUrl,
  extractDriveFileId,
  type EditingProject,
  type EditingVideoItem,
} from "@/data/editing-projects";
import { sound } from "@/lib/sound";

interface EditingVideoModalProps {
  project: EditingProject | null;
  isOpen: boolean;
  onClose: () => void;
  initialVideoIndex?: number;
}

export function EditingVideoModal({
  project,
  isOpen,
  onClose,
  initialVideoIndex = 0,
}: EditingVideoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(initialVideoIndex);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hasIframeError, setHasIframeError] = useState(false);

  useEffect(() => {
    setActiveVideoIndex(initialVideoIndex);
    setIframeLoaded(false);
    setHasIframeError(false);
  }, [project, initialVideoIndex, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        sound.playSoftClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!project) return null;

  const currentVideo: EditingVideoItem | undefined =
    project.videos[activeVideoIndex] || project.videos[0];

  const totalVideos = project.videos.length;
  const embedUrl = currentVideo ? getDriveEmbedUrl(currentVideo.driveUrlOrId) : "";
  const directDriveUrl = currentVideo ? getDriveDirectUrl(currentVideo.driveUrlOrId) : "";
  const currentFileId = currentVideo ? extractDriveFileId(currentVideo.driveUrlOrId) : "";

  const handleSelectVideo = (index: number) => {
    if (index === activeVideoIndex || index < 0 || index >= totalVideos) return;
    sound.playSoftClick();
    setIframeLoaded(false);
    setHasIframeError(false);
    setActiveVideoIndex(index);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-charcoal/95 p-3 sm:p-4 md:p-8 backdrop-blur-md overflow-y-auto"
          onClick={() => {
            sound.playSoftClick();
            onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl my-auto border border-border/80 bg-navy/98 shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl rounded-xs overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-charcoal/90 px-4 py-3 sm:px-6 md:px-8">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-gold text-[10px] font-mono font-bold">
                  {project.number}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 id="modal-project-title" className="title-card text-base sm:text-lg text-ivory">
                      {project.title}
                    </h3>
                    <span className="label-track px-2 py-0.5 bg-navy border border-border text-gold !text-[8px]">
                      {totalVideos === 1 ? "1 Film" : `${totalVideos} Films`}
                    </span>
                  </div>
                  <p className="label-track !text-[9px] text-muted-foreground mt-0.5">
                    {project.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {directDriveUrl && (
                  <a
                    href={directDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-track hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-border text-ivory/70 hover:text-gold hover:border-gold/60 text-[9px] transition-colors rounded-xs"
                    title="Open current video in Google Drive"
                  >
                    <span>Open in Drive</span>
                    <ExternalLink size={12} />
                  </a>
                )}

                <button
                  ref={closeButtonRef}
                  onClick={() => {
                    sound.playSoftClick();
                    onClose();
                  }}
                  aria-label="Close video player"
                  className="flex items-center gap-1.5 text-ivory/80 transition-colors hover:text-gold focus:outline-none focus:ring-1 focus:ring-gold p-1.5 -mr-1.5 cursor-pointer"
                >
                  <span className="label-track hidden md:inline !text-[9px]">CLOSE</span>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Active Video Status & Title Sub-Bar */}
            {totalVideos > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-charcoal/60 border-b border-border/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                  <span className="label-track text-gold !text-[9px] font-semibold">
                    NOW PLAYING: {currentVideo?.title || `Film ${activeVideoIndex + 1}`}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {activeVideoIndex + 1} / {totalVideos}
                </span>
              </div>
            )}

            {/* Cinematic 16:9 Video Player Viewport */}
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              {embedUrl && !hasIframeError ? (
                <>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/60 gap-3 text-gold z-10">
                      <div className="h-8 w-8 border-2 border-gold/20 border-t-gold animate-spin rounded-full" />
                      <span className="label-track !text-[9px] tracking-[0.2em]">
                        LOADING GOOGLE DRIVE PLAYER...
                      </span>
                    </div>
                  )}
                  <iframe
                    key={`${project.id}-${activeVideoIndex}-${currentFileId}`}
                    src={embedUrl}
                    title={`${project.title} - ${currentVideo?.title || "Video Preview"}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => setHasIframeError(true)}
                    className="h-full w-full border-0"
                  />
                </>
              ) : (
                /* Fallback if Drive Embed Cannot Load */
                <div className="h-full w-full flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-charcoal/90">
                  <div className="h-16 w-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4">
                    <Film size={28} />
                  </div>
                  <h4 className="title-card text-lg sm:text-xl text-ivory">Google Drive Video Stream</h4>
                  <p className="mt-2 text-xs md:text-sm text-muted-foreground max-w-md">
                    Watch this video directly on Google Drive preview. Ensure link access is set to <span className="text-gold">"Anyone with the link → Viewer"</span>.
                  </p>
                  {directDriveUrl && (
                    <a
                      href={directDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-track mt-4 inline-flex items-center gap-2 bg-gold px-6 py-3 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-all rounded-xs"
                    >
                      <ExternalLink size={13} />
                      <span>OPEN IN GOOGLE DRIVE</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Multi-Video Film-Strip / Video Selector */}
            {totalVideos > 1 && (
              <div className="bg-charcoal/95 border-t border-border/70 p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="label-track text-gold !text-[8px] flex items-center gap-1.5">
                    <Layers size={11} />
                    <span>SELECT FILM TO PLAY ({totalVideos} AVAILABLE)</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSelectVideo(activeVideoIndex - 1)}
                      disabled={activeVideoIndex === 0}
                      className="p-1 text-muted-foreground hover:text-gold disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors cursor-pointer"
                      title="Previous video"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => handleSelectVideo(activeVideoIndex + 1)}
                      disabled={activeVideoIndex === totalVideos - 1}
                      className="p-1 text-muted-foreground hover:text-gold disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors cursor-pointer"
                      title="Next video"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scrollable Video Tabs */}
                <div
                  ref={filmstripRef}
                  className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-border"
                >
                  {project.videos.map((vid, idx) => {
                    const isActive = idx === activeVideoIndex;
                    return (
                      <button
                        key={vid.id || idx}
                        onClick={() => handleSelectVideo(idx)}
                        className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 border rounded-xs transition-all duration-200 cursor-pointer select-none text-left ${
                          isActive
                            ? "bg-gold text-charcoal border-gold font-bold shadow-[0_0_15px_rgba(201,164,76,0.3)]"
                            : "bg-navy/60 border-border/60 text-ivory/80 hover:border-gold/50 hover:text-ivory"
                        }`}
                      >
                        <Play
                          size={10}
                          className={isActive ? "fill-charcoal text-charcoal" : "text-gold fill-gold/40"}
                        />
                        <span className="text-[10px] font-mono whitespace-nowrap">
                          {vid.thumbnailLabel || `Film ${String(idx + 1).padStart(2, "0")}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Info Footer */}
            <div className="bg-charcoal p-4 sm:p-6 border-t border-border/60 grid gap-4 md:grid-cols-12 items-start">
              <div className="md:col-span-7 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="label-track px-2.5 py-1 bg-navy border border-border text-gold !text-[8px]">
                    {project.category}
                  </span>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="label-track px-2 py-0.5 bg-charcoal/80 border border-border/60 text-muted-foreground !text-[8px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div>
                  <span className="label-track text-gold !text-[8px] block mb-1">ROLE</span>
                  <p className="text-xs text-ivory/90 font-medium leading-relaxed">
                    {project.role}
                  </p>
                </div>

                <div>
                  <span className="label-track text-gold !text-[8px] block mb-1">PROJECT OVERVIEW</span>
                  <p className="text-xs md:text-sm text-ivory/80 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>

                {project.moreEpisodesComing && (
                  <div className="flex items-center gap-2 p-2.5 bg-navy/60 border border-gold/30 rounded-xs text-[11px] text-gold/90 font-mono">
                    <Tv size={14} className="text-gold flex-shrink-0" />
                    <span>More episodes coming soon — 2 additional television installments in post-production.</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-border/60 pt-4 md:pt-0 md:pl-6 space-y-4">
                {project.detailedPoints && project.detailedPoints.length > 0 && (
                  <div>
                    <span className="label-track text-gold !text-[8px] block mb-1.5">
                      KEY CONTRIBUTIONS
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                      {project.detailedPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-gold font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.toolsUsed && project.toolsUsed.length > 0 && (
                  <div>
                    <span className="label-track text-gold !text-[8px] block mb-1.5">TOOLS USED</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.toolsUsed.map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-0.5 text-[10px] font-mono bg-navy/80 border border-border/70 text-ivory/90 rounded-xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
