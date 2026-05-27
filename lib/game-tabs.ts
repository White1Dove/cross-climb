import type { GameTab } from "@/types/puzzle";

export const gameTabDefinitions: GameTab[] = [
  { name: "Crossclimb", slug: "crossclimb", href: "/", status: "live", visibleInNav: true },
  { name: "Pinpoint", slug: "pinpoint", href: "/pinpoint/", status: "coming-soon", visibleInNav: false },
  { name: "Queens", slug: "queens", href: "/queens/", status: "coming-soon", visibleInNav: false },
  { name: "Tango", slug: "tango", href: "/tango/", status: "coming-soon", visibleInNav: false },
  { name: "Zip", slug: "zip", href: "/zip/", status: "coming-soon", visibleInNav: false },
  { name: "Patches", slug: "patches", href: "/patches/", status: "coming-soon", visibleInNav: false },
  { name: "Mini Sudoku", slug: "mini-sudoku", href: "/mini-sudoku/", status: "coming-soon", visibleInNav: false },
];

export const archiveTab: GameTab = {
  name: "Archive",
  slug: "crossclimb-archive",
  href: "/crossclimb/archive/",
  status: "live",
  visibleInNav: true,
};

export function getGameTabs(activeSlug: string) {
  return [...gameTabDefinitions.filter((tab) => tab.visibleInNav), archiveTab].map((tab) => ({
    ...tab,
    active: tab.slug === activeSlug,
  }));
}

export const comingSoonGameSlugs = gameTabDefinitions
  .filter((tab) => tab.status === "coming-soon")
  .map((tab) => tab.slug);

export function getGameBySlug(slug: string) {
  return gameTabDefinitions.find((tab) => tab.slug === slug);
}
