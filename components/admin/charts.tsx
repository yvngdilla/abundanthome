import type { Count } from "@/lib/admin/data";

// Small server-rendered charts for the admin. Thin columns with rounded tops, a 2px surface gap
// between stacked segments, hairline grid, labels in text colors, hover tooltips via <title>.

export type Series = { key: string; label: string; color: string };

const fmtDay = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function niceMax(v: number): { max: number; step: number } {
  if (v <= 4) return { max: 4, step: 1 };
  const raw = v / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  return { max: Math.ceil(v / step) * step, step };
}

export function StackedColumns({ data, series, height = 230, label, labelAll = false }: { data: ({ date: string } & Record<string, number | string>)[]; series: Series[]; height?: number; label: string; labelAll?: boolean }) {
  const W = 480;
  const H = height;
  const pad = { l: 28, r: 4, t: 20, b: 24 };
  const totals = data.map((d) => series.reduce((s, x) => s + Number(d[x.key] || 0), 0));
  const { max, step } = niceMax(Math.max(1, ...totals));
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const band = plotW / data.length;
  const bw = Math.min(11, band * 0.7);
  const y = (v: number) => pad.t + plotH - (v / max) * plotH;
  const peak = totals.indexOf(Math.max(...totals));
  const labelled = labelAll ? new Set(data.map((_, i) => i)) : new Set([peak, data.length - 1]);
  const ticks: number[] = [];
  for (let v = 0; v <= max; v += step) ticks.push(v);

  return (
    <figure className="adm-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="adm-grid" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="adm-tick">{t}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = pad.l + band * i + band / 2;
          let base = 0;
          const segs = series.map((s) => {
            const v = Number(d[s.key] || 0);
            const seg = { s, v, y0: base, y1: base + v };
            base += v;
            return seg;
          }).filter((g) => g.v > 0);
          const tip = `${fmtDay(d.date)}: ${totals[i]} total\n` + series.map((s) => `${s.label}: ${d[s.key] || 0}`).join("\n");
          return (
            <g key={d.date} className="adm-col">
              <title>{tip}</title>
              <rect x={cx - band / 2} y={pad.t} width={band} height={plotH} className="adm-hit" />
              {segs.map((g, k) => {
                const top = y(g.y1) + (k > 0 ? 0 : 0);
                const h = Math.max(0, y(g.y0) - y(g.y1) - (k > 0 ? 2 : 0));
                const last = k === segs.length - 1;
                const r = Math.min(3, h, bw / 2);
                const x0 = cx - bw / 2;
                const path = last
                  ? `M${x0},${top + h} V${top + r} Q${x0},${top} ${x0 + r},${top} H${x0 + bw - r} Q${x0 + bw},${top} ${x0 + bw},${top + r} V${top + h} Z`
                  : `M${x0},${top + h} V${top} H${x0 + bw} V${top + h} Z`;
                return <path key={g.s.key} d={path} fill={g.s.color} />;
              })}
              {labelled.has(i) && totals[i] > 0 && (
                <text x={cx} y={y(totals[i]) - 6} textAnchor="middle" className="adm-val">{totals[i]}</text>
              )}
              {((i % 7 === 0 && data.length - 1 - i >= 4) || i === data.length - 1) && (
                <text x={cx} y={H - 6} textAnchor="middle" className="adm-tick">{fmtDay(d.date)}</text>
              )}
            </g>
          );
        })}
        <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} className="adm-axis" />
      </svg>
      {series.length > 1 && (
        <figcaption className="adm-legend">
          {series.map((s) => (
            <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}

export function BarList({ title, items, color, empty = "No data yet", unit }: { title: string; items: Count[]; color: string; empty?: string; unit?: string }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const total = items.reduce((s, i) => s + i.count, 0);
  return (
    <div className="adm-barlist">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="adm-empty">{empty}</p>
      ) : (
        <ul>
          {items.map((i) => (
            <li key={i.label} title={`${i.label}: ${i.count}${unit ? " " + unit : ""} (${Math.round((i.count / total) * 100)}%)`}>
              <span className="adm-bar" style={{ width: `${(i.count / max) * 100}%`, background: color }} />
              <span className="adm-bl-label">{i.label}</span>
              <span className="adm-bl-val">{i.count.toLocaleString()} <em>{Math.round((i.count / total) * 100)}%</em></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Stat({ label, value, note, delta, tone, color }: { label: string; value: string; note?: string; delta?: number | null; tone?: "wood" | "earth" | "water" | "fire"; color?: string }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-k">{label}</div>
      <div className={`adm-stat-v${tone ? " t-" + tone : ""}`} style={color ? { color } : undefined}>
        {value}
        {delta != null && delta !== 0 && <span className={delta > 0 ? "up" : "down"}>{delta > 0 ? "+" : "−"}{Math.abs(delta).toLocaleString()}</span>}
      </div>
      {note && <div className="adm-stat-n">{note}</div>}
    </div>
  );
}

// Monotone cubic path through points (no overshoot below zero), for the per-day line.
function smoothPath(pts: [number, number][]): string {
  const n = pts.length;
  if (n < 2) return n ? `M${pts[0][0]},${pts[0][1]}` : "";
  const dx = (i: number) => pts[i + 1][0] - pts[i][0];
  const s = pts.slice(0, -1).map((p, i) => (pts[i + 1][1] - p[1]) / dx(i));
  const m = pts.map((_, i) => (i === 0 ? s[0] : i === n - 1 ? s[n - 2] : s[i - 1] * s[i] <= 0 ? 0 : (s[i - 1] + s[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / s[i], b = m[i + 1] / s[i];
    const h = a * a + b * b;
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * s[i]; m[i + 1] = t * b * s[i]; }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx(i) / 3;
    d += ` C${pts[i][0] + h},${pts[i][1] + m[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - m[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

const fmtK = (v: number) => (v >= 1000 ? `${+(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : String(v));

export type GrowthPoint = { date: string; new: number; total: number; accounts: number; buyers: number };
export type ChartEvent = { date: string; label: string; kind: "start" | "end" };

// Grey Market's "New Profiles" chart: new per day as a soft area on the left scale, running totals
// as lines on the right scale, and dashed markers for launches and campaigns.
export function GrowthChart({ data, events = [], label, colors }: { data: GrowthPoint[]; events?: ChartEvent[]; label: string; colors: { daily: string; total: string; accounts: string; buyers: string; start: string; end: string } }) {
  const W = 480;
  const H = 260;
  const pad = { l: 28, r: 40, t: 16, b: 24 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const left = niceMax(Math.max(1, ...data.map((d) => d.new)));
  const leftTicks = Math.round(niceMax(Math.max(1, ...data.map((d) => d.new))).max / niceMax(Math.max(1, ...data.map((d) => d.new))).step);
  // Right scale shares the left scale's gridlines, with its own round step.
  const right = (() => {
    const raw = Math.max(1, ...data.map((d) => d.total)) / leftTicks;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
    const st = Math.max(1, step < 1 ? 1 : step);
    return { max: st * leftTicks, step: st };
  })();
  const step = data.length > 1 ? plotW / (data.length - 1) : 0;
  const x = (i: number) => pad.l + step * i;
  const yl = (v: number) => pad.t + plotH - (v / left.max) * plotH;
  const yr = (v: number) => pad.t + plotH - (v / right.max) * plotH;
  const ticks: number[] = [];
  for (let v = 0; v <= left.max; v += left.step) ticks.push(v);
  const rticks = ticks.map((_, i) => right.step * i);
  const dailyPts = data.map((d, i) => [x(i), yl(d.new)] as [number, number]);
  const daily = smoothPath(dailyPts);
  const area = daily ? `${daily} L${x(data.length - 1)},${yl(0)} L${x(0)},${yl(0)} Z` : "";
  const line = (key: "total" | "accounts" | "buyers") => data.map((d, i) => `${i ? "L" : "M"}${x(i)},${yr(d[key])}`).join(" ");
  const idx = new Map(data.map((d, i) => [d.date, i]));
  const marks = events.filter((e) => idx.has(e.date));
  const lines = [
    { key: "total" as const, label: "Total sign-ups", color: colors.total, w: 2.2 },
    { key: "accounts" as const, label: "Accounts", color: colors.accounts, w: 2 },
    { key: "buyers" as const, label: "Buyers", color: colors.buyers, w: 2 },
  ];

  return (
    <figure className="adm-chart">
      {marks.length > 0 && (
        <div className="adm-marks">
          {marks.some((m) => m.kind === "start") && <span><i style={{ borderColor: colors.start }} />Launch or start</span>}
          {marks.some((m) => m.kind === "end") && <span><i style={{ borderColor: colors.end }} />Ended</span>}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        <defs>
          <linearGradient id="adm-daily" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={colors.daily} stopOpacity="0.16" />
            <stop offset="1" stopColor={colors.daily} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={yl(t)} y2={yl(t)} className="adm-grid" />
            <text x={pad.l - 8} y={yl(t) + 4} textAnchor="end" className="adm-tick">{t}</text>
            <text x={W - pad.r + 8} y={yl(t) + 4} textAnchor="start" className="adm-tick">{fmtK(Math.round(rticks[i]))}</text>
          </g>
        ))}
        {marks.map((m) => (
          <line key={m.date + m.label} x1={x(idx.get(m.date)!)} x2={x(idx.get(m.date)!)} y1={pad.t} y2={yl(0)} stroke={m.kind === "start" ? colors.start : colors.end} strokeWidth="1.2" strokeDasharray="4 3">
            <title>{`${fmtDay(m.date)}: ${m.label}`}</title>
          </line>
        ))}
        {area && <path d={area} fill="url(#adm-daily)" />}
        {daily && <path d={daily} fill="none" stroke={colors.daily} strokeWidth="2" strokeLinejoin="round" />}
        {lines.map((l) => (
          <path key={l.key} d={line(l.key)} fill="none" stroke={l.color} strokeWidth={l.w} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {data.map((d, i) => (
          <g key={d.date} className="adm-col">
            <title>{`${fmtDay(d.date)}\nNew sign-ups: ${d.new}\nTotal sign-ups: ${d.total.toLocaleString()}\nAccounts: ${d.accounts.toLocaleString()}\nBuyers: ${d.buyers.toLocaleString()}`}</title>
            <rect x={x(i) - step / 2} y={pad.t} width={Math.max(step, 1)} height={plotH} className="adm-hit" />
            {((i % 7 === 0 && data.length - 1 - i >= 4) || i === data.length - 1) && (
              <text x={x(i)} y={H - 6} textAnchor="middle" className="adm-tick">{fmtDay(d.date)}</text>
            )}
          </g>
        ))}
        <line x1={pad.l} x2={W - pad.r} y1={yl(0)} y2={yl(0)} className="adm-axis" />
      </svg>
      <figcaption className="adm-legend">
        {lines.map((l) => (
          <span key={l.key} className="ln"><i style={{ background: l.color }} />{l.label}</span>
        ))}
        <span className="ln"><i style={{ background: colors.daily }} />New per day</span>
      </figcaption>
      <p className="adm-chart-note">Left scale: new per day. Right scale: running totals.</p>
    </figure>
  );
}
