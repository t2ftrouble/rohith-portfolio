import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  RefreshCw,
  Film,
  Share2,
  Image as ImageIcon,
  LayoutDashboard,
  FileText,
  Sparkles,
  Eye,
  Inbox,
  Search,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectList } from "@/components/admin/ProjectList";
import { SocialLinksForm } from "@/components/admin/SocialLinksForm";
import { SiteImagesForm } from "@/components/admin/SiteImagesForm";
import { AdminDashboardOverview } from "@/components/admin/AdminDashboardOverview";
import { HomepageContentForm } from "@/components/admin/HomepageContentForm";
import { FeaturedProjectsForm } from "@/components/admin/FeaturedProjectsForm";
import { ShowreelForm } from "@/components/admin/ShowreelForm";
import { EnquiriesInbox } from "@/components/admin/EnquiriesInbox";
import { ResumeManager } from "@/components/admin/ResumeManager";
import { SeoManagerForm } from "@/components/admin/SeoManagerForm";
import { CommentModerationForm } from "@/components/admin/CommentModerationForm";
import { getEnquiries } from "@/lib/enquiries";
import type { ProjectCMSData, ProjectFormData } from "@/lib/project-cms";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "@/lib/project-cms";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin CMS — Rohith V" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

export type AdminTab =
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
  | "seo";

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<ProjectCMSData[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectCMSData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadEnquiriesCount, setUnreadEnquiriesCount] = useState(0);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err: unknown) {
      console.error("Failed to load projects:", err);
      setError("Failed to load projects from Supabase. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const enquiries = await getEnquiries();
      const count = enquiries.filter((e) => e.status === "NEW").length;
      setUnreadEnquiriesCount(count);
    } catch {
      // Ignore background failure
    }
  }, []);

  // Check persistent session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/admin/verify", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          await Promise.all([loadProjects(), loadUnreadCount()]);
        }
      } catch (err) {
        console.warn("Session check failed:", err);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, [loadProjects, loadUnreadCount]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setPassword("");
        await Promise.all([loadProjects(), loadUnreadCount()]);
      } else {
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      setError("Login failed. Please check your network and try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsAuthenticated(false);
    setPassword("");
    setProjects([]);
    setEditingProject(null);
    setIsAdding(false);
  };

  const handleSave = async (projectData: ProjectFormData) => {
    setIsSaving(true);
    setError("");
    setSaveSuccess(null);

    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        setSaveSuccess(`✓ Project "${projectData.title}" updated successfully`);
      } else {
        await addProject(projectData);
        setSaveSuccess(`✓ Project "${projectData.title}" created successfully`);
      }
      await loadProjects();
      setEditingProject(null);
      setIsAdding(false);
    } catch (err: unknown) {
      console.error("Save error:", err);
      setError(err instanceof Error ? err.message : "Failed to save project. Check required fields.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (project: ProjectCMSData) => {
    const nextStatus = project.publishStatus === "DRAFT" ? "PUBLISHED" : "DRAFT";
    try {
      await updateProject(project.id, { publishStatus: nextStatus });
      setSaveSuccess(`✓ "${project.title}" is now ${nextStatus}`);
      await loadProjects();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to toggle publishing status");
    }
  };

  const handleDelete = async (id: string) => {
    const project = projects.find((p) => p.id === id);
    const title = project?.title || "this project";
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteProject(id);
      setSaveSuccess(`✓ Project "${title}" deleted successfully`);
      await loadProjects();
    } catch (err: unknown) {
      console.error("Delete error:", err);
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleEdit = (project: ProjectCMSData) => {
    setEditingProject(project);
    setIsAdding(false);
    setError("");
    setSaveSuccess(null);
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsAdding(false);
    setError("");
  };

  interface AdminNavItem {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: boolean;
  }

  const navItems: AdminNavItem[] = [
    { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { id: "projects", label: `PROJECTS (${projects.length})`, icon: Film },
    { id: "comments", label: "COMMENTS", icon: MessageSquare },
    { id: "media", label: "WEBSITE MEDIA", icon: ImageIcon },
    { id: "social", label: "SOCIAL LINKS", icon: Share2 },
    { id: "homepage", label: "HOMEPAGE", icon: FileText },
    { id: "featured", label: "FEATURED WORK", icon: Sparkles },
    { id: "showreel", label: "SHOWREEL", icon: Eye },
    {
      id: "enquiries",
      label: unreadEnquiriesCount > 0 ? `ENQUIRIES (${unreadEnquiriesCount})` : "ENQUIRIES",
      icon: Inbox,
      badge: unreadEnquiriesCount > 0,
    },
    { id: "resume", label: "RESUME", icon: FileText },
    { id: "seo", label: "SEO", icon: Search },
  ];

  if (isCheckingAuth) {
    return (
      <section className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="flex items-center gap-3 text-gold font-mono text-sm">
          <RefreshCw size={18} className="animate-spin" />
          <span>Verifying admin session...</span>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-charcoal flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <Reveal>
            <div className="border border-border bg-navy/40 p-8 shadow-2xl backdrop-blur-md">
              <div className="text-center">
                <p className="label-track text-gold">System Access</p>
                <h1 className="title-card mt-3 text-3xl text-ivory">Admin CMS</h1>
                <p className="mt-2 text-xs text-muted-foreground">
                  Sign in to manage projects, comments, showreel, resume, enquiries & SEO
                </p>
              </div>

              {error && (
                <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="label-track block text-xs text-muted-foreground"
                  >
                    Admin Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    placeholder="••••••••••••"
                    className="mt-2 w-full border border-border bg-charcoal px-4 py-3 text-sm text-ivory placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="label-track w-full bg-gold py-3.5 text-center !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg min-h-[44px]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Access Admin CMS →"
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-border/60 pt-6 text-center">
                <Link
                  to="/"
                  className="label-track !text-[9px] text-muted-foreground hover:text-gold transition-colors"
                >
                  ← Return to Public Portfolio
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-12 md:px-12 md:py-20">
        <Reveal>
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-border/60 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <p className="label-track text-gold">Admin CMS</p>
                {unreadEnquiriesCount > 0 && (
                  <span className="label-track !text-[8px] bg-amber-500 text-charcoal font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {unreadEnquiriesCount} NEW ENQUIRIES
                  </span>
                )}
              </div>
              <h1 className="title-card mt-2 text-3xl sm:text-4xl text-ivory md:text-5xl">
                Content Management
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Connected to Supabase. Real-time updates active across production.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={loadProjects}
                disabled={isLoading}
                className="label-track border border-border px-3.5 py-2.5 !text-[9px] text-ivory hover:text-gold hover:border-gold/60 transition-colors flex items-center gap-1.5 rounded min-h-[44px] cursor-pointer"
                title="Refresh projects from Supabase"
              >
                <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link
                to="/portfolio"
                target="_blank"
                className="label-track border border-gold/60 px-4 py-2.5 !text-[9px] !text-gold hover:bg-gold hover:!text-charcoal transition-colors rounded min-h-[44px] inline-flex items-center"
              >
                View Site ↗
              </Link>
              <button
                onClick={handleLogout}
                className="label-track border border-red-500/60 px-4 py-2.5 !text-[9px] !text-red-400 hover:bg-red-500/10 transition-colors rounded min-h-[44px] cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          {!isAdding && !editingProject && (
            <div className="mb-8">
              {/* Mobile Drawer */}
              <div className="md:hidden mb-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-full flex items-center justify-between p-3.5 bg-navy/60 border border-gold/40 rounded text-xs font-mono text-gold min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard size={14} />
                    <span>Tab: {activeTab.toUpperCase()}</span>
                  </span>
                  {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                </button>

                {mobileMenuOpen && (
                  <div className="mt-2 p-2 bg-navy/90 border border-border rounded space-y-1">
                    {navItems.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as AdminTab);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 text-left text-xs font-mono rounded min-h-[44px] ${
                          activeTab === tab.id
                            ? "bg-gold text-charcoal font-bold"
                            : "text-ivory/80 hover:bg-charcoal"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <tab.icon size={14} />
                          <span>{tab.label}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Tabs */}
              <div className="hidden md:flex flex-wrap items-center gap-1.5 border-b border-border/40 pb-3">
                {navItems.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AdminTab)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono tracking-wider transition-all rounded-sm cursor-pointer select-none min-h-[44px] ${
                      activeTab === tab.id
                        ? "border-b-2 border-gold text-gold font-bold bg-gold/10 shadow-sm"
                        : "text-muted-foreground hover:text-ivory hover:bg-navy/30"
                    }`}
                  >
                    <tab.icon size={14} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Reveal>

        {saveSuccess && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-sm flex items-center justify-between">
            <span>{saveSuccess}</span>
            <button onClick={() => setSaveSuccess(null)} className="text-xs hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-xs hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Sections */}
        {isAdding || editingProject ? (
          <ProjectForm
            project={editingProject}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        ) : activeTab === "dashboard" ? (
          <AdminDashboardOverview
            projects={projects}
            unreadEnquiriesCount={unreadEnquiriesCount}
            onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
            onAddNewProject={() => {
              setEditingProject(null);
              setIsAdding(true);
              setError("");
            }}
          />
        ) : activeTab === "comments" ? (
          <CommentModerationForm />
        ) : activeTab === "homepage" ? (
          <HomepageContentForm />
        ) : activeTab === "featured" ? (
          <FeaturedProjectsForm projects={projects} />
        ) : activeTab === "showreel" ? (
          <ShowreelForm />
        ) : activeTab === "enquiries" ? (
          <EnquiriesInbox onUnreadCountChange={setUnreadEnquiriesCount} />
        ) : activeTab === "resume" ? (
          <ResumeManager />
        ) : activeTab === "seo" ? (
          <SeoManagerForm />
        ) : activeTab === "social" ? (
          <SocialLinksForm />
        ) : activeTab === "media" ? (
          <SiteImagesForm />
        ) : (
          <>
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsAdding(true);
                  setError("");
                }}
                className="label-track bg-gold px-8 py-4 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-colors flex items-center gap-2 cursor-pointer shadow-lg min-h-[44px] rounded"
              >
                <Plus size={16} />
                Add New Project
              </button>
              <span className="label-track text-xs text-muted-foreground">
                {projects.length} {projects.length === 1 ? "Project" : "Projects"} in database
              </span>
            </div>

            <ProjectList
              projects={projects}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          </>
        )}
      </div>
    </section>
  );
}
