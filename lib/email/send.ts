// Sends email through Resend. Server only.
//
// Nothing is sent unless EMAIL_SENDING_ENABLED is "true" in Vercel. Until then every send is logged and skipped,
// so the whole system can be tested without a single email reaching a real person.

export const FROM = process.env.EMAIL_FROM || "Nancy at Abundant Home <nancy@abundanthomedesign.com>";
export const REPLY_TO = process.env.EMAIL_REPLY_TO || "nancy@abundanthomedesign.com";

export function sendingEnabled(): boolean {
  return process.env.EMAIL_SENDING_ENABLED === "true" && Boolean(process.env.RESEND_API_KEY);
}

export type Outgoing = {
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl?: string | null;
  tag: string; // which email this is, e.g. "vb-1", for Resend's dashboard
  replyTo?: string; // defaults to REPLY_TO
};

export type SendResult = { sent: boolean; id?: string; skipped?: string; error?: string };

export async function sendEmail(m: Outgoing): Promise<SendResult> {
  if (!sendingEnabled()) {
    console.log(`email skipped (sending off): ${m.tag} to ${m.to.replace(/(.).+@/, "$1***@")}`);
    return { sent: false, skipped: "sending is switched off" };
  }
  const headers: Record<string, string> = {};
  if (m.unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${m.unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [m.to],
        reply_to: m.replyTo || REPLY_TO,
        subject: m.subject,
        html: m.html,
        text: m.text,
        headers,
        tags: [{ name: "email", value: m.tag.replace(/[^a-zA-Z0-9_-]/g, "_") }],
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { sent: false, error: json?.message || `Resend ${res.status}` };
    return { sent: true, id: json.id };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "send failed" };
  }
}
