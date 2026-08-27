import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useCallback } from "react";

/**
 * Premium film-opening title sequence.
 * - Black Screen -> Title Card ("ROHITH V" / "FILMMAKER • WRITER • EDITOR • VFX")
 * - Subtle anamorphic gold light line expansion
 * - "EVERY FRAME HAS A STORY."
 * - Smooth fade & blur transition into the main hero
 * - Total duration: ~2.2 seconds maximum
 * - Click or keypress to skip immediately
 * - Respects prefers-reduced-motion and session storage
 */
export function OpeningTitles() {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [done, setDone] = useState(true);

  const finish = useCallback(() => {
    setDone(true);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    // Check if seen in current session or prefers reduced motion
    const sessionSeen = sessionStorage.getItem("rv-opening-session");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sessionSeen || reduced) {
      setDone(true);
      return;
    }

    // Mark as seen for this session
    sessionStorage.setItem("rv-opening-session", "1");
    setDone(false);
    document.body.style.overflow = "hidden";

    // Sequence timing (total ~2.2s)
    const t1 = window.setTimeout(() => setStage(1), 1050); // Transition to "EVERY FRAME HAS A STORY."
    const t2 = window.setTimeout(() => setStage(2), 2150); // Start fade-out to hero
    const t3 = window.setTimeout(() => finish(), 2600); // Complete and unmount

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        finish();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [finish]);

  if (done) return null;

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          key="film-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={finish}
          role="dialog"
          aria-label="Opening titles"
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#090b0d] select-none"
        >
          {/* Subtle film grain & scanlines */}
          <div className="scanlines pointer-events-none absolute inset-0 opacity-25" />
          <div className="vignette pointer-events-none" />

          {/* Ambient subtle anamorphic streak */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1.2, 0.9], opacity: [0, 0.4, 0.15] }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="pointer-events-none absolute h-[1px] w-full max-w-2xl bg-gradient-to-r from-transparent via-gold/70 to-transparent"
          />

          <div className="relative z-10 px-6 text-center">
            <AnimatePresence mode="wait">
              {stage === 0 ? (
                <motion.div
                  key="title-card"
                  initial={{ opacity: 0, filter: "blur(10px)", scale: 0.97 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(6px)", scale: 1.03 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <motion.h1
                    initial={{ letterSpacing: "0.22em" }}
                    animate={{ letterSpacing: "0.14em" }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="title-card text-4xl text-ivory drop-shadow-md sm:text-6xl md:text-7xl"
                  >
                    ROHITH V
                  </motion.h1>

                  {/* Restrained cinematic gold line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80px" }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    className="mx-auto h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent"
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="label-track !text-[9px] sm:!text-[10px] !tracking-[0.38em] text-gold/90"
                  >
                    FILMMAKER • WRITER • EDITOR • VFX
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="story-tagline"
                  initial={{ opacity: 0, filter: "blur(8px)", y: 6 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(6px)", scale: 1.02 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-3"
                >
                  <p className="label-track !text-[9px] !tracking-[0.5em] text-gold/70">
                    A FILM IS MORE THAN A FRAME
                  </p>
                  <h2 className="title-card text-2xl text-ivory drop-shadow-md sm:text-4xl md:text-5xl !tracking-[0.08em]">
                    EVERY FRAME HAS A STORY.
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Minimal Skip Indicator */}
          <div className="absolute bottom-6 right-6 text-[9px] font-mono text-muted-foreground/60">
            [CLICK / ESC TO ENTER]
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

