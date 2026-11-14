import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, products, workbooks } from "@/lib/shop";
import { site } from "@/lib/site";

const title = "Workbooks From The Guide to Living in Abundance";
const description =
  "Printable workbooks by interior designer Nancy Swanton: vision boards, decluttering, defining your style and choosing color with intention.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/workbooks" },
  openGraph: { title, description, url: "/workbooks" },
};

export default function Page() {
  const rr = products["room-review"];
  return (
    <div className="accent-earth">
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">{site.tagline}</p>
          <h1>Workbooks from The Guide to Living in Abundance</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Each workbook is one part of {site.author.name}&apos;s full program, sold on its own so you can start with the
            part of your home that needs it most. Printable PDFs you can download right after checkout.
          </p>
        </div>
      </section>
      <div className="wrap">
        <div className="cards">
          {workbooks.map((w) => (
            <Link key={w.slug} className="card-link" href={`/workbooks/${w.slug}`}>
              <div className="card">
                <h3>{w.name}</h3>
                <p>{w.short}</p>
                <p className="more">{formatPrice(w.price)} · See what is inside</p>
              </div>
            </Link>
          ))}
        </div>
        <section className="section">
          <div className="callout">
            <h2 style={{ marginTop: 0 }}>Want Nancy to look at your room?</h2>
            <p>{rr.short}</p>
            <Link className="btn" href="/room-review">Virtual room review · {formatPrice(rr.price)}</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
