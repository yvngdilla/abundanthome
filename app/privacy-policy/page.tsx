import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Abundant Home collects and uses information on this website.",
  alternates: { canonical: "/privacy-policy" },
};

export default function Page() {
  return (
    <div className="wrap">
      <div className="prose" style={{ padding: "48px 0" }}>
        <p className="eyebrow">Last updated November 14, 2026</p>
        <h1>Privacy policy</h1>
        <p style={{ marginTop: 24 }}>
          This policy explains what information Abundant Home (abundanthomedesign.com) collects when you use this website,
          and what we do with it.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Your email address</strong>, when you sign up for the declutter challenge or our emails, along with the
            page you signed up on and how you found us (for example, the referring site or campaign).
          </li>
          <li>
            <strong>Usage information</strong>, such as the pages you visit, how you move around a page, your device and
            browser type, and your approximate location. We collect this with Google Analytics, Microsoft Clarity and
            Vercel Web Analytics, which may use cookies or similar technology. We also keep our own simple count of
            page visits and downloads, tied to a random ID stored in your browser (not your name, email or IP address),
            with your approximate country, region and device type. If your browser sends Do Not Track or Global
            Privacy Control, we skip it.
          </li>
          <li>
            <strong>Your account</strong>, if you create one: your email address, and your name if you sign in with
            Google or Apple. We use it to show your workbooks and email settings. You can ask us to delete it anytime.
          </li>
          <li>
            <strong>Purchases.</strong> When you buy a workbook or room review, Stripe handles payment. We receive your
            email address, what you bought and the amount, never your card details.
          </li>
          <li>
            <strong>Not your photos.</strong> Images you add to the vision board template stay in your browser. They are
            never uploaded to us.
          </li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To send you the emails you signed up for. Every email has an unsubscribe link.</li>
          <li>To understand which pages are useful and improve the site.</li>
        </ul>
        <p>We do not sell your personal information.</p>

        <h2>Who we share it with</h2>
        <p>
          We use service providers to run the site and send email: Vercel (hosting and analytics), Supabase (storing
          sign-ups), Google Analytics, Microsoft Clarity and our email provider. They process information on our behalf.
          Microsoft Clarity and Google may also use the data they collect as described in their own privacy policies.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>Unsubscribe from emails at any time using the link in any email.</li>
          <li>Block or delete cookies in your browser settings.</li>
          <li>
            Ask us to access or delete the information we hold about you by emailing{" "}
            <a href="mailto:connect@abundanthomedesign.com">connect@abundanthomedesign.com</a>. California residents have
            these rights under the CCPA.
          </li>
        </ul>

        <h2>Children</h2>
        <p>This site is not intended for children under 13, and we do not knowingly collect their information.</p>

        <h2>Changes</h2>
        <p>If we change this policy, we will update the date at the top of this page.</p>
      </div>
    </div>
  );
}
