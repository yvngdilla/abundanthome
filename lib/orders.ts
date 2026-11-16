import { site } from "@/lib/site";
import { products, type Product } from "@/lib/shop";
import { downloadUrl } from "@/lib/sign";
import { supabaseAdmin } from "@/lib/supabase";
import type { CheckoutSession } from "@/lib/stripe";
import { deliver } from "@/lib/email/deliver";
import { sendEmail } from "@/lib/email/send";
import { workbookDelivery, roomReviewConfirmation } from "@/lib/email/content";
import { ensureProfile, knownVisitor } from "@/lib/profiles";

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
  // The buyer's profile, and the browser that started the checkout (so a sale traces back to a visit).
  const visitor = await knownVisitor(db, session.metadata?.visitor);
  const profile = await ensureProfile(db, email, visitor);
  const base = {
    stripe_session_id: session.id,
    email,
    product: product.slug,
    amount_cents: session.amount_total,
    currency: session.currency,
  };
  const save = (row: object) => db.from("orders").upsert(row, { onConflict: "stripe_session_id", ignoreDuplicates: true }).select("id");
  let { data, error } = await save({ ...base, profile_id: profile, visitor_id: visitor });
  if (error && /column/i.test(error.message)) ({ data, error } = await save(base));
  if (error) {
    console.error("orders: insert failed", error.message);
    return { product, email, links };
  }
  const isNew = (data?.length ?? 0) > 0;
  if (isNew) {
    const a = await alertNancy(session, product, email);
    if (a.error) console.error("orders: new order alert failed", a.error);
  }
  if (isNew && email) {
    const def = product.kind === "service" ? roomReviewConfirmation(session.id) : workbookDelivery(product.slug, product.name, links);
    const r = await deliver(email, def, { marketing: false });
    if (r.error) console.error("orders: email failed", r.error);
  }
  return { product, email, links };
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// A short "New order" email to Nancy for every purchase, sent once (only when the order row is new).
// Reply-To is the buyer, so answering it writes to them.
async function alertNancy(session: CheckoutSession, product: Product, email: string | null) {
  const amount = session.amount_total != null ? `$${(session.amount_total / 100).toFixed(2)}` : "";
  const name = session.customer_details?.name?.trim() || "";
  const when = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" });
  const service = product.kind === "service";
  const rows: [string, string][] = [
    ["Product", product.name],
    ["Paid", amount],
    ["Buyer", [name, email].filter(Boolean).join(" · ") || "No email given"],
    ["When", `${when} Pacific`],
  ];
  const next = service
    ? "This is a room review. The buyer has been asked to reply with photos, measurements and what they want from the room. Their reply comes to your inbox; the clock starts when it arrives."
    : "The buyer already has their download links by email and on the thank-you page. Nothing to do.";
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#22313f">
<p style="margin:0 0 16px;font-size:18px"><strong>New order: ${esc(product.name)}${amount ? ` (${esc(amount)})` : ""}</strong></p>
<table style="border-collapse:collapse;margin:0 0 16px">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="margin:0 0 16px">${esc(next)}</p>
<p style="margin:0;color:#666;font-size:13px">Stripe payment: ${esc(session.id)}<br>All orders: ${esc(site.url)}/admin</p>
</div>`;
  const text = `New order: ${product.name}${amount ? ` (${amount})` : ""}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${next}\n\nStripe payment: ${session.id}\nAll orders: ${site.url}/admin`;
  return sendEmail({
    to: site.orderAlertEmail,
    subject: `New order: ${product.name}${amount ? ` (${amount})` : ""}${service ? " · action needed" : ""}`,
    html,
    text,
    replyTo: email || undefined,
    tag: "order-alert",
  });
}
