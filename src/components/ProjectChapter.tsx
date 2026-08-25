import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectChapter({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-border py-12 md:py-20"
    >
      <Link
        to="/portfolio/$slug"
        params={{ slug: project.slug }}
        data-cursor="view film →"
        className="group grid gap-8 md:grid-cols-12 md:items-center"
      >
        <div className={`md:col-span-4 ${flip ? "md:order-2 md:col-start-9" : ""}`}>
          <p className="title-card text-5xl text-slate transition-colors duration-500 group-hover:text-gold md:text-7xl">
            {project.number}
          </p>
          <h3 className="title-card mt-4 text-3xl text-ivory md:text-5xl">{project.title}</h3>
          <p className="label-track mt-4 text-gold">{project.type}</p>
          <p className="label-track mt-2">{project.role}</p>
          <p className="label-track mt-6 !tracking-[0.3em] text-ivory/80">View film →</p>
        </div>

        <div
          className={`relative overflow-hidden md:col-span-7 ${
            flip ? "md:order-1 md:col-start-1" : "md:col-start-6"
          }`}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy">
            <img
              src={project.image}
              alt={`${project.title} — ${project.type}`}
              loading="lazy"
              decoding="async"
              width={1600}
              height={900}
              className="h-full w-full scale-105 object-cover opacity-80 transition-all duration-[1200ms] ease-out group-hover:scale-100 group-hover:opacity-100"
            />
            <div className="vignette" />
            <div className="scanlines absolute inset-0 opacity-20" />
            {project.hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gold/90 backdrop-blur-sm">
                  <Play size={32} className="text-charcoal fill-charcoal" />
                </div>
              </div>
            )}
          </div>
          {project.status ? (
            <span className="label-track absolute left-4 top-4 border border-gold/50 bg-charcoal/70 px-3 py-1 !text-[9px] text-gold backdrop-blur-sm">
              {project.status}
            </span>
          ) : null}
        </div>
      </Link>
    </motion.article>
  );
}
