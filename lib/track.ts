"use client";

import { track as vercelTrack } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

// Sends one event to every analytics tool that is loaded: Vercel, Google Analytics and Clarity.
export function track(name: string, props: Props = {}) {
  try {
    vercelTrack(name, props);
  } catch {}
  try {
    window.gtag?.("event", name, props);
  } catch {}
  try {
    window.clarity?.("event", name);
  } catch {}
}
