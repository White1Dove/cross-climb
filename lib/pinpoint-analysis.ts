import type { PinpointData } from "@/types/puzzle";

const clueRoles = ["Opening clue", "Pattern check", "Specific example", "Confirmation clue", "Final lock"];

function joinList(values: string[]) {
  if (values.length <= 1) {
    return values[0] || "";
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function getCategoryType(answer: string) {
  const normalized = answer.toLowerCase();

  if (normalized.startsWith("names of ")) {
    return "Named set category";
  }

  if (normalized.startsWith("types of ") || normalized.startsWith("kinds of ")) {
    return "Type set category";
  }

  if (normalized.includes("words") || normalized.includes("phrases")) {
    return "Word game helper";
  }

  return "Shared category";
}

function getClueConnection(clue: string, answer: string) {
  const normalized = answer.toLowerCase();

  if (normalized.startsWith("names of ")) {
    return `${clue} is one name that fits the shared set: ${answer}.`;
  }

  if (normalized.startsWith("types of ") || normalized.startsWith("kinds of ")) {
    return `${clue} is one example of the type set described by ${answer}.`;
  }

  return `${clue} supports the shared category answer: ${answer}.`;
}

export function getPinpointAnalysis(puzzle: PinpointData) {
  const answer = puzzle.solution.final_answer;
  const clues = puzzle.normalized_puzzle.clues.map((clue) => clue.text);
  const categoryType = puzzle.analysis?.category_type || getCategoryType(answer);
  const connection =
    puzzle.analysis?.connection_to_answer ||
    `The clue set ${joinList(clues)} points to the same category: ${answer}.`;
  const summary =
    puzzle.analysis?.summary ||
    `Today's LinkedIn Pinpoint answer is ${answer}. Each clue is best read as part of one shared category, not as a separate mini-answer.`;
  const detailedExplanation =
    puzzle.analysis?.detailed_explanation ||
    `Pinpoint works by narrowing a category as each clue appears. For puzzle #${puzzle.puzzle_number}, the clues all support ${answer}, so the final answer names the common set that connects the full clue list.`;
  const clueNotes =
    puzzle.analysis?.clue_notes ||
    puzzle.normalized_puzzle.clues.map((clue, index) => ({
      clue: clue.text,
      role: clueRoles[index] || "Category check",
      connection: getClueConnection(clue.text, answer),
    }));

  return {
    categoryType,
    connection,
    summary,
    detailedExplanation,
    clueNotes,
  };
}

export function getPinpointQuestionItems(puzzle: PinpointData) {
  const answer = puzzle.solution.final_answer;
  const clues = puzzle.normalized_puzzle.clues.map((clue) => clue.text);

  return [
    {
      question: "What is today's LinkedIn Pinpoint answer?",
      answer: `Today's LinkedIn Pinpoint answer is ${answer} for puzzle #${puzzle.puzzle_number}.`,
    },
    {
      question: "What clues point to today's Pinpoint answer?",
      answer: `The clues are ${joinList(clues)}. Read together, they point to ${answer}.`,
    },
    {
      question: "How do the Pinpoint clues connect to the answer?",
      answer: `The clues share one category. In this puzzle, that shared category is ${answer}.`,
    },
  ];
}
