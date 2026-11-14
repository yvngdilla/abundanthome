"use client";

import { useState } from "react";
import { track } from "@/lib/track";

// Starts Stripe Checkout for one product. Shows a friendly note if checkout is not switched on yet.
export function BuyButton({
  product,
  label,
  price,
  note = "Secure checkout with Stripe. Instant download after payment.",
}: {
  product: string;
  label: string;
  price: number;
  note?: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function buy() {
    setState("loading");
    track("begin_checkout", { product, value: price / 100, currency: "USD" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) {
        window.location.href = json.url;
        return;
      }
      setMessage(json.error || "Checkout is not available right now. Please try again.");
    } catch {
      setMessage("Checkout is not available right now. Please try again.");
    }
    setState("error");
  }

  return (
    <div className="buy">
      <button type="button" className="btn btn-accent" onClick={buy} disabled={state === "loading"}>
        {state === "loading" ? "Opening checkout…" : label}
      </button>
      <p className="buy-note" role="status">
        {state === "error" ? message : note}
      </p>
    </div>
  );
}
