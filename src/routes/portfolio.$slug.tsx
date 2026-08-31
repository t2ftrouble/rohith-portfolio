import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Share2,
  Check,
  ExternalLink,
  Play,
  Film,
  Scissors,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getProject, getProjects } from "@/data/projects";
import { Reveal } from "@/components/Reveal";
import { FocusReveal } from "@/components/FocusReveal";
import { VideoModal } from "@/components/VideoModal";
import { ProjectImageLightbox } from "@/components/ProjectImageLightbox";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ProjectComments } from "@/components/ProjectComments";
import { sound } from "@/lib/sound";

import oneLastDayBefore from "@/assets/one-last-day-before-cg.webp";
import oneLastDayAfter from "@/assets/one-last-day-after-cg.webp";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    const project = await getProject(params.slug);
    if (!project) throw notFound();
    const allProjects = await getProjects();
    return { project, allProjects };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — Rohith V" }, { name: "robots", content: "noindex" }],
      };
    }
    const { project } = loaderData;
    const seo = project.seoSettings || {};
    const title = seo.seoTitle || `${project.title} | Rohith V — ${project.category === "EDITING" ? "Editing Portfolio" : "Filmmaker"}`;
    const description =
      seo.metaDescription || `${project.description} ${project.year ? `(${project.year})` : ""}`;
    const ogTitle = seo.ogTitle || title;
    const ogDescription = seo.ogDescription || description;
    const ogImage = seo.ogImage || project.heroImage || project.image;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: seo.keywords || `${project.title}, Rohith V, Video Editor, Filmmaker, Chennai` },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDescription },
        { property: "og:image", content: ogImage },
        { property: "og:type", content: "video.movie" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: ogTitle },
        { name: "twitter:description", content: ogDescription },
        { name: "twitter:image", content: ogImage },
      ],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project, allProjects } = Route.useLoaderData();
  const index = allProjects.findIndex((p) => p.slug === project.slug);
  const prev = allProjects[(index - 1 + allProjects.length) % allProjects.length]!;
  const next = allProjects[(index + 1) % allProjects.length]!;

  const [videoOpen, setVideoOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>("All");
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Google Drive video selection state for multi-video projects
  const [activeDriveVideoIndex, setActiveDriveVideoIndex] = useState(0);

  if (!project) {
    return <div>Loading...</div>;
  }

  const visibility = project.sectionVisibility || {
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

  // Compile gallery images
  const allGalleryItems =
    project.galleryItems && project.galleryItems.length > 0
      ? project.galleryItems
      : (project.galleryImages || (project.image ? [project.image] : [])).map((img, i) => ({
          url: img,
          category: "Film Stills",
          caption: `${project.title} still ${i + 1}`,
        }));

  const galleryCategories = [
    "All",
    ...Array.from(new Set(allGalleryItems.map((g) => g.category || "Film Stills"))),
  ];

  const filteredGallery =
    selectedGalleryCategory === "All"
      ? allGalleryItems
      : allGalleryItems.filter((g) => (g.category || "Film Stills") === selectedGalleryCategory);

  const handleImageClick = (idx: number) => {
    sound.playSoftClick();
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const handleShare = async () => {
    sound.playSoftClick();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${project.title} — Rohith V`,
          text: project.logline || project.description,
          url: window.location.href,
        });
        return;
      } catch {}
    }

    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const driveVideos = project.driveVideos || [];
  const activeDriveVideo = driveVideos[activeDriveVideoIndex] || driveVideos[0];

  const handlePrevVideo = () => {
    if (activeDriveVideoIndex > 0) {
      sound.playSoftClick();
      setActiveDriveVideoIndex((prevIdx) => prevIdx - 1);
    }
  };

  const handleNextVideo = () => {
    if (activeDriveVideoIndex < driveVideos.length - 1) {
      sound.playSoftClick();
      setActiveDriveVideoIndex((prevIdx) => prevIdx + 1);
    }
  };

  return (
    <article className="overflow-x-hidden">
      {/* 1. CINEMATIC PROJECT HERO */}
      {visibility.hero !== false && (
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[72svh] min-h-[540px] w-full overflow-hidden"
        >
          <motion.img
            src={project.heroImage || project.image}
            alt={project.imageAlt || `${project.title} — ${project.type}`}
            width={1920}
            height={1080}
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.02, opacity: 0.88 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/60" />
          <div className="vignette pointer-events-none" />
          <div className="scanlines absolute inset-0 opacity-15 pointer-events-none" />

          <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-14 md:px-12 md:pb-20">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="title-card text-4xl text-gold md:text-6xl font-mono"
            >
              {project.number}
            </motion.p>

            <FocusReveal delay={0.55}>
              <h1 className="title-card mt-3 text-[clamp(2.5rem,10vw,7.5rem)] leading-[0.88] text-ivory drop-shadow-sm">
                {project.title}
              </h1>
            </FocusReveal>

            {project.logline && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8 }}
                className="mt-3 text-sm md:text-lg text-gold/90 italic font-serif max-w-2xl"
              >
                "{project.logline}"
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs"
            >
              <span className="label-track text-gold">{project.type}</span>
              <span className="label-track border border-gold/40 text-gold px-2.5 py-0.5 bg-navy/60">
                {project.category}
              </span>
              {project.year && <span className="label-track">{project.year}</span>}
              {project.duration && (
                <span className="label-track border border-border/80 px-2 py-0.5 text-ivory/80">
                  {project.duration}
                </span>
              )}
              {project.formatSpecs && (
                <span className="label-track text-muted-foreground hidden sm:inline">
                  {project.formatSpecs}
                </span>
              )}
              {project.status && (
                <span className="label-track bg-gold/10 text-gold border border-gold/30 px-2 py-0.5">
                  {project.status}
                </span>
              )}
            </motion.div>
          </div>
        </motion.header>
      )}

      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28 space-y-24">
        {/* 2. MY ROLE & METADATA BAR */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 border-b border-border/60 pb-8">
            <div className="max-w-3xl">
              <p className="label-track text-gold">MY ROLE & SCOPE</p>
              <p className="title-card mt-3 text-xl text-ivory md:text-2xl leading-relaxed">
                {project.role}
              </p>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="label-track !text-[8px] border border-border/60 bg-navy/40 px-2.5 py-1 text-ivory/70 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* 3. PROJECT STORY & CONTRIBUTION */}
        {visibility.story !== false && (
          <div className="grid gap-14 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <p className="label-track text-gold">PROJECT OVERVIEW & CONTEXT</p>
              <p className="mt-6 text-lg leading-relaxed text-ivory/85 md:text-2xl font-light whitespace-pre-line">
                {project.synopsis || project.description}
              </p>

              {project.toolsUsed && project.toolsUsed.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <p className="label-track text-gold !text-[9px] mb-3">TOOLS & WORKFLOW</p>
                  <div className="flex flex-wrap gap-2">
                    {project.toolsUsed.map((tool) => (
                      <span
                        key={tool}
                        className="label-track !text-[9px] bg-charcoal border border-border px-3 py-1 text-ivory/80 rounded"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>

            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
              <p className="label-track text-gold">MY CONTRIBUTION</p>
              <ul className="mt-6 space-y-4">
                {project.process.map((step, i) => (
                  <li key={step} className="flex gap-4 text-sm text-ivory/80">
                    <span className="label-track !tracking-[0.2em] text-slate">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              {project.visuals && (
                <>
                  <p className="label-track mt-10 text-gold">DELIVERABLES & ASSETS</p>
                  <p className="mt-3 text-sm text-muted-foreground">{project.visuals}</p>
                </>
              )}
            </Reveal>
          </div>
        )}

        {/* 4. GOOGLE DRIVE VIDEO SHOWCASE (Embedded in-page playback) */}
        {driveVideos.length > 0 && activeDriveVideo && (
          <Reveal>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="label-track text-gold">STREAM PROJECT REEL</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                  </div>
                  <h3 className="title-card mt-1 text-2xl text-ivory">
                    {driveVideos.length > 1
                      ? `${activeDriveVideo.title || `Film ${String(activeDriveVideoIndex + 1).padStart(2, "0")}`}`
                      : `${project.title} — Master Video`}
                  </h3>
                </div>

                {/* Multi-video prev/next controls */}
                {driveVideos.length > 1 && (
                  <div className="flex items-center gap-3">
                    <span className="label-track text-muted-foreground !text-[8px] font-mono">
                      FILM {String(activeDriveVideoIndex + 1).padStart(2, "0")} OF {String(driveVideos.length).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrevVideo}
                        disabled={activeDriveVideoIndex === 0}
                        aria-label="Previous Video"
                        className="label-track px-3 py-1.5 !text-[8px] bg-navy border border-border/80 text-ivory/80 hover:text-gold hover:border-gold disabled:opacity-30 disabled:pointer-events-none rounded transition-all cursor-pointer flex items-center gap-1"
                      >
                        <ChevronLeft size={12} />
                        <span>PREV</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextVideo}
                        disabled={activeDriveVideoIndex === driveVideos.length - 1}
                        aria-label="Next Video"
                        className="label-track px-3 py-1.5 !text-[8px] bg-navy border border-border/80 text-ivory/80 hover:text-gold hover:border-gold disabled:opacity-30 disabled:pointer-events-none rounded transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>NEXT</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-video filmstrip selector */}
              {driveVideos.length > 1 && (
                <div className="flex flex-wrap gap-2 p-2 bg-navy/30 border border-border/60 rounded">
                  {driveVideos.map((vid, idx) => (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => {
                        sound.playSoftClick();
                        setActiveDriveVideoIndex(idx);
                      }}
                      className={`label-track px-3.5 py-2 !text-[9px] rounded transition-all cursor-pointer select-none inline-flex items-center gap-1.5 ${
                        activeDriveVideoIndex === idx
                          ? "bg-gold text-charcoal font-bold shadow-md"
                          : "bg-charcoal/70 border border-border/70 text-ivory/70 hover:text-ivory hover:border-gold/50"
                      }`}
                    >
                      <Play
                        size={10}
                        className={
                          activeDriveVideoIndex === idx
                            ? "fill-charcoal text-charcoal"
                            : "text-gold fill-gold"
                        }
                      />
                      <span>{vid.thumbnailLabel || `Film ${String(idx + 1).padStart(2, "0")}`}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Embedded 16:9 Google Drive Stream Player */}
              <div className="relative aspect-video w-full overflow-hidden border border-border/80 bg-black rounded shadow-2xl">
                <iframe
                  key={activeDriveVideo.driveFileId}
                  src={`https://drive.google.com/file/d/${activeDriveVideo.driveFileId}/preview`}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  title={`${project.title} - ${activeDriveVideo.title}`}
                />
              </div>

              {/* Player footer details & Fallback */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <span className="label-track !text-[8px] bg-gold/10 text-gold px-2 py-0.5 border border-gold/30 rounded">
                    GOOGLE DRIVE EMBED
                  </span>
                  <span className="font-mono text-[10px]">Direct Stream • No Sign-In Required</span>
                </div>

                <a
                  href={`https://drive.google.com/file/d/${activeDriveVideo.driveFileId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playSoftClick()}
                  className="label-track inline-flex items-center gap-1.5 text-gold hover:text-gold/80 transition-colors text-[9px]"
                >
                  <span>Open in Google Drive</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </Reveal>
        )}

        {/* 5. EDITING BREAKDOWN SECTION (For Editing Projects) */}
        {project.editingBreakdown && project.editingBreakdown.length > 0 && (
          <Reveal>
            <div className="space-y-8">
              <div>
                <p className="label-track text-gold">POST-PRODUCTION BREAKDOWN</p>
                <h3 className="title-card mt-1 text-2xl text-ivory">Editorial Craft & Finishing</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {project.editingBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-border/80 bg-navy/20 p-6 md:p-8 rounded transition-all duration-300 hover:border-gold/50 hover:bg-navy/30"
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                      <h4 className="title-card text-lg text-ivory font-medium">{item.title}</h4>
                      <span className="label-track !text-[9px] text-gold font-mono">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-sm text-ivory/80 leading-relaxed font-light">{item.description}</p>
                    {item.tools && item.tools.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-border/30">
                        {item.tools.map((t) => (
                          <span
                            key={t}
                            className="label-track !text-[8px] bg-charcoal border border-gold/40 text-gold px-2 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* NOTICE CARD (e.g. for TV Show) */}
        {project.notice && (
          <Reveal>
            <div className="border border-gold/40 bg-navy/40 p-6 rounded flex items-center gap-4 text-gold shadow-md">
              <Film size={22} className="flex-shrink-0 text-gold" />
              <div>
                <p className="label-track !text-[8px] text-gold/80">SERIES STATUS & EXPANSION</p>
                <p className="text-sm font-medium text-ivory mt-0.5">{project.notice}</p>
              </div>
            </div>
          </Reveal>
        )}

        {/* DIRECTOR'S NOTE / WHAT I FELT */}
        {(project.directorNote || project.whatIFelt) && (
          <Reveal>
            <div className="border border-gold/40 bg-navy/30 p-8 md:p-12 relative overflow-hidden shadow-lg">
              <p className="label-track text-gold">EDITOR'S / DIRECTOR'S NOTE</p>
              <blockquote className="mt-6 text-lg md:text-2xl text-ivory/90 italic font-serif leading-relaxed">
                "{project.directorNote || project.whatIFelt}"
              </blockquote>
              <p className="label-track mt-6 text-gold/80 !text-[9px]">
                — ROHITH V, {project.role.split("•")[0]?.trim() || "EDITOR"}
              </p>
            </div>
          </Reveal>
        )}

        {/* YOUTUBE / MOTION ASSET (If traditional video asset) */}
        {visibility.video !== false &&
          !driveVideos.length &&
          (project.hasVideo || project.videoId || project.videoConfig?.videoId || project.videoConfig?.videoUrl) && (
            <Reveal>
              <div className="border border-border/80 bg-navy/30 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <p className="label-track text-gold">FEATURED MOTION ASSET</p>
                  <h3 className="title-card mt-2 text-2xl text-ivory md:text-3xl">
                    {project.videoConfig?.title || `Watch ${project.title}`}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Stream high-definition cinematic release cut
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playProjectTransition();
                    setVideoOpen(true);
                  }}
                  data-cursor="play film"
                  data-magnetic="true"
                  className="label-track bg-gold px-8 py-5 !text-[10px] !text-charcoal font-bold transition-all hover:bg-gold/90 inline-flex items-center gap-3 shadow-lg rounded"
                >
                  <span>WATCH FILM / VIDEO</span>
                  <span className="text-xs">▶</span>
                </button>
              </div>
            </Reveal>
          )}

        {/* CINEMATIC GALLERY WITH CATEGORIES */}
        {visibility.gallery !== false && filteredGallery.length > 0 && (
          <Reveal>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <p className="label-track text-gold">CINEMATIC GALLERY</p>
                  <h3 className="title-card mt-1 text-2xl text-ivory">Production Stills & Artwork</h3>
                </div>

                {galleryCategories.length > 2 && (
                  <div className="flex flex-wrap gap-2">
                    {galleryCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          sound.playSoftClick();
                          setSelectedGalleryCategory(cat);
                        }}
                        className={`label-track px-3.5 py-1.5 !text-[9px] rounded border transition-all ${
                          selectedGalleryCategory === cat
                            ? "bg-gold text-charcoal font-bold border-gold"
                            : "border-border/60 text-ivory/70 hover:text-ivory"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredGallery.map((item, i) => (
                  <div
                    key={i}
                    className="group relative aspect-video cursor-pointer overflow-hidden border border-border/70 bg-navy transition-all duration-300 hover:border-gold/60 rounded"
                    onClick={() => handleImageClick(i)}
                    data-cursor="expand"
                  >
                    <img
                      src={item.url}
                      alt={item.caption || `${project.title} frame ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="vignette pointer-events-none" />
                    <div className="scanlines absolute inset-0 opacity-15 pointer-events-none" />
                    <span className="label-track absolute bottom-3 left-3 bg-charcoal/85 px-2.5 py-1 !text-[8px] text-ivory/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded">
                      {item.category || "STILL"} (EXPAND)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* BEFORE / AFTER VFX SLIDERS */}
        {visibility.beforeAfter !== false && (
          <div>
            {project.beforeAfterPairs && project.beforeAfterPairs.length > 0 ? (
              <div className="space-y-12">
                <Reveal>
                  <p className="label-track text-gold">EDITING & VFX COMPARISONS</p>
                  <h3 className="title-card mt-1 text-2xl text-ivory">Interactive Grade / CG Passes</h3>
                </Reveal>
                {project.beforeAfterPairs.map((pair) => (
                  <Reveal key={pair.id}>
                    <BeforeAfterSlider
                      beforeImage={pair.beforeImage}
                      afterImage={pair.afterImage}
                      beforeLabel={pair.beforeLabel || "BEFORE"}
                      afterLabel={pair.afterLabel || "AFTER"}
                      title={pair.title}
                      description={pair.description}
                    />
                  </Reveal>
                ))}
              </div>
            ) : project.showBeforeAfter && project.beforeImage && project.afterImage ? (
              <Reveal>
                <p className="label-track text-gold">EDITING / VFX BREAKDOWN</p>
                <div className="mt-6">
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage}
                    afterImage={project.afterImage}
                    beforeLabel="BEFORE"
                    afterLabel="AFTER"
                  />
                </div>
              </Reveal>
            ) : project.slug === "one-last-day" ? (
              <Reveal>
                <p className="label-track text-gold">EDITING / VFX BREAKDOWN</p>
                <div className="mt-6">
                  <BeforeAfterSlider
                    beforeImage={oneLastDayBefore}
                    afterImage={oneLastDayAfter}
                    beforeLabel="BEFORE CG"
                    afterLabel="AFTER CG"
                    title="Color Grade & Look Development"
                  />
                </div>
              </Reveal>
            ) : null}
          </div>
        )}

        {/* VFX BREAKDOWNS */}
        {visibility.vfxBreakdown !== false && project.vfxBreakdowns && project.vfxBreakdowns.length > 0 && (
          <Reveal>
            <div className="space-y-8">
              <p className="label-track text-gold">VFX & CGI PIPELINE</p>
              <div className="grid gap-8 md:grid-cols-2">
                {project.vfxBreakdowns.map((vfx) => (
                  <div key={vfx.id} className="border border-border/80 bg-navy/30 p-6 rounded space-y-4">
                    <h4 className="title-card text-xl text-ivory">{vfx.title}</h4>
                    <img src={vfx.finalMedia} alt={vfx.title} className="aspect-video w-full object-cover rounded border border-border" />
                    {vfx.description && <p className="text-sm text-ivory/80 leading-relaxed">{vfx.description}</p>}
                    {vfx.softwareTools && vfx.softwareTools.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                        {vfx.softwareTools.map((tool) => (
                          <span key={tool} className="text-[9px] font-mono bg-charcoal border border-gold/40 text-gold px-2 py-0.5 rounded">
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* STRUCTURED CREDITS & TEAM */}
        {visibility.team !== false && project.teamCredits && project.teamCredits.length > 0 && (
          <Reveal>
            <div className="space-y-6">
              <p className="label-track text-gold">PROJECT CREATIVE TEAM</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {project.teamCredits.map((member, i) => (
                  <div key={i} className="border border-border/70 bg-navy/20 p-5 rounded flex items-center gap-4">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="h-12 w-12 rounded-full object-cover border border-gold/40" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center text-sm font-bold text-gold">
                        {member.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-base font-semibold text-ivory">{member.name}</p>
                      <p className="label-track !text-[9px] text-gold">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* FULL END CREDITS */}
        {visibility.credits !== false && project.fullCredits && (
          <Reveal>
            <div className="border border-border/80 bg-navy/20 p-8 md:p-12 rounded">
              <p className="label-track text-gold text-center">END CREDITS</p>
              <div className="mt-8 max-w-3xl mx-auto whitespace-pre-line text-sm text-ivory/85 md:text-base leading-relaxed divide-y divide-border/40 font-mono">
                {project.fullCredits}
              </div>
            </div>
          </Reveal>
        )}

        {/* EXTERNAL LINKS & PROJECT SHARING */}
        <Reveal>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-y border-border/60 py-8">
            <div className="flex flex-wrap items-center gap-4">
              {project.projectLinks &&
                project.projectLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playSoftClick()}
                    className="label-track inline-flex items-center gap-2 border border-gold/60 px-4 py-2.5 !text-[9px] text-gold hover:bg-gold hover:!text-charcoal transition-all rounded shadow-sm"
                  >
                    <span>{link.label}</span>
                    <ExternalLink size={11} />
                  </a>
                ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                data-cursor="share"
                className="label-track flex items-center gap-2 border border-border px-4 py-2.5 !text-[9px] text-ivory hover:border-gold hover:text-gold transition-all rounded cursor-pointer"
              >
                {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
                <span>{copiedLink ? "Link Copied!" : "Share Project"}</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* GOOGLE SIGN-IN PROJECT COMMENTS */}
        {visibility.comments !== false && (
          <Reveal>
            <ProjectComments projectSlug={project.slug} projectTitle={project.title} />
          </Reveal>
        )}

        {/* PREVIOUS / NEXT PROJECT NAVIGATION */}
        <div className="border-t border-border pt-12">
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 items-stretch">
            {/* Previous Project */}
            <Link
              to="/portfolio/$slug"
              params={{ slug: prev.slug }}
              onClick={() => sound.playProjectTransition()}
              data-cursor="prev film"
              className="group flex items-center gap-5 border border-border/60 p-5 bg-navy/20 transition-all duration-300 hover:border-gold/60 hover:bg-navy/40 rounded"
            >
              <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden bg-navy border border-border/60 rounded">
                <img
                  src={prev.thumbnailImage || prev.image}
                  alt={prev.title}
                  className="h-full w-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <div className="overflow-hidden">
                <p className="label-track text-gold !text-[8px]">← PREVIOUS PROJECT</p>
                <p className="title-card mt-1 text-lg text-ivory group-hover:text-gold transition-colors truncate">
                  {prev.title}
                </p>
                <p className="label-track mt-0.5 !text-[8px] text-muted-foreground">
                  {prev.type} • {prev.year || "2024"}
                </p>
              </div>
            </Link>

            {/* Next Project */}
            <Link
              to="/portfolio/$slug"
              params={{ slug: next.slug }}
              onClick={() => sound.playProjectTransition()}
              data-cursor="next film"
              className="group flex items-center justify-between gap-5 border border-border/60 p-5 bg-navy/20 transition-all duration-300 hover:border-gold/60 hover:bg-navy/40 text-right rounded"
            >
              <div className="overflow-hidden flex-1 text-right">
                <p className="label-track text-gold !text-[8px]">NEXT PROJECT →</p>
                <p className="title-card mt-1 text-lg text-ivory group-hover:text-gold transition-colors truncate">
                  {next.title}
                </p>
                <p className="label-track mt-0.5 !text-[8px] text-muted-foreground">
                  {next.type} • {next.year || "2024"}
                </p>
              </div>
              <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden bg-navy border border-border/60 rounded">
                <img
                  src={next.thumbnailImage || next.image}
                  alt={next.title}
                  className="h-full w-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL (If YouTube Modal requested) */}
      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoId={project.videoId || project.videoConfig?.videoId || ""}
        title={`${project.title} — ${project.type}`}
      />

      {/* IMAGE LIGHTBOX */}
      <ProjectImageLightbox
        images={filteredGallery.map((g) => g.url)}
        altText={filteredGallery.map(
          (g, i) => g.caption || `${project.title} frame ${i + 1}`
        )}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </article>
  );
}
