import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Play,
  Upload,
  Eye,
  Film,
} from "lucide-react";
import {
  getShowreel,
  updateShowreel,
  defaultShowreel,
  type ShowreelData,
} from "@/lib/showreel";
import { resolveImageUrl } from "@/lib/asset-resolver";

export function ShowreelForm() {
  const [showreel, setShowreel] = useState<ShowreelData>(defaultShowreel);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadShowreel();
  }, []);

  const loadShowreel = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await getShowreel();
      setShowreel(data);
    } catch (err) {
      console.error("Failed to load showreel config:", err);
      setStatusMessage({
        type: "error",
        text: "Could not load showreel configuration from storage.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      setStatusMessage({
        type: "error",
        text: "Please select a valid image file (JPG, PNG, WEBP)",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "showreel");

      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to upload showreel thumbnail");
      }

      const data = await res.json();
      setShowreel((prev) => ({ ...prev, posterImage: data.url }));
      setStatusMessage({
        type: "success",
        text: "✓ Showreel poster image uploaded successfully!",
      });
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const saved = await updateShowreel(showreel);
      setShowreel(saved);
      setStatusMessage({
        type: "success",
        text: "✓ Showreel settings saved and active on website!",
      });
    } catch (err: unknown) {
      console.error("Failed to save showreel:", err);
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save showreel",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset showreel to default configuration?")) {
      setShowreel(defaultShowreel);
      setStatusMessage(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gold font-mono text-xs gap-3">
        <RefreshCw size={16} className="animate-spin" />
        <span>Loading showreel configuration...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
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

      {/* SHOWREEL CONFIGURATION */}
      <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <Film size={20} className="text-gold" />
            <h3 className="title-card text-xl text-ivory">Cinematic Showreel</h3>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <span className="text-xs text-ivory/80 font-mono">Section Enabled:</span>
            <input
              type="checkbox"
              checked={showreel.enabled}
              onChange={(e) => setShowreel({ ...showreel, enabled: e.target.checked })}
              className="h-4 w-4 accent-gold cursor-pointer"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Showreel Title <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              value={showreel.title}
              onChange={(e) => setShowreel({ ...showreel, title: e.target.value })}
              required
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. VFX Showreel"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Discipline / Category Tag
            </label>
            <input
              type="text"
              value={showreel.category}
              onChange={(e) => setShowreel({ ...showreel, category: e.target.value })}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. VFX / CG"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              YouTube Video ID (11 characters) <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              value={showreel.videoId}
              onChange={(e) => {
                const val = e.target.value.trim();
                const match = val.match(
                  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
                );
                setShowreel({ ...showreel, videoId: match && match[1] ? match[1] : val });
              }}
              required
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none font-mono"
              placeholder="e.g. lYLTsC9RM9U"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              You can paste either the full YouTube URL or the 11-char ID.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Optional Direct Video / Fallback URL
            </label>
            <input
              type="text"
              value={showreel.videoUrl || ""}
              onChange={(e) => setShowreel({ ...showreel, videoUrl: e.target.value })}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none font-mono text-xs"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-ivory/90 mb-2">
              Showreel Description
            </label>
            <textarea
              value={showreel.description}
              onChange={(e) => setShowreel({ ...showreel, description: e.target.value })}
              rows={2}
              className="w-full bg-charcoal border border-border px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none resize-none leading-relaxed"
              placeholder="Short description beneath the showreel title..."
            />
          </div>

          {/* THUMBNAIL / POSTER */}
          <div className="md:col-span-2 space-y-3 pt-4 border-t border-border/40">
            <label className="block text-xs font-semibold text-gold uppercase tracking-wider">
              Showreel Thumbnail / Poster (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4">
                {showreel.posterImage ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded border border-border">
                    <img
                      src={resolveImageUrl(showreel.posterImage)}
                      alt="Showreel poster"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-charcoal flex flex-col items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded p-4 text-center">
                    <Play size={20} className="mb-1 text-gold/60" />
                    <span>Uses default video thumbnail</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-8 space-y-3">
                <input
                  type="text"
                  value={showreel.posterImage || ""}
                  onChange={(e) => setShowreel({ ...showreel, posterImage: e.target.value })}
                  className="w-full bg-charcoal border border-border px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none font-mono"
                  placeholder="https://... or select file below"
                />

                <div className="flex items-center gap-3">
                  <label className="label-track border border-border/80 bg-navy px-4 py-2.5 !text-[10px] text-ivory hover:border-gold hover:text-gold transition-colors flex items-center gap-2 rounded cursor-pointer">
                    <Upload size={14} />
                    <span>{isUploading ? "Uploading..." : "Upload Poster Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f);
                      }}
                    />
                  </label>

                  {showreel.posterImage && (
                    <button
                      type="button"
                      onClick={() => setShowreel({ ...showreel, posterImage: "" })}
                      className="label-track border border-red-500/40 px-3 py-2.5 !text-[9px] text-red-400 hover:bg-red-500/10 transition-colors rounded"
                    >
                      Remove Poster
                    </button>
                  )}
                </div>
              </div>
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
              SAVE SHOWREEL CONFIG
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
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
