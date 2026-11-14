"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

type Props = {
  list: "declutter-challenge" | "vision-board";
  heading: string;
  body: string;
  button: string;
  success: string;
  as?: "h2" | "h3";
};

export function EmailSignup({ list, heading, body, button, success, as = "h2" }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const H = as;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams(window.location.search);
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
          referrer: document.referrer || null,
          utm_source: params.get("utm_source"),
          utm_medium: params.get("utm_medium"),
          utm_campaign: params.get("utm_campaign"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState("done");
      track("signup", { list, path: window.location.pathname });
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="signup no-print" aria-live="polite">
      <H>{heading}</H>
      {state === "done" ? (
        <p>{success}</p>
      ) : (
        <>
          <p>{body}</p>
          <form onSubmit={onSubmit}>
            <label className="visually-hidden" htmlFor={`email-${list}`}>Email address</label>
            <input id={`email-${list}`} name="email" type="email" required autoComplete="email" placeholder="Your email" />
            <input name="company" type="text" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden="true" />
            <button className="btn" type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Saving..." : button}
            </button>
          </form>
          {state === "error" && <p className="note" role="alert">{message}</p>}
          <p className="note">One email a day during the challenge, then occasional notes from Nancy. Unsubscribe anytime.</p>
        </>
      )}
    </section>
  );
}
