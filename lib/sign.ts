import { createHmac, timingSafeEqual } from "node:crypto";

// Signed, tamper-proof tokens for download links and unsubscribe links. Server only.
// SIGNING_SECRET is a long random string set in Vercel; changing it invalidates every link already sent.

function secret(): string | null {
  return process.env.SIGNING_SECRET || null;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

export function sign(payload: object): string | null {
  const key = secret();
  if (!key) return null;
  const body = b64url(JSON.stringify(payload));
  const mac = createHmac("sha256", key).update(body).digest("base64url");
  return `${body}.${mac}`;
}

export function verify<T>(token: string | null | undefined): T | null {
  const key = secret();
  if (!key || !token) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = createHmac("sha256", key).update(body).digest();
  const given = Buffer.from(mac, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T & { exp?: number };
    if (data.exp && Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

const YEAR = 365 * 86_400_000;

export function downloadUrl(base: string, session: string, product: string, file: string): string | null {
  const t = sign({ s: session, p: product, f: file, exp: Date.now() + YEAR });
  return t ? `${base}/api/download?t=${t}` : null;
}

export function unsubscribeUrl(base: string, email: string): string | null {
  const t = sign({ e: email.toLowerCase() });
  return t ? `${base}/api/unsubscribe?t=${t}` : null;
}
