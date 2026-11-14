import type { Metadata } from "next";
import Link from "next/link";
import { Article } from "@/components/Article";
import { EmailSignup } from "@/components/EmailSignup";
import { WorkbookCTA } from "@/components/WorkbookCTA";
import { JsonLd } from "@/components/JsonLd";
import { pages, site } from "@/lib/site";

const meta = pages.howTo;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.path },
  openGraph: { title: meta.title, description: meta.description, url: meta.path },
};

const steps = [
  {
    id: "time",
    name: "Set aside quiet time",
    text: "Give yourself 15 to 20 minutes with no phone, laundry or work. Wear something that makes you feel good and sit somewhere that supports you, with your back to a wall rather than a door or window.",
  },
  {
    id: "write",
    name: "Write your vision first",
    text: "Before choosing any images, write a list of what you want more of and why, describing your life as if you already live it.",
  },
  {
    id: "supplies",
    name: "Gather your supplies",
    text: "Choose a base (cork board, poster board, a notebook or a digital template) and collect magazines, photos, printouts, fabric and anything else that matches your vision.",
  },
  {
    id: "visualize",
    name: "Reread and visualize",
    text: "Read your written vision again and picture yourself living it. Notice the feelings, colors, sounds and smells.",
  },
  {
    id: "select",
    name: "Select and arrange your images",
    text: "Choose only the images that match your written vision and arrange them in a way that looks good to you, with your most important image as the focal point.",
  },
  {
    id: "words",
    name: "Add affirmations and words",
    text: "Write your own affirmations or meaningful quotes directly on the board, in the present tense.",
  },
  {
    id: "beautiful",
    name: "Make it beautiful",
    text: "Use a simple color palette, balance and a little breathing room so the board is a pleasure to look at. Add something for each of your five senses.",
  },
  {
    id: "display",
    name: "Put it where you will see it every day",
    text: "Hang it in your bedroom, office or another spot you pass daily, or set it as your phone wallpaper.",
  },
  {
    id: "review",
    name: "Review it daily and update it",
    text: "Spend a few minutes each day picturing your vision as if it has already happened, and change the board as your vision grows.",
  },
];

const faqs = [
  {
    q: "How many pictures should a vision board have?",
    a: "There is no right number. Most strong boards have 10 to 20 images. Choose the ones that give you a real lift and leave some empty space so each image can be seen.",
  },
  {
    q: "Is a digital vision board as good as a physical one?",
    a: "Both work if you look at them. A physical board engages more of your senses while you make it. A digital board is easy to edit and can live on your phone, where you look dozens of times a day. Many people make both.",
  },
  {
    q: "When is the best time to make a vision board?",
    a: "Any fresh start: the new year, a birthday, a move, a new job or the end of a relationship. The best time is when you feel a pull toward something new.",
  },
  {
    q: "What should I do with my old vision board?",
    a: "Look through it before you take it down. Notice what came true and what you no longer want. Keep the pieces that still matter for your next board and let the rest go.",
  },
];

export default function Page() {
  return (
    <Article
      meta={meta}
      eyebrow="Vision boards"
      heading="How to make a vision board in 9 steps"
      lede="This is the method I teach clients. The difference from most guides is step two: you write your vision before you choose a single picture, so the board says one clear thing."
      accent="wood"
      toc={steps.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.name}` }))}
      updated={meta.updated}
      howTo={{ name: "How to make a vision board", steps: steps.map(({ name, text }) => ({ name, text })) }}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <p>
        If vision boards have never worked for you, or they have always felt a little cheesy, try this approach once.
        A vision board is a set of visual reminders that keep your attention on what you want. It works best when it
        is specific, when it makes you feel something, and when you see it every day.
      </p>

      <h3>What you need</h3>
      <ul>
        <li>15 to 20 minutes of quiet, and about an hour to make the board</li>
        <li>A notebook and pen</li>
        <li>A base: cork board, poster board, a notebook or our <Link href={pages.template.path}>free digital template</Link></li>
        <li>Magazines, photos, printouts, fabric scraps, paint chips</li>
        <li>Scissors, glue or pins, markers</li>
      </ul>

      <h2 id="time">1. Set aside quiet time</h2>
      <p>
        Give yourself 15 to 20 minutes with no phone, no laundry and no work, and make sure you are not hungry. Wear
        something that makes you feel good, not your oldest sweats. It sounds small, but dressing for the life you want
        changes how you think about it.
      </p>
      <p>
        Sit somewhere that makes you feel supported, with a wall behind you rather than a door or a window. Light a
        candle or put on music if it helps you settle. Take eight slow breaths and let the day go.
      </p>

      <h2 id="write">2. Write your vision first</h2>
      <p>
        This is the step most people skip, and it is the one that makes the board work. Open your notebook and write,
        quickly and without judging, about the life you want. Write as if you already live it. Some prompts:
      </p>
      <ul>
        <li>I want more ______ in my life. Why?</li>
        <li>When I have more ______, I will ______.</li>
        <li>How do I feel, day to day, in this new life?</li>
        <li>Where do I live? Mountains, beach, city? What does my home look like?</li>
        <li>What does my work look like? Where do I do it, and with whom?</li>
        <li>Who is around me? How do I spend a free afternoon?</li>
      </ul>
      <p>
        Keep going until you run out. If a critical thought comes up, notice it and tell yourself, "That is how I used to
        think." When you are done, read the list back. Cross out anything that does not feel exciting and add anything
        new. This page is the brief for your board.
      </p>

      <h2 id="supplies">3. Gather your supplies</h2>
      <p>
        Choose your base. A cork board or poster board is classic. A notebook makes a vision journal you keep adding to.
        A digital board can live on your phone. Then collect more images than you need: magazines, printed photos, paint
        chips, fabric, ribbon, quotes. Look for images that match the feelings in your writing, not only the objects.
      </p>

      <h2 id="visualize">4. Reread and visualize</h2>
      <p>
        Read your written vision again. Close your eyes and picture a day in that life. What do you see when you wake
        up? What can you smell? What are you wearing? Let yourself feel it. The board should hold that feeling.
      </p>

      <EmailSignup
        list="declutter-challenge"
        tone="light"
        as="h3"
        eyebrow={`Free 5-day challenge · Starts ${site.challengeStart}`}
        heading="Clear a space for your board"
        body="Before you start arranging, join the free declutter challenge: fifteen minutes a day, ending with the spot where your board will hang."
        button="Join the challenge"
        success="You are in. Watch your inbox for day one."
      />

      <h2 id="select">5. Select and arrange your images</h2>
      <p>
        Go through your pile and keep only the images that match what you wrote. Pick one image as the focal point,
        the thing you most want, and give it the center or the largest space. Arrange the rest around it until it looks
        right to you. Move things around before you glue anything down.
      </p>

      <h2 id="words">6. Add affirmations and words</h2>
      <p>
        Add a few words in your own handwriting. Write them in the present tense, as facts: "I wake up in a home I love."
        "My work supports my life." A single word of the year in the center is a lovely anchor.
      </p>

      <h2 id="beautiful">7. Make it beautiful</h2>
      <p>
        You will look at a beautiful board more often, so use a designer&apos;s tools:
      </p>
      <ul>
        <li><strong>A color palette.</strong> Three main colors and a neutral. It makes even a full board feel calm.</li>
        <li><strong>Balance.</strong> Symmetry feels settled, asymmetry feels energetic, a radial layout around a center feels focused.</li>
        <li><strong>Breathing room.</strong> Leave a few gaps. The eye needs a place to rest.</li>
        <li><strong>All five senses.</strong> Add something you can taste, touch, smell, hear and see, plus one image for the feeling you are after. Spray a perfume you love on the corner, or glue on a piece of fabric.</li>
      </ul>
      <p>
        It does not have to be tidy. My first materials board in design school was twice the size of everyone
        else&apos;s, with sticks and feathers coming off every edge. Follow your own taste.
      </p>

      <WorkbookCTA path={meta.path} eyebrow="The workbook" />

      <h2 id="display">8. Put it where you will see it every day</h2>
      <p>
        Hang it in your bedroom, your office or on the back of a door you walk through every morning. If you made a
        digital board, set it as your phone wallpaper. A vision board in a closet does nothing.
      </p>

      <h2 id="review">9. Review it daily and update it</h2>
      <p>
        Spend a few minutes each day with your board. Picture the life on it as if it has already happened and notice
        how that feels. As your life moves, your vision will too. Take off what no longer fits and add what you want
        now.
      </p>

      <div className="callout">
        <p>
          <strong>A story I love.</strong> A client named Rose spent years dreaming of a forest cottage with a little
          yellow gate. Her board had photos of the cottage, yellow paint swatches and her favorite plant, mugwort.
          When she suddenly had to move, a friend told her about a rental at the foot of the mountains. It looked like
          one of her photos, with a patch of mugwort by the path and a small wooden gate. The gate was red. She took the
          house and painted it yellow herself.
        </p>
      </div>

      <h2>Common questions</h2>
      {faqs.map((f) => (
        <div key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}

      <EmailSignup
        list="declutter-challenge"
        heading="Clear a space for your board"
        body={`Before you hang it, make room. Join the free 5-day declutter challenge, 15 minutes a day, starting ${site.challengeStart}.`}
        button="Join the challenge"
        success="You are in. Watch your inbox for day one."
      />

      <h2>Keep going</h2>
      <ul>
        <li><Link href={pages.ideas.path}>40 vision board ideas</Link></li>
        <li><Link href={pages.template.path}>Make your board with the free template</Link></li>
      </ul>
    </Article>
  );
}
