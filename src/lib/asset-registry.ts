// Asset registry for admin image selection
// These are pre-imported so they work at runtime

import heroStreet from "@/assets/hero-street.webp";
import aboutEditroom from "@/assets/about-editroom.webp";
import oneLastDay from "@/assets/project-one-last-day.webp";
import toothpaste from "@/assets/project-toothpaste.webp";
import kadalar from "@/assets/project-kadalar.webp";
import radhal from "@/assets/project-radhal.webp";
import oneLastDayPoster from "@/assets/one-last-day-poster.webp";
import oneLastDayBefore from "@/assets/one-last-day-before-cg.webp";
import oneLastDayAfter from "@/assets/one-last-day-after-cg.webp";
import digitalMarketingChennai from "@/assets/digital marketing chennai.webp";
import digitalMarketingWorldwide from "@/assets/digital marketing worldwide.webp";

export interface AssetOption {
  id: string;
  name: string;
  filename: string;
  path: string;
  category: "project" | "general" | "before-after";
}

export const assetOptions: AssetOption[] = [
  // Project cover images
  {
    id: "project-one-last-day",
    name: "One Last Day (Project Cover)",
    filename: "project-one-last-day.webp",
    path: oneLastDay,
    category: "project",
  },
  {
    id: "project-toothpaste",
    name: "Toothpaste (Project Cover)",
    filename: "project-toothpaste.webp",
    path: toothpaste,
    category: "project",
  },
  {
    id: "project-kadalar",
    name: "Kadalar (Project Cover)",
    filename: "project-kadalar.webp",
    path: kadalar,
    category: "project",
  },
  {
    id: "project-radhal",
    name: "Radhal (Project Cover)",
    filename: "project-radhal.webp",
    path: radhal,
    category: "project",
  },
  // Posters and additional images
  {
    id: "one-last-day-poster",
    name: "One Last Day Poster",
    filename: "one-last-day-poster.webp",
    path: oneLastDayPoster,
    category: "project",
  },
  // Before/After images
  {
    id: "one-last-day-before",
    name: "One Last Day Before CG",
    filename: "one-last-day-before-cg.webp",
    path: oneLastDayBefore,
    category: "before-after",
  },
  {
    id: "one-last-day-after",
    name: "One Last Day After CG",
    filename: "one-last-day-after-cg.webp",
    path: oneLastDayAfter,
    category: "before-after",
  },
  // General images
  {
    id: "hero-street",
    name: "Hero Street",
    filename: "hero-street.webp",
    path: heroStreet,
    category: "general",
  },
  {
    id: "about-editroom",
    name: "About Edit Room",
    filename: "about-editroom.webp",
    path: aboutEditroom,
    category: "general",
  },
  {
    id: "digital-marketing-chennai",
    name: "Digital Marketing Chennai",
    filename: "digital marketing chennai.webp",
    path: digitalMarketingChennai,
    category: "general",
  },
  {
    id: "digital-marketing-worldwide",
    name: "Digital Marketing Worldwide",
    filename: "digital marketing worldwide.webp",
    path: digitalMarketingWorldwide,
    category: "general",
  },
];

export function getAssetById(id: string): AssetOption | undefined {
  return assetOptions.find((asset) => asset.id === id);
}

export function getAssetByPathOrFilename(str: string): AssetOption | undefined {
  if (!str) return undefined;
  const basename = str.split("/").pop() || str;
  return assetOptions.find((asset) => asset.path === str || asset.filename === basename || asset.id === str);
}

export function getAssetsByCategory(category: AssetOption["category"]): AssetOption[] {
  return assetOptions.filter((asset) => asset.category === category);
}
