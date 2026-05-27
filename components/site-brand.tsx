import Link from "next/link";
import Image from "next/image";

export function SiteBrand() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 whitespace-nowrap font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1a1a2e]"
      aria-label="Puzzle Clues Today home"
    >
      <Image
        src="/android-chrome-192x192.png"
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 shrink-0"
        aria-hidden="true"
        priority
        unoptimized
      />
      <span>Puzzle Clues Today</span>
    </Link>
  );
}
