"use client";

import { GameTab } from "@/types/puzzle";
import Link from "next/link";

interface GameTabsProps {
  tabs: GameTab[];
}

export function GameTabs({ tabs }: GameTabsProps) {
  return (
    <nav className="flex shrink-0 items-center justify-end gap-4 sm:gap-6" aria-label="Primary navigation">
      {tabs.map((tab) => (
        <Link
          key={tab.slug}
          href={tab.href || `/${tab.slug}/`}
          className={`relative whitespace-nowrap px-1 py-2 text-[15px] font-medium transition-colors ${
            tab.active
              ? "text-[#4A1B0C] font-semibold"
              : "text-[#625B55] hover:text-[#1a1a2e]"
          }`}
        >
          {tab.name}
          {tab.active && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A1B0C]" />
          )}
        </Link>
      ))}
    </nav>
  );
}
