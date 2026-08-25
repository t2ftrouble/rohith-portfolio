import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const beats = ["A FILM BY", "ROHITH V", "FILMMAKER"];

/** Tamil-cinema style title-card opening. Cinematic, elegant, 3-4 seconds total. */
export function OpeningTitles() {
  const [beat, setBeat] = useState(0);
  const [done, setDone] = useState(true);

  useEffect(() => {
    // Check if user has seen the opening in this session (not persistent across sessions)
    const sessionSeen = sessionStorage.getItem("rv-opening-session");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Only skip if seen in current session or prefers reduced motion
    if (sessionSeen || reduced) return;

    // Mark as seen for this session only
    sessionStorage.setItem("rv-opening-session", "1");
    setDone(false);
    document.body.style.overflow = "hidden";

    // Cinematic timing: 3.4 seconds total
    const timers = [
      window.setTimeout(() => setBeat(1), 1000), // "A FILM BY" → "ROHITH V" (1s)
      window.setTimeout(() => setBeat(2), 2200), // "ROHITH V" → "FILMMAKER" (1.2s)
      window.setTimeout(() => {
        setDone(true);
        document.body.style.overflow = "";
      }, 3400), // Total: 3.4s
    ];

    return () => {
      timers.forEach(window.clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0b0d0e]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />
          <div className="vignette" />
          <AnimatePresence mode="wait">
            <motion.div
              key={beat}
              initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(4px)", scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="px-6 text-center"
            >
              <motion.p
                initial={{ letterSpacing: "0.9em" }}
                animate={{ letterSpacing: "0.42em" }}
                exit={{ letterSpacing: "0.9em" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={
                  beat === 1
                    ? "title-card text-4xl text-ivory md:text-7xl"
                    : "label-track !text-xs text-gold"
                }
              >
                {beats[beat]}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
