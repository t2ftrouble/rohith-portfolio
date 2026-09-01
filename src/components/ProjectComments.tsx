import { useState, useEffect, useCallback, useMemo } from "react";
import {
  MessageSquare,
  Send,
  Trash2,
  Edit2,
  Check,
  X,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { supabase } from "@/integrations/supabase/client";

export interface CommentItem {
  id: string;
  projectSlug: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  content: string;
  status: "PENDING" | "APPROVED" | "HIDDEN" | "REJECTED";
  createdAt: string;
  // snake_case optional aliases
  project_slug?: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  user_avatar?: string;
  created_at?: string;
}

interface ProjectCommentsProps {
  projectSlug: string;
  projectTitle: string;
}

export function ProjectComments({ projectSlug, projectTitle }: ProjectCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [userPendingComments, setUserPendingComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; email: string; avatar?: string } | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // 1. Session Detection
  useEffect(() => {
    const checkSupabaseAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          const userObj = {
            id: u.id,
            name:
              u.user_metadata?.["full_name"] ||
              u.user_metadata?.["name"] ||
              u.email?.split("@")[0] ||
              "Film Viewer",
            email: u.email || "",
            avatar:
              u.user_metadata?.["avatar_url"] ||
              u.user_metadata?.["picture"] ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.email || "User")}`,
          };
          setUser(userObj);
          return;
        }
      } catch (err) {
        console.warn("Supabase auth session check:", err);
      }

      // Fallback to cached user session
      const savedUser = typeof window !== "undefined" ? localStorage.getItem("rohith_comment_user") : null;
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {}
      }
    };

    checkSupabaseAuth();

    // Listen for OAuth redirects and auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const userObj = {
          id: u.id,
          name:
            u.user_metadata?.["full_name"] ||
            u.user_metadata?.["name"] ||
            u.email?.split("@")[0] ||
            "Film Viewer",
          email: u.email || "",
          avatar:
            u.user_metadata?.["avatar_url"] ||
            u.user_metadata?.["picture"] ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.email || "User")}`,
        };
        setUser(userObj);
        localStorage.setItem("rohith_comment_user", JSON.stringify(userObj));
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // 2. Load Approved Comments
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/comments?projectSlug=${encodeURIComponent(projectSlug)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.warn("Comments load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectSlug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // 3. Google Sign-In
  const handleGoogleSignIn = async () => {
    sound.playSoftClick();
    setAuthError(null);

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}`
          : "https://rohithfilm.vercel.app";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.warn("Supabase Google OAuth error:", error.message);
        setAuthError(`Google Sign-In notice: ${error.message}. You can also enter your viewer name to participate.`);
        
        // Graceful fallback prompt
        const simulatedName = prompt("Enter your Name for Film Discussion:", "Film Viewer");
        if (!simulatedName) return;
        const simulatedEmail = prompt("Enter your Email (optional):", "viewer@gmail.com") || "viewer@gmail.com";

        const newUser = {
          id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: simulatedName.trim(),
          email: simulatedEmail.trim(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(simulatedName)}`,
        };

        setUser(newUser);
        localStorage.setItem("rohith_comment_user", JSON.stringify(newUser));
        setAuthError(null);
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setAuthError(err.message || "Failed to initiate sign-in");
    }
  };

  const handleSignOut = async () => {
    sound.playSoftClick();
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    localStorage.removeItem("rohith_comment_user");
    setUserPendingComments([]);
    setNotice(null);
  };

  // 4. Post New Comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setNotice({ type: "error", text: "Please sign in with Google to post your thoughts." });
      return;
    }

    const text = commentText.trim();
    if (!text) return;

    if (text.length > 1000) {
      setNotice({ type: "error", text: "Comment is too long (maximum 1000 characters)." });
      return;
    }

    setIsSubmitting(true);
    setNotice(null);
    sound.playSoftClick();

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userAvatar: user.avatar,
          content: text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to post comment");
      }

      setCommentText("");
      setNotice({
        type: "success",
        text: "✓ Your comment has been submitted and is currently pending admin moderation approval.",
      });

      // Keep user's submitted comment locally visible with pending badge
      if (data.comment) {
        setUserPendingComments((prev) => [data.comment, ...prev]);
      }

      await loadComments();
    } catch (err: any) {
      setNotice({ type: "error", text: err.message || "Could not post comment. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Delete Own Comment
  const handleDelete = async (id: string) => {
    if (!user || !confirm("Are you sure you want to remove your comment?")) return;
    sound.playSoftClick();

    try {
      const res = await fetch(
        `/api/comments?id=${encodeURIComponent(id)}&userId=${encodeURIComponent(user.id)}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        setUserPendingComments((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Delete own comment error:", err);
    }
  };

  // 6. Edit Own Comment
  const handleSaveEdit = async (id: string) => {
    if (!user || !editText.trim()) return;
    sound.playSoftClick();

    try {
      const res = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          userId: user.id,
          content: editText.trim(),
        }),
      });

      if (res.ok) {
        setEditingId(null);
        setNotice({
          type: "success",
          text: "✓ Edited comment submitted for re-moderation.",
        });
        await loadComments();
      }
    } catch (err) {
      console.error("Edit own comment error:", err);
    }
  };

  // Combine approved public comments with any newly submitted comments by the current user
  const displayComments = useMemo(() => {
    const combined = [...userPendingComments, ...comments];
    const seen = new Set<string>();
    return combined.filter((c) => {
      if (!c.id || seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [userPendingComments, comments]);

  return (
    <div className="border border-border/80 bg-navy/20 p-6 md:p-10 space-y-8 rounded">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <p className="label-track text-gold flex items-center gap-2">
            <MessageSquare size={14} /> FILM DISCUSSION & AUDIENCE FEEDBACK
          </p>
          <h3 className="title-card mt-2 text-2xl text-ivory">
            Thoughts on {projectTitle}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Join the conversation. Comments are moderated to maintain thoughtful artistic discussion.
          </p>
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-3 bg-charcoal border border-border px-3.5 py-2 rounded">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full border border-gold/40 object-cover" />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gold/20 flex items-center justify-center text-[10px] text-gold font-bold">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xs text-ivory font-mono font-medium">{user.name}</span>
                {user.email && <span className="text-[10px] text-muted-foreground font-mono">{user.email}</span>}
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-[10px] text-muted-foreground hover:text-red-400 font-mono transition-colors ml-2 cursor-pointer flex items-center gap-1"
                title="Sign Out"
              >
                <LogOut size={11} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              data-cursor="google sign in"
              className="label-track flex items-center gap-2.5 bg-charcoal border border-gold/60 px-4 py-2.5 !text-[9px] text-gold hover:bg-gold hover:!text-charcoal transition-all rounded shadow-sm cursor-pointer font-bold"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              CONTINUE WITH GOOGLE
            </button>
          )}
        </div>
      </div>

      {/* Auth Notice */}
      {authError && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Submission Feedback */}
      {notice && (
        <div
          className={`p-3.5 rounded text-xs flex items-center justify-between border ${
            notice.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} className="text-[10px] hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!user || isSubmitting}
            placeholder={
              user
                ? `Share your thoughts or breakdown analysis on ${projectTitle}... (max 1000 characters)`
                : "Please click 'CONTINUE WITH GOOGLE' above to post your thoughts on this film."
            }
            maxLength={1000}
            rows={3}
            className="w-full bg-charcoal/90 border border-border p-4 text-sm text-ivory placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none transition-colors rounded resize-y disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {user && (
            <span className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground font-mono">
              {commentText.length}/1000
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground font-mono">
            Comments appear publicly after approval.
          </p>

          <button
            type="submit"
            disabled={!user || !commentText.trim() || isSubmitting}
            className="label-track bg-gold px-6 py-2.5 !text-[9px] !text-charcoal font-bold hover:bg-gold/90 transition-all rounded disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={12} />
                Post Comment
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-gold flex items-center gap-2">
            <span>AUDIENCE DISCUSSION</span>
            <span className="text-ivory">({displayComments.length})</span>
          </h4>

          <button
            type="button"
            onClick={loadComments}
            disabled={isLoading}
            className="text-[10px] font-mono text-muted-foreground hover:text-gold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={10} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-gold font-mono flex items-center justify-center gap-2">
            <RefreshCw size={14} className="animate-spin" />
            <span>Loading discussion...</span>
          </div>
        ) : displayComments.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-border/60 rounded bg-charcoal/40">
            <p className="text-xs text-muted-foreground">
              No comments yet on {projectTitle}. Be the first to share your perspective!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayComments.map((c) => {
              const userName = c.userName || (c as any).user_name || "Film Viewer";
              const userAvatar = c.userAvatar || (c as any).user_avatar;
              const createdAt = c.createdAt || (c as any).created_at || new Date().toISOString();
              const isPending = (c.status || (c as any).status) === "PENDING";
              const isOwner = user && user.id === (c.userId || (c as any).user_id);
              const isEditing = editingId === c.id;

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded border transition-colors ${
                    isPending
                      ? "border-amber-500/40 bg-amber-500/5"
                      : "border-border/60 bg-charcoal/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="h-7 w-7 rounded-full border border-gold/40 object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gold/20 flex items-center justify-center text-[10px] text-gold font-bold">
                          {userName.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-ivory">{userName}</span>
                          {isPending && (
                            <span className="label-track !text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded inline-flex items-center gap-1 font-mono">
                              <Clock size={9} /> Pending Approval
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {isOwner && !isEditing && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(c.id);
                            setEditText(c.content);
                          }}
                          className="text-[10px] hover:text-gold transition-colors flex items-center gap-1 cursor-pointer font-mono"
                          title="Edit Comment"
                        >
                          <Edit2 size={11} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          className="text-[10px] hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer font-mono"
                          title="Delete Comment"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={2}
                        maxLength={1000}
                        className="w-full bg-navy/80 border border-gold/60 p-2.5 text-xs text-ivory focus:outline-none rounded"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-[10px] font-mono text-muted-foreground hover:text-ivory px-2 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(c.id)}
                          className="label-track bg-gold text-charcoal font-bold px-3 py-1 text-[9px] rounded"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-ivory/90 leading-relaxed font-sans whitespace-pre-wrap">
                      {c.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
