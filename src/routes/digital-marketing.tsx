import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import {
  Video,
  PenTool,
  Scissors,
  Image as ImageIcon,
  BarChart3,
  Target,
  Globe,
  Camera,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Users,
  Play,
  CheckCircle,
  Smartphone,
  Megaphone,
  Sparkles,
  Zap,
  ChevronDown,
  FileText,
  Layers,
  Shield,
  Crown,
  MapPin,
  Search,
  ClipboardList,
  Upload,
  Eye,
  Building2,
  Phone,
} from "lucide-react";

import { Reveal } from "@/components/Reveal";
import heroImage from "@/assets/hero-street.webp";
import projectOneLastDay from "@/assets/project-one-last-day.webp";
import projectToothpaste from "@/assets/project-toothpaste.webp";
import projectKadalar from "@/assets/project-kadalar.webp";
import projectRadhal from "@/assets/project-radhal.webp";

export const Route = createFileRoute("/digital-marketing")({
  head: () => ({
    meta: [
      { title: "Digital Marketing — Rohith V | Content & Strategy" },
      {
        name: "description",
        content:
          "Digital marketing services by Rohith V — content creation, social media strategy, Meta Ads, Google Ads for businesses in Chennai and worldwide.",
      },
      {
        property: "og:title",
        content: "Digital Marketing — Rohith V | Content & Strategy",
      },
      {
        property: "og:description",
        content:
          "Content that gets noticed. Strategy that builds trust. Marketing that moves your business forward.",
      },
    ],
  }),
  component: DigitalMarketing,
});

function DigitalMarketing() {
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section className="relative">
      <div className="relative mx-auto max-w-[1600px] px-6 pb-24 pt-36 md:px-12 md:pb-36 md:pt-48">
        {/* HERO */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="label-track text-gold">Digital Marketing</p>
            <h1 className="title-card mt-5 text-[13vw] leading-[0.85] text-ivory md:text-[6vw]">
              YOUR BRAND IS A STORY.
            </h1>
            <h2 className="title-card mt-4 text-[10vw] leading-[0.9] text-gold md:text-[4.5vw]">
              I HELP PEOPLE NOTICE IT.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg">
              Content that gets noticed. Strategy that builds trust. Marketing that moves your
              business forward.
            </p>
            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <Link
                to="/contact"
                data-cursor="enter →"
                className="label-track bg-gold px-8 py-4 !text-[10px] !text-charcoal transition-colors hover:bg-gold/90 min-h-[44px]"
              >
                START A PROJECT →
              </Link>
              <a
                href="#how-i-work"
                data-cursor="enter ↓"
                className="label-track border border-gold/60 px-8 py-4 !text-[10px] !text-gold transition-colors hover:border-gold min-h-[44px]"
              >
                SEE HOW I WORK ↓
              </a>
            </div>
          </Reveal>

          {/* Hero Visual - CREATE → PUBLISH → PROMOTE */}
          <Reveal delay={0.15} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square md:aspect-[4/3] bg-navy/30 border border-border/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-navy/50 to-charcoal/80" />

              {/* Create Frame */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute top-[15%] left-[10%] w-[35%] aspect-[9/16] bg-charcoal border-2 border-gold/30 p-3 shadow-2xl"
              >
                <div className="h-full w-full bg-navy/50 flex items-center justify-center">
                  <PenTool className="h-8 w-8 text-gold" />
                </div>
                <p className="label-track mt-2 text-center !text-[8px] text-gold">CREATE</p>
              </motion.div>

              {/* Publish Frame */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute top-[30%] right-[15%] w-[40%] aspect-square bg-charcoal border-2 border-gold/30 p-3 shadow-2xl"
              >
                <div className="h-full w-full bg-navy/50 flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-gold" />
                </div>
                <p className="label-track mt-2 text-center !text-[8px] text-gold">PUBLISH</p>
              </motion.div>

              {/* Promote Frame */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-[15%] left-[20%] w-[50%] aspect-video bg-charcoal border-2 border-gold/30 p-3 shadow-2xl"
              >
                <div className="h-full w-full bg-navy/50 flex items-center justify-center">
                  <Megaphone className="h-8 w-8 text-gold" />
                </div>
                <p className="label-track mt-2 text-center !text-[8px] text-gold">PROMOTE</p>
              </motion.div>

              {/* Connector Arrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
              >
                <ArrowRight className="h-12 w-12 text-gold/40" />
              </motion.div>
            </motion.div>
          </Reveal>
        </div>

        {/* SERVICES - 8 EQUAL CARDS */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">SERVICES</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "CONTENT PRODUCTION",
                desc: "Professional videos, reels and promotional content.",
                icon: Video,
              },
              {
                num: "02",
                title: "SOCIAL MEDIA CONTENT",
                desc: "Organic content and platform-specific creative.",
                icon: Users,
              },
              {
                num: "03",
                title: "SCRIPT & CREATIVE",
                desc: "Scripts, concepts and content ideas.",
                icon: PenTool,
              },
              {
                num: "04",
                title: "VIDEO EDITING",
                desc: "Personal branding, political videos, YouTube and social content.",
                icon: Scissors,
              },
              {
                num: "05",
                title: "GRAPHIC DESIGN",
                desc: "Posters and social creatives.",
                icon: ImageIcon,
              },
              { num: "06", title: "META ADS", desc: "Paid social campaigns.", icon: Target },
              {
                num: "07",
                title: "GOOGLE ADS",
                desc: "Search and digital advertising.",
                icon: TrendingUp,
              },
              {
                num: "08",
                title: "ANALYTICS & OPTIMIZATION",
                desc: "Understanding performance and improving future campaigns.",
                icon: BarChart3,
              },
            ].map((service, i) => (
              <Reveal key={service.num} delay={i * 0.05}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, borderColor: "rgba(201, 164, 76, 0.6)" }}
                  className="border border-border p-6 h-full flex flex-col transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <p className="title-card text-2xl text-gold/40">{service.num}</p>
                    <service.icon className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="title-card mt-4 text-lg text-ivory md:text-xl">{service.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground md:text-base flex-1">
                    {service.desc}
                  </p>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="mt-4 pt-4 border-t border-border/50"
                  >
                    <ArrowRight className="h-4 w-4 text-gold" />
                  </motion.div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* WHY ROHITH - 4 EQUAL PANELS */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">WHY ROHITH?</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <h2 className="title-card text-3xl text-ivory md:text-5xl">
              I DON'T JUST MANAGE CONTENT.
              <br />I UNDERSTAND HOW IT IS MADE.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "STORY",
                desc: "I understand what your business needs to say.",
                icon: Lightbulb,
              },
              { num: "02", title: "CREATE", desc: "Script → Shoot → Edit → Design", icon: Camera },
              {
                num: "03",
                title: "PROMOTE",
                desc: "Organic content + Meta Ads + Google Ads",
                icon: Megaphone,
              },
              {
                num: "04",
                title: "BUSINESS-FIRST",
                desc: "Content follows your audience and business goal.",
                icon: Target,
              },
            ].map((item, i) => (
              <Reveal key={item.num} delay={i * 0.08}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, borderColor: "rgba(201, 164, 76, 0.4)" }}
                  className="border border-border p-6 h-full flex flex-col transition-colors"
                >
                  <p className="title-card text-3xl text-gold/30">{item.num}</p>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4"
                  >
                    <item.icon className="h-10 w-10 text-gold" />
                  </motion.div>
                  <h3 className="title-card mt-4 text-xl text-ivory md:text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground md:text-base flex-1">
                    {item.desc}
                  </p>
                  <div className="mt-4 h-px w-0 bg-gold/40 group-hover:w-full transition-all duration-300" />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* WHAT I CREATE - REAL WORK STRIP */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">WHAT I CREATE</p>
          </Reveal>
          <div className="mt-12 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
            <div className="flex gap-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-6 min-w-max md:min-w-0">
              {[
                { title: "ONE LAST DAY", category: "Short Film", image: projectOneLastDay },
                { title: "TOOTHPASTE", category: "Short Film", image: projectToothpaste },
                { title: "KADALAR", category: "VFX / CG", image: projectKadalar },
                { title: "RADHAL", category: "Pilot Film", image: projectRadhal },
                { title: "REELS", category: "Social Content", image: heroImage },
                { title: "POSTERS", category: "Graphic Design", image: heroImage },
              ].map((work, i) => (
                <Reveal key={work.title} delay={i * 0.08}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-[3/4] w-48 md:w-full overflow-hidden border border-border group cursor-pointer"
                  >
                    <img
                      src={work.image}
                      alt={work.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="label-track !text-[8px] text-gold">{work.category}</p>
                      <p className="title-card text-sm text-ivory mt-1">{work.title}</p>
                      <div className="mt-2 flex items-center gap-2 text-gold">
                        <Play className="h-4 w-4" />
                        <span className="label-track !text-[8px]">VIEW</span>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* THE JOURNEY - LARGE VISUAL TIMELINE */}
        <div className="mt-24 border-t border-border pt-16" ref={sectionRef}>
          <Reveal>
            <p className="label-track text-gold">THE JOURNEY</p>
          </Reveal>
          <div className="mt-12">
            {/* Desktop Horizontal Timeline */}
            <div className="hidden md:block relative">
              <div className="absolute top-12 left-0 right-0 h-px bg-border/30" />
              <div className="flex justify-between relative">
                {[
                  { num: "01", title: "YOUR BUSINESS", desc: "Starting point", icon: Building2 },
                  { num: "02", title: "IDEA", desc: "Concept development", icon: Lightbulb },
                  { num: "03", title: "SCRIPT", desc: "Story structure", icon: FileText },
                  { num: "04", title: "SHOOT", desc: "Production", icon: Camera },
                  { num: "05", title: "EDIT", desc: "Post-production", icon: Scissors },
                  { num: "06", title: "PUBLISH", desc: "Go live", icon: Upload },
                  { num: "07", title: "PROMOTE", desc: "Amplify reach", icon: Megaphone },
                  { num: "08", title: "AUDIENCE", desc: "Connect & grow", icon: Users },
                ].map((node, i) => (
                  <Reveal key={node.num} delay={i * 0.06}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      whileHover={{ scale: 1.1 }}
                      className="relative group cursor-pointer"
                      onViewportEnter={() => setActiveJourneyIndex(i)}
                    >
                      <div
                        className={`w-24 h-24 border-2 flex items-center justify-center relative z-10 transition-colors ${
                          activeJourneyIndex === i
                            ? "border-gold bg-gold/10"
                            : "border-border bg-charcoal"
                        }`}
                      >
                        <node.icon
                          className={`h-8 w-8 transition-colors ${
                            activeJourneyIndex === i ? "text-gold" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <p className="title-card mt-4 text-xs text-center text-gold/50">{node.num}</p>
                      <p className="title-card text-sm text-center text-ivory mt-1">{node.title}</p>
                      <p className="text-xs text-center text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {node.desc}
                      </p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="md:hidden space-y-6">
              {[
                { num: "01", title: "YOUR BUSINESS", desc: "Starting point", icon: Building2 },
                { num: "02", title: "IDEA", desc: "Concept development", icon: Lightbulb },
                { num: "03", title: "SCRIPT", desc: "Story structure", icon: FileText },
                { num: "04", title: "SHOOT", desc: "Production", icon: Camera },
                { num: "05", title: "EDIT", desc: "Post-production", icon: Scissors },
                { num: "06", title: "PUBLISH", desc: "Go live", icon: Upload },
                { num: "07", title: "PROMOTE", desc: "Amplify reach", icon: Megaphone },
                { num: "08", title: "AUDIENCE", desc: "Connect & grow", icon: Users },
              ].map((node, i) => (
                <Reveal key={node.num} delay={i * 0.06}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-16 h-16 border-2 border-border bg-charcoal flex items-center justify-center flex-shrink-0">
                      <node.icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="label-track !text-[8px] text-gold">{node.num}</p>
                      <p className="title-card text-lg text-ivory mt-1">{node.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{node.desc}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* HOW I WORK - 7 EQUAL CARDS */}
        <div className="mt-24 border-t border-border pt-16" id="how-i-work">
          <Reveal>
            <p className="label-track text-gold">HOW I WORK</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:max-w-5xl lg:mx-auto">
            {[
              {
                num: "01",
                title: "UNDERSTAND",
                items: ["Business", "Audience", "Goals"],
                icon: Search,
              },
              {
                num: "02",
                title: "PLAN",
                items: ["Content", "Creative Direction", "Strategy"],
                icon: ClipboardList,
              },
              {
                num: "03",
                title: "CREATE",
                items: ["Script", "Shoot", "Edit", "Design"],
                icon: Sparkles,
              },
              {
                num: "04",
                title: "PUBLISH",
                items: ["Instagram", "YouTube", "Social Platforms"],
                icon: Upload,
              },
              { num: "05", title: "PROMOTE", items: ["Meta Ads", "Google Ads"], icon: Megaphone },
              {
                num: "06",
                title: "LEARN",
                items: ["Performance", "Audience Response"],
                icon: BarChart3,
              },
              {
                num: "07",
                title: "IMPROVE",
                items: ["Better Content", "Better Targeting", "Better Campaign"],
                icon: Zap,
              },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 0.06}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, borderColor: "rgba(201, 164, 76, 0.4)" }}
                  className={`border border-border p-6 h-full flex flex-col transition-colors ${
                    i >= 4 ? "lg:col-start-2" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="title-card text-2xl text-gold/40">{step.num}</p>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <step.icon className="h-8 w-8 text-gold" />
                    </motion.div>
                  </div>
                  <h3 className="title-card mt-4 text-lg text-ivory md:text-xl">{step.title}</h3>
                  <ul className="mt-3 space-y-2 flex-1">
                    {step.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground md:text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="mt-4 pt-4 border-t border-border/50"
                  >
                    <ArrowRight className="h-4 w-4 text-gold" />
                  </motion.div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CHENNAI */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">FOR CHENNAI BUSINESSES</p>
          </Reveal>
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center">
            <Reveal delay={0.1}>
              <div className="aspect-video bg-navy/30 border border-border/50 relative overflow-hidden">
                <img
                  src={heroImage}
                  alt="Chennai cityscape"
                  className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <MapPin className="h-5 w-5 text-gold mb-2" />
                  <p className="label-track !text-[8px] text-gold">CHENNAI, INDIA</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <h2 className="title-card text-3xl text-ivory md:text-4xl">
                I CAN COME TO YOUR BUSINESS,
                <br />
                UNDERSTAND THE BRAND,
                <br />
                AND CREATE THE CONTENT.
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { title: "BUSINESS VIDEO SHOOTS", icon: Video },
                  { title: "PRODUCT VIDEOS", icon: Camera },
                  { title: "INSTAGRAM REELS", icon: Smartphone },
                  { title: "PROMOTIONAL VIDEOS", icon: Megaphone },
                  { title: "FOUNDER / PERSONAL BRANDING", icon: Crown },
                  { title: "SOCIAL MEDIA CONTENT", icon: Users },
                ].map((service, i) => (
                  <Reveal key={service.title} delay={i * 0.05}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      whileHover={{ y: -2, borderColor: "rgba(201, 164, 76, 0.4)" }}
                      className="border border-border p-4 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <service.icon className="h-5 w-5 text-gold flex-shrink-0" />
                      <p className="text-sm text-ivory/80 md:text-base">{service.title}</p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
              <Link
                to="/contact"
                data-cursor="enter →"
                className="label-track mt-8 inline-flex items-center gap-2 bg-gold px-8 py-4 !text-[10px] !text-charcoal transition-colors hover:bg-gold/90 min-h-[44px]"
              >
                BOOK A CONTENT SHOOT →
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* WORLDWIDE */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">FOR BUSINESSES WORLDWIDE</p>
          </Reveal>
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center">
            <Reveal delay={0.15} className="order-2 md:order-1">
              <h2 className="title-card text-3xl text-ivory md:text-4xl">
                REMOTE DIGITAL SERVICES
                <br />
                BUILT AROUND YOUR BUSINESS GOALS.
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { title: "META ADS", icon: Target },
                  { title: "GOOGLE ADS", icon: TrendingUp },
                  { title: "CONTENT STRATEGY", icon: FileText },
                  { title: "SOCIAL STRATEGY", icon: Users },
                  { title: "DIGITAL CAMPAIGN STRATEGY", icon: Sparkles },
                  { title: "PERFORMANCE ANALYSIS", icon: BarChart3 },
                ].map((service, i) => (
                  <Reveal key={service.title} delay={i * 0.05}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      whileHover={{ y: -2, borderColor: "rgba(201, 164, 76, 0.4)" }}
                      className="border border-border p-4 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <service.icon className="h-5 w-5 text-gold flex-shrink-0" />
                      <p className="text-sm text-ivory/80 md:text-base">{service.title}</p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
              <Link
                to="/contact"
                data-cursor="enter →"
                className="label-track mt-8 inline-flex items-center gap-2 border border-gold/60 px-8 py-4 !text-[10px] !text-gold transition-colors hover:border-gold min-h-[44px]"
              >
                GROW MY BUSINESS →
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal delay={0.1} className="order-1 md:order-2">
              <div className="aspect-video bg-navy/30 border border-border/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-navy/50 to-charcoal/80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="h-24 w-24 text-gold/30" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Globe className="h-5 w-5 text-gold mb-2" />
                  <p className="label-track !text-[8px] text-gold">WORLDWIDE REMOTE</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* BEFORE → WITH A SYSTEM → GOAL - MAJOR TRANSFORMATION */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">TRANSFORMATION</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "BEFORE",
                subtitle: "CHAOS",
                items: ["Random posting", "Weak visuals", "No clear direction", "No strategy"],
                accent: false,
              },
              {
                title: "WITH A SYSTEM",
                subtitle: "CLARITY",
                items: [
                  "Clear story",
                  "Consistent content",
                  "Strong visual identity",
                  "Strategic promotion",
                ],
                accent: true,
              },
              {
                title: "GOAL",
                subtitle: "REMEMBERED",
                items: ["A BRAND PEOPLE REMEMBER"],
                accent: true,
                goal: true,
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 0.1}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`border p-8 h-full flex flex-col ${
                    card.goal
                      ? "border-gold bg-gold/10"
                      : card.accent
                        ? "border-gold/40 bg-navy/30"
                        : "border-border bg-charcoal/50"
                  }`}
                >
                  <p className="label-track !text-[8px] text-muted-foreground">{card.subtitle}</p>
                  <h3
                    className={`title-card mt-2 text-2xl md:text-3xl ${
                      card.goal ? "text-gold" : card.accent ? "text-ivory" : "text-muted-foreground"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <ul className="mt-6 space-y-3 flex-1">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm md:text-base">
                        {card.accent && !card.goal && (
                          <CheckCircle className="mt-0.5 h-4 w-4 text-gold flex-shrink-0" />
                        )}
                        {card.goal && <Crown className="mt-0.5 h-4 w-4 text-gold flex-shrink-0" />}
                        {!card.accent && (
                          <span className="mt-1 h-1 w-1 bg-border/50 flex-shrink-0" />
                        )}
                        <span
                          className={
                            card.goal
                              ? "text-ivory font-medium"
                              : card.accent
                                ? "text-ivory/80"
                                : "text-muted-foreground"
                          }
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {i < 2 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                      <ArrowRight className="h-8 w-8 text-gold/30" />
                    </div>
                  )}
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CONTENT → BUSINESS GROWTH FUNNEL */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">HOW CONTENT HELPS</p>
          </Reveal>
          <div className="mt-12">
            {/* Desktop Horizontal Funnel */}
            <div className="hidden md:flex items-center justify-between gap-4">
              {[
                { title: "CONTENT", icon: Video, desc: "Create value" },
                { title: "ATTENTION", icon: Eye, desc: "Get noticed" },
                { title: "TRUST", icon: Shield, desc: "Build credibility" },
                { title: "ACTION", icon: Zap, desc: "Drive engagement" },
                { title: "BUSINESS", icon: TrendingUp, desc: "Grow revenue" },
              ].map((stage, i) => (
                <Reveal key={stage.title} delay={i * 0.08}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="flex-1 border border-border p-6 text-center"
                  >
                    <stage.icon className="h-8 w-8 text-gold mx-auto" />
                    <p className="title-card mt-3 text-lg text-ivory">{stage.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stage.desc}</p>
                    {i < 4 && (
                      <ChevronDown className="h-4 w-4 text-gold/30 mx-auto mt-4 md:hidden" />
                    )}
                  </motion.div>
                </Reveal>
              ))}
            </div>

            {/* Mobile Vertical Funnel */}
            <div className="md:hidden space-y-4">
              {[
                { title: "CONTENT", icon: Video, desc: "Create value" },
                { title: "ATTENTION", icon: Eye, desc: "Get noticed" },
                { title: "TRUST", icon: Shield, desc: "Build credibility" },
                { title: "ACTION", icon: Zap, desc: "Drive engagement" },
                { title: "BUSINESS", icon: TrendingUp, desc: "Grow revenue" },
              ].map((stage, i) => (
                <Reveal key={stage.title} delay={i * 0.08}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="border border-border p-6 flex items-center gap-4"
                  >
                    <stage.icon className="h-8 w-8 text-gold flex-shrink-0" />
                    <div className="flex-1">
                      <p className="title-card text-lg text-ivory">{stage.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stage.desc}</p>
                    </div>
                    {i < 4 && <ChevronDown className="h-4 w-4 text-gold/30" />}
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* CREATIVE PARTNERSHIPS - 3 EQUAL PREMIUM CARDS */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">CREATIVE PARTNERSHIPS</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "CONTENT",
                forLabel: "I need content.",
                includes: ["Content Creation", "Video Editing", "Creative Direction"],
                highlight: false,
              },
              {
                title: "CONTENT + SOCIAL",
                forLabel: "I need consistency.",
                includes: ["Content", "Social Media", "Creative Strategy"],
                highlight: true,
              },
              {
                title: "CONTENT + ADS",
                forLabel: "I need growth.",
                includes: ["Content", "Meta Ads", "Google Ads"],
                highlight: false,
              },
            ].map((plan, i) => (
              <Reveal key={plan.title} delay={i * 0.1}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6 }}
                  className={`border p-8 h-full flex flex-col transition-colors ${
                    plan.highlight ? "border-gold bg-gold/10" : "border-border hover:border-gold/40"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    <Layers
                      className={`h-12 w-12 ${plan.highlight ? "text-gold" : "text-muted-foreground"}`}
                    />
                  </motion.div>
                  <h3
                    className={`title-card text-2xl md:text-3xl ${
                      plan.highlight ? "text-gold" : "text-ivory"
                    }`}
                  >
                    {plan.title}
                  </h3>
                  <p className="label-track mt-3 !text-[8px] text-muted-foreground">
                    {plan.forLabel}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{plan.includes[0]}</p>
                  <div className="mt-4 space-y-2 flex-1">
                    {plan.includes.slice(1).map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-ivory/80">
                        <div className="h-px w-3 bg-gold/40" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="mt-6 pt-4 border-t border-border/50"
                  >
                    <ArrowRight
                      className={`h-5 w-5 ${plan.highlight ? "text-gold" : "text-muted-foreground"}`}
                    />
                  </motion.div>
                </motion.div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.4} className="mt-12 text-center">
            <Link
              to="/contact"
              data-cursor="enter →"
              className="label-track inline-flex items-center gap-2 border border-gold/60 px-8 py-5 !text-[10px] !text-gold transition-colors hover:border-gold min-h-[44px]"
            >
              GET A CUSTOM PLAN →
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* TOOLKIT - COMPACT */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">TOOLS & PLATFORMS</p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {[
              "Meta Ads",
              "Google Ads",
              "Instagram",
              "YouTube",
              "Analytics",
              "Content Strategy",
            ].map((tool, i) => (
              <Reveal key={tool} delay={i * 0.05}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="border border-border p-4 text-center"
                >
                  <p className="text-sm text-ivory/80 md:text-base">{tool}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <h2 className="title-card text-[12vw] leading-[0.85] text-ivory md:text-[7vw]">
              YOUR BUSINESS HAS A STORY.
              <br />
              LET'S MAKE PEOPLE NOTICE IT.
            </h2>
            <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center">
              <Link
                to="/contact"
                data-cursor="enter →"
                className="label-track bg-gold px-8 py-5 !text-[10px] !text-charcoal transition-colors hover:bg-gold/90 min-h-[44px]"
              >
                START A PROJECT →
              </Link>
              <div className="flex flex-col gap-3 md:flex-row md:ml-8">
                <Link
                  to="/contact"
                  data-cursor="enter →"
                  className="label-track border border-gold/60 px-6 py-4 !text-[10px] !text-gold transition-colors hover:border-gold min-h-[44px]"
                >
                  I'M IN CHENNAI →
                  <span className="ml-2 text-muted-foreground text-xs">CONTENT + SHOOT</span>
                </Link>
                <Link
                  to="/contact"
                  data-cursor="enter →"
                  className="label-track border border-gold/60 px-6 py-4 !text-[10px] !text-gold transition-colors hover:border-gold min-h-[44px]"
                >
                  I'M ANYWHERE IN THE WORLD →
                  <span className="ml-2 text-muted-foreground text-xs">DIGITAL MARKETING</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
