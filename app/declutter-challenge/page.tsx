import type { Metadata } from "next";
import Link from "next/link";
import { EmailSignup } from "@/components/EmailSignup";
import { JsonLd } from "@/components/JsonLd";
import { WorkbookCTA } from "@/components/WorkbookCTA";
import { pages, site } from "@/lib/site";

const meta = pages.challenge;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.path },
  openGraph: { title: meta.title, description: meta.description, url: meta.path },
};

const days = [
  {
    title: "Your nightstand",
    text: "It holds the first and last things you see each day. Clear it down to what you actually use and one thing you love.",
  },
  {
    title: "One kitchen drawer",
    text: "Just one. I have watched clearing a single drawer shift how someone feels about their whole home.",
  },
  {
    title: "Your entry",
    text: "Everything comes in through the door, including you. Make the first few feet of your home feel like a welcome.",
  },
  {
    title: "One closet category",
    text: "Most of us wear a small part of our wardrobe most of the time. Pick one category, like jeans or sweaters, and keep the ones you reach for.",
  },
  {
    title: "The spot you avoid",
    text: "Every home has one. We take it slowly and finish by clearing a place for your vision board.",
  },
];

const faqs = [
  { q: "How much time does it take?", a: "About 15 minutes a day for five days. If you want to keep going, you can, but you do not have to." },
  { q: "Do I have to throw everything away?", a: "No. Not all clutter is created equal. The goal is to let go of what is holding you back and keep what inspires you, including the sentimental pieces." },
  { q: "Is it free?", a: "Yes. You get one short email each morning for five days, then occasional notes from Nancy. Unsubscribe anytime." },
];

export default function Page() {
  return (
    <div className="accent-fire">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">Free 5-day challenge · Starts {site.challengeStart}</p>
            <h1>The 5-day declutter challenge for a fresh start</h1>
            <p className="lede" style={{ marginTop: 16 }}>
              Fifteen minutes a day to clear the spots in your home that hold you back, so you start the year with room
              for what you want next. One email each morning, one small space each day.
            </p>
            <EmailSignup
              list="declutter-challenge"
              as="h3"
              heading="Save your spot"
              body="Enter your email and day one arrives the morning the challenge starts."
              button="Join the challenge"
              success="You are in. Watch your inbox for day one."
            />
          </div>
          <div className="arch-panel" aria-hidden="true">
            <p className="serif">One small space a day. Five days. A fresh start.</p>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="prose">
          <h2>What you will clear, day by day</h2>
          <ol className="idea-list">
            {days.map((d, i) => (
              <li key={d.title}>
                <strong>Day {i + 1}: {d.title}</strong>
                {d.text}
              </li>
            ))}
          </ol>

          <h2>Purge with a purpose</h2>
          <p>
            I will be honest: I love my stuff. My desk is covered in fabric, rocks, photos and feathers, and they inspire
            me. So this is not a challenge about owning as little as possible. It is about clearing the things that are
            in your way.
          </p>
          <p>
            Clutter is often the physical shape of old feelings. When a space is crowded with things you do not use or
            love, it is hard to picture anything new there. Clearing even a small spot sends you a signal that you are
            ready for something different.
          </p>
          <p>
            Be gentle with yourself. If you feel guilty about letting something go, keep it for now. A friend of mine
            once cleared out her whole house in a rush and gave away her family heirlooms. She still spends weekends at
            yard sales looking for them. Let go of things for the right reasons, at your own pace.
          </p>

          <h2>Common questions</h2>
          {faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <WorkbookCTA path={meta.path} />

          <h2>While you wait</h2>
          <ul>
            <li><Link href={pages.ideas.path}>40 vision board ideas</Link></li>
            <li><Link href={pages.template.path}>Make a vision board with the free template</Link></li>
            <li><Link href={pages.bedroomColors.path}>Bedroom colors for what you want next</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
