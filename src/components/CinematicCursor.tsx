import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only magnetic cinematic cursor.
 * Reads data-cursor="view film|open project|enter|text" from hovered elements.
 */
export function CinematicCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [mode, setMode] = useState<"idle" | "text" | "label">("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    if (!fine.matches) return;

    document.body.classList.add("cine-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);

      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      const value = el?.dataset["cursor"];
      if (!value) {
        setMode("idle");
        setLabel(null);
      } else if (value === "text") {
        setMode("text");
        setLabel(null);
      } else {
        setMode("label");
        setLabel(value);
      }
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
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
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden lg:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 240ms ease" }}
    >
      <div
        className="flex items-center justify-center rounded-full border border-gold/70 bg-gold/10 backdrop-blur-[2px] transition-all duration-300 ease-out"
        style={{
          width: mode === "label" ? 116 : mode === "text" ? 40 : 14,
          height: mode === "label" ? 116 : mode === "text" ? 40 : 14,
          backgroundColor:
            mode === "idle" ? "var(--gold)" : "color-mix(in oklab, var(--gold) 14%, transparent)",
        }}
      >
        {label ? (
          <span className="label-track px-3 text-center !text-[9px] !tracking-[0.24em] text-ivory">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
