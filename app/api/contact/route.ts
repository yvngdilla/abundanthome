import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { sendEmail, sendingEnabled } from "@/lib/email/send";

// Contact form: emails the message to site.contactEmail, with Reply-To set to the sender
// so answering it in the inbox goes straight back to them. Nothing is stored.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOPICS = new Set(["General question", "Workbook or order help", "Virtual room review", "Press or collaboration"]);

function clip(v: unknown, n: number): string {
  return typeof v === "string" ? v.trim().slice(0, n) : "";
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Spam checks: a hidden field real people never fill, and forms sent faster than a person could type.
  if (clip(body.company, 200)) return NextResponse.json({ ok: true });
  const started = Number(body.t);
  if (Number.isFinite(started) && Date.now() - started < 3000) return NextResponse.json({ ok: true });

  const name = clip(body.name, 120);
  const email = clip(body.email, 254).toLowerCase();
  const topic = TOPICS.has(clip(body.topic, 60)) ? clip(body.topic, 60) : "General question";
  const message = clip(body.message, 5000);

  if (!name) return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (message.length < 5) return NextResponse.json({ error: "Please write a short message." }, { status: 400 });
  if ((message.match(/https?:\/\//g) || []).length > 3) {
    return NextResponse.json({ error: "Please send links by email instead." }, { status: 400 });
  }

  if (!sendingEnabled()) {
    return NextResponse.json(
      { error: `The form is not open yet. Please email ${site.contactEmail} directly.` },
      { status: 503 },
    );
  }

  const page = clip(body.path, 300);
  const text = `${message}\n\n---\nFrom: ${name} <${email}>\nTopic: ${topic}\nSent from ${site.url}${page || "/contact"}`;
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#22313f">
<p style="white-space:pre-wrap;margin:0 0 20px">${esc(message)}</p>
<p style="border-top:1px solid #ddd;padding-top:12px;color:#666;font-size:13px;margin:0">
From: ${esc(name)} &lt;${esc(email)}&gt;<br>Topic: ${esc(topic)}<br>Sent from the contact form on ${esc(site.url.replace(/^https?:\/\//, ""))}
</p></div>`;

  const result = await sendEmail({
    to: site.contactEmail,
    subject: `${topic}: ${name}`,
    html,
    text,
    replyTo: email,
    tag: "contact-form",
  });

  if (!result.sent) {
    console.error("contact: send failed", result.error || result.skipped);
    return NextResponse.json(
      { error: `Something went wrong. Please email ${site.contactEmail} directly.` },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
