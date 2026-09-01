import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Film,
  Scissors,
  Play,
  Edit2,
  Trash2,
  Copy,
  Eye,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  SlidersHorizontal,
  Video,
  Sparkles,
} from "lucide-react";
import type { ProjectCMSData, ProjectFormData } from "@/lib/project-cms";
import type { EditingProjectCMSData, EditingProjectFormData } from "@/lib/editing-projects-cms";
import {
  fetchEditingProjectsFromApi,
  createEditingProject,
  updateEditingProject,
  deleteEditingProject,
  duplicateEditingProject,
  reorderEditingProjects,
} from "@/lib/editing-projects-cms";
import { resolveImageUrl, getImageLabel } from "@/lib/asset-resolver";
import { ProjectForm } from "./ProjectForm";
import { EditingProjectEditorModal } from "./EditingProjectEditorModal";
import { EditingProjectPreviewModal } from "./EditingProjectPreviewModal";

interface ProjectsWorkspaceProps {
  filmProjects: ProjectCMSData[];
  isLoadingFilm: boolean;
  onRefreshFilm: () => Promise<void>;
  onSaveFilm: (data: ProjectFormData) => Promise<void>;
  onDeleteFilm: (id: string) => Promise<void>;
  onTogglePublishFilm: (project: ProjectCMSData) => Promise<void>;
  isSavingFilm: boolean;
}

export function ProjectsWorkspace({
  filmProjects,
  isLoadingFilm,
  onRefreshFilm,
  onSaveFilm,
  onDeleteFilm,
  onTogglePublishFilm,
  isSavingFilm,
}: ProjectsWorkspaceProps) {
  // Editing Projects State
  const [editingProjects, setEditingProjects] = useState<EditingProjectCMSData[]>([]);
  const [isLoadingEditing, setIsLoadingEditing] = useState(true);
  const [editingError, setEditingError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active Editors
  const [editingFilmProject, setEditingFilmProject] = useState<ProjectCMSData | null>(null);
  const [isAddingFilm, setIsAddingFilm] = useState(false);

  const [activeEditingProjectModal, setActiveEditingProjectModal] = useState<EditingProjectCMSData | null>(null);
  const [isAddingEditingModal, setIsAddingEditingModal] = useState(false);
  const [isSavingEditing, setIsSavingEditing] = useState(false);

  // Live Preview Modal for Editing Projects
  const [previewEditingProject, setPreviewEditingProject] = useState<EditingProjectFormData | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSectionFilter, setActiveSectionFilter] = useState<"all" | "film" | "editing">("all");

  const loadEditingProjects = useCallback(async () => {
    setIsLoadingEditing(true);
    setEditingError(null);
    try {
      const data = await fetchEditingProjectsFromApi(true);
      setEditingProjects(data);
    } catch (err) {
      console.warn("Editing projects load fallback:", err);
    } finally {
      setIsLoadingEditing(false);
    }
  }, []);

  useEffect(() => {
    loadEditingProjects();
  }, [loadEditingProjects]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Editing Project Handlers
  const handleSaveEditingProject = async (formData: EditingProjectFormData) => {
    setIsSavingEditing(true);
    try {
      if (activeEditingProjectModal) {
        await updateEditingProject(activeEditingProjectModal.id, formData);
        showSuccess(`✓ Editing project "${formData.title}" updated successfully`);
      } else {
        await createEditingProject(formData);
        showSuccess(`✓ Editing project "${formData.title}" created successfully`);
      }
      await loadEditingProjects();
      setActiveEditingProjectModal(null);
      setIsAddingEditingModal(false);
    } catch (err) {
      console.error("Save editing project error:", err);
      alert(err instanceof Error ? err.message : "Failed to save editing project");
    } finally {
      setIsSavingEditing(false);
    }
  };

  const handleDeleteEditingProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete editing project "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteEditingProject(id);
      showSuccess(`✓ Deleted "${title}"`);
      await loadEditingProjects();
    } catch (err) {
      setEditingError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleDuplicateEditingProject = async (id: string) => {
    try {
      await duplicateEditingProject(id);
      showSuccess("✓ Project duplicated successfully as Draft");
      await loadEditingProjects();
    } catch (err) {
      setEditingError("Failed to duplicate project");
    }
  };

  const handleTogglePublishEditingProject = async (project: EditingProjectCMSData) => {
    try {
      await updateEditingProject(project.id, { published: !project.published });
      showSuccess(`✓ "${project.title}" is now ${!project.published ? "PUBLISHED" : "DRAFT"}`);
      await loadEditingProjects();
    } catch (err) {
      setEditingError(err instanceof Error ? err.message : "Failed to toggle publishing status");
    }
  };

  const handleMoveEditingOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editingProjects.length) return;

    const newProjects = [...editingProjects];
    const temp = newProjects[index];
    const target = newProjects[targetIndex];
    if (!temp || !target) return;

    newProjects[index] = target;
    newProjects[targetIndex] = temp;

    setEditingProjects(newProjects);
    try {
      const orderedIds = newProjects.map((p) => p.id);
      await reorderEditingProjects(orderedIds);
      showSuccess("✓ Editing projects order updated");
    } catch {
      await loadEditingProjects();
    }
  };

  // Filtered lists
  const filteredFilmProjects = useMemo(() => {
    if (!searchQuery.trim()) return filmProjects;
    const q = searchQuery.toLowerCase();
    return filmProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [filmProjects, searchQuery]);

  const filteredEditingProjects = useMemo(() => {
    if (!searchQuery.trim()) return editingProjects;
    const q = searchQuery.toLowerCase();
    return editingProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.clientName || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (p.tools || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [editingProjects, searchQuery]);

  const totalEditingVideos = useMemo(() => {
    return editingProjects.reduce((acc, p) => acc + (p.videos?.length || 0), 0);
  }, [editingProjects]);

  // If Film project editor is open
  if (isAddingFilm || editingFilmProject) {
    return (
      <ProjectForm
        project={editingFilmProject}
        onSave={async (data) => {
          await onSaveFilm(data);
          setEditingFilmProject(null);
          setIsAddingFilm(false);
        }}
        onCancel={() => {
          setEditingFilmProject(null);
          setIsAddingFilm(false);
        }}
        isLoading={isSavingFilm}
      />
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. UNIFIED WORKSPACE HEADER & METRICS */}
      <div className="border border-border/80 bg-navy/20 p-6 md:p-8 rounded space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse" />
              <p className="label-track text-gold">UNIFIED PROJECT REPOSITORY</p>
            </div>
            <h2 className="title-card mt-1 text-2xl md:text-3xl text-ivory">Projects Workspace</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Manage all Film, VFX and Editing projects from one centralized workspace.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setEditingFilmProject(null);
                setIsAddingFilm(true);
              }}
              className="label-track bg-gold px-5 py-3 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-all flex items-center gap-2 cursor-pointer shadow-lg rounded min-h-[44px]"
            >
              <Plus size={14} />
              + Add Film / VFX Project
            </button>

            <button
              onClick={() => {
                setActiveEditingProjectModal(null);
                setIsAddingEditingModal(true);
              }}
              className="label-track border border-gold/70 bg-gold/10 px-5 py-3 !text-[10px] text-gold font-bold hover:bg-gold hover:text-charcoal transition-all flex items-center gap-2 cursor-pointer shadow-lg rounded min-h-[44px]"
            >
              <Scissors size={14} />
              + Add Editing Project
            </button>

            <button
              onClick={async () => {
                await Promise.all([onRefreshFilm(), loadEditingProjects()]);
                showSuccess("✓ All projects refreshed from database & storage");
              }}
              className="label-track border border-border px-4 py-3 !text-[10px] text-ivory/80 hover:text-ivory hover:border-gold/60 transition-all flex items-center gap-2 cursor-pointer rounded min-h-[44px]"
              title="Refresh all projects"
            >
              <RefreshCw size={14} className={isLoadingFilm || isLoadingEditing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh All</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-charcoal/60 border border-border p-4 rounded">
            <p className="label-track text-gold !text-[9px] flex items-center gap-1.5">
              <Film size={12} /> FILM & VFX
            </p>
            <p className="title-card text-2xl text-ivory mt-1">{filmProjects.length}</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-1">
              {filmProjects.filter((p) => p.publishStatus !== "DRAFT").length} Published
            </p>
          </div>

          <div className="bg-charcoal/60 border border-border p-4 rounded">
            <p className="label-track text-gold !text-[9px] flex items-center gap-1.5">
              <Scissors size={12} /> EDITING PROJECTS
            </p>
            <p className="title-card text-2xl text-ivory mt-1">{editingProjects.length}</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-1">
              {editingProjects.filter((p) => p.published).length} Published
            </p>
          </div>

          <div className="bg-charcoal/60 border border-border p-4 rounded">
            <p className="label-track text-gold !text-[9px] flex items-center gap-1.5">
              <Video size={12} /> DRIVE VIDEOS
            </p>
            <p className="title-card text-2xl text-ivory mt-1">{totalEditingVideos}</p>
            <p className="text-[10px] text-emerald-400 font-mono mt-1">Live Stream Active</p>
          </div>

          <div className="bg-charcoal/60 border border-border p-4 rounded">
            <p className="label-track text-gold !text-[9px] flex items-center gap-1.5">
              <Sparkles size={12} /> TOTAL CATALOG
            </p>
            <p className="title-card text-2xl text-ivory mt-1">{filmProjects.length + editingProjects.length}</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-1">Integrated in /portfolio</p>
          </div>
        </div>

        {/* Search and Section Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all projects, tags, tools..."
              className="w-full bg-charcoal border border-border rounded pl-9 pr-4 py-2.5 text-xs text-ivory placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none min-h-[40px]"
            />
          </div>

          <div className="flex items-center gap-1 bg-charcoal border border-border rounded p-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveSectionFilter("all")}
              className={`label-track px-3 py-1.5 !text-[9px] rounded transition-all flex-1 sm:flex-none ${
                activeSectionFilter === "all" ? "bg-gold text-charcoal font-bold" : "text-ivory/70 hover:text-ivory"
              }`}
            >
              ALL ({filmProjects.length + editingProjects.length})
            </button>
            <button
              onClick={() => setActiveSectionFilter("film")}
              className={`label-track px-3 py-1.5 !text-[9px] rounded transition-all flex-1 sm:flex-none ${
                activeSectionFilter === "film" ? "bg-gold text-charcoal font-bold" : "text-ivory/70 hover:text-ivory"
              }`}
            >
              FILM & VFX ({filmProjects.length})
            </button>
            <button
              onClick={() => setActiveSectionFilter("editing")}
              className={`label-track px-3 py-1.5 !text-[9px] rounded transition-all flex-1 sm:flex-none ${
                activeSectionFilter === "editing" ? "bg-gold text-charcoal font-bold" : "text-ivory/70 hover:text-ivory"
              }`}
            >
              EDITING ({editingProjects.length})
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-sm flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {editingError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm flex items-center justify-between">
          <span>{editingError}</span>
          <button onClick={() => setEditingError(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1 — FILM & VFX PROJECTS                                           */}
      {/* ========================================================================= */}
      {(activeSectionFilter === "all" || activeSectionFilter === "film") && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-charcoal">
                1
              </span>
              <div>
                <h3 className="title-card text-xl md:text-2xl text-ivory flex items-center gap-2">
                  <Film size={20} className="text-gold" />
                  Film & VFX Projects
                </h3>
                <p className="text-xs text-muted-foreground">
                  Short films, pilot films, CGI integrations & case studies with Before/After & rich breakdowns.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingFilmProject(null);
                setIsAddingFilm(true);
              }}
              className="label-track bg-gold/90 px-4 py-2.5 !text-[9px] !text-charcoal font-bold hover:bg-gold transition-all flex items-center gap-1.5 rounded cursor-pointer self-start sm:self-auto"
            >
              <Plus size={14} /> Add Film / VFX Project
            </button>
          </div>

          {isLoadingFilm ? (
            <div className="text-center py-12 border border-border bg-navy/10 rounded font-mono text-xs text-gold flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin" /> Loading film projects...
            </div>
          ) : filteredFilmProjects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border bg-navy/10 rounded">
              <p className="text-xs text-muted-foreground">No film projects found matching your filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFilmProjects.map((project) => {
                const isDraft = project.publishStatus === "DRAFT";
                return (
                  <div
                    key={project.id}
                    className={`border bg-navy/20 p-5 md:p-6 hover:border-gold/50 transition-colors rounded ${
                      isDraft ? "border-amber-500/40 bg-amber-500/5" : "border-border"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Thumbnail */}
                      <div className="md:col-span-3">
                        <div className="relative aspect-video w-full overflow-hidden rounded border border-border bg-charcoal">
                          {project.image ? (
                            <img
                              src={resolveImageUrl(project.image)}
                              alt={project.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                          {project.hasVideo && (
                            <span className="absolute top-1.5 right-1.5 bg-gold text-charcoal p-1 rounded-full shadow" title="Has Video">
                              <Video size={12} />
                            </span>
                          )}
                          {project.showBeforeAfter && (
                            <span className="absolute bottom-1.5 right-1.5 bg-cyan-500 text-charcoal p-1 rounded-full shadow" title="Has Before/After">
                              <SlidersHorizontal size={12} />
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] text-muted-foreground truncate font-mono">
                          {getImageLabel(project.image)}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="md:col-span-6 space-y-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="label-track text-gold font-bold">{project.number}</span>
                          <span className="label-track !text-[9px] border border-border/80 px-2 py-0.5 rounded text-gold">
                            {project.category}
                          </span>
                          {isDraft ? (
                            <span className="label-track !text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 border border-amber-400/40 rounded">
                              ● DRAFT
                            </span>
                          ) : (
                            <span className="label-track !text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 border border-emerald-400/40 rounded">
                              ● PUBLISHED
                            </span>
                          )}
                          {project.year && (
                            <span className="label-track !text-[9px] text-ivory/60">
                              {project.year}
                            </span>
                          )}
                        </div>

                        <h4 className="title-card text-xl text-ivory">{project.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.logline || project.synopsis || project.description}
                        </p>
                        <p className="text-[10px] text-ivory/70 font-mono">
                          Role: {project.role} • Type: {project.type}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-3 flex flex-wrap md:flex-col items-stretch justify-end gap-2">
                        <button
                          onClick={() => setEditingFilmProject(project)}
                          className="label-track border border-gold/70 bg-gold/10 px-3.5 py-2 !text-[9px] text-gold hover:bg-gold hover:text-charcoal transition-all rounded flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                        >
                          <Edit2 size={12} /> Edit Film CMS
                        </button>

                        <button
                          onClick={() => onTogglePublishFilm(project)}
                          className={`label-track border px-3.5 py-2 !text-[9px] transition-all rounded flex items-center justify-center gap-1.5 cursor-pointer font-bold ${
                            isDraft
                              ? "border-emerald-500/70 text-emerald-400 hover:bg-emerald-500/10"
                              : "border-amber-500/70 text-amber-400 hover:bg-amber-500/10"
                          }`}
                        >
                          {isDraft ? "✓ Publish Project" : "Switch to Draft"}
                        </button>

                        <a
                          href={`/portfolio/${project.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="label-track border border-border px-3.5 py-2 !text-[9px] text-ivory/80 hover:text-gold hover:border-gold/60 transition-all rounded flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink size={12} /> Live View ↗
                        </a>

                        <button
                          onClick={() => onDeleteFilm(project.id)}
                          className="label-track border border-red-500/40 px-3.5 py-2 !text-[9px] text-red-400 hover:bg-red-500/10 transition-all rounded flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2 — EDITING PORTFOLIO PROJECTS                                    */}
      {/* ========================================================================= */}
      {(activeSectionFilter === "all" || activeSectionFilter === "editing") && (
        <section className="space-y-6 pt-6 border-t border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-charcoal">
                2
              </span>
              <div>
                <h3 className="title-card text-xl md:text-2xl text-ivory flex items-center gap-2">
                  <Scissors size={20} className="text-gold" />
                  Editing Portfolio Projects
                </h3>
                <p className="text-xs text-muted-foreground">
                  Personal Edits, Skytree, Tiruvannamalai, TV Show, Vels Global School & multi-video Google Drive reels.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveEditingProjectModal(null);
                setIsAddingEditingModal(true);
              }}
              className="label-track bg-gold/90 px-4 py-2.5 !text-[9px] !text-charcoal font-bold hover:bg-gold transition-all flex items-center gap-1.5 rounded cursor-pointer self-start sm:self-auto"
            >
              <Plus size={14} /> Add Editing Project
            </button>
          </div>

          {isLoadingEditing ? (
            <div className="text-center py-12 border border-border bg-navy/10 rounded font-mono text-xs text-gold flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin" /> Loading editing projects...
            </div>
          ) : filteredEditingProjects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border bg-navy/10 rounded">
              <p className="text-xs text-muted-foreground">No editing projects found matching your filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEditingProjects.map((project, index) => {
                const publishedVideosCount = (project.videos || []).filter((v) => v.published !== false).length;
                const totalVideosCount = project.videos?.length || 0;

                return (
                  <div
                    key={project.id}
                    className={`border bg-navy/20 p-5 md:p-6 hover:border-gold/50 transition-colors rounded ${
                      !project.published ? "border-amber-500/40 bg-amber-500/5" : "border-border"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Thumbnail */}
                      <div className="md:col-span-3">
                        <div className="relative aspect-video w-full overflow-hidden rounded border border-border bg-charcoal">
                          <img
                            src={resolveImageUrl(project.thumbnailUrl || project.heroImageUrl || "/assets/about-editroom.webp")}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-charcoal/90 border border-gold/40 px-2 py-0.5 rounded text-[9px] font-mono text-gold flex items-center gap-1">
                            <Play size={10} className="fill-gold" />
                            {totalVideosCount} {totalVideosCount === 1 ? "Video" : "Videos"}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-muted-foreground truncate font-mono">
                          /portfolio/{project.slug}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="md:col-span-6 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="label-track text-gold font-bold">
                            {project.projectNumber || `0${index + 5}`}
                          </span>
                          <span className="label-track !text-[9px] border border-border/80 px-2 py-0.5 rounded text-gold">
                            EDITING
                          </span>
                          {project.clientName && (
                            <span className="label-track !text-[9px] text-ivory/80 bg-charcoal px-2 py-0.5 border border-border rounded">
                              {project.clientName}
                            </span>
                          )}
                          {project.published ? (
                            <span className="label-track !text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 border border-emerald-400/40 rounded">
                              ● PUBLISHED
                            </span>
                          ) : (
                            <span className="label-track !text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 border border-amber-400/40 rounded">
                              ● DRAFT
                            </span>
                          )}
                        </div>

                        <h4 className="title-card text-xl text-ivory">{project.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.logline || project.synopsis || project.description}
                        </p>

                        {/* Tools / Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {(project.tools || []).map((t) => (
                            <span key={t} className="text-[9px] bg-charcoal border border-border/60 text-ivory/70 px-2 py-0.5 rounded font-mono">
                              {t}
                            </span>
                          ))}
                          <span className="text-[10px] text-gold/80 font-mono">
                            • {publishedVideosCount}/{totalVideosCount} videos active
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-3 flex flex-wrap md:flex-col items-stretch justify-end gap-2">
                        <button
                          onClick={() => {
                            setActiveEditingProjectModal(project);
                            setIsAddingEditingModal(false);
                          }}
                          className="label-track border border-gold/70 bg-gold/10 px-3.5 py-2 !text-[9px] text-gold hover:bg-gold hover:text-charcoal transition-all rounded flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                        >
                          <Edit2 size={12} /> Edit Editing CMS
                        </button>

                        <button
                          onClick={() => handleTogglePublishEditingProject(project)}
                          className={`label-track border px-3.5 py-2 !text-[9px] transition-all rounded flex items-center justify-center gap-1.5 cursor-pointer font-bold ${
                            !project.published
                              ? "border-emerald-500/70 text-emerald-400 hover:bg-emerald-500/10"
                              : "border-amber-500/70 text-amber-400 hover:bg-amber-500/10"
                          }`}
                        >
                          {!project.published ? "✓ Publish Project" : "Switch to Draft"}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveEditingOrder(index, "up")}
                            disabled={index === 0}
                            className="flex-1 label-track border border-border p-2 !text-[9px] text-ivory/70 hover:text-gold hover:border-gold/60 disabled:opacity-30 rounded flex items-center justify-center"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => handleMoveEditingOrder(index, "down")}
                            disabled={index === editingProjects.length - 1}
                            className="flex-1 label-track border border-border p-2 !text-[9px] text-ivory/70 hover:text-gold hover:border-gold/60 disabled:opacity-30 rounded flex items-center justify-center"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            onClick={() => handleDuplicateEditingProject(project.id)}
                            className="flex-1 label-track border border-border p-2 !text-[9px] text-ivory/70 hover:text-gold hover:border-gold/60 rounded flex items-center justify-center"
                            title="Duplicate"
                          >
                            <Copy size={12} />
                          </button>
                          <a
                            href={`/portfolio/${project.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 label-track border border-border p-2 !text-[9px] text-ivory/70 hover:text-gold hover:border-gold/60 rounded flex items-center justify-center"
                            title="Live View"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>

                        <button
                          onClick={() => handleDeleteEditingProject(project.id, project.title)}
                          className="label-track border border-red-500/40 px-3.5 py-2 !text-[9px] text-red-400 hover:bg-red-500/10 transition-all rounded flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Editing Project Editor Modal */}
      {(isAddingEditingModal || activeEditingProjectModal) && (
        <EditingProjectEditorModal
          isOpen={true}
          initialData={activeEditingProjectModal}
          onClose={() => {
            setActiveEditingProjectModal(null);
            setIsAddingEditingModal(false);
          }}
          onSave={handleSaveEditingProject}
          isSaving={isSavingEditing}
        />
      )}

      {/* Live Preview Modal */}
      {previewEditingProject && (
        <EditingProjectPreviewModal
          isOpen={true}
          project={previewEditingProject}
          onClose={() => setPreviewEditingProject(null)}
        />
      )}
    </div>
  );
}
