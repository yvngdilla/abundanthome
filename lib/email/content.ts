import { site, pages } from "@/lib/site";
import { products, formatPrice } from "@/lib/shop";

// Every email Abundant Home sends, in Nancy's voice. These are drafts for Nancy to edit: change the words here,
// keep the structure. Body format: see lib/email/layout.ts.
//
// Sequences
//   vision-board list (joined through the template download gate): vb-0 on sign-up, then days 2, 4, 7, 10, 14.
//   declutter-challenge list: dc-0 on sign-up, dc-wait three days later if the challenge is still ahead,
//   (dc-0-late for people who join after the January start), dc-1 to dc-5 on the five challenge days, then the workbook offer (day 7) and the room review (day 10).
//   People who join after the January challenge start their own five days the morning after they sign up.

export type EmailDef = { key: string; subject: string; preheader: string; body: (u: string) => string };

const sign = `Make room for it,
Nancy`;

const vb = products["vision-board-workbook"];
const dc = products["declutter-workbook"];
const rr = products["room-review"];

export const emails: Record<string, EmailDef> = {
  // Vision board list
  "vb-0": {
    key: "vb-0",
    subject: "Your vision board, and where to put it",
    preheader: "The step that decides whether a board works: where it lives.",
    body: (u) => `
Hi there,

Your board should be downloading now. If it did not, open the template again and download it once more: there is no need to enter your email twice.

One thing before you print it. Where a vision board lives matters as much as what is on it. Put it somewhere you see in the first ten minutes of your day: the wall facing your bed, beside the bathroom mirror, or as your phone's lock screen.

A board in a drawer is a wish. A board you see every morning is a reminder.

[Where to put your vision board](${u}${pages.ideas.path}#where)

Over the next two weeks I will send you a few short notes on making your board, and your home, work for what you want next.

${sign}`,
  },
  "vb-1": {
    key: "vb-1",
    subject: "Write it before you pin it",
    preheader: "The step most people skip, and why boards that skip it end up in a drawer.",
    body: (u) => `
Hi again,

Most vision boards start with pictures. The ones that work start with words.

Before you choose another image, take twenty minutes and write one page about your life as if you already live it. Present tense. Where you wake up, who is there, what you do with your morning, how it feels.

Then look at your board. Every image should point back to something on that page. If it does not, it is decoration.

[The full method, step by step](${u}${pages.howTo.path})

${sign}`,
  },
  "vb-2": {
    key: "vb-2",
    subject: "Your board is only as strong as the room around it",
    preheader: "One small change to the wall your board hangs on.",
    body: (u) => `
Hi,

Here is something I see in almost every home I walk into: a beautiful vision board on a wall surrounded by piles, cords and things that tell the old story.

Your eyes take in the whole wall, not just the board. So this week, clear the surface and the floor around your board. Just that one spot. It takes ten minutes and it changes how the board feels to look at.

If you want company doing it, my free 5-day declutter challenge starts ${site.challengeStart}.

[Join the declutter challenge](${u}${pages.challenge.path})

${sign}`,
  },
  "vb-3": {
    key: "vb-3",
    subject: "The colors your board keeps choosing",
    preheader: "Your vision board is quietly telling you how to paint.",
    body: (u) => `
Hi,

Look at your vision board for a minute and notice the colors, not the pictures. Most people find two or three colors showing up again and again.

That is your palette. It is the color of the life you are calling in, and it belongs in your home: on a wall, in your bedding, in one object you see every day.

[How to choose bedroom colors with intention](${u}${pages.bedroomColors.path})

${sign}`,
  },
  "vb-4": {
    key: "vb-4",
    subject: "The workbook behind my vision board method",
    preheader: `The Vision Board Workbook from The Guide to Living in Abundance, ${formatPrice(vb.price)}.`,
    body: (u) => `
Hi,

Over the last ten days I have shared the short version of how I make a vision board. The long version lives in my Vision Board Workbook, the same one my Guide students use.

It walks you through writing one page about the life you are calling in, then building a board that says exactly that and hanging it where it works on you every day. One afternoon, with fill-in pages all the way.

${vb.includes.map((i) => "- " + i).join("\n")}

[Get the Vision Board Workbook, ${formatPrice(vb.price)}](${u}/workbooks/${vb.slug})

${sign}`,
  },
  "vb-5": {
    key: "vb-5",
    subject: "Want me to look at your room?",
    preheader: "A written plan for one room, from me, based on your photos.",
    body: (u) => `
Hi,

Sometimes a room needs a second pair of eyes. You have the board, you know what you want, and the room still does not feel like it.

Send me photos and a rough floor plan of one room, tell me what you want it to support, and I will send you a written plan: what to move, what to change, what to add, and why.

[Book a virtual room review, ${formatPrice(rr.price)}](${u}/room-review)

${sign}`,
  },

  // Declutter challenge list
  "dc-0": {
    key: "dc-0",
    subject: "You're in: the 5-day declutter challenge",
    preheader: `Day one arrives the morning of ${site.challengeStart}. Here is how to get ready.`,
    body: () => `
Hi there,

You are in. Thank you for joining me.

Here is how it works: one short email each morning for five days, one small space each day, about fifteen minutes each. You do not have to finish everything, and you do not have to throw away anything you love.

To get ready, find three things: a bag or box for donations, a bag for trash, and one song you love. Play the song when you start. When it ends, you are allowed to stop.

See you on day one.

${sign}`,
  },
  "dc-0-late": {
    key: "dc-0-late",
    subject: "You're in: the 5-day declutter challenge",
    preheader: "Day one arrives tomorrow morning. Here is how to get ready.",
    body: () => `
Hi there,

You are in. Thank you for joining me. Your five days start tomorrow morning.

Here is how it works: one short email each morning for five days, one small space each day, about fifteen minutes each. You do not have to finish everything, and you do not have to throw away anything you love.

To get ready, find three things: a bag or box for donations, a bag for trash, and one song you love. Play the song when you start. When it ends, you are allowed to stop.

See you tomorrow.

${sign}`,
  },
  "dc-wait": {
    key: "dc-wait",
    subject: "While you wait: make room for your board",
    preheader: "A small warm-up before the challenge starts.",
    body: (u) => `
Hi,

The challenge starts ${site.challengeStart}, and on day five we clear the spot where your vision board will live. If you do not have a board yet, now is a lovely time to make one.

[Make your vision board with the free template](${u}${pages.template.path})

${sign}`,
  },
  "dc-1": {
    key: "dc-1",
    subject: "Day 1: your nightstand",
    preheader: "The first and last thing you see every day.",
    body: () => `
Good morning,

Day one: your nightstand. It holds the first and last things you see each day, so it sets the tone for both.

Take everything off it. Put back only what you actually use at night, and one thing you love: a photo, a small plant, a candle, a stone. Everything else goes somewhere else, today.

Notice how you feel getting into bed tonight.

${sign}`,
  },
  "dc-2": {
    key: "dc-2",
    subject: "Day 2: one kitchen drawer",
    preheader: "Just one. Really.",
    body: () => `
Good morning,

Day two: one kitchen drawer. Just one. I have watched clearing a single drawer change how someone feels about their whole kitchen.

Empty it completely. Wipe it out. Put back only what you use and what works. Anything broken, duplicated or forgotten goes in the bag.

${sign}`,
  },
  "dc-3": {
    key: "dc-3",
    subject: "Day 3: your entry",
    preheader: "Everything comes in through the door, including you.",
    body: () => `
Good morning,

Day three: your entry. Everything comes into your home through the door, including you, so the first few feet should feel like a welcome.

Clear the floor. Give keys, bags and mail one home each. If there is a surface, leave something on it that makes you glad to walk in.

${sign}`,
  },
  "dc-4": {
    key: "dc-4",
    subject: "Day 4: one closet category",
    preheader: "Keep the ones you reach for.",
    body: () => `
Good morning,

Day four: one closet category. Most of us wear a small part of our wardrobe most of the time.

Pick one category, like jeans, sweaters or shoes. Take them all out. Keep the ones you reach for and the ones that feel like the person you are becoming. Let the rest go to someone who will wear them.

${sign}`,
  },
  "dc-5": {
    key: "dc-5",
    subject: "Day 5: the spot you avoid",
    preheader: "And a home for your vision board.",
    body: (u) => `
Good morning,

Day five: the spot you avoid. Every home has one. Take it slowly. Fifteen minutes is enough to start, and starting is the whole point.

Then finish by clearing one more place: the wall or surface where your vision board will live. If you do not have one yet, here is my free template.

[Make your vision board](${u}${pages.template.path})

You did it. Five small spaces, five days. I am proud of you.

${sign}`,
  },
  "dc-6": {
    key: "dc-6",
    subject: "If you want to keep going",
    preheader: `The Declutter Workbook from The Guide to Living in Abundance, ${formatPrice(dc.price)}.`,
    body: (u) => `
Hi,

A few of you have asked what comes after the five days. This is it: my Declutter Workbook, the full version of what we just did together.

${dc.includes.map((i) => "- " + i).join("\n")}

It works at your pace, one room at a time, and it never asks you to give up the things that inspire you.

[Get the Declutter Workbook, ${formatPrice(dc.price)}](${u}/workbooks/${dc.slug})

${sign}`,
  },
  "dc-7": {
    key: "dc-7",
    subject: "Want me to look at your room?",
    preheader: "A written plan for one room, from me, based on your photos.",
    body: (u) => `
Hi,

Now that you have cleared some space, you might be looking at a room and wondering what it should become.

Send me photos and a rough floor plan, tell me what you want the room to support, and I will send you a written plan: what to move, what to change, what to add, and why.

[Book a virtual room review, ${formatPrice(rr.price)}](${u}/room-review)

${sign}`,
  },
};

// Purchase emails. Not part of a sequence: sent once, when Stripe confirms payment.
export function workbookDelivery(slug: string, name: string, links: { label: string; url: string }[]): EmailDef {
  return {
    key: `order-${slug}`,
    subject: `Your ${name}`,
    preheader: "Your download links are inside.",
    body: () => `
Hi,

Thank you for your order. Here is your ${name}:

${links.map((l) => `- [${l.label}](${l.url})`).join("\n")}

These links are yours for a year. Save the files somewhere you will find them, and print the pages you want to write on.

If anything does not open, just reply to this email.

${sign}`,
  };
}

export function roomReviewConfirmation(session: string): EmailDef {
  return {
    key: `order-room-review-${session.slice(-10)}`,
    subject: "Your room review: what to send me",
    preheader: "Reply to this email with your photos and a few answers.",
    body: () => `
Hi,

Thank you for booking a virtual room review. I cannot wait to see your space.

Reply to this email with:

- Four to six photos of the room, taken from each doorway and corner, in daylight
- A rough floor plan with measurements: a sketch on paper is perfect
- What you want this room to support in your life, in a sentence or two
- Anything you cannot change, like a rental wall color or a bed you love

I send your written plan within [TURNAROUND] of receiving your photos, and you can ask me follow-up questions by email.

${sign}`,
  };
}

export type ListName = "vision-board" | "declutter-challenge";

const DAY = 86_400_000;
const HOUR = 3_600_000;
const MORNING = 12.5 * HOUR; // 12:30 UTC, just before the daily cron at 13:00 UTC (5am Pacific, 8am Eastern)

// The morning n days after a date, so every sequence email lands with the same daily cron run.
function morning(from: number, n: number): number {
  const d = new Date(from + n * DAY);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) + MORNING;
}

function challengeStart(joined: number): number {
  const official = Date.parse(site.challengeStartISO + "T00:00:00Z") + MORNING;
  return Math.max(official, morning(joined, 1)); // late joiners start their own five days the next morning
}

// The welcome email for a new subscriber: the January welcome, or "you start tomorrow" for late joiners.
export function welcomeKey(list: ListName, joined: Date): string {
  if (list === "vision-board") return "vb-0";
  const j = joined.getTime();
  return challengeStart(j) > morning(j, 1) ? "dc-0" : "dc-0-late";
}

// The sequence emails a subscriber should have received by `now`, in order, with the time each falls due.
export function schedule(list: ListName, joined: Date, now: Date): { key: string; due: number }[] {
  const j = joined.getTime();
  const out: { key: string; due: number }[] = [{ key: welcomeKey(list, joined), due: j }];
  if (list === "vision-board") {
    out.push(
      { key: "vb-1", due: morning(j, 2) },
      { key: "vb-2", due: morning(j, 4) },
      { key: "vb-3", due: morning(j, 7) },
      { key: "vb-4", due: morning(j, 10) },
      { key: "vb-5", due: morning(j, 14) },
    );
  } else {
    const start = challengeStart(j);
    if (start - j > 4 * DAY) out.push({ key: "dc-wait", due: morning(j, 3) });
    for (let n = 1; n <= 5; n++) out.push({ key: `dc-${n}`, due: start + (n - 1) * DAY });
    out.push({ key: "dc-6", due: start + 6 * DAY }, { key: "dc-7", due: start + 9 * DAY });
  }
  return out.filter((e) => e.due <= now.getTime());
}
