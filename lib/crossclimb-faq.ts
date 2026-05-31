import type { PuzzleData } from "@/types/puzzle";

export type CrossclimbFaqItem = {
  question: string;
  answer: string;
};

export function getCrossclimbFaqItems(puzzle: PuzzleData): CrossclimbFaqItem[] {
  const topWord = puzzle.solution.top_word;
  const bottomWord = puzzle.solution.bottom_word;
  const ladder = puzzle.solution.full_ladder.join(" -> ");

  return [
    {
      question: "What is the Crossclimb today answer?",
      answer: `Today's Crossclimb answer for puzzle #${puzzle.puzzle_number} is the full ladder ${ladder}. The ladder runs from ${topWord} to ${bottomWord}, with one letter changing at each step.`,
    },
    {
      question: "Where can I find Crossclimb answers today?",
      answer: "This page is updated daily with the latest Crossclimb clues, hints, and full solution. It also links to recent answers and the LinkedIn Crossclimb answer archive for older puzzles.",
    },
    {
      question: "When does Crossclimb today update?",
      answer: "New Crossclimb puzzles refresh daily at midnight Pacific Time. This page is updated after the new LinkedIn Games puzzle is available and checked.",
    },
    {
      question: "Is Crossclimb the same as cross climb?",
      answer: "Players sometimes search for cross climb today, but the LinkedIn Games puzzle name is Crossclimb. This page covers the daily Crossclimb puzzle answer and clues.",
    },
  ];
}
