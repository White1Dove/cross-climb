"use client";

import { useRef, useState } from "react";
import { GameTab } from "@/types/puzzle";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface GameTabsProps {
  tabs: GameTab[];
}

export function GameTabs({ tabs }: GameTabsProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openDropdown = (slug: string) => {
    clearCloseTimeout();
    setOpenSlug(slug);
  };

  const scheduleCloseDropdown = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setOpenSlug(null);
    }, 180);
  };

  return (
    <nav className="flex shrink-0 flex-wrap items-center justify-start gap-x-4 gap-y-1 sm:justify-end sm:gap-x-6" aria-label="Primary navigation">
      {tabs.map((tab) => {
        const isDropdown = Boolean(tab.children?.length);
        const isOpen = openSlug === tab.slug;

        if (isDropdown) {
          return (
            <div
              key={tab.slug}
              className="relative"
              onMouseEnter={() => openDropdown(tab.slug)}
              onMouseLeave={scheduleCloseDropdown}
              onFocus={() => openDropdown(tab.slug)}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className={`relative inline-flex items-center gap-1 whitespace-nowrap px-1 py-2 text-[15px] font-medium transition-colors ${
                  tab.active
                    ? "font-semibold text-[#4A1B0C]"
                    : "text-[#625B55] hover:text-[#1a1a2e]"
                }`}
                onClick={() => {
                  clearCloseTimeout();
                  setOpenSlug(isOpen ? null : tab.slug);
                }}
              >
                {tab.name}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                {tab.active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A1B0C]" />}
              </button>
              {isOpen && (
                <div className="absolute right-0 top-full z-50 w-56 pt-2">
                  <div
                    role="menu"
                    className="rounded-lg border border-[#E7E3DA] bg-white p-2 text-left shadow-lg"
                  >
                    {tab.children?.map((child) => (
                      <Link
                        key={child.slug}
                        href={child.href || `/${child.slug}/`}
                        role="menuitem"
                        className={`block rounded-md px-3 py-2 text-[15px] font-medium transition-colors ${
                          child.active
                            ? "bg-[#F1EFE8] text-[#4A1B0C]"
                            : "text-[#625B55] hover:bg-[#F8F6F0] hover:text-[#1a1a2e]"
                        }`}
                        onClick={() => {
                          clearCloseTimeout();
                          setOpenSlug(null);
                        }}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={tab.slug}
            href={tab.href || `/${tab.slug}/`}
            className={`relative whitespace-nowrap px-1 py-2 text-[15px] font-medium transition-colors ${
              tab.active
                ? "font-semibold text-[#4A1B0C]"
                : "text-[#625B55] hover:text-[#1a1a2e]"
            }`}
          >
            {tab.name}
            {tab.active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A1B0C]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
