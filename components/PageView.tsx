"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { rememberFirstTouch, send } from "@/lib/visitor-client";

// Records one page view per page for the admin dashboard (first-party, no cookies, no IP).
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
    send({
      type: "view",
      path: pathname,
      ref: first.current ? document.referrer : "",
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    });
    first.current = false;
  }, [pathname, params]);

  return null;
}
