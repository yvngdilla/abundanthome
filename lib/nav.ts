import { pages } from "@/lib/site";
import { workbooks } from "@/lib/shop";

// The site map in one place: the header menus, the mobile menu and the footer all read from this.
export type NavLink = { label: string; href: string; note?: string };
export type NavGroup = { label: string; href?: string; items: NavLink[] };

export const nav: NavGroup[] = [
  {
    label: "Vision boards",
    href: pages.ideas.path,
    items: [
      { label: "Vision board ideas", href: pages.ideas.path, note: "40 ideas from an interior designer" },
      { label: "How to make a vision board", href: pages.howTo.path, note: "The method in 9 steps" },
      { label: "Free vision board template", href: pages.template.path, note: "Make one online in minutes" },
    ],
  },
  {
    label: "Your home",
    href: pages.bedroomColors.path,
    items: [
      { label: "Bedroom colors", href: pages.bedroomColors.path, note: "Choose color for what you want next" },
      { label: "5-day declutter challenge", href: pages.challenge.path, note: "Free, by email, starts in January" },
    ],
  },
  {
    label: "Shop",
    href: "/workbooks",
    items: [
      ...workbooks.map((w) => ({ label: w.name.replace(/^The /, ""), href: `/workbooks/${w.slug}`, note: "Printable workbook" })),
      { label: "Virtual room review", href: "/room-review", note: "A written plan for one room, from Nancy" },
      { label: "See all workbooks", href: "/workbooks" },
    ],
  },
];
