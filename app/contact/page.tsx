import type { Metadata } from "next";
import Link from "next/link";
import { SiteBrand } from "@/components/site-brand";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Puzzle Clues Today | Puzzle Clues Today",
  },
  description:
    "Contact Puzzle Clues Today with corrections, broken links, outdated clues, or other site feedback.",
  alternates: {
    canonical: "https://puzzleclues.today/contact/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <header className="border-b border-[#E7E3DA] bg-white">
        <div className="mx-auto flex max-w-[720px] items-center justify-between px-4 py-3">
          <SiteBrand />
          <Link href="/" className="text-[15px] font-medium text-[#854F0B] hover:underline">
            Crossclimb Today
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-8 px-4 py-8 md:py-10">
        <section className="space-y-4">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            Contact Puzzle Clues Today
          </h1>
          <p className="text-base leading-relaxed text-[#625B55]">
            Send corrections, broken link reports, outdated clue notes, or other site feedback to{" "}
            <a className="font-medium text-[#854F0B] hover:underline" href="mailto:contact@puzzleclues.today">
              contact@puzzleclues.today
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            What to include
          </h2>
          <ul className="space-y-2 text-base leading-relaxed text-[#625B55]">
            <li>The page URL or puzzle number related to your note.</li>
            <li>The correction or issue you found.</li>
            <li>A source or short explanation if the issue is answer-related.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
