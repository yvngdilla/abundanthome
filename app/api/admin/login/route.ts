import { NextResponse } from "next/server";
import { ADMIN_COOKIE, passwordMatches, sessionMaxAge, sessionToken } from "@/lib/admin/auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const ok = passwordMatches(String(form.get("password") || ""));
  const token = ok ? sessionToken() : null;
  if (!token) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return NextResponse.redirect(new URL("/admin/login?error=1", req.url), 303);
  }
  const res = NextResponse.redirect(new URL("/admin", req.url), 303);
  res.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: sessionMaxAge });
  return res;
}
