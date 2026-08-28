import { useState } from "react";
import { Sparkles, Bot, Check, Copy, RefreshCw, Wand2 } from "lucide-react";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectContext: Record<string, any>;
  onApplyFields: (generatedFields: Record<string, any>) => void;
}

export function AIAssistantModal({
  isOpen,
  onClose,
  projectContext,
  onApplyFields,
}: AIAssistantModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          prompt: prompt.trim(),
          projectContext,
          type: "all",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "AI Generation failed" }));
        throw new Error(err.error || "AI generation failed");
      }

      const data = await res.json();
      setGeneratedData(data.result);
    } catch (err: any) {
      setError(err.message || "Failed to generate copy");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyAll = () => {
    if (!generatedData) return;
    onApplyFields(generatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded border border-gold/60 bg-navy/95 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-gold h-5 w-5" />
            <h3 className="title-card text-2xl text-ivory">AI Content & SEO Assistant</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="label-track border border-border px-3 py-1.5 !text-[9px] text-ivory hover:text-gold"
          >
            Close ✕
          </button>
        </div>

        <div className="p-3 bg-gold/10 border border-gold/40 text-gold text-xs rounded leading-relaxed">
          <strong>Tip:</strong> You can type in <em>Tamil, Tanglish, Hindi, Malayalam, or English</em>. Output will strictly be generated in <strong>English Only</strong> following Rohith's cinematic standard. AI will <strong>never</strong> auto-publish without your review.
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded">
            {error}
          </div>
        )}

        {/* Input prompt */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-ivory/90">
            Prompt / Instructions (Optional):
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder='e.g. "one last day project ku seo description venum cinematic ah irukanum" or "Make a director note focusing on sound and silence"'
            className="w-full bg-charcoal border border-border px-4 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none resize-none"
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="label-track w-full flex items-center justify-center gap-2 bg-gold py-3 text-center !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-all rounded cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Crafting Cinematic Copy...
              </>
            ) : (
              <>
                <Wand2 size={14} />
                Generate SEO, Logline, Synopsis & Director's Note →
              </>
            )}
          </button>
        </div>

        {/* Generated Fields Preview & Acceptance */}
        {generatedData && (
          <div className="border border-gold/40 bg-charcoal/90 p-5 rounded space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="label-track text-gold">AI GENERATED PROPOSALS (PREVIEW & EDIT)</span>
              <button
                type="button"
                onClick={handleApplyAll}
                className="label-track bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 !text-[9px] rounded font-bold transition-all flex items-center gap-1.5"
              >
                <Check size={12} /> Apply All To Project Form
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {/* Logline */}
              {generatedData["logline"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gold font-bold">1-LINE LOGLINE</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("logline", String(generatedData["logline"]))}
                      className="text-[10px] text-muted-foreground hover:text-gold flex items-center gap-1"
                    >
                      {copiedKey === "logline" ? <Check size={10} /> : <Copy size={10} />} Copy
                    </button>
                  </div>
                  <p className="text-xs text-ivory italic font-serif">"{String(generatedData["logline"])}"</p>
                </div>
              )}

              {/* Synopsis */}
              {generatedData["synopsis"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gold font-bold">SYNOPSIS</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("synopsis", String(generatedData["synopsis"]))}
                      className="text-[10px] text-muted-foreground hover:text-gold flex items-center gap-1"
                    >
                      {copiedKey === "synopsis" ? <Check size={10} /> : <Copy size={10} />} Copy
                    </button>
                  </div>
                  <p className="text-xs text-ivory/90 leading-relaxed">{String(generatedData["synopsis"])}</p>
                </div>
              )}

              {/* Director's Note */}
              {generatedData["directorNote"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gold font-bold">DIRECTOR'S NOTE</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("directorNote", String(generatedData["directorNote"]))}
                      className="text-[10px] text-muted-foreground hover:text-gold flex items-center gap-1"
                    >
                      {copiedKey === "directorNote" ? <Check size={10} /> : <Copy size={10} />} Copy
                    </button>
                  </div>
                  <p className="text-xs text-ivory/90 leading-relaxed italic">"{String(generatedData["directorNote"])}"</p>
                </div>
              )}

              {/* SEO Meta Description */}
              {generatedData["metaDescription"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gold font-bold">SEO META DESCRIPTION</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("metaDescription", String(generatedData["metaDescription"]))}
                      className="text-[10px] text-muted-foreground hover:text-gold flex items-center gap-1"
                    >
                      {copiedKey === "metaDescription" ? <Check size={10} /> : <Copy size={10} />} Copy
                    </button>
                  </div>
                  <p className="text-xs text-ivory/80 font-mono">{String(generatedData["metaDescription"])}</p>
                </div>
              )}

              {/* Keywords */}
              {generatedData["keywords"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gold font-bold">SEO KEYWORDS</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("keywords", String(generatedData["keywords"]))}
                      className="text-[10px] text-muted-foreground hover:text-gold flex items-center gap-1"
                    >
                      {copiedKey === "keywords" ? <Check size={10} /> : <Copy size={10} />} Copy
                    </button>
                  </div>
                  <p className="text-xs text-ivory/80 font-mono">{String(generatedData["keywords"])}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
