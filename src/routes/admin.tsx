import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectList } from "@/components/admin/ProjectList";
import type { ProjectCMSData, ProjectFormData } from "@/lib/project-cms";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  initializeProjects,
} from "@/lib/project-cms";

const ADMIN_PASSWORD = "rohith2024"; // Simple hardcoded password

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<ProjectCMSData[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectCMSData | null>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const auth = localStorage.getItem("rohith-admin-auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      initializeProjects();
      setProjects(getProjects());
      setIsInitialized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("rohith-admin-auth", "true");
      setIsAuthenticated(true);
      initializeProjects();
      setProjects(getProjects());
      setIsInitialized(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rohith-admin-auth");
    setIsAuthenticated(false);
    setPassword("");
    setProjects([]);
  };

  const handleSave = (projectData: ProjectFormData) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    setProjects(getProjects());
    setEditingProject(null);
    setIsAdding(false);
  };

  const handleEdit = (project: ProjectCMSData) => {
    setEditingProject(project);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(getProjects());
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsAdding(false);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-charcoal flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <Reveal>
            <div className="text-center mb-8">
              <p className="label-track text-gold">Admin Access</p>
              <h1 className="title-card mt-4 text-3xl text-ivory">Project Manager</h1>
              <p className="mt-4 text-sm text-muted-foreground">
                Enter password to access the admin dashboard
              </p>
            </div>
          </Reveal>

          <Reveal>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm text-ivory/80 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy border border-border px-4 py-3 text-ivory focus:border-gold focus:outline-none"
                  placeholder="Enter password"
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full label-track bg-gold px-8 py-4 !text-[10px] !text-charcoal hover:bg-gold/90 transition-colors"
              >
                Access Admin
              </button>

              <div className="text-center">
                <Link
                  to="/"
                  className="label-track text-gold hover:text-ivory transition-colors"
                >
                  ← Back to Site
                </Link>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    );
  }

  // Admin dashboard
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
        <Reveal>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="label-track text-gold">Admin</p>
              <h1 className="title-card mt-4 text-5xl text-ivory md:text-7xl">
                Project Manager
              </h1>
              <p className="mt-4 text-sm text-muted-foreground md:text-base">
                Add, edit, and delete portfolio projects
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/"
                className="label-track border border-gold/60 px-6 py-4 !text-[10px] !text-gold hover:bg-gold hover:!text-charcoal transition-colors"
              >
                View Site →
              </Link>
              <button
                onClick={handleLogout}
                className="label-track border border-red-500/60 px-6 py-4 !text-[10px] !text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </Reveal>

        {isAdding || editingProject ? (
          <Reveal>
            <ProjectForm
              project={editingProject ? (() => {
                const { id, createdAt, galleryImages, client, ...projectData } = editingProject;
                return projectData;
              })() : undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </Reveal>
        ) : (
          <>
            <Reveal className="mb-8">
              <button
                onClick={() => setIsAdding(true)}
                className="label-track bg-gold px-8 py-4 !text-[10px] !text-charcoal hover:bg-gold/90 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add New Project
              </button>
            </Reveal>

            <Reveal>
              <ProjectList
                projects={projects}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
