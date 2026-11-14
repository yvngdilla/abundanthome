import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/site";

// Built from the page list in lib/site.ts: add a page there and it appears here and in /llms.txt.
// Each page's lastModified is its own `updated` date, so change that date when the content really changes.
export default function sitemap(): MetadataRoute.Sitemap {
  const all = Object.values(pages);
  const newest = all.map((p) => p.updated).sort().at(-1) ?? "2026-11-13";
  return [
    { url: site.url + "/", lastModified: new Date(newest), changeFrequency: "weekly", priority: 1 },
    ...all.map((p) => ({
      url: site.url + p.path,
      lastModified: new Date(p.updated),
      changeFrequency: "monthly" as const,
      priority: p.priority,
    })),
    { url: site.url + "/privacy-policy", lastModified: new Date("2026-11-13"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
