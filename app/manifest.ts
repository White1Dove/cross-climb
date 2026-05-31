import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Puzzle Clues Today",
    short_name: "Puzzle Clues",
    description: "Daily LinkedIn Crossclimb answers, clues, hints, and full word ladder solutions.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F1EFE8",
    theme_color: "#F1EFE8",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
