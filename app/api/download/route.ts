import { readFile } from "node:fs/promises";
import path from "node:path";
import { verify } from "@/lib/sign";
import { products } from "@/lib/shop";
import { supabaseAdmin } from "@/lib/supabase";

// Streams a purchased workbook file. The link is signed when the order is paid, so only buyers have one.
// Files live in content/guide/pdfs, which is never served publicly.
export const dynamic = "force-dynamic";

type Token = { s: string; p: string; f: string };

export async function GET(req: Request) {
  const data = verify<Token>(new URL(req.url).searchParams.get("t"));
  const product = data ? products[data.p] : undefined;
  const entry = product?.files.find((f) => f.file === data?.f);
  if (!data || !product || !entry) {
    return new Response("This download link is not valid or has expired. Reply to your order email and Nancy will send a new one.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }
  // Links from Stripe test-mode purchases still download, but aren't counted in the admin stats.
  if (!data.s.startsWith("cs_test_")) {
    await supabaseAdmin()
      ?.from("downloads")
      .insert({ kind: "workbook", item: product.slug, file: entry.file, stripe_session_id: data.s })
      .then(({ error }) => error && console.error("download: log failed", error.message));
  }
  const bytes = await readFile(path.join(process.cwd(), "content", "guide", "pdfs", entry.file));
  const name = `Abundant Home - ${entry.label}.pdf`;
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
