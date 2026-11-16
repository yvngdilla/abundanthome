import { site } from "@/lib/site";
import { unsubscribeUrl } from "@/lib/sign";
import { supabaseAdmin } from "@/lib/supabase";
import { render } from "@/lib/email/layout";
import { sendEmail, type SendResult } from "@/lib/email/send";
import type { EmailDef } from "@/lib/email/content";
import { ensureProfile } from "@/lib/profiles";

// Renders one email, sends it, and records the send so the same email never goes to the same person twice.
// Marketing emails carry an unsubscribe link; order emails do not (they are transactional).
export async function deliver(
  to: string,
  def: EmailDef,
  opts: { list?: string; marketing: boolean },
): Promise<SendResult> {
  const unsub = opts.marketing ? unsubscribeUrl(site.url, to) : null;
  if (opts.marketing && !unsub) return { sent: false, skipped: "SIGNING_SECRET is not set" };
  const { html, text } = render({
    subject: def.subject,
    preheader: def.preheader,
    body: def.body(site.url),
    design: def.design,
    unsubscribeUrl: unsub,
    reason: opts.marketing ? undefined : `You are getting this because you placed an order at ${site.url.replace(/^https?:\/\//, "")}.`,
  });
  const result = await sendEmail({ to, subject: def.subject, html, text, unsubscribeUrl: unsub, tag: def.key });
  if (result.sent) {
    const db = supabaseAdmin();
    if (db) {
      const profile = await ensureProfile(db, to);
      await db
        .from("email_sends")
        .upsert({ email: to, email_key: def.key, list: opts.list ?? null, resend_id: result.id ?? null, profile_id: profile }, { onConflict: "email,email_key", ignoreDuplicates: true });
    }
  }
  return result;
}
