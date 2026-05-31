import type { CrossclimbHistoryEntry } from "@/lib/crossclimb-history";
import type { PuzzleData } from "@/types/puzzle";

const baseUrl = "https://puzzleclues.today";
const organizationId = `${baseUrl}/#organization`;
const websiteId = `${baseUrl}/#website`;

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

function toIsoDate(dateLabel: string) {
  const parsed = new Date(`${dateLabel} 12:00:00 UTC`);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString().slice(0, 10);
}

function baseStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: "Puzzle Clues Today",
      url: baseUrl,
      logo: `${baseUrl}/android-chrome-512x512.png`,
      contactPoint: {
        "@type": "ContactPoint",
        email: "contact@puzzleclues.today",
        contactType: "corrections and site feedback",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: "Puzzle Clues Today",
      url: baseUrl,
      inLanguage: "en-US",
      publisher: {
        "@id": organizationId,
      },
    },
  ];
}

export function getHomeStructuredData(puzzle: PuzzleData) {
  const datePublished = toIsoDate(puzzle.puzzle_date);
  const ladder = puzzle.solution.full_ladder.join(" \u2192 ");

  return [
    ...baseStructuredData(),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Crossclimb Today",
          item: `${baseUrl}/`,
        },
      ],
    },
    compactObject({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Crossclimb Today #${puzzle.puzzle_number} Answer and Full Solution`,
      description: `Daily Crossclimb clues, answer, and full word ladder for puzzle #${puzzle.puzzle_number}.`,
      datePublished,
      dateModified: datePublished,
      inLanguage: "en-US",
      author: {
        "@id": organizationId,
      },
      publisher: {
        "@id": organizationId,
      },
      mainEntityOfPage: `${baseUrl}/`,
      about: [
        {
          "@type": "Thing",
          name: "Crossclimb",
        },
        {
          "@type": "Thing",
          name: "LinkedIn Games",
        },
      ],
      mainEntity: {
        "@type": "ItemList",
        name: `Crossclimb #${puzzle.puzzle_number} word ladder`,
        numberOfItems: puzzle.solution.full_ladder.length,
        itemListElement: puzzle.normalized_puzzle.rows.map((row) => ({
          "@type": "ListItem",
          position: row.index,
          name: row.word,
          description: row.clue,
        })),
      },
      articleBody: `The full ladder is ${ladder}.`,
    }),
  ];
}

export function getArchiveStructuredData(entries: CrossclimbHistoryEntry[]) {
  const newest = entries[0];
  const oldest = entries[entries.length - 1];
  const archiveUrl = `${baseUrl}/crossclimb/archive/`;

  return [
    ...baseStructuredData(),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Crossclimb Today",
          item: `${baseUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "LinkedIn Crossclimb Answer Archive",
          item: archiveUrl,
        },
      ],
    },
    compactObject({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "LinkedIn Crossclimb Answer Archive",
      description: `Past LinkedIn Crossclimb answers from ${oldest?.date} through ${newest?.date}, grouped by month.`,
      url: archiveUrl,
      inLanguage: "en-US",
      isPartOf: {
        "@id": websiteId,
      },
      publisher: {
        "@id": organizationId,
      },
      mainEntity: {
        "@type": "ItemList",
        name: "LinkedIn Crossclimb archive entries",
        numberOfItems: entries.length,
        itemListElement: entries.slice(0, 30).map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: `Crossclimb #${entry.number} Answer`,
            datePublished: entry.isoDate,
            description: `${entry.date}: ${entry.ladder.join(" \u2192 ")}`,
          },
        })),
      },
    }),
  ];
}
