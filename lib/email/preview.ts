import { site } from "@/lib/site";
import { products } from "@/lib/shop";
import { render } from "@/lib/email/layout";
import { emails, authEmails, workbookDelivery, roomReviewConfirmation, type EmailDef } from "@/lib/email/content";

// Every email the site sends, rendered with sample data, grouped by flow. Used by /admin/emails and by
// scripts/build-emails.ts. Nothing here sends anything.

export type Preview = { key: string; when: string; subject: string; preheader: string; html: string; text: string };
export type PreviewGroup = { name: string; trigger: string; items: Preview[] };

const host = site.url.replace(/^https?:\/\//, "");

function one(def: EmailDef, when: string, kind: "marketing" | "order" | "account"): Preview {
  const { html, text } = render({
    subject: def.subject,
    preheader: def.preheader,
    body: def.body(site.url),
    design: def.design,
    unsubscribeUrl: kind === "marketing" ? `${site.url}/api/unsubscribe?t=preview` : null,
    reason:
      kind === "order"
        ? `You are getting this because you placed an order at ${host}.`
        : kind === "account"
          ? `You are getting this because someone asked to sign in at ${host} with this email address.`
          : undefined,
  });
  return { key: def.key, when, subject: def.subject, preheader: def.preheader, html, text };
}

export function previews(): PreviewGroup[] {
  const m = (key: string, when: string) => one(emails[key], when, "marketing");
  const vb = products["vision-board-workbook"];
  return [
    {
      name: "Vision board list",
      trigger: "Joins through the email gate on the free vision board template",
      items: [
        m("vb-0", "Right away"),
        m("vb-1", "Day 2"),
        m("vb-2", "Day 4"),
        m("vb-3", "Day 7"),
        m("vb-4", "Day 10"),
        m("vb-5", "Day 14"),
      ],
    },
    {
      name: "Declutter challenge list",
      trigger: "Joins through any declutter challenge form or the popup",
      items: [
        m("dc-0", "Right away (before the challenge starts)"),
        m("dc-0-late", "Right away (joined after the January start)"),
        m("dc-wait", "3 days after joining, if the challenge is more than 4 days off"),
        m("dc-1", "Challenge day 1"),
        m("dc-2", "Challenge day 2"),
        m("dc-3", "Challenge day 3"),
        m("dc-4", "Challenge day 4"),
        m("dc-5", "Challenge day 5"),
        m("dc-6", "2 days after the challenge"),
        m("dc-7", "5 days after the challenge"),
      ],
    },
    {
      name: "Orders",
      trigger: "Stripe confirms a payment",
      items: [
        one(
          workbookDelivery(vb.slug, vb.name, vb.files.map((f) => ({ label: f.label, url: `${site.url}/api/download?t=preview` }))),
          "Workbook bought (same layout for all four workbooks)",
          "order",
        ),
        one(roomReviewConfirmation("cs_preview_0000000000"), "Room review booked", "order"),
      ],
    },
    {
      name: "Account",
      trigger: "Asks for a sign-in link on the sign-in page (sent by Supabase)",
      items: [
        one(authEmails["auth-magic-link"], "Returning person signs in by email", "account"),
        one(authEmails["auth-confirm-signup"], "First sign-in with a new email", "account"),
      ],
    },
  ];
}
