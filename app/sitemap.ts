import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/site";
import { workbooks } from "@/lib/shop";

// Built from the page list in lib/site.ts: add a page there and it appears here and in /llms.txt.
// Each page's lastModified is its own `updated` date, so change that date when the content really changes.
const SHOP_UPDATED = "2026-11-14";

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
    { url: site.url + "/workbooks", lastModified: new Date(SHOP_UPDATED), changeFrequency: "monthly", priority: 0.6 },
    ...workbooks.map((w) => ({
      url: `${site.url}/workbooks/${w.slug}`,
      lastModified: new Date(SHOP_UPDATED),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: site.url + "/room-review", lastModified: new Date(SHOP_UPDATED), changeFrequency: "monthly", priority: 0.6 },
    { url: site.url + "/contact", lastModified: new Date(SHOP_UPDATED), changeFrequency: "yearly", priority: 0.4 },
    { url: site.url + "/privacy-policy", lastModified: new Date("2026-11-13"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
