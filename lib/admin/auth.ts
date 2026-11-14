import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";
import { sign, verify } from "@/lib/sign";

// Admin sign-in: one shared password (ADMIN_PASSWORD in Vercel) and a signed, httpOnly session cookie
// that lasts 30 days. Needs SIGNING_SECRET too. With either unset, the admin stays locked.
export const ADMIN_COOKIE = "ah_admin";
const DAYS = 30;

export function passwordMatches(given: string): boolean {
  const want = process.env.ADMIN_PASSWORD;
  if (!want || !given) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(want).digest();
  return timingSafeEqual(a, b);
}

export function sessionToken(): string | null {
  return sign({ role: "admin", exp: Date.now() + DAYS * 86_400_000 });
}

export const sessionMaxAge = DAYS * 86_400;

export async function isAdmin(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verify<{ role: string }>(token)?.role === "admin";
}
