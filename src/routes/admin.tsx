import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw, Film, Share2, Image as ImageIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectList } from "@/components/admin/ProjectList";
import { SocialLinksForm } from "@/components/admin/SocialLinksForm";
import { SiteImagesForm } from "@/components/admin/SiteImagesForm";
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
      { title: "Admin — Rohith V" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

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
  const [activeTab, setActiveTab] = useState<"projects" | "social" | "media">("projects");

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
          await loadProjects();
        }
      } catch (err) {
        console.warn("Session check failed:", err);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, [loadProjects]);

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
        await loadProjects();
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
      console.log("Saving project:", projectData);
      if (editingProject) {
        console.log("Updating project ID:", editingProject.id);
        await updateProject(editingProject.id, projectData);
        setSaveSuccess(`✓ Project "${projectData.title}" updated successfully`);
      } else {
        console.log("Creating new project");
        await addProject(projectData);
        setSaveSuccess(`✓ Project "${projectData.title}" published successfully`);
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

  // Loading state while checking auth
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

  // Login screen
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
                  Sign in to edit portfolio projects, media assets & settings
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
                  className="label-track w-full bg-gold py-3.5 text-center !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
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

  // Authenticated Admin Dashboard
  return (
    <section className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
        <Reveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-border/60 pb-6">
            <div>
              <p className="label-track text-gold">Admin CMS</p>
              <h1 className="title-card mt-2 text-4xl text-ivory md:text-6xl">
                Content Management
              </h1>
              <p className="mt-2 text-xs text-muted-foreground md:text-sm">
                Connected to Supabase. Edits update production instantly.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadProjects}
                disabled={isLoading}
                className="label-track border border-border px-4 py-3 !text-[9px] text-ivory hover:text-gold hover:border-gold/60 transition-colors flex items-center gap-1.5"
                title="Refresh projects from Supabase"
              >
                <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
              <Link
                to="/portfolio"
                className="label-track border border-gold/60 px-5 py-3 !text-[9px] !text-gold hover:bg-gold hover:!text-charcoal transition-colors"
              >
                View Portfolio →
              </Link>
              <button
                onClick={handleLogout}
                className="label-track border border-red-500/60 px-4 py-3 !text-[9px] !text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          {!isAdding && !editingProject && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-8 border-b border-border/40 pb-4">
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  activeTab === "projects"
                    ? "border-b-2 border-gold text-gold font-bold bg-gold/5"
                    : "text-muted-foreground hover:text-ivory"
                }`}
              >
                <Film size={15} />
                <span>FILM & VFX PROJECTS ({projects.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  activeTab === "media"
                    ? "border-b-2 border-gold text-gold font-bold bg-gold/5"
                    : "text-muted-foreground hover:text-ivory"
                }`}
              >
                <ImageIcon size={15} />
                <span>WEBSITE MEDIA & ASSETS</span>
              </button>
              <button
                onClick={() => setActiveTab("social")}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  activeTab === "social"
                    ? "border-b-2 border-gold text-gold font-bold bg-gold/5"
                    : "text-muted-foreground hover:text-ivory"
                }`}
              >
                <Share2 size={15} />
                <span>SOCIAL MEDIA LINKS</span>
              </button>
            </div>
          )}
        </Reveal>

        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm flex items-center justify-between">
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

        {isAdding || editingProject ? (
          <ProjectForm
            project={editingProject}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        ) : activeTab === "social" ? (
          <SocialLinksForm />
        ) : activeTab === "media" ? (
          <SiteImagesForm />
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsAdding(true);
                  setError("");
                }}
                className="label-track bg-gold px-8 py-4 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
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
            />
          </>
        )}
      </div>
    </section>
  );
}
