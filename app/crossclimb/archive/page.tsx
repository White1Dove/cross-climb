import type { Metadata } from "next";
import Link from "next/link";
import { GameTabs } from "@/components/game-tabs";
import {
  getCrossclimbHistory,
  groupCrossclimbEntriesByMonth,
} from "@/lib/crossclimb-history";
import { getGameTabs } from "@/lib/game-tabs";
import { ArchiveAccordion } from "./archive-accordion";

const gameTabs = getGameTabs("crossclimb");

const archiveEntries = getCrossclimbHistory();
const monthGroups = groupCrossclimbEntriesByMonth(archiveEntries);

export const metadata: Metadata = {
  title: {
    absolute: "Crossclimb Answer Archive | Puzzle Clues Today",
  },
  description:
    "Crossclimb answer archive organized by month with puzzle numbers, start words, end words, and complete word ladders.",
  alternates: {
    canonical: "https://puzzleclues.today/crossclimb/archive",
  },
};

export default function CrossclimbArchivePage() {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <header className="bg-white border-b border-[#E7E3DA]">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-4 py-3">
          <Link href="/" className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1a1a2e]">
            Puzzle Clues Today
          </Link>
          <GameTabs tabs={gameTabs} />
        </div>
      </header>

      <main className="mx-auto max-w-[960px] space-y-8 px-4 py-8 md:py-10">
        <section className="space-y-3">
          <Link href="/" className="text-sm font-medium text-[#854F0B] hover:underline">
            ← Crossclimb Today
          </Link>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            Crossclimb Answer Archive
          </h1>
          <p className="max-w-prose text-sm leading-relaxed text-[#78716C]">
            Past Crossclimb answers grouped by month with puzzle numbers, start and end words, and the complete
            ladder for each puzzle.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a1a2e]">
            Crossclimb Answers
          </h2>

          <ArchiveAccordion monthGroups={monthGroups} />
        </section>
      </main>

      <footer className="mt-12 border-t border-[#E7E3DA] bg-white">
        <div className="mx-auto max-w-[960px] px-4 py-8 text-center text-sm text-[#78716C]">
          <p className="text-xs leading-relaxed">
            Puzzle Clues Today is an unofficial fan site. Not affiliated with or endorsed by LinkedIn Corporation.
            LinkedIn is a registered trademark of LinkedIn Corporation.
          </p>
        </div>
      </footer>
    </div>
  );
}
