import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/digital-marketing", label: "Digital Marketing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b border-border bg-charcoal/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
        <Link to="/" data-cursor="text" className="group flex items-baseline gap-3">
          <span className="title-card text-lg text-ivory">ROHITH V</span>
          <span className="label-track hidden !text-[9px] text-gold sm:inline">Filmmaker</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-cursor="text"
              className="label-track transition-colors hover:text-gold"
              activeProps={{ className: "!text-gold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-ivory md:hidden focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-charcoal/95 px-6 pb-8 pt-4 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="title-card text-2xl text-ivory focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
