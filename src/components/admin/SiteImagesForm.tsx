import { useState, useEffect } from "react";
import {
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import {
  getSiteImages,
  updateSiteImages,
  defaultSiteImages,
  siteImageDefinitions,
  type SiteImagesData,
} from "@/lib/site-images";
import { resolveImageUrl, getImageLabel } from "@/lib/asset-resolver";

export function SiteImagesForm() {
  const [images, setImages] = useState<SiteImagesData>(defaultSiteImages);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getSiteImages();
      setImages(data);
    } catch (err: unknown) {
      console.error("Failed to load site images:", err);
      setErrorMessage("Could not load image configuration from Supabase.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (key: keyof SiteImagesData, value: string) => {
    setImages((prev) => ({ ...prev, [key]: value }));
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleResetToDefault = (key: keyof SiteImagesData) => {
    setImages((prev) => ({ ...prev, [key]: defaultSiteImages[key] }));
    setSuccessMessage(null);
  };

  const handleFileUpload = async (key: keyof SiteImagesData, file: File) => {
    setUploadingKey(key);
    setErrorMessage(null);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "site");

      const response = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: uploadData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(errJson.error || "Upload failed");
      }

      const data = await response.json();
      if (!data.url) {
        throw new Error("No URL returned from upload server");
      }

      setImages((prev) => ({ ...prev, [key]: data.url }));
      setSuccessMessage(`✓ Uploaded new image for ${key} to Supabase Storage`);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateSiteImages(images);
      setSuccessMessage("✓ All website media assets updated and persisted in Supabase successfully!");
      // Dispatch custom event to notify open tabs/components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-images-updated", { detail: images }));
      }
    } catch (err: unknown) {
      console.error("Save error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to update website images");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <RefreshCw size={24} className="animate-spin text-gold" />
        <span className="label-track text-xs">Loading website media configuration...</span>
      </div>
    );
  }

  return (
    <div className="border border-border/80 bg-navy/20 p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6 mb-8">
        <div>
          <p className="label-track text-gold">Global Media Management</p>
          <h2 className="title-card mt-2 text-2xl text-ivory md:text-3xl">Website Media & Images</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Replace and manage images across the Homepage, About page, and Digital Marketing sections.
          </p>
        </div>

        <button
          type="button"
          onClick={loadImages}
          className="label-track self-start sm:self-auto border border-border px-4 py-2.5 !text-[9px] text-ivory hover:text-gold hover:border-gold/60 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {successMessage && (
        <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs flex items-center gap-3">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs flex items-center gap-3">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid gap-8 md:grid-cols-2">
          {siteImageDefinitions.map((def) => {
            const currentVal = images[def.key];
            const resolved = resolveImageUrl(currentVal);
            const labelText = getImageLabel(currentVal);
            const isUploadingThis = uploadingKey === def.key;

            return (
              <div
                key={def.key}
                className="border border-border/70 bg-navy/30 p-6 flex flex-col justify-between group hover:border-gold/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="label-track !text-[9px] text-gold font-mono">
                      {def.category.toUpperCase()}
                    </span>
                    <span className="label-track !text-[8px] text-muted-foreground">
                      RATIO: {def.aspectRatio}
                    </span>
                  </div>

                  <h3 className="title-card text-lg text-ivory group-hover:text-gold transition-colors">
                    {def.label}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {def.description}
                  </p>

                  {/* Image Preview Box */}
                  <div className="mt-5 relative aspect-video w-full overflow-hidden bg-charcoal border border-border/80 rounded-xs">
                    {resolved ? (
                      <img
                        src={resolved}
                        alt={def.label}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                        <ImageIcon size={24} className="opacity-40" />
                      </div>
                    )}
                    <div className="vignette pointer-events-none opacity-40" />
                    
                    {isUploadingThis && (
                      <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-gold">
                        <RefreshCw size={20} className="animate-spin" />
                        <span className="label-track !text-[8px]">Uploading to Supabase...</span>
                      </div>
                    )}
                  </div>

                  {/* Filename / URL indicator */}
                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <span className="truncate max-w-[280px]" title={labelText}>
                      {labelText}
                    </span>
                    {resolved && (
                      <a
                        href={resolved}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold hover:underline flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  {/* URL Text Input */}
                  <div className="mt-4">
                    <label className="label-track block !text-[8px] text-muted-foreground mb-1.5">
                      Image URL / Path
                    </label>
                    <input
                      type="text"
                      value={currentVal}
                      onChange={(e) => handleUrlChange(def.key, e.target.value)}
                      placeholder="https://... or /src/assets/..."
                      className="w-full border border-border bg-charcoal px-3 py-2 text-xs text-ivory placeholder:text-muted-foreground/30 focus:border-gold focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Actions: Upload New & Reset */}
                <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between gap-3">
                  <label className="label-track border border-gold/60 bg-gold/5 px-4 py-2.5 !text-[9px] !text-gold hover:bg-gold hover:!text-charcoal transition-all flex items-center gap-1.5 cursor-pointer">
                    <Upload size={12} />
                    <span>Upload New</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingThis}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(def.key, file);
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleResetToDefault(def.key)}
                    title="Reset to default asset"
                    className="label-track border border-border px-3 py-2.5 !text-[8px] text-muted-foreground hover:text-ivory hover:border-border/80 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw size={10} />
                    <span>Default</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Save Button */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Changes save to Supabase Storage configuration and update the live website immediately.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="label-track bg-gold px-10 py-4 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            {isSaving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>SAVING TO SUPABASE...</span>
              </>
            ) : (
              <span>SAVE & UPDATE WEBSITE IMAGES →</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
