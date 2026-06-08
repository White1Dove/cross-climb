import type { CrossclimbHistoryEntry } from "@/lib/crossclimb-history";
import type { PinpointHistoryEntry } from "@/lib/pinpoint-history";
import { getCrossclimbAnswerPath, getPinpointAnswerPath } from "@/lib/routes";
import type { PinpointData, PuzzleData, PuzzleRow } from "@/types/puzzle";

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

function cleanFinalClue(clue: string) {
  return clue.replace(/^The top \+ bottom rows\s*=\s*/i, "").trim() || clue;
}

function getCrossclimbRowDescription(row: PuzzleRow, rows: PuzzleRow[]) {
  const topClue = rows.find((item) => item.position === "top")?.clue.trim().toLowerCase();
  const bottomClue = rows.find((item) => item.position === "bottom")?.clue.trim().toLowerCase();
  const isSharedFinalRow =
    (row.position === "top" || row.position === "bottom") && Boolean(topClue && bottomClue && topClue === bottomClue);

  return isSharedFinalRow ? `Shared final clue: ${cleanFinalClue(row.clue)}` : row.clue;
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
          description: getCrossclimbRowDescription(row, puzzle.normalized_puzzle.rows),
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

export function getCrossclimbDetailStructuredData(entry: CrossclimbHistoryEntry) {
  const pageUrl = `${baseUrl}${getCrossclimbAnswerPath(entry.number)}`;

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
          item: `${baseUrl}/crossclimb/archive/`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Crossclimb #${entry.number}`,
          item: pageUrl,
        },
      ],
    },
    compactObject({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `LinkedIn Crossclimb #${entry.number} Answer`,
      description: `${entry.date} LinkedIn Crossclimb answer and full word ladder.`,
      datePublished: entry.isoDate,
      dateModified: entry.isoDate,
      inLanguage: "en-US",
      author: {
        "@id": organizationId,
      },
      publisher: {
        "@id": organizationId,
      },
      mainEntityOfPage: pageUrl,
      articleBody: `The full Crossclimb ladder is ${entry.ladder.join(" \u2192 ")}.`,
    }),
  ];
}

export function getPinpointArchiveStructuredData(entries: PinpointHistoryEntry[]) {
  const newest = entries[0];
  const oldest = entries[entries.length - 1];
  const archiveUrl = `${baseUrl}/pinpoint/archive/`;

  return [
    ...baseStructuredData(),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Pinpoint Today",
          item: `${baseUrl}/pinpoint/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "LinkedIn Pinpoint Answer Archive",
          item: archiveUrl,
        },
      ],
    },
    compactObject({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "LinkedIn Pinpoint Answer Archive",
      description: `Past LinkedIn Pinpoint answers from ${oldest?.date} through ${newest?.date}, grouped by month.`,
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
        name: "LinkedIn Pinpoint archive entries",
        numberOfItems: entries.length,
        itemListElement: entries.slice(0, 30).map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: `Pinpoint #${entry.number} Answer`,
            datePublished: entry.isoDate,
            description: `${entry.date}: ${entry.answer}`,
            url: `${baseUrl}${getPinpointAnswerPath(entry.number)}`,
          },
        })),
      },
    }),
  ];
}

export function getPinpointDetailStructuredData(entry: PinpointHistoryEntry) {
  const pageUrl = `${baseUrl}${getPinpointAnswerPath(entry.number)}`;

  return [
    ...baseStructuredData(),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Pinpoint Today",
          item: `${baseUrl}/pinpoint/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "LinkedIn Pinpoint Answer Archive",
          item: `${baseUrl}/pinpoint/archive/`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Pinpoint #${entry.number}`,
          item: pageUrl,
        },
      ],
    },
    compactObject({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `LinkedIn Pinpoint #${entry.number} Answer`,
      description: `${entry.date} LinkedIn Pinpoint answer and clue list.`,
      datePublished: entry.isoDate,
      dateModified: entry.isoDate,
      inLanguage: "en-US",
      author: {
        "@id": organizationId,
      },
      publisher: {
        "@id": organizationId,
      },
      mainEntityOfPage: pageUrl,
      articleBody: `The Pinpoint category answer is ${entry.answer}. The clues are ${entry.clues.join(", ")}.`,
    }),
  ];
}

export function getAnswersStructuredData(
  crossclimbEntries: CrossclimbHistoryEntry[],
  pinpointEntries: PinpointHistoryEntry[],
) {
  const pageUrl = `${baseUrl}/answers/`;
  const itemListElement = [
    ...crossclimbEntries.slice(0, 15).map((entry) => ({
      name: `Crossclimb #${entry.number}`,
      url: `${baseUrl}${getCrossclimbAnswerPath(entry.number)}`,
      description: entry.ladder.join(" \u2192 "),
    })),
    ...pinpointEntries.slice(0, 15).map((entry) => ({
      name: `Pinpoint #${entry.number}`,
      url: `${baseUrl}${getPinpointAnswerPath(entry.number)}`,
      description: entry.answer,
    })),
  ];

  return [
    ...baseStructuredData(),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "LinkedIn Games Answers",
          item: pageUrl,
        },
      ],
    },
    compactObject({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "LinkedIn Games Answers",
      description: "Daily LinkedIn Games answers grouped by puzzle, including Crossclimb and Pinpoint.",
      url: pageUrl,
      inLanguage: "en-US",
      isPartOf: {
        "@id": websiteId,
      },
      publisher: {
        "@id": organizationId,
      },
      mainEntity: {
        "@type": "ItemList",
        name: "LinkedIn Games answer links",
        numberOfItems: itemListElement.length,
        itemListElement: itemListElement.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            ...item,
          },
        })),
      },
    }),
  ];
}

export function getPinpointStructuredData(puzzle: PinpointData) {
  const datePublished = toIsoDate(puzzle.puzzle_date);
  const pinpointUrl = `${baseUrl}/pinpoint/`;

  return [
    ...baseStructuredData(),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Pinpoint Today",
          item: pinpointUrl,
        },
      ],
    },
    compactObject({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Pinpoint Today #${puzzle.puzzle_number} Answer and Clues`,
      description: `Daily Pinpoint clues and category answer for puzzle #${puzzle.puzzle_number}.`,
      datePublished,
      dateModified: datePublished,
      inLanguage: "en-US",
      author: {
        "@id": organizationId,
      },
      publisher: {
        "@id": organizationId,
      },
      mainEntityOfPage: pinpointUrl,
      about: [
        {
          "@type": "Thing",
          name: "Pinpoint",
        },
        {
          "@type": "Thing",
          name: "LinkedIn Games",
        },
      ],
      mainEntity: {
        "@type": "ItemList",
        name: `Pinpoint #${puzzle.puzzle_number} clues`,
        numberOfItems: puzzle.normalized_puzzle.clue_count,
        itemListElement: puzzle.normalized_puzzle.clues.map((clue) => ({
          "@type": "ListItem",
          position: clue.index,
          name: clue.text,
        })),
      },
      articleBody: `The Pinpoint category answer is ${puzzle.solution.final_answer}.`,
    }),
  ];
}
