// Everything Abundant Home sells. Prices are in US cents. Nancy confirms the final prices before launch.
// Workbook files live in content/guide/pdfs (never served publicly); buyers get signed download links.

export type WorkbookFile = { file: string; label: string };

export type Product = {
  slug: string;
  kind: "workbook" | "service";
  name: string;
  short: string; // one line for cards and checkout
  price: number; // cents
  key?: string; // which key of the guide it comes from
  accent: "wood" | "fire" | "earth";
  intro: string;
  includes: string[];
  forYou: string[];
  files: WorkbookFile[];
  related?: string[]; // article paths that should link here
};

export const products: Record<string, Product> = {
  "vision-board-workbook": {
    slug: "vision-board-workbook",
    kind: "workbook",
    name: "The Vision Board Workbook",
    short: "Write what you want, build a board that says it, and hang it where it works.",
    price: 1900,
    key: "Key 2 of The Guide to Living in Abundance",
    accent: "wood",
    intro:
      "Most vision boards fail for one reason: they start with pictures. Nancy's method starts with words. In one afternoon you write the life you want as if you already live it, build a board that says exactly that, and put it where it works on you every day.",
    includes: [
      "Part 1, Write it: six questions and one page that describes the life you are calling in",
      "Part 2, Build it: five steps and a designer's eye for a board that says exactly that",
      "Part 3, Live with it: where to hang it and the two-minute daily habit",
      "Five printable fill-in pages, from your vision page to an arrivals log",
    ],
    forYou: [
      "You have made vision boards before and they ended up in a drawer",
      "You want your board to look beautiful enough to keep on the wall",
      "You are starting a new year, a new home or a new chapter",
    ],
    files: [{ file: "Vision-Board-Workbook-AH.pdf", label: "The Vision Board Workbook" }],
    related: ["/vision-board-ideas", "/how-to-make-a-vision-board", "/vision-board-template"],
  },
  "define-your-style-workbook": {
    slug: "define-your-style-workbook",
    kind: "workbook",
    name: "The Define Your Style Workbook",
    short: "Find the style that matches the life you are calling in, not this year's trend.",
    price: 1700,
    key: "Key 2 of The Guide to Living in Abundance",
    accent: "earth",
    intro:
      "Your style is not a trend you follow. It is how the life you want looks and feels. This workbook walks you through the music, places, materials and images that light you up, and turns them into a personal style guide you can shop and decorate from.",
    includes: [
      "Part 1, Remember it: the places and outfits that show your real style",
      "Part 2, Name it: turn up to five feelings into one Style Word",
      "Part 3, Use it: the one-question test for every purchase",
      "Three fill-in pages, including a word bank and a style test log",
    ],
    forYou: [
      "You like a lot of styles and cannot tell which one is yours",
      "Your home feels like a mix of things you bought at different times",
      "You want rooms that feel like the future you, not the past you",
    ],
    files: [{ file: "Define-Your-Style-Workbook-AH.pdf", label: "The Define Your Style Workbook" }],
    related: [],
  },
  "declutter-workbook": {
    slug: "declutter-workbook",
    kind: "workbook",
    name: "The Declutter Workbook",
    short: "Clear what holds you back, keep what inspires you, and store the rest with care.",
    price: 1900,
    key: "Key 3 of The Guide to Living in Abundance",
    accent: "fire",
    intro:
      "The full version of the 5-day challenge. Start with an honest, heart-centered look at your home, purge with a purpose rather than a rule, then set up storage that keeps the space clear without hiding the things you love.",
    includes: [
      "Part 1, Look: a heart-centered walk through your home, starting at the front door",
      "Part 2, Clear: the seven-bag method, 15 minutes at a time",
      "Part 3, Keep: active and passive zones, and a home for everything",
      "Three fill-in pages: reality check, Maybe box and home shop, zone plan",
    ],
    forYou: [
      "You finished the 5-day challenge and want to keep going",
      "You feel stuck, and your home feels full",
      "You want to declutter without throwing away the things that matter",
    ],
    files: [{ file: "Declutter-Workbook-AH.pdf", label: "The Declutter Workbook" }],
    related: ["/declutter-challenge"],
  },
  "color-workbook": {
    slug: "color-workbook",
    kind: "workbook",
    name: "The Color Workbook",
    short: "Choose colors for what you want next, with Nancy's color wheel and sensory chart inside.",
    price: 1700,
    key: "Key 5 of The Guide to Living in Abundance",
    accent: "earth",
    intro:
      "Color is the fastest way to change how a room feels, and the easiest place to go wrong. This workbook teaches the color theory a designer uses, why certain colors make you feel the way they do, and how to choose a palette that matches your intentions.",
    includes: [
      "Part 1, Learn it: warm and cool, and how colors work together, in plain words",
      "Part 2, Choose it: a four-color palette built around what you want",
      "Part 3, Use it: where each color goes, and how to test before you paint",
      "Nancy's Abundant Home color wheel and sensory chart, plus two fill-in pages",
    ],
    forYou: [
      "You are about to paint and cannot decide",
      "You love color but your rooms never come together",
      "You want each room's colors to support what you want in it",
    ],
    files: [{ file: "Color-Workbook-AH.pdf", label: "The Color Workbook" }],
    related: ["/bedroom-colors"],
  },
  "room-review": {
    slug: "room-review",
    kind: "service",
    name: "Virtual Room Review with Nancy",
    short: "Send Nancy photos of one room. Get a written plan for what to move, change and add.",
    price: 29700,
    accent: "wood",
    intro:
      "Send photos and a rough floor plan of one room, and tell Nancy what you want that room to support in your life. She sends back a written plan: what to move, what to change, what to add, and why, in the order that makes the biggest difference first.",
    includes: [
      "A short questionnaire about the room and what you want next",
      "Nancy reviews your photos and floor plan personally",
      "A written plan for the room, with the reason behind each change",
      "One round of follow-up questions by email",
    ],
    forYou: [
      "You have one room that never feels right",
      "You are moving into a new place and want to start it well",
      "You want a designer's eye without hiring a designer for a whole project",
    ],
    files: [],
  },
};

export const workbooks = Object.values(products).filter((p) => p.kind === "workbook");

export function formatPrice(cents: number): string {
  return "$" + (cents / 100).toFixed(cents % 100 ? 2 : 0);
}

// The workbook that an article should offer, by the article's path.
export function workbookFor(path: string): Product | undefined {
  return workbooks.find((w) => w.related?.includes(path));
}
