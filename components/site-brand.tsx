import Link from "next/link";

export function SiteBrand() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 whitespace-nowrap font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1a1a2e]"
      aria-label="Puzzle Clues Today home"
    >
      <img
        src="/logo.png"
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 shrink-0"
        aria-hidden="true"
      />
      <span>Puzzle Clues Today</span>
    </Link>
  );
}
