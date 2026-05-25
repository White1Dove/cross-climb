#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CURRENT_PUZZLE_PATH = path.join(ROOT, "data", "current-crossclimb.json");
const HISTORY_PATH = path.join(ROOT, "data", "crossclimb-history.json");

function usage() {
  console.error("Usage: pnpm import:crossclimb <log.json | ->");
  console.error("       Use '-' to read a copied log JSON from stdin.");
}

function readJsonInput(inputPath) {
  const raw = inputPath === "-"
    ? fs.readFileSync(0, "utf8")
    : fs.readFileSync(path.resolve(ROOT, inputPath), "utf8");
  return JSON.parse(raw);
}

function normalizeWord(value) {
  return String(value || "")
    .replace(/[^a-z]/gi, "")
    .toUpperCase();
}

function normalizeWords(values) {
  return Array.isArray(values) ? values.map(normalizeWord).filter(Boolean) : [];
}

function formatDisplayDate(value) {
  const text = String(value || "").trim();
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!isoMatch) {
    return text;
  }

  const [, year, month, day] = isoMatch;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function formatShortDate(value) {
  const text = String(value || "").trim();
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = isoMatch
    ? new Date(Date.UTC(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]), 12, 0, 0))
    : new Date(text);

  if (Number.isNaN(date.getTime())) {
    return text.replace(/,\s*\d{4}$/, "");
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function getPuzzleNumber(log) {
  const raw = log.puzzle_number || log.normalized_puzzle?.issue_number || "";
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function chooseCrossclimbLog(input) {
  const logs = Array.isArray(input) ? input : [input];
  const candidates = logs
    .filter((log) => log?.game_id === "crossclimb")
    .sort((a, b) => String(b.captured_at || "").localeCompare(String(a.captured_at || "")));

  if (candidates.length === 0) {
    throw new Error("No crossclimb log found in input.");
  }

  const valid = candidates.find((log) => log.validation?.is_valid !== false && log.status !== "conflict");
  if (!valid) {
    throw new Error("Only invalid or conflict crossclimb logs were found; refusing to publish.");
  }

  return valid;
}

function getFullLadder(log) {
  const fullLadder = normalizeWords(log.solution?.full_ladder);
  if (fullLadder.length > 0) {
    return fullLadder;
  }

  const ladder = normalizeWords(log.solution?.ladder);
  const topWord = normalizeWord(log.solution?.top_word);
  const bottomWord = normalizeWord(log.solution?.bottom_word);

  if (ladder.length === 0) {
    return [topWord, bottomWord].filter(Boolean);
  }

  const ladderAlreadyIncludesEdges = (!topWord || ladder[0] === topWord) && (!bottomWord || ladder.at(-1) === bottomWord);
  if (ladderAlreadyIncludesEdges) {
    return ladder;
  }

  return [topWord, ...ladder, bottomWord].filter(Boolean);
}

function getPosition(index, total) {
  if (index === 0) return "top";
  if (index === total - 1) return "bottom";
  return "middle";
}

function buildRows(log, fullLadder) {
  const sourceRows = Array.isArray(log.normalized_puzzle?.rows) ? log.normalized_puzzle.rows : [];
  const sourceClues = Array.isArray(log.normalized_puzzle?.clues) ? log.normalized_puzzle.clues : [];
  const finalClue = log.normalized_puzzle?.final_clue || log.raw_puzzle?.final_clue || "";

  return fullLadder.map((word, index) => {
    const sourceRow =
      sourceRows.find((row) => normalizeWord(row.word) === word) ||
      sourceRows[index] ||
      {};
    const sourceClue =
      sourceClues.find((clue) => normalizeWord(clue.word) === word) ||
      sourceClues[index] ||
      {};
    const position = sourceRow.position || getPosition(index, fullLadder.length);
    const clue = sourceRow.clue || sourceClue.text || sourceClue.clue || ((position === "top" || position === "bottom") ? finalClue : "");

    return {
      index: index + 1,
      position,
      clue,
      word,
      answer_length: word.length
    };
  });
}

function buildPuzzleData(log) {
  const fullLadder = getFullLadder(log);
  if (fullLadder.length < 2) {
    throw new Error("Crossclimb log does not contain enough ladder words.");
  }

  const rows = buildRows(log, fullLadder);
  const wordLength = fullLadder[0]?.length || Number(log.normalized_puzzle?.word_length) || 0;
  const middleLadder = fullLadder.slice(1, -1);
  const puzzleNumber = getPuzzleNumber(log);
  const puzzleDate = formatDisplayDate(log.puzzle_date);
  const missingClueRows = rows.filter((row) => !row.clue);

  if (!puzzleNumber) {
    throw new Error("Crossclimb log is missing puzzle_number; refusing to publish ambiguous content.");
  }

  if (missingClueRows.length > 0) {
    throw new Error(`Crossclimb log is missing clues for row(s): ${missingClueRows.map((row) => row.index).join(", ")}.`);
  }

  return {
    game_id: "crossclimb",
    game_name: "Crossclimb",
    puzzle_number: puzzleNumber,
    puzzle_date: puzzleDate,
    puzzle_label: log.puzzle_label || (puzzleNumber ? `Crossclimb #${puzzleNumber}` : "Crossclimb"),
    normalized_puzzle: {
      word_count: fullLadder.length,
      word_length: wordLength,
      middle_word_count: middleLadder.length,
      rows
    },
    hints: {
      no_spoiler_hints: [
        `${fullLadder.length} rows`,
        wordLength ? `${wordLength} letters each` : "Same-length words",
        `${middleLadder.length} middle words`
      ],
      medium_hints: rows.map((row) => `Starts with ${row.word[0]}`)
    },
    solution: {
      top_word: fullLadder[0],
      bottom_word: fullLadder.at(-1),
      full_ladder: fullLadder,
      middle_ladder: middleLadder
    }
  };
}

function readHistory() {
  if (!fs.existsSync(HISTORY_PATH)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
}

function updateHistory(puzzle, sourceDate) {
  const history = readHistory();
  const entry = {
    number: puzzle.puzzle_number,
    date: formatShortDate(sourceDate || puzzle.puzzle_date)
  };

  const next = [entry, ...history.filter((item) => Number(item.number) !== Number(entry.number))]
    .filter((item) => Number.isFinite(Number(item.number)) && item.number > 0)
    .sort((a, b) => Number(b.number) - Number(a.number))
    .slice(0, 30);

  fs.writeFileSync(HISTORY_PATH, `${JSON.stringify(next, null, 2)}\n`);
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    usage();
    process.exit(1);
  }

  const input = readJsonInput(inputPath);
  const log = chooseCrossclimbLog(input);
  const puzzle = buildPuzzleData(log);

  fs.writeFileSync(CURRENT_PUZZLE_PATH, `${JSON.stringify(puzzle, null, 2)}\n`);
  updateHistory(puzzle, log.puzzle_date);

  console.log(`Imported ${puzzle.puzzle_label} (${puzzle.puzzle_date}) into data/current-crossclimb.json`);
}

main();
