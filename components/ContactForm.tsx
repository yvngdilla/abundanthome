"use client";

import { useEffect, useRef, useState } from "react";

const TOPICS = ["General question", "Workbook or order help", "Virtual room review", "Press or collaboration"];

export function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          email: f.get("email"),
          topic: f.get("topic"),
          message: f.get("message"),
          company: f.get("company"),
          t: started.current,
          path: window.location.pathname,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("sent");
        return;
      }
      setError(json.error || `Something went wrong. Please email ${email} directly.`);
    } catch {
      setError(`Something went wrong. Please email ${email} directly.`);
    }
    setState("error");
  }

  if (state === "sent") {
    return (
      <div className="contact-done" role="status">
        <h2>Thank you, my darling co&#8209;creator.</h2>
        <p>Your message is on its way to Nancy. You will hear back by email, usually within two business days.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="contact-row">
        <label>
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          <span>Your email</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} />
        </label>
      </div>
      <label>
        <span>What is it about?</span>
        <select name="topic" defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows={7} required maxLength={5000} />
      </label>
      {/* Hidden from people; bots fill it in. */}
      <label className="hp" aria-hidden="true">
        Company
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" className="btn btn-accent" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
      {state === "error" && (
        <p className="contact-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
