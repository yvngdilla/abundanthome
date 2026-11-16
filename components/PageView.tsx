"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { rememberFirstTouch, send } from "@/lib/visitor-client";

// Records one page view per page for the admin dashboard (first-party, no cookies, no IP).
// The load is sent right away as unconfirmed; it is confirmed ("engaged") once the page has been
// visible for 15 seconds or the person scrolls, taps or types. The dashboard only counts confirmed
// views, which leaves out scanners and link previews that load a page and leave, and bots that run
// a real browser and sit on the page for a few seconds. Browsers that report being automated are
// flagged and never confirmed.
const ENGAGED_MS = 15000;

export function PageView() {
  const pathname = usePathname();
  const params = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (first.current) {
      rememberFirstTouch({
        ref: document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer : null,
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        landing: pathname,
      });
    }
    let key = "";
    try {
      key = crypto.randomUUID();
    } catch {
      key = Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
    const automated = navigator.webdriver === true;
    send({
      type: "view",
      k: key,
      auto: automated,
      path: pathname,
      ref: first.current ? document.referrer : "",
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    });
    first.current = false;
    if (automated) return;

    let done = false;
    let visibleFor = 0;
    let since: number | null = document.visibilityState === "visible" ? performance.now() : null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const confirm = () => {
      if (done) return;
      done = true;
      cleanup();
      send({ type: "engaged", k: key, path: pathname });
    };
    const schedule = () => {
      clearTimeout(timer);
      if (since !== null) timer = setTimeout(confirm, Math.max(0, ENGAGED_MS - visibleFor));
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        since = performance.now();
      } else if (since !== null) {
        visibleFor += performance.now() - since;
        since = null;
      }
      schedule();
    };
    const onInteract = (e: Event) => {
      if (e.isTrusted) confirm();
    };
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    function cleanup() {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const ev of events) window.removeEventListener(ev, onInteract);
    }
    document.addEventListener("visibilitychange", onVisibility);
    for (const ev of events) window.addEventListener(ev, onInteract, { passive: true });
    schedule();
    return cleanup;
  }, [pathname, params]);

  return null;
}
