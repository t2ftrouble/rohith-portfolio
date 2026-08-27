import { useState, useEffect } from "react";
import {
  Inbox,
  RefreshCw,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
  Archive,
  Clock,
  MapPin,
  Briefcase,
  Building,
} from "lucide-react";
import {
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  type ContactEnquiry,
  type EnquiryStatus,
} from "@/lib/enquiries";

interface EnquiriesInboxProps {
  onUnreadCountChange?: (count: number) => void;
}

export function EnquiriesInbox({ onUnreadCountChange }: EnquiriesInboxProps) {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"ALL" | EnquiryStatus>("ALL");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data);
      const newCount = data.filter((e) => e.status === "NEW").length;
      if (onUnreadCountChange) onUnreadCountChange(newCount);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
      setStatusMessage({
        type: "error",
        text: "Could not load enquiries from storage.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      const updated = await updateEnquiryStatus(id, newStatus);
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: updated.status } : item))
      );
      const newCount = enquiries.filter(
        (e) => (e.id === id ? newStatus : e.status) === "NEW"
      ).length;
      if (onUnreadCountChange) onUnreadCountChange(newCount);
      setStatusMessage({
        type: "success",
        text: `✓ Enquiry status updated to "${newStatus}"`,
      });
    } catch (err) {
      console.error("Status update error:", err);
      setStatusMessage({
        type: "error",
        text: "Failed to update enquiry status",
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete enquiry from "${name}"?`)) {
      return;
    }

    try {
      await deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage({
        type: "success",
        text: `✓ Enquiry from "${name}" deleted successfully`,
      });
    } catch (err) {
      console.error("Delete error:", err);
      setStatusMessage({
        type: "error",
        text: "Failed to delete enquiry",
      });
    }
  };

  const filteredEnquiries =
    activeFilter === "ALL"
      ? enquiries
      : enquiries.filter((e) => e.status === activeFilter);

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "NEW":
        return (
          <span className="label-track !text-[9px] font-bold bg-amber-500/15 border border-amber-500/50 text-amber-400 px-2.5 py-0.5 rounded">
            ● NEW
          </span>
        );
      case "CONTACTED":
        return (
          <span className="label-track !text-[9px] font-bold bg-cyan-500/15 border border-cyan-500/50 text-cyan-400 px-2.5 py-0.5 rounded">
            CONTACTED
          </span>
        );
      case "COMPLETED":
        return (
          <span className="label-track !text-[9px] font-bold bg-emerald-500/15 border border-emerald-500/50 text-emerald-400 px-2.5 py-0.5 rounded">
            COMPLETED
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="label-track !text-[9px] font-bold bg-muted/40 border border-border text-muted-foreground px-2.5 py-0.5 rounded">
            ARCHIVED
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gold font-mono text-xs gap-3">
        <RefreshCw size={16} className="animate-spin" />
        <span>Loading enquiries inbox...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* FILTER BUTTONS & REFRESH */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex flex-wrap gap-2">
          {(["ALL", "NEW", "CONTACTED", "COMPLETED", "ARCHIVED"] as const).map((filter) => {
            const count =
              filter === "ALL"
                ? enquiries.length
                : enquiries.filter((e) => e.status === filter).length;
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`label-track px-3.5 py-2 !text-[9px] border transition-all rounded cursor-pointer ${
                  isSelected
                    ? "bg-gold border-gold text-charcoal font-bold shadow-md"
                    : "border-border/80 bg-navy/40 text-ivory/80 hover:border-gold/60"
                }`}
              >
                {filter} ({count})
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={loadData}
          className="label-track border border-border px-3.5 py-2 !text-[9px] text-ivory hover:text-gold hover:border-gold/60 transition-colors flex items-center gap-1.5 rounded cursor-pointer"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* ENQUIRIES LIST */}
      {filteredEnquiries.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/80 bg-navy/10 rounded">
          <Inbox size={32} className="mx-auto text-muted-foreground/60 mb-3" />
          <p className="text-sm text-muted-foreground">
            No enquiries found in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className={`border bg-navy/20 p-5 md:p-6 rounded space-y-4 transition-colors ${
                enquiry.status === "NEW"
                  ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60"
                  : "border-border hover:border-gold/50"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
                <div className="flex items-center gap-3">
                  {getStatusBadge(enquiry.status)}
                  <h4 className="title-card text-xl text-ivory">{enquiry.name}</h4>
                  <span className="label-track text-gold/80 !text-[10px] bg-charcoal px-2 py-0.5 rounded border border-border/60">
                    {enquiry.projectType}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Clock size={12} />
                  <span>
                    {new Date(enquiry.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* DETAILS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                {enquiry.business && (
                  <div className="flex items-center gap-2">
                    <Building size={13} className="text-gold/70" />
                    <span className="text-ivory/90">{enquiry.business}</span>
                  </div>
                )}
                {enquiry.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-gold/70" />
                    <span className="text-ivory/90">{enquiry.location}</span>
                  </div>
                )}
                {enquiry.budget && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={13} className="text-gold/70" />
                    <span className="text-ivory/90">Budget: {enquiry.budget}</span>
                  </div>
                )}
              </div>

              {/* MESSAGE CONTENT */}
              <div className="p-4 bg-charcoal/90 border border-border/70 rounded">
                <p className="text-xs text-ivory/90 whitespace-pre-wrap leading-relaxed">
                  {enquiry.message}
                </p>
              </div>

              {/* ACTIONS & STATUS PROGRESSION */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Set Status:
                  </span>
                  {(["NEW", "CONTACTED", "COMPLETED", "ARCHIVED"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={enquiry.status === st}
                      onClick={() => handleStatusChange(enquiry.id, st)}
                      className={`label-track px-2.5 py-1 !text-[8px] border transition-all rounded cursor-pointer disabled:opacity-40 disabled:cursor-default ${
                        enquiry.status === st
                          ? "border-gold text-gold font-bold bg-gold/10"
                          : "border-border text-muted-foreground hover:text-ivory hover:border-gold/40"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {enquiry.email && (
                    <a
                      href={`mailto:${enquiry.email}?subject=Re: Project Enquiry for Rohith V`}
                      className="label-track border border-gold/60 bg-gold/10 px-3 py-2 !text-[9px] text-gold hover:bg-gold hover:!text-charcoal transition-all flex items-center gap-1.5 rounded"
                    >
                      <Mail size={12} />
                      Reply via Email
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(enquiry.id, enquiry.name)}
                    className="p-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors rounded"
                    title="Delete Enquiry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
