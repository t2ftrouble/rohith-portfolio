import { Link } from "@tanstack/react-router";
import { SocialLinks } from "@/components/SocialLinks";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-charcoal">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-12">
        <div>
          <p className="label-track text-gold">End of reel</p>
          <p className="title-card mt-4 text-3xl text-ivory md:text-5xl">Rohith V</p>
          <p className="label-track mt-3">Chennai, Tamil Nadu, India</p>
        </div>
        <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
          <a
            href="mailto:t2frohithyt@gmail.com"
            data-cursor="copy email"
            data-magnetic="true"
            className="transition-colors hover:text-gold py-0.5 min-h-[32px] flex items-center"
          >
            t2frohithyt@gmail.com
          </a>
          <a
            href="tel:+917200173240"
            data-cursor="call"
            data-magnetic="true"
            className="transition-colors hover:text-gold py-0.5 min-h-[32px] flex items-center"
          >
            +91 72001 73240
          </a>
          
          {/* Dynamic 3 Social Media Channels */}
          <div className="pt-2">
            <SocialLinks variant="footer" />
          </div>

          <Link
            to="/contact"
            data-cursor="contact →"
            data-magnetic="true"
            className="label-track mt-2 !text-gold py-1 min-h-[36px] inline-flex items-center"
          >
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
