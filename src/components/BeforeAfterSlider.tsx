import { useRef, useCallback, useEffect, useState } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  className = "",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isInteracting, setIsInteracting] = useState(false);
  const hasAutoPeeked = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setSliderPosition(percentage);
  }, []);

  // Initial subtle auto-peek when scrolled into view
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || hasAutoPeeked.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAutoPeeked.current) {
          hasAutoPeeked.current = true;
          // Smooth peek animation
          let step = 0;
          const peekFrames = [50, 44, 38, 44, 56, 62, 56, 50];
          const interval = setInterval(() => {
            if (step < peekFrames.length) {
              setSliderPosition(peekFrames[step]!);
              step++;
            } else {
              clearInterval(interval);
            }
          }, 80);
        }
      },
      { threshold: 0.4 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting) return;
      e.preventDefault();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        updateSlider(e.clientX);
      });
    },
    [isInteracting, updateSlider],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsInteracting(true);
      containerRef.current?.setPointerCapture(e.pointerId);
      updateSlider(e.clientX);
    },
    [updateSlider],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsInteracting(false);
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  // Keyboard navigation support
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPosition((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPosition((p) => Math.min(100, p + 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSliderPosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setSliderPosition(100);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSliderPosition(50);
    }
  }, []);

  const handleDoubleClick = useCallback(() => {
    setSliderPosition(50);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      data-cursor="drag slider"
      onKeyDown={handleKeyDown}
      onDoubleClick={handleDoubleClick}
      className={`group relative aspect-video w-full overflow-hidden bg-navy cursor-ew-resize touch-none select-none border border-border/80 transition-all duration-300 ${
        isInteracting ? "border-gold ring-1 ring-gold/50 shadow-[0_0_30px_rgba(201,164,76,0.15)]" : "hover:border-gold/50"
      } focus:outline-none focus:ring-1 focus:ring-gold ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={{ touchAction: "none" }}
      role="slider"
      aria-label="Before and after visual comparison slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />

      {/* Before Image (Foreground - Clipped with clip-path) */}
      <img
        src={beforeImage}
        alt={beforeLabel}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      />

      {/* Vignette & scanlines */}
      <div className="vignette opacity-40 pointer-events-none" />
      <div className="scanlines absolute inset-0 opacity-15 pointer-events-none" />

      {/* Slider Line Handle with interactive micro-glow */}
      <div
        ref={handleRef}
        className={`absolute top-0 bottom-0 w-[2px] bg-gold pointer-events-none transition-shadow duration-200 ${
          isInteracting ? "shadow-[0_0_20px_rgba(201,164,76,0.95)] w-[2.5px]" : "shadow-[0_0_12px_rgba(201,164,76,0.6)]"
        }`}
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold bg-charcoal/95 text-gold shadow-2xl backdrop-blur-md transition-all duration-200 ${
              isInteracting ? "scale-115 ring-2 ring-gold/40 shadow-gold/40" : "group-hover:scale-105"
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-[10px] leading-none">◀</span>
              <div className="h-3.5 w-0.5 bg-gold/80" />
              <span className="text-[10px] leading-none">▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Percentage Pill (Top Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <span
          className={`label-track px-3.5 py-1 !text-[8px] text-gold backdrop-blur-md shadow-md transition-all duration-200 ${
            isInteracting
              ? "bg-charcoal border border-gold ring-1 ring-gold/30"
              : "bg-charcoal/85 border border-gold/40"
          }`}
        >
          {Math.round(sliderPosition)}% / {Math.round(100 - sliderPosition)}%
        </span>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none z-10">
        <span className="label-track bg-charcoal/85 border border-border/80 px-3 py-1 !text-[9px] text-gold backdrop-blur-md shadow-sm">
          {beforeLabel}
        </span>
        <span className="label-track bg-charcoal/85 border border-border/80 px-3 py-1 !text-[9px] text-gold backdrop-blur-md shadow-sm">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
