"use client";

import { GameTab } from "@/types/puzzle";
import Link from "next/link";

interface GameTabsProps {
  tabs: GameTab[];
}

export function GameTabs({ tabs }: GameTabsProps) {
  return (
    <nav className="flex max-w-full min-w-0 flex-wrap items-center justify-center gap-x-6 gap-y-1 md:gap-x-8 lg:gap-x-10">
      {tabs.map((tab) => (
        <Link
          key={tab.slug}
          href={tab.href || `/${tab.slug}/`}
          className={`relative whitespace-nowrap px-1 py-2 text-sm transition-colors ${
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
