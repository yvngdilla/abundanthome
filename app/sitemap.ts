import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-11-13");
  return [
    { url: site.url + "/", lastModified: updated, priority: 1 },
    ...Object.values(pages).map((p) => ({ url: site.url + p.path, lastModified: updated, priority: 0.8 })),
  ];
}
