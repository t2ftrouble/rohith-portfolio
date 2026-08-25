import { createFileRoute, Link } from "@tanstack/react-router";

import aboutImage from "@/assets/about-editroom.webp";
import resumePdf from "@/assets/Rohith V Resume.pdf";
import { Reveal } from "@/components/Reveal";
import { Stage } from "@/components/three/Stage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Filmmaker — About Rohith V" },
      {
        name: "description",
        content:
          "Rohith V — Visual Communication student and emerging Filmmaker, Writer, Editor and VFX/CG Artist based in Chennai.",
      },
      { property: "og:title", content: "The Filmmaker — About Rohith V" },
      {
        property: "og:description",
        content:
          "Profile, journey, approach and education of Rohith V, filmmaker based in Chennai, Tamil Nadu.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <section className="relative">
      <Stage
        scene="filmstrip"
        className="pointer-events-none absolute inset-x-0 top-[30vh] hidden h-[40vh] opacity-40 lg:block"
      />
      <div className="relative mx-auto max-w-[1600px] px-6 pb-24 pt-36 md:px-12 md:pb-36 md:pt-48">
        <Reveal>
          <p className="label-track text-gold">About</p>
          <h1 className="title-card mt-5 text-5xl text-ivory md:text-8xl">Rohith V</h1>
          <p className="label-track mt-3 !tracking-[0.4em] text-gold">Filmmaker</p>
        </Reveal>

        <div className="mt-20 grid gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="relative overflow-hidden bg-navy w-full max-h-[480px] md:max-w-[420px] md:max-h-[560px]">
              <img
                src={aboutImage}
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
                <div className="h-2 w-2 rounded-full bg-gold" />
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

        {/* MY JOURNEY */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">MY JOURNEY</p>
          </Reveal>
          <div className="mt-12 space-y-12">
            <Reveal delay={0.1}>
              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-3">
                  <p className="title-card text-2xl text-gold md:text-3xl">2023</p>
                </div>
                <div className="md:col-span-8 md:col-start-5">
                  <h3 className="title-card text-xl text-ivory md:text-2xl">ONE LAST DAY</h3>
                  <p className="mt-3 text-sm text-muted-foreground md:text-base">
                    First short film attempt.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-3">
                  <p className="title-card text-2xl text-gold md:text-3xl">2024</p>
                </div>
                <div className="md:col-span-8 md:col-start-5">
                  <h3 className="title-card text-xl text-ivory md:text-2xl">TOOTHPASTE</h3>
                  <p className="mt-3 text-sm text-muted-foreground md:text-base">
                    Completed iPhone short film made with friends.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-3">
                  <p className="title-card text-2xl text-gold md:text-3xl">KADALAR</p>
                </div>
                <div className="md:col-span-8 md:col-start-5">
                  <h3 className="title-card text-xl text-ivory md:text-2xl">
                    CG / VFX CONTRIBUTION
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground md:text-base">
                    Selected CG and VFX contribution for pilot film.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-3">
                  <p className="title-card text-2xl text-gold md:text-3xl">RADHAL</p>
                </div>
                <div className="md:col-span-8 md:col-start-5">
                  <h3 className="title-card text-xl text-ivory md:text-2xl">CURRENT JOURNEY</h3>
                  <p className="mt-3 text-sm text-muted-foreground md:text-base">
                    Screenplay and pre-production journey.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* MY APPROACH */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">MY APPROACH</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <blockquote className="border-l-4 border-gold pl-6">
              <p className="text-lg leading-relaxed text-ivory/85 md:text-2xl italic">
                "I believe filmmaking is not about having the biggest camera or the biggest budget.
                It is about understanding what the story needs and finding a way to create it."
              </p>
            </blockquote>
          </Reveal>
        </div>

        {/* EDUCATION */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">EDUCATION</p>
          </Reveal>
          <div className="mt-12 space-y-8">
            <Reveal delay={0.1}>
              <div className="border-l border-gold/40 pl-6">
                <h3 className="title-card text-xl text-ivory md:text-2xl">
                  B.Sc. Visual Communication
                </h3>
                <p className="label-track mt-3">VISTAS</p>
                <p className="label-track mt-1 !tracking-[0.3em] text-gold">2024 – 2027</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
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
            <Reveal delay={0.3}>
              <div className="border-l border-gold/40 pl-6">
                <h3 className="title-card text-xl text-ivory md:text-2xl">
                  St. Bede's Anglo Indian Higher Secondary School
                </h3>
                <p className="label-track mt-3 !tracking-[0.3em] text-gold">2012 – 2022</p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* SELECTED CREDITS */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">SELECTED CREDITS</p>
          </Reveal>
          <div className="mt-12 space-y-8">
            <Reveal delay={0.1}>
              <div className="border-b border-border pb-6">
                <h3 className="title-card text-xl text-ivory md:text-2xl">ONE LAST DAY</h3>
                <p className="label-track mt-2 text-gold">
                  Story / Screenplay / Director / Editor / DI
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="border-b border-border pb-6">
                <h3 className="title-card text-xl text-ivory md:text-2xl">TOOTHPASTE</h3>
                <p className="label-track mt-2 text-gold">Story / Direction / Editing</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="border-b border-border pb-6">
                <h3 className="title-card text-xl text-ivory md:text-2xl">KADALAR</h3>
                <p className="label-track mt-2 text-gold">CG Artist</p>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="border-b border-border pb-6">
                <h3 className="title-card text-xl text-ivory md:text-2xl">RADHAL</h3>
                <p className="label-track mt-2 text-gold">Assistant Writer / Script & Screenplay</p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* RESUME DOWNLOAD */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <a
              href={resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="enter →"
              className="label-track inline-block border border-gold/60 px-8 py-5 !text-[10px] !text-gold transition-colors hover:bg-gold hover:!text-charcoal"
            >
              DOWNLOAD RESUME ↓
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
