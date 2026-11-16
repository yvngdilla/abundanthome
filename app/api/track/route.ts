import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { site } from "@/lib/site";
import { clean, device, geo, isBot, referrerHost } from "@/lib/visitor";
import { knownVisitor } from "@/lib/profiles";

// First-party page views and free downloads for the admin dashboard.
// Only production traffic is recorded; bots and Do Not Track / Global Privacy Control are skipped.
const OWN_HOST = new URL(site.url).hostname;
const VISITOR = /^[A-Za-z0-9-]{8,64}$/;

export async function POST(req: Request) {
  const ok = new NextResponse(null, { status: 204 });
  if (process.env.VERCEL_ENV !== "production" && process.env.TRACK_ALL_ENVS !== "1") return ok;
  if (isBot(req) || req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1") return ok;

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return ok;
  }
  const visitor = clean(body.v, 64);
  if (!visitor || !VISITOR.test(visitor)) return ok;
  const db = supabaseAdmin();
  if (!db) return ok;

  if (body.type === "download") {
    const item = clean(body.item, 80);
    if (item) await db.from("downloads").insert({ kind: "template", item, visitor_id: await knownVisitor(db, visitor) });
    return ok;
  }

  const key = clean(body.k, 64);

  // The page has been on screen for a few seconds, or the person interacted: count the view.
  if (body.type === "engaged") {
    if (key) {
      const { error } = await db.from("page_views").update({ engaged: true }).eq("view_key", key).eq("visitor_id", visitor).eq("engaged", false);
      if (error) console.error("track: engaged update failed", error.message);
      // A browser once marked as a bot that now behaves like a person counts as one again.
      else await db.from("visitors").update({ kind: "human" }).eq("id", visitor).eq("kind", "bot");
    }
    return ok;
  }

  const path = clean(body.path, 300);
  if (!path || !path.startsWith("/") || path.startsWith("/admin")) return ok;
  const g = geo(req);
  const dev = device(req);
  const ref = referrerHost(body.ref, OWN_HOST);
  await db.from("visitors").upsert(
    { id: visitor, first_path: path, first_referrer_host: ref, first_utm_source: clean(body.utm_source, 100), country: g.country, device: dev },
    { onConflict: "id", ignoreDuplicates: true },
  );
  if (body.auto === true) await db.from("visitors").update({ kind: "bot" }).eq("id", visitor).eq("kind", "human");
  const row = {
    visitor_id: visitor,
    path,
    referrer_host: ref,
    utm_source: clean(body.utm_source, 100),
    utm_medium: clean(body.utm_medium, 100),
    utm_campaign: clean(body.utm_campaign, 100),
    country: g.country,
    region: g.region,
    city: g.city,
    device: dev,
  };
  // New loads start unconfirmed (engaged = false) until the browser confirms the visit.
  let { error } = await db.from("page_views").insert({ ...row, view_key: key, engaged: false, automated: body.auto === true });
  if (error && /view_key|engaged|automated/.test(error.message)) ({ error } = await db.from("page_views").insert(row));
  if (error) console.error("track: insert failed", error.message);
  return ok;
}
