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
  path: string;
  category: "project" | "general" | "before-after";
}

export const assetOptions: AssetOption[] = [
  // Project cover images
  {
    id: "project-one-last-day",
    name: "One Last Day (Project Cover)",
    path: oneLastDay,
    category: "project",
  },
  {
    id: "project-toothpaste",
    name: "Toothpaste (Project Cover)",
    path: toothpaste,
    category: "project",
  },
  {
    id: "project-kadalar",
    name: "Kadalar (Project Cover)",
    path: kadalar,
    category: "project",
  },
  {
    id: "project-radhal",
    name: "Radhal (Project Cover)",
    path: radhal,
    category: "project",
  },
  // Posters and additional images
  {
    id: "one-last-day-poster",
    name: "One Last Day Poster",
    path: oneLastDayPoster,
    category: "project",
  },
  // Before/After images
  {
    id: "one-last-day-before",
    name: "One Last Day Before CG",
    path: oneLastDayBefore,
    category: "before-after",
  },
  {
    id: "one-last-day-after",
    name: "One Last Day After CG",
    path: oneLastDayAfter,
    category: "before-after",
  },
  // General images
  {
    id: "hero-street",
    name: "Hero Street",
    path: heroStreet,
    category: "general",
  },
  {
    id: "about-editroom",
    name: "About Edit Room",
    path: aboutEditroom,
    category: "general",
  },
  {
    id: "digital-marketing-chennai",
    name: "Digital Marketing Chennai",
    path: digitalMarketingChennai,
    category: "general",
  },
  {
    id: "digital-marketing-worldwide",
    name: "Digital Marketing Worldwide",
    path: digitalMarketingWorldwide,
    category: "general",
  },
];

export function getAssetById(id: string): AssetOption | undefined {
  return assetOptions.find((asset) => asset.id === id);
}

export function getAssetsByCategory(category: AssetOption["category"]): AssetOption[] {
  return assetOptions.filter((asset) => asset.category === category);
}
