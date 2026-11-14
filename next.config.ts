import type { NextConfig } from "next";

// Nancy's existing Squarespace site (member course, checkouts, ad landing pages) keeps running at its own address
// after abundanthomedesign.com moves to Vercel. Set LEGACY_SITE_ORIGIN to that address, for example
// https://members.abundanthomedesign.com, and every old URL below forwards there, path included.
// Defaults to the members subdomain; set LEGACY_SITE_ORIGIN to "off" to disable the redirects.
const LEGACY_RAW = process.env.LEGACY_SITE_ORIGIN ?? "https://members.abundanthomedesign.com";
const LEGACY = LEGACY_RAW === "off" ? "" : LEGACY_RAW.replace(/\/$/, "");

// Every path on the old Squarespace site that the new site does not replace (from its sitemap and page list).
const legacyPaths = [
  "/guide",
  "/guide/:path*",
  "/s/:path*",
  "/renovate-your-life",
  "/renovate-your-life-8",
  "/home-1",
  "/home-1-2",
  "/5-day-challenge",
  "/5-day-challenge-1",
  "/5-day-challenge-a",
  "/challenge-thank-you",
  "/challenge-thank-you-1",
  "/challenge-thank-you-a",
  "/the-guide-checkout",
  "/the-guide-checkout-1",
  "/the-guide-checkout-2",
  "/theguidecheckout2",
  "/guide-thank-you-1",
  "/guidesession-thankyou1",
  "/money-magnet",
  "/money-magnet-thank-you2",
  "/10-minute-money-expansion",
  "/pgs-webinar-replay",
  "/vision-board-masterclass",
  "/visionboardmasterclass",
  "/visionboard",
  "/visionboardcheckout",
  "/visionboardconfirmation",
  "/vbmasterclassconfirmation",
  "/vbmasterclassconfirmation-1",
  "/vbconfirmationaccess",
  "/masterclasses-owner",
  "/member-site-homepage-1",
  "/welcome-note",
  "/general-2",
  "/one-on-one-appointments",
  "/freeconsultation",
  "/onboarding",
  "/key-:n",
  "/manifesting",
  "/manifesting/:path*",
  "/blog-recipes",
  "/blog-recipes/:path*",
  "/create-mycjp-account-k87jsqloa",
  "/terms-of-use",
  "/cart",
  "/checkout",
  "/checkout/:path*",
  "/commerce/:path*",
  "/account",
  "/account/:path*",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Workbook PDFs are read from disk by the download route only; they are never in public/.
  outputFileTracingIncludes: { "/api/download": ["./content/guide/pdfs/**/*.pdf"] },
  async redirects() {
    if (!LEGACY) return [];
    // Temporary (307) redirects: these pages may move into the new site later.
    return legacyPaths.map((source) => ({ source, destination: LEGACY + source, permanent: false }));
  },
};

export default nextConfig;
