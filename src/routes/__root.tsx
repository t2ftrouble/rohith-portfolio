import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "motion/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CinematicCursor } from "@/components/CinematicCursor";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label-track text-gold">Reel missing</p>
        <h1 className="title-card mt-6 text-6xl text-ivory">404</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This frame was left on the cutting room floor.
        </p>
        <div className="mt-8">
          <Link to="/" className="label-track !text-gold">
            Back to the opening →
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
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-charcoal">
        <motion.div
          className="fixed top-0 left-0 right-0 z-[55] h-[2px] bg-gold/60 origin-left"
          style={{ scaleX }}
        />
        <SiteNav />
        <main>
          <Outlet />
        </main>
        <SiteFooter />
        <CinematicCursor />
        <div className="film-grain" aria-hidden />
      </div>
    </QueryClientProvider>
  );
}
