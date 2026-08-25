import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

import { getProjects } from "@/data/projects";
import { ProjectChapter } from "@/components/ProjectChapter";
import { Reveal } from "@/components/Reveal";
import { Stage } from "@/components/three/Stage";
import { VideoModal } from "@/components/VideoModal";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title: "Selected Work — Rohith V | Filmmaker" },
      {
        name: "description",
        content:
          "Selected film work by Rohith V — short films, pilot films, CG and screenplay credits presented as cinematic chapters.",
      },
      { property: "og:title", content: "Selected Work — Rohith V | Filmmaker" },
      {
        property: "og:description",
        content:
          "Film chapters: One Last Day, Kadalar, Radhal and Toothpaste — work by Rohith V, filmmaker based in Chennai.",
      },
    ],
  }),
  component: Portfolio,
});

const filters = [
  { id: "all", label: "ALL" },
  { id: "FILMMAKING", label: "FILMMAKING" },
  { id: "VFX / CG", label: "VFX / CG" },
  { id: "EDITING", label: "EDITING" },
  { id: "DESIGN", label: "DESIGN" },
  { id: "CONTENT", label: "CONTENT" },
] as const;

function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "FILMMAKING" | "VFX / CG" | "EDITING" | "DESIGN" | "CONTENT"
  >("all");
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [projects, setProjects] = useState(getProjects());

  // Reload projects when localStorage changes (for admin updates)
  useEffect(() => {
    const handleStorageChange = () => {
      setProjects(getProjects());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("custom-project-update", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("custom-project-update", handleStorageChange);
    };
  }, []);

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((p) => p.category === activeFilter);

  const featuredProject = projects.find((p) => p.slug === "one-last-day");
  const otherProjects =
    activeFilter === "all"
      ? projects.filter((p) => p.slug !== "one-last-day")
      : projects.filter((p) => p.category === activeFilter && p.slug !== "one-last-day");

  return (
    <section className="relative">
      <Stage
        scene="reel"
        className="pointer-events-none absolute right-[-12%] top-[10%] hidden h-[50vh] w-[50vh] opacity-30 lg:block"
      />
      <div className="relative mx-auto max-w-[1600px] px-6 pb-24 pt-36 md:px-12 md:pb-32 md:pt-48">
        <Reveal>
          <p className="label-track text-gold">Portfolio</p>
          <h1 className="title-card mt-5 text-5xl text-ivory md:text-8xl">Selected Work</h1>
          <p className="mt-8 max-w-xl text-sm text-muted-foreground md:text-lg">
            Film chapters — direction, CG, screenplay and creative work. Open a chapter to enter the
            project.
          </p>
        </Reveal>

        {/* Featured Project */}
        {activeFilter === "all" && featuredProject && (
          <Reveal delay={0.15} className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border border-gold/30 bg-navy/20 p-6 md:p-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="label-track text-gold">FEATURED</span>
              </div>
              <h2 className="title-card text-3xl text-ivory md:text-5xl">
                {featuredProject.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                {featuredProject.type} — {featuredProject.year}
              </p>
              <p className="mt-4 text-base text-ivory/80 md:text-lg">{featuredProject.role}</p>
              <Link
                to="/portfolio/$slug"
                params={{ slug: featuredProject.slug }}
                data-cursor="enter →"
                className="label-track mt-6 inline-block border border-gold/60 px-6 py-4 !text-[10px] !text-gold transition-colors hover:bg-gold hover:!text-charcoal"
              >
                VIEW PROJECT →
              </Link>
            </motion.div>
          </Reveal>
        )}

        {/* Filters */}
        <Reveal delay={0.1} className="mt-12">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                data-cursor="text"
                className={`label-track px-4 py-2 !text-[10px] transition-colors ${
                  activeFilter === filter.id
                    ? "text-gold border-b border-gold"
                    : "text-muted-foreground hover:text-ivory"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* VFX Showreel */}
        {activeFilter === "all" || activeFilter === "VFX / CG" ? (
          <Reveal delay={0.2} className="mt-16">
            <div className="border border-border p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="label-track text-gold">VFX / CG</p>
                  <h3 className="title-card mt-2 text-2xl text-ivory md:text-3xl">VFX Showreel</h3>
                  <p className="mt-2 text-sm text-muted-foreground md:text-base">
                    Selected visual effects and CG work
                  </p>
                </div>
                <button
                  onClick={() => setShowreelOpen(true)}
                  data-cursor="enter →"
                  className="label-track border border-gold/60 px-6 py-4 !text-[10px] !text-gold transition-colors hover:bg-gold hover:!text-charcoal"
                >
                  WATCH VFX SHOWREEL →
                </button>
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* Projects */}
        <div className="mt-16">
          {(activeFilter === "all" ? otherProjects : filteredProjects).length > 0 ? (
            (activeFilter === "all" ? otherProjects : filteredProjects).map((p, i) => (
              <ProjectChapter key={p.slug} project={p} index={i} />
            ))
          ) : (
            <Reveal>
              <p className="text-center text-muted-foreground">No projects in this category yet.</p>
            </Reveal>
          )}
        </div>

        {/* Selected Credits */}
        <Reveal delay={0.3} className="mt-24 border-t border-border pt-16">
          <p className="label-track text-gold">SELECTED CREDITS</p>
          <div className="mt-12 space-y-8">
            <div>
              <h3 className="title-card text-2xl text-ivory md:text-3xl">ONE LAST DAY</h3>
              <p className="label-track mt-2 text-gold">2023 — Short Film</p>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Story / Screenplay / Director / Editor / DI
              </p>
            </div>
            <div>
              <h3 className="title-card text-2xl text-ivory md:text-3xl">TOOTHPASTE</h3>
              <p className="label-track mt-2 text-gold">2024 — Short Film</p>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Story / Direction / Editing
              </p>
            </div>
            <div>
              <h3 className="title-card text-2xl text-ivory md:text-3xl">KADALAR</h3>
              <p className="label-track mt-2 text-gold">Pilot Film</p>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                CG Artist — Selected CGI Contribution
              </p>
            </div>
            <div>
              <h3 className="title-card text-2xl text-ivory md:text-3xl">RADHAL</h3>
              <p className="label-track mt-2 text-gold">In Pre-Production</p>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Assistant Writer — Script & Screenplay
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <VideoModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        videoId="lYLTsC9RM9U"
        title="VFX Showreel"
      />
    </section>
  );
}
