import crossclimbHistoryData from "@/data/crossclimb-history.json";

export type CrossclimbHistoryEntry = {
  number: number;
  date: string;
  isoDate: string;
  start: string;
  end: string;
  ladder: string[];
};

export type CrossclimbMonthGroup = {
  key: string;
  label: string;
  entries: CrossclimbHistoryEntry[];
};

const history = crossclimbHistoryData as CrossclimbHistoryEntry[];

function toUtcDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`);
}

export function getCrossclimbHistory() {
  return [...history].sort((a, b) => b.isoDate.localeCompare(a.isoDate) || b.number - a.number);
}

export function getRecentCrossclimbAnswers(currentPuzzleNumber: number, limit = 7) {
  return getCrossclimbHistory()
    .filter((entry) => entry.number !== currentPuzzleNumber)
    .slice(0, limit);
}

export function getCrossclimbByNumber(number: number) {
  return getCrossclimbHistory().find((entry) => entry.number === number);
}

export function getAvailableArchiveYears() {
  return [...new Set(getCrossclimbHistory().map((entry) => entry.isoDate.slice(0, 4)))]
    .map(Number)
    .sort((a, b) => b - a);
}

export function getCrossclimbEntriesForYear(year: number) {
  return getCrossclimbHistory().filter((entry) => Number(entry.isoDate.slice(0, 4)) === year);
}

export function groupCrossclimbEntriesByMonth(entries: CrossclimbHistoryEntry[]) {
  const groups = new Map<string, CrossclimbHistoryEntry[]>();

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

export function formatShortCrossclimbDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(isoDate));
}

export function formatFullCrossclimbDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(isoDate));
}

export function formatCrossclimbLadder(entry: CrossclimbHistoryEntry) {
  return entry.ladder.join(" \u2192 ");
}
