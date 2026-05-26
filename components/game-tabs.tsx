"use client";

import { GameTab } from "@/types/puzzle";
import Link from "next/link";

interface GameTabsProps {
  tabs: GameTab[];
}

export function GameTabs({ tabs }: GameTabsProps) {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.slug}
          href={tab.href || `/${tab.slug}/`}
          className={`px-3 py-2 text-sm whitespace-nowrap transition-colors relative ${
            tab.active
              ? "text-[#4A1B0C] font-semibold"
              : "text-[#999] hover:text-[#1a1a2e]"
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
