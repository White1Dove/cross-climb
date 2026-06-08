import type { Metadata } from "next";
import Link from "next/link";
import { GameTabs } from "@/components/game-tabs";
import { SiteBrand } from "@/components/site-brand";
import { getGameTabs } from "@/lib/game-tabs";

const gameTabs = getGameTabs("crossclimb");

const guideLinkClass =
  "inline-flex items-center justify-center rounded-lg border border-[#854F0B]/45 bg-white px-4 py-2.5 text-[15px] font-semibold text-[#854F0B] shadow-sm transition-colors hover:border-[#854F0B] hover:bg-[#F8F6F0]";

export const metadata: Metadata = {
  title: {
    absolute: "How to Play Crossclimb on LinkedIn | Puzzle Clues Today",
  },
  description:
    "Learn how LinkedIn Crossclimb works, how to read the clues, how the word ladder changes, and how to use daily answers without spoiling the puzzle too early.",
  alternates: {
    canonical: "https://puzzleclues.today/how-to-play-crossclimb/",
  },
  openGraph: {
    title: "How to Play Crossclimb on LinkedIn | Puzzle Clues Today",
    description:
      "A concise guide to Crossclimb rules, clues, word ladder changes, common mistakes, and daily answer checks.",
    url: "https://puzzleclues.today/how-to-play-crossclimb/",
    siteName: "Puzzle Clues Today",
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "How to Play Crossclimb on LinkedIn",
    description: "Crossclimb rules, solving tips, and daily answer checks.",
  },
};

export default function HowToPlayCrossclimbPage() {
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
          <p className="text-[15px] font-medium text-[#854F0B]">Crossclimb guide</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            How to Play Crossclimb on LinkedIn
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-[#625B55]">
            Crossclimb is a word ladder puzzle. You solve the middle clues, arrange the answers so each neighboring
            word changes by one letter, then use the top and bottom words together to answer the shared final clue.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/" className={guideLinkClass}>
              Crossclimb Today
            </Link>
            <Link href="/crossclimb/archive/" className={guideLinkClass}>
              Crossclimb Archive
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
            <li>The middle rungs each answer their own clue.</li>
            <li>Neighboring rungs must stay the same length and change exactly one letter.</li>
            <li>The top and bottom rungs combine to solve one shared final clue.</li>
            <li>The puzzle is finished only when the middle clues, shared final clue, and ladder order all work.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            A practical solving order
          </h2>
          <ol className="space-y-3 text-base leading-relaxed text-[#625B55]">
            <li>
              <span className="font-semibold text-[#1a1a2e]">1.</span> Solve the clues you know first. Do not worry
              about ladder order yet.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">2.</span> Compare likely answers and group words that
              differ by one letter.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">3.</span> Use the first and last words to test the
              final clue.
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e]">4.</span> If one rung breaks the ladder, recheck that
              clue before changing the whole order.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Common mistakes
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            The most common mistake is solving each clue correctly but placing the words in the wrong order. Another
            mistake is accepting a word that fits a clue but changes two letters from its neighbor. Crossclimb needs
            both parts to work: clue meaning and one-letter ladder movement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            How to use our Crossclimb answers
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            Start with the hints if you want to keep solving. Reveal the full answer only when you want to check the
            ladder. Historical answer pages show the full ladder, and newer pages may include clue reasoning when
            the original clue data is available.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Daily updates and answer checks
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            Crossclimb answers refresh after the new daily puzzle data is available, usually after midnight Pacific
            Time. The answer can change when the daily puzzle changes, or when a correction is needed after checking
            the clue list.
          </p>
          <p className="text-base leading-relaxed text-[#625B55]">
            To verify an answer, compare the puzzle number, date, clue answers, and full ladder. The archive keeps
            older puzzles separate, so a past answer should be checked on its detail page instead of the today page.
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
