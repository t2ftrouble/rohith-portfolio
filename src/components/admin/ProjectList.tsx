import type { ProjectCMSData } from "@/lib/project-cms";
import { resolveImageUrl, getImageLabel } from "@/lib/asset-resolver";
import { Edit3, Trash2, Video, SlidersHorizontal, Image as ImageIcon } from "lucide-react";

interface ProjectListProps {
  projects: ProjectCMSData[];
  onEdit: (project: ProjectCMSData) => void;
  onDelete: (id: string) => void;
}

export function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "FILMMAKING": "text-gold",
      "VFX / CG": "text-cyan-400",
      "EDITING": "text-purple-400",
      "DESIGN": "text-pink-400",
      "CONTENT": "text-green-400",
    };
    return colors[category] || "text-ivory";
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border/80 bg-navy/10 rounded">
        <p className="text-muted-foreground">No projects found in database. Click &ldquo;Add New Project&rdquo; to publish one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="border border-border bg-navy/20 p-5 md:p-6 hover:border-gold/50 transition-colors rounded"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Thumbnail Preview */}
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
                  <span className="absolute bottom-1.5 right-1.5 bg-cyan-500 text-charcoal p-1 rounded-full shadow" title="Has Before/After Slider">
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
                <span className={`label-track !text-[9px] border border-border/80 px-2 py-0.5 rounded ${getCategoryColor(project.category)}`}>
                  {project.category}
                </span>
                {project.status && (
                  <span className="label-track !text-[9px] text-muted-foreground bg-charcoal/80 px-2 py-0.5 border border-border/40 rounded">
                    {project.status}
                  </span>
                )}
                {project.year && (
                  <span className="label-track !text-[9px] text-ivory/60">
                    {project.year}
                  </span>
                )}
              </div>
              <h3 className="title-card text-2xl text-ivory">{project.title}</h3>
              <p className="label-track text-gold/80 !text-[9px]">{project.type}</p>
              <p className="text-xs text-ivory/70 line-clamp-2">{project.role}</p>

              <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-muted-foreground">
                {project.posterImage && (
                  <span className="flex items-center gap-1 bg-navy/60 px-1.5 py-0.5 rounded border border-border/40">
                    <ImageIcon size={10} /> Poster
                  </span>
                )}
                {project.showBeforeAfter && (
                  <span className="flex items-center gap-1 bg-navy/60 px-1.5 py-0.5 rounded border border-border/40 text-cyan-300">
                    <SlidersHorizontal size={10} /> Before/After
                  </span>
                )}
                {project.galleryImages && project.galleryImages.length > 0 && (
                  <span className="flex items-center gap-1 bg-navy/60 px-1.5 py-0.5 rounded border border-border/40">
                    {project.galleryImages.length} Gallery Imgs
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-3 flex md:flex-col justify-end gap-2">
              <button
                onClick={() => onEdit(project)}
                className="label-track border border-gold/70 bg-gold/10 px-4 py-2.5 !text-[10px] text-gold hover:bg-gold hover:!text-charcoal transition-all text-center flex items-center justify-center gap-1.5 rounded cursor-pointer"
              >
                <Edit3 size={12} />
                Edit Project
              </button>
              <button
                onClick={() => onDelete(project.id)}
                className="label-track border border-red-500/50 bg-red-500/5 px-4 py-2.5 !text-[10px] text-red-400 hover:bg-red-500/20 transition-all text-center flex items-center justify-center gap-1.5 rounded cursor-pointer"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
