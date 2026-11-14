import type { Metadata } from "next";
import Link from "next/link";
import { getCheckout, stripeReady } from "@/lib/stripe";
import { fulfil } from "@/lib/orders";
import { pages, site } from "@/lib/site";
import { PurchaseEvent } from "@/components/PurchaseEvent";
import { currentUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const id = (await searchParams).session_id;
  let result: Awaited<ReturnType<typeof fulfil>> = null;
  let value = 0;
  if (id && /^cs_[A-Za-z0-9_]+$/.test(id) && stripeReady()) {
    try {
      const session = await getCheckout(id);
      value = (session.amount_total ?? 0) / 100;
      result = await fulfil(session); // records the order and sends the email if the webhook has not already
    } catch (err) {
      console.error("thank-you: lookup failed", err instanceof Error ? err.message : err);
    }
  }

  if (!result) {
    return (
      <section className="hero">
        <div className="wrap prose">
          <h1>We could not find that order</h1>
          <p className="lede">
            If you just paid, your receipt and download links are on their way to your inbox. If nothing arrives in a
            few minutes, reply to your Stripe receipt and Nancy will sort it out.
          </p>
          <p><Link href="/">Back to {site.name}</Link></p>
        </div>
      </section>
    );
  }

  const { product, email, links } = result;
  const user = await currentUser().catch(() => null);
  return (
    <div className={`accent-${product.accent}`}>
      <PurchaseEvent id={id!} product={product.slug} value={value} />
      <section className="hero">
        <div className="wrap prose">
          <p className="eyebrow">Thank you</p>
          <h1>{product.kind === "service" ? "Your room review is booked" : `Your ${product.name} is ready`}</h1>
          {product.kind === "service" ? (
            <>
              <p className="lede">
                Nancy is emailing you{email ? ` at ${email}` : ""} with what to send. Reply to that email with your photos,
                a rough floor plan and a sentence or two about what you want the room to support.
              </p>
              <p>If the email does not arrive in a few minutes, check your promotions or spam folder.</p>
            </>
          ) : (
            <>
              <p className="lede">Download your files below. We have also emailed these links{email ? ` to ${email}` : ""} so you can find them later.</p>
              <ul className="downloads">
                {links.map((l) => (
                  <li key={l.url}>
                    <a className="btn btn-accent" href={l.url}>Download: {l.label}</a>
                  </li>
                ))}
              </ul>
            </>
          )}
          {product.kind !== "service" && (
            <div className="note-box">
              {user ? (
                <p>{user.email?.toLowerCase() === email?.toLowerCase() ? <>This workbook is saved in <Link href="/account">your account</Link>.</> : <>You are signed in as {user.email}. To see this workbook in your account, sign in with {email}.</>}</p>
              ) : (
                <p><Link href={`/account/sign-in?next=/account`}>Sign in{email ? ` with ${email}` : ""}</Link> to keep your workbooks in one place and download them again anytime. No password needed.</p>
              )}
            </div>
          )}
          <h2>While you are here</h2>
          <ul>
            <li><Link href={pages.template.path}>Make your free vision board</Link></li>
            <li><Link href={pages.challenge.path}>Join the free 5-day declutter challenge</Link></li>
            <li><Link href="/workbooks">See all the workbooks</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
