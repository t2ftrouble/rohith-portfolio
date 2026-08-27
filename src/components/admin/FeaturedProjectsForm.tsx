import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Film,
  Sparkles,
} from "lucide-react";
import type { ProjectCMSData } from "@/lib/project-cms";
import {
  getFeaturedProjects,
  updateFeaturedProjects,
  defaultFeaturedProjects,
} from "@/lib/featured-projects";
import { resolveImageUrl } from "@/lib/asset-resolver";

interface FeaturedProjectsFormProps {
  projects: ProjectCMSData[];
}

export function FeaturedProjectsForm({ projects }: FeaturedProjectsFormProps) {
  const [featuredSlugs, setFeaturedSlugs] = useState<string[]>(
    defaultFeaturedProjects.featuredSlugs
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await getFeaturedProjects();
      setFeaturedSlugs(data.featuredSlugs);
    } catch (err) {
      console.error("Failed to load featured projects:", err);
      setStatusMessage({
        type: "error",
        text: "Could not load featured project order from storage.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (slug: string) => {
    if (featuredSlugs.includes(slug)) {
      if (featuredSlugs.length <= 1) {
        alert("You must keep at least 1 featured project selected.");
        return;
      }
      setFeaturedSlugs((prev) => prev.filter((s) => s !== slug));
    } else {
      setFeaturedSlugs((prev) => [...prev, slug]);
    }
    setStatusMessage(null);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= featuredSlugs.length) return;

    const updated = [...featuredSlugs];
    const moved = updated[index];
    if (moved) {
      updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);
      setFeaturedSlugs(updated);
      setStatusMessage(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const saved = await updateFeaturedProjects({ featuredSlugs });
      setFeaturedSlugs(saved.featuredSlugs);
      setStatusMessage({
        type: "success",
        text: "✓ Featured projects selection & order updated! Active on homepage.",
      });
    } catch (err: unknown) {
      console.error("Failed to save featured projects:", err);
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save featured projects",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset featured project selection to default list?")) {
      setFeaturedSlugs(defaultFeaturedProjects.featuredSlugs);
      setStatusMessage(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gold font-mono text-xs gap-3">
        <RefreshCw size={16} className="animate-spin" />
        <span>Loading featured projects order...</span>
      </div>
    );
  }

  // Selected projects in exact ordered sequence
  const orderedSelectedProjects = featuredSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean) as ProjectCMSData[];

  // Unselected projects
  const unselectedProjects = projects.filter(
    (p) => !featuredSlugs.includes(p.slug)
  );

  return (
    <form onSubmit={handleSave} className="space-y-8">
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

      {/* ACTIVE FEATURED ORDER */}
      <div className="border border-gold/40 bg-navy/20 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <h3 className="title-card text-xl text-ivory">
                Homepage Featured Order ({orderedSelectedProjects.length} Selected)
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              These projects will be displayed in this exact sequence on the homepage under &ldquo;Selected Work&rdquo;.
            </p>
          </div>
          <span className="label-track text-gold !text-[10px]">01 → 02 → 03</span>
        </div>

        <div className="space-y-3">
          {orderedSelectedProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No projects selected. Choose from the available projects below.
            </p>
          ) : (
            orderedSelectedProjects.map((project, index) => {
              const displayNumber = index < 9 ? `0${index + 1}` : `${index + 1}`;
              return (
                <div
                  key={project.slug}
                  className="flex items-center justify-between p-4 bg-charcoal/90 border border-border/70 hover:border-gold/60 transition-colors rounded"
                >
                  <div className="flex items-center gap-4">
                    <span className="label-track text-gold font-bold font-mono text-sm w-6">
                      {displayNumber}
                    </span>

                    {project.image ? (
                      <img
                        src={resolveImageUrl(project.image)}
                        alt={project.title}
                        className="w-16 h-10 object-cover rounded border border-border/80"
                      />
                    ) : (
                      <div className="w-16 h-10 bg-navy flex items-center justify-center text-[10px] text-muted-foreground rounded">
                        <Film size={14} />
                      </div>
                    )}

                    <div>
                      <h4 className="title-card text-base text-ivory">{project.title}</h4>
                      <p className="label-track text-gold/80 !text-[9px]">
                        {project.type} {project.year ? `• ${project.year}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-2 border border-border/70 bg-navy/60 text-ivory hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === orderedSelectedProjects.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-2 border border-border/70 bg-navy/60 text-ivory hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(project.slug)}
                      className="label-track border border-red-500/40 bg-red-500/5 px-3 py-2 !text-[9px] text-red-400 hover:bg-red-500/20 transition-all rounded ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* UNSELECTED PROJECTS */}
      {unselectedProjects.length > 0 && (
        <div className="border border-border/80 bg-navy/10 p-6 md:p-8 space-y-6">
          <div className="border-b border-border/60 pb-3">
            <h3 className="title-card text-lg text-ivory">Other Available Projects</h3>
            <p className="text-xs text-muted-foreground">
              Click &ldquo;+ Add to Featured&rdquo; to include in the homepage showcase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unselectedProjects.map((project) => (
              <div
                key={project.slug}
                className="flex items-center justify-between p-3.5 bg-charcoal/60 border border-border/60 rounded"
              >
                <div className="flex items-center gap-3">
                  {project.image ? (
                    <img
                      src={resolveImageUrl(project.image)}
                      alt={project.title}
                      className="w-12 h-8 object-cover rounded border border-border/60"
                    />
                  ) : (
                    <div className="w-12 h-8 bg-navy flex items-center justify-center text-[9px] text-muted-foreground rounded">
                      <Film size={12} />
                    </div>
                  )}
                  <div>
                    <h4 className="title-card text-sm text-ivory">{project.title}</h4>
                    <p className="text-[10px] text-muted-foreground">{project.type}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(project.slug)}
                  className="label-track border border-gold/60 bg-gold/5 px-3 py-1.5 !text-[9px] text-gold hover:bg-gold hover:!text-charcoal transition-all rounded"
                >
                  + Add to Featured
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save & Reset Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isSaving}
          className="label-track bg-gold px-8 py-4 !text-[11px] !text-charcoal font-bold hover:bg-gold/90 transition-all shadow-xl min-h-[46px] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Saving to Supabase...
            </>
          ) : (
            <>
              <Save size={14} />
              SAVE FEATURED ORDER
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={isSaving}
          className="label-track border border-border px-4 py-3 !text-[9px] text-muted-foreground hover:text-red-400 hover:border-red-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={12} />
          Reset Default Order
        </button>
      </div>
    </form>
  );
}
