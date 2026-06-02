"use client";

import { useState } from "react";
import { ExternalLink, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PinpointData } from "@/types/puzzle";

interface PinpointCardProps {
  puzzle: PinpointData;
}

function maskAnswer(answer: string) {
  return answer.replace(/[A-Za-z]/g, "?");
}

export function PinpointCard({ puzzle }: PinpointCardProps) {
  const [revealed, setRevealed] = useState(false);
  const answer = puzzle.solution.final_answer;
  const revealButtonLabel = revealed ? "Hide Pinpoint Answer" : "Show Pinpoint Answer";
  const answerText = revealed ? answer : maskAnswer(answer);
  const toggleRevealed = () => setRevealed((current) => !current);

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm md:p-8">
      <div className="space-y-5">
        <Button
          onClick={toggleRevealed}
          aria-pressed={revealed}
          className={`h-auto w-full rounded-lg py-4 text-base font-semibold transition-all duration-[400ms] ease-out ${
            revealed
              ? "bg-[#0F6E56] text-white hover:bg-[#0F6E56]"
              : "bg-[#4A1B0C] text-white hover:bg-[#5C2310]"
          }`}
        >
          {revealed ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {revealButtonLabel}
        </Button>

        <div className="space-y-3">
          {puzzle.normalized_puzzle.clues.map((clue) => (
            <div key={clue.index} className="flex items-start gap-3 border-b border-[#E7E3DA] pb-3 last:border-b-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F1EFE8] text-sm font-semibold text-[#625B55]">
                {clue.index}
              </span>
              <p className="pt-0.5 text-base leading-relaxed text-[#1a1a2e]">{clue.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-[#E7E3DA] bg-[#F8F6F0] p-4">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-[#625B55]">Category answer</p>
          <p
            className={`mt-2 min-h-8 break-words font-[family-name:var(--font-lora)] text-2xl font-bold leading-snug transition-colors duration-[400ms] ease-out ${
              revealed ? "text-[#0F6E56]" : "text-[#C4BFB6]"
            }`}
            aria-label={revealed ? answer : "Answer hidden"}
          >
            {answerText}
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <Button
            onClick={toggleRevealed}
            aria-pressed={revealed}
            className={`h-auto w-full rounded-lg py-4 text-base font-semibold transition-all duration-[400ms] ease-out ${
              revealed
                ? "bg-[#0F6E56] text-white hover:bg-[#0F6E56]"
                : "bg-[#4A1B0C] text-white hover:bg-[#5C2310]"
            }`}
          >
            {revealed ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {revealButtonLabel}
          </Button>
          <Button
            asChild
            className="h-auto w-full rounded-lg bg-[#0F6E56] py-4 text-[15px] font-semibold text-white hover:bg-[#0D5C48]"
          >
            <a
              href="https://www.linkedin.com/games/view/pinpoint/desktop"
              target="_blank"
              rel="noopener noreferrer"
            >
              Play Pinpoint on LinkedIn
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
