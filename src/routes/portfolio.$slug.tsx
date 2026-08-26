import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

import { getProject, getProjects } from "@/data/projects";
import { Reveal } from "@/components/Reveal";
import { FocusReveal } from "@/components/FocusReveal";
import { VideoModal } from "@/components/VideoModal";
import { ProjectImageLightbox } from "@/components/ProjectImageLightbox";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import oneLastDayBefore from "@/assets/one-last-day-before-cg.webp";
import oneLastDayAfter from "@/assets/one-last-day-after-cg.webp";
import oneLastDayPoster from "@/assets/one-last-day-poster.webp";

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
    const title = `${project.title} — ${project.type} | Rohith V`;
    const description = `${project.description} ${project.year ? `(${project.year})` : ""}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
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

  if (!project) {
    return <div>Loading...</div>;
  }

  const handleImageClick = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <article>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70svh] min-h-[520px] w-full overflow-hidden"
      >
        <motion.img
          src={project.image}
          alt={`${project.title} — ${project.type}`}
          width={1600}
          height={900}
          initial={{ scale: 1.18, opacity: 0 }}
          animate={{ scale: 1.03, opacity: 0.85 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/60" />
        <div className="vignette" />
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-14 md:px-12 md:pb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="title-card text-4xl text-gold md:text-6xl font-mono"
          >
            {project.number}
          </motion.p>
          <FocusReveal delay={0.65}>
            <h1 className="title-card mt-4 text-[clamp(2.5rem,11vw,8rem)] leading-[0.86] text-ivory drop-shadow-sm">
              {project.title}
            </h1>
          </FocusReveal>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-6 flex flex-wrap gap-x-10 gap-y-3"
          >
            <span className="label-track text-gold">{project.type}</span>
            {project.year ? <span className="label-track">{project.year}</span> : null}
            {project.status ? <span className="label-track">{project.status}</span> : null}
          </motion.div>
        </div>
      </motion.header>

      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
        {/* MY ROLE */}
        <Reveal>
          <p className="label-track text-gold">MY ROLE</p>
          <p className="title-card mt-4 text-xl text-ivory md:text-3xl">{project.role}</p>
        </Reveal>

        {/* PROJECT STORY */}
        <div className="mt-20 grid gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <p className="label-track text-gold">PROJECT STORY</p>
            <p className="mt-6 text-lg leading-relaxed text-ivory/85 md:text-2xl">
              {project.description}
            </p>
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
            <p className="label-track mt-10 text-gold">AVAILABLE ASSETS</p>
            <p className="mt-4 text-sm text-muted-foreground">{project.visuals}</p>
          </Reveal>
        </div>

        {/* WHAT I FELT / CREATIVE STATEMENT */}
        {project.whatIFelt && (
          <Reveal className="mt-20">
            <div className="border border-gold/40 bg-navy/30 p-8 md:p-12 relative overflow-hidden shadow-lg">
              <p className="label-track text-gold">WHAT I FELT / CREATIVE NOTE</p>
              <blockquote className="mt-6 text-lg md:text-2xl text-ivory/90 italic font-serif leading-relaxed">
                "{project.whatIFelt}"
              </blockquote>
              <p className="label-track mt-6 text-gold/80 !text-[9px]">
                — ROHITH V, {project.role.split("•")[0]?.trim() || "DIRECTOR"}
              </p>
            </div>
          </Reveal>
        )}

        {/* WATCH FILM / VIDEO */}
        {project.hasVideo && (
          <Reveal className="mt-20">
            <button
              onClick={() => setVideoOpen(true)}
              data-cursor="play film"
              data-magnetic="true"
              className="label-track bg-gold px-8 py-5 !text-[10px] !text-charcoal font-bold transition-all hover:bg-gold/90 inline-flex items-center gap-3 shadow-lg"
            >
              <span>WATCH FILM / VIDEO</span>
              <span className="text-xs">▶</span>
            </button>
          </Reveal>
        )}

        {/* PROJECT IMAGES */}
        <Reveal className="mt-20">
          <p className="label-track text-gold">PROJECT IMAGES</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div
              className="group relative aspect-[16/9] cursor-pointer overflow-hidden border border-border/70 bg-navy transition-colors hover:border-gold/60"
              onClick={() => handleImageClick(0)}
              data-cursor="expand"
            >
              <img
                src={project.image}
                alt={`${project.title} still frame`}
                loading="lazy"
                decoding="async"
                width={1600}
                height={900}
                className="h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="vignette pointer-events-none" />
              <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />
              <span className="label-track absolute bottom-3 left-3 bg-charcoal/80 px-2.5 py-1 !text-[8px] text-ivory/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                STILL FRAME (CLICK TO EXPAND)
              </span>
            </div>
            {/* Show poster if it exists in the project data or if it's One Last Day */}
            {(project.posterImage || project.slug === "one-last-day") && (
              <div
                className="group relative aspect-[2/3] cursor-pointer overflow-hidden border border-border/70 bg-navy transition-colors hover:border-gold/60 md:max-w-[420px]"
                onClick={() => handleImageClick(1)}
                data-cursor="expand"
              >
                <img
                  src={project.posterImage || oneLastDayPoster}
                  alt={`${project.title} poster`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={1200}
                  className="h-full w-full object-contain opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="vignette pointer-events-none" />
                <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />
                <span className="label-track absolute bottom-3 left-3 bg-charcoal/80 px-2.5 py-1 !text-[8px] text-ivory/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  POSTER (CLICK TO EXPAND)
                </span>
              </div>
            )}
          </div>
        </Reveal>

        {/* BEFORE/AFTER - Dynamic from CMS or hardcoded for existing projects */}
        {project.showBeforeAfter && project.beforeImage && project.afterImage ? (
          <Reveal className="mt-20">
            <p className="label-track text-gold">EDITING / VFX BREAKDOWN</p>
            <div className="mt-6">
              <BeforeAfterSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                beforeLabel="BEFORE"
                afterLabel="AFTER"
              />
              <p className="label-track mt-4 text-center text-gold">DRAG SLIDER OR USE ARROW KEYS TO COMPARE</p>
            </div>
          </Reveal>
        ) : project.slug === "one-last-day" ? (
          <Reveal className="mt-20">
            <p className="label-track text-gold">EDITING / VFX BREAKDOWN</p>
            <div className="mt-6">
              <BeforeAfterSlider
                beforeImage={oneLastDayBefore}
                afterImage={oneLastDayAfter}
                beforeLabel="BEFORE CG"
                afterLabel="AFTER CG"
              />
              <p className="label-track mt-4 text-center text-gold">DRAG SLIDER OR USE ARROW KEYS TO COMPARE</p>
            </div>
          </Reveal>
        ) : project.slug === "kadalar" ? (
          <Reveal className="mt-20">
            <p className="label-track text-gold">VFX BREAKDOWN</p>
            <div className="mt-6 space-y-8">
              <div>
                <div className="aspect-video w-full bg-navy/40 border border-border/80 flex items-center justify-center p-6 text-center">
                  <p className="label-track text-gold/60">
                    Candle CGI contribution — Selected CGI support
                  </p>
                </div>
                <p className="label-track mt-3 text-center text-gold">CANDLE CGI CONTRIBUTION</p>
              </div>
              <div>
                <div className="aspect-video w-full bg-navy/40 border border-border/80 flex items-center justify-center p-6 text-center">
                  <p className="label-track text-gold/60">
                    News CGI contribution — Selected CGI support
                  </p>
                </div>
                <p className="label-track mt-3 text-center text-gold">NEWS CGI CONTRIBUTION</p>
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* FULL CREDITS */}
        {project.fullCredits && (
          <Reveal className="mt-20">
            <div className="border border-border/80 bg-navy/20 p-8 md:p-12">
              <p className="label-track text-gold text-center">END CREDITS</p>
              <div className="mt-8 max-w-3xl mx-auto whitespace-pre-line text-sm text-ivory/85 md:text-base leading-relaxed divide-y divide-border/40 font-mono">
                {project.fullCredits}
              </div>
            </div>
          </Reveal>
        )}

        {/* POST-CREDITS COLLABORATION CTA */}
        <Reveal className="mt-16">
          <div className="border border-gold/40 bg-navy/30 p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_30px_rgba(201,164,76,0.06)]">
            <p className="label-track text-gold">DIRECTOR & CREATIVE COLLABORATION</p>
            <h3 className="title-card mt-3 text-2xl text-ivory md:text-4xl">
              LIKE THIS VISUAL STYLE?
            </h3>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Available for narrative directing, screenplay collaboration, video editing, and visual effects support.
            </p>
            <div className="mt-8">
              <Link
                to="/contact"
                data-cursor="contact →"
                data-magnetic="true"
                className="label-track inline-block border border-gold bg-gold/10 px-8 py-4 !text-[10px] !text-gold transition-all hover:bg-gold hover:!text-charcoal shadow-md font-bold"
              >
                LET’S CREATE YOUR NEXT FRAME →
              </Link>
            </div>
          </div>
        </Reveal>

        {/* NAVIGATION WITH PREVIEW THUMBNAILS */}
        <div className="mt-24 border-t border-border pt-12">
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 items-stretch">
            {/* Previous Project */}
            <Link
              to="/portfolio/$slug"
              params={{ slug: prev.slug }}
              data-cursor="prev film"
              className="group flex items-center gap-5 border border-border/60 p-5 bg-navy/20 transition-all duration-300 hover:border-gold/60 hover:bg-navy/40"
            >
              <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden bg-navy border border-border/60">
                <img
                  src={prev.image}
                  alt={prev.title}
                  className="h-full w-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <div className="overflow-hidden">
                <p className="label-track text-gold !text-[8px]">← PREVIOUS FILM</p>
                <p className="title-card mt-1 text-lg text-ivory group-hover:text-gold transition-colors truncate">
                  {prev.title}
                </p>
                <p className="label-track mt-0.5 !text-[8px] text-muted-foreground">{prev.type} • {prev.year || "2024"}</p>
              </div>
            </Link>

            {/* Next Project */}
            <Link
              to="/portfolio/$slug"
              params={{ slug: next.slug }}
              data-cursor="next film"
              className="group flex items-center justify-between gap-5 border border-border/60 p-5 bg-navy/20 transition-all duration-300 hover:border-gold/60 hover:bg-navy/40 text-right"
            >
              <div className="overflow-hidden flex-1 text-right">
                <p className="label-track text-gold !text-[8px]">NEXT FILM →</p>
                <p className="title-card mt-1 text-lg text-ivory group-hover:text-gold transition-colors truncate">
                  {next.title}
                </p>
                <p className="label-track mt-0.5 !text-[8px] text-muted-foreground">{next.type} • {next.year || "2024"}</p>
              </div>
              <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden bg-navy border border-border/60">
                <img
                  src={next.image}
                  alt={next.title}
                  className="h-full w-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoId={project.videoId || ""}
        title={`${project.title} — ${project.type}`}
      />

      {/* IMAGE LIGHTBOX */}
      <ProjectImageLightbox
        images={
          project.galleryImages && project.galleryImages.length > 0
            ? project.galleryImages
            : project.posterImage
              ? [project.image, project.posterImage]
              : project.slug === "one-last-day"
                ? [project.image, oneLastDayPoster]
                : [project.image]
        }
        altText={
          project.galleryImages && project.galleryImages.length > 0
            ? project.galleryImages.map((_: string, i: number) => `${project.title} image ${i + 1}`)
            : project.posterImage
              ? [`${project.title} still frame`, `${project.title} poster`]
              : project.slug === "one-last-day"
                ? [`${project.title} still frame`, "One Last Day poster"]
                : [`${project.title} still frame`]
        }
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </article>
  );
}
