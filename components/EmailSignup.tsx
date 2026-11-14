"use client";

import { useId, useState } from "react";
import { track } from "@/lib/track";
import { firstTouch, visitorId } from "@/lib/visitor-client";

type Props = {
  list: "declutter-challenge" | "vision-board";
  heading: string;
  body: string;
  button: string;
  success: string;
  as?: "h2" | "h3";
  eyebrow?: string;
  note?: string;
  source?: string; // where on the page the form sits, for analytics: "inline" or "modal"
  headingId?: string;
  tone?: "dark" | "light"; // light: the quieter mid-article version
  onDone?: () => void;
};

// Remembered so the sign-up modal stops appearing once someone has joined.
export const SIGNED_UP_KEY = "ah_signed_up";

export function EmailSignup({
  list,
  heading,
  body,
  button,
  success,
  as = "h2",
  eyebrow,
  note = "One email a day during the challenge, then occasional notes from Nancy. Unsubscribe anytime.",
  source = "inline",
  headingId,
  tone = "dark",
  onDone,
}: Props) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const id = useId();
  const H = as;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const ft = firstTouch();
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          company: form.get("company"),
          list,
          path: window.location.pathname,
          referrer: ft?.ref ?? (document.referrer || null),
          utm_source: params.get("utm_source") ?? ft?.utm_source ?? null,
          utm_medium: params.get("utm_medium") ?? ft?.utm_medium ?? null,
          utm_campaign: params.get("utm_campaign") ?? ft?.utm_campaign ?? null,
          landing: ft?.landing ?? null,
          v: visitorId(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState("done");
      try {
        localStorage.setItem(SIGNED_UP_KEY, "1");
      } catch {}
      track("signup", { list, source, path: window.location.pathname });
      onDone?.();
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section className={`signup no-print${tone === "light" ? " signup-light" : ""}`} aria-live="polite">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <H id={headingId}>{heading}</H>
      {state === "done" ? (
        <p>{success}</p>
      ) : (
        <>
          <p>{body}</p>
          <form onSubmit={onSubmit}>
            <label className="visually-hidden" htmlFor={`email-${id}`}>Email address</label>
            <input id={`email-${id}`} name="email" type="email" required autoComplete="email" placeholder="Your email" autoFocus={source !== "inline"} />
            <input name="company" type="text" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden="true" />
            <button className="btn" type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Saving..." : button}
            </button>
          </form>
          {state === "error" && <p className="note" role="alert">{message}</p>}
          <p className="note">{note}</p>
        </>
      )}
    </section>
  );
}
