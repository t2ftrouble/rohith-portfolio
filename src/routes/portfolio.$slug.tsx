import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

import { getProject, getProjects } from "@/data/projects";
import { Reveal } from "@/components/Reveal";
import { VideoModal } from "@/components/VideoModal";
import { ProjectImageLightbox } from "@/components/ProjectImageLightbox";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import oneLastDayBefore from "@/assets/one-last-day-before-cg.webp";
import oneLastDayAfter from "@/assets/one-last-day-after-cg.webp";
import oneLastDayPoster from "@/assets/one-last-day-poster.webp";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    const allProjects = getProjects();
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

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
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
            transition={{ delay: 0.6, duration: 1 }}
            className="title-card text-4xl text-gold md:text-6xl"
          >
            {project.number}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="title-card mt-4 text-[13vw] leading-[0.86] text-ivory md:text-[8vw]"
          >
            {project.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
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

        {/* WATCH FILM */}
        {project.hasVideo && project.videoId && (
          <Reveal className="mt-20">
            <button
              onClick={() => setVideoOpen(true)}
              data-cursor="play"
              className="label-track border border-gold/60 px-8 py-5 !text-[10px] !text-gold transition-colors hover:bg-gold hover:!text-charcoal"
            >
              {project.slug === "toothpaste" ? "WATCH SHORT FILM →" : "WATCH FILM →"}
            </button>
          </Reveal>
        )}

        {/* PROJECT IMAGES */}
        <Reveal className="mt-20">
          <p className="label-track text-gold">PROJECT IMAGES</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div
              className="relative aspect-[16/9] cursor-pointer overflow-hidden bg-navy"
              onClick={() => handleImageClick(0)}
            >
              <img
                src={project.image}
                alt={`${project.title} still frame`}
                loading="lazy"
                decoding="async"
                width={1600}
                height={900}
                className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
              />
              <div className="vignette" />
              <div className="scanlines absolute inset-0 opacity-20" />
            </div>
            {/* Show poster if it exists in the project data or if it's One Last Day */}
            {((project as any).posterImage || project.slug === "one-last-day") && (
              <div
                className="relative aspect-[2/3] cursor-pointer overflow-hidden bg-navy"
                onClick={() => handleImageClick(1)}
              >
                <img
                  src={(project as any).posterImage || oneLastDayPoster}
                  alt={`${project.title} poster`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={1200}
                  className="h-full w-full object-contain opacity-80 transition-opacity hover:opacity-100"
                />
                <div className="vignette" />
                <div className="scanlines absolute inset-0 opacity-20" />
              </div>
            )}
          </div>
        </Reveal>

        {/* BEFORE/AFTER - Dynamic from CMS or hardcoded for existing projects */}
        {(project as any).showBeforeAfter && (project as any).beforeImage && (project as any).afterImage ? (
          <Reveal className="mt-20">
            <p className="label-track text-gold">EDITING / VFX BREAKDOWN</p>
            <div className="mt-6">
              <BeforeAfterSlider
                beforeImage={(project as any).beforeImage}
                afterImage={(project as any).afterImage}
                beforeLabel="BEFORE"
                afterLabel="AFTER"
              />
              <p className="label-track mt-4 text-center text-gold">FROM RAW TO FINAL</p>
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
              <p className="label-track mt-4 text-center text-gold">FROM RAW TO FINAL</p>
            </div>
          </Reveal>
        ) : project.slug === "kadalar" ? (
          <Reveal className="mt-20">
            <p className="label-track text-gold">VFX BREAKDOWN</p>
            <div className="mt-6 space-y-8">
              <div>
                <div className="aspect-video w-full bg-navy flex items-center justify-center">
                  <p className="label-track text-gold/50">
                    Candle CGI slider pending actual BEFORE/AFTER images
                  </p>
                </div>
                <p className="label-track mt-4 text-center text-gold">CANDLE CGI</p>
              </div>
              <div>
                <div className="aspect-video w-full bg-navy flex items-center justify-center">
                  <p className="label-track text-gold/50">
                    News CGI slider pending actual BEFORE/AFTER images
                  </p>
                </div>
                <p className="label-track mt-4 text-center text-gold">NEWS CGI</p>
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* FULL CREDITS */}
        {project.fullCredits && (
          <Reveal className="mt-20">
            <p className="label-track text-gold">FULL CREDITS</p>
            <div className="mt-6 whitespace-pre-line text-sm text-ivory/80 md:text-base">
              {project.fullCredits}
            </div>
          </Reveal>
        )}

        {/* NAVIGATION */}
        <div className="mt-20 flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-center md:justify-between">
          <Link
            to="/portfolio/$slug"
            params={{ slug: prev.slug }}
            data-cursor="text"
            className="label-track group"
          >
            ← PREVIOUS PROJECT
          </Link>
          <Link
            to="/portfolio/$slug"
            params={{ slug: next.slug }}
            data-cursor="view film →"
            className="group text-right"
          >
            <p className="label-track text-gold">NEXT PROJECT →</p>
            <p className="title-card mt-2 text-2xl text-ivory transition-colors group-hover:text-gold md:text-4xl">
              {next.title}
            </p>
          </Link>
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
          (project as any).galleryImages && (project as any).galleryImages.length > 0
            ? (project as any).galleryImages
            : project.slug === "one-last-day"
              ? [project.image, oneLastDayPoster]
              : (project as any).posterImage
                ? [project.image, (project as any).posterImage]
                : [project.image]
        }
        altText={
          (project as any).galleryImages && (project as any).galleryImages.length > 0
            ? (project as any).galleryImages.map((_: string, i: number) => `${project.title} image ${i + 1}`)
            : project.slug === "one-last-day"
              ? [`${project.title} still frame`, "One Last Day poster"]
              : (project as any).posterImage
                ? [`${project.title} still frame`, `${project.title} poster`]
                : [`${project.title} still frame`]
        }
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </article>
  );
}
