import type { Metadata } from "next";
import Link from "next/link";
import { GameTabs } from "@/components/game-tabs";
import { LadderCard } from "@/components/ladder-card";
import { CountdownTimer } from "@/components/countdown-timer";
import currentCrossclimbPuzzle from "@/data/current-crossclimb.json";
import {
  formatCrossclimbLadder,
  formatShortCrossclimbDate,
  getRecentCrossclimbAnswers,
} from "@/lib/crossclimb-history";
import { getGameTabs } from "@/lib/game-tabs";
import type { PuzzleData } from "@/types/puzzle";

const gameTabs = getGameTabs("crossclimb");

const currentPuzzle = currentCrossclimbPuzzle as PuzzleData;

const recentAnswers = getRecentCrossclimbAnswers(currentPuzzle.puzzle_number, 7);

interface CrossClimbPageProps {
  puzzle?: PuzzleData;
}

export async function generateMetadata(): Promise<Metadata> {
  const p = currentPuzzle;
  const topWord = p.solution.top_word;
  const bottomWord = p.solution.bottom_word;

  return {
    title: {
      absolute: `Crossclimb Today — Answer, Clues and Full Solution | Puzzle Clues Today`,
    },
    description: `Looking for Crossclimb today? See today's LinkedIn Games clues, answer, and full word ladder for puzzle #${p.puzzle_number}. From ${bottomWord} to ${topWord} — each step changes one letter.`,
    alternates: {
      canonical: 'https://puzzleclues.today/',
    },
    openGraph: {
      title: `Crossclimb Today: #${p.puzzle_number} Answer and Clues | Puzzle Clues Today`,
      description: `Today's Crossclimb #${p.puzzle_number} word ladder solution — from ${bottomWord} to ${topWord}. Step-by-step hints with no spoilers.`,
      url: 'https://puzzleclues.today/',
      siteName: 'Puzzle Clues Today',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `Crossclimb Today: #${p.puzzle_number} Answer and Clues`,
      description: `Today's Crossclimb #${p.puzzle_number} clues and full word ladder solution. From ${bottomWord} to ${topWord}.`,
    },
  };
}

export default function CrossClimbPage({ puzzle = currentPuzzle }: CrossClimbPageProps) {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E7E3DA]">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-start gap-x-10 gap-y-2 px-4 py-3 md:px-8">
          <Link href="/" className="shrink-0 whitespace-nowrap font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1a1a2e]">
            Puzzle Clues Today
          </Link>
          <GameTabs tabs={gameTabs} />
        </div>
      </header>

      {/* Countdown Timer */}
      <CountdownTimer currentPuzzleNumber={puzzle.puzzle_number} />

      <main className="max-w-[720px] mx-auto px-4 py-8 md:py-10 space-y-10">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#1a1a2e]">
              Crossclimb Today: Answer and Full Solution
            </h1>
          </div>
          <p className="text-[#78716C] text-lg">
            Puzzle #{puzzle.puzzle_number} · {puzzle.puzzle_date}
          </p>
        </section>

        {/* SEO: natural keyword placement */}
        <section className="text-center max-w-prose mx-auto">
          <p className="text-[#78716C] text-sm leading-relaxed">
            Looking for <strong className="text-[#1a1a2e]">Crossclimb today</strong>? Here are today&apos;s
            clues, answer, and full word ladder for the latest{" "}
            <strong className="text-[#1a1a2e]">LinkedIn Games</strong>{" "}puzzle. Use the hints if you want a
            nudge first, or reveal the full solution when you&apos;re ready to check every rung. Each word is{" "}
            {puzzle.normalized_puzzle.word_length} letters long, and each step changes one letter as you climb
            from bottom to top.
          </p>
        </section>

        {/* The Ladder Card */}
        <section className="space-y-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e] text-center">
            Today&apos;s Crossclimb Hints and Full Solution
          </h2>
          <LadderCard puzzle={puzzle} />
        </section>

        {/* How-to: captures play-intent searches without changing the answer-page focus */}
        <section className="mx-auto max-w-prose space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            How to play Crossclimb on LinkedIn
          </h2>
          <ul className="space-y-3 text-sm leading-relaxed text-[#78716C]">
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
        </section>

        {/* Recent Answers Section */}
        <section className="space-y-4">
          <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Recent Crossclimb Answers
          </h3>
          <div className="space-y-3">
            {recentAnswers.map((entry) => (
              <div
                key={entry.number}
                className="border-b border-[#E7E3DA] pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-medium text-[#854F0B]">
                    #{entry.number}
                  </span>
                  <span className="text-sm text-[#78716C]">{formatShortCrossclimbDate(entry.isoDate)}</span>
                </div>
                <p className="mt-1 font-[family-name:var(--font-lora)] text-sm leading-relaxed text-[#1a1a2e]">
                  {formatCrossclimbLadder(entry)}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/crossclimb/archive"
            className="inline-block text-[#854F0B] hover:underline text-sm"
          >
            View Full Archive →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E7E3DA] mt-12">
        <div className="max-w-[720px] mx-auto px-4 py-8 space-y-6">
          {/* Footer Text */}
          <div className="text-center text-sm text-[#78716C] space-y-3">
            <p className="text-xs leading-relaxed">
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
