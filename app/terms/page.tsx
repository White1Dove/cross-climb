import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Terms of Use | Puzzle Clues Today",
  },
  description:
    "Terms of use for Puzzle Clues Today, an unofficial puzzle clues and answers website.",
  alternates: {
    canonical: "https://puzzleclues.today/terms/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <header className="border-b border-[#E7E3DA] bg-white">
        <div className="mx-auto flex max-w-[720px] items-center justify-between px-4 py-3">
          <Link href="/" className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1a1a2e]">
            Puzzle Clues Today
          </Link>
          <Link href="/" className="text-sm text-[#854F0B] hover:underline">
            Crossclimb Today
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-8 px-4 py-8 md:py-10">
        <section className="space-y-4">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            Terms of Use
          </h1>
          <p className="text-sm leading-relaxed text-[#78716C]">
            By using Puzzle Clues Today, you agree to use the site for personal, informational purposes. The
            site provides puzzle clues, answers, and archive information as an unofficial fan resource.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Accuracy
          </h2>
          <p className="text-sm leading-relaxed text-[#78716C]">
            We try to keep answers and archive information accurate, but puzzle data may contain mistakes,
            omissions, or outdated details. Use the contact page to report corrections.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Unofficial site
          </h2>
          <p className="text-sm leading-relaxed text-[#78716C]">
            Puzzle Clues Today is not affiliated with, endorsed by, or sponsored by LinkedIn Corporation.
            LinkedIn is a registered trademark of LinkedIn Corporation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            External links
          </h2>
          <p className="text-sm leading-relaxed text-[#78716C]">
            Links to third-party websites are provided for convenience. We are not responsible for third-party
            websites, policies, or availability.
          </p>
        </section>
      </main>
    </div>
  );
}
