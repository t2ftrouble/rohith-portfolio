import { useState, useEffect } from "react";
import { Sparkles, Bot, Check, Copy, RefreshCw, Wand2, ShieldAlert, Cpu } from "lucide-react";

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
  const [provider, setProvider] = useState<"gemini" | "openai" | "local">("gemini");
  const [providerStatus, setProviderStatus] = useState<{
    geminiConfigured: boolean;
    openaiConfigured: boolean;
    localFallbackAvailable: boolean;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/ai-assistant", { credentials: "include" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setProviderStatus({
              geminiConfigured: data.geminiConfigured,
              openaiConfigured: data.openaiConfigured,
              localFallbackAvailable: true,
            });
            // Set provider default: Gemini if configured, otherwise local
            if (data.geminiConfigured) setProvider("gemini");
            else if (data.openaiConfigured) setProvider("openai");
            else setProvider("local");
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

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
          provider,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "AI generation failed");
      }

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
            <div>
              <h3 className="title-card text-2xl text-ivory">Personal AI Studio Assistant</h3>
              <p className="text-[10px] text-muted-foreground font-mono uppercase">Private Admin Tool • English-Only Generator</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="label-track border border-border px-3 py-1.5 !text-[9px] text-ivory hover:text-gold"
          >
            Close ✕
          </button>
        </div>

        {/* Provider Selector */}
        <div className="p-4 bg-charcoal/90 border border-border/80 rounded space-y-3">
          <div className="flex items-center justify-between">
            <span className="label-track text-gold !text-[10px] flex items-center gap-1.5">
              <Cpu size={12} /> SELECT AI ENGINE
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Active: <strong className="text-ivory uppercase">{provider}</strong>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setProvider("gemini")}
              className={`p-3 rounded border text-left transition-all cursor-pointer ${
                provider === "gemini"
                  ? "border-gold bg-gold/15 text-ivory"
                  : "border-border/70 bg-navy/30 text-ivory/70 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ivory">Gemini 1.5</span>
                <span className="text-[8px] font-mono text-gold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/30">
                  PRIMARY
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1 font-mono">
                {providerStatus?.geminiConfigured ? "● Configured" : "○ Key in .env needed"}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setProvider("openai")}
              className={`p-3 rounded border text-left transition-all cursor-pointer ${
                provider === "openai"
                  ? "border-gold bg-gold/15 text-ivory"
                  : "border-border/70 bg-navy/30 text-ivory/70 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ivory">GPT-4o Mini</span>
                <span className="text-[8px] font-mono text-muted-foreground bg-charcoal px-1.5 py-0.5 rounded border border-border">
                  OPTIONAL
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1 font-mono">
                {providerStatus?.openaiConfigured ? "● Configured" : "○ Key in .env needed"}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setProvider("local")}
              className={`p-3 rounded border text-left transition-all cursor-pointer ${
                provider === "local"
                  ? "border-gold bg-gold/15 text-ivory"
                  : "border-border/70 bg-navy/30 text-ivory/70 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ivory">Local Rules</span>
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  BUILT-IN
                </span>
              </div>
              <p className="text-[9px] text-emerald-400 mt-1 font-mono">
                ● 100% Ready (Free)
              </p>
            </button>
          </div>
        </div>

        <div className="p-3 bg-gold/10 border border-gold/40 text-gold text-xs rounded leading-relaxed">
          <strong>Multilingual Input:</strong> You can type notes or story fragments in <em>Tamil, Tanglish, Hindi, Malayalam, or English</em>. Output will strictly be translated and generated in <strong>English Only</strong> following Rohith's cinematic standard. AI will <strong>never</strong> auto-publish.
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded flex items-start gap-2">
            <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{error}</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                Tip: You can switch to the &quot;Local Rules&quot; button above to generate copy immediately without external cloud API keys.
              </p>
            </div>
          </div>
        )}

        {/* Input prompt */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-ivory/90">
            Raw Notes / Story Prompt (Any language):
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder='e.g. "one last day project ku story context and logline venum, silence and emotional tone focus pannunga" or "Make a director note focusing on sound design and pacing"'
            className="w-full bg-charcoal border border-border px-4 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none resize-none rounded"
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
                Generating Cinematic Copy ({provider.toUpperCase()})...
              </>
            ) : (
              <>
                <Wand2 size={14} />
                Generate 13 Cinematic Fields ({provider.toUpperCase()}) →
              </>
            )}
          </button>
        </div>

        {/* Generated Fields Preview & Acceptance */}
        {generatedData && (
          <div className="border border-gold/40 bg-charcoal/90 p-5 rounded space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="label-track text-gold">AI GENERATED PROPOSALS (REVIEW & EDIT)</span>
              <button
                type="button"
                onClick={handleApplyAll}
                className="label-track bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 !text-[9px] rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={12} /> Apply All To Project Form
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {/* Title & Logline */}
              {generatedData["title"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <span className="text-[10px] text-gold font-bold">1. PROJECT TITLE</span>
                  <p className="text-xs text-ivory font-bold">{String(generatedData["title"])}</p>
                </div>
              )}

              {generatedData["logline"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gold font-bold">2. LOGLINE</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("logline", String(generatedData["logline"]))}
                      className="text-[10px] text-muted-foreground hover:text-gold flex items-center gap-1"
                    >
                      {copiedKey === "logline" ? <Check size={10} /> : <Copy size={10} />} Copy
                    </button>
                  </div>
                  <p className="text-xs text-ivory italic font-serif">&ldquo;{String(generatedData["logline"])}&rdquo;</p>
                </div>
              )}

              {/* Short & Full Synopsis */}
              {generatedData["shortSynopsis"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <span className="text-[10px] text-gold font-bold">3. SHORT SYNOPSIS</span>
                  <p className="text-xs text-ivory/90 leading-relaxed">{String(generatedData["shortSynopsis"])}</p>
                </div>
              )}

              {generatedData["fullSynopsis"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <span className="text-[10px] text-gold font-bold">4. FULL SYNOPSIS</span>
                  <p className="text-xs text-ivory/90 leading-relaxed">{String(generatedData["fullSynopsis"])}</p>
                </div>
              )}

              {/* Director's Note */}
              {generatedData["directorNote"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <span className="text-[10px] text-gold font-bold">5. DIRECTOR&apos;S NOTE</span>
                  <p className="text-xs text-ivory/90 leading-relaxed italic font-serif">&ldquo;{String(generatedData["directorNote"])}&rdquo;</p>
                </div>
              )}

              {/* Story Context & Creative Approach */}
              {generatedData["storyContext"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <span className="text-[10px] text-gold font-bold">6. STORY & CONTEXT</span>
                  <p className="text-xs text-ivory/90 leading-relaxed">{String(generatedData["storyContext"])}</p>
                </div>
              )}

              {/* SEO Meta */}
              {generatedData["seoTitle"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <span className="text-[10px] text-gold font-bold">7. SEO META TITLE</span>
                  <p className="text-xs text-ivory font-mono">{String(generatedData["seoTitle"])}</p>
                </div>
              )}

              {generatedData["seoDescription"] && (
                <div className="border border-border/60 p-3 bg-navy/30 rounded space-y-1">
                  <span className="text-[10px] text-gold font-bold">8. SEO META DESCRIPTION</span>
                  <p className="text-xs text-ivory/80 font-mono">{String(generatedData["seoDescription"])}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
