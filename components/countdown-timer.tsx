"use client";

import { useState, useEffect } from "react";

const PACIFIC_TIME_ZONE = "America/Los_Angeles";

type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
};

type CountdownTimerProps = {
  puzzleName?: string;
};

const getPacificDateParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PACIFIC_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
};

const getTimeZoneOffset = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const utcTime = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return utcTime - date.getTime();
};

const getNextPacificMidnight = () => {
  const now = new Date();
  const { year, month, day } = getPacificDateParts(now);
  const targetWallTime = Date.UTC(year, month - 1, day + 1, 0, 0, 0);
  const offset = getTimeZoneOffset(new Date(targetWallTime), PACIFIC_TIME_ZONE);

  return new Date(targetWallTime - offset);
};

export function CountdownTimer({ puzzleName }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [unlockTime, setUnlockTime] = useState<string | null>(null);
  const loadingPuzzleName = puzzleName ?? "Crossclimb";
  const unlockPrefix = puzzleName ? `Next ${puzzleName} puzzle unlocks on` : "Next puzzle unlocks on";

  useEffect(() => {
    const calculateTimeLeft = () => {
      const unlockDate = getNextPacificMidnight();
      const diff = Math.max(0, unlockDate.getTime() - Date.now());

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return {
        timeLeft: { hours, minutes, seconds },
        unlockTime: new Intl.DateTimeFormat("en-US", {
          dateStyle: "full",
          timeStyle: "short",
          hour12: true,
        }).format(unlockDate),
      };
    };

    const updateCountdown = () => {
      const nextCountdown = calculateTimeLeft();
      setTimeLeft(nextCountdown.timeLeft);
      setUnlockTime(nextCountdown.unlockTime);
    };

    updateCountdown();

    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  if (!timeLeft) {
    return (
      <div className="bg-white border-b border-[#E7E3DA]">
        <div className="max-w-[720px] mx-auto px-4 py-3 text-center space-y-1">
          <p className="text-[#1a1a2e] text-[15px]">
            Next puzzle unlocks in <span className="font-semibold tabular-nums">--:--:--</span>
          </p>
          <p className="text-[#625B55] text-[13px]">
            New {loadingPuzzleName} puzzles refresh daily at midnight Pacific Time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-[#E7E3DA]">
      <div className="max-w-[720px] mx-auto px-4 py-3 text-center space-y-1">
        <p className="text-[#1a1a2e] text-[15px]">
          Next puzzle unlocks in{" "}
          <span className="font-semibold tabular-nums">
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </span>
        </p>
        {unlockTime && (
          <p className="text-[13px] text-[#625B55]">
            <span className="sm:hidden">Refreshes at midnight Pacific Time.</span>
            <span className="hidden sm:inline">
              {unlockPrefix} {unlockTime}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
