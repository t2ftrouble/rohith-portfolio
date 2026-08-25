import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-charcoal">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-12">
        <div>
          <p className="label-track text-gold">End of reel</p>
          <p className="title-card mt-4 text-3xl text-ivory md:text-5xl">Rohith V</p>
          <p className="label-track mt-3">Chennai, Tamil Nadu, India</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <a
            href="mailto:t2frohithyt@gmail.com"
            data-cursor="text"
            className="transition-colors hover:text-gold"
          >
            t2frohithyt@gmail.com
          </a>
          <a
            href="tel:+917200173240"
            data-cursor="text"
            className="transition-colors hover:text-gold"
          >
            +91 72001 73240
          </a>
          <a
            href="https://instagram.com/trouble_rohii"
            target="_blank"
            rel="noreferrer"
            data-cursor="text"
            className="transition-colors hover:text-gold"
          >
            @TROUBLE_ROHII
          </a>
          <Link to="/contact" data-cursor="enter →" className="label-track mt-2 !text-gold">
            Start a conversation →
          </Link>
        </div>
      </div>
      <div className="border-t border-border px-6 py-6 md:px-12">
        <p className="label-track !text-[9px]">
          © {new Date().getFullYear()} Rohith V — Assistant Director | Filmmaker
        </p>
      </div>
    </footer>
  );
}
