import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

import { getProjects, type Project } from "@/data/projects";
import { ProjectChapter } from "@/components/ProjectChapter";
import { Reveal } from "@/components/Reveal";
import { FocusReveal } from "@/components/FocusReveal";
import { Stage } from "@/components/three/Stage";
import { VideoModal } from "@/components/VideoModal";

export const Route = createFileRoute("/portfolio/")({
  loader: async () => {
    try {
      const dynamicProjects = await getProjects();
      return { projects: dynamicProjects };
    } catch {
      return { projects: [] };
    }
  },
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
  const loaderData = Route.useLoaderData();
  const [activeFilter, setActiveFilter] = useState<
    "all" | "FILMMAKING" | "VFX / CG" | "EDITING" | "DESIGN" | "CONTENT"
  >("all");
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(
    loaderData?.projects && loaderData.projects.length > 0 ? loaderData.projects : []
  );

  // Load / reload projects from Supabase on mount
  useEffect(() => {
    getProjects().then((data) => {
      if (data && data.length > 0) setProjects(data);
    });
  }, []);

  // Reload projects when custom event fires (for admin updates)
  useEffect(() => {
    const handleProjectUpdate = () => {
      getProjects().then((data) => {
        if (data && data.length > 0) setProjects(data);
      });
    };

    window.addEventListener("custom-project-update", handleProjectUpdate);

    return () => {
      window.removeEventListener("custom-project-update", handleProjectUpdate);
    };
  }, []);

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((p) => p.category === activeFilter);

  const featuredProject = projects.find((p) => p.slug === "one-last-day") || projects[0];
  const otherProjects =
    activeFilter === "all"
      ? projects.filter((p) => p.slug !== (featuredProject?.slug || "one-last-day"))
      : projects.filter((p) => p.category === activeFilter && p.slug !== (featuredProject?.slug || "one-last-day"));

  return (
    <section className="relative">
      <Stage
        scene="reel"
        className="pointer-events-none absolute right-[-12%] top-[10%] hidden h-[50vh] w-[50vh] opacity-30 lg:block"
      />
      <div className="relative mx-auto max-w-[1600px] px-6 pb-24 pt-36 md:px-12 md:pb-32 md:pt-48">
        <FocusReveal>
          <p className="label-track text-gold">Portfolio</p>
          <h1 className="title-card mt-5 text-5xl text-ivory md:text-8xl">Selected Work</h1>
          <p className="mt-8 max-w-xl text-sm text-muted-foreground md:text-lg">
            Film chapters — direction, CG, screenplay and creative work. Open a chapter to enter the
            project.
          </p>
        </FocusReveal>

        {/* Featured Project */}
        {activeFilter === "all" && featuredProject && (
          <Reveal delay={0.15} className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="border border-gold/40 bg-navy/30 p-6 md:p-8 shadow-[0_0_30px_rgba(201,164,76,0.06)]"
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

        {/* Sliding Filters */}
        <Reveal delay={0.1} className="mt-12">
          <div className="flex flex-wrap gap-2 md:gap-3 p-1.5 bg-navy/30 border border-border/70 inline-flex">
            {filters.map((filter) => {
              const count =
                filter.id === "all"
                  ? projects.length
                  : projects.filter((p) => p.category === filter.id).length;

              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  data-cursor="filter"
                  data-magnetic="true"
                  className={`relative label-track px-4 py-2.5 !text-[10px] transition-colors rounded-sm cursor-pointer select-none ${
                    activeFilter === filter.id
                      ? "!text-charcoal font-bold"
                      : "text-muted-foreground hover:text-ivory"
                  }`}
                >
                  {activeFilter === filter.id && (
                    <motion.div
                      layoutId="activeFilterTab"
                      className="absolute inset-0 bg-gold rounded-sm z-0 shadow-md"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {filter.label}
                    <span
                      className={`!text-[8px] opacity-80 ${
                        activeFilter === filter.id ? "text-charcoal" : "text-gold"
                      }`}
                    >
                      ({count})
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* VFX Showreel */}
        {activeFilter === "all" || activeFilter === "VFX / CG" ? (
          <Reveal delay={0.2} className="mt-16">
            <div className="border border-border/80 bg-navy/20 p-6 md:p-8 transition-colors hover:border-gold/40">
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
                  data-cursor="play reel"
                  data-magnetic="true"
                  className="label-track border border-gold/60 px-6 py-4 !text-[10px] !text-gold transition-all hover:bg-gold hover:!text-charcoal inline-block shadow-sm"
                >
                  WATCH VFX SHOWREEL →
                </button>
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* Projects with AnimatePresence */}
        <motion.div layout className="mt-16">
          <AnimatePresence mode="popLayout">
            {(activeFilter === "all" ? otherProjects : filteredProjects).length > 0 ? (
              (activeFilter === "all" ? otherProjects : filteredProjects).map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectChapter project={p} index={i} />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center"
              >
                <p className="text-muted-foreground">No projects in this category yet.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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
