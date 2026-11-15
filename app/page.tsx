import Link from "next/link";
import { EmailSignup } from "@/components/EmailSignup";
import { JsonLd } from "@/components/JsonLd";
import { pages, site } from "@/lib/site";

const steps = [
  {
    href: pages.howTo.path,
    title: "Write your vision",
    text: "The step most people skip. Describe the life you want in words first, so your board has something to say.",
    more: "How to make a vision board",
  },
  {
    href: pages.template.path,
    title: "Make your board",
    text: "Turn the words into pictures with the free template, then put the board where you will see it every day.",
    more: "Open the free template",
  },
  {
    href: pages.bedroomColors.path,
    title: "Make your room match",
    text: "Bring the board into the room itself, starting with color in the place you wake up every morning.",
    more: "Bedroom colors with intention",
  },
];

const keys = [
  { title: "Build the foundation", text: "Quiet the monkey mind and find your personal guidance system." },
  { title: "Send a clear message", text: "Your new-life script, your vision board and your style." },
  { title: "Reality check", text: "See your home as it is, purge with purpose, store with care." },
  { title: "Energy flow", text: "Focal points, floor and furniture plans, and lighting." },
  { title: "Color, pattern, texture", text: "The palette that tells your story." },
  { title: "Windows to walls", text: "Paint, wallpaper, window treatments, rugs and fabrics." },
  { title: "Details", text: "Artwork, accessories, plants and florals." },
  { title: "Sensory", text: "Aroma, music and food: a home that feels like the life you want." },
];

const reads = [
  { href: pages.ideas.path, eyebrow: "Vision boards", title: "40 vision board ideas", text: "What to put on your board, what form it can take, and the details a designer adds." },
  { href: pages.howTo.path, eyebrow: "Vision boards", title: "How to make a vision board in 9 steps", text: "A designer's method, from writing your vision to hanging the finished board." },
  { href: pages.bedroomColors.path, eyebrow: "Bedroom", title: "Bedroom colors with intention", text: "Palettes for rest, love, money and creativity, plus feng shui color meanings." },
  { href: pages.challenge.path, eyebrow: "Free challenge", title: "The 5-day declutter challenge", text: `Fifteen minutes a day to clear the spots that hold you back. Starts ${site.challengeStart}.` },
];

export default function Home() {
  return (
    <div className="accent-earth home">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", name: site.name, url: site.url, logo: site.url + "/brand/ah-monogram-water.png", sameAs: [site.instagram, site.pinterest] },
            { "@type": "WebSite", name: site.name, url: site.url },
            { "@type": "Person", name: site.author.name, jobTitle: site.author.role, description: site.author.bio },
          ],
        }}
      />

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">{site.tagline}</p>
            <h1>Your <span className="home-word">home</span> is the key to manifesting more</h1>
            <p className="lede" style={{ marginTop: 20 }}>
              You journal. You script. You made the vision board. Then you walk back into a room that tells the old
              story. Interior designer {site.author.name} shows you how to make your home part of what you are
              manifesting.
            </p>
            <div className="btn-row">
              <Link className="btn" href={pages.template.path}>Make your free vision board</Link>
              <Link className="btn btn-ghost" href={pages.challenge.path}>Join the declutter challenge</Link>
            </div>
            <p className="hero-note">Free to start. Works in a rental. No renovation required.</p>
          </div>
          <div className="arch-panel" aria-hidden="true">
            <p className="serif">Make room for what you are manifesting.</p>
          </div>
        </div>
      </section>

      <section className="quote-band">
        <div className="wrap">
          <div className="rule" aria-hidden="true" />
          <blockquote>The room you wake up in is your first vision board.</blockquote>
          <p>
            Your home is the place you see more than anywhere else. When it reflects what you want next, you are
            reminded of it all day, without trying.
          </p>
        </div>
      </section>

      <section className="section-lg">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Start here</p>
            <h2>Three steps from vision to room</h2>
            <p>Design first, with a clear reason behind every color, placement and object.</p>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <Link key={s.href} href={s.href} className="step">
                <span className="num" aria-hidden="true" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="more">{s.more} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-lg band">
        <div className="wrap split">
          <div className="mini-board" aria-hidden="true">
            <div className="tall" style={{ background: "var(--wood)", color: "var(--surface)" }}>Grow</div>
            <div style={{ background: "var(--metal)" }}>Clarity</div>
            <div style={{ background: "var(--earth)" }}>Home</div>
            <div className="wide" style={{ background: "var(--water)", color: "var(--surface)" }}>Make room for it</div>
            <div className="wide" style={{ background: "var(--surface)" }}>Rest, then rise</div>
            <div style={{ background: "var(--fire)", color: "var(--surface)" }}>Yes</div>
          </div>
          <div>
            <p className="eyebrow">Free tool</p>
            <h2>A vision board template, made by a designer</h2>
            <ul className="check-list" style={{ marginTop: 20 }}>
              <li>Add your own photos and affirmations right in your browser</li>
              <li>Download it as a phone wallpaper, a desktop background or a printable page</li>
              <li>No account, no app, nothing to install</li>
            </ul>
            <div className="btn-row">
              <Link className="btn" href={pages.template.path}>Make your vision board</Link>
              <Link className="btn btn-ghost" href={pages.ideas.path}>Get 40 ideas first</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-lg" id="challenge">
        <div className="wrap split">
          <div>
            <p className="eyebrow">Free 5-day challenge · Starts {site.challengeStart}</p>
            <h2>Start the year with room to grow</h2>
            <p className="lede" style={{ marginTop: 12 }}>
              Fifteen minutes a day, one small space at a time. It is hard to picture anything new in a room that is
              full.
            </p>
            <ol className="idea-list" style={{ marginTop: 24 }}>
              <li><strong>Your nightstand</strong></li>
              <li><strong>One kitchen drawer</strong></li>
              <li><strong>Your entry</strong></li>
              <li><strong>One closet category</strong></li>
              <li><strong>The spot you avoid</strong></li>
            </ol>
          </div>
          <EmailSignup
            list="declutter-challenge"
            eyebrow="Save your spot"
            heading="Join the free declutter challenge"
            body="Enter your email and day one arrives the morning the challenge starts."
            button="Join the challenge"
            success="You are in. Watch your inbox for day one."
          />
        </div>
      </section>

      <section className="section-lg band">
        <div className="wrap">
          <div className="section-head center">
            <p className="eyebrow">The full program</p>
            <h2>The Guide to Living in Abundance</h2>
            <p>
              {site.author.name}&apos;s eight keys take you from writing your vision to a home that reflects it, room by
              room. Challenge members hear first when it opens here.
            </p>
          </div>
          <div className="keys">
            {keys.map((k) => (
              <div key={k.title} className="key">
                <h3>{k.title}</h3>
                <p>{k.text}</p>
              </div>
            ))}
          </div>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: 40 }}>
            <a className="btn" href="#challenge">Get on the list</a>
          </div>
        </div>
      </section>

      <section className="section-lg">
        <div className="wrap author">
          <div className="author-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/ah-monogram-water.png" alt="" width={90} height={40} />
          </div>
          <div>
            <p className="eyebrow">Behind Abundant Home</p>
            <h2>Designed by {site.author.name}</h2>
            <p>{site.author.bio}</p>
            <p>
              Everything here starts the way a design project does: with what you want your life to feel like. Then
              every color, placement and object gets a reason.
            </p>
            <blockquote className="mantra">
              “{site.mantra}”
              <cite>{site.author.name}</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Read and get started</p>
            <h2>From the journal</h2>
          </div>
          <div className="cards">
            {reads.map((c) => (
              <Link key={c.href} href={c.href} className="card-link">
                <div className="card">
                  <p className="eyebrow">{c.eyebrow}</p>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <p className="more">Read more →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
