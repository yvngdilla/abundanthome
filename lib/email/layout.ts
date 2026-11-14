import { site } from "@/lib/site";

// Turns a simple email body into branded HTML and a plain-text version.
// Bodies are written as lines: a line starting with "## " is a heading, "- " a bullet,
// "[Button text](url)" alone on a line a button, and "[text](url)" inside a line a link.

const C = { paper: "#f6f2ea", water: "#23313f", earth: "#c9a46a", muted: "#4a5663", metal: "#d9d6cf" };

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(s: string): string {
  return esc(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}" style="color:${C.water};text-decoration:underline">${t}</a>`);
}

export function render(opts: { preheader: string; body: string; unsubscribeUrl?: string | null }): { html: string; text: string } {
  const lines = opts.body.trim().split("\n");
  const blocks: string[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) {
      blocks.push(`<ul style="margin:0 0 18px;padding-left:20px">${bullets.map((b) => `<li style="margin:0 0 8px">${inline(b)}</li>`).join("")}</ul>`);
      bullets = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    const button = line.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (line.startsWith("- ")) { bullets.push(line.slice(2)); continue; }
    flush();
    if (line.startsWith("## ")) {
      blocks.push(`<h2 style="margin:28px 0 10px;font-family:Georgia,serif;font-weight:normal;font-size:24px;line-height:1.2;color:${C.water}">${inline(line.slice(3))}</h2>`);
    } else if (button) {
      blocks.push(`<p style="margin:24px 0"><a href="${button[2]}" style="display:inline-block;background:${C.water};color:${C.paper};text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:4px">${esc(button[1])}</a></p>`);
    } else {
      blocks.push(`<p style="margin:0 0 18px">${inline(line)}</p>`);
    }
  }
  flush();

  const address = process.env.MAILING_ADDRESS || "[MAILING ADDRESS]";
  const unsub = opts.unsubscribeUrl
    ? `<a href="${opts.unsubscribeUrl}" style="color:${C.muted}">Unsubscribe</a>`
    : "";

  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${C.paper}">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:${C.water}">
<tr><td style="padding:0 0 24px;border-bottom:1px solid ${C.metal}">
<img src="${site.url}/brand/ah-monogram-water.png" width="68" height="30" alt="Abundant Home" style="display:block">
</td></tr>
<tr><td style="padding:28px 0 8px">${blocks.join("\n")}</td></tr>
<tr><td style="padding:24px 0 0;border-top:1px solid ${C.metal};font-size:13px;line-height:1.5;color:${C.muted}">
<p style="margin:0 0 6px;font-family:Georgia,serif;font-style:italic;font-size:16px;color:${C.water}">Manifest at home</p>
<p style="margin:0 0 6px">Abundant Home · ${esc(address)}</p>
<p style="margin:0">You are getting this because you signed up at ${site.url.replace(/^https?:\/\//, "")}. ${unsub}</p>
</td></tr></table></td></tr></table></body></html>`;

  const text = [
    opts.body
      .trim()
      .replace(/^## /gm, "")
      .replace(/^\[([^\]]+)\]\(([^)]+)\)$/gm, "$1: $2")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)"),
    "",
    "--",
    "Abundant Home · " + address,
    opts.unsubscribeUrl ? "Unsubscribe: " + opts.unsubscribeUrl : "",
  ].join("\n");

  return { html, text };
}
