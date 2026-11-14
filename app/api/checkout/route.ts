import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { products } from "@/lib/shop";
import { createCheckout, stripeReady } from "@/lib/stripe";

// Starts a Stripe Checkout for one product and returns the hosted checkout URL.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const product = products[typeof body.product === "string" ? body.product : ""];
  if (!product) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  if (!stripeReady()) {
    return NextResponse.json({ error: "Checkout opens soon. Please check back in a few days." }, { status: 503 });
  }
  const back = product.kind === "service" ? "/room-review" : `/workbooks/${product.slug}`;
  try {
    const session = await createCheckout({
      product: product.slug,
      name: product.name,
      description: product.short,
      amount: product.price,
      successUrl: `${site.url}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${site.url}${back}`,
    });
    if (!session.url) throw new Error("no checkout url");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("checkout: failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Checkout is not available right now. Please try again." }, { status: 502 });
  }
}
