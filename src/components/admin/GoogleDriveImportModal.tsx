import { useState, useEffect } from "react";
import { Folder, FileImage, Download, RefreshCw, CheckCircle2, Cloud } from "lucide-react";

interface GoogleDriveImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImportedImage: (url: string) => void;
}

export function GoogleDriveImportModal({
  isOpen,
  onClose,
  onSelectImportedImage,
}: GoogleDriveImportModalProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadDriveFiles();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const loadDriveFiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/google-drive", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        setMessage(data.message || null);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (file: any) => {
    setImportingId(file.id);
    try {
      const res = await fetch("/api/google-drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fileId: file.id,
          fileName: file.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onSelectImportedImage(data.url);
          onClose();
        }
      }
    } catch (err) {
      console.error("Drive import failed:", err);
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-md p-4 sm:p-6">
      <div className="relative w-full max-w-2xl rounded border border-gold/60 bg-navy/95 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <Cloud className="text-gold h-5 w-5" />
            <h3 className="title-card text-2xl text-ivory">Google Drive Master Archive</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="label-track border border-border px-3 py-1.5 !text-[9px] text-ivory hover:text-gold"
          >
            Close ✕
          </button>
        </div>

        <div className="p-3 bg-gold/10 border border-gold/40 text-gold text-xs rounded leading-relaxed">
          <strong>Architecture:</strong> Google Drive stores original full-resolution master archives. When you select an asset below, it is automatically imported, optimized, and attached to Supabase Storage CDN.
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground font-mono text-sm">
            Connecting to Google Drive...
          </div>
        ) : (
          <div className="grid gap-3 max-h-80 overflow-y-auto pr-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border border-border/60 bg-charcoal/90 rounded hover:border-gold/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {file.thumbnailLink ? (
                    <img src={file.thumbnailLink} alt={file.name} className="h-10 w-14 object-cover rounded border border-border" />
                  ) : (
                    <FileImage size={24} className="text-gold/60" />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-ivory truncate max-w-[280px] sm:max-w-md">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">Master File • Image/Media</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleImport(file)}
                  disabled={importingId === file.id}
                  className="label-track flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-charcoal font-bold px-3 py-2 !text-[9px] rounded transition-all cursor-pointer disabled:opacity-50"
                >
                  {importingId === file.id ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download size={11} />
                      Import & Optimize →
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
