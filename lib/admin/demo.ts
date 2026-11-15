import type { Rows } from "@/lib/admin/data";

// Made-up rows so the dashboard can be previewed before real traffic exists (ADMIN_DEMO=1).
// Never used when real data is available.

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function pick<T>(r: () => number, items: [T, number][]): T {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let x = r() * total;
  for (const [v, w] of items) if ((x -= w) <= 0) return v;
  return items[0][0];
}

export function demoRows(now: Date): Rows {
  const r = rng(42);
  const DAY = 86_400_000;
  const rows: Rows = { subscribers: [], views: [], visitors: [], orders: [], downloads: [] };
  const pages: [string, number][] = [
    ["/vision-board-ideas", 30], ["/how-to-make-a-vision-board", 18], ["/vision-board-template", 16], ["/", 12],
    ["/bedroom-colors", 10], ["/declutter-challenge", 6], ["/workbooks", 3], ["/workbooks/vision-board-workbook", 3], ["/room-review", 1],
  ];
  const refs: [[string | null, string | null], number][] = [
    [["google.com", null], 45], [[null, null], 18], [["pinterest.com", null], 20], [["instagram.com", null], 6], [[null, "newsletter"], 4], [["bing.com", null], 3], [["chatgpt.com", null], 4],
  ];
  const geo: [[string, string | null], number][] = [
    [["US", "CA"], 22], [["US", "NY"], 10], [["US", "TX"], 9], [["US", "FL"], 8], [["US", "IL"], 4], [["US", "WA"], 4], [["US", "AZ"], 3],
    [["CA", "ON"], 7], [["GB", "ENG"], 7], [["AU", "NSW"], 5], [["IE", null], 1], [["NZ", null], 1],
  ];
  const devices: [string, number][] = [["mobile", 64], ["desktop", 30], ["tablet", 6]];
  const pool: { id: string; first: number; ref: [string | null, string | null]; geo: [string, string | null]; device: string }[] = [];
  let n = 0;
  for (let d = 61; d >= 0; d--) {
    const dayStart = now.getTime() - d * DAY;
    const growth = 1 + (61 - d) / 40;
    const fresh = Math.round((6 + r() * 10) * growth * (d % 7 === 1 ? 1.6 : 1));
    for (let i = 0; i < fresh; i++) pool.push({ id: `demo-${n++}`, first: dayStart - r() * DAY * 0.9, ref: pick(r, refs), geo: pick(r, geo), device: pick(r, devices) });
    const visitorsToday = pool.filter((p) => p.first <= dayStart && (p.first > dayStart - DAY || r() < 0.06));
    for (const p of visitorsToday) {
      const at = new Date(Math.min(now.getTime() - 60_000, Math.max(p.first, dayStart - r() * DAY * 0.8))).toISOString();
      const nViews = 1 + Math.floor(r() * 3);
      for (let k = 0; k < nViews; k++) {
        rows.views.push({ visitor_id: p.id, path: pick(r, pages), referrer_host: k === 0 ? p.ref[0] : null, utm_source: k === 0 ? p.ref[1] : null, country: p.geo[0], region: p.geo[1], device: p.device, created_at: at });
      }
      if (p.first > dayStart - DAY && r() < 0.11) {
        const list = r() < 0.62 ? "vision-board" : "declutter-challenge";
        rows.subscribers.push({
          email: `${p.id}@example.com`, list, source_path: list === "vision-board" ? pick(r, [["/vision-board-template", 6], ["/vision-board-ideas", 3], ["/how-to-make-a-vision-board", 2]]) : pick(r, [["/declutter-challenge", 5], ["/", 3], ["/bedroom-colors", 1]]),
          landing_path: null, referrer: p.ref[0] ? `https://${p.ref[0]}/` : null, utm_source: p.ref[1], country: p.geo[0], region: p.geo[1], device: p.device,
          created_at: at, unsubscribed_at: r() < 0.04 ? at : null,
        });
        if (list === "vision-board") rows.downloads.push({ kind: "template", item: "vision-board-template", created_at: at });
      }
      if (r() < 0.012) {
        const product = pick(r, [["vision-board-workbook", 5], ["declutter-workbook", 3], ["color-workbook", 2], ["define-your-style-workbook", 2], ["room-review", 1]]);
        const amount = { "vision-board-workbook": 1900, "declutter-workbook": 1900, "color-workbook": 1700, "define-your-style-workbook": 1700, "room-review": 29700 }[product]!;
        rows.orders.push({ email: `${p.id}@example.com`, product, amount_cents: amount, created_at: at });
        if (product !== "room-review") rows.downloads.push({ kind: "workbook", item: product, created_at: at });
      }
    }
  }
  rows.accounts = rows.orders.map((o) => ({ created_at: o.created_at, email: o.email })).concat(rows.subscribers.filter(() => r() < 0.2).map((x) => ({ created_at: x.created_at, email: x.email })));
  rows.visitors = pool.map((p) => ({ id: p.id, first_seen: new Date(p.first).toISOString(), first_referrer_host: p.ref[0], first_utm_source: p.ref[1] }));
  return rows;
}
