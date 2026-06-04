import type { Metadata } from "next";
import Link from "next/link";
import { GameTabs } from "@/components/game-tabs";
import { LadderCard } from "@/components/ladder-card";
import { CountdownTimer } from "@/components/countdown-timer";
import { StructuredData } from "@/components/structured-data";
import { SiteBrand } from "@/components/site-brand";
import currentCrossclimbPuzzle from "@/data/current-crossclimb.json";
import { getCrossclimbFaqItems } from "@/lib/crossclimb-faq";
import {
  formatCrossclimbLadder,
  formatShortCrossclimbDate,
  getRecentCrossclimbAnswers,
} from "@/lib/crossclimb-history";
import { getGameTabs } from "@/lib/game-tabs";
import { getCrossclimbAnswerPath } from "@/lib/routes";
import { getHomeStructuredData } from "@/lib/structured-data";
import type { PuzzleData } from "@/types/puzzle";

const gameTabs = getGameTabs("crossclimb");

const currentPuzzle = currentCrossclimbPuzzle as PuzzleData;

interface CrossClimbPageProps {
  puzzle?: PuzzleData;
}

function formatPuzzleDateWithWeekday(dateLabel: string) {
  const parsed = new Date(`${dateLabel} 12:00:00 UTC`);

  if (Number.isNaN(parsed.getTime())) {
    return dateLabel;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export async function generateMetadata(): Promise<Metadata> {
  const p = currentPuzzle;
  const topWord = p.solution.top_word;
  const bottomWord = p.solution.bottom_word;

  return {
    title: {
      absolute: `LinkedIn Crossclimb Answer Today #${p.puzzle_number} (${p.puzzle_date}) | Puzzle Clues Today`,
    },
    description: `Looking for Crossclimb today? Get today's LinkedIn Crossclimb answer, clues, and full word ladder for puzzle #${p.puzzle_number}. Today's solution runs from ${topWord} to ${bottomWord}.`,
    alternates: {
      canonical: 'https://puzzleclues.today/',
    },
    openGraph: {
      title: `LinkedIn Crossclimb Answer Today #${p.puzzle_number} | Puzzle Clues Today`,
      description: `Crossclimb today answer, clues, and word ladder solution from ${topWord} to ${bottomWord}. Step-by-step hints with no spoilers.`,
      url: 'https://puzzleclues.today/',
      siteName: 'Puzzle Clues Today',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://puzzleclues.today/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Puzzle Clues Today',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `LinkedIn Crossclimb Answer Today #${p.puzzle_number}`,
      description: `Crossclimb today answer, clues, and full word ladder solution. From ${topWord} to ${bottomWord}.`,
      images: ['https://puzzleclues.today/og-image.png'],
    },
  };
}

export default function CrossClimbPage({ puzzle = currentPuzzle }: CrossClimbPageProps) {
  const recentAnswers = getRecentCrossclimbAnswers(puzzle.puzzle_number, 7);
  const faqItems = getCrossclimbFaqItems(puzzle);
  const displayDate = formatPuzzleDateWithWeekday(puzzle.puzzle_date);
  const currentAnswerPath = getCrossclimbAnswerPath(puzzle.puzzle_number);

  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <StructuredData data={getHomeStructuredData(puzzle)} />

      {/* Header */}
      <header className="bg-white border-b border-[#E7E3DA]">
        <div className="mx-auto flex max-w-[900px] flex-col items-start gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-8">
          <SiteBrand />
          <GameTabs tabs={gameTabs} />
        </div>
      </header>

      {/* Countdown Timer */}
      <CountdownTimer />

      <main className="max-w-[720px] mx-auto px-4 py-6 md:py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-3">
          <div>
            <h1 className="mx-auto max-w-[330px] font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a1a2e] sm:max-w-none sm:text-3xl md:text-4xl">
              LinkedIn Crossclimb Answer Today
            </h1>
          </div>
          <p className="text-[#625B55] text-lg">
            Crossclimb Today #{puzzle.puzzle_number} · {displayDate}
          </p>
          <p className="mx-auto max-w-prose text-[15px] leading-relaxed text-[#625B55]">
            Updated daily after the new puzzle is available. Answers are checked before publication, and
            corrections can be reported through the contact page.
          </p>
          <Link
            href={currentAnswerPath}
            className="inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-3 text-[15px] font-semibold text-[#854F0B] transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]"
          >
            View Full Crossclimb #{puzzle.puzzle_number} Answer
          </Link>
        </section>

        {/* The Ladder Card */}
        <section className="space-y-4">
          <h2 className="mx-auto max-w-[330px] font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e] text-center sm:max-w-none">
            <span className="sm:hidden">
              Today&apos;s Crossclimb Hints
              <br />
              and Full Solution
            </span>
            <span className="hidden sm:inline">Today&apos;s Crossclimb Hints and Full Solution</span>
          </h2>
          <LadderCard puzzle={puzzle} />
        </section>

        {/* SEO: natural keyword placement after the main answer action */}
        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            About today&apos;s Crossclimb answer
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            Looking for <strong className="text-[#1a1a2e]">Crossclimb today</strong>? This page has today&apos;s
            clues, answer, and full word ladder for the latest{" "}
            <strong className="text-[#1a1a2e]">LinkedIn Games</strong>{" "}puzzle. Use the hints if you want a
            nudge first, or reveal the full solution when you&apos;re ready to check every rung. Each word is{" "}
            {puzzle.normalized_puzzle.word_length} letters long, and each step changes one letter as you climb
            from bottom to top.
          </p>
        </section>

        {/* How-to: captures play-intent searches without changing the answer-page focus */}
        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            How to play Crossclimb on LinkedIn
          </h2>
          <ul className="space-y-3 text-base leading-relaxed text-[#625B55]">
            <li>
              <span className="font-semibold text-[#1a1a2e]">1.</span> Read each clue and fill in the missing
              words in the ladder.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">2.</span> Arrange the words so each neighboring
              rung changes by one letter.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">3.</span> Use the top and bottom entries together
              to solve the final phrase clue.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">4.</span> Check back daily after midnight Pacific
              Time for the next LinkedIn Crossclimb puzzle.
            </li>
          </ul>
          <Link
            href="/how-to-play-crossclimb/"
            className="inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-3 text-[15px] font-semibold text-[#854F0B] transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]"
          >
            Read the full Crossclimb guide
          </Link>
        </section>

        {/* Recent Answers Section */}
        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            LinkedIn Crossclimb Answer History
          </h2>
          <div className="space-y-3">
            {recentAnswers.map((entry) => (
              <div
                key={entry.number}
                className="border-b border-[#E7E3DA] pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <Link href={getCrossclimbAnswerPath(entry.number)} className="font-medium text-[#854F0B] hover:underline">
                    #{entry.number}
                  </Link>
                  <span className="text-[15px] text-[#625B55]">{formatShortCrossclimbDate(entry.isoDate)}</span>
                </div>
                <p className="mt-1 font-[family-name:var(--font-lora)] text-base leading-relaxed text-[#1a1a2e]">
                  {formatCrossclimbLadder(entry)}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/crossclimb/archive/"
            className="inline-flex h-auto w-full items-center justify-center rounded-lg bg-[#4A1B0C] py-4 text-base font-semibold text-white transition-all duration-[400ms] ease-out hover:bg-[#5C2310]"
          >
            View Full LinkedIn Crossclimb Answer Archive →
          </Link>
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Crossclimb Today Questions
          </h2>
          <dl className="space-y-4 text-base leading-relaxed">
            {faqItems.map((item) => (
              <div key={item.question} className="space-y-1">
                <dt className="font-semibold text-[#1a1a2e]">{item.question}</dt>
                <dd className="text-[#625B55]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E7E3DA] mt-12">
        <div className="max-w-[720px] mx-auto px-4 py-8 space-y-6">
          {/* Footer Text */}
          <div className="text-center text-[15px] text-[#625B55] space-y-3">
            <p className="text-[13px] leading-relaxed">
              Puzzle Clues Today is an unofficial fan site. Not affiliated with or endorsed by LinkedIn Corporation. 
              LinkedIn is a registered trademark of LinkedIn Corporation.
            </p>
            <p>© 2026 Puzzle Clues Today. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link href="/about" className="hover:text-[#854F0B] hover:underline">
                About
              </Link>
              <Link href="/privacy" className="hover:text-[#854F0B] hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#854F0B] hover:underline">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-[#854F0B] hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
