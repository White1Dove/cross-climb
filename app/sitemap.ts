import type { MetadataRoute } from "next";
import { getCrossclimbHistory } from "@/lib/crossclimb-history";
import { getPinpointHistory } from "@/lib/pinpoint-history";
import { getCrossclimbAnswerPath, getPinpointAnswerPath } from "@/lib/routes";

const baseUrl = "https://puzzleclues.today";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const crossclimbEntries = getCrossclimbHistory();
  const pinpointEntries = getPinpointHistory();

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/crossclimb/archive/`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...crossclimbEntries.map((entry) => ({
      url: `${baseUrl}${getCrossclimbAnswerPath(entry.number)}`,
      lastModified: new Date(`${entry.isoDate}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    {
      url: `${baseUrl}/pinpoint/`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pinpoint/archive/`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...pinpointEntries.map((entry) => ({
      url: `${baseUrl}${getPinpointAnswerPath(entry.number)}`,
      lastModified: new Date(`${entry.isoDate}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    {
      url: `${baseUrl}/answers/`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
