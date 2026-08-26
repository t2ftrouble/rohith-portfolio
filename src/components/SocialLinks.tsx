import { useEffect, useState } from "react";
import { Youtube, Instagram, Linkedin } from "lucide-react";
import { getSocialLinks, defaultSocialLinks, type SocialLinksData } from "@/lib/social-links";

interface SocialLinksProps {
  links?: SocialLinksData | undefined;
  variant?: "footer" | "nav" | "card" | "inline" | undefined;
  className?: string | undefined;
}

export function SocialLinks({ links: propLinks, variant = "inline", className = "" }: SocialLinksProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>(propLinks || defaultSocialLinks);

  useEffect(() => {
    if (!propLinks) {
      getSocialLinks()
        .then((data) => {
          if (data) setSocialLinks(data);
        })
        .catch(() => {});
    } else {
      setSocialLinks(propLinks);
    }
  }, [propLinks]);

  const items = [
    {
      id: "youtube",
      name: "YouTube",
      url: socialLinks.youtube,
      icon: Youtube,
      cursor: "youtube →",
      ariaLabel: "Rohith V on YouTube",
    },
    {
      id: "instagram",
      name: "Instagram",
      url: socialLinks.instagram,
      icon: Instagram,
      cursor: "instagram →",
      ariaLabel: "Rohith V on Instagram",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      url: socialLinks.linkedin,
      icon: Linkedin,
      cursor: "linkedin →",
      ariaLabel: "Rohith V on LinkedIn",
    },
  ].filter((item) => item.url && item.url.trim() !== "");

  if (items.length === 0) {
    return null;
  }

  if (variant === "footer") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.ariaLabel}
              data-cursor={item.cursor}
              data-magnetic="true"
              className="group relative flex h-10 w-10 items-center justify-center border border-border/80 bg-navy/40 text-ivory/80 transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold hover:scale-105"
            >
              <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === "nav") {
    return (
      <div className={`grid grid-cols-3 gap-3 ${className}`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.ariaLabel}
              data-cursor={item.cursor}
              className="flex flex-col items-center justify-center p-3 border border-border/80 bg-navy/40 text-ivory text-center rounded transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold min-h-[48px]"
            >
              <Icon size={18} className="text-gold mb-1" />
              <span className="text-[10px] font-mono tracking-wider">{item.name}</span>
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.ariaLabel}
              data-cursor={item.cursor}
              className="group flex items-center gap-4 border border-border/80 bg-navy/30 p-4 transition-all duration-300 hover:border-gold/60 hover:bg-gold/5"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border/60 bg-charcoal text-gold transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                <Icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="label-track text-[9px] text-muted-foreground group-hover:text-gold transition-colors">
                  CHANNEL / PROFILE
                </p>
                <p className="font-mono text-sm text-ivory truncate group-hover:text-gold transition-colors">
                  {item.name}
                </p>
              </div>
              <span className="text-gold text-sm transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          );
        })}
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.ariaLabel}
            data-cursor={item.cursor}
            data-magnetic="true"
            className="flex h-9 w-9 items-center justify-center border border-border/80 bg-navy/30 text-ivory/80 transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold"
          >
            <Icon size={17} />
          </a>
        );
      })}
    </div>
  );
}
