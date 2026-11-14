import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase";

// Marks the current browser's anonymous visitor id as staff, so its visits are left out of the dashboard.
// Called from the admin page; only a signed-in admin can mark a browser.
const VISITOR = /^[A-Za-z0-9-]{8,64}$/;

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const id = typeof body.v === "string" ? body.v : "";
  if (!VISITOR.test(id)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ ok: false });
  const { error } = await db.from("staff_visitors").upsert({ id }, { onConflict: "id", ignoreDuplicates: true });
  if (error) console.error("staff: upsert failed", error.message);
  return NextResponse.json({ ok: !error });
}
