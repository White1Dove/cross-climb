export interface PuzzleRow {
  index: number;
  position: "top" | "middle" | "bottom";
  clue: string;
  word: string;
  answer_length: number;
}

export interface PuzzleData {
  game_id: string;
  game_name: string;
  puzzle_number: number;
  puzzle_date: string;
  puzzle_label: string;
  normalized_puzzle: {
    word_count: number;
    word_length: number;
    middle_word_count: number;
    rows: PuzzleRow[];
  };
  hints: {
    no_spoiler_hints: string[];
    medium_hints: string[];
  };
  solution: {
    top_word: string;
    bottom_word: string;
    full_ladder: string[];
    middle_ladder: string[];
  };
}

export interface GameTab {
  name: string;
  slug: string;
  href?: string;
  active?: boolean;
}
