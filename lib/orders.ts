import { site } from "@/lib/site";
import { products, type Product } from "@/lib/shop";
import { downloadUrl } from "@/lib/sign";
import { supabaseAdmin } from "@/lib/supabase";
import type { CheckoutSession } from "@/lib/stripe";
import { deliver } from "@/lib/email/deliver";
import { workbookDelivery, roomReviewConfirmation } from "@/lib/email/content";

export type Fulfilment = {
  product: Product;
  email: string | null;
  links: { label: string; url: string }[];
};

export function linksFor(session: CheckoutSession, product: Product): { label: string; url: string }[] {
  return product.files
    .map((f) => ({ label: f.label, url: downloadUrl(site.url, session.id, product.slug, f.file) }))
    .filter((l): l is { label: string; url: string } => Boolean(l.url));
}

// Records a paid checkout and sends the order email, once. Safe to call from both the Stripe webhook and the
// thank-you page: the unique session id means only the first caller inserts the order and sends the email.
export async function fulfil(session: CheckoutSession): Promise<Fulfilment | null> {
  if (session.payment_status !== "paid") return null;
  const product = products[session.metadata?.product ?? ""];
  if (!product) return null;
  const email = session.customer_details?.email?.toLowerCase() ?? null;
  const links = linksFor(session, product);

  const db = supabaseAdmin();
  if (!db) {
    console.error("orders: Supabase env vars are missing, order not recorded", session.id);
    return { product, email, links };
  }
  const { data, error } = await db
    .from("orders")
    .upsert(
      {
        stripe_session_id: session.id,
        email,
        product: product.slug,
        amount_cents: session.amount_total,
        currency: session.currency,
      },
      { onConflict: "stripe_session_id", ignoreDuplicates: true },
    )
    .select("id");
  if (error) {
    console.error("orders: insert failed", error.message);
    return { product, email, links };
  }
  const isNew = (data?.length ?? 0) > 0;
  if (isNew && email) {
    const def = product.kind === "service" ? roomReviewConfirmation(session.id) : workbookDelivery(product.slug, product.name, links);
    const r = await deliver(email, def, { marketing: false });
    if (r.error) console.error("orders: email failed", r.error);
  }
  return { product, email, links };
}
