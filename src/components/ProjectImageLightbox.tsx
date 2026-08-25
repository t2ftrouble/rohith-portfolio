import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  altText?: string[];
}

export function ProjectImageLightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  altText = [],
}: ProjectImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleArrowLeft = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && isOpen && images.length > 1) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    };

    const handleArrowRight = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && isOpen && images.length > 1) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("keydown", handleArrowLeft);
    window.addEventListener("keydown", handleArrowRight);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("keydown", handleArrowLeft);
      window.removeEventListener("keydown", handleArrowRight);
    };
  }, [isOpen, onClose, images.length]);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Prevent body scroll when lightbox is open
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

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full max-w-7xl max-h-[90vh] px-4 md:px-8 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close lightbox"
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 flex items-center gap-2 text-ivory transition-colors hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px] min-w-[44px]"
            >
              <span className="label-track !text-[10px]">CLOSE</span>
              <X size={24} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  aria-label="Previous image"
                  className="absolute left-4 md:left-8 z-10 flex items-center justify-center w-12 h-12 text-ivory transition-colors hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={goToNext}
                  aria-label="Next image"
                  className="absolute right-4 md:right-8 z-10 flex items-center justify-center w-12 h-12 text-ivory transition-colors hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <motion.img
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={images[currentIndex]}
              alt={altText[currentIndex] || `Image ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />

            {images.length > 1 && (
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2">
                <p className="label-track text-gold">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(images.length).padStart(2, "0")}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
