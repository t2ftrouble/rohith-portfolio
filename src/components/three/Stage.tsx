import { lazy, Suspense, useEffect, useState } from "react";

const Scenes = lazy(() => import("./Scenes"));

export type SceneName = "lens" | "filmstrip" | "reel" | "aperture";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Client-only, lazy-mounted WebGL stage.
 * Renders nothing (graceful fallback) when WebGL or motion is unavailable.
 */
export function Stage({ scene, className }: { scene: SceneName; className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !supportsWebGL()) return;
    const id = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <div className={className} aria-hidden>
      <Suspense fallback={null}>
        <Scenes scene={scene} />
      </Suspense>
    </div>
  );
}
