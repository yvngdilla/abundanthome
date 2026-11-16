import { NextResponse, after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { emails, welcomeKey, type ListName } from "@/lib/email/content";
import { device, geo } from "@/lib/visitor";
import { deliver } from "@/lib/email/deliver";
import { ensureProfile, knownVisitor } from "@/lib/profiles";

const LISTS = new Set(["declutter-challenge", "vision-board"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clip(v: unknown, n: number): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field.
  if (clip(body.company, 200)) return NextResponse.json({ ok: true });

  const email = clip(body.email, 254)?.toLowerCase();
  const list = clip(body.list, 40);
  if (!email || !EMAIL.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!list || !LISTS.has(list)) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const db = supabaseAdmin();
  if (!db) {
    console.error("subscribe: Supabase env vars are missing");
    return NextResponse.json({ error: "Sign-ups are not open yet. Please try again soon." }, { status: 503 });
  }

  const base = {
    email,
    list,
    source_path: clip(body.path, 300),
    referrer: clip(body.referrer, 500),
    utm_source: clip(body.utm_source, 100),
    utm_medium: clip(body.utm_medium, 100),
    utm_campaign: clip(body.utm_campaign, 100),
  };
  // Analytics columns come from a later migration; until it is applied, save the sign-up without them.
  const visitor = await knownVisitor(db, clip(body.v, 64));
  const profile = await ensureProfile(db, email, visitor);
  const extra = { ...geo(req), device: device(req), visitor_id: visitor, profile_id: profile, landing_path: clip(body.landing, 300) };
  const save = (row: object) => db.from("subscribers").upsert(row, { onConflict: "email,list", ignoreDuplicates: true }).select("id");
  let { data, error } = await save({ ...base, ...extra });
  if (error && /column/i.test(error.message)) ({ data, error } = await save(base));

  if (error) {
    console.error("subscribe: insert failed", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // New on this list: send the welcome email after the response, so the form never waits on it.
  // (A repeat sign-up returns no row and gets nothing.)
  if (data?.length) {
    const welcome = emails[welcomeKey(list as ListName, new Date())];
    after(async () => {
      const r = await deliver(email, welcome, { list, marketing: true });
      if (r.error) console.error("subscribe: welcome email failed", r.error);
    });
  } else {
    // Someone who unsubscribed and signs up again is back on the list.
    await db.from("subscribers").update({ unsubscribed_at: null }).eq("email", email).eq("list", list).not("unsubscribed_at", "is", null);
  }
  return NextResponse.json({ ok: true });
}
