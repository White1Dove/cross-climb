"use client";

import { useState } from "react";
import { PuzzleRow } from "@/types/puzzle";
import { ChevronDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface LadderRowProps {
  row: PuzzleRow;
  hint: string;
  revealed: boolean;
  previousWord?: string;
  puzzleNumber?: number;
}

export function LadderRow({ row, hint, revealed, previousWord, puzzleNumber }: LadderRowProps) {
  const [hintOpen, setHintOpen] = useState(false);

  const positionLabel = {
    top: "TOP",
    middle: "MIDDLE",
    bottom: "BOTTOM",
  };

  const positionColor = {
    top: "bg-[#4A1B0C]/10 text-[#4A1B0C]",
    middle: "bg-[#0F6E56]/10 text-[#0F6E56]",
    bottom: "bg-[#4A1B0C]/10 text-[#4A1B0C]",
  };

  // Find the letter change from the previous word to the current word.
  const findLetterChange = () => {
    if (!previousWord || !revealed) return null;
    for (let i = 0; i < row.word.length; i++) {
      if (previousWord[i] !== row.word[i]) {
        return { from: previousWord[i], to: row.word[i], index: i };
      }
    }
    return null;
  };

  const letterChange = findLetterChange();
  const toggleHint = () => {
    const nextOpen = !hintOpen;
    setHintOpen(nextOpen);
    trackEvent(nextOpen ? "crossclimb_hint_open" : "crossclimb_hint_close", {
      puzzle_number: puzzleNumber || 0,
      step: row.index,
    });
  };

  return (
    <div className="space-y-1.5">
      {/* Line 1: Row number + Position tag + Answer word + Letter-change indicator */}
      <div className="flex items-center gap-3">
        {/* Row number */}
        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#F1EFE8] text-[#625B55] text-sm font-semibold shrink-0">
          {row.index}
        </span>

        {/* Position pill — FIXED WIDTH for alignment */}
        <span
          className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 min-w-[64px] text-center ${positionColor[row.position]}`}
        >
          {positionLabel[row.position]}
        </span>

        {/* Answer word or ?????? */}
        <span
          className={`inline-block w-[7ch] font-[family-name:var(--font-lora)] font-bold tracking-wider text-lg transition-colors duration-[400ms] ease-out ${
            revealed ? "text-[#0F6E56]" : "text-[#C4BFB6]"
          }`}
          aria-label={revealed ? row.word : "Answer hidden"}
        >
          {revealed ? row.word : "??????"}
        </span>

        <span className="ml-2 min-w-[68px] shrink-0">
          {/* Letter-change indicator — only when revealed and has a previous word */}
          {letterChange && previousWord && (
            <span className="text-xs text-[#625B55] flex items-center gap-1">
              <span className="font-medium text-[#4A1B0C]">{letterChange.from}</span>
              <span>→</span>
              <span className="font-medium text-[#0F6E56]">{letterChange.to}</span>
            </span>
          )}

          {/* Hint toggle button — only when NOT revealed */}
          {!revealed && (
            <button
              onClick={toggleHint}
              className="text-[13px] text-[#854F0B] hover:text-[#6B3F09] flex items-center gap-0.5 transition-colors shrink-0"
              aria-expanded={hintOpen}
            >
              [Hint{" "}
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${hintOpen ? "rotate-180" : ""}`}
              />
              ]
            </button>
          )}
        </span>
      </div>

      {/* Line 2: Clue text — always visible */}
      <div className="pl-0 sm:pl-[calc(1.5rem+0.75rem+64px+0.75rem)]">
        <p className="text-[#1a1a2e] leading-relaxed text-[15px] md:text-base">
          {row.clue}
        </p>
      </div>

      {/* Line 3: Hint content — keep the collapsed row in DOM so reveal/hide does not shift spacing */}
      <div className="pl-0 sm:pl-[calc(1.5rem+0.75rem+64px+0.75rem)]">
        <div
          className={`overflow-hidden transition-all duration-200 ${
            !revealed && hintOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-[15px] text-[#854F0B] italic">{hint}</p>
        </div>
      </div>
    </div>
  );
}
