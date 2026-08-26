import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only magnetic cinematic cursor.
 * - Reads data-cursor="view film|open project|enter|text" from hovered elements.
 * - Supports magnetic snapping on data-magnetic elements and primary buttons.
 * - Respects prefers-reduced-motion.
 */
export function CinematicCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [mode, setMode] = useState<"idle" | "text" | "label" | "action" | "magnetic">("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    if (!fine.matches) return;

    document.body.classList.add("cine-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let magneticEl: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      setVisible(true);

      const targetEl = e.target as HTMLElement | null;
      const cursorTarget = targetEl?.closest?.("[data-cursor]") as HTMLElement | null;
      const magneticTarget = targetEl?.closest?.("[data-magnetic], button, a") as HTMLElement | null;
      const cursorValue = cursorTarget?.dataset?.["cursor"];

      if (magneticTarget && magneticTarget.getAttribute("data-magnetic") !== "false") {
        magneticEl = magneticTarget;
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 80) {
          // Magnetic pull toward element center
          target.x = centerX + distX * 0.28;
          target.y = centerY + distY * 0.28;
        } else {
          target.x = e.clientX;
          target.y = e.clientY;
        }
      } else {
        magneticEl = null;
        target.x = e.clientX;
        target.y = e.clientY;
      }

      if (cursorValue) {
        if (cursorValue === "text") {
          setMode("text");
          setLabel(null);
        } else {
          setMode("label");
          setLabel(cursorValue);
        }
      } else if (magneticTarget) {
        setMode("action");
        setLabel(null);
      } else {
        setMode("idle");
        setLabel(null);
      }
    };

    const onLeave = () => {
      setVisible(false);
      magneticEl = null;
    };

    const tick = () => {
      // Smooth lerp physics
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.body.classList.remove("cine-cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden lg:block will-change-transform"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        className="flex items-center justify-center rounded-full transition-all duration-300 ease-out"
        style={{
          width: mode === "label" ? 112 : mode === "action" ? 36 : mode === "text" ? 36 : 12,
          height: mode === "label" ? 112 : mode === "action" ? 36 : mode === "text" ? 36 : 12,
          border:
            mode === "label"
              ? "1px solid rgba(201, 164, 76, 0.85)"
              : mode === "action"
                ? "1.5px solid rgba(201, 164, 76, 0.75)"
                : mode === "text"
                  ? "1px solid rgba(244, 240, 232, 0.5)"
                  : "none",
          backgroundColor:
            mode === "label"
              ? "rgba(20, 23, 26, 0.72)"
              : mode === "action"
                ? "rgba(201, 164, 76, 0.12)"
                : mode === "text"
                  ? "rgba(244, 240, 232, 0.1)"
                  : "var(--gold)",
          backdropFilter: mode === "label" || mode === "action" ? "blur(4px)" : "none",
          boxShadow:
            mode === "label"
              ? "0 0 25px rgba(201, 164, 76, 0.18)"
              : mode === "idle"
                ? "0 0 10px rgba(201, 164, 76, 0.4)"
                : "none",
        }}
      >
        {label ? (
          <span className="label-track px-3 text-center !text-[9px] !tracking-[0.22em] text-ivory font-medium select-none">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
