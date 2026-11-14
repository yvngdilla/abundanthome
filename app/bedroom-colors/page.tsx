import type { Metadata } from "next";
import Link from "next/link";
import { Article } from "@/components/Article";
import { EmailSignup } from "@/components/EmailSignup";
import { pages, site } from "@/lib/site";

const meta = pages.bedroomColors;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.path },
  openGraph: { title: meta.title, description: meta.description, url: meta.path },
};

const toc = [
  { id: "feel", label: "How bedroom colors make you feel" },
  { id: "palettes", label: "Bedroom color palettes by intention" },
  { id: "feng-shui", label: "Feng shui bedroom colors" },
  { id: "build", label: "Build your palette in 3 steps" },
  { id: "finish", label: "Choose the finish first" },
  { id: "test", label: "Test before you commit" },
];

type Swatch = { name: string; hex: string; note: string };

const palettes: { title: string; intro: string; swatches: Swatch[] }[] = [
  {
    title: "For rest",
    intro: "Pale blues, soft greens and blush read as calm. Cool colors seem to recede, which makes a room feel open and quiet.",
    swatches: [
      { name: "Pale blue", hex: "#c9d6dd", note: "Trust and calm. Lovely on all four walls." },
      { name: "Sage", hex: "#b9c2a8", note: "Growth and ease. Warmer than it looks on the chip." },
      { name: "Blush", hex: "#ead3cb", note: "Softness without sweetness." },
      { name: "Warm white", hex: "#f1ebe0", note: "The neutral that lets the others breathe." },
    ],
  },
  {
    title: "For love",
    intro: "Pinks, lavenders and soft blues, used in pairs and in soft textures. Think warmth and closeness, not a red room.",
    swatches: [
      { name: "Rose", hex: "#d9a9a0", note: "Warmth and affection. Try it behind the bed." },
      { name: "Lavender", hex: "#c8bfd6", note: "Tender and a little romantic." },
      { name: "Dusty blue", hex: "#9fb0bf", note: "Steadies the pinks and adds trust." },
      { name: "Linen", hex: "#e8dfd0", note: "A warm neutral for bedding and trim." },
    ],
  },
  {
    title: "For money and ambition",
    intro: "Greens, golds and a touch of deep purple. Keep greens soft and golds in small doses so the room still feels restful.",
    swatches: [
      { name: "Deep green", hex: "#4f6249", note: "Growth and prosperity. Strong on one wall." },
      { name: "Antique gold", hex: "#c9a46a", note: "Best as brass, frames and textiles." },
      { name: "Plum", hex: "#5d4558", note: "Richness and confidence in small amounts." },
      { name: "Cream", hex: "#efe7d6", note: "Keeps the richer colors from feeling heavy." },
    ],
  },
  {
    title: "For creativity",
    intro: "Orange, deep purple and yellow bring energy. In a bedroom, use them as accents rather than wall color.",
    swatches: [
      { name: "Terracotta", hex: "#c0714f", note: "Warm energy. A throw, a lamp, a vase." },
      { name: "Aubergine", hex: "#4a3550", note: "Depth and imagination on a headboard wall." },
      { name: "Ochre", hex: "#d1a54a", note: "Optimism and clarity in a pillow or print." },
      { name: "Soft gray", hex: "#cfccc5", note: "A calm base for bolder accents." },
    ],
  },
];

const elements: { element: string; colors: string; brings: string; bedroom: string }[] = [
  { element: "Wood", colors: "Greens, some browns", brings: "Growth, new beginnings", bedroom: "Soft greens on walls, wood furniture, plants" },
  { element: "Fire", colors: "Reds, oranges, strong pinks", brings: "Passion, energy, recognition", bedroom: "Small accents only: a pillow, candles, art" },
  { element: "Earth", colors: "Yellows, tans, terracotta", brings: "Stability, nourishment, love", bedroom: "Warm neutrals on walls and bedding" },
  { element: "Metal", colors: "Whites, grays, metallics", brings: "Clarity, focus", bedroom: "Trim, lamps, frames, crisp white bedding" },
  { element: "Water", colors: "Blues, deep navy, black", brings: "Flow, calm, rest", bedroom: "Pale blues work well; use very dark shades sparingly" },
];

export default function Page() {
  return (
    <Article
      meta={meta}
      eyebrow="Bedroom"
      heading="Bedroom colors: choosing a paint color for what you want next"
      lede="Your bedroom is the first room you see every morning and the last at night. Its colors set the tone for both. Here is how a designer chooses them, starting with how you want to feel."
      accent="earth"
      toc={toc}
      updated="2026-11-13"
    >
      <p>
        In more than twenty years of choosing colors for clients, I have found that most people want more of four
        things: love, rest, money or creativity. Color will not hand you any of them. What it does is shape how a room
        feels every day, and a room that feels right makes it easier to show up as the person you are becoming.
      </p>

      <h2 id="feel">How bedroom colors make you feel</h2>
      <p>
        Colors split into two families. <strong>Warm colors</strong> (reds, oranges, yellows) seem to move toward
        you. They feel energetic and cozy, and they are often used in rooms meant for gathering. <strong>Cool
        colors</strong> (blues, greens, purples) seem to recede. They feel calm and spacious, which is why designers
        reach for them in bedrooms and bathrooms.
      </p>
      <p>Some common associations, as a starting point:</p>
      <table className="simple">
        <thead>
          <tr><th>Color</th><th>Often feels like</th></tr>
        </thead>
        <tbody>
          <tr><td>Blue</td><td>Trust, compassion, recovery</td></tr>
          <tr><td>Green</td><td>Growth, health, safety</td></tr>
          <tr><td>Yellow</td><td>Clarity, decisiveness, optimism</td></tr>
          <tr><td>Red</td><td>Energy, strength, passion</td></tr>
          <tr><td>Gray</td><td>Calm, sophistication</td></tr>
          <tr><td>White</td><td>Freshness, simplicity</td></tr>
          <tr><td>Brown</td><td>Warmth, comfort, stability</td></tr>
          <tr><td>Black</td><td>Elegance, groundedness</td></tr>
        </tbody>
      </table>
      <p>
        These are not rules. Your own history with a color matters more than any chart. If a color makes you feel good,
        it belongs in your room. If it makes you uneasy, leave it out, whatever it is supposed to mean.
      </p>

      <h2 id="palettes">Bedroom color palettes by intention</h2>
      <p>
        You will notice some overlap: green shows up for both rest and money. The difference is in the shade, the
        intensity and the colors around it. A pale sage is restful. A deep green with brass is ambitious.
      </p>
      {palettes.map((p) => (
        <div key={p.title}>
          <h3>{p.title}</h3>
          <p>{p.intro}</p>
          <div className="swatches">
            {p.swatches.map((s) => (
              <div className="swatch" key={s.name}>
                <div className="chip" style={{ background: s.hex }} />
                <div className="body"><strong>{s.name}</strong>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p>
        These chips are a guide to the family of color, not a paint match. Take them to the store and find the shade that
        feels right in your light.
      </p>

      <h2 id="feng-shui">Feng shui bedroom colors</h2>
      <p>
        Feng shui groups colors into five elements, each linked to a quality you can invite into a room. For a bedroom,
        the usual advice is to favor the calmer elements for your walls and keep the energetic ones as accents, so the
        room still feels like a place to rest.
      </p>
      <table className="simple">
        <thead>
          <tr><th>Element</th><th>Colors</th><th>Invites</th><th>In a bedroom</th></tr>
        </thead>
        <tbody>
          {elements.map((e) => (
            <tr key={e.element}><td><strong>{e.element}</strong></td><td>{e.colors}</td><td>{e.brings}</td><td>{e.bedroom}</td></tr>
          ))}
        </tbody>
      </table>
      <p>
        Warm earth tones and soft, skin-like colors are a classic feng shui choice for bedrooms because they feel
        nourishing and steady. If you want to invite love, add pinks and pairs: two lamps, two nightstands, two pillows.
        Save bright red for small touches.
      </p>

      <EmailSignup
        list="declutter-challenge"
        tone="light"
        as="h3"
        eyebrow={`Free 5-day challenge · Starts ${site.challengeStart}`}
        heading="Start with a clear room"
        body="A new color shows best in an uncluttered room. Join the free 5-day declutter challenge, starting with your nightstand."
        button="Join the challenge"
        success="You are in. Watch your inbox for day one."
      />

      <h2 id="build">Build your bedroom palette in 3 steps</h2>
      <ol>
        <li>
          <strong>Name your intention.</strong> Decide how you want to feel in the room and what you are calling in.
          Rest? Love? A bolder year? Write it down in one sentence.
        </li>
        <li>
          <strong>Choose three colors and a neutral.</strong> Pick colors that match that feeling. One becomes the main
          color, the backbone of the room. The other two support it. Add a neutral (white, cream, gray or beige) so the
          eye has a place to rest.
        </li>
        <li>
          <strong>Decide where each color goes.</strong> The main color usually takes the walls or the bedding. The two
          supporting colors show up in textiles, art and small pieces. Repeat each color at least twice so it looks
          intentional.
        </li>
      </ol>
      <p>
        If you want two different things, give each its own place. A client who wanted both prosperity and love put
        her greens in her office and her pinks in the bedroom, so each room had one clear message.
      </p>

      <h2 id="finish">Choose the finish first</h2>
      <p>The finish changes how a color reads, so settle it before you choose the shade.</p>
      <ul>
        <li><strong>Flat or matte:</strong> no shine, hides flaws. Good for bedroom walls and ceilings.</li>
        <li><strong>Eggshell:</strong> a slight sheen and more durable. The most common choice for bedroom walls.</li>
        <li><strong>Satin:</strong> a velvety sheen that wipes clean. Good for busier rooms and kids&apos; rooms.</li>
        <li><strong>Semi-gloss:</strong> shiny and tough. Use it for trim and doors.</li>
        <li><strong>High-gloss:</strong> very shiny. Save it for accents, like a lacquered door or a ceiling statement.</li>
      </ul>

      <h2 id="test">Test before you commit</h2>
      <p>Always, always test your paint on the wall. Paint chips lie, and so does the lighting at the store.</p>
      <ol>
        <li>Narrow it down to two or three colors before you buy samples.</li>
        <li>Buy sample pots in the finish you chose and paint squares at least 8 by 8 inches, bigger if you can.</li>
        <li>Paint a square on every wall. Light changes from wall to wall.</li>
        <li>Look at them in the morning, at midday and at night under your lamps.</li>
        <li>Live with them for a few days before you decide. Notice which one you keep looking at.</li>
      </ol>
      <p>
        Do not forget the ceiling. A pale tint of your wall color overhead makes a bedroom feel wrapped and finished, and
        a soft color above the bed is one of the most restful things you can add.
      </p>

      <EmailSignup
        list="declutter-challenge"
        heading="Clear the room before you paint it"
        body={`A fresh color shows best in an uncluttered room. Join the free 5-day declutter challenge, 15 minutes a day, starting ${site.challengeStart}.`}
        button="Join the challenge"
        success="You are in. Watch your inbox for day one."
      />

      <h2>Keep going</h2>
      <ul>
        <li><Link href={pages.ideas.path}>40 vision board ideas</Link> (a board is a great way to test a palette)</li>
        <li><Link href={pages.template.path}>Free vision board template</Link></li>
      </ul>
    </Article>
  );
}
