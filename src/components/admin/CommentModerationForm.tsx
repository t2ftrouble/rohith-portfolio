import { useState, useEffect, useCallback, useMemo } from "react";
import {
  MessageSquare,
  CheckCircle,
  EyeOff,
  Trash2,
  Filter,
  AlertCircle,
  RefreshCw,
  Archive,
  XCircle,
  RotateCcw,
  Film,
  ExternalLink,
} from "lucide-react";
import type { CommentItem } from "@/components/ProjectComments";

export function CommentModerationForm() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [filterSlug, setFilterSlug] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadAllComments = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/comments?all=true", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: `HTTP ${res.status}: Failed to load comments` }));
        throw new Error(errJson.error || `Failed to load moderation queue (Status ${res.status})`);
      }

      const data = await res.json();
      setComments(data.comments || []);
    } catch (err: any) {
      console.error("[CommentModerationForm] Error loading queue:", err);
      setLoadError(err instanceof Error ? err.message : "Failed to connect to comments API");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllComments();
  }, [loadAllComments]);

  const showFeedback = (type: "success" | "error", message: string) => {
    setActionStatus({ type, message });
    setTimeout(() => setActionStatus(null), 4000);
  };

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "HIDDEN" | "REJECTED" | "PENDING") => {
    setActionLoadingId(id);
    try {
      const res = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to update status (Status ${res.status})`);
      }

      showFeedback("success", `✓ Comment status updated to ${status === "HIDDEN" ? "ARCHIVED" : status}`);
      // Optimistically update local state then refresh
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      await loadAllComments();
    } catch (err: any) {
      console.error("Update status error:", err);
      showFeedback("error", `✗ ${err.message || "Failed to update comment status"}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this comment? This cannot be undone.")) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to delete comment (Status ${res.status})`);
      }

      showFeedback("success", "✓ Comment permanently deleted from database");
      setComments((prev) => prev.filter((c) => c.id !== id));
      await loadAllComments();
    } catch (err: any) {
      console.error("Delete comment error:", err);
      showFeedback("error", `✗ ${err.message || "Failed to delete comment"}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Status counts
  const counts = useMemo(() => {
    return {
      ALL: comments.length,
      PENDING: comments.filter((c) => (c.status || "PENDING") === "PENDING").length,
      APPROVED: comments.filter((c) => c.status === "APPROVED").length,
      REJECTED: comments.filter((c) => c.status === "REJECTED").length,
      ARCHIVED: comments.filter((c) => c.status === "HIDDEN").length,
    };
  }, [comments]);

  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      const slug = c.projectSlug || (c as any).project_slug || "";
      const matchesSlug = filterSlug === "all" || slug === filterSlug;
      const status = c.status || (c as any).status || "PENDING";
      const matchesStatus =
        filterStatus === "ALL" ||
        (filterStatus === "ARCHIVED" ? status === "HIDDEN" : status === filterStatus);
      return matchesSlug && matchesStatus;
    });
  }, [comments, filterSlug, filterStatus]);

  const uniqueSlugs = useMemo(() => {
    const set = new Set<string>();
    comments.forEach((c) => {
      const s = c.projectSlug || (c as any).project_slug;
      if (s) set.add(s);
    });
    return Array.from(set);
  }, [comments]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="label-track text-gold">CMS MODERATION QUEUE</span>
          </div>
          <h2 className="title-card mt-1 text-3xl text-ivory">Project Comments Moderation</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Review, approve, reject, archive or delete visitor comments. Only APPROVED comments display publicly on project pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap rounded border border-border bg-navy/40 p-1 gap-1">
            {(["ALL", "PENDING", "APPROVED", "REJECTED", "ARCHIVED"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`label-track px-3 py-1.5 !text-[8px] rounded transition-all cursor-pointer flex items-center gap-1 ${
                  filterStatus === st
                    ? "bg-gold text-charcoal font-bold shadow-sm"
                    : "text-ivory/70 hover:text-ivory"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`text-[9px] px-1 rounded-full ${
                    filterStatus === st
                      ? "bg-charcoal/20 text-charcoal font-black"
                      : st === "PENDING" && counts.PENDING > 0
                      ? "bg-amber-500/20 text-amber-300 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {counts[st]}
                </span>
              </button>
            ))}
          </div>

          {/* Film Dropdown Filter */}
          <div className="flex items-center gap-2 bg-navy border border-border px-3 py-1.5 rounded">
            <Filter size={13} className="text-gold" />
            <select
              value={filterSlug}
              onChange={(e) => setFilterSlug(e.target.value)}
              className="bg-transparent text-xs text-ivory focus:outline-none cursor-pointer"
            >
              <option value="all">All Films ({comments.length})</option>
              {uniqueSlugs.map((slug) => {
                const count = comments.filter(
                  (c) => (c.projectSlug || (c as any).project_slug) === slug
                ).length;
                return (
                  <option key={slug} value={slug}>
                    {slug} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadAllComments}
            disabled={isLoading}
            className="label-track flex items-center gap-1.5 border border-border px-3.5 py-1.5 !text-[9px] text-ivory hover:text-gold hover:border-gold/60 rounded cursor-pointer transition-colors"
          >
            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Action Banner */}
      {actionStatus && (
        <div
          className={`p-3.5 rounded text-xs flex items-center justify-between border ${
            actionStatus.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <span>{actionStatus.message}</span>
          <button onClick={() => setActionStatus(null)} className="text-[10px] hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Load Error Banner */}
      {loadError && (
        <div className="p-4 bg-red-500/10 border border-red-500/40 rounded text-red-400 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle size={16} />
            <span>Failed to load comments queue</span>
          </div>
          <p className="font-mono text-[11px] text-red-300">{loadError}</p>
          <button
            onClick={loadAllComments}
            className="label-track mt-1 bg-red-500 text-white px-3 py-1 text-[9px] rounded font-bold hover:bg-red-600 cursor-pointer inline-flex items-center gap-1"
          >
            <RefreshCw size={10} /> Retry Connection
          </button>
        </div>
      )}

      {/* Queue Body */}
      {isLoading ? (
        <div className="py-16 text-center text-gold font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw size={16} className="animate-spin" />
          <span>Fetching moderation queue from Supabase...</span>
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="border border-dashed border-border/80 p-12 text-center bg-navy/20 rounded">
          <MessageSquare size={32} className="text-gold/40 mx-auto mb-3" />
          <p className="text-sm text-ivory font-medium">No comments match this filter</p>
          <p className="text-xs text-muted-foreground mt-1">
            Visitor comments submitted on project case studies appear here for moderation.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredComments.map((c) => {
            const rawSlug = c.projectSlug || (c as any).project_slug || "project";
            const userName = c.userName || (c as any).user_name || "Visitor";
            const userEmail = c.userEmail || (c as any).user_email || "";
            const userAvatar = c.userAvatar || (c as any).user_avatar;
            const createdAt = c.createdAt || (c as any).created_at || new Date().toISOString();
            const status = c.status || (c as any).status || "PENDING";
            const isProcessing = actionLoadingId === c.id;

            return (
              <div
                key={c.id}
                className={`border p-5 rounded space-y-3 transition-colors ${
                  status === "PENDING"
                    ? "border-amber-500/50 bg-amber-500/5"
                    : status === "APPROVED"
                    ? "border-emerald-500/40 bg-navy/30"
                    : status === "REJECTED"
                    ? "border-red-500/40 bg-red-500/5"
                    : "border-border/60 bg-charcoal/80 opacity-75"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-3">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="h-8 w-8 rounded-full border border-gold/40 object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center text-xs text-gold font-bold">
                        {userName.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ivory">{userName}</span>
                        {userEmail && (
                          <span className="text-[11px] text-muted-foreground font-mono">({userEmail})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gold font-mono uppercase mt-0.5">
                        <Film size={11} className="text-gold/70" />
                        <span>Film:</span>
                        <a
                          href={`/portfolio/${rawSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:text-ivory inline-flex items-center gap-0.5"
                        >
                          {rawSlug} <ExternalLink size={9} />
                        </a>
                        <span>•</span>
                        <span className="text-muted-foreground">{new Date(createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`label-track px-2 py-0.5 !text-[8px] rounded border font-bold ${
                        status === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : status === "PENDING"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                          : status === "REJECTED"
                          ? "bg-red-500/20 text-red-400 border-red-500/40"
                          : "bg-zinc-500/20 text-zinc-400 border-zinc-500/40"
                      }`}
                    >
                      ● {status === "HIDDEN" ? "ARCHIVED" : status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-ivory/90 leading-relaxed font-sans whitespace-pre-wrap">{c.content}</p>

                {/* Moderation Actions: APPROVE, REJECT, ARCHIVE, RESTORE, DELETE */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border/30">
                  {status !== "APPROVED" && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, "APPROVED")}
                      disabled={isProcessing}
                      className="label-track flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-1.5 !text-[9px] rounded font-bold transition-colors cursor-pointer"
                    >
                      {isProcessing ? <RefreshCw size={10} className="animate-spin" /> : <CheckCircle size={12} />}
                      APPROVE (Make Public)
                    </button>
                  )}

                  {status !== "REJECTED" && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, "REJECTED")}
                      disabled={isProcessing}
                      className="label-track flex items-center gap-1.5 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 text-red-300 px-3 py-1.5 !text-[9px] rounded transition-colors cursor-pointer"
                    >
                      {isProcessing ? <RefreshCw size={10} className="animate-spin" /> : <XCircle size={12} />}
                      REJECT
                    </button>
                  )}

                  {status !== "HIDDEN" && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, "HIDDEN")}
                      disabled={isProcessing}
                      className="label-track flex items-center gap-1.5 border border-border bg-charcoal hover:bg-navy disabled:opacity-50 text-ivory/80 px-3 py-1.5 !text-[9px] rounded transition-colors cursor-pointer"
                    >
                      {isProcessing ? <RefreshCw size={10} className="animate-spin" /> : <Archive size={12} />}
                      ARCHIVE / HIDE
                    </button>
                  )}

                  {status !== "PENDING" && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, "PENDING")}
                      disabled={isProcessing}
                      className="label-track flex items-center gap-1.5 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-50 text-amber-300 px-3 py-1.5 !text-[9px] rounded transition-colors cursor-pointer"
                    >
                      {isProcessing ? <RefreshCw size={10} className="animate-spin" /> : <RotateCcw size={12} />}
                      RESTORE TO PENDING
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={isProcessing}
                    className="label-track flex items-center gap-1.5 border border-red-500/40 bg-red-500/5 hover:bg-red-500/20 disabled:opacity-50 text-red-400 px-3 py-1.5 !text-[9px] rounded transition-colors cursor-pointer"
                  >
                    {isProcessing ? <RefreshCw size={10} className="animate-spin" /> : <Trash2 size={12} />}
                    DELETE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
