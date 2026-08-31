import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Scissors,
  Play,
  Film,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  Tv,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Info,
} from "lucide-react";

import { FocusReveal } from "@/components/FocusReveal";
import { Reveal } from "@/components/Reveal";
import { Stage } from "@/components/three/Stage";
import { EditingProjectCard } from "@/components/EditingProjectCard";
import { EditingVideoModal } from "@/components/EditingVideoModal";
import {
  editingProjectsData,
  type EditingProject,
} from "@/data/editing-projects";
import { getSeoSettings, defaultSeoSettings } from "@/lib/seo-settings";
import { sound } from "@/lib/sound";

export const Route = createFileRoute("/editing")({
  loader: async () => {
    try {
      const seo = await getSeoSettings();
      return { seoSettings: seo };
    } catch {
      return { seoSettings: defaultSeoSettings };
    }
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seoSettings || defaultSeoSettings;
    const title = seo.editingTitle || "Editing Portfolio | Rohith V";
    const description =
      seo.editingDescription ||
      "Editing portfolio showcasing personal edits, promotional films, television work, corporate videos, colour correction, visual finishing and After Effects work by Rohith V.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: seo.globalOgImage },
      ],
    };
  },
  component: EditingPortfolio,
});

const categoryFilters = [
  { id: "ALL", label: "ALL PROJECTS" },
  { id: "Client / Personal", label: "PERSONAL / CLIENT" },
  { id: "Corporate", label: "CORPORATE" },
  { id: "Educational", label: "EDUCATIONAL" },
  { id: "Television", label: "TV & BROADCAST" },
  { id: "Commercial", label: "COMMERCIAL" },
] as const;

const editingCapabilities = [
  {
    icon: Scissors,
    title: "Precision Cutting & Assembly",
    desc: "Narrative structure assembly, eliminating dead space, and building tight rhythmic cuts that keep viewers locked in.",
  },
  {
    icon: Sliders,
    title: "Colour Grading & DI",
    desc: "Transforming flat LOG and raw clips into rich cinematic tones, balanced skin tones, and evocative mood palettes.",
  },
  {
    icon: Sparkles,
    title: "Visual Polish & Motion Finishing",
    desc: "Seamless title typography, subtitles, After Effects visual enhancement, clean wipes, and brand element integration.",
  },
  {
    icon: Layers,
    title: "Audio & Music Synchronization",
    desc: "Frame-accurate beat cuts, sound design accents, audio sweetening, and dynamic sound pacing that elevates emotion.",
  },
];

function EditingPortfolio() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedProject, setSelectedProject] = useState<EditingProject | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenVideo = (project: EditingProject, videoIndex: number = 0) => {
    setSelectedProject(project);
    setSelectedVideoIndex(videoIndex);
    setModalOpen(true);
  };

  const filteredProjects =
    activeCategory === "ALL"
      ? editingProjectsData
      : editingProjectsData.filter((p) => p.category === activeCategory);

  const totalFilmsCount = editingProjectsData.reduce(
    (acc, p) => acc + p.videos.length,
    0
  );

  return (
    <div className="relative min-h-screen bg-charcoal">
      <Stage
        scene="reel"
        className="pointer-events-none absolute right-[-10%] top-[8%] hidden h-[55vh] w-[55vh] opacity-25 lg:block"
      />

      <div className="relative mx-auto max-w-[1600px] px-6 pb-28 pt-36 md:px-12 md:pb-36 md:pt-48">
        {/* Header Title Section */}
        <FocusReveal>
          <div className="flex items-center gap-3">
            <span className="label-track text-gold">POST-PRODUCTION & EDITING</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          </div>
          <h1 className="title-card mt-5 text-4xl sm:text-6xl md:text-8xl text-ivory">
            Editing Portfolio
          </h1>
          <p className="mt-8 max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            Crafting story and rhythm from raw footage. Explore {totalFilmsCount} selected post-production films across personal client edits, corporate communication, educational admission campaigns, television broadcasts, and commercial school reels.
          </p>
        </FocusReveal>

        {/* Quick Capabilities Highlights */}
        <Reveal delay={0.15} className="mt-14 border-y border-border/70 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {editingCapabilities.map((cap, i) => (
              <div
                key={cap.title}
                className="group p-5 bg-navy/20 border border-border/50 rounded-xs transition-all duration-300 hover:border-gold/50 hover:bg-navy/40"
              >
                <div className="flex items-center justify-between">
                  <cap.icon size={20} className="text-gold transition-transform group-hover:scale-110" />
                  <span className="text-[9px] font-mono text-muted-foreground">0{i + 1}</span>
                </div>
                <h2 className="title-card text-base text-ivory mt-4 group-hover:text-gold transition-colors">
                  {cap.title}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Category Filters */}
        <Reveal delay={0.2} className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <p className="label-track text-gold !text-[9px]">FILTER BY CATEGORY</p>
              <h2 className="title-card text-xl text-ivory mt-1">Selected Editing Projects</h2>
            </div>

            <div className="flex flex-wrap gap-2 p-1.5 bg-navy/30 border border-border/70 rounded-xs">
              {categoryFilters.map((cat) => {
                const count =
                  cat.id === "ALL"
                    ? editingProjectsData.length
                    : editingProjectsData.filter((p) => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sound.playSoftClick();
                      setActiveCategory(cat.id);
                    }}
                    data-cursor="filter"
                    className={`relative label-track px-3.5 py-2 !text-[9px] transition-colors rounded-xs cursor-pointer select-none ${
                      activeCategory === cat.id
                        ? "!text-charcoal font-bold"
                        : "text-muted-foreground hover:text-ivory"
                    }`}
                  >
                    {activeCategory === cat.id && (
                      <motion.div
                        layoutId="activeEditingTab"
                        className="absolute inset-0 bg-gold rounded-xs z-0 shadow-md"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {cat.label}
                      <span
                        className={`!text-[8px] ${
                          activeCategory === cat.id ? "text-charcoal" : "text-gold"
                        }`}
                      >
                        ({count})
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Projects List */}
        <motion.div layout className="mt-10 space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <EditingProjectCard
                  project={project}
                  index={idx}
                  onWatchVideo={handleOpenVideo}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* TV Show Expansion Ready Notice */}
        <Reveal delay={0.25} className="mt-16">
          <div className="border border-gold/30 bg-navy/30 p-6 md:p-8 rounded-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tv size={18} className="text-gold" />
                  <span className="label-track text-gold !text-[10px]">TELEVISION ARCHIVE</span>
                </div>
                <h3 className="title-card text-xl text-ivory">More TV Show Episodes In Production</h3>
                <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
                  The TV Show collection currently features the lead television broadcast. Two additional episodes are in post-production and will be added to this section.
                </p>
              </div>

              <Link
                to="/contact"
                data-cursor="contact →"
                className="label-track border border-gold/60 px-6 py-3.5 !text-[10px] !text-gold hover:bg-gold hover:!text-charcoal transition-all text-center inline-block whitespace-nowrap rounded-xs"
              >
                COMMISSION AN EDIT →
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Editing Workflow Process Banner */}
        <Reveal delay={0.3} className="mt-20 border-t border-border/80 pt-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="label-track text-gold">POST-PRODUCTION WORKFLOW</p>
              <h2 className="title-card mt-3 text-3xl md:text-4xl text-ivory">
                The Cutting Room Philosophy
              </h2>
              <p className="mt-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
                Every video begins with a thorough review of the raw footage to understand the content, identify the emotional hooks, and determine the optimal pacing. Every cut, color grade, and music cue is designed to elevate the final presentation.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-charcoal/80 border border-border/60">
                <span className="label-track text-gold !text-[9px]">STEP 01</span>
                <h3 className="title-card text-lg text-ivory mt-2">Footage Ingestion & Selects</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Comprehensive review of raw material, logging takes, syncing audio, and selecting hero moments.
                </p>
              </div>
              <div className="p-5 bg-charcoal/80 border border-border/60">
                <span className="label-track text-gold !text-[9px]">STEP 02</span>
                <h3 className="title-card text-lg text-ivory mt-2">Assembly & Pacing</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Establishing the narrative rhythm, cutting to music beats, and maintaining high viewer engagement.
                </p>
              </div>
              <div className="p-5 bg-charcoal/80 border border-border/60">
                <span className="label-track text-gold !text-[9px]">STEP 03</span>
                <h3 className="title-card text-lg text-ivory mt-2">Color Grading & DI</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  DaVinci Resolve / Premiere color grading for unified skin tones, contrast, and atmosphere.
                </p>
              </div>
              <div className="p-5 bg-charcoal/80 border border-border/60">
                <span className="label-track text-gold !text-[9px]">STEP 04</span>
                <h3 className="title-card text-lg text-ivory mt-2">Motion Graphics & Master Deliverables</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Subtitles, lower thirds, After Effects finishing, and platform-optimized HD/4K master exports.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Cinematic Google Drive Video Modal */}
      <EditingVideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={selectedProject}
        initialVideoIndex={selectedVideoIndex}
      />
    </div>
  );
}
