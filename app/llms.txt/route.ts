import { pages, site, type PageMeta } from "@/lib/site";
import { formatPrice, products, workbooks } from "@/lib/shop";

// /llms.txt (llmstxt.org): a plain summary of the site for AI assistants and answer engines.
// Built from the same page list as the sitemap, so new pages are listed automatically.
export const dynamic = "force-static";

const sectionOrder: PageMeta["section"][] = ["Vision boards", "Free tools", "Your home", "Free challenge"];

function body(): string {
  const all = Object.values(pages);
  const sections = sectionOrder
    .map((name) => {
      const items = all.filter((p) => p.section === name);
      if (!items.length) return "";
      const lines = items.map((p) => `- [${p.title}](${site.url}${p.path}): ${p.description}`);
      return `## ${name}\n\n${lines.join("\n")}`;
    })
    .filter(Boolean);

  return [
    `# ${site.name}`,
    "",
    `> ${site.tagline}. ${site.description}`,
    "",
    `${site.name} is written by ${site.author.name}, an ${site.author.role.toLowerCase()}. ${site.author.bio}`,
    "",
    "The site covers vision boards (ideas, a step-by-step method and a free template), color and layout for the bedroom, and decluttering, all from a designer's point of view: a clear reason behind every color, placement and object, and advice that works in a rental. It is design guidance, not financial, medical or professional advice.",
    "",
    ...sections.flatMap((s) => [s, ""]),
    "## Workbooks and services",
    "",
    `- [Workbooks](${site.url}/workbooks): Printable workbooks from ${site.author.name}'s program, The Guide to Living in Abundance.`,
    ...workbooks.map((w) => `- [${w.name}](${site.url}/workbooks/${w.slug}): ${formatPrice(w.price)}. ${w.short}`),
    `- [Virtual room review](${site.url}/room-review): ${formatPrice(products["room-review"].price)}. ${products["room-review"].short}`,
    "",
    "## About",
    "",
    `- [Home](${site.url}/): Start here: from writing your vision, to making a board, to making your room match it.`,
    `- [Privacy policy](${site.url}/privacy-policy): How sign-up emails are stored and used.`,
    "",
    "## Optional",
    "",
    `- [Instagram](${site.instagram}): Rooms, boards and color ideas.`,
    `- [Pinterest](${site.pinterest}): Vision board and bedroom inspiration.`,
    "",
  ].join("\n");
}

export function GET() {
  return new Response(body(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
