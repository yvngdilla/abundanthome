"use client";

// The anonymous visitor id used by first-party analytics: random, kept in this browser only.
export function visitorId(): string | null {
  try {
    let v = localStorage.getItem("ah_vid");
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem("ah_vid", v);
    }
    return v;
  } catch {
    return null;
  }
}

// True in a browser that has opened the admin: Nancy's and Colston's own visits are not counted.
export function isStaff(): boolean {
  try {
    return localStorage.getItem("ah_staff") === "1";
  } catch {
    return false;
  }
}

export function send(body: Record<string, unknown>) {
  if (isStaff()) return;
  const v = visitorId();
  if (!v) return;
  const data = JSON.stringify({ ...body, v });
  try {
    if (navigator.sendBeacon?.("/api/track", new Blob([data], { type: "text/plain" }))) return;
  } catch {}
  fetch("/api/track", { method: "POST", body: data, keepalive: true }).catch(() => {});
}

// First touch: how this visitor first arrived (referrer, UTM tags, landing page). Kept so a sign-up
// days later is still credited to the search, pin or post that brought the person here.
export type FirstTouch = { ref: string | null; utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; landing: string };

export function rememberFirstTouch(t: FirstTouch) {
  try {
    if (!localStorage.getItem("ah_ft")) localStorage.setItem("ah_ft", JSON.stringify(t));
  } catch {}
}

export function firstTouch(): FirstTouch | null {
  try {
    return JSON.parse(localStorage.getItem("ah_ft") || "null");
  } catch {
    return null;
  }
}
