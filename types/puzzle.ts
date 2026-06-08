export interface PuzzleRow {
  index: number;
  position: "top" | "middle" | "bottom";
  clue: string;
  word: string;
  answer_length: number;
  explanation?: string;
  why_it_fits?: string;
  reasoning?: string;
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
    final_clue?: string;
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

export interface PinpointClue {
  index: number;
  text: string;
}

export interface PinpointData {
  game_id: string;
  game_name: string;
  puzzle_number: number;
  puzzle_date: string;
  puzzle_label: string;
  normalized_puzzle: {
    category: string;
    clue_count: number;
    clues: PinpointClue[];
  };
  hints: {
    no_spoiler_hints: string[];
    medium_hints: string[];
  };
  solution: {
    final_answer: string;
  };
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
}

export interface GameTab {
  name: string;
  slug: string;
  href?: string;
  active?: boolean;
  status?: "live" | "coming-soon";
  visibleInNav?: boolean;
  children?: GameTab[];
}
