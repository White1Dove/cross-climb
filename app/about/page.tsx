import type { Metadata } from "next";
import Link from "next/link";
import { SiteBrand } from "@/components/site-brand";

export const metadata: Metadata = {
  title: {
    absolute: "About Puzzle Clues Today | Puzzle Clues Today",
  },
  description:
    "Learn what Puzzle Clues Today is, how often puzzle clues and answers are updated, and how to contact us with corrections.",
  alternates: {
    canonical: "https://puzzleclues.today/about/",
  },
  openGraph: {
    title: "About Puzzle Clues Today | Puzzle Clues Today",
    description:
      "Learn what Puzzle Clues Today is, how often puzzle clues and answers are updated, and how to contact us with corrections.",
    url: "https://puzzleclues.today/about/",
    siteName: "Puzzle Clues Today",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Puzzle Clues Today | Puzzle Clues Today",
    description:
      "Learn what Puzzle Clues Today is, how often puzzle clues and answers are updated, and how to contact us with corrections.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <header className="bg-white border-b border-[#E7E3DA]">
        <div className="max-w-[720px] mx-auto px-4 py-3 flex items-center justify-between">
          <SiteBrand />
          <Link href="/" className="text-[#854F0B] hover:underline text-[15px] font-medium">
            Crossclimb Today
          </Link>
        </div>
      </header>

      <main className="max-w-[720px] mx-auto px-4 py-8 md:py-10 space-y-8">
        <section className="space-y-4">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#1a1a2e]">
            About Puzzle Clues Today
          </h1>
          <p className="text-[#625B55] text-base leading-relaxed">
            Puzzle Clues Today is an independent answer and hints site for daily puzzle games. We publish
            clear clues, answers, and full solutions for players who want a nudge, want to check their work,
            or want to catch up on a recent puzzle.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            What we update
          </h2>
          <p className="text-[#625B55] text-base leading-relaxed">
            The site currently focuses on Crossclimb Today and Pinpoint Today. Daily pages include the puzzle
            number, date, spoiler-light clues, and answer checks. More daily puzzle pages may be added over time,
            including other word, logic, and mini puzzle formats.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Update schedule
          </h2>
          <p className="text-[#625B55] text-base leading-relaxed">
            Crossclimb answers are updated daily after the new puzzle becomes available and checked before
            publication. We also keep recent answer links and archive pages so returning players can find
            earlier solutions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Independent site
          </h2>
          <p className="text-[#625B55] text-base leading-relaxed">
            Puzzle Clues Today is not affiliated with, endorsed by, or sponsored by LinkedIn Corporation. We do
            not use LinkedIn logos or official brand assets. LinkedIn is a registered trademark of LinkedIn
            Corporation, and LinkedIn Games is referenced only to identify the game context for readers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Corrections and contact
          </h2>
          <p className="text-[#625B55] text-base leading-relaxed">
            If you spot an incorrect answer, typo, broken archive link, or outdated clue, send a correction
            request through the contact page. We review correction requests and update pages when a fix is
            needed.
          </p>
          <Link href="/contact" className="inline-block text-[#854F0B] hover:underline text-[15px] font-medium">
            Contact Puzzle Clues Today →
          </Link>
        </section>
      </main>

      <footer className="bg-white border-t border-[#E7E3DA] mt-12">
        <div className="max-w-[720px] mx-auto px-4 py-8 space-y-6">
          <div className="text-center text-[15px] text-[#625B55] space-y-3">
            <p className="text-[13px] leading-relaxed">
              Puzzle Clues Today is an unofficial fan site. Not affiliated with or endorsed by LinkedIn Corporation.
              LinkedIn is a registered trademark of LinkedIn Corporation.
            </p>
            <p>© 2026 Puzzle Clues Today. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link href="/" className="hover:text-[#854F0B] hover:underline">
                Home
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
