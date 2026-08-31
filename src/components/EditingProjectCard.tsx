import { motion } from "motion/react";
import { Play, Sparkles, Film, ExternalLink, Sliders, Scissors, Layers, CheckCircle2, Tv } from "lucide-react";
import type { EditingProject } from "@/data/editing-projects";
import { sound } from "@/lib/sound";

interface EditingProjectCardProps {
  project: EditingProject;
  index: number;
  onWatchVideo: (project: EditingProject, videoIndex?: number) => void;
}

export function EditingProjectCard({ project, index, onWatchVideo }: EditingProjectCardProps) {
  const flip = index % 2 === 1;
  const videoCount = project.videos.length;
  const countLabel = videoCount === 1 ? "1 Film" : `${videoCount} Films`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border border-border/80 bg-navy/20 p-6 md:p-10 transition-all duration-500 hover:border-gold/60 hover:bg-navy/40 hover:shadow-[0_10px_40px_rgba(201,164,76,0.06)] rounded-xs"
    >
      <div className="grid gap-8 md:grid-cols-12 md:items-center">
        {/* Left / Text Meta Section */}
        <div className={`md:col-span-6 ${flip ? "md:order-2" : ""}`}>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="title-card text-3xl md:text-5xl text-slate/80 font-mono transition-colors duration-300 group-hover:text-gold">
              {project.number}
            </span>

            {/* Video Count Badge */}
            <span className="label-track px-3 py-1 bg-gold text-charcoal font-bold !text-[9px] rounded-xs shadow-sm">
              {countLabel}
            </span>

            <span className="label-track px-2.5 py-1 bg-navy/80 border border-gold/40 text-gold !text-[8px] tracking-[0.2em] rounded-xs">
              {project.category}
            </span>
          </div>

          <h2 className="title-card mt-3 text-2xl sm:text-3xl md:text-4xl text-ivory transition-all duration-300 group-hover:text-gold">
            {project.title}
          </h2>

          <div className="gold-rule mt-3 h-[1px] w-12 opacity-40 transition-all duration-500 group-hover:w-24 group-hover:opacity-100" />

          {/* Role */}
          <div className="mt-4 p-3 bg-charcoal/60 border border-border/50 rounded-xs">
            <span className="label-track text-gold !text-[8px] block mb-1">ROLE & SCOPE</span>
            <p className="text-xs text-ivory/90 leading-relaxed font-medium">
              {project.role}
            </p>
          </div>

          {/* Description */}
          <p className="mt-4 text-xs md:text-sm text-ivory/80 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>

          {/* TV Show Coming Soon Indicator */}
          {project.moreEpisodesComing && (
            <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-navy/60 border border-gold/40 text-gold text-xs font-mono rounded-xs">
              <Tv size={14} className="text-gold flex-shrink-0" />
              <span>More episodes coming — 2 additional TV-show projects in pipeline</span>
            </div>
          )}

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="label-track px-2.5 py-1 bg-charcoal border border-border/70 text-muted-foreground !text-[8px] rounded-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Multi-video quick chips (if > 1 video) */}
          {videoCount > 1 && (
            <div className="mt-5 border-t border-border/40 pt-4">
              <span className="label-track text-gold/90 !text-[8px] block mb-2">
                INCLUDED FILMS IN THIS REEL ({videoCount}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.videos.map((vid, vidIdx) => (
                  <button
                    key={vid.id || vidIdx}
                    onClick={() => {
                      sound.playProjectTransition();
                      onWatchVideo(project, vidIdx);
                    }}
                    className="label-track px-2.5 py-1 bg-navy/70 border border-border text-ivory/80 hover:border-gold hover:text-gold !text-[8px] transition-colors rounded-xs cursor-pointer select-none inline-flex items-center gap-1"
                  >
                    <Play size={8} className="text-gold fill-gold" />
                    <span>{vid.thumbnailLabel || `Film ${vidIdx + 1}`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Action Button */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playProjectTransition();
                onWatchVideo(project, 0);
              }}
              data-cursor="play video"
              data-magnetic="true"
              className="label-track inline-flex items-center gap-2.5 bg-gold px-6 py-3.5 !text-[10px] !text-charcoal font-bold transition-all hover:bg-gold/90 hover:shadow-[0_0_20px_rgba(201,164,76,0.3)] cursor-pointer select-none rounded-xs"
            >
              <Play size={14} className="fill-charcoal text-charcoal" />
              <span>{videoCount > 1 ? `WATCH ALL ${videoCount} FILMS` : "WATCH VIDEO"}</span>
            </button>

            {project.toolsUsed && (
              <div className="hidden sm:flex items-center gap-1.5">
                {project.toolsUsed.map((tool) => (
                  <span
                    key={tool}
                    className="label-track px-2 py-1 bg-charcoal/80 border border-border text-muted-foreground !text-[8px]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right / Interactive Video Preview Card */}
        <div
          className={`md:col-span-6 ${flip ? "md:order-1" : ""} cursor-pointer`}
          onClick={() => {
            sound.playProjectTransition();
            onWatchVideo(project, 0);
          }}
        >
          <div className="relative aspect-video w-full overflow-hidden border border-border/70 bg-navy/60 transition-all duration-500 group-hover:border-gold/70 group-hover:shadow-[0_0_30px_rgba(201,164,76,0.15)] group-hover:scale-[1.01] rounded-xs">
            {/* Cinematic Gradient Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-charcoal to-black flex flex-col items-center justify-center p-6 text-center">
              <div className="vignette opacity-75 group-hover:opacity-40 transition-opacity" />
              <div className="scanlines absolute inset-0 opacity-25 pointer-events-none" />

              {/* Glowing Center Play Button */}
              <div className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gold/90 text-charcoal shadow-2xl transition-all duration-300 group-hover:scale-115 group-hover:bg-gold group-hover:shadow-[0_0_35px_rgba(201,164,76,0.5)]">
                <Play size={28} className="fill-charcoal text-charcoal translate-x-0.5" />
              </div>

              <div className="relative z-10 mt-4">
                <span className="label-track !text-[9px] text-ivory/90 font-mono tracking-[0.25em] block">
                  GOOGLE DRIVE STREAM • {countLabel.toUpperCase()}
                </span>
                <span className="title-card text-sm md:text-base text-gold mt-1 block">
                  Click to open video player
                </span>
              </div>
            </div>

            {/* Corner Badges */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <span className="label-track px-2.5 py-1 bg-charcoal/90 border border-gold/40 text-gold !text-[8px] backdrop-blur-sm">
                {countLabel}
              </span>
              <span className="label-track px-2.5 py-1 bg-charcoal/90 border border-border text-ivory/90 !text-[8px] backdrop-blur-sm">
                {project.type}
              </span>
            </div>

            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 text-[9px] font-mono text-gold bg-charcoal/90 px-2.5 py-1 border border-gold/40 backdrop-blur-sm">
              <Scissors size={11} />
              <span>EDIT MASTER</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
