import { NextResponse } from "next/server";
import { verifyWebhook, type CheckoutSession } from "@/lib/stripe";
import { fulfil } from "@/lib/orders";

// Stripe calls this when a checkout is paid. In Nancy's Stripe dashboard: Developers → Webhooks → Add endpoint,
// URL https://www.abundanthomedesign.com/api/stripe/webhook, events checkout.session.completed and
// checkout.session.async_payment_succeeded. Put the endpoint's signing secret in Vercel as STRIPE_WEBHOOK_SECRET.
export async function POST(req: Request) {
  const payload = await req.text();
  const event = verifyWebhook(payload, req.headers.get("stripe-signature"));
  if (!event) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    await fulfil(event.data.object as CheckoutSession);
  }
  return NextResponse.json({ received: true });
}
