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

export function StackedColumns({ data, series, height = 230, label }: { data: ({ date: string } & Record<string, number | string>)[]; series: Series[]; height?: number; label: string }) {
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
  const labelled = new Set([peak, data.length - 1]);
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

export function Stat({ label, value, note, delta, tone }: { label: string; value: string; note?: string; delta?: number | null; tone?: "wood" | "earth" | "water" | "fire" }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-k">{label}</div>
      <div className={`adm-stat-v${tone ? " t-" + tone : ""}`}>
        {value}
        {delta != null && delta !== 0 && <span className={delta > 0 ? "up" : "down"}>{delta > 0 ? "+" : "−"}{Math.abs(delta).toLocaleString()}</span>}
      </div>
      {note && <div className="adm-stat-n">{note}</div>}
    </div>
  );
}
