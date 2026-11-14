export const site = {
  name: "Abundant Home",
  tagline: "Manifest at home",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.abundanthomedesign.com").replace(/\/$/, ""),
  description:
    "Interior designer Nancy Swanton shows you how to make your home support what you are manifesting: vision boards, color, layout and the rooms you live in.",
  author: {
    name: "Nancy Swanton",
    role: "Interior designer",
    bio: "Nancy Swanton has spent more than 20 years designing homes, offices and hospitality spaces in Los Angeles. She created The Guide to Living in Abundance to bring a designer's process to people who practice manifestation.",
  },
  instagram: "https://www.instagram.com/abundant.home/",
  pinterest: "https://www.pinterest.com/abundant_home/",
  // The January reset challenge start date. Change here to move it everywhere.
  challengeStart: "Monday, January 4",
};

export type PageMeta = { path: string; title: string; description: string };

export const pages = {
  ideas: {
    path: "/vision-board-ideas",
    title: "Vision Board Ideas: 40 Ideas From an Interior Designer",
    description:
      "Vision board ideas for every part of your life, plus formats, layouts and the details a designer adds so your board actually gets looked at every day.",
  },
  howTo: {
    path: "/how-to-make-a-vision-board",
    title: "How to Make a Vision Board in 9 Steps",
    description:
      "A designer's step by step method for making a vision board, from writing your vision first to placing the finished board where you will see it every day.",
  },
  template: {
    path: "/vision-board-template",
    title: "Free Vision Board Template (Printable and Phone Wallpaper)",
    description:
      "A free vision board template you fill in online. Add your own photos and affirmations, then download it as a phone wallpaper, a desktop background or a printable page.",
  },
  bedroomColors: {
    path: "/bedroom-colors",
    title: "Bedroom Colors: How to Choose a Paint Color for What You Want Next",
    description:
      "How to choose bedroom colors and paint with intention, from a designer's color palettes for love, rest, money and creativity to feng shui color meanings and how to test paint.",
  },
  challenge: {
    path: "/declutter-challenge",
    title: "The 5-Day Declutter Challenge for a Fresh Start",
    description:
      "A free 5-day declutter challenge by email. Fifteen minutes a day to clear the spots in your home that hold you back, starting in January.",
  },
} satisfies Record<string, PageMeta>;
