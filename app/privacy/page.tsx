import type { Metadata } from "next";
import Link from "next/link";
import { SiteBrand } from "@/components/site-brand";

export const metadata: Metadata = {
  title: {
    absolute: "Privacy Policy | Puzzle Clues Today",
  },
  description:
    "Privacy policy for Puzzle Clues Today, including basic information about analytics, external links, and contact messages.",
  alternates: {
    canonical: "https://puzzleclues.today/privacy/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <header className="border-b border-[#E7E3DA] bg-white">
        <div className="mx-auto flex max-w-[720px] items-center justify-between px-4 py-3">
          <SiteBrand />
          <Link href="/" className="text-[15px] font-medium text-[#854F0B] hover:underline">
            Crossclimb Today
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-8 px-4 py-8 md:py-10">
        <section className="space-y-4">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e] md:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-base leading-relaxed text-[#625B55]">
            Puzzle Clues Today is an informational puzzle answer site. We keep the site simple and only collect
            the limited information needed to operate, understand, and improve the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Analytics
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            We use Google Analytics to understand aggregate page views, traffic sources, device types, and site
            performance. Analytics data is used to improve pages and prioritize updates.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            Contact messages
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            If you contact us, we use the information you provide only to review and respond to your message.
            Do not send sensitive personal information through correction requests.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1a1a2e]">
            External links
          </h2>
          <p className="text-base leading-relaxed text-[#625B55]">
            The site may link to third-party websites, including LinkedIn Games. Those websites have their own
            privacy practices and policies.
          </p>
        </section>
      </main>
    </div>
  );
}
