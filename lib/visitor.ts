// Request details for first-party analytics. Vercel adds the geo headers; no IP address is kept.

export function geo(req: Request): { country: string | null; region: string | null; city: string | null } {
  const h = req.headers;
  const dec = (v: string | null) => {
    if (!v) return null;
    try {
      return decodeURIComponent(v).slice(0, 80);
    } catch {
      return v.slice(0, 80);
    }
  };
  return { country: dec(h.get("x-vercel-ip-country")), region: dec(h.get("x-vercel-ip-country-region")), city: dec(h.get("x-vercel-ip-city")) };
}

export function device(req: Request): "mobile" | "tablet" | "desktop" {
  const ua = req.headers.get("user-agent") || "";
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablet";
  if (/Mobi|iPhone|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

export function isBot(req: Request): boolean {
  const ua = req.headers.get("user-agent") || "";
  return !ua || /bot|crawl|spider|slurp|preview|fetch|monitor|headless|lighthouse|vercel|curl|wget|python|axios/i.test(ua);
}

export function referrerHost(ref: unknown, ownHost?: string): string | null {
  if (typeof ref !== "string" || !ref) return null;
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (ownHost && host === ownHost.replace(/^www\./, "")) return null; // internal navigation
    return host.slice(0, 120);
  } catch {
    return null;
  }
}

export function clean(v: unknown, n: number): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null;
}
