import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import {
  Eye,
  Heart,
  MessageSquare,
  Camera,
  Film,
  Edit,
  BarChart3,
  Building2,
  Lightbulb,
  FileText,
  Video,
  Scissors,
  Upload,
  Megaphone,
  Target,
  Users,
  PenTool,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import heroImage from "@/assets/hero-street.webp";
import { getProjects, defaultProjects, type Project } from "@/data/projects";
import { OpeningTitles } from "@/components/OpeningTitles";
import { ProjectChapter } from "@/components/ProjectChapter";
import { Reveal } from "@/components/Reveal";
import { FocusReveal } from "@/components/FocusReveal";
import { Stage } from "@/components/three/Stage";
import { FilmmakingStatement } from "@/components/FilmmakingStatement";
import { getSiteImages, type SiteImagesData } from "@/lib/site-images";
import {
  getHomepageContent,
  defaultHomepageContent,
  type HomepageContentData,
} from "@/lib/homepage-content";
import {
  getFeaturedProjects,
  defaultFeaturedProjects,
  type FeaturedProjectsData,
} from "@/lib/featured-projects";
import {
  getSeoSettings,
  defaultSeoSettings,
  type SeoSettingsData,
} from "@/lib/seo-settings";

import premiereProLogo from "@/assets/logo/premier pro.webp";
import afterEffectsLogo from "@/assets/logo/after effect.webp";
import photoshopLogo from "@/assets/logo/photoshop.webp";
import illustratorLogo from "@/assets/logo/illustrator.webp";
import davinciLogo from "@/assets/logo/davinci.webp";
import mayaLogo from "@/assets/logo/maya.webp";
import nukeLogo from "@/assets/logo/nuke.webp";
import pftrackLogo from "@/assets/logo/pf track.webp";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const [dynamicProjects, hpContent, featuredData, seo] = await Promise.all([
        getProjects(),
        getHomepageContent(),
        getFeaturedProjects(),
        getSeoSettings(),
      ]);
      return {
        projects: dynamicProjects,
        homepageContent: hpContent,
        featuredProjects: featuredData,
        seoSettings: seo,
      };
    } catch {
      return {
        projects: defaultProjects,
        homepageContent: defaultHomepageContent,
        featuredProjects: defaultFeaturedProjects,
        seoSettings: defaultSeoSettings,
      };
    }
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seoSettings || defaultSeoSettings;
    const title = seo.homeTitle || seo.globalTitle;
    const description = seo.homeDescription || seo.globalDescription;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: seo.globalKeywords },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: seo.globalOgImage },
      ],
    };
  },
  component: Home,
});

const skills = [
  {
    title: "Filmmaking & Direction",
    description: "Visual storytelling, shot composition, blocking and scene execution.",
    icon: Camera as LucideIcon,
    accent: "01",
  },
  {
    title: "Screenplay & Writing",
    description: "Story structure, character arcs, dialogue writing and scene pacing.",
    icon: FileText as LucideIcon,
    accent: "02",
  },
  {
    title: "Editing & Post-Production",
    description: "Rhythm, continuity editing, pacing and sound-image alignment.",
    icon: Edit as LucideIcon,
    accent: "03",
  },
  {
    title: "VFX & CGI Support",
    description: "Matchmoving, object integration, CGI contribution and visual finishing.",
    icon: Film as LucideIcon,
    accent: "04",
  },
];

const digitalMarketingSkills = [
  {
    title: "Direct-Response Video Ads",
    description: "High-hook video creatives tailored for Meta (FB/IG) and Google Ads campaigns.",
    icon: Megaphone as LucideIcon,
    accent: "01",
  },
  {
    title: "Social Reels & Short Form",
    description: "Vertical video designed for rapid retention, episodic branding, and shareability.",
    icon: TrendingUp as LucideIcon,
    accent: "02",
  },
  {
    title: "Brand Film Documentaries",
    description: "Narrative founder stories and cinematic showcases that establish deep customer trust.",
    icon: Users as LucideIcon,
    accent: "03",
  },
  {
    title: "Hook Strategy & Scripting",
    description: "Psychological framing, scroll-stopping visual openings, and CTA placement.",
    icon: Target as LucideIcon,
    accent: "04",
  },
  {
    title: "Analytics & Growth Optimization",
    description: "Tracking KPIs, analyzing funnel metrics, and scaling what works.",
    icon: BarChart3 as LucideIcon,
    accent: "05",
  },
  {
    title: "Creative Direction for Digital Ads",
    description: "High-converting visual concepts, hooks, and video ad creatives that stop the scroll.",
    icon: Lightbulb as LucideIcon,
    accent: "06",
  },
];

const software = [
  {
    name: "Premiere Pro",
    use: "Editing",
    desc: "Used for narrative editing, timeline assembly and pacing.",
    logo: premiereProLogo,
  },
  {
    name: "After Effects",
    use: "Motion & VFX",
    desc: "Used for motion graphics, VFX compositing and visual enhancements.",
    logo: afterEffectsLogo,
  },
  {
    name: "Photoshop",
    use: "Visual Design",
    desc: "Used for poster design, concept art and texture work.",
    logo: photoshopLogo,
  },
  {
    name: "Illustrator",
    use: "Vector Design",
    desc: "Used for logos, vector graphics and clean graphic assets.",
    logo: illustratorLogo,
  },
  {
    name: "DaVinci Resolve",
    use: "Color & Finishing",
    desc: "Used for color grading and final visual finishing.",
    logo: davinciLogo,
  },
  {
    name: "Autodesk Maya",
    use: "3D / Modeling / Animation",
    desc: "Used for 3D modeling, animation and visual development.",
    logo: mayaLogo,
  },
  {
    name: "Nuke",
    use: "Compositing",
    desc: "Used for advanced compositing and visual effects integration.",
    logo: nukeLogo,
  },
  {
    name: "PFTrack",
    use: "Camera Tracking",
    desc: "Used for 3D camera tracking and matchmoving.",
    logo: pftrackLogo,
  },
];

function Hero({ content }: { content: HomepageContentData }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [heroBg, setHeroBg] = useState<string>(heroImage);

  useEffect(() => {
    getSiteImages().then((imgs) => {
      if (imgs.heroImage) setHeroBg(imgs.heroImage);
    }).catch(() => {});

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteImagesData>;
      if (customEvent.detail?.heroImage) setHeroBg(customEvent.detail.heroImage);
    };

    window.addEventListener("site-images-updated", handleUpdate);
    return () => window.removeEventListener("site-images-updated", handleUpdate);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "12%" : "25%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 1.04 : 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "20%" : "40%"]);
  const fade = useTransform(scrollYProgress, [0, isMobile ? 0.6 : 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-12 pt-28 md:pb-24 md:pt-36"
    >
      {/* Background with continuous subtle lens breathing */}
      <motion.img
        src={heroBg}
        alt="Rain-lit Chennai street at night — cinematic backdrop"
        width={1600}
        height={1008}
        style={{ y: imgY, scale: imgScale }}
        className="hero-lens-breathe absolute inset-0 h-full w-full object-cover opacity-75"
      />
      
      {/* Cinematic dark gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(201,164,76,0.08)_0%,transparent_60%)] pointer-events-none" />
      
      {/* Ambient anamorphic light drift */}
      <div className="anamorphic-drift absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent pointer-events-none" />
      <div className="vignette" />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative mx-auto w-full max-w-[1400px] px-5 pb-8 md:px-12 md:pb-24 text-center md:text-left md:w-[85%] md:ml-[12%]"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.0 }}
          className="label-track text-gold !text-[10px] md:!text-[11px]"
        >
          A film by
        </motion.p>
        
        <FocusReveal delay={0.35}>
          <h1 className="title-card mt-3 text-[clamp(2.5rem,10vw,8.8rem)] leading-[0.9] text-ivory drop-shadow-sm text-balance">
            {content.heroTitle || "Rohith V"}
          </h1>
        </FocusReveal>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1.0 }}
          className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div className="text-center md:text-left">
            <p className="label-track !text-[clamp(0.75rem,2vw,0.875rem)] !tracking-[0.5em] text-ivory">
              {content.heroSubtitle || "Filmmaker"}
            </p>
            <p className="label-track mt-3 !text-[clamp(0.6rem,1.8vw,0.625rem)] text-gold">
              {content.heroRole || "Writer • Editor • VFX / CG Artist"}
            </p>
          </div>
          
          {/* Mobile responsive button pair */}
          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-row w-full sm:w-auto mt-2 sm:mt-0">
            <motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                to={content.heroCtaLink || "/portfolio"}
                data-cursor="view work →"
                data-magnetic="true"
                className="label-track w-full bg-gold px-5 py-3.5 sm:px-6 sm:py-4 !text-[9px] sm:!text-[10px] !text-charcoal transition-all hover:bg-gold/90 min-h-[44px] text-center inline-flex items-center justify-center shadow-md font-bold"
              >
                {content.heroCtaText || "VIEW WORK →"}
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                to={content.heroSecondaryCtaLink || "/contact"}
                data-cursor="contact →"
                data-magnetic="true"
                className="label-track w-full border border-gold/60 px-4 py-3.5 sm:px-5 sm:py-4 !text-[9px] sm:!text-[10px] !text-gold transition-all hover:border-gold hover:bg-gold/10 min-h-[44px] text-center inline-flex items-center justify-center"
              >
                {content.heroSecondaryCtaText || "START A PROJECT →"}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Home() {
  const loaderData = Route.useLoaderData();
  const [activeSkillTab, setActiveSkillTab] = useState(0);
  const [content, setContent] = useState<HomepageContentData>(
    loaderData?.homepageContent || defaultHomepageContent
  );
  const [featuredData, setFeaturedData] = useState<FeaturedProjectsData>(
    loaderData?.featuredProjects || defaultFeaturedProjects
  );
  const [homeProjects, setHomeProjects] = useState<Project[]>(
    loaderData?.projects && loaderData.projects.length > 0 ? loaderData.projects : defaultProjects
  );

  useEffect(() => {
    Promise.all([getProjects(), getHomepageContent(), getFeaturedProjects()])
      .then(([projectsData, hpData, featData]) => {
        if (projectsData && projectsData.length > 0) setHomeProjects(projectsData);
        if (hpData) setContent(hpData);
        if (featData) setFeaturedData(featData);
      })
      .catch(() => {});
  }, []);

  // Filter projects to only published and order them according to featuredSlugs
  const publishedProjects = homeProjects.filter((p) => p.publishStatus !== "DRAFT");
  
  const orderedProjects: Project[] = [];
  // First, add projects in featuredSlugs order
  featuredData.featuredSlugs.forEach((slug) => {
    const found = publishedProjects.find((p) => p.slug === slug);
    if (found && !orderedProjects.some((p) => p.slug === found.slug)) {
      orderedProjects.push(found);
    }
  });
  // Then append any remaining published projects not explicitly listed
  publishedProjects.forEach((p) => {
    if (!orderedProjects.some((op) => op.slug === p.slug)) {
      orderedProjects.push(p);
    }
  });

  const displayProjects = orderedProjects.length > 0 ? orderedProjects : publishedProjects;

  return (
    <>
      <OpeningTitles />
      <Hero content={content} />

      {/* THE FILMMAKER */}
      <section className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-36">
        <div className="grid gap-12 md:grid-cols-12 grid-cols-1">
          <FocusReveal className="md:col-span-4">
            <p className="label-track text-gold">01 — Profile</p>
            <h2 className="title-card mt-5 text-4xl text-ivory md:text-6xl">
              {content.aboutProfileTitle || "The Filmmaker"}
            </h2>
          </FocusReveal>
          <div className="md:col-span-7 md:col-start-6 col-span-1">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-ivory/85 md:text-2xl">
                {content.aboutProfileText}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
                {content.aboutSubText}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <Link
                to={content.aboutCtaLink || "/about"}
                data-cursor="enter →"
                className="label-track mt-10 inline-block !text-gold"
              >
                {content.aboutCtaText || "More about the work →"}
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <FilmmakingStatement
        title={content.statementTitle}
        text={content.statementText}
      />

      {/* SELECTED WORK */}
      <section className="relative border-t border-border bg-charcoal">
        <Stage
          scene="reel"
          className="pointer-events-none absolute left-[-14%] top-[16%] hidden h-[46vh] w-[46vh] opacity-30 lg:block"
        />
        <div className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
          <FocusReveal>
            <p className="label-track text-gold">02 — Chapters</p>
            <h2 className="title-card mt-5 text-5xl text-ivory md:text-8xl">Selected Work</h2>
          </FocusReveal>
          <div className="mt-16">
            {displayProjects.map((p, i) => (
              <ProjectChapter key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY — SEE → FEEL → TELL */}
      <section className="border-t border-border bg-charcoal relative overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-36">
          <FocusReveal>
            <p className="label-track text-gold">03 — Philosophy</p>
            <h2 className="title-card mt-4 text-3xl sm:text-5xl md:text-6xl text-ivory">
              The Director's Tenets
            </h2>
          </FocusReveal>

          <div className="mt-16 md:mt-24 space-y-16 md:space-y-24">
            {(content.philosophySteps || defaultHomepageContent.philosophySteps).map((p, i) => (
              <motion.div
                key={p.word}
                initial={{ opacity: 0, x: 75, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.85, delay: i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="group border-b border-border/70 pb-12 md:pb-20 relative overflow-hidden"
              >
                {/* Minimal Gold Rule that expands on hover */}
                <div className="gold-rule mb-8 opacity-35 group-hover:opacity-100 group-hover:scale-x-105 origin-left transition-all duration-500" />

                <div className="grid gap-6 md:grid-cols-12 md:items-baseline">
                  {/* Step & Large Bold Title Word */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.75, delay: i * 0.16 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="md:col-span-5 flex items-baseline gap-4 sm:gap-6"
                  >
                    <span className="label-track !text-xs sm:!text-sm text-gold/80 font-mono">
                      {p.step}
                    </span>
                    <h3 className="title-card text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-ivory group-hover:text-gold transition-colors duration-500 tracking-tight select-none">
                      {p.word}
                    </h3>
                  </motion.div>

                  {/* Subtitle & Concise Manifesto Description */}
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.75, delay: i * 0.16 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="md:col-span-7 md:col-start-6"
                  >
                    <p className="label-track text-gold/90 mb-3 !tracking-[0.3em]">
                      {p.subtitle}
                    </p>
                    <p className="text-base sm:text-lg md:text-2xl text-ivory/85 leading-relaxed max-w-2xl font-light">
                      {p.text}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS & CRAFT SECTION */}
      <section className="border-t border-border bg-charcoal/50">
        <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-36">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-border/60">
            <div>
              <p className="label-track text-gold">04 — Craft & Capabilities</p>
              <h2 className="title-card mt-4 text-4xl text-ivory md:text-7xl">Skill Set</h2>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex gap-2 p-1 bg-navy/40 border border-border self-start md:self-auto">
              <button
                onClick={() => setActiveSkillTab(0)}
                className={`label-track px-4 py-2 text-xs transition-all ${
                  activeSkillTab === 0
                    ? "bg-gold text-charcoal font-bold shadow-sm"
                    : "text-muted-foreground hover:text-ivory"
                }`}
              >
                FILMMAKING & POST
              </button>
              <button
                onClick={() => setActiveSkillTab(1)}
                className={`label-track px-4 py-2 text-xs transition-all ${
                  activeSkillTab === 1
                    ? "bg-gold text-charcoal font-bold shadow-sm"
                    : "text-muted-foreground hover:text-ivory"
                }`}
              >
                DIGITAL MARKETING
              </button>
            </div>
          </div>

          {/* TAB 1: FILMMAKING */}
          {activeSkillTab === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {skills.map((s, idx) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative border border-border/70 bg-navy/30 p-8 transition-all duration-300 hover:border-gold/60 hover:bg-navy/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="label-track !text-xs text-gold/70">{s.accent}</span>
                      <s.icon
                        size={20}
                        className="text-muted-foreground transition-colors group-hover:text-gold"
                      />
                    </div>
                    <h3 className="title-card mt-6 text-xl text-ivory group-hover:text-gold transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: DIGITAL MARKETING */}
          {activeSkillTab === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {digitalMarketingSkills.map((s, idx) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="group relative border border-border/70 bg-navy/30 p-8 transition-all duration-300 hover:border-gold/60 hover:bg-navy/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="label-track !text-xs text-gold/70">{s.accent}</span>
                      <s.icon
                        size={20}
                        className="text-muted-foreground transition-colors group-hover:text-gold"
                      />
                    </div>
                    <h3 className="title-card mt-6 text-xl text-ivory group-hover:text-gold transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* SOFTWARE MASTERY */}
      <section className="border-t border-border bg-charcoal relative overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-36">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-border/60">
            <div>
              <p className="label-track text-gold">05 — Tools & Tech</p>
              <h2 className="title-card mt-4 text-4xl text-ivory md:text-7xl">Software Mastery</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              Industry-standard software utilized across narrative editing, visual effects, precision grading, camera tracking and pre-visualization.
            </p>
          </div>

          <div className="mt-14 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {software.map((sw, idx) => (
              <motion.div
                key={sw.name}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative border border-border/70 bg-navy/30 p-6 sm:p-7 transition-all duration-400 hover:border-gold/70 hover:bg-navy/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] md:hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    {/* Large, Prominent Original Software Logo Frame */}
                    <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 flex items-center justify-center rounded bg-charcoal/95 p-3.5 border border-border/80 transition-all duration-300 group-hover:border-gold group-hover:shadow-[0_0_28px_rgba(201,164,76,0.3)]">
                      <img
                        src={sw.logo}
                        alt={`${sw.name} original software logo`}
                        loading="lazy"
                        decoding="async"
                        width={96}
                        height={96}
                        className="h-full w-full object-contain filter transition-all duration-300 group-hover:scale-108"
                      />
                    </div>
                    
                    <span className="label-track !text-[9px] text-gold/90 px-2.5 py-1 border border-border/70 bg-charcoal/60 rounded-xs transition-colors group-hover:border-gold/60 group-hover:text-gold text-right">
                      {sw.use}
                    </span>
                  </div>

                  <h3 className="title-card mt-6 text-xl text-ivory group-hover:text-gold transition-colors">
                    {sw.name}
                  </h3>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                    {sw.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-[9px] font-mono text-muted-foreground group-hover:text-gold/80 transition-colors">
                  <span className="label-track !text-[8px] text-slate">PROFICIENCY</span>
                  <span className="text-gold">PRODUCTION READY ✦</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
