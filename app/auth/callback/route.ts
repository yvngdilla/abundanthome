import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { authClient } from "@/lib/auth/server";
import { safeNext } from "@/lib/auth/config";

// Where Google, Apple and the email sign-in link send people back to. Finishes sign-in, then redirects.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = safeNext(url.searchParams.get("next"));
  const fail = (msg: string) => NextResponse.redirect(new URL(`/account/sign-in?error=${encodeURIComponent(msg)}&next=${encodeURIComponent(next)}`, url.origin));
  const sb = await authClient();
  if (!sb) return fail("Sign-in is not set up yet.");

  const providerError = url.searchParams.get("error_description");
  if (providerError) return fail(providerError);

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const { error } = code
    ? await sb.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await sb.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("missing code") };
  if (error) return fail("That sign-in link has expired or was already used. Please try again.");
  return NextResponse.redirect(new URL(next, url.origin));
}
