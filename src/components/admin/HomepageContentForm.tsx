import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  Compass,
} from "lucide-react";
import {
  getHomepageContent,
  updateHomepageContent,
  defaultHomepageContent,
  type HomepageContentData,
} from "@/lib/homepage-content";

export function HomepageContentForm() {
  const [content, setContent] = useState<HomepageContentData>(defaultHomepageContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await getHomepageContent();
      setContent(data);
    } catch (err) {
      console.error("Failed to load homepage content:", err);
      setStatusMessage({
        type: "error",
        text: "Could not load homepage content from storage.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const saved = await updateHomepageContent(content);
      setContent(saved);
      setStatusMessage({
        type: "success",
        text: "✓ Homepage content updated and published successfully!",
      });
    } catch (err: unknown) {
      console.error("Failed to save homepage content:", err);
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save homepage content",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset all homepage copy back to default settings?")) {
      setContent(defaultHomepageContent);
      setStatusMessage(null);
    }
  };

  const handlePhilosophyChange = (
    index: number,
    field: "word" | "subtitle" | "text",
    value: string
  ) => {
    const updated = [...content.philosophySteps];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
      setContent({ ...content, philosophySteps: updated });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gold font-mono text-xs gap-3">
        <RefreshCw size={16} className="animate-spin" />
        <span>Loading homepage content...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Alert message */}
      {statusMessage && (
        <div
          className={`p-4 rounded text-xs flex items-center justify-between ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="hover:underline text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. HERO SECTION COPY */}
      <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              1
            </span>
            <h3 className="title-card text-xl text-ivory">Hero Section Copy</h3>
          </div>
          <span className="label-track text-gold !text-[9px]">Main Heading & CTAs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Hero Title <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              required
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. Rohith V"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Hero Subtitle / Main Discipline <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              required
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. Filmmaker"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Hero Roles / Capabilities
            </label>
            <input
              type="text"
              value={content.heroRole}
              onChange={(e) => setContent({ ...content, heroRole: e.target.value })}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. Writer • Editor • VFX / CG Artist"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gold uppercase tracking-wider">
              Primary CTA Button
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={content.heroCtaText}
                onChange={(e) => setContent({ ...content, heroCtaText: e.target.value })}
                className="bg-charcoal border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="Button text (e.g. VIEW WORK →)"
              />
              <input
                type="text"
                value={content.heroCtaLink}
                onChange={(e) => setContent({ ...content, heroCtaLink: e.target.value })}
                className="bg-charcoal border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none font-mono"
                placeholder="Target URL (e.g. /portfolio)"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gold uppercase tracking-wider">
              Secondary CTA Button
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={content.heroSecondaryCtaText}
                onChange={(e) =>
                  setContent({ ...content, heroSecondaryCtaText: e.target.value })
                }
                className="bg-charcoal border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="Button text (e.g. START A PROJECT →)"
              />
              <input
                type="text"
                value={content.heroSecondaryCtaLink}
                onChange={(e) =>
                  setContent({ ...content, heroSecondaryCtaLink: e.target.value })
                }
                className="bg-charcoal border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none font-mono"
                placeholder="Target URL (e.g. /contact)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE FILMMAKER PROFILE & STATEMENT */}
      <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              2
            </span>
            <h3 className="title-card text-xl text-ivory">The Filmmaker & Statement Section</h3>
          </div>
          <span className="label-track text-gold !text-[9px]">Homepage Intro</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Profile Section Title
            </label>
            <input
              type="text"
              value={content.aboutProfileTitle}
              onChange={(e) => setContent({ ...content, aboutProfileTitle: e.target.value })}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. The Filmmaker"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              More Link Text & Link
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={content.aboutCtaText}
                onChange={(e) => setContent({ ...content, aboutCtaText: e.target.value })}
                className="bg-charcoal border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="e.g. More about the work →"
              />
              <input
                type="text"
                value={content.aboutCtaLink}
                onChange={(e) => setContent({ ...content, aboutCtaLink: e.target.value })}
                className="bg-charcoal border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none font-mono"
                placeholder="/about"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Profile Intro Lead Paragraph
            </label>
            <textarea
              value={content.aboutProfileText}
              onChange={(e) => setContent({ ...content, aboutProfileText: e.target.value })}
              rows={3}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Profile Experience Secondary Paragraph
            </label>
            <textarea
              value={content.aboutSubText}
              onChange={(e) => setContent({ ...content, aboutSubText: e.target.value })}
              rows={3}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Statement Section Large Title
            </label>
            <input
              type="text"
              value={content.statementTitle}
              onChange={(e) => setContent({ ...content, statementTitle: e.target.value })}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. A Film Is More Than a Frame."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Statement Section Punchline
            </label>
            <textarea
              value={content.statementText}
              onChange={(e) => setContent({ ...content, statementText: e.target.value })}
              rows={2}
              className="w-full bg-charcoal border border-border px-4 py-2.5 text-ivory text-xs focus:border-gold focus:outline-none resize-none"
              placeholder="e.g. I don't just create visuals.&#10;I create moments people remember."
            />
          </div>
        </div>
      </div>

      {/* 3. PHILOSOPHY TENETS (SEE, FEEL, TELL) */}
      <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              3
            </span>
            <h3 className="title-card text-xl text-ivory">The Director's Tenets (Philosophy)</h3>
          </div>
          <span className="label-track text-gold !text-[9px]">SEE • FEEL • TELL</span>
        </div>

        <div className="space-y-6">
          {content.philosophySteps.map((step, idx) => (
            <div
              key={step.step || idx}
              className="p-5 bg-charcoal/80 border border-border/70 rounded space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="label-track text-gold font-mono font-bold">
                  Step {step.step || `0${idx + 1}`}
                </span>
                <span className="title-card text-lg text-ivory">{step.word}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-ivory/80 mb-1">
                    Word Title
                  </label>
                  <input
                    type="text"
                    value={step.word}
                    onChange={(e) => handlePhilosophyChange(idx, "word", e.target.value)}
                    className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-ivory/80 mb-1">
                    Subtitle / Pillar
                  </label>
                  <input
                    type="text"
                    value={step.subtitle}
                    onChange={(e) => handlePhilosophyChange(idx, "subtitle", e.target.value)}
                    className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-semibold text-ivory/80 mb-1">
                    Manifesto Description
                  </label>
                  <textarea
                    value={step.text}
                    onChange={(e) => handlePhilosophyChange(idx, "text", e.target.value)}
                    rows={2}
                    className="w-full bg-navy border border-border px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save & Reset Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="label-track bg-gold px-8 py-4 !text-[11px] !text-charcoal font-bold hover:bg-gold/90 transition-all shadow-xl min-h-[46px] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Saving to Supabase...
              </>
            ) : (
              <>
                <Save size={14} />
                SAVE HOMEPAGE CONTENT
              </>
            )}
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="label-track border border-gold/60 px-5 py-4 !text-[10px] !text-gold hover:bg-gold/10 transition-colors min-h-[46px] flex items-center gap-1.5"
          >
            <Eye size={14} />
            Preview Homepage ↗
          </a>
        </div>

        <button
          type="button"
          onClick={handleResetToDefaults}
          disabled={isSaving}
          className="label-track border border-border px-4 py-3 !text-[9px] text-muted-foreground hover:text-red-400 hover:border-red-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={12} />
          Reset to Defaults
        </button>
      </div>
    </form>
  );
}
