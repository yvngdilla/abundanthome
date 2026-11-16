import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";
import { products } from "@/lib/shop";
import { demoRows } from "@/lib/admin/demo";

// Everything the admin dashboard shows, computed from the database in one pass.
// Days are Pacific time. Windows: the last 30 days, compared with the 30 before.

export const TZ = "America/Los_Angeles";
const DAY = 86_400_000;

export type Count = { label: string; count: number; note?: string };

export type Rows = {
  subscribers: { email: string; list: string; source_path: string | null; landing_path?: string | null; referrer: string | null; utm_source: string | null; country?: string | null; region?: string | null; device?: string | null; created_at: string; unsubscribed_at?: string | null }[];
  views: { visitor_id: string; path: string; referrer_host: string | null; utm_source: string | null; country: string | null; region: string | null; device: string | null; created_at: string; engaged?: boolean | null; automated?: boolean | null }[];
  visitors: { id: string; first_seen: string; first_referrer_host: string | null; first_utm_source: string | null }[];
  orders: { email?: string | null; product: string; amount_cents: number | null; created_at: string }[];
  downloads: { kind: string; item: string; created_at: string }[];
  accounts?: { created_at: string; email?: string | null }[];
};

export type Dashboard = {
  demo: boolean;
  missing: string[];
  days: string[]; // 30 Pacific dates, oldest first
  // People who gave us an email (subscriber, account or buyer), counted once each, like
  // Grey Market's "New Profiles": new per day plus running totals.
  growth: {
    perDay: { date: string; new: number; total: number; accounts: number; buyers: number }[];
    new30: number;
    prev30: number;
    total: number;
    accounts: number;
    buyers: number;
    viaTemplate: number;
  };
  signups: {
    perDay: { date: string; "vision-board": number; "declutter-challenge": number }[];
    lists: Count[];
    last30: number;
    prev30: number;
    total: number;
    active: number;
    byList: { list: string; label: string; total: number; last30: number }[];
    sourcePages: Count[];
    channels: Count[];
    countries: Count[];
  };
  active: {
    perDay: { date: string; new: number; returning: number }[];
    today: number;
    wau: number;
    wauPrev: number;
    mau: number;
    mauPrev: number;
    stickiness: number;
    views30: number;
    bots30: number; // browsers in the last 30 days with no confirmed (engaged) visit, left out of every count
  };
  audience: { countries: Count[]; regions: Count[]; devices: Count[]; pages: Count[]; channels: Count[] };
  shop: {
    orders30: number;
    revenue30: number;
    ordersAll: number;
    revenueAll: number;
    byProduct: { slug: string; name: string; orders: number; revenue: number; downloads: number }[];
    templateDownloads30: number;
    templateDownloadsAll: number;
    accounts: number;
    accounts30: number;
  };
};

export function pacificDate(d: Date | string | number): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(d));
}

function lastDays(n: number, now: Date): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(pacificDate(now.getTime() - i * DAY));
  return [...new Set(out)];
}

function tally(values: (string | null | undefined)[], top = 8, fallback = "Unknown"): Count[] {
  const m = new Map<string, number>();
  for (const v of values) {
    const k = v && v.trim() ? v : fallback;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  const sorted = [...m.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));
  if (sorted.length <= top) return sorted;
  const rest = sorted.slice(top - 1).reduce((s, c) => s + c.count, 0);
  return [...sorted.slice(0, top - 1), { label: "Everything else", count: rest }];
}

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|perplexity|chatgpt|openai)\./;
const SOCIAL: [RegExp, string][] = [
  [/pinterest|pin\.it/, "Pinterest"],
  [/instagram/, "Instagram"],
  [/facebook|fb\.com|fb\.me/, "Facebook"],
  [/tiktok/, "TikTok"],
  [/youtube|youtu\.be/, "YouTube"],
  [/reddit/, "Reddit"],
  [/t\.co$|twitter|x\.com/, "X"],
];

// Where someone came from, in plain words: "Google", "Pinterest", "Email", "Direct"...
export function channel(ref: string | null | undefined, utm: string | null | undefined): string {
  const u = (utm || "").toLowerCase();
  if (u) {
    if (/mail|newsletter|resend/.test(u)) return "Email";
    for (const [re, name] of SOCIAL) if (re.test(u)) return name;
    return u.charAt(0).toUpperCase() + u.slice(1);
  }
  const host = (ref || "").toLowerCase();
  if (!host) return "Direct or unknown";
  if (/chatgpt|openai|perplexity|claude|gemini|copilot/.test(host)) return "AI assistants";
  if (SEARCH.test(host) || /^(google|bing)\./.test(host)) return host.includes("bing") ? "Bing" : host.includes("duckduckgo") ? "DuckDuckGo" : "Google";
  for (const [re, name] of SOCIAL) if (re.test(host)) return name;
  if (/squarespace|abundanthomedesign/.test(host)) return "Old site";
  return host;
}

function hostOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/vision-board-ideas": "Vision board ideas",
  "/how-to-make-a-vision-board": "How to make a vision board",
  "/vision-board-template": "Vision board template",
  "/bedroom-colors": "Bedroom colors",
  "/declutter-challenge": "Declutter challenge",
  "/workbooks": "Workbooks",
  "/room-review": "Room review",
  "/thank-you": "Thank you",
};

export function pageName(path: string | null | undefined): string {
  if (!path) return "Unknown";
  const p = path.split("?")[0].replace(/\/$/, "") || "/";
  if (PAGE_NAMES[p]) return PAGE_NAMES[p];
  const wb = p.match(/^\/workbooks\/(.+)$/);
  if (wb && products[wb[1]]) return products[wb[1]].name.replace(/^The /, "");
  return p;
}

const COUNTRY = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return null;
  }
})();

function countryName(code: string | null | undefined): string | null {
  if (!code) return null;
  try {
    return COUNTRY?.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

async function fetchAll<T>(db: SupabaseClient, table: string, columns: string, since?: string): Promise<{ rows: T[]; missing: boolean }> {
  const rows: T[] = [];
  for (let from = 0; ; from += 1000) {
    let q = db.from(table).select(columns).order("created_at", { ascending: true }).range(from, from + 999);
    if (since) q = q.gte("created_at", since);
    const { data, error } = await q;
    if (error) return { rows, missing: true };
    rows.push(...((data ?? []) as T[]));
    if (!data || data.length < 1000) return { rows, missing: false };
  }
}

async function load(db: SupabaseClient, now: Date): Promise<{ rows: Rows; missing: string[] }> {
  const missing: string[] = [];
  const since = new Date(now.getTime() - 62 * DAY).toISOString();

  let subs = await fetchAll<Rows["subscribers"][number]>(db, "subscribers", "email,list,source_path,landing_path,referrer,utm_source,country,region,device,created_at,unsubscribed_at");
  if (subs.missing) {
    subs = await fetchAll(db, "subscribers", "email,list,source_path,referrer,utm_source,created_at");
    if (subs.missing) missing.push("subscribers");
    else missing.push("subscriber details (country, device, unsubscribes)");
  }
  let views = await fetchAll<Rows["views"][number]>(db, "page_views", "visitor_id,path,referrer_host,utm_source,country,region,device,created_at,engaged,automated", since);
  if (views.missing) views = await fetchAll<Rows["views"][number]>(db, "page_views", "visitor_id,path,referrer_host,utm_source,country,region,device,created_at", since);
  if (views.missing) missing.push("page_views");
  const orders = await fetchAll<Rows["orders"][number]>(db, "orders", "email,product,amount_cents,created_at");
  if (orders.missing) missing.push("orders");
  let downloads = await fetchAll<Rows["downloads"][number] & { visitor_id?: string | null }>(db, "downloads", "kind,item,visitor_id,created_at");
  if (downloads.missing) missing.push("downloads");

  // Leave out browsers that have opened the admin (Nancy's and Colston's own visits).
  const { data: staffRows } = await db.from("staff_visitors").select("id");
  const staff = new Set((staffRows ?? []).map((r: { id: string }) => r.id));
  if (staff.size) {
    views.rows = views.rows.filter((v) => !staff.has(v.visitor_id));
    downloads = { ...downloads, rows: downloads.rows.filter((d) => !d.visitor_id || !staff.has(d.visitor_id)) };
  }

  // First-seen dates for the visitors in the window, in batches.
  const ids = [...new Set(views.rows.map((v) => v.visitor_id))];
  const visitors: Rows["visitors"] = [];
  for (let i = 0; i < ids.length && !views.missing; i += 300) {
    const { data, error } = await db.from("visitors").select("id,first_seen,first_referrer_host,first_utm_source").in("id", ids.slice(i, i + 300));
    if (error) {
      missing.push("visitors");
      break;
    }
    visitors.push(...((data ?? []) as Rows["visitors"]));
  }
  // Accounts (Supabase Auth users), counted by sign-up date.
  const accounts: { created_at: string; email: string | null }[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) break;
    accounts.push(...data.users.map((u) => ({ created_at: u.created_at, email: u.email ?? null })));
    if (data.users.length < 1000) break;
  }
  // Leave out the admins' own email addresses (ADMIN_EMAILS, e.g. Nancy) from sign-ups, accounts and orders.
  const staffEmails = new Set((process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));
  const notStaff = (e: string | null | undefined) => !e || !staffEmails.has(e.toLowerCase());
  return {
    rows: {
      subscribers: subs.rows.filter((s) => notStaff(s.email)),
      views: views.rows,
      visitors,
      orders: orders.rows.filter((o) => notStaff(o.email)),
      downloads: downloads.rows,
      accounts: accounts.filter((a) => notStaff(a.email)),
    },
    missing,
  };
}

// A page load counts once the browser confirmed a real visit (engaged), and never if it reported
// being automated. Loads from before the bot filter (engaged null) still count.
const counted = (v: { engaged?: boolean | null; automated?: boolean | null }) => v.engaged !== false && !v.automated;

export function compute(rows: Rows, now: Date, demo = false, missing: string[] = []): Dashboard {
  const days = lastDays(30, now);
  const start30 = days[0];
  const today = days[days.length - 1];
  const prevStart = pacificDate(now.getTime() - 59 * DAY);
  const in30 = (d: string) => d >= start30;
  const inPrev = (d: string) => d >= prevStart && d < start30;

  // Sign-ups
  const subs = rows.subscribers.map((s) => ({ ...s, day: pacificDate(s.created_at) }));
  const perDaySub = days.map((date) => ({
    date,
    "vision-board": subs.filter((s) => s.day === date && s.list === "vision-board").length,
    "declutter-challenge": subs.filter((s) => s.day === date && s.list === "declutter-challenge").length,
  }));
  const recentSubs = subs.filter((s) => in30(s.day));
  const lists = [
    { list: "vision-board", label: "Vision board template" },
    { list: "declutter-challenge", label: "Declutter challenge" },
  ];

  // People (one per email): first time we saw them, first account, first order.
  const firstOf = (pairs: [string | null | undefined, string][]) => {
    const m = new Map<string, string>();
    pairs.forEach(([email, day], i) => {
      const k = (email || "").toLowerCase() || `#${i}`; // rows without an email still count once
      if (!m.has(k) || day < m.get(k)!) m.set(k, day);
    });
    return [...m.values()];
  };
  const accountRows = rows.accounts ?? [];
  const personDays = firstOf([
    ...subs.map((s) => [s.email, s.day] as [string, string]),
    ...accountRows.map((a) => [a.email, pacificDate(a.created_at)] as [string | null | undefined, string]),
    ...rows.orders.map((o) => [o.email, pacificDate(o.created_at)] as [string | null | undefined, string]),
  ]);
  const accountDays = accountRows.map((a) => pacificDate(a.created_at));
  const buyerDays = firstOf(rows.orders.map((o) => [o.email, pacificDate(o.created_at)]));
  const upTo = (list: string[], d: string) => list.filter((x) => x <= d).length;
  const growthPerDay = days.map((date) => ({
    date,
    new: personDays.filter((x) => x === date).length,
    total: upTo(personDays, date),
    accounts: upTo(accountDays, date),
    buyers: upTo(buyerDays, date),
  }));
  const viaTemplate = new Set(subs.filter((s) => (s.source_path || "").startsWith("/vision-board-template")).map((s) => s.email.toLowerCase())).size;

  // Visitors (bots left out: browsers with no confirmed visit)
  const allViews = rows.views.map((v) => ({ ...v, day: pacificDate(v.created_at) }));
  const views = allViews.filter(counted);
  const realIds = new Set(views.filter((v) => v.day >= start30).map((v) => v.visitor_id));
  const bots30 = new Set(allViews.filter((v) => v.day >= start30 && !realIds.has(v.visitor_id)).map((v) => v.visitor_id)).size;
  const firstSeen = new Map<string, string>();
  for (const v of rows.visitors) firstSeen.set(v.id, pacificDate(v.first_seen));
  for (const v of views) if (!firstSeen.has(v.visitor_id) || v.day < firstSeen.get(v.visitor_id)!) firstSeen.set(v.visitor_id, v.day);
  const visitorsOn = new Map<string, Set<string>>();
  for (const v of views) {
    if (!visitorsOn.has(v.day)) visitorsOn.set(v.day, new Set());
    visitorsOn.get(v.day)!.add(v.visitor_id);
  }
  const addDays = (d: string, n: number) => pacificDate(Date.parse(d + "T12:00:00Z") + n * DAY);
  const perDayActive = days.map((date) => {
    const ids = visitorsOn.get(date) ?? new Set<string>();
    let fresh = 0;
    for (const id of ids) if ((firstSeen.get(id) ?? date) > addDays(date, -7)) fresh++;
    return { date, new: fresh, returning: ids.size - fresh };
  });
  const uniqueBetween = (from: string, to: string) => new Set(views.filter((v) => v.day >= from && v.day <= to).map((v) => v.visitor_id)).size;
  const wau = uniqueBetween(addDays(today, -6), today);
  const wauPrev = uniqueBetween(addDays(today, -13), addDays(today, -7));
  const mau = uniqueBetween(start30, today);
  const mauPrev = uniqueBetween(prevStart, addDays(start30, -1));
  const avgDaily = perDayActive.reduce((s, d) => s + d.new + d.returning, 0) / days.length;
  const recentViews = views.filter((v) => in30(v.day));

  // One row per visitor in the window, for audience breakdowns (not per page view).
  const byVisitor = new Map<string, (typeof recentViews)[number]>();
  for (const v of recentViews) if (!byVisitor.has(v.visitor_id)) byVisitor.set(v.visitor_id, v);
  const firstRef = new Map(rows.visitors.map((v) => [v.id, channel(v.first_referrer_host, v.first_utm_source)]));
  const uniq = [...byVisitor.values()];

  // Shop
  const orders = rows.orders.map((o) => ({ ...o, day: pacificDate(o.created_at) }));
  const o30 = orders.filter((o) => in30(o.day));
  const dl = rows.downloads.map((d) => ({ ...d, day: pacificDate(d.created_at) }));
  const byProduct = Object.values(products).map((p) => ({
    slug: p.slug,
    name: p.name.replace(/^The /, ""),
    orders: o30.filter((o) => o.product === p.slug).length,
    revenue: o30.filter((o) => o.product === p.slug).reduce((s, o) => s + (o.amount_cents ?? 0), 0),
    downloads: dl.filter((d) => d.kind === "workbook" && d.item === p.slug && in30(d.day)).length,
  }));

  return {
    demo,
    missing,
    days,
    growth: {
      perDay: growthPerDay,
      new30: personDays.filter(in30).length,
      prev30: personDays.filter(inPrev).length,
      total: personDays.length,
      accounts: accountDays.length,
      buyers: buyerDays.length,
      viaTemplate,
    },
    signups: {
      perDay: perDaySub,
      lists: lists.map((l) => ({ label: l.label, count: recentSubs.filter((s) => s.list === l.list).length })).filter((l) => l.count > 0),
      last30: recentSubs.length,
      prev30: subs.filter((s) => inPrev(s.day)).length,
      total: subs.length,
      active: subs.filter((s) => !s.unsubscribed_at).length,
      byList: lists.map((l) => ({
        ...l,
        total: subs.filter((s) => s.list === l.list && !s.unsubscribed_at).length,
        last30: recentSubs.filter((s) => s.list === l.list).length,
      })),
      sourcePages: tally(recentSubs.map((s) => pageName(s.source_path)), 8),
      channels: tally(recentSubs.map((s) => channel(hostOf(s.referrer), s.utm_source)), 8),
      countries: tally(recentSubs.map((s) => countryName(s.country)), 6),
    },
    active: {
      perDay: perDayActive,
      today: perDayActive[perDayActive.length - 1].new + perDayActive[perDayActive.length - 1].returning,
      wau,
      wauPrev,
      mau,
      mauPrev,
      stickiness: mau ? avgDaily / mau : 0,
      views30: recentViews.length,
      bots30,
    },
    audience: {
      countries: tally(uniq.map((v) => countryName(v.country)), 8),
      regions: tally(uniq.filter((v) => v.country === "US").map((v) => v.region), 8),
      devices: tally(uniq.map((v) => (v.device ? v.device[0].toUpperCase() + v.device.slice(1) : null)), 3),
      pages: tally(recentViews.map((v) => pageName(v.path)), 10),
      channels: tally(uniq.map((v) => firstRef.get(v.visitor_id) ?? channel(v.referrer_host, v.utm_source)), 8),
    },
    shop: {
      orders30: o30.length,
      revenue30: o30.reduce((s, o) => s + (o.amount_cents ?? 0), 0),
      ordersAll: orders.length,
      revenueAll: orders.reduce((s, o) => s + (o.amount_cents ?? 0), 0),
      byProduct,
      templateDownloads30: dl.filter((d) => d.kind === "template" && in30(d.day)).length,
      templateDownloadsAll: dl.filter((d) => d.kind === "template").length,
      accounts: rows.accounts?.length ?? 0,
      accounts30: (rows.accounts ?? []).filter((a) => in30(pacificDate(a.created_at))).length,
    },
  };
}

export async function getDashboard(): Promise<Dashboard> {
  const now = new Date();
  const db = supabaseAdmin();
  if (process.env.ADMIN_DEMO === "1") return compute(demoRows(now), now, true);
  if (!db) {
    const empty: Rows = { subscribers: [], views: [], visitors: [], orders: [], downloads: [] };
    return compute(empty, now, false, ["database connection"]);
  }
  const { rows, missing } = await load(db, now);
  return compute(rows, now, false, missing);
}
