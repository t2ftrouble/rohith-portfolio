import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Globe,
  Search,
} from "lucide-react";
import {
  getSeoSettings,
  updateSeoSettings,
  defaultSeoSettings,
  type SeoSettingsData,
} from "@/lib/seo-settings";

export function SeoManagerForm() {
  const [settings, setSettings] = useState<SeoSettingsData>(defaultSeoSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await getSeoSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load SEO settings:", err);
      setStatusMessage({
        type: "error",
        text: "Could not load SEO settings from storage.",
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
      const saved = await updateSeoSettings(settings);
      setSettings(saved);
      setStatusMessage({
        type: "success",
        text: "✓ SEO and Meta settings saved and active in SSR!",
      });
    } catch (err: unknown) {
      console.error("Failed to save SEO settings:", err);
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save SEO settings",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset all SEO meta tags back to default settings?")) {
      setSettings(defaultSeoSettings);
      setStatusMessage(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gold font-mono text-xs gap-3">
        <RefreshCw size={16} className="animate-spin" />
        <span>Loading SEO configuration...</span>
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

      {/* 1. GLOBAL DEFAULTS */}
      <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              1
            </span>
            <h3 className="title-card text-xl text-ivory">Global SEO & Social Fallbacks</h3>
          </div>
          <span className="label-track text-gold !text-[9px]">Site-wide Defaults</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Global Title (Browser Tab & Default OpenGraph)
            </label>
            <input
              type="text"
              value={settings.globalTitle}
              onChange={(e) => setSettings({ ...settings, globalTitle: e.target.value })}
              required
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. Rohith V — Filmmaker, Writer, Editor & VFX Artist"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Global Meta Description
            </label>
            <textarea
              value={settings.globalDescription}
              onChange={(e) => setSettings({ ...settings, globalDescription: e.target.value })}
              rows={3}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                Meta Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={settings.globalKeywords}
                onChange={(e) => setSettings({ ...settings, globalKeywords: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
                placeholder="Filmmaker, Director, VFX, Chennai, Short Films..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/90 mb-2">
                Default OpenGraph Image URL
              </label>
              <input
                type="text"
                value={settings.globalOgImage}
                onChange={(e) => setSettings({ ...settings, globalOgImage: e.target.value })}
                className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none font-mono text-xs"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. PAGE-SPECIFIC TITLES & DESCRIPTIONS */}
      <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              2
            </span>
            <h3 className="title-card text-xl text-ivory">Page-Specific Meta Tags</h3>
          </div>
          <span className="label-track text-gold !text-[9px]">Per-route Metadata</span>
        </div>

        <div className="space-y-6">
          {/* Homepage */}
          <div className="p-5 bg-charcoal/80 border border-border/60 rounded space-y-3">
            <span className="label-track text-gold !text-[10px]">Route: / (Homepage)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={settings.homeTitle}
                onChange={(e) => setSettings({ ...settings, homeTitle: e.target.value })}
                className="bg-navy border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="Homepage Title"
              />
              <input
                type="text"
                value={settings.homeDescription}
                onChange={(e) => setSettings({ ...settings, homeDescription: e.target.value })}
                className="bg-navy border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="Homepage Meta Description"
              />
            </div>
          </div>

          {/* Portfolio */}
          <div className="p-5 bg-charcoal/80 border border-border/60 rounded space-y-3">
            <span className="label-track text-gold !text-[10px]">Route: /portfolio (Selected Work)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={settings.portfolioTitle}
                onChange={(e) => setSettings({ ...settings, portfolioTitle: e.target.value })}
                className="bg-navy border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="Portfolio Title"
              />
              <input
                type="text"
                value={settings.portfolioDescription}
                onChange={(e) => setSettings({ ...settings, portfolioDescription: e.target.value })}
                className="bg-navy border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="Portfolio Meta Description"
              />
            </div>
          </div>

          {/* About */}
          <div className="p-5 bg-charcoal/80 border border-border/60 rounded space-y-3">
            <span className="label-track text-gold !text-[10px]">Route: /about (Filmmaker Profile)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={settings.aboutTitle}
                onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                className="bg-navy border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="About Page Title"
              />
              <input
                type="text"
                value={settings.aboutDescription}
                onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
                className="bg-navy border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="About Meta Description"
              />
            </div>
          </div>

          {/* Digital Marketing */}
          <div className="p-5 bg-charcoal/80 border border-border/60 rounded space-y-3">
            <span className="label-track text-gold !text-[10px]">Route: /digital-marketing (Commercials & Ads)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={settings.digitalMarketingTitle}
                onChange={(e) =>
                  setSettings({ ...settings, digitalMarketingTitle: e.target.value })
                }
                className="bg-navy border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="Digital Marketing Title"
              />
              <input
                type="text"
                value={settings.digitalMarketingDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    digitalMarketingDescription: e.target.value,
                  })
                }
                className="bg-navy border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="Digital Marketing Meta Description"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="p-5 bg-charcoal/80 border border-border/60 rounded space-y-3">
            <span className="label-track text-gold !text-[10px]">Route: /contact (Collaboration)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={settings.contactTitle}
                onChange={(e) => setSettings({ ...settings, contactTitle: e.target.value })}
                className="bg-navy border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="Contact Page Title"
              />
              <input
                type="text"
                value={settings.contactDescription}
                onChange={(e) => setSettings({ ...settings, contactDescription: e.target.value })}
                className="bg-navy border border-border px-3 py-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                placeholder="Contact Meta Description"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save & Reset Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
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
              SAVE SEO SETTINGS
            </>
          )}
        </button>

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
