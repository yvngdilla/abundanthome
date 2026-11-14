import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

  const { error } = await db.from("subscribers").upsert(
    {
      email,
      list,
      source_path: clip(body.path, 300),
      referrer: clip(body.referrer, 500),
      utm_source: clip(body.utm_source, 100),
      utm_medium: clip(body.utm_medium, 100),
      utm_campaign: clip(body.utm_campaign, 100),
    },
    { onConflict: "email,list", ignoreDuplicates: true },
  );

  if (error) {
    console.error("subscribe: insert failed", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
