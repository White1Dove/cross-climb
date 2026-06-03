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

  if (normalized.startsWith("words that come before ")) {
    return "Before-word pattern";
  }

  if (normalized.startsWith("words that come after ")) {
    return "After-word pattern";
  }

  if (normalized.startsWith("names of ")) {
    return "Named set category";
  }

  if (normalized.startsWith("types of ") || normalized.startsWith("kinds of ")) {
    return "Type set category";
  }

  if (normalized.startsWith("things that are ")) {
    return "Shared property";
  }

  if (normalized.startsWith("places to find ")) {
    return "Place connection";
  }

  if (normalized.includes("words") || normalized.includes("phrases")) {
    return "Word game helper";
  }

  return "Shared category";
}

function getQuotedTarget(answer: string) {
  return answer.match(/["“](.+?)["”]/)?.[1];
}

function getAnswerTail(answer: string, prefix: RegExp) {
  return answer.replace(prefix, "").trim();
}

function getPinpointPattern(answer: string) {
  const normalized = answer.toLowerCase();

  if (normalized.startsWith("words that come before ")) {
    const target = getQuotedTarget(answer) || getAnswerTail(answer, /^words that come before\s+/i);

    return {
      connection: (clues: string[]) =>
        `Each clue can come before "${target}" to form a common word or phrase: ${joinList(clues)}.`,
      summary: `Use the fixed ending "${target}" and test each clue in front of it. The shared pattern is ${answer}.`,
      detailedExplanation: `This Pinpoint is a phrase-building puzzle. The answer is not a single object category; the connection is that every clue works before "${target}" in a familiar expression.`,
      clueConnection: (clue: string) =>
        `The clue ${clue} works before "${target}" as part of the same word or phrase pattern.`,
    };
  }

  if (normalized.startsWith("words that come after ")) {
    const target = getQuotedTarget(answer) || getAnswerTail(answer, /^words that come after\s+/i);

    return {
      connection: (clues: string[]) =>
        `Each clue can come after "${target}" to form a common word or phrase: ${joinList(clues)}.`,
      summary: `Use the fixed starter "${target}" and test each clue after it. The shared pattern is ${answer}.`,
      detailedExplanation: `This Pinpoint is a phrase-building puzzle. The answer is not a list of separate definitions; the connection is that "${target}" can pair with each clue.`,
      clueConnection: (clue: string) =>
        `The clue ${clue} works after "${target}" as part of the same word or phrase pattern.`,
    };
  }

  if (normalized.startsWith("names of ")) {
    const setName = getAnswerTail(answer, /^names of\s+/i);

    return {
      connection: (clues: string[]) => `${joinList(clues)} are all names that fit the set: ${setName}.`,
      summary: `The clues are examples from one named set. In this puzzle, that set is ${answer}.`,
      detailedExplanation: `For this Pinpoint, each clue should be read as a name from the same group. Once enough clues are visible, the shared group resolves to ${answer}.`,
      clueConnection: (clue: string) => `The clue ${clue} is one name in the shared set: ${setName}.`,
    };
  }

  if (normalized.startsWith("types of ") || normalized.startsWith("kinds of ")) {
    const setName = getAnswerTail(answer, /^(types|kinds) of\s+/i);

    return {
      connection: (clues: string[]) => `${joinList(clues)} are all types that fit the same category: ${setName}.`,
      summary: `The clues are examples of one category. The category answer is ${answer}.`,
      detailedExplanation: `This Pinpoint narrows from examples to a category label. Each clue is a type within the same group, so the answer names that group rather than any one clue.`,
      clueConnection: (clue: string) => `The clue ${clue} is one type in the category: ${setName}.`,
    };
  }

  if (normalized.startsWith("things that are ")) {
    const sharedProperty = getAnswerTail(answer, /^things that are\s+/i);

    return {
      connection: (clues: string[]) => `${joinList(clues)} all share this property: ${sharedProperty}.`,
      summary: `The clues point to items with the same property. The shared answer is ${answer}.`,
      detailedExplanation: `This Pinpoint asks for a common description. Instead of defining each clue separately, compare what the clues have in common and match that shared trait.`,
      clueConnection: (clue: string) => `The clue ${clue} fits because it can be described as ${sharedProperty}.`,
    };
  }

  if (normalized.startsWith("places to find ")) {
    const target = getAnswerTail(answer, /^places to find\s+/i);

    return {
      connection: (clues: string[]) => `${joinList(clues)} are places or contexts where you can find ${target}.`,
      summary: `The clues are locations or contexts. The shared answer is ${answer}.`,
      detailedExplanation: `This Pinpoint works by asking where the target item appears. Each clue is a place, setting, or source connected to the same thing.`,
      clueConnection: (clue: string) => `The clue ${clue} is a place or context where ${target} can appear.`,
    };
  }

  return {
    connection: (clues: string[]) => `The clue set ${joinList(clues)} points to the same category: ${answer}.`,
    summary: `This LinkedIn Pinpoint answer is ${answer}. Each clue is best read as part of one shared category, not as a separate mini-answer.`,
    detailedExplanation: `Pinpoint works by narrowing a category as each clue appears. For this puzzle, the clues all support ${answer}, so the final answer names the common set that connects the full clue list.`,
    clueConnection: (clue: string) => `The clue ${clue} supports the shared category answer: ${answer}.`,
  };
}

export function getPinpointAnalysis(puzzle: PinpointData) {
  const answer = puzzle.solution.final_answer;
  const clues = puzzle.normalized_puzzle.clues.map((clue) => clue.text);
  const pattern = getPinpointPattern(answer);
  const categoryType = puzzle.analysis?.category_type || getCategoryType(answer);
  const connection =
    puzzle.analysis?.connection_to_answer ||
    pattern.connection(clues);
  const summary =
    puzzle.analysis?.summary ||
    pattern.summary;
  const detailedExplanation =
    puzzle.analysis?.detailed_explanation ||
    pattern.detailedExplanation;
  const clueNotes =
    puzzle.analysis?.clue_notes ||
    puzzle.normalized_puzzle.clues.map((clue, index) => ({
      clue: clue.text,
      role: clueRoles[index] || "Category check",
      connection: pattern.clueConnection(clue.text),
    }));

  return {
    categoryType,
    connection,
    summary,
    detailedExplanation,
    clueNotes,
  };
}

export function getPinpointQuestionItems(puzzle: PinpointData, options: { today?: boolean } = { today: true }) {
  const answer = puzzle.solution.final_answer;
  const clues = puzzle.normalized_puzzle.clues.map((clue) => clue.text);
  const isToday = options.today !== false;

  if (!isToday) {
    return [
      {
        question: `What is the LinkedIn Pinpoint #${puzzle.puzzle_number} answer?`,
        answer: `The LinkedIn Pinpoint #${puzzle.puzzle_number} answer is ${answer} for ${puzzle.puzzle_date}.`,
      },
      {
        question: `What clues point to the Pinpoint #${puzzle.puzzle_number} answer?`,
        answer: `The clues are ${joinList(clues)}. Read together, they point to ${answer}.`,
      },
      {
        question: `How do the Pinpoint #${puzzle.puzzle_number} clues connect to the answer?`,
        answer: `The clues share one category. In this puzzle, that shared category is ${answer}.`,
      },
    ];
  }

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
