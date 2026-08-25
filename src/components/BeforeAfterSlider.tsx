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

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setSliderPosition(percentage);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      // Use requestAnimationFrame for smooth performance
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        updateSlider(e.clientX);
      });
    },
    [updateSlider],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      containerRef.current?.setPointerCapture(e.pointerId);
      updateSlider(e.clientX);
    },
    [updateSlider],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    containerRef.current?.releasePointerCapture(e.pointerId);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
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
      className={`relative aspect-video w-full overflow-hidden bg-navy cursor-ew-resize touch-none select-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={{ touchAction: "none" }}
      role="application"
      aria-label="Before and after image comparison slider"
    >
      {/* After Image (Background - Fixed) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Before Image (Foreground - Fixed position, clipped with clip-path) */}
      <img
        src={beforeImage}
        alt={beforeLabel}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      />

      {/* Slider Handle */}
      <div
        ref={handleRef}
        className="absolute top-0 bottom-0 w-1 bg-gold pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold bg-charcoal/80 backdrop-blur-sm">
            <div className="flex gap-1">
              <div className="h-4 w-0.5 bg-gold" />
              <div className="h-4 w-0.5 bg-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
        <span className="label-track bg-charcoal/70 px-3 py-1 !text-[9px] text-gold backdrop-blur-sm">
          {beforeLabel}
        </span>
        <span className="label-track bg-charcoal/70 px-3 py-1 !text-[9px] text-gold backdrop-blur-sm">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
