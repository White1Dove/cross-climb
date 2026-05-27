"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronsUp } from "lucide-react";
import type { CrossclimbHistoryEntry, CrossclimbMonthGroup } from "@/lib/crossclimb-history";

function toUtcDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`);
}

function formatFullCrossclimbDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(isoDate));
}

function formatCrossclimbLadder(entry: CrossclimbHistoryEntry) {
  return entry.ladder.join(" \u2192 ");
}

function MonthLabel({ label }: { label: string }) {
  const match = label.match(/^(.+) (\d{4})$/);

  if (!match) {
    return <>{label}</>;
  }

  return (
    <>
      {match[1]}{" "}
      <span style={{ fontVariantNumeric: "lining-nums tabular-nums" }}>{match[2]}</span>
    </>
  );
}

function ArchiveTable({ entries }: { entries: CrossclimbHistoryEntry[] }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[160px]" />
            <col className="w-[100px]" />
            <col className="w-[120px]" />
            <col className="w-[120px]" />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-[#E7E3DA] bg-[#F8F6F0]">
              <th className="px-4 py-3 text-center text-[13px] font-semibold uppercase text-[#625B55]">Date</th>
              <th className="px-4 py-3 text-center text-[13px] font-semibold uppercase text-[#625B55]">Puzzle</th>
              <th className="px-4 py-3 text-center text-[13px] font-semibold uppercase text-[#625B55]">Start</th>
              <th className="px-4 py-3 text-center text-[13px] font-semibold uppercase text-[#625B55]">End</th>
              <th className="px-4 py-3 text-center text-[13px] font-semibold uppercase text-[#625B55]">Ladder</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.number} className="border-b border-[#E7E3DA] last:border-b-0">
                <td className="whitespace-nowrap px-4 py-4 text-center text-[15px] text-[#1a1a2e] align-middle">
                  {formatFullCrossclimbDate(entry.isoDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-center text-[15px] align-middle">
                  <span className="font-medium text-[#854F0B]">
                    #{entry.number}
                  </span>
                </td>
                <td className="px-4 py-4 text-center align-middle">
                  <span className="inline-flex min-w-[64px] justify-center rounded bg-[#0F6E56]/10 px-2 py-1 font-[family-name:var(--font-lora)] text-[15px] font-bold text-[#0F6E56]">
                    {entry.start}
                  </span>
                </td>
                <td className="px-4 py-4 text-center align-middle">
                  <span className="inline-flex min-w-[64px] justify-center rounded bg-[#4A1B0C]/10 px-2 py-1 font-[family-name:var(--font-lora)] text-[15px] font-bold text-[#4A1B0C]">
                    {entry.end}
                  </span>
                </td>
                <td className="px-4 py-4 font-[family-name:var(--font-lora)] text-[15px] leading-relaxed text-[#1a1a2e] align-middle">
                  {formatCrossclimbLadder(entry)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {entries.map((entry) => (
          <div key={entry.number} className="border-b border-[#E7E3DA] px-4 py-4 last:border-b-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-[15px] text-[#625B55]">{formatFullCrossclimbDate(entry.isoDate)}</p>
                <span className="font-medium text-[#854F0B]">
                  #{entry.number}
                </span>
              </div>
              <div className="flex items-center gap-2 font-[family-name:var(--font-lora)] text-[15px] font-bold">
                <span className="rounded bg-[#0F6E56]/10 px-2 py-1 text-[#0F6E56]">{entry.start}</span>
                <span className="text-[#625B55]">→</span>
                <span className="rounded bg-[#4A1B0C]/10 px-2 py-1 text-[#4A1B0C]">{entry.end}</span>
              </div>
            </div>
            <p className="mt-3 font-[family-name:var(--font-lora)] text-base leading-relaxed text-[#1a1a2e]">
              {formatCrossclimbLadder(entry)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export function ArchiveAccordion({ monthGroups }: { monthGroups: CrossclimbMonthGroup[] }) {
  const [openMonthKey, setOpenMonthKey] = useState<string | null>(null);

  return (
    <>
      <div className="space-y-4">
        {monthGroups.map((group) => {
          const isOpen = openMonthKey === group.key;
          const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

          return (
            <details
              key={group.key}
              open={isOpen}
              className="overflow-hidden rounded-lg border border-[#E7E3DA] bg-white shadow-sm"
            >
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenMonthKey(isOpen ? null : group.key);
                }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <ChevronIcon className="h-5 w-5 shrink-0 text-[#625B55]" aria-hidden="true" />
                  <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
                    <MonthLabel label={group.label} />
                  </span>
                </span>
                <span className="shrink-0 rounded bg-[#F1EFE8] px-2 py-1 text-[13px] font-medium text-[#625B55]">
                  {group.entries.length} answers
                </span>
              </summary>
              <ArchiveTable entries={group.entries} />
            </details>
          );
        })}
      </div>

      {openMonthKey && (
        <button
          type="button"
          className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-md border border-[#E7E3DA] bg-white px-3 py-2 text-sm font-medium text-[#4A1B0C] shadow-sm transition-colors hover:bg-[#F8F6F0] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#4A1B0C]/20"
          onClick={() => setOpenMonthKey(null)}
        >
          <ChevronsUp className="h-4 w-4" aria-hidden="true" />
          Collapse
        </button>
      )}
    </>
  );
}
