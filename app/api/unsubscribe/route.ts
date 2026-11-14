import { verify } from "@/lib/sign";
import { supabaseAdmin } from "@/lib/supabase";
import { site } from "@/lib/site";

// Unsubscribe links in every marketing email. GET shows a confirm button (so link scanners in inboxes cannot
// unsubscribe people by opening the link); POST unsubscribes, and is also the one-click unsubscribe that
// Gmail and Apple Mail send (List-Unsubscribe-Post).
export const dynamic = "force-dynamic";

async function unsubscribe(token: string | null): Promise<boolean> {
  const data = verify<{ e: string }>(token);
  if (!data?.e) return false;
  const db = supabaseAdmin();
  if (!db) return false;
  const { error } = await db
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", data.e)
    .is("unsubscribed_at", null);
  if (error) console.error("unsubscribe: update failed", error.message);
  return !error;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function page(state: "confirm" | "done" | "bad", token = ""): Response {
  const title = { confirm: "Unsubscribe from Abundant Home?", done: "You are unsubscribed", bad: "That link did not work" }[state];
  const body = {
    confirm: `You will stop getting emails from Nancy, including the declutter challenge.</p>
<form method="post" action="/api/unsubscribe?t=${esc(token)}"><button type="submit" style="font:inherit;font-weight:bold;background:#23313f;color:#f6f2ea;border:0;border-radius:4px;padding:14px 24px;cursor:pointer">Unsubscribe</button></form><p>`,
    done: "You will not get any more emails from Abundant Home. If this was a mistake, you can sign up again anytime on the site.",
    bad: "Please reply to any email from Nancy and she will take you off the list by hand.",
  }[state];
  const ok = state !== "bad";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} · Abundant Home</title></head>
<body style="margin:0;background:#f6f2ea;color:#23313f;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;line-height:1.6">
<main style="max-width:520px;margin:12vh auto;padding:0 24px">
<img src="/brand/ah-monogram-water.png" width="68" height="30" alt="Abundant Home">
<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:2rem;margin:32px 0 12px">${title}</h1>
<p>${body}</p>
<p><a href="${site.url}" style="color:#23313f">Back to Abundant Home</a></p>
</main></body></html>`;
  return new Response(html, { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t");
  return verify<{ e: string }>(t) ? page("confirm", t ?? "") : page("bad");
}

export async function POST(req: Request) {
  const ok = await unsubscribe(new URL(req.url).searchParams.get("t"));
  return page(ok ? "done" : "bad");
}
