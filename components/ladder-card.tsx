"use client";

import { useState } from "react";
import { PuzzleData } from "@/types/puzzle";
import { LadderRow } from "./ladder-row";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface LadderCardProps {
  puzzle: PuzzleData;
}

export function LadderCard({ puzzle }: LadderCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const { rows } = puzzle.normalized_puzzle;
  const fullLadderText = puzzle.solution.full_ladder.join(" \u2192 ");
  const revealButtonLabel = revealed ? "Hide All Answers" : "Show All Answers";
  const revealButtonClassName = `w-full h-auto py-4 text-base font-semibold rounded-lg transition-all duration-[400ms] ease-out ${
    revealed
      ? "bg-[#0F6E56] text-white hover:bg-[#0F6E56]"
      : "bg-[#4A1B0C] hover:bg-[#5C2310] text-white"
  }`;
  const toggleRevealed = () => {
    setRevealed((current) => {
      const nextRevealed = !current;

      trackEvent(nextRevealed ? "crossclimb_reveal_all_answers" : "crossclimb_hide_all_answers", {
        puzzle_number: puzzle.puzzle_number,
      });

      return nextRevealed;
    });
  };
  const copyFullLadder = async () => {
    try {
      await navigator.clipboard.writeText(fullLadderText);
      setCopied(true);
      trackEvent("crossclimb_copy_ladder", {
        puzzle_number: puzzle.puzzle_number,
      });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 md:p-8 space-y-5">
      <Button
        onClick={toggleRevealed}
        aria-pressed={revealed}
        className={revealButtonClassName}
      >
        {revealButtonLabel}
      </Button>

      {/* Ladder rows */}
      <div className="space-y-5">
        {rows.map((row, idx) => (
          <LadderRow
            key={row.index}
            row={row}
            hint={puzzle.hints.medium_hints[idx] || `Starts with ${row.word[0]}`}
            revealed={revealed}
            previousWord={idx > 0 ? rows[idx - 1].word : undefined}
            puzzleNumber={puzzle.puzzle_number}
          />
        ))}
      </div>

      {/* Reveal button */}
      <div className="pt-4 flex flex-col gap-3">
        <Button
          onClick={toggleRevealed}
          aria-pressed={revealed}
          className={revealButtonClassName}
        >
          {revealButtonLabel}
        </Button>
        <Button
          onClick={copyFullLadder}
          className="w-full h-auto py-4 text-[15px] font-semibold rounded-lg border border-[#854F0B]/45 bg-white text-[#854F0B] hover:border-[#854F0B] hover:bg-[#F8F6F0]"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied Full Ladder" : "Copy Full Ladder"}
        </Button>
        <Button
          asChild
          className="w-full h-auto py-4 text-[15px] font-semibold rounded-lg bg-[#0F6E56] hover:bg-[#0D5C48] text-white"
        >
          <a
            href="https://www.linkedin.com/games/view/crossclimb/desktop"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("crossclimb_play_link_click", {
                puzzle_number: puzzle.puzzle_number,
              })
            }
          >
            Play Crossclimb on LinkedIn
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
