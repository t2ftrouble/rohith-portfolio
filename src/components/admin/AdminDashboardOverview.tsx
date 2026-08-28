import { useEffect, useState } from "react";
import {
  Film,
  Image as ImageIcon,
  Share2,
  Inbox,
  FileText,
  Sparkles,
  Search,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Eye,
  MessageSquare,
  Cpu,
  ShieldCheck,
  Radio,
} from "lucide-react";
import type { ProjectCMSData } from "@/lib/project-cms";

interface AdminDashboardOverviewProps {
  projects: ProjectCMSData[];
  unreadEnquiriesCount: number;
  onNavigateTab: (
    tab:
      | "dashboard"
      | "projects"
      | "comments"
      | "media"
      | "social"
      | "homepage"
      | "featured"
      | "showreel"
      | "enquiries"
      | "resume"
      | "seo"
  ) => void;
  onAddNewProject: () => void;
}

export function AdminDashboardOverview({
  projects,
  unreadEnquiriesCount,
  onNavigateTab,
  onAddNewProject,
}: AdminDashboardOverviewProps) {
  const [aiStatus, setAiStatus] = useState<{
    geminiConfigured: boolean;
    openaiConfigured: boolean;
    localFallbackAvailable: boolean;
    activeDefaultProvider: string;
  } | null>(null);

  const [pendingCommentsCount, setPendingCommentsCount] = useState<number>(0);

  useEffect(() => {
    // Load AI configuration status from secure server route
    fetch("/api/ai-assistant", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAiStatus(data);
      })
      .catch(() => {});

    // Load pending comments count
    fetch("/api/comments?all=true", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.comments)) {
          const pending = data.comments.filter((c: any) => c.status === "PENDING").length;
          setPendingCommentsCount(pending);
        }
      })
      .catch(() => {});
  }, []);

  const publishedCount = projects.filter((p) => p.publishStatus !== "DRAFT").length;
  const draftCount = projects.filter((p) => p.publishStatus === "DRAFT").length;

  return (
    <div className="space-y-10">
      {/* 1. KEY METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* TOTAL PROJECTS */}
        <div
          onClick={() => onNavigateTab("projects")}
          className="border border-border/80 bg-navy/30 p-5 rounded hover:border-gold/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="label-track text-gold !text-[10px]">TOTAL PROJECTS</span>
            <Film size={16} className="text-gold/60 group-hover:text-gold transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="title-card text-3xl md:text-4xl text-ivory">{projects.length}</span>
            <span className="text-xs text-muted-foreground">films</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
            <span className="text-emerald-400">● {publishedCount} Published</span>
            {draftCount > 0 && <span className="text-amber-400">● {draftCount} Draft</span>}
          </div>
        </div>

        {/* COMMENTS & MODERATION */}
        <div
          onClick={() => onNavigateTab("comments")}
          className="border border-border/80 bg-navy/30 p-5 rounded hover:border-gold/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="label-track text-gold !text-[10px]">COMMENTS QUEUE</span>
            <MessageSquare size={16} className="text-gold/60 group-hover:text-gold transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="title-card text-3xl md:text-4xl text-ivory">{pendingCommentsCount}</span>
            <span className="text-xs text-muted-foreground">pending review</span>
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground font-mono">
            {pendingCommentsCount > 0 ? (
              <span className="text-amber-400 font-bold animate-pulse">Needs approval ↗</span>
            ) : (
              <span className="text-emerald-400">Moderation clear ✓</span>
            )}
          </div>
        </div>

        {/* ENQUIRIES */}
        <div
          onClick={() => onNavigateTab("enquiries")}
          className="border border-border/80 bg-navy/30 p-5 rounded hover:border-gold/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="label-track text-gold !text-[10px]">NEW ENQUIRIES</span>
            <Inbox size={16} className="text-gold/60 group-hover:text-gold transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="title-card text-3xl md:text-4xl text-ivory">{unreadEnquiriesCount}</span>
            <span className="text-xs text-muted-foreground">new messages</span>
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground font-mono">
            {unreadEnquiriesCount > 0 ? (
              <span className="text-amber-400 font-bold">Needs attention ↗</span>
            ) : (
              <span className="text-emerald-400">Inbox all caught up ✓</span>
            )}
          </div>
        </div>

        {/* WEBSITE MEDIA & ASSETS */}
        <div
          onClick={() => onNavigateTab("media")}
          className="border border-border/80 bg-navy/30 p-5 rounded hover:border-gold/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="label-track text-gold !text-[10px]">WEBSITE MEDIA</span>
            <ImageIcon size={16} className="text-gold/60 group-hover:text-gold transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="title-card text-3xl md:text-4xl text-ivory">Active</span>
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground font-mono">
            Supabase Cloud Storage ✓
          </div>
        </div>

        {/* RESUME & SEO STATUS */}
        <div
          onClick={() => onNavigateTab("seo")}
          className="border border-border/80 bg-navy/30 p-5 rounded hover:border-gold/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="label-track text-gold !text-[10px]">SEO & SYSTEM</span>
            <Search size={16} className="text-gold/60 group-hover:text-gold transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="title-card text-3xl md:text-4xl text-ivory">Active</span>
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground font-mono">
            SSR Meta Rendering ✓
          </div>
        </div>
      </div>

      {/* 2. AI STUDIO ENGINE & GOOGLE AUTH STATUS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI STATUS */}
        <div className="border border-border/80 bg-navy/20 p-5 rounded space-y-3">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="label-track text-gold flex items-center gap-1.5">
              <Cpu size={14} /> AI STUDIO ENGINE STATUS
            </span>
            <span className="text-[10px] text-muted-foreground font-mono uppercase">Private Admin Only</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
            <div className="p-2.5 bg-charcoal/80 rounded border border-border/60">
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${aiStatus?.geminiConfigured ? "bg-emerald-400" : "bg-zinc-500"}`} />
                <span className="font-bold text-ivory text-[11px]">Gemini 1.5</span>
              </div>
              <p className="text-[9px] text-muted-foreground font-mono mt-1">
                {aiStatus?.geminiConfigured ? "● Configured (Primary)" : "○ Key in .env needed"}
              </p>
            </div>

            <div className="p-2.5 bg-charcoal/80 rounded border border-border/60">
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${aiStatus?.openaiConfigured ? "bg-emerald-400" : "bg-zinc-500"}`} />
                <span className="font-bold text-ivory text-[11px]">GPT-4o Mini</span>
              </div>
              <p className="text-[9px] text-muted-foreground font-mono mt-1">
                {aiStatus?.openaiConfigured ? "● Configured (Optional)" : "○ Key in .env needed"}
              </p>
            </div>

            <div className="p-2.5 bg-charcoal/80 rounded border border-border/60">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-ivory text-[11px]">Local Engine</span>
              </div>
              <p className="text-[9px] text-emerald-400 font-mono mt-1">
                ● Available (Free)
              </p>
            </div>
          </div>
        </div>

        {/* GOOGLE SIGN-IN STATUS */}
        <div className="border border-border/80 bg-navy/20 p-5 rounded space-y-3">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="label-track text-gold flex items-center gap-1.5">
              <ShieldCheck size={14} /> PUBLIC GOOGLE AUTH STATUS
            </span>
            <span className="text-[10px] text-muted-foreground font-mono uppercase">Supabase Auth</span>
          </div>

          <div className="p-3 bg-charcoal/80 rounded border border-border/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ivory">Google OAuth Provider:</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ● SUPABASE READY
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Google Sign-In is enabled in Project Comments. If cloud credentials are missing in Supabase, the fallback identity prompt ensures unbroken visitor flow.
            </p>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS GRID */}
      <div className="border border-border/70 bg-navy/20 p-6 md:p-8 rounded space-y-6">
        <div className="border-b border-border/60 pb-3 flex items-center justify-between">
          <div>
            <h3 className="title-card text-xl text-ivory">Quick Actions</h3>
            <p className="text-xs text-muted-foreground">
              Direct access to content editors, AI Studio, and moderation queues
            </p>
          </div>
          <button
            onClick={onAddNewProject}
            className="label-track bg-gold px-5 py-3 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-all flex items-center gap-1.5 rounded cursor-pointer shadow-md"
          >
            <Plus size={14} />
            + New Project (With AI)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigateTab("projects")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <Film size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Manage Films</span>
            <span className="text-[10px] text-muted-foreground mt-1">{projects.length} Projects</span>
          </button>

          <button
            onClick={() => onNavigateTab("comments")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <MessageSquare size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Comments</span>
            <span className="text-[10px] text-muted-foreground mt-1">
              {pendingCommentsCount > 0 ? `${pendingCommentsCount} Pending` : "Moderation"}
            </span>
          </button>

          <button
            onClick={() => onNavigateTab("homepage")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <FileText size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Homepage CMS</span>
            <span className="text-[10px] text-muted-foreground mt-1">Copy & Philosophy</span>
          </button>

          <button
            onClick={() => onNavigateTab("featured")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <Sparkles size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Featured Work</span>
            <span className="text-[10px] text-muted-foreground mt-1">Select & Reorder</span>
          </button>

          <button
            onClick={() => onNavigateTab("showreel")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <Eye size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Showreel</span>
            <span className="text-[10px] text-muted-foreground mt-1">Video & Poster</span>
          </button>

          <button
            onClick={() => onNavigateTab("enquiries")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <Inbox size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Enquiries</span>
            <span className="text-[10px] text-muted-foreground mt-1">
              {unreadEnquiriesCount > 0 ? `${unreadEnquiriesCount} Unread` : "Inbox"}
            </span>
          </button>
        </div>
      </div>

      {/* 4. RECENT PROJECTS SNAPSHOT */}
      <div className="border border-border/80 bg-navy/20 p-6 md:p-8 rounded space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="title-card text-lg text-ivory">Recent Projects Overview</h3>
          <button
            onClick={() => onNavigateTab("projects")}
            className="label-track !text-[9px] text-gold hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All Projects →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onNavigateTab("projects")}
              className="p-4 bg-charcoal/80 border border-border/70 hover:border-gold/50 transition-colors rounded cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="label-track text-gold font-bold">{p.number}</span>
                {p.publishStatus === "DRAFT" ? (
                  <span className="text-[9px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                    Draft
                  </span>
                ) : (
                  <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/30">
                    Published
                  </span>
                )}
              </div>
              <h4 className="title-card text-base text-ivory mt-2 truncate">{p.title}</h4>
              <p className="label-track text-muted-foreground !text-[9px] mt-1">{p.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
