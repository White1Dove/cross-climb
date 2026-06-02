import type { Metadata } from "next";
import Link from "next/link";
import { GameTabs } from "@/components/game-tabs";
import { SiteBrand } from "@/components/site-brand";
import { StructuredData } from "@/components/structured-data";
import {
  formatPinpointClues,
  getPinpointHistory,
  groupPinpointEntriesByMonth,
} from "@/lib/pinpoint-history";
import { getGameTabs } from "@/lib/game-tabs";
import { getPinpointArchiveStructuredData } from "@/lib/structured-data";
import { formatFullDate } from "@/lib/puzzle-dates";
import { getPinpointAnswerPath } from "@/lib/routes";

const gameTabs = getGameTabs("pinpoint-archive");
const archiveEntries = getPinpointHistory();
const monthGroups = groupPinpointEntriesByMonth(archiveEntries);
const newestEntry = archiveEntries[0];
const oldestEntry = archiveEntries[archiveEntries.length - 1];
const archiveDescription = `Browse ${archiveEntries.length} past LinkedIn Pinpoint answers from ${oldestEntry.date} through ${newestEntry.date}, organized by month with category answers and clue lists.`;

export const metadata: Metadata = {
  title: {
    absolute: "LinkedIn Pinpoint Answer Archive | Puzzle Clues Today",
  },
  description: archiveDescription,
  alternates: {
    canonical: "https://puzzleclues.today/pinpoint/archive/",
  },
  openGraph: {
    title: "LinkedIn Pinpoint Answer Archive | Puzzle Clues Today",
    description: archiveDescription,
    url: "https://puzzleclues.today/pinpoint/archive/",
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
    title: "LinkedIn Pinpoint Answer Archive | Puzzle Clues Today",
    description: archiveDescription,
    images: ["https://puzzleclues.today/og-image.png"],
  },
};

export default function PinpointArchivePage() {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <StructuredData data={getPinpointArchiveStructuredData(archiveEntries)} />

      <header className="border-b border-[#E7E3DA] bg-white">
        <div className="mx-auto flex max-w-[900px] flex-col items-start gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-8">
          <SiteBrand />
          <GameTabs tabs={gameTabs} />
        </div>
      </header>

      <main className="mx-auto max-w-[960px] space-y-8 px-4 py-8 md:py-10">
        <section className="space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[15px] font-medium">
            <Link href="/pinpoint/" className="text-[#854F0B] hover:underline">
              ← Pinpoint Today
            </Link>
            <Link href="/answers/" className="text-[#854F0B] hover:underline">
              All LinkedIn Games Answers
            </Link>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            LinkedIn Pinpoint Answer Archive
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-[#625B55]">
            Browse {archiveEntries.length} past LinkedIn Pinpoint answers from {oldestEntry.date} through{" "}
            {newestEntry.date}. Entries are grouped by month with puzzle numbers, category answers, and clue
            lists.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a1a2e]">
            LinkedIn Pinpoint Answers
          </h2>

          <div className="space-y-4">
            {monthGroups.map((group) => (
              <details key={group.key} className="overflow-hidden rounded-lg border border-[#E7E3DA] bg-white shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
                  <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
                    {group.label}
                  </span>
                  <span className="shrink-0 rounded bg-[#F1EFE8] px-2 py-1 text-[13px] font-medium text-[#625B55]">
                    {group.entries.length} answers
                  </span>
                </summary>
                <div className="divide-y divide-[#E7E3DA]">
                  {group.entries.map((entry) => (
                    <article key={entry.number} className="grid gap-3 px-4 py-4 md:grid-cols-[150px_120px_minmax(0,1fr)]">
                      <p className="text-[15px] text-[#625B55]">{formatFullDate(entry.isoDate)}</p>
                      <Link href={getPinpointAnswerPath(entry.number)} className="font-medium text-[#854F0B] hover:underline">
                        #{entry.number}
                      </Link>
                      <div className="space-y-1">
                        <p className="font-semibold text-[#1a1a2e]">{entry.answer}</p>
                        <p className="text-[15px] leading-relaxed text-[#625B55]">{formatPinpointClues(entry)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-[#E7E3DA] bg-white">
        <div className="mx-auto max-w-[960px] px-4 py-8 text-center text-[13px] leading-relaxed text-[#625B55]">
          Puzzle Clues Today is an unofficial fan site. Not affiliated with or endorsed by LinkedIn Corporation.
          LinkedIn is a registered trademark of LinkedIn Corporation.
        </div>
      </footer>
    </div>
  );
}
