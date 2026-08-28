import { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, EyeOff, Trash2, Filter, AlertCircle, RefreshCw } from "lucide-react";
import type { CommentItem } from "@/components/ProjectComments";

export function CommentModerationForm() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [filterSlug, setFilterSlug] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  useEffect(() => {
    loadAllComments();
  }, []);

  const loadAllComments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/comments?all=true", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Failed to load moderation queue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "HIDDEN" | "REJECTED") => {
    try {
      const res = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setActionStatus(`✓ Comment marked as ${status}`);
        setTimeout(() => setActionStatus(null), 3000);
        await loadAllComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this comment?")) return;
    try {
      const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setActionStatus("✓ Comment deleted");
        setTimeout(() => setActionStatus(null), 3000);
        await loadAllComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComments = filterSlug === "all" ? comments : comments.filter((c) => c.projectSlug === filterSlug);
  const uniqueSlugs = Array.from(new Set(comments.map((c) => c.projectSlug)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="label-track text-gold">CMS MODERATION</span>
          <h2 className="title-card mt-2 text-3xl text-ivory">Project Comments Moderation</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Review, approve, hide or reject Google-authenticated comments from film viewers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-navy border border-border px-3 py-1.5 rounded">
            <Filter size={14} className="text-gold" />
            <select
              value={filterSlug}
              onChange={(e) => setFilterSlug(e.target.value)}
              className="bg-transparent text-xs text-ivory focus:outline-none"
            >
              <option value="all">All Projects ({comments.length})</option>
              {uniqueSlugs.map((slug) => (
                <option key={slug} value={slug}>
                  {slug} ({comments.filter((c) => c.projectSlug === slug).length})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={loadAllComments}
            className="label-track flex items-center gap-1.5 border border-border px-3.5 py-2 !text-[9px] text-ivory hover:text-gold rounded"
          >
            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {actionStatus && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded">
          {actionStatus}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground font-mono text-sm">
          Loading comment queue...
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="border border-dashed border-border/80 p-12 text-center bg-navy/20 rounded">
          <MessageSquare size={32} className="text-gold/40 mx-auto mb-3" />
          <p className="text-sm text-ivory font-medium">No comments in queue</p>
          <p className="text-xs text-muted-foreground mt-1">
            Visitor comments will appear here for one-click approval before going public.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredComments.map((c) => (
            <div
              key={c.id}
              className={`border p-5 rounded space-y-3 transition-colors ${
                c.status === "PENDING"
                  ? "border-amber-500/40 bg-amber-500/5"
                  : c.status === "APPROVED"
                  ? "border-emerald-500/40 bg-navy/30"
                  : "border-border/60 bg-charcoal/80 opacity-75"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
                <div className="flex items-center gap-3">
                  {c.userAvatar ? (
                    <img src={c.userAvatar} alt={c.userName} className="h-7 w-7 rounded-full border border-gold/40" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-gold/20 flex items-center justify-center text-xs text-gold font-bold">
                      {c.userName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ivory">{c.userName}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">({c.userEmail})</span>
                    </div>
                    <p className="text-[10px] text-gold font-mono uppercase">
                      Project: <span className="underline">{c.projectSlug}</span> • {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`label-track px-2 py-0.5 !text-[8px] rounded border font-bold ${
                      c.status === "APPROVED"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : c.status === "PENDING"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                        : "bg-red-500/20 text-red-400 border-red-500/40"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>

              <p className="text-sm text-ivory/90 leading-relaxed font-sans">{c.content}</p>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border/30">
                {c.status !== "APPROVED" && (
                  <button
                    onClick={() => handleUpdateStatus(c.id, "APPROVED")}
                    className="label-track flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white px-3.5 py-1.5 !text-[9px] rounded font-bold transition-colors"
                  >
                    <CheckCircle size={12} /> Approve & Publish
                  </button>
                )}
                {c.status !== "HIDDEN" && (
                  <button
                    onClick={() => handleUpdateStatus(c.id, "HIDDEN")}
                    className="label-track flex items-center gap-1.5 border border-border bg-charcoal hover:bg-navy text-ivory/80 px-3 py-1.5 !text-[9px] rounded transition-colors"
                  >
                    <EyeOff size={12} /> Hide
                  </button>
                )}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="label-track flex items-center gap-1.5 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 !text-[9px] rounded transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
