import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameTabs } from "@/components/game-tabs";
import { comingSoonGameSlugs, getGameBySlug, getGameTabs } from "@/lib/game-tabs";

type ComingSoonPageProps = {
  params: Promise<{
    game: string;
  }>;
};

export function generateStaticParams() {
  return comingSoonGameSlugs.map((game) => ({ game }));
}

export async function generateMetadata({ params }: ComingSoonPageProps): Promise<Metadata> {
  const { game: gameSlug } = await params;
  const game = getGameBySlug(gameSlug);

  if (!game || game.slug === "crossclimb") {
    return {};
  }

  return {
    title: {
      absolute: `${game.name} Today Answers Coming Soon | Puzzle Clues Today`,
    },
    description: `${game.name} today answers are coming soon to Puzzle Clues Today. Crossclimb answers are live now.`,
    alternates: {
      canonical: `https://puzzleclues.today/${game.slug}/`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ComingSoonPage({ params }: ComingSoonPageProps) {
  const { game: gameSlug } = await params;
  const game = getGameBySlug(gameSlug);

  if (!game || game.slug === "crossclimb") {
    notFound();
  }

  const gameTabs = getGameTabs(game.slug);

  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <header className="bg-white border-b border-[#E7E3DA]">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-start gap-x-10 gap-y-2 px-4 py-3 md:px-8">
          <Link href="/" className="shrink-0 whitespace-nowrap font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1a1a2e]">
            Puzzle Clues Today
          </Link>
          <GameTabs tabs={gameTabs} />
        </div>
      </header>

      <main className="max-w-[720px] mx-auto px-4 py-8 md:py-10 space-y-8">
        <section className="space-y-4">
          <p className="inline-flex rounded bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#78716C]">
            Today answers coming soon
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#1a1a2e]">
            {game.name} Today Answers Coming Soon
          </h1>
          <p className="max-w-prose text-sm leading-relaxed text-[#78716C]">
            We are preparing a daily {game.name} answers page. For now, Crossclimb Today is live with clues,
            the full solution, recent answers, and the answer archive.
          </p>
        </section>

        <section className="border border-[#E7E3DA] bg-white p-5 rounded-lg shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Available now
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-[#4A1B0C] px-4 py-2 text-sm font-medium text-white hover:bg-[#5C2310]"
            >
              Crossclimb Today
            </Link>
            <Link
              href="/crossclimb/archive"
              className="inline-flex items-center justify-center rounded-md border border-[#E7E3DA] bg-white px-4 py-2 text-sm font-medium text-[#4A1B0C] hover:bg-[#F8F6F0]"
            >
              Crossclimb Archive
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-[#E7E3DA] mt-12">
        <div className="max-w-[720px] mx-auto px-4 py-8 text-center text-sm text-[#78716C]">
          <p className="text-xs leading-relaxed">
            Puzzle Clues Today is an unofficial fan site. Not affiliated with or endorsed by LinkedIn Corporation.
            LinkedIn is a registered trademark of LinkedIn Corporation.
          </p>
        </div>
      </footer>
    </div>
  );
}
