import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { resolveImageUrl } from "@/lib/asset-resolver";

export function ProjectChapter({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  const imageSrc = resolveImageUrl(project.image);

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-border py-12 md:py-20"
    >
      <Link
        to="/portfolio/$slug"
        params={{ slug: project.slug }}
        data-cursor="view film →"
        data-magnetic="false"
        className="group grid gap-8 md:grid-cols-12 md:items-center focus:outline-none"
      >
        <div className={`md:col-span-4 ${flip ? "md:order-2 md:col-start-9" : ""}`}>
          <div className="flex items-center gap-3">
            {/* Animated Timecode Chapter Number */}
            <motion.span
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="title-card text-4xl text-slate/80 transition-colors duration-500 group-hover:text-gold md:text-6xl select-none font-mono"
            >
              {project.number}
            </motion.span>
            {project.category ? (
              <span className="label-track border border-border/80 px-2.5 py-0.5 !text-[8px] text-gold/80 bg-navy/30">
                {project.category}
              </span>
            ) : null}
          </div>

          <h3 className="title-card mt-3 text-3xl text-ivory transition-colors duration-300 group-hover:text-gold md:text-5xl">
            {project.title}
          </h3>

          {project.emotionalDescriptor && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="mt-2 text-sm text-gold/80 italic md:text-base"
            >
              {project.emotionalDescriptor}
            </motion.p>
          )}

          <p className="label-track mt-4 text-gold">{project.type}</p>
          <p className="label-track mt-2 text-muted-foreground">{project.role}</p>

          <div className="mt-6 inline-flex items-center gap-2">
            <span className="label-track !tracking-[0.3em] text-ivory/80 transition-colors duration-300 group-hover:text-gold">
              View film
            </span>
            <span className="text-gold transition-transform duration-300 ease-out group-hover:translate-x-1.5">
              →
            </span>
          </div>
        </div>

        {/* Interactive Cinematic Thumbnail Frame with subtle 3D hover depth */}
        <div
          className={`relative overflow-hidden border border-border/60 transition-all duration-500 group-hover:border-gold/60 group-hover:shadow-[0_0_30px_rgba(201,164,76,0.12)] md:col-span-7 ${
            flip ? "md:order-1 md:col-start-1" : "md:col-start-6"
          }`}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={`${project.title} — ${project.type}`}
                loading="lazy"
                decoding="async"
                width={1600}
                height={900}
                className="h-full w-full scale-[1.03] object-cover opacity-85 transition-all duration-700 ease-out group-hover:scale-108 group-hover:opacity-100"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                No cover image
              </div>
            )}
            <div className="vignette transition-opacity duration-500 group-hover:opacity-70" />
            <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />

            {project.hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gold/90 text-charcoal shadow-lg backdrop-blur-sm opacity-80 md:opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-110">
                  <Play size={26} className="text-charcoal fill-charcoal translate-x-0.5" />
                </div>
              </div>
            )}
          </div>

          {project.status ? (
            <span className="label-track absolute left-4 top-4 border border-gold/50 bg-charcoal/85 px-3 py-1 !text-[9px] text-gold backdrop-blur-sm shadow-md">
              {project.status}
            </span>
          ) : null}

          {project.year ? (
            <span className="label-track absolute right-4 top-4 border border-border/80 bg-charcoal/85 px-3 py-1 !text-[9px] text-ivory/80 backdrop-blur-sm">
              {project.year}
            </span>
          ) : null}
        </div>
      </Link>
    </motion.article>
  );
}
