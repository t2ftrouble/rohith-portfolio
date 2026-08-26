// Asset URL and Filename Resolver
// Handles Supabase storage URLs, Vite imported assets, and relative asset filenames

import oneLastDay from "@/assets/project-one-last-day.webp";
import toothpaste from "@/assets/project-toothpaste.webp";
import kadalar from "@/assets/project-kadalar.webp";
import radhal from "@/assets/project-radhal.webp";
import oneLastDayPoster from "@/assets/one-last-day-poster.webp";
import oneLastDayBefore from "@/assets/one-last-day-before-cg.webp";
import oneLastDayAfter from "@/assets/one-last-day-after-cg.webp";
import heroStreet from "@/assets/hero-street.webp";
import aboutEditroom from "@/assets/about-editroom.webp";
import digitalMarketingChennai from "@/assets/digital marketing chennai.webp";
import digitalMarketingWorldwide from "@/assets/digital marketing worldwide.webp";

import defaultDmHero from "@/assets/digital marketing hero.jpg";
import defaultCreative1 from "@/assets/1-creative.jpg";
import defaultCreative2 from "@/assets/2-cerative.jpg";
import defaultCreative3 from "@/assets/3 creative.jpg";

export const LOCAL_ASSET_MAP: Record<string, string> = {
  "project-one-last-day.webp": oneLastDay,
  "project-toothpaste.webp": toothpaste,
  "project-kadalar.webp": kadalar,
  "project-radhal.webp": radhal,
  "one-last-day-poster.webp": oneLastDayPoster,
  "one-last-day-before-cg.webp": oneLastDayBefore,
  "one-last-day-after-cg.webp": oneLastDayAfter,
  "hero-street.webp": heroStreet,
  "about-editroom.webp": aboutEditroom,
  "digital marketing chennai.webp": digitalMarketingChennai,
  "digital marketing worldwide.webp": digitalMarketingWorldwide,
  "digital marketing hero.jpg": defaultDmHero,
  "digital-marketing-hero.jpg": defaultDmHero,
  "1-creative.jpg": defaultCreative1,
  "1 creative.jpg": defaultCreative1,
  "2-cerative.jpg": defaultCreative2,
  "2-creative.jpg": defaultCreative2,
  "2 creative.jpg": defaultCreative2,
  "3 creative.jpg": defaultCreative3,
  "3-creative.jpg": defaultCreative3,
};

/**
 * Resolves any image source (Supabase URL, local asset import, or filename)
 * into a browser-loadable image URL.
 */
export function resolveImageUrl(src: string | undefined | null): string {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return "";
  }

  const trimmed = src.trim();

  // Full URLs, Data URLs, Blob URLs
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Check direct match in local asset map
  const directMatch = LOCAL_ASSET_MAP[trimmed];
  if (directMatch) {
    return directMatch;
  }

  // Extract basename if full path was given (e.g. /src/assets/project-one-last-day.webp)
  let basename = trimmed.split("/").pop() || trimmed;
  try {
    basename = decodeURIComponent(basename);
  } catch {}

  const basenameMatch = LOCAL_ASSET_MAP[basename];
  if (basenameMatch) {
    return basenameMatch;
  }

  // Fallback to static public folder path if it starts with / or is relative
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/assets/${basename}`;
}

/**
 * Extracts a clean, human-readable filename or source label
 * for displaying in the Admin CMS previews.
 */
export function getImageLabel(src: string | undefined | null): string {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return "No image selected";
  }

  const trimmed = src.trim();

  if (trimmed.includes("supabase.co")) {
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split("/");
      const filename = parts.pop() || "image";
      const folder = parts.pop() || "storage";
      return `Supabase Storage [${folder}/${filename}]`;
    } catch {
      return "Supabase Storage URL";
    }
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const basename = trimmed.split("/").pop() || trimmed;
  return basename;
}
