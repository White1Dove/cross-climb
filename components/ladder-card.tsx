"use client";

import { useState } from "react";
import { PuzzleData } from "@/types/puzzle";
import { LadderRow } from "./ladder-row";
import { Button } from "@/components/ui/button";

interface LadderCardProps {
  puzzle: PuzzleData;
}

export function LadderCard({ puzzle }: LadderCardProps) {
  const [revealed, setRevealed] = useState(false);

  const { rows } = puzzle.normalized_puzzle;

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 md:p-8 space-y-5">
      {/* Ladder rows */}
      <div className="space-y-5">
        {rows.map((row, idx) => (
          <LadderRow
            key={row.index}
            row={row}
            hint={puzzle.hints.medium_hints[idx] || `Starts with ${row.word[0]}`}
            revealed={revealed}
            previousWord={idx > 0 ? rows[idx - 1].word : undefined}
          />
        ))}
      </div>

      {/* Reveal button */}
      <div className="pt-4 flex flex-col gap-3">
        <Button
          onClick={() => setRevealed((current) => !current)}
          className={`w-full h-auto py-6 text-base font-semibold rounded-lg transition-all duration-[400ms] ease-out ${
            revealed
              ? "bg-[#0F6E56] text-white hover:bg-[#0F6E56]"
              : "bg-[#4A1B0C] hover:bg-[#5C2310] text-white"
          }`}
        >
          {revealed ? "Hide All Answers" : "Show All Answers"}
        </Button>
        <Button
          asChild
          className="w-full h-auto py-4 text-sm font-semibold rounded-lg bg-[#0F6E56] hover:bg-[#0D5C48] text-white"
        >
          <a
            href="https://www.linkedin.com/games/view/crossclimb/desktop"
            target="_blank"
            rel="noopener noreferrer"
          >
            Play Crossclimb on LinkedIn ↗
          </a>
        </Button>
      </div>
    </div>
  );
}
