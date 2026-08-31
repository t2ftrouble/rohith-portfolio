import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Film,
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
  Sparkles,
} from "lucide-react";
import type { EditingProjectCMSData, EditingProjectFormData } from "@/lib/editing-projects-cms";
import {
  fetchEditingProjectsFromApi,
  createEditingProject,
  updateEditingProject,
  deleteEditingProject,
  duplicateEditingProject,
  reorderEditingProjects,
} from "@/lib/editing-projects-cms";
import { EditingProjectEditorModal } from "./EditingProjectEditorModal";
import { EditingProjectPreviewModal } from "./EditingProjectPreviewModal";

export function EditingProjectsManager() {
  const [projects, setProjects] = useState<EditingProjectCMSData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<EditingProjectCMSData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [previewProject, setPreviewProject] = useState<EditingProjectFormData | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEditingProjectsFromApi(true);
      setProjects(data);
    } catch (err) {
      console.error("Failed to load editing projects:", err);
      setError("Failed to load editing projects from server. Check connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.tools || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && p.published) ||
        (statusFilter === "draft" && !p.published);

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Total statistics
  const totalVideos = useMemo(() => {
    return projects.reduce((acc, p) => acc + (p.videos?.length || 0), 0);
  }, [projects]);

  const publishedCount = useMemo(() => {
    return projects.filter((p) => p.published).length;
  }, [projects]);

  // CRUD actions
  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (project: EditingProjectCMSData) => {
    setEditingProject(project);
    setIsEditorOpen(true);
  };

  const handleSaveProject = async (formData: EditingProjectFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editingProject && editingProject.id && !editingProject.id.startsWith("seed-")) {
        await updateEditingProject(editingProject.id, formData);
        showSuccess(`✓ Project "${formData.title}" updated successfully`);
      } else {
        await createEditingProject(formData);
        showSuccess(`✓ Project "${formData.title}" created successfully`);
      }
      setIsEditorOpen(false);
      setEditingProject(null);
      await loadProjects();
    } catch (err) {
      console.error("Save error:", err);
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (project: EditingProjectCMSData) => {
    if (!confirm(`Are you sure you want to delete "${project.title}" and all its ${project.videos?.length || 0} videos? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteEditingProject(project.id);
      showSuccess(`✓ Project "${project.title}" deleted successfully`);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleDuplicate = async (project: EditingProjectCMSData) => {
    try {
      await duplicateEditingProject(project.id);
      showSuccess(`✓ Cloned "${project.title}" as draft copy`);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to duplicate project");
    }
  };

  const handleTogglePublish = async (project: EditingProjectCMSData) => {
    try {
      await updateEditingProject(project.id, { published: !project.published });
      showSuccess(`✓ "${project.title}" is now ${!project.published ? "PUBLISHED" : "DRAFT"}`);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle publishing status");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    const target = newProjects[targetIndex];
    if (!temp || !target) return;

    newProjects[index] = target;
    newProjects[targetIndex] = temp;

    setProjects(newProjects);
    try {
      const orderedIds = newProjects.map((p) => p.id);
      await reorderEditingProjects(orderedIds);
      showSuccess("✓ Project order updated");
    } catch (err) {
      setError("Failed to save new order");
      await loadProjects();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <p className="label-track text-gold">EDITING PORTFOLIO CMS</p>
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          </div>
          <h2 className="title-card mt-1 text-2xl text-ivory md:text-3xl">
            Editing Projects & Video Reels
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage freelance client edits, multi-video campaigns, Google Drive streaming, and editorial craft breakdowns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadProjects}
            disabled={isLoading}
            className="label-track flex items-center gap-2 px-3.5 py-2.5 !text-[9px] bg-navy border border-border text-ivory/80 hover:text-gold hover:border-gold rounded transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>REFRESH</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="label-track flex items-center gap-2 bg-gold px-5 py-2.5 !text-[10px] !text-charcoal font-bold rounded hover:bg-gold/90 transition-all cursor-pointer shadow-lg"
          >
            <Plus size={15} />
            <span>NEW EDITING PROJECT</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-border/70 bg-navy/30 p-4 rounded-lg">
          <p className="label-track text-gold !text-[8px]">TOTAL PROJECTS</p>
          <p className="title-card text-2xl text-ivory mt-1">{projects.length}</p>
        </div>
        <div className="border border-border/70 bg-navy/30 p-4 rounded-lg">
          <p className="label-track text-gold !text-[8px]">CONNECTED DRIVE VIDEOS</p>
          <p className="title-card text-2xl text-ivory mt-1">{totalVideos}</p>
        </div>
        <div className="border border-border/70 bg-navy/30 p-4 rounded-lg">
          <p className="label-track text-gold !text-[8px]">PUBLISHED PUBLICLY</p>
          <p className="title-card text-2xl text-emerald-400 mt-1">{publishedCount}</p>
        </div>
        <div className="border border-border/70 bg-navy/30 p-4 rounded-lg">
          <p className="label-track text-gold !text-[8px]">DRAFTS</p>
          <p className="title-card text-2xl text-amber-400 mt-1">{projects.length - publishedCount}</p>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2 shadow-md">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2 shadow-md">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 bg-navy/20 border border-border/60 rounded-lg">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, client, tool, or tag..."
            className="w-full bg-charcoal border border-border pl-9 pr-4 py-2 text-xs text-ivory placeholder:text-muted-foreground/40 rounded focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "published", "draft"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`label-track px-3 py-1.5 !text-[8px] rounded transition-all cursor-pointer ${
                statusFilter === filter
                  ? "bg-gold text-charcoal font-bold"
                  : "bg-charcoal border border-border text-ivory/70 hover:text-ivory"
              }`}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table / Card List */}
      <div className="space-y-4">
        {isLoading && projects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border/60 rounded-lg">
            <RefreshCw size={24} className="animate-spin text-gold mx-auto mb-3" />
            <p className="text-sm text-ivory">Loading editing portfolio projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border/60 rounded-lg">
            <Film size={28} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-ivory">No editing projects found matching your search.</p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 label-track bg-gold px-4 py-2 !text-[9px] !text-charcoal font-bold rounded cursor-pointer"
            >
              + Create First Project
            </button>
          </div>
        ) : (
          filteredProjects.map((proj, idx) => {
            const videoCount = proj.videos?.length || 0;
            const coverImage = proj.thumbnailUrl || proj.heroImageUrl || "/assets/about-editroom.webp";

            return (
              <div
                key={proj.id || idx}
                className="border border-border/80 bg-navy/30 p-5 rounded-lg transition-all duration-300 hover:border-gold/50 hover:bg-navy/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Thumbnail & Project Meta */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, "up")}
                      disabled={idx === 0}
                      title="Move Up in sequence"
                      className="p-1 bg-charcoal border border-border text-ivory/60 hover:text-gold disabled:opacity-20 rounded cursor-pointer"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, "down")}
                      disabled={idx === filteredProjects.length - 1}
                      title="Move Down in sequence"
                      className="p-1 bg-charcoal border border-border text-ivory/60 hover:text-gold disabled:opacity-20 rounded cursor-pointer"
                    >
                      <ArrowDown size={11} />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-24 sm:w-32 aspect-video flex-shrink-0 overflow-hidden border border-border/70 bg-black rounded">
                    <img
                      src={coverImage}
                      alt={proj.title}
                      className="h-full w-full object-cover opacity-85"
                    />
                    <span className="label-track absolute bottom-1 right-1 bg-charcoal/90 px-1.5 py-0.5 !text-[7px] text-gold font-mono rounded">
                      {proj.projectNumber || "05"}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="title-card text-lg text-ivory font-bold">{proj.title}</h3>
                      <span
                        className={`label-track !text-[8px] px-2 py-0.5 rounded border ${
                          proj.published
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {proj.published ? "PUBLISHED" : "DRAFT"}
                      </span>
                      {proj.featured && (
                        <span className="label-track !text-[8px] bg-gold/10 border border-gold/30 text-gold px-2 py-0.5 rounded flex items-center gap-1">
                          <Sparkles size={9} />
                          <span>FEATURED</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gold/90 font-medium">{proj.clientName || "Personal Client Work"}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-2xl">{proj.description}</p>

                    {/* Tags & Video Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="label-track !text-[8px] bg-charcoal border border-border/80 px-2 py-0.5 text-ivory/80 rounded font-mono">
                        {videoCount} {videoCount === 1 ? "VIDEO" : "VIDEOS"} (GOOGLE DRIVE)
                      </span>
                      <span className="label-track !text-[8px] text-muted-foreground font-mono">
                        /portfolio/{proj.slug}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center border-t md:border-t-0 border-border/40 pt-3 md:pt-0 w-full md:w-auto justify-end">
                  {/* Public Link */}
                  <a
                    href={`/portfolio/${proj.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open live public route"
                    className="label-track inline-flex items-center gap-1 p-2 bg-charcoal border border-border text-ivory/70 hover:text-gold hover:border-gold rounded transition-all"
                  >
                    <ExternalLink size={13} />
                  </a>

                  {/* Preview */}
                  <button
                    type="button"
                    onClick={() => setPreviewProject(proj)}
                    title="Interactive Preview"
                    className="label-track flex items-center gap-1.5 px-3 py-1.5 !text-[9px] bg-charcoal border border-border text-ivory hover:border-gold hover:text-gold rounded transition-all cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>PREVIEW</span>
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(proj)}
                    title="Edit project & videos"
                    className="label-track flex items-center gap-1.5 px-3 py-1.5 !text-[9px] bg-gold text-charcoal font-bold hover:bg-gold/90 rounded transition-all cursor-pointer shadow-sm"
                  >
                    <Edit2 size={12} />
                    <span>EDIT</span>
                  </button>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => handleDuplicate(proj)}
                    title="Duplicate project"
                    className="p-2 bg-charcoal border border-border text-ivory/70 hover:text-gold rounded cursor-pointer transition-colors"
                  >
                    <Copy size={13} />
                  </button>

                  {/* Publish toggle */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(proj)}
                    title={proj.published ? "Unpublish to draft" : "Publish to live site"}
                    className={`label-track px-2.5 py-1.5 !text-[8px] border rounded transition-all cursor-pointer ${
                      proj.published
                        ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                        : "border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                    }`}
                  >
                    {proj.published ? "UNPUBLISH" : "PUBLISH"}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(proj)}
                    title="Delete project"
                    className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Project Editor Modal */}
      {isEditorOpen && (
        <EditingProjectEditorModal
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
          initialData={editingProject}
          isSaving={isSaving}
        />
      )}

      {/* Project Preview Modal */}
      {previewProject && (
        <EditingProjectPreviewModal
          isOpen={previewProject !== null}
          onClose={() => setPreviewProject(null)}
          project={previewProject}
        />
      )}
    </div>
  );
}
