import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title?: string;
}

export function VideoModal({ isOpen, onClose, videoId, title }: VideoModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShouldLoadIframe(true);
    } else {
      setShouldLoadIframe(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const stopVideo = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const currentSrc = iframe.src;
      iframe.src = "";
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    }
  };

  const handleClose = () => {
    stopVideo();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl px-4 md:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              aria-label="Close video modal"
              className="absolute -top-12 right-0 flex items-center gap-2 text-ivory transition-colors hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold md:-top-16 min-h-[44px] min-w-[44px]"
            >
              <span className="label-track !text-[10px]">CLOSE</span>
              <X size={24} />
            </button>

            <div className="relative aspect-video w-full overflow-hidden bg-navy">
              {shouldLoadIframe && (
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`}
                  title={title || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              )}
            </div>

            {title && (
              <p id="video-title" className="label-track mt-4 text-center text-gold">
                {title}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
