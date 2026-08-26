import { motion, type HTMLMotionProps } from "motion/react";
import { type ReactNode } from "react";

interface FocusRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Cinematic Focus-Pull Kinetic Typography Reveal.
 * Transitions from soft blur to razor-sharp focus with subtle vertical movement.
 * Respects prefers-reduced-motion automatically.
 */
export function FocusReveal({
  children,
  delay = 0,
  className = "",
  ...props
}: FocusRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        filter: "blur(8px)",
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
      }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
