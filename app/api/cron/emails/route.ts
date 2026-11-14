import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { emails, schedule, type ListName } from "@/lib/email/content";
import { deliver } from "@/lib/email/deliver";
import { sendingEnabled } from "@/lib/email/send";

// Sends the sequence emails that have come due. Vercel Cron calls this every morning (vercel.json).
// While EMAIL_SENDING_ENABLED is off it only reports what it would send.
//
// Rules: at most one email per person per run; an email more than three days overdue is skipped rather than
// sent late (so turning sending on never floods anyone with a backlog); unsubscribed people get nothing.
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const STALE = 3 * 86_400_000;
const PAGE = 1000;

type Sub = { email: string; list: ListName; created_at: string };

async function all<T>(q: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await q(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    out.push(...(data ?? []));
    if (!data || data.length < PAGE) return out;
  }
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase env vars are missing" }, { status: 503 });

  const live = sendingEnabled();
  const now = new Date();
  const started = Date.now();

  const subs = await all<Sub>((a, b) =>
    db.from("subscribers").select("email,list,created_at").is("unsubscribed_at", null).order("created_at").range(a, b),
  );
  const sends = await all<{ email: string; email_key: string }>((a, b) => db.from("email_sends").select("email,email_key").range(a, b));
  const sent = new Set(sends.map((s) => `${s.email}|${s.email_key}`));

  const report = { live, subscribers: subs.length, sent: 0, wouldSend: 0, skippedStale: 0, failed: 0, stoppedEarly: false };
  const touched = new Set<string>();

  for (const s of subs) {
    if (Date.now() - started > (maxDuration - 20) * 1000) {
      report.stoppedEarly = true;
      break;
    }
    if (touched.has(s.email)) continue;
    const pending = schedule(s.list, new Date(s.created_at), now).filter((e) => !sent.has(`${s.email}|${e.key}`) && emails[e.key]);
    if (!pending.length) continue;

    const stale = pending.filter((e) => now.getTime() - e.due > STALE);
    const next = pending.find((e) => now.getTime() - e.due <= STALE);

    if (live && stale.length) {
      await db
        .from("email_sends")
        .upsert(stale.map((e) => ({ email: s.email, email_key: e.key, list: s.list, resend_id: null })), { onConflict: "email,email_key", ignoreDuplicates: true });
    }
    report.skippedStale += stale.length;
    if (!next) continue;

    touched.add(s.email);
    if (!live) {
      report.wouldSend++;
      continue;
    }
    const r = await deliver(s.email, emails[next.key], { list: s.list, marketing: true });
    if (r.sent) report.sent++;
    else report.failed++;
    await new Promise((res) => setTimeout(res, 550)); // stay under Resend's default 2 requests per second
  }

  console.log("cron emails", JSON.stringify(report));
  return NextResponse.json(report);
}
