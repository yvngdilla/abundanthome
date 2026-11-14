"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/track";

type Kind = "image" | "word";
type CellDef = { x: number; y: number; w: number; h: number; label: string; kind: Kind };
type LayoutDef = { cols: number; rows: number; cells: CellDef[] };
type Orientation = "portrait" | "landscape";

type SizeId = "phone" | "desktop" | "print";
const SIZES: Record<SizeId, { label: string; w: number; h: number; orientation: Orientation }> = {
  phone: { label: "Phone wallpaper", w: 1080, h: 1920, orientation: "portrait" },
  desktop: { label: "Desktop background", w: 1920, h: 1080, orientation: "landscape" },
  print: { label: "Printable page", w: 1650, h: 2550, orientation: "portrait" },
};

type LayoutId = "nine" | "focus" | "months";
const LAYOUT_NAMES: Record<LayoutId, string> = {
  nine: "Nine squares",
  focus: "One big dream",
  months: "Twelve months",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function layout(id: LayoutId, o: Orientation): LayoutDef {
  const c = (x: number, y: number, w: number, h: number, label: string, kind: Kind = "image"): CellDef => ({ x, y, w, h, label, kind });
  if (id === "nine") {
    return o === "portrait"
      ? { cols: 2, rows: 5, cells: [c(0, 0, 1, 1, "Home"), c(1, 0, 1, 1, "Love"), c(0, 1, 1, 1, "Work"), c(1, 1, 1, 1, "Money"),
          c(0, 2, 2, 1, "Word of the year", "word"), c(0, 3, 1, 1, "Health"), c(1, 3, 1, 1, "Travel"), c(0, 4, 1, 1, "Joy"), c(1, 4, 1, 1, "Growth")] }
      : { cols: 3, rows: 3, cells: [c(0, 0, 1, 1, "Home"), c(1, 0, 1, 1, "Love"), c(2, 0, 1, 1, "Work"), c(0, 1, 1, 1, "Money"),
          c(1, 1, 1, 1, "Word of the year", "word"), c(2, 1, 1, 1, "Health"), c(0, 2, 1, 1, "Travel"), c(1, 2, 1, 1, "Joy"), c(2, 2, 1, 1, "Growth")] };
  }
  if (id === "focus") {
    return o === "portrait"
      ? { cols: 2, rows: 6, cells: [c(0, 0, 2, 2, "Your biggest dream"), c(0, 2, 2, 1, "Your word", "word"),
          c(0, 3, 1, 1, "Feeling"), c(1, 3, 1, 1, "Place"), c(0, 4, 1, 1, "Person"), c(1, 4, 1, 1, "Ritual"), c(0, 5, 2, 1, "I am...", "word")] }
      : { cols: 4, rows: 3, cells: [c(0, 0, 2, 3, "Your biggest dream"), c(2, 0, 2, 1, "Your word", "word"),
          c(2, 1, 1, 1, "Feeling"), c(3, 1, 1, 1, "Place"), c(2, 2, 1, 1, "Person"), c(3, 2, 1, 1, "Ritual")] };
  }
  return o === "portrait"
    ? { cols: 3, rows: 4, cells: MONTHS.map((m, i) => c(i % 3, Math.floor(i / 3), 1, 1, m)) }
    : { cols: 4, rows: 3, cells: MONTHS.map((m, i) => c(i % 4, Math.floor(i / 4), 1, 1, m)) };
}

const BACKGROUNDS = [
  { name: "Paper", value: "#f6f2ea", ink: "#23313f" },
  { name: "Water", value: "#23313f", ink: "#f6f2ea" },
  { name: "Wood", value: "#5e7154", ink: "#f6f2ea" },
  { name: "Earth", value: "#c9a46a", ink: "#23313f" },
  { name: "Blush", value: "#ead3cb", ink: "#23313f" },
];

const WORD_FILLS = [
  { name: "Water", bg: "#23313f", ink: "#f6f2ea" },
  { name: "Paper", bg: "#f6f2ea", ink: "#23313f" },
  { name: "Wood", bg: "#5e7154", ink: "#f6f2ea" },
  { name: "Fire", bg: "#a8452f", ink: "#f6f2ea" },
  { name: "Earth", bg: "#c9a46a", ink: "#23313f" },
  { name: "Metal", bg: "#d9d6cf", ink: "#23313f" },
];

type CellContent = { src?: string; text?: string; fill?: number };

const PADDING = 0.045; // of the shorter side
const GAP = 0.018;

function rects(def: LayoutDef, W: number, H: number) {
  const pad = Math.min(W, H) * PADDING;
  const gap = Math.min(W, H) * GAP;
  const cw = (W - pad * 2 - gap * (def.cols - 1)) / def.cols;
  const ch = (H - pad * 2 - gap * (def.rows - 1)) / def.rows;
  return def.cells.map((cell) => ({
    x: pad + cell.x * (cw + gap),
    y: pad + cell.y * (ch + gap),
    w: cell.w * cw + (cell.w - 1) * gap,
    h: cell.h * ch + (cell.h - 1) * gap,
  }));
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function VisionBoardMaker() {
  const [sizeId, setSizeId] = useState<SizeId>("phone");
  const [layoutId, setLayoutId] = useState<LayoutId>("nine");
  const [bg, setBg] = useState(0);
  const [content, setContent] = useState<Record<string, CellContent>>({});
  const [active, setActive] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const fontProbe = useRef<HTMLSpanElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const size = SIZES[sizeId];
  const def = useMemo(() => layout(layoutId, size.orientation), [layoutId, size.orientation]);
  const boxes = useMemo(() => rects(def, size.w, size.h), [def, size.w, size.h]);
  const key = (i: number) => `${layoutId}:${size.orientation}:${i}`;
  const background = BACKGROUNDS[bg];

  useEffect(() => setActive(null), [layoutId, sizeId]);

  function update(i: number, patch: CellContent) {
    setContent((prev) => ({ ...prev, [key(i)]: { ...prev[key(i)], ...patch } }));
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || active === null) return;
    const reader = new FileReader();
    const i = active;
    reader.onload = () => update(i, { src: String(reader.result), text: undefined });
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function download() {
    setBusy(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = size.w;
      canvas.height = size.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      await document.fonts.ready;
      const serif = fontProbe.current ? getComputedStyle(fontProbe.current).fontFamily : "Georgia, serif";

      ctx.fillStyle = background.value;
      ctx.fillRect(0, 0, size.w, size.h);

      for (let i = 0; i < def.cells.length; i++) {
        const r = boxes[i];
        const cell = def.cells[i];
        const c = content[key(i)] || {};
        if (c.src) {
          const img = await loadImage(c.src);
          const scale = Math.max(r.w / img.width, r.h / img.height);
          const sw = r.w / scale;
          const sh = r.h / scale;
          ctx.save();
          ctx.beginPath();
          ctx.rect(r.x, r.y, r.w, r.h);
          ctx.clip();
          ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, r.x, r.y, r.w, r.h);
          ctx.restore();
          continue;
        }
        const text = c.text?.trim();
        const isWord = cell.kind === "word" || Boolean(text);
        if (!text && !isWord) {
          // Empty image cell: a quiet outline with its label, so a printed board can be filled by hand.
          ctx.strokeStyle = background.ink + "55";
          ctx.lineWidth = Math.max(2, size.w / 600);
          ctx.strokeRect(r.x, r.y, r.w, r.h);
          ctx.fillStyle = background.ink + "88";
          ctx.font = `italic ${Math.round(Math.min(r.w, r.h) * 0.09)}px ${serif}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(cell.label, r.x + r.w / 2, r.y + r.h / 2);
          continue;
        }
        const fill = WORD_FILLS[c.fill ?? 0];
        ctx.fillStyle = fill.bg;
        ctx.fillRect(r.x, r.y, r.w, r.h);
        const words = text || cell.label;
        let fontSize = Math.min(r.h * 0.42, r.w * 0.16);
        let lines: string[] = [];
        for (; fontSize > 12; fontSize *= 0.9) {
          ctx.font = `italic 500 ${Math.round(fontSize)}px ${serif}`;
          lines = wrap(ctx, words, r.w * 0.84);
          if (lines.length * fontSize * 1.15 <= r.h * 0.8) break;
        }
        ctx.fillStyle = text ? fill.ink : fill.ink + "99";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const total = lines.length * fontSize * 1.15;
        lines.forEach((ln, li) => ctx.fillText(ln, r.x + r.w / 2, r.y + r.h / 2 - total / 2 + fontSize * 1.15 * (li + 0.5)));
      }

      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vision-board-${sizeId}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      const filled = def.cells.filter((_, i) => content[key(i)]?.src || content[key(i)]?.text).length;
      track("board_download", { size: sizeId, layout: layoutId, filled });
    } finally {
      setBusy(false);
    }
  }

  const activeCell = active !== null ? def.cells[active] : null;
  const activeContent = active !== null ? content[key(active)] || {} : {};

  return (
    <div className="vbm">
      <span ref={fontProbe} className="serif" aria-hidden="true" style={{ position: "absolute", visibility: "hidden" }}>a</span>
      <input ref={fileInput} type="file" accept="image/*" onChange={onFile} hidden />

      <div className="vbm-controls">
        <fieldset>
          <legend>Size</legend>
          {(Object.keys(SIZES) as SizeId[]).map((id) => (
            <label key={id} className={sizeId === id ? "on" : ""}>
              <input type="radio" name="size" checked={sizeId === id} onChange={() => setSizeId(id)} />
              {SIZES[id].label}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Layout</legend>
          {(Object.keys(LAYOUT_NAMES) as LayoutId[]).map((id) => (
            <label key={id} className={layoutId === id ? "on" : ""}>
              <input type="radio" name="layout" checked={layoutId === id} onChange={() => setLayoutId(id)} />
              {LAYOUT_NAMES[id]}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Background</legend>
          <div className="vbm-swatches">
            {BACKGROUNDS.map((b, i) => (
              <button key={b.name} type="button" aria-label={b.name} aria-pressed={bg === i}
                style={{ background: b.value }} onClick={() => setBg(i)} />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="vbm-stage">
        <div
          className="vbm-board"
          style={{ aspectRatio: `${size.w} / ${size.h}`, background: background.value, ["--ar" as string]: size.w / size.h } as React.CSSProperties}
        >
          {def.cells.map((cell, i) => {
            const r = boxes[i];
            const c = content[key(i)] || {};
            const fill = WORD_FILLS[c.fill ?? 0];
            const isText = !c.src && (cell.kind === "word" || c.text);
            return (
              <button
                key={key(i)}
                type="button"
                className={`vbm-cell${active === i ? " active" : ""}${!c.src && !isText ? " empty" : ""}`}
                style={{
                  left: `${(r.x / size.w) * 100}%`, top: `${(r.y / size.h) * 100}%`,
                  width: `${(r.w / size.w) * 100}%`, height: `${(r.h / size.h) * 100}%`,
                  backgroundImage: c.src ? `url(${c.src})` : undefined,
                  backgroundColor: !c.src && isText ? fill.bg : undefined,
                  color: !c.src && isText ? fill.ink : background.ink,
                  borderColor: background.ink + "55",
                }}
                onClick={() => setActive(i)}
                aria-label={`Edit ${cell.label}`}
              >
                {!c.src && <span className={c.text ? "" : "hint"}>{c.text || cell.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="vbm-panel">
          {activeCell === null ? (
            <p>Tap any square on the board to add a photo or your own words. Your photos stay on your device: nothing is uploaded.</p>
          ) : (
            <>
              <p className="eyebrow">Editing: {activeCell.label}</p>
              <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
                {activeContent.src ? "Change photo" : "Add a photo"}
              </button>
              <label className="vbm-text">
                Or write words
                <textarea
                  rows={3}
                  maxLength={120}
                  placeholder={activeCell.kind === "word" ? "Ease. Home. Bold." : "I wake up in a home I love."}
                  value={activeContent.text || ""}
                  onChange={(e) => update(active!, { text: e.target.value, src: undefined })}
                />
              </label>
              <div className="vbm-swatches" aria-label="Word background">
                {WORD_FILLS.map((f, i) => (
                  <button key={f.name} type="button" aria-label={f.name} aria-pressed={(activeContent.fill ?? 0) === i}
                    style={{ background: f.bg }} onClick={() => update(active!, { fill: i })} />
                ))}
              </div>
              {(activeContent.src || activeContent.text) && (
                <button type="button" className="btn btn-ghost" onClick={() => update(active!, { src: undefined, text: undefined })}>
                  Clear square
                </button>
              )}
            </>
          )}
          <hr />
          <button type="button" className="btn" onClick={download} disabled={busy} style={{ width: "100%" }}>
            {busy ? "Making your board..." : `Download ${SIZES[sizeId].label.toLowerCase()}`}
          </button>
          <p className="vbm-note">
            Empty squares download as labeled outlines, so a printed board can be filled in by hand.
          </p>
        </div>
      </div>
    </div>
  );
}
