import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export function CinematicClosing() {
  return (
    <section className="relative border-t border-border bg-charcoal overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="label-track text-gold mb-8">End of Frame</p>
          <h2 className="title-card text-[clamp(2rem,10vw,6rem)] leading-[0.9] text-ivory">
            The frame ends.
            <br />
            The story doesn't.
          </h2>
          <div className="mt-12">
            <Link
              to="/contact"
              data-cursor="work with rohith →"
              data-magnetic="true"
              className="label-track inline-block border border-gold px-8 py-5 !text-[10px] !text-gold transition-all hover:bg-gold hover:!text-charcoal min-h-[44px]"
            >
              WORK WITH ROHITH →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
