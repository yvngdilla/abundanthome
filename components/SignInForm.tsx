"use client";

import { useState } from "react";
import { browserAuth } from "@/lib/auth/browser";
import { track } from "@/lib/track";

// Google, or a one-time link by email. No passwords to remember.
// Apple sign-in is built but hidden until NEXT_PUBLIC_AUTH_APPLE=1 (it needs a paid Apple Developer account).
const APPLE = process.env.NEXT_PUBLIC_AUTH_APPLE === "1";
export function SignInForm({ next }: { next: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const sb = browserAuth();
  const callback = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function oauth(provider: "google" | "apple") {
    if (!sb) return;
    track("sign_in_start", { method: provider });
    const { error } = await sb.auth.signInWithOAuth({ provider, options: { redirectTo: callback() } });
    if (error) {
      setState("error");
      setMessage(`${provider === "google" ? "Google" : "Apple"} sign-in is not available right now. Try email instead.`);
    }
  }

  async function emailLink(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setState("sending");
    track("sign_in_start", { method: "email" });
    const { error } = await sb.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: callback() } });
    if (error) {
      setState("error");
      setMessage(/rate/i.test(error.message) ? "Too many tries. Please wait a minute and try again." : "We couldn't send the link. Check the address and try again.");
      return;
    }
    setState("sent");
  }

  if (!sb) return <p className="lede">Accounts open soon.</p>;

  if (state === "sent") {
    return (
      <div className="signin-sent" role="status">
        <h2>Check your email</h2>
        <p>We sent a sign-in link to <strong>{email}</strong>. Open it on this device to finish signing in. It can take a minute, and it may land in Promotions or spam.</p>
        <button type="button" className="linklike" onClick={() => setState("idle")}>Use a different email</button>
      </div>
    );
  }

  return (
    <div className="signin">
      <button type="button" className="sso sso-google" onClick={() => oauth("google")}>
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
        Continue with Google
      </button>
{APPLE && (
        <button type="button" className="sso sso-apple" onClick={() => oauth("apple")}>
        <svg width="16" height="18" viewBox="0 0 16 19" aria-hidden="true"><path fill="currentColor" d="M13.2 10.1c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8C3.7 4.9 2.3 5.8 1.5 7.2c-1.6 2.8-.4 6.9 1.1 9.2.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.5 1.3-2.6 0 0-2.4-.9-2.4-3.8zM10.9 3.3c.6-.8 1.1-1.8 1-2.9-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.3z"/></svg>
        Continue with Apple
      </button>
      )}
      <div className="or"><span>or</span></div>
      <form onSubmit={emailLink} className="signin-email">
        <label htmlFor="signin-email">Email</label>
        <input id="signin-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <button className="btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Email me a sign-in link"}</button>
      </form>
      {state === "error" && <p className="signin-error" role="alert">{message}</p>}
      <p className="signin-note">No password needed. Use the same email you bought with, and your workbooks will be waiting in your account.</p>
    </div>
  );
}
