import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function FilmmakingStatement({
  title = "A Film Is More Than a Frame.",
  text = "I don't just create visuals.\nI create moments people remember.",
}: {
  title?: string;
  text?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <section ref={ref} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ opacity, y, scale }}
        className="relative mx-auto max-w-[1600px] px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="label-track text-gold mb-6"
        >
          The Philosophy
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="title-card text-[clamp(2rem,8vw,5rem)] leading-[1.1] text-ivory"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 text-lg text-ivory/70 max-w-2xl mx-auto leading-relaxed whitespace-pre-line"
        >
          {text}
        </motion.p>
      </motion.div>
    </section>
  );
}
