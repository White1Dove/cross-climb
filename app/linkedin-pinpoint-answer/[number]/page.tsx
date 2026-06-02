import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameTabs } from "@/components/game-tabs";
import { PinpointCard } from "@/components/pinpoint-card";
import { SiteBrand } from "@/components/site-brand";
import { StructuredData } from "@/components/structured-data";
import { getGameTabs } from "@/lib/game-tabs";
import { getPinpointAnalysis, getPinpointQuestionItems } from "@/lib/pinpoint-analysis";
import {
  buildPinpointPuzzleFromHistory,
  formatPinpointClues,
  getPinpointByNumber,
  getPinpointHistory,
} from "@/lib/pinpoint-history";
import { formatFullDate, formatShortDate } from "@/lib/puzzle-dates";
import { getPinpointAnswerPath } from "@/lib/routes";
import { getPinpointDetailStructuredData } from "@/lib/structured-data";

type PinpointDetailPageProps = {
  params: Promise<{
    number: string;
  }>;
};

const gameTabs = getGameTabs("pinpoint");
const history = getPinpointHistory();

export function generateStaticParams() {
  return history.map((entry) => ({ number: String(entry.number) }));
}

export async function generateMetadata({ params }: PinpointDetailPageProps): Promise<Metadata> {
  const { number } = await params;
  const entry = getPinpointByNumber(Number(number));

  if (!entry) {
    return {};
  }

  return {
    title: {
      absolute: `LinkedIn Pinpoint #${entry.number} Answer (${entry.date}) | Puzzle Clues Today`,
    },
    description: `LinkedIn Pinpoint #${entry.number} answer for ${entry.date}. See the category answer, clues, and explanation for this puzzle.`,
    alternates: {
      canonical: `https://puzzleclues.today${getPinpointAnswerPath(entry.number)}`,
    },
    openGraph: {
      title: `LinkedIn Pinpoint #${entry.number} Answer | Puzzle Clues Today`,
      description: `Pinpoint #${entry.number} answer and clue analysis for ${entry.date}.`,
      url: `https://puzzleclues.today${getPinpointAnswerPath(entry.number)}`,
      siteName: "Puzzle Clues Today",
      locale: "en_US",
      type: "article",
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
      title: `LinkedIn Pinpoint #${entry.number} Answer`,
      description: `Pinpoint answer, clues, and explanation for ${entry.date}.`,
      images: ["https://puzzleclues.today/og-image.png"],
    },
  };
}

export default async function PinpointDetailPage({ params }: PinpointDetailPageProps) {
  const { number } = await params;
  const entry = getPinpointByNumber(Number(number));

  if (!entry) {
    notFound();
  }

  const puzzle = buildPinpointPuzzleFromHistory(entry);
  const analysis = getPinpointAnalysis(puzzle);
  const questionItems = getPinpointQuestionItems(puzzle);
  const index = history.findIndex((item) => item.number === entry.number);
  const newerEntry = index > 0 ? history[index - 1] : undefined;
  const olderEntry = index >= 0 ? history[index + 1] : undefined;
  const recentAnswers = history.filter((item) => item.number !== entry.number).slice(0, 7);

  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <StructuredData data={getPinpointDetailStructuredData(entry)} />

      <header className="border-b border-[#E7E3DA] bg-white">
        <div className="mx-auto flex max-w-[900px] flex-col items-start gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-8">
          <SiteBrand />
          <GameTabs tabs={gameTabs} />
        </div>
      </header>

      <main className="mx-auto max-w-[760px] space-y-8 px-4 py-6 md:py-8">
        <section className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/pinpoint/"
              className="inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-2 text-[15px] font-semibold text-[#854F0B] transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]"
            >
              Pinpoint Today
            </Link>
            <Link
              href="/pinpoint/archive/"
              className="inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-2 text-[15px] font-semibold text-[#854F0B] transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]"
            >
              View all Pinpoint answers
            </Link>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            LinkedIn Pinpoint{" "}
            <span className="[font-family:Arial,Helvetica,sans-serif] text-[0.86em] font-extrabold tracking-normal tabular-nums">
              #{entry.number}
            </span>{" "}
            Answer
          </h1>
          <p className="text-lg text-[#625B55]">{formatFullDate(entry.isoDate)}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-center font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Pinpoint{" "}
            <span className="[font-family:Arial,Helvetica,sans-serif] text-[0.86em] font-extrabold tracking-normal tabular-nums">
              #{entry.number}
            </span>{" "}
            Clues and Answer
          </h2>
          <PinpointCard puzzle={puzzle} />
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Pinpoint Answer Analysis
          </h2>
          <details className="rounded-lg border border-[#E7E3DA] bg-white p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-[#1a1a2e]">Reveal answer explanation</summary>
            <div className="mt-4 space-y-5 text-base leading-relaxed text-[#625B55]">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wider text-[#625B55]">
                  {analysis.categoryType}
                </p>
                <p className="mt-1 text-[#1a1a2e]">{entry.answer}</p>
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

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Pinpoint Questions
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
            Recent Pinpoint Answers
          </h2>
          {recentAnswers.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {recentAnswers.map((recentEntry) => (
                <Link
                  key={recentEntry.number}
                  href={getPinpointAnswerPath(recentEntry.number)}
                  className="rounded-lg border border-[#E7E3DA] bg-white p-4 shadow-sm hover:border-[#854F0B]/40"
                >
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-medium text-[#854F0B]">#{recentEntry.number}</span>
                    <span className="text-[15px] text-[#625B55]">{formatShortDate(recentEntry.isoDate)}</span>
                  </div>
                  <p className="mt-2 font-semibold text-[#1a1a2e]">{recentEntry.answer}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#625B55]">
                    {formatPinpointClues(recentEntry)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-base leading-relaxed text-[#625B55]">
              Pinpoint history will expand as new daily puzzles are captured.
            </p>
          )}
          <Link
            href="/pinpoint/archive/"
            className="inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-3 text-[15px] font-semibold text-[#854F0B] transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]"
          >
            View all Pinpoint answers →
          </Link>
        </section>

        <nav className="flex flex-col gap-3 border-t border-[#E7E3DA] pt-5 text-[15px] font-medium sm:flex-row sm:justify-between">
          {newerEntry ? (
            <Link href={getPinpointAnswerPath(newerEntry.number)} className="text-[#854F0B] hover:underline">
              ← Newer: Pinpoint #{newerEntry.number}
            </Link>
          ) : (
            <Link href="/pinpoint/" className="text-[#854F0B] hover:underline">
              ← Pinpoint Today
            </Link>
          )}
          {olderEntry && (
            <Link href={getPinpointAnswerPath(olderEntry.number)} className="text-[#854F0B] hover:underline sm:text-right">
              Older: Pinpoint #{olderEntry.number} →
            </Link>
          )}
        </nav>
      </main>

      <footer className="mt-12 border-t border-[#E7E3DA] bg-white">
        <div className="mx-auto max-w-[720px] px-4 py-8 text-center text-[13px] leading-relaxed text-[#625B55]">
          Puzzle Clues Today is an unofficial fan site. Not affiliated with or endorsed by LinkedIn Corporation.
          LinkedIn is a registered trademark of LinkedIn Corporation.
        </div>
      </footer>
    </div>
  );
}
