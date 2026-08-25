import type { ProjectCMSData } from "@/lib/project-cms";

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
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects yet. Add your first project!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="border border-border bg-navy/20 p-4 md:p-6 hover:border-gold/50 transition-colors"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="label-track text-gold">{project.number}</span>
                <span
                  className={`label-track !text-[9px] ${getCategoryColor(project.category)}`}
                >
                  {project.category}
                </span>
                {project.status && (
                  <span className="label-track !text-[9px] text-muted-foreground">
                    {project.status}
                  </span>
                )}
              </div>
              <h3 className="title-card text-xl text-ivory">{project.title}</h3>
              <p className="label-track text-muted-foreground mt-1">{project.type}</p>
              <p className="text-sm text-ivory/70 mt-2">{project.role}</p>
              {project.year && (
                <p className="label-track text-muted-foreground mt-1">{project.year}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(project)}
                className="label-track border border-gold/60 px-4 py-2 !text-[10px] !text-gold hover:bg-gold/10 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                    onDelete(project.id);
                  }
                }}
                className="label-track border border-red-500/60 px-4 py-2 !text-[10px] !text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          {project.image && (
            <div className="mt-4">
              <img
                src={project.image}
                alt={project.title}
                className="h-32 w-full object-cover rounded border border-border"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
