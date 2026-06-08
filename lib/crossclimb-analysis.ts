import type { CrossclimbHistoryEntry } from "@/lib/crossclimb-history";
import type { PuzzleData, PuzzleRow } from "@/types/puzzle";

export type CrossclimbLetterChange = {
  position: number;
  from: string;
  to: string;
};

export type CrossclimbClueExplanation = {
  step: number;
  word: string;
  clue: string;
  position: PuzzleRow["position"];
  reasoningText: string;
  changeText?: string;
  isFinalPairClue: boolean;
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

    return `${previousWord} becomes ${currentWord} by changing position ${change.position} from ${change.from} to ${change.to}.`;
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

function toIsoDate(dateLabel: string) {
  const parsed = new Date(`${dateLabel} 12:00:00 UTC`);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().slice(0, 10);
}

function firstReasoningValue(row: PuzzleRow) {
  return [row.explanation, row.why_it_fits, row.reasoning]
    .map((value) => String(value || "").replace(/\s+/g, " ").trim())
    .find(Boolean);
}

function cleanFinalCluePrefix(text: string) {
  return text.replace(/(["']?)The top \+ bottom rows\s*=\s*/gi, "$1").trim();
}

function cleanFinalClue(clue: string) {
  return cleanFinalCluePrefix(clue) || clue;
}

function formatTopBottomAnswer(entry: CrossclimbHistoryEntry) {
  return `${entry.start.toLowerCase()} ${entry.end.toLowerCase()}`;
}

function finalQuoteEnding(text: string) {
  return /[.!?]$/.test(text) ? "" : ".";
}

function formatReasoningText(row: PuzzleRow, entry: CrossclimbHistoryEntry, word: string, isFinalPairClue: boolean) {
  const suppliedReasoning = firstReasoningValue(row);

  if (suppliedReasoning) {
    return isFinalPairClue ? cleanFinalCluePrefix(suppliedReasoning) : suppliedReasoning;
  }

  if (isFinalPairClue) {
    const topBottomAnswer = formatTopBottomAnswer(entry);
    const finalClue = cleanFinalClue(row.clue);

    if (row.position === "top") {
      return `${word} is the first half of "${topBottomAnswer}", the top + bottom answer for the shared final clue: "${finalClue}"${finalQuoteEnding(finalClue)}`;
    }

    return `${word} completes "${topBottomAnswer}", so the top and bottom rungs answer the shared final clue together: "${finalClue}"${finalQuoteEnding(finalClue)}`;
  }

  return `Read the clue as a direct definition: "${row.clue}". The rung answer is ${word}; the ladder check below confirms it still connects to the neighboring word by one changed letter.`;
}

export function buildCrossclimbEntryFromPuzzle(puzzle: PuzzleData): CrossclimbHistoryEntry {
  return {
    number: puzzle.puzzle_number,
    date: puzzle.puzzle_date,
    isoDate: toIsoDate(puzzle.puzzle_date),
    start: puzzle.solution.top_word,
    end: puzzle.solution.bottom_word,
    ladder: puzzle.solution.full_ladder,
    rows: puzzle.normalized_puzzle.rows,
  };
}

export function getCrossclimbClueExplanations(entry: CrossclimbHistoryEntry, rows?: PuzzleRow[]) {
  if (!rows || rows.length !== entry.ladder.length) {
    return [];
  }

  const topClue = rows.find((row) => row.position === "top")?.clue.trim().toLowerCase();
  const bottomClue = rows.find((row) => row.position === "bottom")?.clue.trim().toLowerCase();
  const hasSharedFinalClue = Boolean(topClue && bottomClue && topClue === bottomClue);

  return entry.ladder
    .map<CrossclimbClueExplanation | undefined>((word, index) => {
      const row = rows[index];

      if (!row?.clue || row.word !== word) {
        return undefined;
      }

      const previousWord = entry.ladder[index - 1];
      const isFinalPairClue =
        (row.position === "top" || row.position === "bottom") &&
        (hasSharedFinalClue || row.clue.toLowerCase().includes("top + bottom"));
      const reasoningText = isFinalPairClue
        ? formatReasoningText(row, entry, word, true)
        : formatReasoningText(row, entry, word, false);

      return {
        step: index + 1,
        word,
        clue: row.clue,
        position: row.position,
        reasoningText,
        isFinalPairClue,
        changeText: previousWord ? formatChange(previousWord, word) : undefined,
      };
    })
    .filter((item): item is CrossclimbClueExplanation => Boolean(item));
}
