import { PuzzleData } from "@/types/puzzle";

export const mockPuzzleData: PuzzleData = {
  game_id: "crossclimb",
  game_name: "Crossclimb",
  puzzle_number: 754,
  puzzle_date: "May 24, 2026",
  puzzle_label: "Crossclimb #754",
  normalized_puzzle: {
    word_count: 7,
    word_length: 6,
    middle_word_count: 5,
    rows: [
      {
        index: 1,
        position: "top",
        clue: "The top + bottom rows = A two-word phrase for what someone who cleaned up after dinner did. Keep in mind: The first word may be at the bottom.",
        word: "WASHED",
        answer_length: 6,
      },
      {
        index: 2,
        position: "middle",
        clue: "Crushed into a soft form like some potatoes",
        word: "MASHED",
        answer_length: 6,
      },
      {
        index: 3,
        position: "middle",
        clue: "Came together as a single large group",
        word: "MASSED",
        answer_length: 6,
      },
      {
        index: 4,
        position: "middle",
        clue: "Didn't hit the target",
        word: "MISSED",
        answer_length: 6,
      },
      {
        index: 5,
        position: "middle",
        clue: "Peppered with insults, in slang",
        word: "DISSED",
        answer_length: 6,
      },
      {
        index: 6,
        position: "middle",
        clue: "Spread some gossip",
        word: "DISHED",
        answer_length: 6,
      },
      {
        index: 7,
        position: "bottom",
        clue: "The top + bottom rows = A two-word phrase for what someone who cleaned up after dinner did. Keep in mind: The first word may be at the bottom.",
        word: "DISHES",
        answer_length: 6,
      },
    ],
  },
  hints: {
    no_spoiler_hints: [
      "7 rows",
      "6 letters each",
      "5 middle words",
    ],
    medium_hints: [
      "Starts with W",
      "Starts with M",
      "Starts with M",
      "Starts with M",
      "Starts with D",
      "Starts with D",
      "Starts with D",
    ],
  },
  solution: {
    top_word: "WASHED",
    bottom_word: "DISHES",
    full_ladder: ["WASHED", "MASHED", "MASSED", "MISSED", "DISSED", "DISHED", "DISHES"],
    middle_ladder: ["MASHED", "MASSED", "MISSED", "DISSED", "DISHED"],
  },
};
