import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { getDashboard } from "@/lib/admin/data";
import { BarList, Stat, StackedColumns } from "@/components/admin/charts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

// Chart colors: brand-family hues, checked for color-blind separation (see the dataviz validator).
const C = { returning: "#2f5d7c", fresh: "#7aa067", vision: "#2f5d7c", declutter: "#c98a3d", bar: "#2f5d7c", warm: "#c98a3d", green: "#7aa067" };

const pct = (n: number) => `${Math.round(n * 100)}%`;
const money = (cents: number) => "$" + Math.round(cents / 100).toLocaleString("en-US");

export default async function AdminPage() {
  if (!(await isAdmin()) && process.env.ADMIN_DEMO !== "1") redirect("/admin/login");
  const d = await getDashboard();
  const updated = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="adm">
      <div className="wrap">
        <header className="adm-head">
          <div>
            <p className="eyebrow">Abundant Home</p>
            <h1>Admin</h1>
            <p className="adm-sub">Last 30 days, Pacific time · updated {updated}</p>
          </div>
          <form method="post" action="/api/admin/logout"><button className="btn btn-ghost" type="submit">Sign out</button></form>
        </header>

        {d.demo && <p className="adm-note"><strong>Sample data.</strong> ADMIN_DEMO is on, so these numbers are made up to preview the layout.</p>}
        {!d.demo && d.missing.length > 0 && (
          <p className="adm-note"><strong>Not collecting yet:</strong> {d.missing.join(", ")}. Apply the analytics migration in Supabase to fill these in.</p>
        )}

        <div className="adm-grid2">
          <section className="adm-panel">
            <h2>Email sign-ups</h2>
            <p className="adm-sub">New subscribers per day, by list</p>
            <div className="adm-stats">
              <Stat label="New sign-ups" value={d.signups.last30.toLocaleString()} delta={d.signups.last30 - d.signups.prev30} note="vs prior 30 days" />
              <Stat label="Subscribed" value={d.signups.active.toLocaleString()} note={`${d.signups.total.toLocaleString()} ever`} />
              {d.signups.byList.map((l, i) => (
                <Stat key={l.list} label={l.list === "vision-board" ? "Vision board list" : "Declutter list"} value={l.total.toLocaleString()} note={`+${l.last30} in 30 days`} tone={i === 0 ? "water" : "earth"} />
              ))}
            </div>
            <StackedColumns
              label="Email sign-ups per day"
              data={d.signups.perDay}
              series={[
                { key: "vision-board", label: "Vision board template", color: C.vision },
                { key: "declutter-challenge", label: "Declutter challenge", color: C.declutter },
              ]}
            />
          </section>

          <section className="adm-panel">
            <h2>Daily active visitors</h2>
            <p className="adm-sub">Distinct visitors per day, admin excluded</p>
            <div className="adm-stats">
              <Stat label="Active today" value={d.active.today.toLocaleString()} note="so far this PT day" />
              <Stat label="Weekly active" value={d.active.wau.toLocaleString()} delta={d.active.wau - d.active.wauPrev} note="last 7 days" />
              <Stat label="Monthly active" value={d.active.mau.toLocaleString()} delta={d.active.mau - d.active.mauPrev} note="last 30 days" />
              <Stat label="Stickiness" value={pct(d.active.stickiness)} note="avg daily ÷ monthly" />
            </div>
            <StackedColumns
              label="Daily active visitors, new and returning"
              data={d.active.perDay}
              series={[
                { key: "returning", label: "Returning", color: C.returning },
                { key: "new", label: "New (first week)", color: C.fresh },
              ]}
            />
          </section>
        </div>

        <section className="adm-panel">
          <h2>Where sign-ups come from</h2>
          <p className="adm-sub">Last 30 days. Channel is how the person first arrived on the site, not the page they signed up on.</p>
          <div className="adm-grid3">
            <BarList title="Signed up on" items={d.signups.sourcePages} color={C.bar} unit="sign-ups" />
            <BarList title="Channel" items={d.signups.channels} color={C.warm} unit="sign-ups" />
            <BarList title="Country" items={d.signups.countries} color={C.green} unit="sign-ups" />
          </div>
        </section>

        <section className="adm-panel">
          <h2>Workbooks and the room review</h2>
          <p className="adm-sub">Orders, revenue and downloads</p>
          <div className="adm-stats">
            <Stat label="Orders" value={d.shop.orders30.toLocaleString()} note={`last 30 days · ${d.shop.ordersAll} all time`} />
            <Stat label="Revenue" value={money(d.shop.revenue30)} note={`last 30 days · ${money(d.shop.revenueAll)} all time`} tone="wood" />
            <Stat label="Free template downloads" value={d.shop.templateDownloads30.toLocaleString()} note={`last 30 days · ${d.shop.templateDownloadsAll} all time`} />
            <Stat label="Sign-up to order" value={d.signups.last30 ? pct(d.shop.orders30 / d.signups.last30) : "–"} note="orders ÷ new sign-ups" />
          </div>
          <table className="adm-table">
            <thead>
              <tr><th>Product</th><th>Orders</th><th>Revenue</th><th>Workbook downloads</th></tr>
            </thead>
            <tbody>
              {d.shop.byProduct.map((p) => (
                <tr key={p.slug}>
                  <td>{p.name}</td>
                  <td>{p.orders}</td>
                  <td>{money(p.revenue)}</td>
                  <td>{p.slug === "room-review" ? "–" : p.downloads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="adm-panel">
          <h2>Audience</h2>
          <p className="adm-sub">Visitors in the last 30 days ({d.active.views30.toLocaleString()} page views). Location comes from Vercel; no IP addresses are stored.</p>
          <div className="adm-grid3">
            <BarList title="How they found us" items={d.audience.channels} color={C.warm} unit="visitors" />
            <BarList title="Country" items={d.audience.countries} color={C.green} unit="visitors" />
            <BarList title="US state" items={d.audience.regions} color={C.green} unit="visitors" />
            <BarList title="Top pages" items={d.audience.pages} color={C.bar} unit="views" />
            <BarList title="Device" items={d.audience.devices} color={C.bar} unit="visitors" />
          </div>
        </section>

        <p className="adm-foot">Counts come from the site&apos;s own first-party tracking (production only; bots and Do Not Track skipped). Visitors are counted per browser, so one person on a phone and a laptop counts twice. Google Analytics, Vercel Analytics and Clarity keep running alongside for deeper dives.</p>
      </div>
    </div>
  );
}
