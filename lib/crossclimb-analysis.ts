import type { CrossclimbHistoryEntry } from "@/lib/crossclimb-history";
import type { PuzzleRow } from "@/types/puzzle";

export type CrossclimbLetterChange = {
  position: number;
  from: string;
  to: string;
};

export type CrossclimbClueExplanation = {
  step: number;
  word: string;
  clue: string;
  reasoningText: string;
  changeText?: string;
};

export function getLetterChanges(previousWord: string, currentWord: string): CrossclimbLetterChange[] {
  const maxLength = Math.max(previousWord.length, currentWord.length);
  const changes: CrossclimbLetterChange[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const from = previousWord[index] || "";
    const to = currentWord[index] || "";

    if (from !== to) {
      changes.push({
        position: index + 1,
        from,
        to,
      });
    }
  }

  return changes;
}

function formatChange(previousWord: string, currentWord: string) {
  const changes = getLetterChanges(previousWord, currentWord);

  if (changes.length === 1) {
    const change = changes[0];

    return `${previousWord} becomes ${currentWord} by changing ${change.from} to ${change.to}.`;
  }

  if (changes.length > 1) {
    const changeList = changes.map((change) => `${change.from || "blank"} to ${change.to || "blank"}`).join(", ");

    return `${previousWord} becomes ${currentWord} with these changes: ${changeList}.`;
  }

  return `${previousWord} and ${currentWord} are the same word.`;
}

export function formatStepLabel(previousWord: string, currentWord: string) {
  const changes = getLetterChanges(previousWord, currentWord);

  return changes.length > 0
    ? changes.map((change) => `${change.from} → ${change.to}`).join(", ")
    : "No letter change";
}

export function getCrossclimbClueExplanations(entry: CrossclimbHistoryEntry, rows?: PuzzleRow[]) {
  if (!rows || rows.length !== entry.ladder.length) {
    return [];
  }

  return entry.ladder
    .map<CrossclimbClueExplanation | undefined>((word, index) => {
      const row = rows[index];

      if (!row?.clue || row.word !== word) {
        return undefined;
      }

      const previousWord = entry.ladder[index - 1];
      const isFinalPairClue =
        (row.position === "top" || row.position === "bottom") && row.clue.toLowerCase().includes("top + bottom");
      const reasoningText = isFinalPairClue
        ? `The clue "${row.clue}" is solved by the top and bottom pair: ${entry.start} and ${entry.end}. ${word} is the ${row.position} rung in that pair.`
        : `The clue "${row.clue}" points to ${word}.`;

      return {
        step: index + 1,
        word,
        clue: row.clue,
        reasoningText,
        changeText: previousWord ? formatChange(previousWord, word) : undefined,
      };
    })
    .filter((item): item is CrossclimbClueExplanation => Boolean(item));
}
