import { site } from "@/lib/site";
import { products, formatPrice } from "@/lib/shop";

// The Abundant Home email template. Every email the site sends goes through render(): the drip sequences,
// the welcome emails, order emails and the account sign-in emails.
//
// Bodies are written as plain lines (see lib/email/content.ts):
//   "## "                a heading
//   "- "                 a bullet
//   "[Button text](url)" alone on a line: a button. If the email has design.product and the link goes to that
//                        product's page, the button becomes a product card (name, one-liner, price, button).
//   "[text](url)"        inside a line: a link
//   A last line of "Nancy" (with the line before it as the sign-off) becomes the signature.
//
// The look follows the brand book: paper background, white card, DM Serif Display headings (Georgia where web
// fonts are blocked), the doorway arch, one element accent per email, navy buttons and the mantra band.
// Everything is tables and inline styles so it holds up in Gmail, Apple Mail and Outlook.

export type Accent = "wood" | "fire" | "earth" | "water";

export type Design = {
  eyebrow: string; // small caps line above the headline
  title?: string; // headline; defaults to the subject line
  accent?: Accent; // element color for this email (default wood)
  day?: number; // 1 to 5: shows the challenge progress arches
  product?: string; // product slug: turns that product's button into a product card
};

const C = {
  paper: "#f6f2ea",
  white: "#fffdf9",
  water: "#23313f",
  wood: "#5e7154",
  fire: "#a8452f",
  earth: "#c9a46a",
  muted: "#4a5663",
  metal: "#d9d6cf",
};

const ACCENTS: Record<Accent, { bg: string; on: string; logo: "paper" | "water" }> = {
  wood: { bg: C.wood, on: C.paper, logo: "paper" },
  fire: { bg: C.fire, on: C.paper, logo: "paper" },
  earth: { bg: C.earth, on: C.water, logo: "water" },
  water: { bg: C.water, on: C.paper, logo: "paper" },
};

const SERIF = "'DM Serif Display',Georgia,'Times New Roman',serif";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(s: string): string {
  return esc(s).replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, t, u) => `<a href="${u}" style="color:${C.fire};text-decoration:underline">${t}</a>`,
  );
}

function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${C.water}" style="background:${C.water};border-radius:4px"><a href="${url}" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:16px;line-height:1.25;font-weight:bold;color:${C.paper};text-decoration:none;border-radius:4px">${esc(label)}</a></td></tr></table>`;
}

function bulletList(items: string[], color: string): string {
  const rows = items
    .map(
      (b) =>
        `<tr><td valign="top" width="22" style="padding:0 0 10px;font-size:16px;line-height:1.6;color:${color}">&#9670;</td><td valign="top" style="padding:0 0 10px;font-family:${SANS};font-size:16px;line-height:1.6;color:${C.water}">${inline(b)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px">${rows}</table>`;
}

function productCard(slug: string, label: string, url: string, accent: string): string | null {
  const p = products[slug];
  if (!p) return null;
  const kicker = p.kind === "service" ? "Work with Nancy" : "From The Guide to Living in Abundance";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 28px"><tr>
<td width="4" bgcolor="${accent}" style="background:${accent};font-size:0;line-height:0">&nbsp;</td>
<td bgcolor="${C.paper}" style="background:${C.paper};padding:22px 22px 24px">
<p style="margin:0 0 8px;font-family:${SANS};font-size:12px;line-height:1.4;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted}">${kicker}</p>
<p style="margin:0 0 8px;font-family:${SERIF};font-size:24px;line-height:1.2;color:${C.water}">${esc(p.name)}</p>
<p style="margin:0 0 14px;font-family:${SANS};font-size:15px;line-height:1.55;color:${C.muted}">${esc(p.short)}</p>
<p style="margin:0 0 16px;font-family:${SERIF};font-size:22px;line-height:1.2;color:${C.water}">${formatPrice(p.price)}</p>
${button(label.replace(/,\s*\$[\d.,]+$/, ""), url)}
</td></tr></table>`;
}

function body(raw: string, design: Design, accent: string): string {
  const lines = raw.trim().split("\n").map((l) => l.trim());
  // Signature: the last line is the name, the line before it the sign-off.
  let signature = "";
  if (lines.length >= 2 && lines[lines.length - 1] === "Nancy") {
    const closing = lines[lines.length - 2];
    lines.splice(-2, 2);
    signature = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 0"><tr><td style="padding:18px 0 0;border-top:2px solid ${C.earth}">
<p style="margin:0 0 2px;font-family:${SANS};font-size:16px;line-height:1.6;color:${C.water}">${esc(closing)}</p>
<p style="margin:0;font-family:${SERIF};font-style:italic;font-size:26px;line-height:1.2;color:${C.water}">Nancy</p>
<p style="margin:4px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.muted}">${esc(site.author.name)} · ${esc(site.author.role)}</p>
</td></tr></table>`;
  }

  const blocks: string[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) {
      blocks.push(bulletList(bullets, accent));
      bullets = [];
    }
  };
  const p = (html: string) => `<p style="margin:0 0 18px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.water}">${html}</p>`;
  for (const line of lines) {
    if (!line) { flush(); continue; }
    if (line.startsWith("- ")) { bullets.push(line.slice(2)); continue; }
    flush();
    const btn = line.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (line.startsWith("## ")) {
      blocks.push(`<h2 style="margin:28px 0 10px;font-family:${SERIF};font-weight:normal;font-size:24px;line-height:1.2;color:${C.water}">${inline(line.slice(3))}</h2>`);
    } else if (btn) {
      const prod = design.product ? products[design.product] : undefined;
      const isProductLink = prod && (btn[2].endsWith(`/workbooks/${prod.slug}`) || btn[2].endsWith(`/${prod.slug}`));
      const card = isProductLink ? productCard(prod.slug, btn[1], btn[2], accent) : null;
      blocks.push(card ?? `<div style="margin:26px 0 28px">${button(btn[1], btn[2])}</div>`);
    } else {
      blocks.push(p(inline(line)));
    }
  }
  flush();
  return blocks.join("\n") + signature;
}

// The doorway arch at the top of the card, holding the AH monogram.
function arch(a: (typeof ACCENTS)[Accent]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center" valign="bottom" width="84" height="104" bgcolor="${a.bg}" style="width:84px;height:104px;background:${a.bg};border-radius:42px 42px 3px 3px;padding:0 0 22px">
<img src="${site.url}/brand/ah-monogram-${a.logo}.png" width="50" height="22" alt="Abundant Home" style="display:block;border:0;margin:0 auto">
</td></tr></table>`;
}

// Five small arches for the declutter challenge: filled up to today.
function progress(day: number, a: (typeof ACCENTS)[Accent]): string {
  const cells = [1, 2, 3, 4, 5]
    .map((n) => {
      const on = n <= day;
      const today = n === day;
      const w = today ? 46 : 36;
      const h = today ? 58 : 46;
      return `<td valign="bottom" style="padding:0 5px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" valign="bottom" width="${w}" height="${h}" ${on ? `bgcolor="${a.bg}"` : ""} style="width:${w}px;height:${h}px;${on ? `background:${a.bg};` : `border:1px solid ${C.metal};`}border-radius:${w / 2}px ${w / 2}px 3px 3px;padding:0 0 ${today ? 10 : 8}px;font-family:${SERIF};font-size:${today ? 24 : 17}px;line-height:1;color:${on ? a.on : C.muted}">${n}</td></tr></table></td>`;
    })
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" aria-label="Day ${day} of 5"><tr>${cells}</tr></table>`;
}

export type RenderOptions = {
  subject: string;
  preheader: string;
  body: string;
  design: Design;
  unsubscribeUrl?: string | null; // marketing emails only
  reason?: string; // footer line: why the person is getting this email
};

export function render(opts: RenderOptions): { html: string; text: string } {
  const d = opts.design;
  const a = ACCENTS[d.accent ?? "wood"];
  const title = d.title ?? opts.subject;
  const host = site.url.replace(/^https?:\/\//, "");
  const address = process.env.MAILING_ADDRESS || "[MAILING ADDRESS]";
  const reason = opts.reason ?? `You are getting this because you signed up at ${host}.`;
  const footLink = (label: string, url: string) => `<a href="${url}" style="color:${C.muted};text-decoration:underline">${label}</a>`;
  const manage = opts.unsubscribeUrl
    ? `<p style="margin:10px 0 0">${footLink("Unsubscribe", opts.unsubscribeUrl)} &nbsp;·&nbsp; ${footLink("Choose which emails you get", site.url + "/account")}</p>`
    : "";

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>${esc(opts.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
<style>
body{margin:0;padding:0;-webkit-text-size-adjust:100%}
img{border:0}
@media (max-width:620px){
.ah-outer{padding:18px 0 32px!important}
.ah-card{border-left:0!important;border-right:0!important;border-radius:0!important}
.ah-pad{padding-left:24px!important;padding-right:24px!important}
.ah-h1{font-size:29px!important}
}
</style></head>
<body style="margin:0;padding:0;background:${C.paper}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${esc(opts.preheader)}${"&nbsp;&zwnj;".repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.paper}" style="background:${C.paper}"><tr><td align="center" class="ah-outer" style="padding:28px 16px 40px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">

<tr><td align="center" style="padding:6px 0 20px;font-family:${SERIF};font-size:15px;line-height:1;letter-spacing:3.5px;text-transform:uppercase;color:${C.water}"><a href="${site.url}" style="color:${C.water};text-decoration:none">Abundant Home</a></td></tr>

<tr><td class="ah-card" bgcolor="${C.white}" style="background:${C.white};border:1px solid ${C.metal};border-top:4px solid ${a.bg};border-radius:4px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" class="ah-pad" style="padding:36px 48px 0">
${d.day ? progress(d.day, a) : arch(a)}
<p style="margin:24px 0 10px;font-family:${SANS};font-size:12px;line-height:1.4;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${C.muted}">${esc(d.eyebrow)}</p>
<h1 class="ah-h1" style="margin:0;font-family:${SERIF};font-weight:normal;font-size:34px;line-height:1.15;color:${C.water}">${esc(title)}</h1>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td height="18" style="height:18px;font-size:0;line-height:0">&nbsp;</td></tr><tr><td width="56" height="2" bgcolor="${C.earth}" style="width:56px;height:2px;background:${C.earth};font-size:0;line-height:0;padding:0">&nbsp;</td></tr></table>
</td></tr>
<tr><td class="ah-pad" style="padding:30px 48px 40px">
${body(opts.body, d, a.bg)}
</td></tr>
</table>
</td></tr>

<tr><td style="font-size:0;line-height:0;height:16px">&nbsp;</td></tr>

<tr><td class="ah-card ah-pad" align="center" bgcolor="${C.water}" style="background:${C.water};border-radius:4px;padding:30px 40px 32px">
<p style="margin:0 0 10px;font-family:${SERIF};font-style:italic;font-size:22px;line-height:1.3;color:${C.paper}">&ldquo;${esc(site.mantra)}&rdquo;</p>
<p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.4;letter-spacing:2px;text-transform:uppercase;color:${C.earth}">${esc(site.author.name)}</p>
</td></tr>

<tr><td align="center" class="ah-pad" style="padding:28px 24px 0;font-family:${SANS};font-size:13px;line-height:1.6;color:${C.muted}">
<img src="${site.url}/brand/ah-monogram-water.png" width="54" height="24" alt="Abundant Home" style="display:block;border:0;margin:0 auto 10px">
<p style="margin:0 0 12px;font-family:${SERIF};font-style:italic;font-size:17px;line-height:1.3;color:${C.water}">${esc(site.tagline)}</p>
<p style="margin:0 0 12px">${footLink("Website", site.url)} &nbsp;·&nbsp; ${footLink("Instagram", site.instagram)} &nbsp;·&nbsp; ${footLink("Pinterest", site.pinterest)}</p>
<p style="margin:0">${esc(reason)}</p>
<p style="margin:4px 0 0">Abundant Home · ${esc(address)}</p>
${manage}
</td></tr>

</table></td></tr></table></body></html>`;

  const text = [
    title !== opts.subject ? title + "\n" : "",
    opts.body
      .trim()
      .replace(/^## /gm, "")
      .replace(/^\[([^\]]+)\]\(([^)]+)\)$/gm, "$1: $2")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)"),
    "",
    "--",
    `"${site.mantra}"`,
    reason,
    "Abundant Home · " + address,
    opts.unsubscribeUrl ? "Unsubscribe: " + opts.unsubscribeUrl : "",
  ]
    .filter((l, i) => i !== 0 || l)
    .join("\n");

  return { html, text };
}
