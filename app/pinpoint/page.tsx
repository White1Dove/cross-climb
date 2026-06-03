import type { Metadata } from "next";
import Link from "next/link";
import { CountdownTimer } from "@/components/countdown-timer";
import { GameTabs } from "@/components/game-tabs";
import { PinpointCard } from "@/components/pinpoint-card";
import { SiteBrand } from "@/components/site-brand";
import { StructuredData } from "@/components/structured-data";
import currentPinpointPuzzle from "@/data/current-pinpoint.json";
import { getGameTabs } from "@/lib/game-tabs";
import { getPinpointAnalysis, getPinpointQuestionItems } from "@/lib/pinpoint-analysis";
import {
  formatPinpointClues,
  getRecentPinpointAnswers,
} from "@/lib/pinpoint-history";
import { formatShortDate, formatPuzzleDateWithWeekday } from "@/lib/puzzle-dates";
import { getPinpointAnswerPath } from "@/lib/routes";
import { getPinpointStructuredData } from "@/lib/structured-data";
import type { PinpointData } from "@/types/puzzle";

const gameTabs = getGameTabs("pinpoint");
const currentPuzzle = currentPinpointPuzzle as PinpointData;

export async function generateMetadata(): Promise<Metadata> {
  const p = currentPuzzle;

  return {
    title: {
      absolute: `LinkedIn Pinpoint Answer Today #${p.puzzle_number} (${p.puzzle_date}) | Puzzle Clues Today`,
    },
    description: `Looking for Pinpoint today? Get today's LinkedIn Pinpoint answer and all ${p.normalized_puzzle.clue_count} clues for puzzle #${p.puzzle_number}.`,
    alternates: {
      canonical: "https://puzzleclues.today/pinpoint/",
    },
    openGraph: {
      title: `LinkedIn Pinpoint Answer Today #${p.puzzle_number} | Puzzle Clues Today`,
      description: `Pinpoint today answer and clue list for puzzle #${p.puzzle_number}. Reveal the category only when you are ready.`,
      url: "https://puzzleclues.today/pinpoint/",
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
      title: `LinkedIn Pinpoint Answer Today #${p.puzzle_number}`,
      description: `Pinpoint today clues and answer for puzzle #${p.puzzle_number}.`,
      images: ["https://puzzleclues.today/og-image.png"],
    },
  };
}

export default function PinpointPage() {
  const puzzle = currentPuzzle;
  const displayDate = formatPuzzleDateWithWeekday(puzzle.puzzle_date);
  const analysis = getPinpointAnalysis(puzzle);
  const questionItems = getPinpointQuestionItems(puzzle);
  const recentAnswers = getRecentPinpointAnswers(puzzle.puzzle_number, 7);

  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <StructuredData data={getPinpointStructuredData(puzzle)} />

      <header className="border-b border-[#E7E3DA] bg-white">
        <div className="mx-auto flex max-w-[900px] flex-col items-start gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-8">
          <SiteBrand />
          <GameTabs tabs={gameTabs} />
        </div>
      </header>

      <CountdownTimer puzzleName="Pinpoint" />

      <main className="mx-auto max-w-[720px] space-y-8 px-4 py-6 md:py-8">
        <section className="space-y-3 text-center">
          <h1 className="mx-auto max-w-[330px] font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a1a2e] sm:max-w-none sm:text-3xl md:text-4xl">
            LinkedIn Pinpoint Answer Today
          </h1>
          <p className="text-lg text-[#625B55]">
            Pinpoint Today #{puzzle.puzzle_number} · {displayDate}
          </p>
          <p className="mx-auto max-w-prose text-[15px] leading-relaxed text-[#625B55]">
            Updated daily after the new puzzle is available. Clues are kept visible, and the category answer stays
            hidden until you choose to reveal it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="mx-auto max-w-[330px] text-center font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e] sm:max-w-none">
            Today&apos;s Pinpoint Clues and Answer
          </h2>
          <PinpointCard puzzle={puzzle} />
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Pinpoint Answer Analysis
          </h2>
          <details className="rounded-lg border border-[#E7E3DA] bg-white p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-[#1a1a2e]">Reveal answer and analysis</summary>
            <div className="mt-4 space-y-5 text-base leading-relaxed text-[#625B55]">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wider text-[#625B55]">
                  {analysis.categoryType}
                </p>
                <p className="mt-1 text-[#1a1a2e]">{puzzle.solution.final_answer}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">Connection to answer</h3>
                <p>{analysis.connection}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">Solving role</h3>
                <p>{analysis.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">Detailed explanation</h3>
                <p>{analysis.detailedExplanation}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">Clue-by-clue analysis</h3>
                <div className="mt-2 space-y-3">
                  {analysis.clueNotes.map((note) => (
                    <div key={note.clue} className="border-l-2 border-[#E7E3DA] pl-3">
                      <p className="font-semibold text-[#1a1a2e]">
                        {note.clue} <span className="font-normal text-[#625B55]">· {note.role}</span>
                      </p>
                      <p>{note.connection}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            About today&apos;s Pinpoint answer
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            Looking for <strong className="text-[#1a1a2e]">Pinpoint today</strong>? This page has today&apos;s
            LinkedIn Pinpoint clues and the shared category answer for puzzle #{puzzle.puzzle_number}. Use the
            clue list first if you want to solve it yourself, then reveal the category when you want to check the
            exact answer.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            How to play Pinpoint on LinkedIn
          </h2>
          <ul className="space-y-3 text-base leading-relaxed text-[#625B55]">
            <li>
              <span className="font-semibold text-[#1a1a2e]">1.</span> Read the clue words and look for what they
              have in common.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">2.</span> Guess the category that connects the full
              set of clues.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">3.</span> Use each added clue to narrow the category
              instead of treating every clue as a separate answer.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">4.</span> Check back daily after midnight Pacific
              Time for the next LinkedIn Pinpoint puzzle.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Pinpoint Today Questions
          </h2>
          <dl className="space-y-4 text-base leading-relaxed">
            {questionItems.map((item) => (
              <div key={item.question} className="space-y-1">
                <dt className="font-semibold text-[#1a1a2e]">{item.question}</dt>
                <dd className="text-[#625B55]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            LinkedIn Pinpoint Answer History
          </h2>
          {recentAnswers.length > 0 ? (
            <div className="space-y-3">
              {recentAnswers.map((entry) => (
                <div key={entry.number} className="border-b border-[#E7E3DA] pb-3 last:border-b-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <Link href={getPinpointAnswerPath(entry.number)} className="font-medium text-[#854F0B] hover:underline">
                      #{entry.number}
                    </Link>
                    <span className="text-[15px] text-[#625B55]">{formatShortDate(entry.isoDate)}</span>
                  </div>
                  <p className="mt-1 font-semibold text-[#1a1a2e]">{entry.answer}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#625B55]">{formatPinpointClues(entry)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base leading-relaxed text-[#625B55]">
              Pinpoint history will expand as new daily puzzles are captured.
            </p>
          )}
          <Link
            href="/pinpoint/archive/"
            className="inline-flex h-auto w-full items-center justify-center rounded-lg bg-[#4A1B0C] py-4 text-base font-semibold text-white transition-all duration-[400ms] ease-out hover:bg-[#5C2310]"
          >
            View Full LinkedIn Pinpoint Answer Archive →
          </Link>
        </section>
      </main>

      <footer className="mt-12 border-t border-[#E7E3DA] bg-white">
        <div className="mx-auto max-w-[720px] space-y-6 px-4 py-8">
          <div className="space-y-3 text-center text-[15px] text-[#625B55]">
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
