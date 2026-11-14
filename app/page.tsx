import Link from "next/link";
import { EmailSignup } from "@/components/EmailSignup";
import { JsonLd } from "@/components/JsonLd";
import { pages, site } from "@/lib/site";

const cards = [
  { href: pages.template.path, eyebrow: "Free tool", title: "Vision board template", text: "Add your photos and words, then download your board as a phone wallpaper or a printable page." },
  { href: pages.ideas.path, eyebrow: "Ideas", title: "40 vision board ideas", text: "What to put on your board, what form it can take, and the details a designer adds." },
  { href: pages.howTo.path, eyebrow: "Method", title: "How to make a vision board", text: "Nine steps, starting with the one most people skip: writing your vision first." },
  { href: pages.bedroomColors.path, eyebrow: "Bedroom", title: "Bedroom colors with intention", text: "Palettes for rest, love, money and creativity, feng shui color meanings, and how to test paint." },
];

export default function Home() {
  return (
    <div className="accent-wood">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", name: site.name, url: site.url, sameAs: [site.instagram, site.pinterest] },
            { "@type": "WebSite", name: site.name, url: site.url },
          ],
        }}
      />
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">{site.tagline}</p>
            <h1>Make your home part of what you are manifesting</h1>
            <p className="lede" style={{ marginTop: 16 }}>
              Interior designer Nancy Swanton brings twenty years of designing homes in Los Angeles to the way you
              manifest. Start with a vision board, then make your rooms match it.
            </p>
            <div className="btn-row">
              <Link className="btn" href={pages.template.path}>Make your vision board</Link>
              <Link className="btn btn-ghost" href={pages.ideas.path}>Get ideas</Link>
            </div>
          </div>
          <div className="arch-panel" aria-hidden="true">
            <p className="serif">Make room for what you are calling in.</p>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <p className="eyebrow">Start here</p>
          <div className="cards">
            {cards.map((c) => (
              <Link key={c.href} href={c.href} className="card-link">
                <div className="card">
                  <p className="eyebrow">{c.eyebrow}</p>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap prose">
          <h2>Why your space matters</h2>
          <p>
            You can write your goals, journal and make a vision board, then walk back into a room that tells a different
            story. Your home is the place you see more than anywhere else. When it reflects what you want next, you are
            reminded of it all day, without trying.
          </p>
          <p>
            That is the idea behind everything here: design first, with a clear reason behind every color, placement and
            object. No renovation required. Most of it works in a rental.
          </p>
          <EmailSignup
            list="declutter-challenge"
            heading="Start the year with room to grow"
            body={`Join the free 5-day declutter challenge. Fifteen minutes a day, one small space at a time, starting ${site.challengeStart}.`}
            button="Join the challenge"
            success="You are in. Watch your inbox for day one."
          />
        </div>
      </section>
    </div>
  );
}
