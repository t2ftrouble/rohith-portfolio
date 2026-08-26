import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CinematicCursor } from "@/components/CinematicCursor";
import { CinematicClosing } from "@/components/CinematicClosing";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-6 relative overflow-hidden">
      <div className="vignette pointer-events-none" />
      <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />
      
      <div className="max-w-lg text-center relative z-10 border border-border/80 bg-navy/30 p-10 md:p-14 shadow-2xl backdrop-blur-md">
        <p className="label-track text-gold">404 — SCENE NOT FOUND</p>
        <h1 className="title-card mt-6 text-3xl sm:text-5xl text-ivory leading-tight">
          THIS FRAME DOESN'T EXIST.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          This cut was left on the cutting room floor or moved to another reel.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            data-cursor="home →"
            data-magnetic="true"
            className="label-track inline-block bg-gold px-8 py-4 !text-[10px] !text-charcoal font-bold hover:bg-gold/90 transition-all shadow-lg"
          >
            → BACK TO THE FILM
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="title-card text-2xl text-ivory">This cut didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong. Try again or head back to the start.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="label-track border border-gold px-5 py-3 !text-gold"
          >
            Try again
          </button>
          <a href="/" className="label-track border border-border px-5 py-3">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rohith V | Filmmaker | Writer | Editor | VFX/CG Artist" },
      {
        name: "description",
        content:
          "Rohith V is a Visual Communication student and Filmmaker, Writer, Editor and VFX/CG Artist based in Chennai.",
      },
      { name: "author", content: "Rohith V" },
      { property: "og:title", content: "Rohith V | Filmmaker | Writer | Editor | VFX/CG Artist" },
      {
        property: "og:description",
        content:
          "Cinematic portfolio of Rohith V — Filmmaker, Writer, Editor and VFX/CG Artist based in Chennai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;700;800&family=Inter:wght@300;400;500&family=Montserrat:wght@600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { scrollYProgress } = useScroll();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-charcoal">
        <motion.div
          className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gold/60 origin-left pointer-events-none"
          style={{ scaleX }}
        />
        <SiteNav />
        <main>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, filter: "brightness(0.85)" }}
              animate={{ opacity: 1, filter: "brightness(1)" }}
              exit={{ opacity: 0, filter: "brightness(0.85)" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <CinematicClosing />
        <SiteFooter />
        <CinematicCursor />
        <div className="film-grain" aria-hidden />
      </div>
    </QueryClientProvider>
  );
}
