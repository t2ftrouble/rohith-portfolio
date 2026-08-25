import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  altText?: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  altText = [],
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      } else if (e.key === "ArrowLeft" && isOpen) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight" && isOpen) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, images.length]);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

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
          aria-label="Image gallery"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full w-full max-w-7xl px-4 md:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close image gallery"
              className="absolute right-4 top-4 z-10 flex items-center gap-2 text-ivory transition-colors hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold md:right-8 md:top-8"
            >
              <span className="label-track !text-[10px]">CLOSE</span>
              <X size={24} />
            </button>

            {/* Image Counter */}
            {images.length > 1 && (
              <div
                className="absolute left-4 top-4 z-10 label-track !text-[10px] text-gold md:left-8 md:top-8"
                aria-live="polite"
              >
                Image {currentIndex + 1} of {images.length}
              </div>
            )}

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-charcoal/70 text-ivory transition-colors hover:bg-gold hover:!text-charcoal focus:outline-none focus:ring-2 focus:ring-gold md:left-8"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={goToNext}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-charcoal/70 text-ivory transition-colors hover:bg-gold hover:!text-charcoal focus:outline-none focus:ring-2 focus:ring-gold md:right-8"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="flex h-full items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={altText[currentIndex] || `Image ${currentIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </AnimatePresence>
            </div>

            {/* Image Caption */}
            {altText[currentIndex] && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="label-track !text-[10px] text-gold">{altText[currentIndex]}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
