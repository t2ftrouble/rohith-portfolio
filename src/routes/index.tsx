import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
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
import { projects } from "@/data/projects";
import { OpeningTitles } from "@/components/OpeningTitles";
import { ProjectChapter } from "@/components/ProjectChapter";
import { Reveal } from "@/components/Reveal";
import { Stage } from "@/components/three/Stage";

import premiereProLogo from "@/assets/logo/premier pro.webp";
import afterEffectsLogo from "@/assets/logo/after effect.webp";
import photoshopLogo from "@/assets/logo/photoshop.webp";
import illustratorLogo from "@/assets/logo/illustrator.webp";
import davinciLogo from "@/assets/logo/davinci.webp";
import mayaLogo from "@/assets/logo/maya.webp";
import nukeLogo from "@/assets/logo/nuke.webp";
import pftrackLogo from "@/assets/logo/pf track.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rohith V | Filmmaker | Writer | Editor | VFX/CG Artist" },
      {
        name: "description",
        content:
          "Rohith V is a Visual Communication student and Filmmaker, Writer, Editor and VFX/CG Artist based in Chennai. Selected work includes One Last Day, Toothpaste, Kadalar and Radhal.",
      },
      {
        property: "og:title",
        content: "Rohith V | Filmmaker | Writer | Editor | VFX/CG Artist",
      },
      {
        property: "og:description",
        content:
          "A cinematic world of frames, story and cuts — selected work by Rohith V, filmmaker based in Chennai.",
      },
    ],
  }),
  component: Home,
});

const philosophy = [
  {
    word: "SEE",
    text: "Every frame begins with how we see — composition, light, movement and visual detail.",
    icon: Eye as LucideIcon,
  },
  {
    word: "FEEL",
    text: "A story should make you feel before it makes you think — emotion, atmosphere and performance give the image its meaning.",
    icon: Heart as LucideIcon,
  },
  {
    word: "TELL",
    text: "Every cut has something to say — story, rhythm and editing turn individual moments into a film.",
    icon: MessageSquare as LucideIcon,
  },
];

const skills = [
  {
    title: "Direction",
    items: [
      "Assistant Direction",
      "Direction",
      "Story Development",
      "Shot Planning",
      "Scene Composition",
    ],
  },
  {
    title: "Writing",
    items: ["Script", "Screenplay", "Story Development", "Narrative Planning"],
  },
  {
    title: "Post-Production",
    items: [
      "Film Editing",
      "Video Editing",
      "VFX",
      "CG",
      "Compositing",
      "Color Correction / Grading",
    ],
  },
  {
    title: "Digital Media",
    items: [
      "Digital Marketing",
      "Content Strategy",
      "Social Media",
      "Digital Branding",
      "Personal Branding",
    ],
  },
];

const tools = [
  {
    name: "Premiere Pro",
    use: "Video Editing",
    desc: "Used for editing short films, reels and narrative projects.",
    logo: premiereProLogo,
  },
  {
    name: "After Effects",
    use: "Motion & VFX",
    desc: "Used for compositing, motion graphics and visual effects.",
    logo: afterEffectsLogo,
  },
  {
    name: "Photoshop",
    use: "Image & Design",
    desc: "Used for posters, thumbnails, image manipulation and visual development.",
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

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "5%" : "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, isMobile ? 1.08 : 1.16]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "15%" : "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex flex-col min-h-[100svh] items-center justify-center overflow-hidden md:justify-end md:pb-[15vh]"
    >
      <motion.img
        src={heroImage}
        alt="Rain-lit Chennai street at night — cinematic backdrop"
        width={1600}
        height={1008}
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/70" />
      <div className="vignette" />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative mx-auto w-full max-w-[1400px] px-4 pb-20 md:px-12 md:pb-28 text-center md:text-left md:w-[85%] md:ml-[12%]"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.2 }}
          className="label-track text-gold"
        >
          A film by
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="title-card mt-4 text-[clamp(2.5rem,12vw,9.2rem)] leading-[0.9] text-ivory"
        >
          Rohith V
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.2 }}
          className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="text-center md:text-left">
            <p className="label-track !text-[clamp(0.75rem,2vw,0.875rem)] !tracking-[0.5em] text-ivory">
              Filmmaker
            </p>
            <p className="label-track mt-4 !text-[clamp(0.6rem,1.8vw,0.625rem)] text-gold">
              Writer • Editor • VFX / CG Artist
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row w-full md:w-auto">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/portfolio"
                data-cursor="enter →"
                className="label-track bg-gold px-6 py-4 !text-[10px] !text-charcoal transition-colors hover:bg-gold/90 min-h-[44px] text-center"
              >
                VIEW MY WORK →
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                data-cursor="enter →"
                className="label-track border border-gold/60 px-4 py-4 !text-[10px] !text-gold transition-colors hover:border-gold min-h-[44px] text-center"
              >
                START A PROJECT →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Home() {
  const [activeSkillTab, setActiveSkillTab] = useState(0);

  return (
    <>
      <OpeningTitles />
      <Hero />

      {/* THE FILMMAKER */}
      <section className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-36">
        <div className="grid gap-12 md:grid-cols-12 grid-cols-1">
          <Reveal className="md:col-span-4">
            <p className="label-track text-gold">01 — Profile</p>
            <h2 className="title-card mt-5 text-4xl text-ivory md:text-6xl">
              The
              <br />
              Filmmaker
            </h2>
          </Reveal>
          <div className="md:col-span-7 md:col-start-6 col-span-1">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-ivory/85 md:text-2xl">
                Visual Communication student and emerging Assistant Director, Writer, Editor and
                VFX/CG Artist with hands-on experience in filmmaking, screenplay development,
                editing and post-production.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
                My experience includes assisting in script and screenplay development for RADHAL,
                working as a CG Artist for KADALAR, and directing and editing independent short
                films.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <Link
                to="/about"
                data-cursor="enter →"
                className="label-track mt-10 inline-block !text-gold"
              >
                More about the work →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="relative border-t border-border bg-charcoal">
        <Stage
          scene="reel"
          className="pointer-events-none absolute left-[-14%] top-[16%] hidden h-[46vh] w-[46vh] opacity-30 lg:block"
        />
        <div className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
          <Reveal>
            <p className="label-track text-gold">02 — Chapters</p>
            <h2 className="title-card mt-5 text-5xl text-ivory md:text-8xl">Selected Work</h2>
          </Reveal>
          <div className="mt-16">
            {projects.map((p, i) => (
              <ProjectChapter key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-4 py-24 md:px-12 md:py-36">
          <Reveal>
            <p className="label-track text-gold">03 — Philosophy</p>
          </Reveal>
          <div className="mt-14 space-y-7 md:space-y-24">
            {philosophy.map((p, i) => (
              <motion.div
                key={p.word}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileTap={{ scale: 0.99 }}
                className="group relative border-b border-border pb-7 md:pb-16"
              >
                <div className="flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-6 md:items-center">
                  <div className="md:col-span-7 flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <p.icon className="h-8 w-8 text-gold opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity" />
                      </motion.div>
                      <h3 className="title-card text-[clamp(3rem,13vw,5rem)] leading-[0.85] text-ivory md:text-[9vw]">
                        {p.word}
                      </h3>
                    </div>
                    <p className="text-[15px] leading-[1.5] text-muted-foreground md:hidden opacity-80 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                      {p.text}
                    </p>
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-gold group-hover:w-full group-active:w-full transition-all duration-500" />
                  </div>
                  <div className="md:col-span-4 md:col-start-9 hidden md:block">
                    <p className="text-lg text-muted-foreground opacity-80 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                      {p.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t border-border bg-navy/30">
        <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
          <Reveal>
            <p className="label-track text-gold">04 — Services</p>
            <h2 className="title-card mt-5 text-4xl text-ivory md:text-6xl">What I Do</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                num: "01",
                title: "FILMMAKING",
                description: "Direction, story development, shot planning and scene composition.",
                icon: Film,
              },
              {
                num: "02",
                title: "WRITING",
                description: "Script, screenplay, story development and narrative planning.",
                icon: PenTool,
              },
              {
                num: "03",
                title: "EDITING",
                description: "Film and video editing, color correction and grading.",
                icon: Scissors,
              },
              {
                num: "04",
                title: "VFX / CG",
                description: "Visual effects, CG, compositing and camera tracking.",
                icon: Edit,
              },
              {
                num: "05",
                title: "CONTENT",
                description: "Content creation, social media and digital content strategy.",
                icon: Users,
              },
              {
                num: "06",
                title: "DIGITAL MARKETING",
                description: "Content strategy, social media, Meta Ads and Google Ads.",
                icon: BarChart3,
              },
            ].map((service, i) => (
              <Reveal key={service.num} delay={i * 0.06}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -4, borderColor: "rgba(201, 164, 76, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-border p-6 h-full flex flex-col transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <p className="title-card text-2xl text-gold/40">{service.num}</p>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <service.icon className="h-8 w-8 text-gold" />
                    </motion.div>
                  </div>
                  <h3 className="title-card mt-4 text-lg text-ivory md:text-xl">{service.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground md:text-base flex-1">
                    {service.description}
                  </p>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ x: 2 }}
                    className="mt-4 pt-4 border-t border-border/50"
                  >
                    <ArrowRight className="h-4 w-4 text-gold" />
                  </motion.div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
          <Reveal>
            <p className="label-track text-gold">05 — Craft</p>
            <h2 className="title-card mt-5 text-4xl text-ivory md:text-6xl">Skills</h2>
          </Reveal>
          <div className="mt-14">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-4 w-full">
              {skills.map((group, i) => (
                <motion.button
                  key={group.title}
                  onClick={() => setActiveSkillTab(i)}
                  data-cursor="text"
                  whileTap={{ scale: 0.97 }}
                  className={`label-track px-4 py-2 !text-[10px] transition-colors flex-shrink-0 ${
                    activeSkillTab === i
                      ? "text-gold border-b border-gold"
                      : "text-muted-foreground hover:text-ivory"
                  }`}
                >
                  {group.title}
                </motion.button>
              ))}
            </div>
            {/* Tab Content */}
            <motion.div
              key={activeSkillTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8"
            >
              <h3 className="title-card text-2xl text-ivory md:text-3xl">
                {skills[activeSkillTab]?.title}
              </h3>
              <ul className="mt-6 grid gap-3 grid-cols-1 md:grid-cols-2">
                {skills[activeSkillTab]?.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-base text-ivory/80 md:text-lg"
                  >
                    <div className="h-1 w-1 bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
          <Reveal>
            <p className="label-track text-gold">06 — Toolkit</p>
            <h2 className="title-card mt-5 text-4xl text-ivory md:text-6xl">Tools I Use</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool, i) => (
              <Reveal key={tool.name} delay={i * 0.06}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -4, borderColor: "rgba(201, 164, 76, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-border p-6 h-full flex flex-col transition-colors"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4 flex items-center justify-center h-16 md:h-20"
                  >
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="h-14 w-14 md:h-[72px] md:w-[72px] object-contain"
                    />
                  </motion.div>
                  <h3 className="title-card text-lg text-ivory md:text-xl">{tool.name}</h3>
                  <p className="label-track mt-2 !text-[8px] text-gold">{tool.use}</p>
                  <p className="mt-3 text-sm text-muted-foreground md:text-base flex-1">
                    {tool.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
          <Reveal>
            <p className="label-track text-gold">06 — Education</p>
          </Reveal>
          <div className="mt-10 grid gap-8 grid-cols-1 md:grid-cols-2">
            <Reveal>
              <div className="border-l border-gold/40 pl-6">
                <h3 className="title-card text-xl text-ivory md:text-2xl">
                  B.Sc. Visual Communication
                </h3>
                <p className="label-track mt-3">VISTAS</p>
                <p className="label-track mt-1 !tracking-[0.3em] text-gold">2024 – 2027</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="border-l border-gold/40 pl-6">
                <h3 className="title-card text-xl text-ivory md:text-2xl">
                  Diploma in Visual Effects
                </h3>
                <p className="label-track mt-3">
                  Anipix Animation Academy — Academic Partner, Vels University
                </p>
                <p className="label-track mt-1 !tracking-[0.3em] text-gold">2022 – 2025</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SELECTED CREDITS */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
          <Reveal>
            <p className="label-track text-gold">07 — Selected Credits</p>
          </Reveal>
          <div className="mt-10 space-y-6">
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-baseline md:justify-between">
                <h3 className="title-card text-xl text-ivory md:text-2xl">ONE LAST DAY</h3>
                <p className="label-track text-gold">Story / Screenplay / Director / Editor / DI</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-baseline md:justify-between">
                <h3 className="title-card text-xl text-ivory md:text-2xl">TOOTHPASTE</h3>
                <p className="label-track text-gold">Story / Direction / Editing</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-baseline md:justify-between">
                <h3 className="title-card text-xl text-ivory md:text-2xl">KADALAR</h3>
                <p className="label-track text-gold">CG Artist</p>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-baseline md:justify-between">
                <h3 className="title-card text-xl text-ivory md:text-2xl">RADHAL</h3>
                <p className="label-track text-gold">Assistant Writer / Script & Screenplay</p>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-baseline md:justify-between">
                <h3 className="title-card text-xl text-ivory md:text-2xl">RADHAL</h3>
                <p className="label-track text-gold">Assistant Writer / Script & Screenplay</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-12 md:py-40">
          <Reveal>
            <p className="label-track text-gold">08 — Contact</p>
            <h2 className="title-card mt-5 text-[clamp(2rem,10vw,6rem)] leading-[0.9] text-ivory">
              Let&apos;s Create Something.
            </h2>
            <div className="mt-12">
              <Link
                to="/contact"
                data-cursor="enter →"
                className="label-track bg-gold px-8 py-5 !text-[10px] !text-charcoal transition-colors hover:bg-gold/90 min-h-[44px]"
              >
                START A PROJECT →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
