import type { Metadata } from "next";
import Link from "next/link";
import { GameTabs } from "@/components/game-tabs";
import { StructuredData } from "@/components/structured-data";
import { SiteBrand } from "@/components/site-brand";
import {
  getCrossclimbHistory,
  groupCrossclimbEntriesByMonth,
} from "@/lib/crossclimb-history";
import { getGameTabs } from "@/lib/game-tabs";
import { getArchiveStructuredData } from "@/lib/structured-data";
import { ArchiveAccordion } from "./archive-accordion";

const gameTabs = getGameTabs("crossclimb-archive");

const archiveEntries = getCrossclimbHistory();
const monthGroups = groupCrossclimbEntriesByMonth(archiveEntries);
const newestEntry = archiveEntries[0];
const oldestEntry = archiveEntries[archiveEntries.length - 1];
const archiveDescription = `Browse ${archiveEntries.length} past Crossclimb answers from ${oldestEntry.date} through ${newestEntry.date}, organized by month with puzzle numbers and complete word ladders.`;

export const metadata: Metadata = {
  title: {
    absolute: "Crossclimb Answer Archive | Puzzle Clues Today",
  },
  description: archiveDescription,
  alternates: {
    canonical: "https://puzzleclues.today/crossclimb/archive/",
  },
  openGraph: {
    title: "Crossclimb Answer Archive | Puzzle Clues Today",
    description: archiveDescription,
    url: "https://puzzleclues.today/crossclimb/archive/",
    siteName: "Puzzle Clues Today",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://puzzleclues.today/og-image.png",
        width: 1200,
        height: 630,
        alt: "Puzzle Clues Today",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crossclimb Answer Archive | Puzzle Clues Today",
    description: archiveDescription,
    images: ["https://puzzleclues.today/og-image.png"],
  },
};

export default function CrossclimbArchivePage() {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <StructuredData data={getArchiveStructuredData(archiveEntries)} />

      <header className="bg-white border-b border-[#E7E3DA]">
        <div className="mx-auto flex max-w-[900px] flex-col items-start gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-8">
          <SiteBrand />
          <GameTabs tabs={gameTabs} />
        </div>
      </header>

      <main className="mx-auto max-w-[960px] space-y-8 px-4 py-8 md:py-10">
        <section className="space-y-3">
          <Link href="/" className="text-[15px] font-medium text-[#854F0B] hover:underline">
            ← Crossclimb Today
          </Link>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            Crossclimb Answer Archive
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-[#625B55]">
            Browse {archiveEntries.length} past Crossclimb answers from {oldestEntry.date} through{" "}
            {newestEntry.date}. Entries are grouped by month with puzzle numbers, start and end words, and the
            complete ladder for each puzzle.
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
        <div className="mx-auto max-w-[960px] px-4 py-8 text-center text-[15px] text-[#625B55]">
          <p className="text-[13px] leading-relaxed">
            Puzzle Clues Today is an unofficial fan site. Not affiliated with or endorsed by LinkedIn Corporation.
            LinkedIn is a registered trademark of LinkedIn Corporation.
          </p>
        </div>
      </footer>
    </div>
  );
}
