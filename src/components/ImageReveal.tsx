import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function ImageReveal({
  src,
  alt,
  className = "",
  priority = false,
  width,
  height,
}: ImageRevealProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    const imgElement = document.getElementById(`img-reveal-${src.replace(/[^a-zA-Z0-9]/g, "")}`);
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      id={`img-reveal-${src.replace(/[^a-zA-Z0-9]/g, "")}`}
      className={`relative overflow-hidden bg-navy ${className}`}
      style={{ width, height }}
    >
      {!isLoaded && <div className="absolute inset-0 bg-navy animate-pulse" />}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleLoad}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
