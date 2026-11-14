import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { previews } from "@/lib/email/preview";
import { sendingEnabled } from "@/lib/email/send";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Emails", robots: { index: false, follow: false } };

// Every email the site sends, exactly as it will look, with sample data. Nothing on this page sends anything.
export default async function AdminEmailsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const groups = previews();
  return (
    <div className="adm">
      <div className="wrap">
        <header className="adm-head">
          <div>
            <p className="eyebrow">Abundant Home</p>
            <h1>Emails</h1>
            <p className="adm-sub">
              {groups.reduce((n, g) => n + g.items.length, 0)} emails · sending is {sendingEnabled() ? "ON" : "off"} · <Link href="/admin">Back to admin</Link>
            </p>
          </div>
        </header>
        {groups.map((g) => (
          <section className="adm-panel" key={g.name} style={{ marginBottom: 24 }}>
            <h2>{g.name}</h2>
            <p className="adm-sub">{g.trigger}</p>
            {g.items.map((e) => (
              <details key={e.key} style={{ borderTop: "1px solid var(--metal)", padding: "12px 0" }}>
                <summary style={{ cursor: "pointer" }}>
                  <strong>{e.subject}</strong>
                  <span className="adm-sub" style={{ display: "block" }}>{e.when} · {e.preheader}</span>
                </summary>
                <iframe title={e.subject} srcDoc={e.html} sandbox="" loading="lazy" style={{ width: "100%", maxWidth: 680, height: 900, border: "1px solid var(--metal)", borderRadius: 4, marginTop: 12, background: "#f6f2ea" }} />
              </details>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
