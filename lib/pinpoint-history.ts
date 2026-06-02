import pinpointHistoryData from "@/data/pinpoint-history.json";

export type PinpointHistoryEntry = {
  number: number;
  date: string;
  isoDate: string;
  answer: string;
  clues: string[];
  analysis?: {
    category_type?: string;
    summary?: string;
    connection_to_answer?: string;
    detailed_explanation?: string;
    clue_notes?: Array<{
      clue: string;
      role: string;
      connection: string;
    }>;
  };
};

export type PinpointMonthGroup = {
  key: string;
  label: string;
  entries: PinpointHistoryEntry[];
};

function toUtcDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`);
}

const history = pinpointHistoryData as PinpointHistoryEntry[];

export function getPinpointHistory() {
  return [...history].sort((a, b) => b.isoDate.localeCompare(a.isoDate) || b.number - a.number);
}

export function getPinpointByNumber(number: number) {
  return getPinpointHistory().find((entry) => entry.number === number);
}

export function getRecentPinpointAnswers(currentPuzzleNumber: number, limit = 7) {
  return getPinpointHistory()
    .filter((entry) => entry.number !== currentPuzzleNumber)
    .slice(0, limit);
}

export function groupPinpointEntriesByMonth(entries: PinpointHistoryEntry[]) {
  const groups = new Map<string, PinpointHistoryEntry[]>();

  for (const entry of entries) {
    const key = entry.isoDate.slice(0, 7);
    groups.set(key, [...(groups.get(key) || []), entry]);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, monthEntries]) => ({
      key,
      label: new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(toUtcDate(`${key}-01`)),
      entries: monthEntries.sort((a, b) => b.isoDate.localeCompare(a.isoDate) || b.number - a.number),
    }));
}

export function formatPinpointClues(entry: PinpointHistoryEntry) {
  return entry.clues.join(", ");
}

export function buildPinpointPuzzleFromHistory(entry: PinpointHistoryEntry) {
  return {
    game_id: "pinpoint",
    game_name: "Pinpoint",
    puzzle_number: entry.number,
    puzzle_date: entry.date,
    puzzle_label: `Pinpoint #${entry.number}`,
    normalized_puzzle: {
      category: entry.answer,
      clue_count: entry.clues.length,
      clues: entry.clues.map((text, index) => ({
        index: index + 1,
        text,
      })),
    },
    hints: {
      no_spoiler_hints: [`This Pinpoint puzzle has ${entry.clues.length} clues.`],
      medium_hints: entry.clues[0] ? [`First clue: ${entry.clues[0]}`] : [],
    },
    solution: {
      final_answer: entry.answer,
    },
    ...(entry.analysis ? { analysis: entry.analysis } : {}),
  };
}
