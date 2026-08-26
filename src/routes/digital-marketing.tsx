import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  Eye,
  Scissors,
  Film,
  Target,
  Clock,
  CheckCircle2,
  MapPin,
  Globe2,
} from "lucide-react";

import { FocusReveal } from "@/components/FocusReveal";
import { getSiteImages, defaultSiteImages, type SiteImagesData } from "@/lib/site-images";
import { resolveImageUrl } from "@/lib/asset-resolver";
import defaultDmHero from "@/assets/digital marketing hero.jpg";
import defaultCreative1 from "@/assets/1-creative.jpg";
import defaultCreative2 from "@/assets/2-cerative.jpg";
import defaultCreative3 from "@/assets/3 creative.jpg";

export const Route = createFileRoute("/digital-marketing")({
  head: () => ({
    meta: [
      { title: "Digital Marketing & Video Ads — Rohith V | Cinematic Commercials" },
      {
        name: "description",
        content:
          "Cinematic commercials, social reels, and high-converting video ads crafted by a filmmaker. Storytelling that stops the scroll for brands in Chennai and worldwide.",
      },
      {
        property: "og:title",
        content: "Digital Marketing & Video Ads — Rohith V | Cinematic Commercials",
      },
      {
        property: "og:description",
        content:
          "Cinematic commercials that stop the scroll. Video ads crafted by a filmmaker — not a template agency.",
      },
    ],
  }),
  component: DigitalMarketing,
});

const advantagePillars = [
  {
    step: "01",
    phase: "COMPOSITION",
    title: "Composition Creates Attention",
    desc: "Cinematic lighting, depth of field, and intentional camera blocking that command immediate visual authority mid-scroll.",
    icon: Eye,
  },
  {
    step: "02",
    phase: "EDITING",
    title: "Editing Controls Retention",
    desc: "Micro-pacing, cut timing, and auditory rhythm designed to eliminate drop-off and hold viewer attention until the final frame.",
    icon: Scissors,
  },
  {
    step: "03",
    phase: "STORY",
    title: "Story Creates Emotion",
    desc: "Character stakes, human tension, and authentic visual metaphors that turn passive viewers into genuine brand advocates.",
    icon: Film,
  },
  {
    step: "04",
    phase: "STRATEGY",
    title: "Strategy Turns Attention into Action",
    desc: "Direct-response creative angles, psychological hooks, and clear calls to action engineered for scalable Meta & Google ROAS.",
    icon: Target,
  },
];

const firstThreeSeconds = [
  {
    timecode: "00:00:00",
    label: "FRAME & LIGHTING",
    title: "The Visual Disruption",
    desc: "An unexpected visual anomaly, cinematic contrast, or bold framing immediately interrupts the user's subconscious scroll habit.",
  },
  {
    timecode: "00:01:00",
    label: "THE AUDITORY HOOK",
    title: "Sound Design Impact",
    desc: "A bespoke sonic cue, punchy dialogue hook, or atmospheric shift locks auditory attention before the brain considers skipping.",
  },
  {
    timecode: "00:02:00",
    label: "KINETIC MOMENTUM",
    title: "Dynamic Camera Motion",
    desc: "A rapid camera push, match cut, or character movement pulls the viewer deeper into the scene's momentum.",
  },
  {
    timecode: "00:03:00",
    label: "THE NARRATIVE LOCK",
    title: "Curiosity Tension Established",
    desc: "The central question or tension is firmly placed. The viewer is no longer scrolling — they are watching a story unfold.",
  },
];

const workflowSteps = [
  { step: "01", name: "DISCOVER", desc: "Audience psychology, brand identity, and campaign goals." },
  { step: "02", name: "CONCEPT", desc: "Cinematic hooks, creative angles, and visual storyboards." },
  { step: "03", name: "SCRIPT", desc: "Dialogue, pacing, auditory cues, and call-to-action framing." },
  { step: "04", name: "PRODUCE", desc: "Cinematography, camera movement, and on-set direction." },
  { step: "05", name: "EDIT", desc: "Narrative assembly, sound design, grading, and VFX polish." },
  { step: "06", name: "DISTRIBUTE", desc: "Platform-optimized exports for Meta, YouTube, and Google." },
  { step: "07", name: "ANALYSE", desc: "Retention curves, CTR metrics, and creative iteration." },
];

function DigitalMarketing() {
  const [siteImages, setSiteImages] = useState<SiteImagesData>(defaultSiteImages);

  useEffect(() => {
    getSiteImages().then(setSiteImages).catch(() => {});

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteImagesData>;
      if (customEvent.detail) setSiteImages(customEvent.detail);
    };

    window.addEventListener("site-images-updated", handleUpdate);
    return () => window.removeEventListener("site-images-updated", handleUpdate);
  }, []);

  const creativeFormats = [
    {
      number: "01",
      title: "CINEMATIC BRAND FILMS",
      subtitle: "Story-Driven Commercials & Branded Cinema",
      desc: "High-production commercials, founder documentaries, and cinematic anthems designed to establish undeniable brand prestige.",
      image: resolveImageUrl(siteImages.creative1) || defaultCreative1,
      tag: "STORY & BRANDING",
      deliverables: ["4K Master Commercial", "Brand Documentary", "Cinematic Cutdowns (30s/15s)"],
    },
    {
      number: "02",
      title: "SOCIAL REELS & SHORTS",
      subtitle: "High-Hook Vertical Visual Storytelling",
      desc: "Fast-paced vertical videos engineered with instant psychological hooks, kinetic editing, and high-retention episodic pacing.",
      image: resolveImageUrl(siteImages.creative2) || defaultCreative2,
      tag: "ORGANIC & VIRAL REACH",
      deliverables: ["9:16 Vertical Video Suite", "High-CTR Hook Variations", "Captions & Sound Design"],
    },
    {
      number: "03",
      title: "PERFORMANCE AD CREATIVES",
      subtitle: "Direct-Response Video Ads for Meta & Google",
      desc: "Data-driven video creatives built for paid acquisition campaigns — tested for maximum click-through rates and customer conversion.",
      image: resolveImageUrl(siteImages.creative3) || defaultCreative3,
      tag: "PAID ACQUISITION & ROI",
      deliverables: ["Multi-Angle Creative Tests", "A/B Hook Variations", "Paid Ad Optimization"],
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Ambient background light drift */}
      <div className="anamorphic-drift absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px] px-6 pb-28 pt-36 md:px-12 md:pb-40 md:pt-48">
        {/* HERO SECTION */}
        <div className="relative border-b border-border/70 pb-20 md:pb-28">
          <FocusReveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
              <p className="label-track text-gold">A FILMMAKER'S APPROACH TO DIGITAL MARKETING</p>
            </div>
            
            <h1 className="title-card text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.9] text-ivory max-w-5xl text-balance">
              CINEMATIC COMMERCIALS THAT STOP THE SCROLL.
            </h1>
            
            <p className="mt-8 max-w-2xl text-lg text-ivory/85 md:text-2xl leading-relaxed">
              Video ads and branded content crafted by a filmmaker — not a template agency.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/contact"
                data-cursor="contact →"
                data-magnetic="true"
                className="label-track bg-gold px-8 py-4.5 !text-[10px] !text-charcoal font-bold transition-all hover:bg-gold/90 min-h-[48px] inline-flex items-center justify-center shadow-lg"
              >
                START A PROJECT →
              </Link>
              <a
                href="#filmmaker-advantage"
                data-cursor="explore ↓"
                data-magnetic="true"
                className="label-track border border-gold/60 px-8 py-4.5 !text-[10px] !text-gold transition-all hover:border-gold hover:bg-gold/10 min-h-[48px] inline-flex items-center justify-center"
              >
                EXPLORE THE ADVANTAGE ↓
              </a>
            </div>
          </FocusReveal>

          {/* Hero Banner Visual (digital marketing hero.jpg) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-16 relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden border border-border/80 bg-navy/40"
          >
            <img
              src={resolveImageUrl(siteImages.digitalMarketingHero) || defaultDmHero}
              alt="Digital Marketing Hero — Cinematic Commercial Production"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center opacity-85 hero-lens-breathe"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
            <div className="vignette" />
            <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-ivory/80">
              <span className="label-track text-gold">STORYTELLING VS CORPORATE NOISE</span>
              <span className="hidden sm:inline-block label-track text-muted-foreground">FRAME • PACING • CONVERSION</span>
            </div>
          </motion.div>
        </div>

        {/* THE FILMMAKER'S ADVANTAGE */}
        <section id="filmmaker-advantage" className="py-24 md:py-36 border-b border-border/70">
          <FocusReveal>
            <p className="label-track text-gold">THE ADVANTAGE</p>
            <h2 className="title-card mt-4 text-4xl text-ivory md:text-7xl">
              Story → Hook → Retention → Conversion
            </h2>
            <p className="mt-6 max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
              Most digital ads fail because they look and feel like ads. By applying cinema principles — deliberate composition, auditory tension, and narrative pacing — your brand captures genuine emotional investment.
            </p>
          </FocusReveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advantagePillars.map((p, idx) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative border border-border/70 bg-navy/30 p-7 transition-all duration-400 hover:border-gold/70 hover:bg-navy/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] md:hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="label-track !text-[9px] text-gold font-mono">{p.step} — {p.phase}</span>
                    <p.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-gold" />
                  </div>
                  <h3 className="title-card mt-6 text-xl text-ivory group-hover:text-gold transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                
                <div className="mt-8 pt-4 border-t border-border/40">
                  <span className="label-track !text-[8px] text-gold/80">CINEMA PRINCIPLE ✦</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3 CREATIVE FORMATS (Using 1-creative.jpg, 2-cerative.jpg, 3 creative.jpg) */}
        <section className="py-24 md:py-36 border-b border-border/70">
          <FocusReveal>
            <p className="label-track text-gold">SERVICES & DELIVERABLES</p>
            <h2 className="title-card mt-4 text-4xl text-ivory md:text-7xl">3 Creative Formats</h2>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              Tailored visual production formats engineered for brand prestige, organic viral reach, and high-ROI paid conversion.
            </p>
          </FocusReveal>

          <div className="mt-16 space-y-12">
            {creativeFormats.map((format, idx) => (
              <motion.div
                key={format.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: idx * 0.12 }}
                className="group border border-border/70 bg-navy/25 transition-all duration-500 hover:border-gold/60 hover:bg-navy/45 hover:shadow-[0_16px_50px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className="grid md:grid-cols-12 items-stretch">
                  {/* Visual Preview Side with exact aspect ratio & responsive cover */}
                  <div className="md:col-span-6 relative aspect-[16/9] md:aspect-auto md:min-h-[380px] overflow-hidden bg-charcoal">
                    <img
                      src={format.image}
                      alt={format.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center opacity-85 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="vignette" />
                    <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />
                    
                    <span className="label-track absolute top-4 left-4 bg-charcoal/85 border border-gold/40 px-3 py-1 !text-[9px] text-gold backdrop-blur-sm shadow-md">
                      {format.tag}
                    </span>
                  </div>

                  {/* Narrative Details Side */}
                  <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="title-card text-3xl text-gold font-mono">{format.number}</span>
                        <span className="h-px flex-1 bg-border/60" />
                      </div>
                      
                      <h3 className="title-card mt-4 text-2xl md:text-4xl text-ivory group-hover:text-gold transition-colors">
                        {format.title}
                      </h3>
                      <p className="label-track mt-2 text-gold/90">{format.subtitle}</p>
                      
                      <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed">
                        {format.desc}
                      </p>

                      {/* Deliverables Checklist */}
                      <div className="mt-8 pt-6 border-t border-border/60">
                        <p className="label-track !text-[9px] text-ivory mb-3">KEY DELIVERABLES</p>
                        <ul className="space-y-2.5">
                          {format.deliverables.map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-xs text-ivory/85">
                              <CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-10">
                      <Link
                        to="/contact"
                        data-cursor="start format →"
                        data-magnetic="true"
                        className="label-track inline-block border border-gold/70 px-6 py-3.5 !text-[9px] !text-gold transition-all hover:bg-gold hover:!text-charcoal font-bold"
                      >
                        BOOK THIS FORMAT →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* "THE FIRST 3 SECONDS" INTERACTIVE BREAKDOWN */}
        <section className="py-24 md:py-36 border-b border-border/70">
          <FocusReveal>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-gold" />
              <p className="label-track text-gold">RETENTION ENGINEERING</p>
            </div>
            <h2 className="title-card text-4xl text-ivory md:text-7xl">
              The First 3 Seconds
            </h2>
            <p className="mt-6 max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
              In social feeds and video ads, 80% of audience drop-off occurs within the opening 3 seconds. Here is how cinema mechanics convert passive scrollers into captive viewers.
            </p>
          </FocusReveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {firstThreeSeconds.map((sec, idx) => (
              <motion.div
                key={sec.timecode}
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="border border-border/70 bg-navy/30 p-7 relative overflow-hidden group hover:border-gold/60 transition-all duration-300 hover:bg-navy/45"
              >
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <span className="title-card text-lg text-gold font-mono">{sec.timecode}</span>
                  <span className="label-track !text-[8px] text-muted-foreground">{sec.label}</span>
                </div>
                
                <h3 className="title-card mt-6 text-lg text-ivory group-hover:text-gold transition-colors">
                  {sec.title}
                </h3>
                
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  {sec.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WORKFLOW TIMELINE */}
        <section className="py-24 md:py-36 border-b border-border/70">
          <FocusReveal>
            <p className="label-track text-gold">PRODUCTION TIMELINE</p>
            <h2 className="title-card mt-4 text-4xl text-ivory md:text-7xl">
              From Concept to Conversion
            </h2>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              A structured 7-step production lifecycle ensuring crystal-clear messaging, high visual fidelity, and measurable performance.
            </p>
          </FocusReveal>

          <div className="mt-16 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-7">
            {workflowSteps.map((wf, idx) => (
              <motion.div
                key={wf.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                className="border border-border/60 bg-navy/20 p-5 group hover:border-gold/60 hover:bg-navy/40 transition-all"
              >
                <span className="title-card text-2xl text-gold/80 font-mono group-hover:text-gold transition-colors">
                  {wf.step}
                </span>
                <h3 className="title-card mt-3 text-base text-ivory group-hover:text-gold transition-colors">
                  {wf.name}
                </h3>
                <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                  {wf.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CHENNAI / WORLDWIDE LOCATION SPLIT */}
        <section className="py-24 md:py-36 border-b border-border/70">
          <FocusReveal>
            <p className="label-track text-gold">COLLABORATION MODELS</p>
            <h2 className="title-card mt-4 text-4xl text-ivory md:text-7xl">
              Chennai & Worldwide
            </h2>
          </FocusReveal>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* Chennai Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="border border-border/80 bg-navy/30 p-8 md:p-12 group hover:border-gold/70 transition-all duration-300 shadow-md"
            >
              <div className="flex items-center gap-3 text-gold mb-6">
                <MapPin className="h-6 w-6" />
                <span className="label-track text-gold">ON-LOCATION PRODUCTION</span>
              </div>
              <h3 className="title-card text-3xl text-ivory group-hover:text-gold transition-colors">
                CHENNAI & SOUTH INDIA
              </h3>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                Full in-person production, cinematography, lighting setups, actor directing, and commercial shoots on-location across Chennai and South India.
              </p>
              <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap gap-2 text-[10px] font-mono text-ivory/80">
                <span className="px-2.5 py-1 bg-charcoal border border-border/60">On-Set Directing</span>
                <span className="px-2.5 py-1 bg-charcoal border border-border/60">4K Cinema Cameras</span>
                <span className="px-2.5 py-1 bg-charcoal border border-border/60">Full Crew Coordination</span>
              </div>
            </motion.div>

            {/* Worldwide Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="border border-border/80 bg-navy/30 p-8 md:p-12 group hover:border-gold/70 transition-all duration-300 shadow-md"
            >
              <div className="flex items-center gap-3 text-gold mb-6">
                <Globe2 className="h-6 w-6" />
                <span className="label-track text-gold">REMOTE POST & STRATEGY</span>
              </div>
              <h3 className="title-card text-3xl text-ivory group-hover:text-gold transition-colors">
                WORLDWIDE COLLABORATION
              </h3>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                Remote video editing, DI color grading, motion graphics, VFX compositing, and Meta/Google ad campaign strategy for brands worldwide.
              </p>
              <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap gap-2 text-[10px] font-mono text-ivory/80">
                <span className="px-2.5 py-1 bg-charcoal border border-border/60">Remote Timeline Editing</span>
                <span className="px-2.5 py-1 bg-charcoal border border-border/60">Color & VFX Delivery</span>
                <span className="px-2.5 py-1 bg-charcoal border border-border/60">Paid Ad Creative Strategy</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FINAL CLOSING CTA */}
        <section className="pt-24 md:pt-36">
          <FocusReveal>
            <div className="border border-gold/50 bg-navy/35 p-10 md:p-16 text-center relative overflow-hidden shadow-[0_0_50px_rgba(201,164,76,0.1)]">
              <p className="label-track text-gold">LET'S BUILD SOMETHING UNIGNORABLE</p>
              
              <h2 className="title-card mt-4 text-3xl sm:text-5xl md:text-6xl text-ivory max-w-3xl mx-auto leading-[1.05]">
                HAVE A BRAND WORTH FILMING?
              </h2>
              
              <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Let's replace generic ads with cinema-grade visual storytelling that commands attention and drives genuine revenue.
              </p>
              
              <div className="mt-10">
                <Link
                  to="/contact"
                  data-cursor="contact →"
                  data-magnetic="true"
                  className="label-track inline-block border border-gold bg-gold px-10 py-5 !text-[10px] !text-charcoal font-bold transition-all hover:bg-gold/90 shadow-xl"
                >
                  LET'S CREATE IT →
                </Link>
              </div>
            </div>
          </FocusReveal>
        </section>
      </div>
    </section>
  );
}
