import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Only the production deployment should be indexed. Preview deployments get "disallow all".
  const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return isProd
    ? { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }], sitemap: site.url + "/sitemap.xml" }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
