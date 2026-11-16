import { createHmac, timingSafeEqual } from "node:crypto";

// A small Stripe client over the REST API (no SDK). Server only. Uses Nancy's account through
// STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET, set in Vercel.

const API = "https://api.stripe.com/v1";

export function stripeReady(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function form(data: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) if (v !== undefined) p.append(k, String(v));
  return p.toString();
}

async function call<T>(method: "GET" | "POST", path: string, data?: Record<string, string | number | undefined>): Promise<T> {
  const res = await fetch(API + path, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data ? form(data) : undefined,
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `Stripe ${res.status}`);
  return json as T;
}

export type CheckoutSession = {
  id: string;
  url: string | null;
  payment_status: string;
  status: string;
  amount_total: number | null;
  currency: string | null;
  customer_details: { email: string | null; name: string | null } | null;
  metadata: Record<string, string>;
};

export function createCheckout(opts: {
  product: string;
  name: string;
  description: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
  email?: string;
  visitor?: string;
}): Promise<CheckoutSession> {
  return call<CheckoutSession>("POST", "/checkout/sessions", {
    mode: "payment",
    "line_items[0][quantity]": 1,
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": opts.amount,
    "line_items[0][price_data][product_data][name]": opts.name,
    "line_items[0][price_data][product_data][description]": opts.description,
    "metadata[product]": opts.product,
    "metadata[visitor]": opts.visitor,
    "payment_intent_data[metadata][product]": opts.product,
    "payment_intent_data[description]": `Abundant Home: ${opts.name}`,
    customer_email: opts.email,
    customer_creation: "if_required",
    allow_promotion_codes: "true",
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
  });
}

export function getCheckout(id: string): Promise<CheckoutSession> {
  return call<CheckoutSession>("GET", `/checkout/sessions/${encodeURIComponent(id)}`);
}

// Verifies the Stripe-Signature header (scheme v1) and returns the event, or null.
export function verifyWebhook(payload: string, header: string | null): { type: string; data: { object: CheckoutSession } } | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !header) return null;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=") as [string, string]));
  const t = parts.t;
  const sigs = header.split(",").filter((kv) => kv.startsWith("v1=")).map((kv) => kv.slice(3));
  if (!t || !sigs.length) return null;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return null; // older than 5 minutes: reject
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest();
  const ok = sigs.some((s) => {
    const given = Buffer.from(s, "hex");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
  if (!ok) return null;
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}
