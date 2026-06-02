import type { Metadata } from "next";
import Link from "next/link";
import { GameTabs } from "@/components/game-tabs";
import { SiteBrand } from "@/components/site-brand";
import { StructuredData } from "@/components/structured-data";
import {
  formatCrossclimbLadder,
  getCrossclimbHistory,
} from "@/lib/crossclimb-history";
import { getGameTabs } from "@/lib/game-tabs";
import {
  formatPinpointClues,
  getPinpointHistory,
} from "@/lib/pinpoint-history";
import { formatShortDate } from "@/lib/puzzle-dates";
import { getCrossclimbAnswerPath, getPinpointAnswerPath } from "@/lib/routes";
import { getAnswersStructuredData } from "@/lib/structured-data";

const gameTabs = getGameTabs("answers");
const crossclimbEntries = getCrossclimbHistory();
const pinpointEntries = getPinpointHistory();
const latestCrossclimb = crossclimbEntries[0];
const latestPinpoint = pinpointEntries[0];

export const metadata: Metadata = {
  title: {
    absolute: "All LinkedIn Games Answers | Puzzle Clues Today",
  },
  description:
    "Browse LinkedIn Games answers by puzzle, including the latest Crossclimb and Pinpoint answers with links to each full answer archive.",
  alternates: {
    canonical: "https://puzzleclues.today/answers/",
  },
  openGraph: {
    title: "All LinkedIn Games Answers | Puzzle Clues Today",
    description: "Latest Crossclimb and Pinpoint answers organized by game with today pages and answer archives.",
    url: "https://puzzleclues.today/answers/",
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
    title: "All LinkedIn Games Answers | Puzzle Clues Today",
    description: "Daily LinkedIn Games answers grouped by Crossclimb and Pinpoint.",
    images: ["https://puzzleclues.today/og-image.png"],
  },
};

export default function AnswersPage() {
  const primaryButtonClass =
    "inline-flex items-center justify-center rounded-lg bg-[#4A1B0C] px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#5C2310]";
  const secondaryButtonClass =
    "inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-3 text-[15px] font-semibold text-[#854F0B] transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]";
  const quickLinkClass =
    "inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-2.5 text-[15px] font-semibold text-[#854F0B] shadow-sm transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]";

  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <StructuredData data={getAnswersStructuredData(crossclimbEntries, pinpointEntries)} />

      <header className="border-b border-[#E7E3DA] bg-white">
        <div className="mx-auto flex max-w-[900px] flex-col items-start gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-8">
          <SiteBrand />
          <GameTabs tabs={gameTabs} />
        </div>
      </header>

      <main className="mx-auto max-w-[960px] space-y-8 px-4 py-8 md:py-10">
        <section className="space-y-3">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            All LinkedIn Games Answers
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-[#625B55]">
            Choose a game to open the latest answer page, or jump into the full archive for older LinkedIn Games
            puzzles.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {latestCrossclimb && (
              <Link href={getCrossclimbAnswerPath(latestCrossclimb.number)} className={quickLinkClass}>
                Latest Crossclimb
              </Link>
            )}
            {latestPinpoint && (
              <Link href={getPinpointAnswerPath(latestPinpoint.number)} className={quickLinkClass}>
                Latest Pinpoint
              </Link>
            )}
            <Link href="/crossclimb/archive/" className={quickLinkClass}>
              Crossclimb Archive
            </Link>
            <Link href="/pinpoint/archive/" className={quickLinkClass}>
              Pinpoint Archive
            </Link>
          </div>
        </section>

        <section className="grid items-stretch gap-4 md:grid-cols-2">
          <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#E7E3DA] bg-white shadow-sm">
            {latestCrossclimb ? (
              <div className="flex flex-1 flex-col p-5">
                <div className="space-y-3">
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a1a2e]">Crossclimb Answers</h2>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[15px]">
                    <span className="font-medium text-[#854F0B]">Latest #{latestCrossclimb.number}</span>
                    <span className="text-[#625B55]">{formatShortDate(latestCrossclimb.isoDate)}</span>
                  </div>
                  <p className="font-[family-name:var(--font-lora)] text-base leading-relaxed text-[#1a1a2e]">
                    {formatCrossclimbLadder(latestCrossclimb)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a1a2e]">
                  Crossclimb Answers
                </h2>
              </div>
            )}
            <div className="mt-auto grid gap-3 border-t border-[#E7E3DA] px-5 py-4 sm:grid-cols-2">
              {latestCrossclimb && (
                <Link href={getCrossclimbAnswerPath(latestCrossclimb.number)} className={primaryButtonClass}>
                  View latest answer
                </Link>
              )}
              <Link href="/crossclimb/archive/" className={secondaryButtonClass}>
                View all answers
              </Link>
            </div>
          </article>

          <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#E7E3DA] bg-white shadow-sm">
            {latestPinpoint ? (
              <div className="flex flex-1 flex-col p-5">
                <div className="space-y-3">
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a1a2e]">
                    Pinpoint Answers
                  </h2>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[15px]">
                    <span className="font-medium text-[#854F0B]">Latest #{latestPinpoint.number}</span>
                    <span className="text-[#625B55]">{formatShortDate(latestPinpoint.isoDate)}</span>
                  </div>
                  <p className="font-semibold text-[#1a1a2e]">{latestPinpoint.answer}</p>
                  <p className="text-[15px] leading-relaxed text-[#625B55]">{formatPinpointClues(latestPinpoint)}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a1a2e]">
                  Pinpoint Answers
                </h2>
              </div>
            )}
            <div className="mt-auto grid gap-3 border-t border-[#E7E3DA] px-5 py-4 sm:grid-cols-2">
              {latestPinpoint && (
                <Link href={getPinpointAnswerPath(latestPinpoint.number)} className={primaryButtonClass}>
                  View latest answer
                </Link>
              )}
              <Link href="/pinpoint/archive/" className={secondaryButtonClass}>
                View all answers
              </Link>
            </div>
          </article>
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
