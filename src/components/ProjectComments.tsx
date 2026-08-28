import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, Edit2, Check, X, ShieldAlert } from "lucide-react";
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
}

interface ProjectCommentsProps {
  projectSlug: string;
  projectTitle: string;
}

export function ProjectComments({ projectSlug, projectTitle }: ProjectCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; email: string; avatar?: string } | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    // 1. Check Supabase Auth user session
    const checkSupabaseAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          const userObj = {
            id: u.id,
            name: u.user_metadata?.["full_name"] || u.user_metadata?.["name"] || u.email?.split("@")[0] || "Film Viewer",
            email: u.email || "",
            avatar: u.user_metadata?.["avatar_url"] || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.email || "User")}`,
          };
          setUser(userObj);
          return;
        }
      } catch (err) {
        console.warn("Supabase auth session check:", err);
      }

      // 2. Fallback to localStorage session
      const savedUser = localStorage.getItem("rohith_comment_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {}
      }
    };

    checkSupabaseAuth();
    loadComments();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const userObj = {
          id: u.id,
          name: u.user_metadata?.["full_name"] || u.user_metadata?.["name"] || u.email?.split("@")[0] || "Film Viewer",
          email: u.email || "",
          avatar: u.user_metadata?.["avatar_url"] || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.email || "User")}`,
        };
        setUser(userObj);
        localStorage.setItem("rohith_comment_user", JSON.stringify(userObj));
      } else if (!localStorage.getItem("rohith_comment_user")) {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [projectSlug]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/comments?projectSlug=${encodeURIComponent(projectSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    sound.playSoftClick();

    try {
      // Attempt real Supabase OAuth Google Sign-in
      // Use clean origin + pathname so OAuth returns to the exact current project page
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
        console.warn("Supabase Google OAuth initialization notice:", error.message);
        // Fallback to guest identity prompt if Google Cloud OAuth client isn't connected in Supabase
        const simulatedName = prompt("Enter your Name for Comment Sign-in:", "Film Enthusiast");
        if (!simulatedName) return;
        const simulatedEmail = prompt("Enter your Email:", "viewer@gmail.com") || "viewer@gmail.com";
        
        const newUser = {
          id: `usr_${Date.now()}`,
          name: simulatedName.trim(),
          email: simulatedEmail.trim(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(simulatedName)}`,
        };

        setUser(newUser);
        localStorage.setItem("rohith_comment_user", JSON.stringify(newUser));
      }
    } catch {
      const simulatedName = prompt("Enter your Name for Comment Sign-in:", "Film Enthusiast");
      if (!simulatedName) return;
      const simulatedEmail = prompt("Enter your Email:", "viewer@gmail.com") || "viewer@gmail.com";
      
      const newUser = {
        id: `usr_${Date.now()}`,
        name: simulatedName.trim(),
        email: simulatedEmail.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(simulatedName)}`,
      };

      setUser(newUser);
      localStorage.setItem("rohith_comment_user", JSON.stringify(newUser));
    }
  };

  const handleSignOut = async () => {
    sound.playSoftClick();
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    localStorage.removeItem("rohith_comment_user");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setNotice({ type: "error", text: "Please sign in with Google to post your comment." });
      return;
    }
    if (!commentText.trim()) return;

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
          content: commentText.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to post comment" }));
        throw new Error(err.error || "Failed to post comment");
      }

      setCommentText("");
      setNotice({
        type: "success",
        text: "✓ Your comment was submitted and is pending moderation approval.",
      });
      await loadComments();
    } catch (err: any) {
      setNotice({ type: "error", text: err.message || "Could not post comment." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Are you sure you want to remove your comment?")) return;
    sound.playSoftClick();

    try {
      const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}&userId=${encodeURIComponent(user.id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        await loadComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border border-border/80 bg-navy/20 p-6 md:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <p className="label-track text-gold flex items-center gap-2">
            <MessageSquare size={14} /> FILM DISCUSSION
          </p>
          <h3 className="title-card mt-2 text-2xl text-ivory">Share your thoughts on this film.</h3>
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-3 bg-charcoal border border-border px-3 py-1.5 rounded">
              {user.avatar && (
                <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full border border-gold/40" />
              )}
              <span className="text-xs text-ivory font-mono">{user.name}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-[10px] text-muted-foreground hover:text-red-400 font-mono transition-colors cursor-pointer"
              >
                (Sign Out)
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              data-cursor="google sign in"
              className="label-track flex items-center gap-2 bg-charcoal border border-gold/60 px-4 py-2.5 !text-[9px] text-gold hover:bg-gold hover:!text-charcoal transition-all rounded shadow-sm cursor-pointer font-bold"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!user || isSubmitting}
            maxLength={1000}
            placeholder={
              user
                ? `Write your thoughts on ${projectTitle}...`
                : "Continue with Google above to share your thoughts, critiques, or observations..."
            }
            rows={3}
            className="w-full bg-charcoal border border-border px-4 py-3 text-sm text-ivory placeholder:text-muted-foreground focus:border-gold focus:outline-none transition-colors disabled:opacity-50 resize-none rounded"
          />
        </div>

        {notice && (
          <div
            className={`p-3 rounded text-xs border ${
              notice.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                : "bg-red-500/10 border-red-500/40 text-red-400"
            }`}
          >
            {notice.text}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground">
            Moderated discussion. Comments appear publicly after admin approval. ({commentText.length}/1000 chars)
          </p>

          <button
            type="submit"
            disabled={!user || !commentText.trim() || isSubmitting}
            className="label-track self-end sm:self-auto flex items-center gap-2 bg-gold px-6 py-2.5 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-all rounded disabled:opacity-40 cursor-pointer shadow-md"
          >
            {isSubmitting ? "Submitting..." : (
              <>
                <Send size={12} /> POST COMMENT
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-border/40 rounded bg-charcoal/20">
            <p className="text-xs text-muted-foreground">No public comments yet. Be the first to share your review!</p>
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded border border-border/60 bg-charcoal/60 space-y-3 transition-colors hover:border-border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={c.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.userName)}`}
                    alt={c.userName}
                    className="h-7 w-7 rounded-full border border-gold/30 object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-ivory">{c.userName}</h5>
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {user && user.id === c.userId && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(c.id);
                        setEditText(c.content);
                      }}
                      className="text-muted-foreground hover:text-gold transition-colors p-1"
                      title="Edit"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>

              {editingId === c.id ? (
                <div className="space-y-2 pt-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className="w-full bg-navy border border-gold/60 p-2 text-xs text-ivory focus:outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-[10px] border border-border text-ivory"
                    >
                      <X size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(c.id)}
                      className="px-3 py-1 text-[10px] bg-gold text-charcoal font-bold flex items-center gap-1"
                    >
                      <Check size={12} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-ivory/85 leading-relaxed font-sans">{c.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
