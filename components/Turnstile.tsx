"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile: a bot check that is invisible for most people. It hands back a one-time
// token that Supabase verifies before it sends a sign-in email. Renders nothing unless a site key is set.
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Api = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Api;
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function Turnstile({ onToken, resetKey }: { onToken: (token: string | null) => void; resetKey: number }) {
  const box = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const cb = useRef(onToken);
  cb.current = onToken;

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    const mount = () => {
      if (cancelled || !box.current || !window.turnstile || id.current) return;
      id.current = window.turnstile.render(box.current, {
        sitekey: TURNSTILE_SITE_KEY,
        appearance: "interaction-only",
        callback: (t: string) => cb.current(t),
        "expired-callback": () => cb.current(null),
        "error-callback": () => cb.current(null),
      });
    };
    if (window.turnstile) mount();
    else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
      if (!s) {
        s = document.createElement("script");
        s.src = SRC;
        s.async = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", mount);
    }
    return () => {
      cancelled = true;
      if (id.current && window.turnstile) window.turnstile.remove(id.current);
      id.current = null;
    };
  }, []);

  // A token works once: after each attempt the parent bumps resetKey to get a fresh one.
  useEffect(() => {
    if (resetKey && id.current && window.turnstile) {
      cb.current(null);
      window.turnstile.reset(id.current);
    }
  }, [resetKey]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={box} className="turnstile" />;
}
