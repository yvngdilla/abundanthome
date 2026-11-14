import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser, displayName } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase";
import { products, workbooks } from "@/lib/shop";
import { downloadUrl } from "@/lib/sign";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your account", robots: { index: false, follow: false } };

type Order = { stripe_session_id: string; product: string; created_at: string };
type Sub = { list: string; unsubscribed_at: string | null };

const LISTS = [
  { list: "vision-board", name: "Vision board notes", about: "Short notes from Nancy on making your board and your home work for what you want next." },
  { list: "declutter-challenge", name: "5-day declutter challenge", about: `One email a day for five days, starting ${site.challengeStart}, then occasional notes.` },
];

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/account/sign-in?next=/account");
  const email = (user.email || "").toLowerCase();
  const db = supabaseAdmin();

  let orders: Order[] = [];
  let subs: Sub[] = [];
  if (db && email) {
    const o = await db.from("orders").select("stripe_session_id,product,created_at").eq("email", email).order("created_at", { ascending: false });
    orders = (o.data ?? []) as Order[];
    let s = await db.from("subscribers").select("list,unsubscribed_at").eq("email", email);
    if (s.error) s = (await db.from("subscribers").select("list").eq("email", email)) as typeof s;
    subs = ((s.data ?? []) as Sub[]).map((x) => ({ list: x.list, unsubscribed_at: x.unsubscribed_at ?? null }));
  }

  const owned = new Map<string, Order>();
  for (const o of orders) if (!owned.has(o.product)) owned.set(o.product, o);
  const myWorkbooks = workbooks.filter((w) => owned.has(w.slug));
  const reviews = orders.filter((o) => o.product === "room-review");
  const notOwned = workbooks.filter((w) => !owned.has(w.slug));
  const date = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="account">
      <section className="hero">
        <div className="wrap account-head">
          <div>
            <p className="eyebrow">Your account</p>
            <h1>Hello, {displayName(user).split(" ")[0]}</h1>
            <p className="adm-sub">Signed in as {user.email}</p>
          </div>
          <form method="post" action="/api/account/sign-out"><button className="btn btn-ghost" type="submit">Sign out</button></form>
        </div>
      </section>

      <div className="wrap account-body">
        <section className="account-panel">
          <h2>Your workbooks</h2>
          {myWorkbooks.length === 0 ? (
            <p className="adm-empty">
              No workbooks yet. Bought one with a different email? Sign in with that email instead, or reply to your order
              email and Nancy will help.
            </p>
          ) : (
            <ul className="library">
              {myWorkbooks.map((w) => {
                const o = owned.get(w.slug)!;
                return (
                  <li key={w.slug}>
                    <div>
                      <h3>{w.name}</h3>
                      <p className="adm-sub">Bought {date(o.created_at)}</p>
                    </div>
                    <div className="library-files">
                      {w.files.map((f) => (
                        <a key={f.file} className="btn btn-accent" href={downloadUrl(site.url, o.stripe_session_id, w.slug, f.file) ?? "#"}>Download</a>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {reviews.length > 0 && (
            <>
              <h3 className="account-sub">Room reviews</h3>
              <ul className="library">
                {reviews.map((r) => (
                  <li key={r.stripe_session_id}>
                    <div>
                      <h3>{products["room-review"].name}</h3>
                      <p className="adm-sub">Booked {date(r.created_at)}. Reply to Nancy&apos;s email with your photos and floor plan.</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          {notOwned.length > 0 && (
            <p className="account-more">
              More from the Guide:{" "}
              {notOwned.map((w, i) => (
                <span key={w.slug}>{i > 0 && " · "}<Link href={`/workbooks/${w.slug}`}>{w.name.replace(/^The /, "")}</Link></span>
              ))}
            </p>
          )}
        </section>

        <section className="account-panel" id="emails">
          <h2>Your emails</h2>
          <ul className="email-prefs">
            {LISTS.map((l) => {
              const row = subs.find((s) => s.list === l.list);
              const on = Boolean(row && !row.unsubscribed_at);
              return (
                <li key={l.list}>
                  <div>
                    <h3>{l.name}</h3>
                    <p className="adm-sub">{l.about}</p>
                  </div>
                  <form method="post" action="/api/account/emails">
                    <input type="hidden" name="list" value={l.list} />
                    <input type="hidden" name="action" value={on ? "unsubscribe" : "subscribe"} />
                    <button type="submit" className={on ? "btn btn-ghost" : "btn"}>{on ? "Turn off" : "Turn on"}</button>
                  </form>
                </li>
              );
            })}
          </ul>
          <p className="adm-sub">Order emails, like your download links, always come through.</p>
        </section>
      </div>
    </div>
  );
}
