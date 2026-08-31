import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SocialLinks } from "@/components/SocialLinks";
import { SoundToggle } from "@/components/SoundToggle";
import { sound } from "@/lib/sound";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/editing", label: "Editing" },
  { to: "/digital-marketing", label: "Digital Marketing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body & documentElement scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-all duration-300 ${
        scrolled
          ? "border-b border-border/90 bg-charcoal/90 backdrop-blur-md py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12">
        <Link
          to="/"
          onClick={() => sound.playNavClick()}
          data-cursor="text"
          className="group flex items-baseline gap-3 relative z-[75]"
        >
          <span className="title-card text-lg text-ivory">ROHITH V</span>
          <span className="label-track hidden !text-[9px] text-gold sm:inline">Filmmaker</span>
        </Link>

        {/* Desktop Links & Sound Toggle */}
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => sound.playNavClick()}
                data-cursor="text"
                data-magnetic="true"
                className="label-track transition-colors hover:text-gold"
                activeProps={{ className: "!text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <SoundToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <SoundToggle />
          <button
            type="button"
            onClick={() => {
              sound.playSoftClick();
              setOpen((v) => !v);
            }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-[75] text-ivory focus:outline-none focus:ring-1 focus:ring-gold min-h-[48px] min-w-[48px] flex items-center justify-center -mr-2 touch-manipulation cursor-pointer select-none"
          >
            {open ? <X size={24} className="text-gold" /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 min-h-screen bg-charcoal/98 backdrop-blur-2xl z-[72] flex flex-col justify-between px-6 pt-24 pb-12 md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 pt-4" aria-label="Mobile navigation">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => {
                      sound.playNavClick();
                      setOpen(false);
                    }}
                    className="title-card text-3xl text-ivory hover:text-gold active:text-gold transition-colors block py-1.5 touch-manipulation"
                    activeProps={{ className: "!text-gold" }}
                    activeOptions={{ exact: l.to === "/" }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Quick Touch Contact & Social Channels */}
            <div className="border-t border-border/60 pt-6 space-y-4">
              <p className="label-track text-gold !text-[9px]">DIRECT CONTACT</p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+917200173240"
                  className="flex items-center justify-center gap-2 p-3 border border-border/80 bg-navy/40 text-ivory text-center rounded min-h-[48px] touch-manipulation active:bg-gold/10"
                >
                  <Phone size={16} className="text-gold" />
                  <span className="text-xs font-mono">Call</span>
                </a>
                <a
                  href="mailto:t2frohithyt@gmail.com"
                  className="flex items-center justify-center gap-2 p-3 border border-border/80 bg-navy/40 text-ivory text-center rounded min-h-[48px] touch-manipulation active:bg-gold/10"
                >
                  <Mail size={16} className="text-gold" />
                  <span className="text-xs font-mono">Email</span>
                </a>
              </div>

              <div className="pt-2">
                <p className="label-track text-gold !text-[9px] mb-3">CHANNELS & SOCIAL</p>
                <SocialLinks variant="nav" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
