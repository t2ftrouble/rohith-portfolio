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
} from "lucide-react";
import type { ProjectCMSData } from "@/lib/project-cms";

interface AdminDashboardOverviewProps {
  projects: ProjectCMSData[];
  unreadEnquiriesCount: number;
  onNavigateTab: (
    tab:
      | "dashboard"
      | "projects"
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
  const publishedCount = projects.filter(
    (p) => p.publishStatus !== "DRAFT"
  ).length;
  const draftCount = projects.filter(
    (p) => p.publishStatus === "DRAFT"
  ).length;

  return (
    <div className="space-y-10">
      {/* 1. KEY METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <span className="title-card text-3xl md:text-4xl text-ivory">
              {projects.length}
            </span>
            <span className="text-xs text-muted-foreground">in database</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
            <span className="text-emerald-400">● {publishedCount} Published</span>
            {draftCount > 0 && <span className="text-amber-400">● {draftCount} Draft</span>}
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
            <span className="title-card text-3xl md:text-4xl text-ivory">
              {unreadEnquiriesCount}
            </span>
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

      {/* 2. QUICK ACTIONS GRID */}
      <div className="border border-border/70 bg-navy/20 p-6 md:p-8 rounded space-y-6">
        <div className="border-b border-border/60 pb-3 flex items-center justify-between">
          <div>
            <h3 className="title-card text-xl text-ivory">Quick Actions</h3>
            <p className="text-xs text-muted-foreground">
              Direct access to content editors and configurations
            </p>
          </div>
          <button
            onClick={onAddNewProject}
            className="label-track bg-gold px-5 py-3 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-all flex items-center gap-1.5 rounded cursor-pointer shadow-md"
          >
            <Plus size={14} />
            + New Project
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigateTab("projects")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <Film size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Manage Films</span>
            <span className="text-[10px] text-muted-foreground mt-1">
              {projects.length} Projects
            </span>
          </button>

          <button
            onClick={() => onNavigateTab("homepage")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <FileText size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Homepage CMS</span>
            <span className="text-[10px] text-muted-foreground mt-1">
              Copy & Philosophy
            </span>
          </button>

          <button
            onClick={() => onNavigateTab("featured")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <Sparkles size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Featured Work</span>
            <span className="text-[10px] text-muted-foreground mt-1">
              Select & Reorder
            </span>
          </button>

          <button
            onClick={() => onNavigateTab("showreel")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <Eye size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Showreel</span>
            <span className="text-[10px] text-muted-foreground mt-1">
              Video & Poster
            </span>
          </button>

          <button
            onClick={() => onNavigateTab("enquiries")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <Inbox size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Enquiries</span>
            <span className="text-[10px] text-muted-foreground mt-1">
              {unreadEnquiriesCount} Unread
            </span>
          </button>

          <button
            onClick={() => onNavigateTab("resume")}
            className="flex flex-col items-start p-4 bg-charcoal/80 border border-border/70 hover:border-gold/60 hover:bg-navy/40 transition-all rounded text-left group cursor-pointer"
          >
            <FileText size={18} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="title-card text-sm text-ivory">Resume PDF</span>
            <span className="text-[10px] text-muted-foreground mt-1">
              Upload / Replace
            </span>
          </button>
        </div>
      </div>

      {/* 3. RECENT PROJECTS SNAPSHOT */}
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
