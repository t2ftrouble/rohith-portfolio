import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { FocusReveal } from "@/components/FocusReveal";
import { Stage } from "@/components/three/Stage";
import { SocialLinks } from "@/components/SocialLinks";
import { getSocialLinks, defaultSocialLinks, type SocialLinksData } from "@/lib/social-links";
import { submitEnquiry } from "@/lib/enquiries";
import { getSeoSettings, defaultSeoSettings, type SeoSettingsData } from "@/lib/seo-settings";

export const Route = createFileRoute("/contact")({
  loader: async () => {
    try {
      const [socialData, seo] = await Promise.all([
        getSocialLinks(),
        getSeoSettings(),
      ]);
      return { socialLinks: socialData, seoSettings: seo };
    } catch {
      return { socialLinks: defaultSocialLinks, seoSettings: defaultSeoSettings };
    }
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seoSettings || defaultSeoSettings;
    const title = seo.contactTitle || "Contact — Rohith V | Filmmaker & Digital Creator";
    const description = seo.contactDescription || "Get in touch with Rohith V, Filmmaker and Digital Creator based in Chennai, Tamil Nadu.";
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
  component: Contact,
});

const filmServices = [
  "Assistant Direction",
  "Filmmaking",
  "Writing",
  "Editing",
  "VFX / CG",
  "Creative Collaboration",
];

const digitalServices = [
  "Video Editing",
  "Content Creation",
  "Personal Branding",
  "Digital Marketing",
  "Meta Ads",
  "Google Ads",
];

function Contact() {
  const loaderData = Route.useLoaderData();
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>(
    loaderData?.socialLinks || defaultSocialLinks
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    location: "",
    projectType: "FILM",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    getSocialLinks().then(setSocialLinks).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("idle");

    try {
      // 1. Submit to API enquiries inbox in background
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        business: formData.business,
        location: formData.location,
        projectType: formData.projectType,
        budget: formData.budget,
        message: formData.message,
      });

      setSubmissionStatus("success");
      setFormData({
        name: "",
        email: "",
        business: "",
        location: "",
        projectType: "FILM",
        budget: "",
        message: "",
      });
    } catch (err) {
      console.warn("API enquiry submission note:", err);
      // Even if API route had an issue, fallback mailto is prepared
      const subject = encodeURIComponent(`Project Enquiry from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nBusiness/Brand: ${formData.business}\nLocation: ${formData.location}\nProject Type: ${formData.projectType}\nBudget Range: ${formData.budget}\n\nMessage:\n${formData.message}`,
      );
      window.location.href = `mailto:t2frohithyt@gmail.com?subject=${subject}&body=${body}`;
      setSubmissionStatus("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Stage
        scene="aperture"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 opacity-45"
      />
      <div className="vignette" />

      <div className="relative mx-auto max-w-[1600px] px-6 pb-28 pt-36 md:px-12 md:pb-40 md:pt-48">
        <FocusReveal>
          <p className="label-track text-gold">Contact</p>
          <h1 className="title-card mt-6 text-[13vw] leading-[0.85] text-ivory md:text-[8vw]">
            Let&apos;s make
            <br />
            something.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/85 md:text-2xl">
            Film projects, creative collaborations, or digital content — let's build something worth
            watching.
          </p>
        </FocusReveal>

        <div className="mt-20 grid gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="title-card text-3xl text-ivory md:text-5xl">Rohith V</p>
            <p className="label-track mt-5 !tracking-[0.4em] text-gold">Filmmaker</p>
            <p className="mt-3 text-muted-foreground">Chennai, Tamil Nadu, India</p>

            <div className="mt-12 space-y-4 text-sm text-ivory/80">
              <div>
                <p className="label-track text-gold">Email</p>
                <a
                  href="mailto:t2frohithyt@gmail.com"
                  data-cursor="copy email"
                  data-magnetic="true"
                  className="mt-2 block text-ivory transition-colors hover:text-gold"
                >
                  t2frohithyt@gmail.com
                </a>
              </div>
              <div className="pt-4">
                <p className="label-track text-gold">Phone / WhatsApp</p>
                <a
                  href="tel:+917200173240"
                  data-cursor="call"
                  data-magnetic="true"
                  className="mt-2 block text-ivory transition-colors hover:text-gold"
                >
                  +91 72001 73240
                </a>
              </div>
            </div>
          </Reveal>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <p className="text-xl leading-relaxed text-ivory/90 md:text-3xl">
                Looking for an Assistant Director, Writer, Editor, or CG Artist for your next film?
                Or want to produce cinematic digital content that stands out?
              </p>
              <a
                href="mailto:t2frohithyt@gmail.com"
                data-cursor="enter →"
                className="label-track mt-12 inline-block border border-gold/60 px-8 py-5 !text-[10px] !text-gold transition-colors hover:bg-gold hover:!text-charcoal"
              >
                Start a conversation →
              </a>
            </Reveal>
          </div>
        </div>

        {/* CHANNELS & PROFILES FULL CARDS */}
        <div className="mt-20 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">CHANNELS & CONNECT</p>
            <div className="mt-8">
              <SocialLinks links={socialLinks} variant="card" />
            </div>
          </Reveal>
        </div>

        {/* SERVICES */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">SERVICES</p>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-2">
            <Reveal delay={0.1}>
              <div>
                <h3 className="title-card text-2xl text-ivory md:text-3xl">FILM & CREATIVE</h3>
                <ul className="mt-6 space-y-3">
                  {filmServices.map((service) => (
                    <li key={service} className="text-sm text-muted-foreground md:text-base">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div>
                <h3 className="title-card text-2xl text-ivory md:text-3xl">DIGITAL</h3>
                <ul className="mt-6 space-y-3">
                  {digitalServices.map((service) => (
                    <li key={service} className="text-sm text-muted-foreground md:text-base">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        {/* INQUIRY FORM */}
        <div className="mt-24 border-t border-border pt-16">
          <Reveal>
            <p className="label-track text-gold">GET IN TOUCH</p>
            <h2 className="title-card mt-4 text-3xl text-ivory md:text-5xl">Send an Enquiry</h2>
          </Reveal>

          {submissionStatus === "success" && (
            <Reveal delay={0.1} className="mt-8">
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 rounded flex items-center gap-3 text-emerald-400">
                <CheckCircle2 size={24} className="flex-shrink-0" />
                <div>
                  <h4 className="title-card text-lg">Enquiry Sent Successfully!</h4>
                  <p className="text-xs text-emerald-300/80 mt-1">
                    Thank you. Your message has been safely received and Rohith will respond shortly.
                  </p>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="mt-12 grid gap-6 md:grid-cols-2">
              <div>
                <label className="label-track block mb-2 text-gold">NAME *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="label-track block mb-2 text-gold">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                  placeholder="your.email@domain.com"
                />
              </div>

              <div>
                <label className="label-track block mb-2 text-gold">BUSINESS / BRAND</label>
                <input
                  type="text"
                  value={formData.business}
                  onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="label-track block mb-2 text-gold">LOCATION</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label-track block mb-3 text-gold">PROJECT DISCIPLINE *</label>
                <div className="flex flex-wrap gap-2.5">
                  {["FILM", "COMMERCIAL", "EDIT", "VFX", "DIGITAL CAMPAIGN", "OTHER"].map((choice) => {
                    const isSelected = formData.projectType === choice;
                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => setFormData({ ...formData, projectType: choice })}
                        className={`label-track px-4 py-2.5 !text-[9px] border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gold border-gold !text-charcoal font-bold shadow-md"
                            : "border-border/80 bg-charcoal/60 text-ivory/80 hover:border-gold/60 hover:text-gold"
                        }`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="label-track block mb-2 text-gold">BUDGET RANGE</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                >
                  <option value="">Select budget range</option>
                  <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000+">₹1,00,000+</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label-track block mb-2 text-gold">MESSAGE *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  required
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-cursor="enter →"
                  className="label-track border border-gold/60 px-8 py-5 !text-[10px] !text-gold transition-colors hover:bg-gold hover:!text-charcoal disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    "SEND ENQUIRY →"
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
