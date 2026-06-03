import type { Metadata } from "next";
import Link from "next/link";
import { GameTabs } from "@/components/game-tabs";
import { SiteBrand } from "@/components/site-brand";
import { getGameTabs } from "@/lib/game-tabs";

const gameTabs = getGameTabs("pinpoint");

const guideLinkClass =
  "inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-2.5 text-[15px] font-semibold text-[#854F0B] shadow-sm transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]";

export const metadata: Metadata = {
  title: {
    absolute: "How to Play Pinpoint on LinkedIn | Puzzle Clues Today",
  },
  description:
    "Learn how LinkedIn Pinpoint works, how to compare clues, how to identify the shared category, and how to use daily Pinpoint answers without spoiling too early.",
  alternates: {
    canonical: "https://puzzleclues.today/how-to-play-pinpoint/",
  },
  openGraph: {
    title: "How to Play Pinpoint on LinkedIn | Puzzle Clues Today",
    description:
      "A concise guide to Pinpoint rules, clue patterns, category solving, common mistakes, and daily answer checks.",
    url: "https://puzzleclues.today/how-to-play-pinpoint/",
    siteName: "Puzzle Clues Today",
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "How to Play Pinpoint on LinkedIn",
    description: "Pinpoint rules, clue patterns, category solving, and daily answer checks.",
  },
};

export default function HowToPlayPinpointPage() {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <header className="border-b border-[#E7E3DA] bg-white">
        <div className="mx-auto flex max-w-[900px] flex-col items-start gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-8">
          <SiteBrand />
          <GameTabs tabs={gameTabs} />
        </div>
      </header>

      <main className="mx-auto max-w-[760px] space-y-8 px-4 py-8 md:py-10">
        <section className="space-y-4">
          <p className="text-[15px] font-medium text-[#854F0B]">Pinpoint guide</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            How to Play Pinpoint on LinkedIn
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-[#625B55]">
            Pinpoint is a category puzzle. Each clue points toward one shared answer. The challenge is to compare the
            clues as a set instead of solving them as separate trivia questions.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/pinpoint/" className={guideLinkClass}>
              Pinpoint Today
            </Link>
            <Link href="/pinpoint/archive/" className={guideLinkClass}>
              Pinpoint Archive
            </Link>
            <Link href="/answers/" className={guideLinkClass}>
              All LinkedIn Answers
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            The basic rules
          </h2>
          <ul className="space-y-3 text-base leading-relaxed text-[#625B55]">
            <li>Read the clues one by one and look for a shared category.</li>
            <li>The answer can be a set, a property, a phrase pattern, or a place-based connection.</li>
            <li>Do not stop at the first clue. Later clues often narrow the category.</li>
            <li>The final answer should explain the whole clue list, not just one clue.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Useful clue patterns
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            Some Pinpoint answers are plain categories, such as names of insects or types of pool. Others are phrase
            patterns, such as words that come before or after a fixed word. When a clue feels too broad, test whether
            it belongs to a phrase pattern before choosing a general category.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            A practical solving order
          </h2>
          <ol className="space-y-3 text-base leading-relaxed text-[#625B55]">
            <li>
              <span className="font-semibold text-[#1a1a2e]">1.</span> Write down the first possible category, but
              treat it as temporary.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">2.</span> After each new clue, ask what all visible
              clues share.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">3.</span> If one clue does not fit, look for a narrower
              phrase or property.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">4.</span> Reveal the answer only after your category
              explains every clue.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            How to use our Pinpoint answers
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            The daily Pinpoint page keeps the clues visible and hides the answer until you choose to reveal it.
            Recent and archive pages show the category answer, clue list, and a short explanation of how the clues
            connect.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Daily updates and answer checks
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            Pinpoint answers refresh after the new daily puzzle data is available, usually after midnight Pacific
            Time. The answer can change when the daily puzzle changes, or when a correction is needed after checking
            the visible clues.
          </p>
          <p className="text-base leading-relaxed text-[#625B55]">
            To verify an answer, compare the puzzle number, date, clue list, and category answer. If you are checking
            an older puzzle, use its archive detail page so the clues and category come from the same day.
          </p>
        </section>
      </main>

      <footer className="mt-12 border-t border-[#E7E3DA] bg-white">
        <div className="mx-auto max-w-[760px] px-4 py-8 text-center text-[13px] leading-relaxed text-[#625B55]">
          Puzzle Clues Today is an unofficial fan site. Not affiliated with or endorsed by LinkedIn Corporation.
          LinkedIn is a registered trademark of LinkedIn Corporation.
        </div>
      </footer>
    </div>
  );
}
