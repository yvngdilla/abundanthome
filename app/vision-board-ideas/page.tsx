import type { Metadata } from "next";
import Link from "next/link";
import { Article } from "@/components/Article";
import { EmailSignup } from "@/components/EmailSignup";
import { WorkbookCTA } from "@/components/WorkbookCTA";
import { pages, site } from "@/lib/site";

const meta = pages.ideas;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.path },
  openGraph: { title: meta.title, description: meta.description, url: meta.path },
};

const toc = [
  { id: "life", label: "Ideas for every part of your life" },
  { id: "formats", label: "Ideas for the board itself" },
  { id: "design", label: "Ideas from a designer" },
  { id: "new-year", label: "Ideas for a new year board" },
  { id: "where", label: "Where to put your board" },
];

export default function Page() {
  return (
    <Article
      meta={meta}
      eyebrow="Vision boards"
      heading="Vision board ideas: 40 ideas from an interior designer"
      lede="Most vision boards end up behind a door or in a drawer. These ideas help you decide what goes on yours, what form it takes and where it lives, so it becomes something you actually look at every day."
      accent="wood"
      toc={toc}
      updated={meta.updated}
    >
      <p>
        I have been an interior designer in Los Angeles for more than twenty years, and I usually have two or three
        vision boards going at once. Friends and clients have used theirs to call in a new home, a dream job and a
        sauna for a new house. What their boards had in common was not glitter or a perfect grid. Each one was
        specific, it was easy to see every day, and it made the person feel something when they looked at it.
      </p>
      <p>
        Start with the ideas that pull at you. You do not need all forty. You need the handful that sound like your
        next chapter.
      </p>

      <div className="callout">
        <p>
          <strong>Want to make yours right now?</strong> Our <Link href={pages.template.path}>free vision board
          template</Link> lets you drop in your own photos and words, then download the board as a phone wallpaper or
          a printable page.
        </p>
      </div>

      <h2 id="life">Vision board ideas for every part of your life</h2>
      <p>
        Before you cut a single picture, decide what you are calling in. A board with one clear message works better
        than a board that tries to hold everything. Pick the two or three areas below that matter most this year.
      </p>

      <h3>Home</h3>
      <ol className="idea-list">
        <li>
          <strong>The room you want to wake up in.</strong> Save photos of the exact bedroom you are drawn to: the
          light, the bedding, the view from the bed. Specific beats general every time.
        </li>
        <li>
          <strong>Paint chips and fabric swatches.</strong> One of my clients pinned yellow paint swatches next to
          photos of a forest cottage with a little yellow gate. Months later she moved into a cottage that matched
          her photos, and she painted the gate yellow herself.
        </li>
        <li>
          <strong>A floor plan of your next place.</strong> Sketch the layout you want, even roughly. Seeing where
          the bed, the desk and the sofa would go makes a future home feel real.
        </li>
        <li>
          <strong>The plant you will grow there.</strong> A picture of a favorite plant or garden says a lot about the
          life you want around your home.
        </li>
      </ol>

      <h3>Money and work</h3>
      <ol className="idea-list">
        <li>
          <strong>What money buys you, not the money itself.</strong> A picture of a stack of cash says little. A
          photo of the trip you would pay for, or the family dinner you would host, says why you want it.
        </li>
        <li>
          <strong>Your name on the door.</strong> A mock business card, a storefront, a book cover or a nameplate
          with your name on it.
        </li>
        <li>
          <strong>The desk you work at.</strong> The view, the chair, the morning light. Where you work shapes how it
          feels to work.
        </li>
        <li>
          <strong>A number you write in your own hand.</strong> If there is a figure you are working toward, write it
          yourself rather than printing it. It reads as a decision.
        </li>
      </ol>

      <h3>Love and relationships</h3>
      <ol className="idea-list">
        <li>
          <strong>How it feels, not who it is.</strong> Choose images of moments: two coffee cups on a balcony, a
          long table full of friends, a hand on a shoulder.
        </li>
        <li>
          <strong>Pairs.</strong> Two candles, two chairs, two pillows. Designers use pairs to make a room feel
          balanced and shared.
        </li>
        <li>
          <strong>The friends you want around you.</strong> Love on a board is not only romance. Add the circle,
          the family time and the kind of support you want.
        </li>
      </ol>

      <h3>Health, rest and joy</h3>
      <ol className="idea-list">
        <li>
          <strong>Your best ordinary day.</strong> The breakfast, the walk, the hour you read. Small rituals are easier
          to picture, and easier to start, than big transformations.
        </li>
        <li>
          <strong>Movement you love.</strong> A trail, a pool, a dance class. Pick the activity that makes you smile,
          not the one you think you should do.
        </li>
        <li>
          <strong>Rest.</strong> A made bed, a bath, a quiet corner with a lamp. Rest is something you can design for.
        </li>
        <li>
          <strong>Something that makes you laugh.</strong> Joy keeps you coming back to the board.
        </li>
      </ol>

      <h3>Travel, learning and creativity</h3>
      <ol className="idea-list">
        <li>
          <strong>One real destination.</strong> I made a digital board full of tropical getaways and meals on the
          beach, and found myself booking a trip to Moorea not long after. Name the actual place.
        </li>
        <li>
          <strong>A map with pins.</strong> Mark the places you will see this year and the ones you are saving for
          later. A map makes the world feel close.
        </li>
        <li>
          <strong>The skill you are learning.</strong> A language, an instrument, a pottery wheel. Show yourself
          mid-practice.
        </li>
        <li>
          <strong>The thing you will make.</strong> A painting, a garden, a business. Creative goals belong on the
          board as much as financial ones.
        </li>
      </ol>

      <EmailSignup
        list="declutter-challenge"
        tone="light"
        as="h3"
        eyebrow={`Free 5-day challenge · Starts ${site.challengeStart}`}
        heading="Make room for your board before you make it"
        body="Fifteen minutes a day to clear one small space at a time. On day five we clear the spot where your vision board will live."
        button="Join the challenge"
        success="You are in. Watch your inbox for day one."
      />

      <h2 id="formats">Ideas for the board itself</h2>
      <p>
        Your vision board does not have to be a board. It needs to be something you can reach easily and that
        reminds you of your vision without effort.
      </p>
      <ol className="idea-list">
        <li>
          <strong>A classic cork or poster board.</strong> Cut, paste, pin. I still prefer this method: flipping
          through magazines, cutting fabric and gluing things down engages more of your senses.
        </li>
        <li>
          <strong>A vision notebook.</strong> A journal you keep adding to, with images, scenarios and your written
          vision. Keep it on your nightstand and look through it as you fall asleep or right after you wake up.
        </li>
        <li>
          <strong>A phone wallpaper.</strong> You look at your phone dozens of times a day. Make your board the first
          thing you see. Our <Link href={pages.template.path}>template</Link> exports at phone size.
        </li>
        <li>
          <strong>A 3D board.</strong> Glue on fabric, a feather, a piece of jewelry, a pressed flower. It does not have
          to be flat or tidy.
        </li>
        <li>
          <strong>A scented board.</strong> Spray it with a perfume you love or rub on an essential oil. Scent is a
          fast route to a feeling.
        </li>
        <li>
          <strong>A framed board.</strong> Frame it like art so it belongs in your room instead of looking like a
          school project.
        </li>
        <li>
          <strong>A mirror board.</strong> Tuck a few images into the frame of the mirror you use every morning.
        </li>
        <li>
          <strong>A room board.</strong> Designers make materials boards for every project. Make one for a single room
          you are about to change: colors, fabrics, the furniture you want.
        </li>
        <li>
          <strong>A Pinterest board.</strong> Good for collecting, but print your favorites. A board you never open is
          not doing its job.
        </li>
      </ol>

      <WorkbookCTA path={meta.path} eyebrow="The workbook" />

      <h2 id="design">Vision board ideas from a designer</h2>
      <p>
        A vision board is a small design project, so the principles I use in rooms apply here too. The goal is a
        board that is a pleasure to look at, because you will look at it more.
      </p>
      <ol className="idea-list">
        <li>
          <strong>Write your vision first.</strong> Before you choose a single image, write a page about the life you
          want as if you already live it. Then choose images that match the writing. This is the step most people
          skip. <Link href={pages.howTo.path}>The full method is here.</Link>
        </li>
        <li>
          <strong>Choose a color palette.</strong> Three main colors plus a neutral keeps a busy board calm. Greens and
          golds read as growth and prosperity, soft pinks and blues read as love and rest.
        </li>
        <li>
          <strong>Give it a focal point.</strong> Every good room has one thing the eye goes to first. Put your most
          important image or word in the center, larger than the rest.
        </li>
        <li>
          <strong>Use balance on purpose.</strong> Symmetry feels calm and settled. Asymmetry feels energetic. Radial
          balance, with everything around a center, feels focused. Pick the one that matches your year.
        </li>
        <li>
          <strong>Leave breathing room.</strong> The eye needs a place to rest. A few empty spaces make the images you
          keep stronger.
        </li>
        <li>
          <strong>Engage all five senses.</strong> Add something for taste, touch, smell, sound and sight, plus one
          image for the feeling you want. That last one matters as much as the other five.
        </li>
        <li>
          <strong>Put yourself in it.</strong> A photo of you smiling, or your handwriting, makes the board yours rather
          than a magazine page.
        </li>
        <li>
          <strong>Choose quality over quantity.</strong> Ten images you love beat fifty you feel lukewarm about.
          Remove anything that does not give you a small lift.
        </li>
      </ol>

      <h2 id="new-year">Ideas for a new year vision board</h2>
      <ol className="idea-list">
        <li>
          <strong>A word of the year.</strong> One word in the center: ease, home, bold, rooted. Let everything else on
          the board support it.
        </li>
        <li>
          <strong>Twelve squares for twelve months.</strong> A grid with one image per month turns a big year into small,
          visible steps.
        </li>
        <li>
          <strong>A first quarter board.</strong> Make a smaller board for January to March only. It is easier to act on,
          and you can make the next one in April.
        </li>
        <li>
          <strong>A clear start.</strong> Clear one shelf, one drawer or one corner before you hang the new board. Making
          physical room is a signal to yourself that you are ready. Our{" "}
          <Link href={pages.challenge.path}>5-day declutter challenge</Link> walks you through it.
        </li>
      </ol>

      <h2 id="where">Where to put your vision board</h2>
      <p>
        Put it somewhere you will see every day without trying: your bedroom, your office, the back of the door you walk
        through each morning. Then take a few minutes each day to look at it and picture the life on it as if it has
        already happened. Notice how that feels.
      </p>
      <p>
        Update it as you change. Take off anything that no longer feels right and add what you want now. A vision
        board is a living thing, the same way a home is.
      </p>
      <p className="quote">A vision board is a visual reminder of the life you are building. Focus, belief and action do the rest.</p>

      <EmailSignup
        list="declutter-challenge"
        heading="Make room before you make your board"
        body={`Join the free 5-day declutter challenge. Fifteen minutes a day to clear the spots in your home that hold you back. It starts ${site.challengeStart}.`}
        button="Join the challenge"
        success="You are in. Watch your inbox for day one."
      />

      <h2>Keep going</h2>
      <ul>
        <li><Link href={pages.howTo.path}>How to make a vision board in 9 steps</Link></li>
        <li><Link href={pages.template.path}>Free vision board template</Link></li>
        <li><Link href={pages.bedroomColors.path}>Bedroom colors for what you want next</Link></li>
      </ul>
    </Article>
  );
}
