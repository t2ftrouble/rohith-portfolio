import { useState, useEffect } from "react";
import { Youtube, Instagram, Linkedin, ExternalLink, Save, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { getSocialLinks, updateSocialLinks, isValidUrl, defaultSocialLinks, type SocialLinksData } from "@/lib/social-links";

export function SocialLinksForm() {
  const [formData, setFormData] = useState<SocialLinksData>(defaultSocialLinks);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    setFetching(true);
    try {
      const data = await getSocialLinks();
      setFormData(data);
    } catch (err) {
      console.error("Failed to load social links:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (platform: keyof SocialLinksData, value: string) => {
    setFormData((prev) => ({ ...prev, [platform]: value }));
    setStatusMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validate
    if (formData.youtube && !isValidUrl(formData.youtube)) {
      setStatusMessage({ type: "error", text: "Invalid YouTube URL. Must start with http:// or https://" });
      return;
    }
    if (formData.instagram && !isValidUrl(formData.instagram)) {
      setStatusMessage({ type: "error", text: "Invalid Instagram URL. Must start with http:// or https://" });
      return;
    }
    if (formData.linkedin && !isValidUrl(formData.linkedin)) {
      setStatusMessage({ type: "error", text: "Invalid LinkedIn URL. Must start with http:// or https://" });
      return;
    }

    setLoading(true);
    try {
      const saved = await updateSocialLinks(formData);
      setFormData(saved);
      setStatusMessage({ type: "success", text: "Social media links updated and saved to Supabase successfully!" });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save social links",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-border/80 bg-navy/20 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="label-track !text-[9px] text-gold">GLOBAL SETTINGS</span>
          </div>
          <h2 className="title-card mt-2 text-2xl text-ivory md:text-3xl">Social Media Channels</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your public social channel URLs. Leaving a field blank will automatically hide that icon across the site.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={fetching || loading}
          className="flex items-center gap-2 border border-border/80 px-4 py-2 text-xs font-mono text-ivory/80 transition-colors hover:border-gold hover:text-gold self-start md:self-auto disabled:opacity-50"
        >
          <RefreshCw size={14} className={fetching ? "animate-spin text-gold" : ""} />
          Reload from Database
        </button>
      </div>

      {statusMessage && (
        <div
          className={`mt-6 flex items-start gap-3 border p-4 ${
            statusMessage.type === "success"
              ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-300"
              : "border-red-500/50 bg-red-950/30 text-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
          )}
          <span className="text-sm">{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        {/* YouTube */}
        <div className="border border-border/60 bg-navy/30 p-5 transition-colors focus-within:border-gold/60">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 text-xs font-mono tracking-wider text-ivory">
              <div className="flex h-7 w-7 items-center justify-center border border-border/80 bg-charcoal text-gold">
                <Youtube size={16} />
              </div>
              <span>YOUTUBE CHANNEL URL</span>
            </label>
            {formData.youtube && isValidUrl(formData.youtube) && (
              <a
                href={formData.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-gold hover:underline"
              >
                <span>Test Link</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <div className="mt-3">
            <input
              type="url"
              value={formData.youtube}
              onChange={(e) => handleChange("youtube", e.target.value)}
              placeholder="https://www.youtube.com/@your_channel"
              className="w-full border border-border/80 bg-navy/60 px-4 py-2.5 text-sm font-mono text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none"
            />
            {formData.youtube && !isValidUrl(formData.youtube) && (
              <p className="mt-1.5 text-[11px] text-red-400">Must be a valid URL starting with http:// or https://</p>
            )}
          </div>
        </div>

        {/* Instagram */}
        <div className="border border-border/60 bg-navy/30 p-5 transition-colors focus-within:border-gold/60">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 text-xs font-mono tracking-wider text-ivory">
              <div className="flex h-7 w-7 items-center justify-center border border-border/80 bg-charcoal text-gold">
                <Instagram size={16} />
              </div>
              <span>INSTAGRAM PROFILE URL</span>
            </label>
            {formData.instagram && isValidUrl(formData.instagram) && (
              <a
                href={formData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-gold hover:underline"
              >
                <span>Test Link</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <div className="mt-3">
            <input
              type="url"
              value={formData.instagram}
              onChange={(e) => handleChange("instagram", e.target.value)}
              placeholder="https://www.instagram.com/your_username/"
              className="w-full border border-border/80 bg-navy/60 px-4 py-2.5 text-sm font-mono text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none"
            />
            {formData.instagram && !isValidUrl(formData.instagram) && (
              <p className="mt-1.5 text-[11px] text-red-400">Must be a valid URL starting with http:// or https://</p>
            )}
          </div>
        </div>

        {/* LinkedIn */}
        <div className="border border-border/60 bg-navy/30 p-5 transition-colors focus-within:border-gold/60">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 text-xs font-mono tracking-wider text-ivory">
              <div className="flex h-7 w-7 items-center justify-center border border-border/80 bg-charcoal text-gold">
                <Linkedin size={16} />
              </div>
              <span>LINKEDIN PROFILE URL</span>
            </label>
            {formData.linkedin && isValidUrl(formData.linkedin) && (
              <a
                href={formData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-gold hover:underline"
              >
                <span>Test Link</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <div className="mt-3">
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://www.linkedin.com/in/your_profile/"
              className="w-full border border-border/80 bg-navy/60 px-4 py-2.5 text-sm font-mono text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none"
            />
            {formData.linkedin && !isValidUrl(formData.linkedin) && (
              <p className="mt-1.5 text-[11px] text-red-400">Must be a valid URL starting with http:// or https://</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gold px-8 py-3.5 text-xs font-mono font-bold tracking-widest text-charcoal shadow-lg transition-all hover:bg-gold/90 hover:shadow-gold/20 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "SAVING TO SUPABASE..." : "SAVE SOCIAL LINKS"}
          </button>
        </div>
      </form>
    </div>
  );
}
