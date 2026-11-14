import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase";

const LISTS = new Set(["vision-board", "declutter-challenge"]);

// Lets a signed-in person turn each email list on or off for their own address.
export async function POST(req: Request) {
  const user = await currentUser();
  const back = NextResponse.redirect(new URL("/account#emails", req.url), 303);
  if (!user?.email) return NextResponse.redirect(new URL("/account/sign-in", req.url), 303);
  const form = await req.formData();
  const list = String(form.get("list") || "");
  const on = form.get("action") === "subscribe";
  const db = supabaseAdmin();
  if (!db || !LISTS.has(list)) return back;
  const email = user.email.toLowerCase();
  if (on) {
    await db.from("subscribers").upsert({ email, list, source_path: "/account" }, { onConflict: "email,list", ignoreDuplicates: true });
    await db.from("subscribers").update({ unsubscribed_at: null }).eq("email", email).eq("list", list);
  } else {
    await db.from("subscribers").update({ unsubscribed_at: new Date().toISOString() }).eq("email", email).eq("list", list);
  }
  return back;
}
