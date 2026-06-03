import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameTabs } from "@/components/game-tabs";
import { SiteBrand } from "@/components/site-brand";
import { StructuredData } from "@/components/structured-data";
import { formatStepLabel, getCrossclimbClueExplanations } from "@/lib/crossclimb-analysis";
import {
  formatCrossclimbLadder,
  getCrossclimbByNumber,
  getCrossclimbHistory,
  getCrossclimbRows,
} from "@/lib/crossclimb-history";
import { getGameTabs } from "@/lib/game-tabs";
import { formatFullDate, formatShortDate } from "@/lib/puzzle-dates";
import { getCrossclimbAnswerPath } from "@/lib/routes";
import { getCrossclimbDetailStructuredData } from "@/lib/structured-data";

type CrossclimbDetailPageProps = {
  params: Promise<{
    number: string;
  }>;
};

const gameTabs = getGameTabs("crossclimb");
const history = getCrossclimbHistory();

export function generateStaticParams() {
  return history.map((entry) => ({ number: String(entry.number) }));
}

export async function generateMetadata({ params }: CrossclimbDetailPageProps): Promise<Metadata> {
  const { number } = await params;
  const entry = getCrossclimbByNumber(Number(number));

  if (!entry) {
    return {};
  }

  return {
    title: {
      absolute: `LinkedIn Crossclimb #${entry.number} Answer (${entry.date}) | Puzzle Clues Today`,
    },
    description: `LinkedIn Crossclimb #${entry.number} answer for ${entry.date}. See the full word ladder from ${entry.start} to ${entry.end}.`,
    alternates: {
      canonical: `https://puzzleclues.today${getCrossclimbAnswerPath(entry.number)}`,
    },
    openGraph: {
      title: `LinkedIn Crossclimb #${entry.number} Answer | Puzzle Clues Today`,
      description: `Crossclimb #${entry.number} full word ladder from ${entry.start} to ${entry.end}.`,
      url: `https://puzzleclues.today${getCrossclimbAnswerPath(entry.number)}`,
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
      title: `LinkedIn Crossclimb #${entry.number} Answer`,
      description: `Crossclimb answer and full word ladder for ${entry.date}.`,
      images: ["https://puzzleclues.today/og-image.png"],
    },
  };
}

export default async function CrossclimbDetailPage({ params }: CrossclimbDetailPageProps) {
  const { number } = await params;
  const entry = getCrossclimbByNumber(Number(number));

  if (!entry) {
    notFound();
  }

  const index = history.findIndex((item) => item.number === entry.number);
  const newerEntry = index > 0 ? history[index - 1] : undefined;
  const olderEntry = index >= 0 ? history[index + 1] : undefined;
  const recentAnswers = history.filter((item) => item.number !== entry.number).slice(0, 7);
  const clueRows = getCrossclimbRows(entry);
  const clueExplanations = getCrossclimbClueExplanations(entry, clueRows);

  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <StructuredData data={getCrossclimbDetailStructuredData(entry)} />

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
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-2 text-[15px] font-semibold text-[#854F0B] transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]"
            >
              Crossclimb Today
            </Link>
            <Link
              href="/crossclimb/archive/"
              className="inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-2 text-[15px] font-semibold text-[#854F0B] transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]"
            >
              View all Crossclimb answers
            </Link>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            LinkedIn Crossclimb{" "}
            <span className="[font-family:Arial,Helvetica,sans-serif] text-[0.86em] font-extrabold tracking-normal tabular-nums">
              #{entry.number}
            </span>{" "}
            Answer
          </h1>
          <p className="text-lg text-[#625B55]">{formatFullDate(entry.isoDate)}</p>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm md:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3 font-[family-name:var(--font-lora)] text-xl font-bold">
              <span className="rounded bg-[#0F6E56]/10 px-3 py-2 text-[#0F6E56]">{entry.start}</span>
              <span className="text-[#625B55]">to</span>
              <span className="rounded bg-[#4A1B0C]/10 px-3 py-2 text-[#4A1B0C]">{entry.end}</span>
            </div>
            <p className="text-center font-[family-name:var(--font-lora)] text-lg leading-relaxed text-[#1a1a2e]">
              {formatCrossclimbLadder(entry)}
            </p>
          </div>
        </section>

        {clueExplanations.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
              Crossclimb Clue Reasoning
            </h2>
            <div className="space-y-3 rounded-lg border border-[#E7E3DA] bg-white p-5 shadow-sm">
              {clueExplanations.map((item) => (
                <div key={`${item.step}-${item.word}`} className="border-b border-[#E7E3DA] pb-3 last:border-b-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-medium text-[#854F0B]">Step {item.step}</span>
                    <span className="font-[family-name:var(--font-lora)] font-bold text-[#1a1a2e]">{item.word}</span>
                  </div>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#625B55]">{item.reasoningText}</p>
                  {item.changeText && (
                    <p className="mt-1 text-[15px] leading-relaxed text-[#625B55]">{item.changeText}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Crossclimb Word Ladder
          </h2>
          <div className="overflow-hidden rounded-lg border border-[#E7E3DA] bg-white shadow-sm">
            {entry.ladder.map((word, wordIndex) => {
              const previousWord = entry.ladder[wordIndex - 1];

              return (
                <div
                  key={`${word}-${wordIndex}`}
                  className="grid gap-2 border-b border-[#E7E3DA] px-4 py-4 last:border-b-0 sm:grid-cols-[80px_1fr]"
                >
                  <span className="font-medium text-[#854F0B]">Step {wordIndex + 1}</span>
                  <div className="space-y-1">
                    <p className="font-[family-name:var(--font-lora)] text-lg font-bold text-[#1a1a2e]">{word}</p>
                    {previousWord && (
                      <p className="text-[15px] text-[#625B55]">
                        Changed from previous: {formatStepLabel(previousWord, word)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Recent Crossclimb Answers
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {recentAnswers.map((recentEntry) => (
              <Link
                key={recentEntry.number}
                href={getCrossclimbAnswerPath(recentEntry.number)}
                className="rounded-lg border border-[#E7E3DA] bg-white p-4 shadow-sm hover:border-[#854F0B]/40"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-medium text-[#854F0B]">#{recentEntry.number}</span>
                  <span className="text-[15px] text-[#625B55]">{formatShortDate(recentEntry.isoDate)}</span>
                </div>
                <p className="mt-2 font-[family-name:var(--font-lora)] text-[15px] leading-relaxed text-[#1a1a2e]">
                  {formatCrossclimbLadder(recentEntry)}
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/crossclimb/archive/"
            className="inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-3 text-[15px] font-semibold text-[#854F0B] transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]"
          >
            View all Crossclimb answers →
          </Link>
        </section>

        <nav className="flex flex-col gap-3 border-t border-[#E7E3DA] pt-5 text-[15px] font-medium sm:flex-row sm:justify-between">
          {newerEntry ? (
            <Link href={getCrossclimbAnswerPath(newerEntry.number)} className="text-[#854F0B] hover:underline">
              ← Newer: Crossclimb #{newerEntry.number}
            </Link>
          ) : (
            <Link href="/" className="text-[#854F0B] hover:underline">
              ← Crossclimb Today
            </Link>
          )}
          {olderEntry && (
            <Link href={getCrossclimbAnswerPath(olderEntry.number)} className="text-[#854F0B] hover:underline sm:text-right">
              Older: Crossclimb #{olderEntry.number} →
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
