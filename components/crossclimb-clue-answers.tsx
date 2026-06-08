"use client";

import type { CrossclimbClueExplanation } from "@/lib/crossclimb-analysis";
import { trackEvent } from "@/lib/analytics";

type CrossclimbClueAnswersProps = {
  items: CrossclimbClueExplanation[];
  puzzleNumber: number;
  heading?: string;
  intro?: string;
};

const positionLabels: Record<CrossclimbClueExplanation["position"], string> = {
  top: "Top rung",
  middle: "Middle rung",
  bottom: "Bottom rung",
};

function cleanFinalClue(clue: string) {
  return clue.replace(/^The top \+ bottom rows\s*=\s*/i, "").trim() || clue;
}

function getFinalPair(items: CrossclimbClueExplanation[]) {
  const top = items.find((item) => item.isFinalPairClue && item.position === "top");
  const bottom = items.find((item) => item.isFinalPairClue && item.position === "bottom");

  if (!top || !bottom) {
    return undefined;
  }

  return {
    top,
    bottom,
    clue: cleanFinalClue(top.clue || bottom.clue),
    answer: `${top.word} ${bottom.word}`,
  };
}

function trackReveal(open: boolean, puzzleNumber: number, step: number) {
  trackEvent(open ? "crossclimb_clue_reasoning_reveal" : "crossclimb_clue_reasoning_hide", {
    puzzle_number: puzzleNumber,
    step,
  });
}

export function CrossclimbClueAnswers({
  items,
  puzzleNumber,
  heading = "Today's Crossclimb Clues and Answers",
  intro,
}: CrossclimbClueAnswersProps) {
  if (items.length === 0) {
    return null;
  }

  const finalPair = getFinalPair(items);
  const finalPairSteps = new Set([finalPair?.top.step, finalPair?.bottom.step].filter(Boolean));
  const clueItems = items.filter((item) => !finalPairSteps.has(item.step));

  return (
    <section className="space-y-4" aria-labelledby="crossclimb-clue-answers-heading">
      <div className="space-y-2">
        <h2
          id="crossclimb-clue-answers-heading"
          className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]"
        >
          {heading}
        </h2>
        {intro && <p className="text-base leading-relaxed text-[#625B55]">{intro}</p>}
      </div>

      <div className="space-y-3">
        {finalPair && (
          <article className="rounded-lg border border-[#D7C8AD] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-[#854F0B]">
                Shared final clue
              </span>
              <span className="text-[13px] text-[#625B55]">Top + bottom rows</span>
            </div>
            <h3 className="mt-2 text-base font-semibold leading-relaxed text-[#1a1a2e]">{finalPair.clue}</h3>
            <details
              className="mt-3 rounded-md border border-[#E7E3DA] bg-[#F8F6F0] px-3 py-2"
              onToggle={(event) => trackReveal(event.currentTarget.open, puzzleNumber, 0)}
            >
              <summary className="cursor-pointer text-[15px] font-semibold text-[#854F0B]">
                Reveal top + bottom answer and reasoning
              </summary>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#625B55]">
                <p>
                  <span className="font-semibold text-[#1a1a2e]">Answer:</span>{" "}
                  <span className="font-[family-name:var(--font-lora)] font-bold text-[#0F6E56]">
                    {finalPair.answer}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-[#1a1a2e]">Top half:</span>{" "}
                  <span className="font-[family-name:var(--font-lora)] font-bold text-[#0F6E56]">
                    {finalPair.top.word}
                  </span>{" "}
                  - {finalPair.top.reasoningText}
                </p>
                <p>
                  <span className="font-semibold text-[#1a1a2e]">Bottom half:</span>{" "}
                  <span className="font-[family-name:var(--font-lora)] font-bold text-[#0F6E56]">
                    {finalPair.bottom.word}
                  </span>{" "}
                  - {finalPair.bottom.reasoningText}
                </p>
              </div>
            </details>
          </article>
        )}

        {clueItems.map((item) => (
          <article key={`${item.step}-${item.word}`} className="rounded-lg border border-[#E7E3DA] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-[#854F0B]">
                Ladder step {item.step}
              </span>
              <span className="text-[13px] text-[#625B55]">{positionLabels[item.position]}</span>
            </div>
            <h3 className="mt-2 text-base font-semibold leading-relaxed text-[#1a1a2e]">{item.clue}</h3>
            <details
              className="mt-3 rounded-md border border-[#E7E3DA] bg-[#F8F6F0] px-3 py-2"
              onToggle={(event) => trackReveal(event.currentTarget.open, puzzleNumber, item.step)}
            >
              <summary className="cursor-pointer text-[15px] font-semibold text-[#854F0B]">
                Reveal answer and reasoning
              </summary>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#625B55]">
                <p>
                  <span className="font-semibold text-[#1a1a2e]">Answer:</span>{" "}
                  <span className="font-[family-name:var(--font-lora)] font-bold text-[#0F6E56]">{item.word}</span>
                </p>
                <p>
                  <span className="font-semibold text-[#1a1a2e]">Why it fits:</span> {item.reasoningText}
                </p>
                {item.changeText && (
                  <p>
                    <span className="font-semibold text-[#1a1a2e]">Ladder change:</span> {item.changeText}
                  </p>
                )}
              </div>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
