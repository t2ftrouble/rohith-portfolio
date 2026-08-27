import { useState, useEffect } from "react";
import {
  Upload,
  RefreshCw,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
} from "lucide-react";
import {
  getResumeData,
  updateResumeData,
  defaultResumeData,
  type ResumeData,
} from "@/lib/resume";

export function ResumeManager() {
  const [resume, setResume] = useState<ResumeData>(defaultResumeData);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await getResumeData();
      setResume(data);
    } catch (err) {
      console.error("Failed to load resume:", err);
      setStatusMessage({
        type: "error",
        text: "Could not load resume config from storage.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      setStatusMessage({
        type: "error",
        text: "Please select a valid PDF file (*.pdf)",
      });
      return;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setStatusMessage({
        type: "error",
        text: "PDF is too large (maximum 10MB)",
      });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "resumes");

      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to upload resume PDF");
      }

      const data = await res.json();
      const updatedData: ResumeData = {
        enabled: true,
        url: data.url,
        filename: file.name,
        updatedAt: new Date().toISOString(),
        sizeBytes: file.size,
      };

      const saved = await updateResumeData(updatedData);
      setResume(saved);
      setStatusMessage({
        type: "success",
        text: `✓ Successfully uploaded & activated "${file.name}" on the website!`,
      });
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to upload resume",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleEnabled = async (enabled: boolean) => {
    setIsSaving(true);
    try {
      const saved = await updateResumeData({ ...resume, enabled });
      setResume(saved);
      setStatusMessage({
        type: "success",
        text: enabled
          ? "✓ Resume download button enabled on About page"
          : "⏸ Resume download button hidden from About page",
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: "Failed to update resume state",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset to default bundled PDF resume?")) {
      setIsSaving(true);
      try {
        const saved = await updateResumeData(defaultResumeData);
        setResume(saved);
        setStatusMessage({
          type: "success",
          text: "✓ Reset to default resume PDF",
        });
      } catch (err) {
        setStatusMessage({
          type: "error",
          text: "Failed to reset resume",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gold font-mono text-xs gap-3">
        <RefreshCw size={16} className="animate-spin" />
        <span>Loading resume manager...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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

      {/* CURRENT ACTIVE RESUME CARD */}
      <div className="border border-border/80 bg-navy/20 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-gold" />
            <h3 className="title-card text-xl text-ivory">Active Resume / CV</h3>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <span className="text-xs text-ivory/80 font-mono">Download Button:</span>
            <input
              type="checkbox"
              checked={resume.enabled}
              disabled={isSaving}
              onChange={(e) => handleToggleEnabled(e.target.checked)}
              className="h-4 w-4 accent-gold cursor-pointer"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 bg-charcoal/90 border border-border rounded">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2">
              <span className="label-track text-gold !text-[10px]">CURRENT FILE:</span>
              <span className="text-sm font-semibold text-ivory font-mono">
                {resume.filename}
              </span>
            </div>

            {resume.updatedAt && (
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(resume.updatedAt).toLocaleString()}
              </p>
            )}

            <p className="text-xs text-ivory/70">
              The &ldquo;DOWNLOAD RESUME (PDF)&rdquo; button on the About page will serve this file.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-2.5">
            <a
              href={resume.url}
              target="_blank"
              rel="noreferrer"
              className="label-track border border-gold/70 bg-gold/10 px-4 py-2.5 !text-[10px] text-gold hover:bg-gold hover:!text-charcoal transition-all text-center flex items-center justify-center gap-1.5 rounded min-h-[40px]"
            >
              <ExternalLink size={13} />
              Open / Preview PDF ↗
            </a>

            <label className="label-track bg-gold px-4 py-2.5 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-all text-center flex items-center justify-center gap-1.5 rounded min-h-[40px] cursor-pointer shadow-md">
              <Upload size={13} />
              <span>{isUploading ? "Uploading PDF..." : "Upload New PDF"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <button
          type="button"
          onClick={loadResume}
          className="label-track border border-border px-4 py-3 !text-[9px] text-ivory hover:text-gold hover:border-gold/60 transition-colors flex items-center gap-1.5 rounded cursor-pointer"
        >
          <RefreshCw size={12} />
          Reload Status
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="label-track border border-border px-4 py-3 !text-[9px] text-muted-foreground hover:text-red-400 hover:border-red-500/40 transition-colors flex items-center gap-1.5 rounded cursor-pointer"
        >
          <Trash2 size={12} />
          Reset to Default Resume
        </button>
      </div>
    </div>
  );
}
