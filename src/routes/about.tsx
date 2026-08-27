import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

import defaultAboutImage from "@/assets/about-editroom.webp";
import { Reveal } from "@/components/Reveal";
import { FocusReveal } from "@/components/FocusReveal";
import { Stage } from "@/components/three/Stage";
import { getSiteImages, defaultSiteImages, type SiteImagesData } from "@/lib/site-images";
import { getResumeData, defaultResumeData, type ResumeData } from "@/lib/resume";
import { getSeoSettings, defaultSeoSettings, type SeoSettingsData } from "@/lib/seo-settings";

export const Route = createFileRoute("/about")({
  loader: async () => {
    try {
      const [siteImages, resumeData, seo] = await Promise.all([
        getSiteImages(),
        getResumeData(),
        getSeoSettings(),
      ]);
      return { siteImages, resumeData, seoSettings: seo };
    } catch {
      return {
        siteImages: defaultSiteImages,
        resumeData: defaultResumeData,
        seoSettings: defaultSeoSettings,
      };
    }
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seoSettings || defaultSeoSettings;
    const title = seo.aboutTitle || "The Filmmaker — About Rohith V";
    const description = seo.aboutDescription || "Rohith V — Visual Communication student and emerging Filmmaker, Writer, Editor and VFX/CG Artist based in Chennai.";
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
  component: About,
});

function About() {
  const loaderData = Route.useLoaderData();
  const [siteImages, setSiteImages] = useState<SiteImagesData>(
    loaderData?.siteImages || defaultSiteImages
  );
  const [resumeData, setResumeData] = useState<ResumeData>(
    loaderData?.resumeData || defaultResumeData
  );

  useEffect(() => {
    Promise.all([getSiteImages(), getResumeData()]).then(([imgs, res]) => {
      if (imgs) setSiteImages(imgs);
      if (res) setResumeData(res);
    }).catch(() => {});

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteImagesData>;
      if (customEvent.detail) setSiteImages(customEvent.detail);
    };

    window.addEventListener("site-images-updated", handleUpdate);
    return () => window.removeEventListener("site-images-updated", handleUpdate);
  }, []);

  return (
    <section className="relative">
      <Stage
        scene="filmstrip"
        className="pointer-events-none absolute inset-x-0 top-[30vh] hidden h-[40vh] opacity-40 lg:block"
      />
      <div className="relative mx-auto max-w-[1600px] px-6 pb-24 pt-36 md:px-12 md:pb-36 md:pt-48">
        <FocusReveal>
          <p className="label-track text-gold">About</p>
          <h1 className="title-card mt-5 text-5xl text-ivory md:text-8xl">Rohith V</h1>
          <p className="label-track mt-3 !tracking-[0.4em] text-gold">Filmmaker</p>
        </FocusReveal>

        <div className="mt-20 grid gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="relative overflow-hidden bg-navy w-full max-h-[480px] md:max-w-[420px] md:max-h-[560px] border border-border/70">
              <img
                src={siteImages.aboutImage || defaultAboutImage}
                alt="Dimly lit editing room with film reels"
                loading="lazy"
                width={420}
                height={560}
                className="h-full w-full object-cover object-center opacity-85"
              />
              <div className="vignette" />
            </div>
          </Reveal>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-ivory/85 md:text-2xl">
                Visual Communication student and emerging Filmmaker, Writer, Editor and VFX/CG
                Artist with hands-on experience in filmmaking, screenplay development, editing and
                post-production.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-12 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                <p className="label-track !text-[10px] text-gold">
                  AVAILABLE FOR CREATIVE OPPORTUNITIES
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-14 space-y-8 border-t border-border pt-10">
                <div>
                  <p className="label-track text-gold">Based in</p>
                  <p className="mt-3 text-ivory">Chennai, Tamil Nadu, India</p>
                </div>
                <div>
                  <p className="label-track text-gold">Roles</p>
                  <p className="mt-3 text-ivory">Filmmaker · Writer · Editor · VFX / CG Artist</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-14 flex flex-wrap gap-6">
                <Link
                  to="/portfolio"
                  data-cursor="enter →"
                  className="label-track border border-gold/60 px-6 py-4 !text-[10px] !text-gold transition-colors hover:bg-gold hover:!text-charcoal"
                >
                  See selected work →
                </Link>
                <Link to="/contact" data-cursor="text" className="label-track px-2 py-4">
                  Contact →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* THE INDIE ORIGIN & RESOURCEFUL CRAFT */}
        <Reveal className="mt-24">
          <div className="border border-gold/40 bg-navy/30 p-8 md:p-12 relative overflow-hidden shadow-[0_0_30px_rgba(201,164,76,0.06)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="label-track text-gold">INDIE ROOTS & CRAFT</span>
            </div>
            <h3 className="title-card text-2xl text-ivory md:text-4xl">
              Zero Budget. One iPhone. Pure Storytelling.
            </h3>
            <p className="mt-5 text-base md:text-lg text-ivory/85 leading-relaxed max-w-3xl">
              Filmmaking began without waiting for permission or high-end gear. Starting with zero budget and an iPhone, every constraint became a masterclass in visual blocking, pacing, editing, and natural light. Whether working on an independent short or a studio pilot film, the philosophy remains constant: equipment captures the image, but intention and emotion create the cinema.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-2 text-gold">
                <span>✦</span> Hands-on Directing & Writing
              </span>
              <span className="flex items-center gap-2 text-gold">
                <span>✦</span> Practical VFX & Pacing
              </span>
              <span className="flex items-center gap-2 text-gold">
                <span>✦</span> Emotional Storytelling
              </span>
            </div>
          </div>
        </Reveal>

        {/* MY JOURNEY */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">MY JOURNEY</p>
          </Reveal>
          <div className="mt-12 relative pl-6 md:pl-8 border-l border-gold/30 space-y-10">
            <Reveal delay={0.1}>
              <div className="relative group">
                <div className="absolute -left-[30px] md:-left-[38px] top-1.5 w-3 h-3 rounded-full bg-gold border-2 border-charcoal shadow-[0_0_10px_rgba(201,164,76,0.7)] group-hover:scale-125 transition-transform" />
                <div className="grid gap-2 md:grid-cols-12 md:items-baseline">
                  <div className="md:col-span-3">
                    <p className="title-card text-2xl text-gold md:text-3xl">2023</p>
                  </div>
                  <div className="md:col-span-8 md:col-start-4">
                    <h3 className="title-card text-xl text-ivory group-hover:text-gold transition-colors md:text-2xl">
                      ONE LAST DAY
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base leading-relaxed">
                      First short film attempt — written, directed, shot, edited and DI with zero budget on iPhone.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="relative group">
                <div className="absolute -left-[30px] md:-left-[38px] top-1.5 w-3 h-3 rounded-full bg-gold border-2 border-charcoal shadow-[0_0_10px_rgba(201,164,76,0.7)] group-hover:scale-125 transition-transform" />
                <div className="grid gap-2 md:grid-cols-12 md:items-baseline">
                  <div className="md:col-span-3">
                    <p className="title-card text-2xl text-gold md:text-3xl">2024</p>
                  </div>
                  <div className="md:col-span-8 md:col-start-4">
                    <h3 className="title-card text-xl text-ivory group-hover:text-gold transition-colors md:text-2xl">
                      TOOTHPASTE
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base leading-relaxed">
                      Completed iPhone short film made with friends, exploring suspense, visual storytelling and an unexpected twist.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="relative group">
                <div className="absolute -left-[30px] md:-left-[38px] top-1.5 w-3 h-3 rounded-full bg-gold border-2 border-charcoal shadow-[0_0_10px_rgba(201,164,76,0.7)] group-hover:scale-125 transition-transform" />
                <div className="grid gap-2 md:grid-cols-12 md:items-baseline">
                  <div className="md:col-span-3">
                    <p className="title-card text-2xl text-gold md:text-3xl">KADALAR</p>
                  </div>
                  <div className="md:col-span-8 md:col-start-4">
                    <h3 className="title-card text-xl text-ivory group-hover:text-gold transition-colors md:text-2xl">
                      CG / VFX CONTRIBUTION
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base leading-relaxed">
                      Selected CG and VFX contribution for pilot film directed by Siva Murugan.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="relative group">
                <div className="absolute -left-[30px] md:-left-[38px] top-1.5 w-3 h-3 rounded-full bg-gold border-2 border-charcoal shadow-[0_0_10px_rgba(201,164,76,0.7)] group-hover:scale-125 transition-transform" />
                <div className="grid gap-2 md:grid-cols-12 md:items-baseline">
                  <div className="md:col-span-3">
                    <p className="title-card text-2xl text-gold md:text-3xl">RADHAL</p>
                  </div>
                  <div className="md:col-span-8 md:col-start-4">
                    <h3 className="title-card text-xl text-ivory group-hover:text-gold transition-colors md:text-2xl">
                      CURRENT JOURNEY
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base leading-relaxed">
                      Assistant Writer for script and screenplay development.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* PHILOSOPHY & STATEMENT */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">THE APPROACH</p>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-2">
            <Reveal delay={0.1}>
              <div className="border border-border/80 bg-navy/20 p-8">
                <h3 className="title-card text-2xl text-ivory">VISUALS WITH INTENT</h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Every camera move, color tone, and cut must serve the narrative. I believe in visual restraint — letting powerful frames speak rather than overwhelming the audience with superficial style.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="border border-border/80 bg-navy/20 p-8">
                <h3 className="title-card text-2xl text-ivory">COLLABORATIVE CRAFT</h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Filmmaking is a team discipline. From directing actors and coordinating with DOPs to handling precision post-production, clear creative communication is at the heart of my work.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* RESUME DOWNLOAD — Gracefully hidden if disabled or no URL */}
        {resumeData.enabled && resumeData.url && (
          <div className="mt-24 border-t border-border pt-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="label-track text-gold">DOCUMENTATION</p>
              <h3 className="title-card mt-2 text-2xl text-ivory">Curriculum Vitae</h3>
            </div>
            <a
              href={resumeData.url}
              download={resumeData.filename || "Rohith_V_Resume.pdf"}
              target="_blank"
              rel="noreferrer"
              data-cursor="download resume"
              data-magnetic="true"
              className="label-track border border-gold bg-gold/10 px-8 py-5 !text-[10px] !text-gold transition-all hover:bg-gold hover:!text-charcoal shadow-md font-bold"
            >
              DOWNLOAD RESUME (PDF) ↓
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
