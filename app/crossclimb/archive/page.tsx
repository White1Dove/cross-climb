import type { Metadata } from "next";
import Link from "next/link";
import { GameTabs } from "@/components/game-tabs";
import {
  formatCrossclimbLadder,
  formatFullCrossclimbDate,
  getAvailableArchiveYears,
  getCrossclimbEntriesForYear,
  groupCrossclimbEntriesByMonth,
} from "@/lib/crossclimb-history";
import type { CrossclimbHistoryEntry } from "@/lib/crossclimb-history";
import type { GameTab } from "@/types/puzzle";

const gameTabs: GameTab[] = [
  { name: "Crossclimb", slug: "crossclimb", active: true },
  { name: "Queens", slug: "queens" },
  { name: "Pinpoint", slug: "pinpoint" },
  { name: "Tango", slug: "tango" },
  { name: "Zip", slug: "zip" },
  { name: "Patches", slug: "patches" },
  { name: "Mini Sudoku", slug: "mini-sudoku" },
];

const archiveYear = getAvailableArchiveYears()[0] || 2026;
const archiveEntries = getCrossclimbEntriesForYear(archiveYear);
const monthGroups = groupCrossclimbEntriesByMonth(archiveEntries);

export const metadata: Metadata = {
  title: {
    absolute: `Crossclimb Answer Archive ${archiveYear} | Puzzle Clues Today`,
  },
  description: `Crossclimb answer archive for ${archiveYear}, organized by month with puzzle numbers, start words, end words, and complete word ladders.`,
  alternates: {
    canonical: "https://puzzleclues.today/crossclimb/archive",
  },
};

function ArchiveTable({ entries }: { entries: CrossclimbHistoryEntry[] }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E7E3DA] bg-[#F8F6F0]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#78716C]">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#78716C]">Puzzle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#78716C]">Start</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#78716C]">End</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#78716C]">Ladder</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.number} className="border-b border-[#E7E3DA] last:border-b-0">
                <td className="px-4 py-4 text-sm text-[#1a1a2e]">{formatFullCrossclimbDate(entry.isoDate)}</td>
                <td className="px-4 py-4 text-sm">
                  <Link href={`/crossclimb/${entry.number}`} className="font-medium text-[#854F0B] hover:underline">
                    #{entry.number}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex min-w-[64px] justify-center rounded bg-[#0F6E56]/10 px-2 py-1 font-[family-name:var(--font-lora)] text-sm font-bold text-[#0F6E56]">
                    {entry.start}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex min-w-[64px] justify-center rounded bg-[#4A1B0C]/10 px-2 py-1 font-[family-name:var(--font-lora)] text-sm font-bold text-[#4A1B0C]">
                    {entry.end}
                  </span>
                </td>
                <td className="px-4 py-4 font-[family-name:var(--font-lora)] text-sm leading-relaxed text-[#1a1a2e]">
                  {formatCrossclimbLadder(entry)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {entries.map((entry) => (
          <div key={entry.number} className="border-b border-[#E7E3DA] px-4 py-4 last:border-b-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-sm text-[#78716C]">{formatFullCrossclimbDate(entry.isoDate)}</p>
                <Link href={`/crossclimb/${entry.number}`} className="font-medium text-[#854F0B] hover:underline">
                  #{entry.number}
                </Link>
              </div>
              <div className="flex items-center gap-2 font-[family-name:var(--font-lora)] text-sm font-bold">
                <span className="rounded bg-[#0F6E56]/10 px-2 py-1 text-[#0F6E56]">{entry.start}</span>
                <span className="text-[#78716C]">→</span>
                <span className="rounded bg-[#4A1B0C]/10 px-2 py-1 text-[#4A1B0C]">{entry.end}</span>
              </div>
            </div>
            <p className="mt-3 font-[family-name:var(--font-lora)] text-sm leading-relaxed text-[#1a1a2e]">
              {formatCrossclimbLadder(entry)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

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
            Past Crossclimb answers for {archiveYear}, grouped by month with puzzle numbers, start and end
            words, and the complete ladder for each puzzle.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a1a2e]">
            {archiveYear} Crossclimb Answers
          </h2>

          <div className="space-y-4">
            {monthGroups.map((group, index) => (
              <details
                key={group.key}
                open={index === 0}
                className="overflow-hidden rounded-lg border border-[#E7E3DA] bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
                  <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
                    {group.label}
                  </span>
                  <span className="rounded bg-[#F1EFE8] px-2 py-1 text-xs font-medium text-[#78716C]">
                    {group.entries.length} answers
                  </span>
                </summary>
                <ArchiveTable entries={group.entries} />
              </details>
            ))}
          </div>
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
