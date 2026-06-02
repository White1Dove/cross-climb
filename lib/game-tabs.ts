import { getCrossclimbHistory } from "@/lib/crossclimb-history";
import { getPinpointHistory } from "@/lib/pinpoint-history";
import { getCrossclimbAnswerPath, getPinpointAnswerPath } from "@/lib/routes";
import type { GameTab } from "@/types/puzzle";

export const gameTabDefinitions: GameTab[] = [
  { name: "Crossclimb", slug: "crossclimb", href: "/", status: "live", visibleInNav: true },
  { name: "Pinpoint", slug: "pinpoint", href: "/pinpoint/", status: "live", visibleInNav: true },
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

export const answersTab: GameTab = {
  name: "Answers",
  slug: "answers",
  href: "/answers/",
  status: "live",
  visibleInNav: true,
};

export function getGameTabs(activeSlug: string) {
  const latestCrossclimb = getCrossclimbHistory()[0];
  const latestPinpoint = getPinpointHistory()[0];
  const answersDropdown: GameTab = {
    ...answersTab,
    active: activeSlug === "answers" || activeSlug.endsWith("archive"),
    children: [
      {
        name: "All LinkedIn Answers",
        slug: "answers",
        href: "/answers/",
        status: "live",
        active: activeSlug === "answers",
      },
      {
        name: "Crossclimb Answers",
        slug: "crossclimb-answers",
        href: latestCrossclimb ? getCrossclimbAnswerPath(latestCrossclimb.number) : "/crossclimb/archive/",
        status: "live",
        active: activeSlug === "crossclimb-archive",
      },
      {
        name: "Pinpoint Answers",
        slug: "pinpoint-answers",
        href: latestPinpoint ? getPinpointAnswerPath(latestPinpoint.number) : "/pinpoint/archive/",
        status: "live",
        active: activeSlug === "pinpoint-archive",
      },
    ],
  };

  return [...gameTabDefinitions.filter((tab) => tab.visibleInNav), answersDropdown].map((tab) => ({
    ...tab,
    active: tab.active || tab.slug === activeSlug,
  }));
}

export const comingSoonGameSlugs = gameTabDefinitions
  .filter((tab) => tab.status === "coming-soon")
  .map((tab) => tab.slug);

export function getGameBySlug(slug: string) {
  return gameTabDefinitions.find((tab) => tab.slug === slug);
}
