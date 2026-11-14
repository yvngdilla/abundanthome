import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { JsonLd } from "@/components/JsonLd";
import { formatPrice, workbooks, type Product } from "@/lib/shop";
import { site } from "@/lib/site";

// The shared layout for a workbook or the room review: hero with price, what is inside, who it is for, about Nancy.
export function ProductPage({ product, path, faqs, children }: { product: Product; path: string; faqs: { q: string; a: string }[]; children?: React.ReactNode }) {
  const isService = product.kind === "service";
  const buyLabel = isService ? `Book your room review · ${formatPrice(product.price)}` : `Get the workbook · ${formatPrice(product.price)}`;
  const note = isService
    ? "Secure checkout with Stripe. After payment you get an email from Nancy with what to send."
    : "Secure checkout with Stripe. Instant download after payment.";
  const others = workbooks.filter((w) => w.slug !== product.slug).slice(0, 3);

  return (
    <div className={`accent-${product.accent}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": isService ? "Service" : "Product",
              name: product.name,
              description: product.intro,
              url: site.url + path,
              brand: { "@type": "Brand", name: site.name },
              ...(isService ? { provider: { "@type": "Person", name: site.author.name } } : {}),
              offers: { "@type": "Offer", price: (product.price / 100).toFixed(2), priceCurrency: "USD", availability: "https://schema.org/InStock", url: site.url + path },
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">{isService ? "Work with Nancy" : product.key}</p>
            <h1>{product.name}</h1>
            <p className="lede" style={{ marginTop: 16 }}>{product.intro}</p>
            <p className="price">{formatPrice(product.price)}</p>
            <BuyButton product={product.slug} label={buyLabel} price={product.price} note={note} />
          </div>
          <div className="arch-panel" aria-hidden="true">
            <p className="serif">{product.short}</p>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap split split-top">
          <div>
            <h2>{isService ? "How it works" : "What is inside"}</h2>
            <ul className="check-list">
              {product.includes.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div>
            <h2>This is for you if</h2>
            <ul className="check-list">
              {product.forYou.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="prose section">
          {children}
          <h2>About {site.author.name}</h2>
          <p>{site.author.bio}</p>

          <h2>Common questions</h2>
          {faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <div className="buy-again">
            <BuyButton product={product.slug} label={buyLabel} price={product.price} note={note} />
          </div>
        </div>

        {others.length > 0 && (
          <section className="section">
            <h2>{isService ? "Prefer to do it yourself?" : "More workbooks from the Guide"}</h2>
            <div className="cards">
              {others.map((w) => (
                <Link key={w.slug} className="card-link" href={`/workbooks/${w.slug}`}>
                  <div className="card">
                    <h3>{w.name}</h3>
                    <p>{w.short}</p>
                    <p className="more">{formatPrice(w.price)} · See what is inside</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
