import type { Metadata } from "next";
import Link from "next/link";
import { EmailSignup } from "@/components/EmailSignup";
import { JsonLd } from "@/components/JsonLd";
import { VisionBoardMaker } from "@/components/VisionBoardMaker";
import { pages, site } from "@/lib/site";

const meta = pages.template;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.path },
  openGraph: { title: meta.title, description: meta.description, url: meta.path },
};

export default function Page() {
  return (
    <div className="accent-wood">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Abundant Home vision board template",
          url: site.url + meta.path,
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: meta.description,
        }}
      />
      <header className="article-head">
        <div className="wrap">
          <p className="eyebrow">Free tool</p>
          <h1>Free vision board template</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Choose a size and a layout, tap each square to add a photo or your own words, then download your board. Make
            it your phone wallpaper so you see it every time you pick up your phone, or print it and fill it in by hand.
          </p>
        </div>
      </header>

      <div className="wrap">
        <VisionBoardMaker />

        <div className="prose">
          <h2>How to use this template</h2>
          <ol>
            <li>
              <strong>Write first.</strong> Spend ten minutes writing about the life you want as if you already live it.
              It tells you what belongs on the board. <Link href={pages.howTo.path}>Here is the full method.</Link>
            </li>
            <li><strong>Pick a size.</strong> A phone wallpaper is the one you will see most.</li>
            <li>
              <strong>Pick a layout.</strong> Nine squares covers the main parts of a life. One big dream puts a single
              goal front and center. Twelve months gives each month of the year its own picture.
            </li>
            <li>
              <strong>Fill the squares.</strong> Use your own photos or images you have saved. The labels are prompts,
              not rules: write over them with whatever fits.
            </li>
            <li>
              <strong>Add your word.</strong> The word square sits at the center of the board on purpose. Choose one
              word for the year and let the images support it.
            </li>
            <li><strong>Download it and put it where you will see it every day.</strong></li>
          </ol>

          <h2>Printable or digital?</h2>
          <p>
            Both work if you look at them. Making a board by hand engages more of your senses: the sound of magazine
            pages, the feel of fabric, the smell of glue. A digital board is easy to change and lives where your
            attention already is. Many people make a printed board for the bedroom and a phone version for the day.
          </p>
          <p>
            Download the printable page with empty squares and it prints as a labeled grid you can fill with cut-outs,
            paint chips and handwriting.
          </p>

          <EmailSignup
            list="declutter-challenge"
            heading="Make room for what is on your board"
            body={`Join the free 5-day declutter challenge. Fifteen minutes a day to clear one spot at a time, starting ${site.challengeStart}.`}
            button="Join the challenge"
            success="You are in. Watch your inbox for day one."
          />

          <h2>More on vision boards</h2>
          <ul>
            <li><Link href={pages.ideas.path}>40 vision board ideas from an interior designer</Link></li>
            <li><Link href={pages.howTo.path}>How to make a vision board in 9 steps</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
