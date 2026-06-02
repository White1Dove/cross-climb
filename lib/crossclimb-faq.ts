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
      question: "What is today's LinkedIn Crossclimb answer?",
      answer: `Today's Crossclimb answer for puzzle #${puzzle.puzzle_number} is the full ladder ${ladder}. The ladder runs from ${topWord} to ${bottomWord}, with one letter changing at each step.`,
    },
    {
      question: "What are today's Crossclimb start and end words?",
      answer: `Today's Crossclimb puzzle starts at ${topWord} and ends at ${bottomWord}. The full ladder connects those words by changing one letter at each step: ${ladder}.`,
    },
    {
      question: "Where can I find previous LinkedIn Crossclimb answers?",
      answer: "Use the LinkedIn Crossclimb Answer History section on this page or open the full archive for older puzzle numbers and word ladders.",
    },
  ];
}
