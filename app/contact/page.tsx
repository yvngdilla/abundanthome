import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Nancy Swanton",
  description:
    "Get in touch with interior designer Nancy Swanton about the workbooks, a virtual room review, press or anything else about Abundant Home.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <div className="wrap">
      <div className="contact">
        <div className="contact-intro">
          <p className="eyebrow">Contact</p>
          <h1>Let&rsquo;s connect</h1>
          <p className="lede">
            Questions about a workbook, your order or a room review? A press or collaboration idea? Send Nancy a note and
            she will write back by email, usually within two business days.
          </p>
          <div className="contact-direct">
            <p className="eyebrow">Prefer email?</p>
            <p>
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </p>
          </div>
          <ul className="contact-links">
            <li>
              Looking for a workbook download? <Link href="/account">Sign in to your account</Link> with the email you
              used at checkout.
            </li>
            <li>
              Want Nancy&rsquo;s eye on a room? See the <Link href="/room-review">virtual room review</Link>.
            </li>
            <li>
              Follow along on <a href={site.instagram} rel="noopener">Instagram</a> and{" "}
              <a href={site.pinterest} rel="noopener">Pinterest</a>.
            </li>
          </ul>
        </div>
        <ContactForm email={site.contactEmail} />
      </div>
    </div>
  );
}
