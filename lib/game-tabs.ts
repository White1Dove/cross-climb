import type { GameTab } from "@/types/puzzle";

export const gameTabDefinitions: GameTab[] = [
  { name: "Crossclimb", slug: "crossclimb", href: "/" },
  { name: "Pinpoint", slug: "pinpoint", href: "/pinpoint/" },
  { name: "Queens", slug: "queens", href: "/queens/" },
  { name: "Tango", slug: "tango", href: "/tango/" },
  { name: "Zip", slug: "zip", href: "/zip/" },
  { name: "Patches", slug: "patches", href: "/patches/" },
  { name: "Mini Sudoku", slug: "mini-sudoku", href: "/mini-sudoku/" },
];

export function getGameTabs(activeSlug: string) {
  return gameTabDefinitions.map((tab) => ({
    ...tab,
    active: tab.slug === activeSlug,
  }));
}

export const comingSoonGameSlugs = gameTabDefinitions
  .filter((tab) => tab.slug !== "crossclimb")
  .map((tab) => tab.slug);

export function getGameBySlug(slug: string) {
  return gameTabDefinitions.find((tab) => tab.slug === slug);
}
