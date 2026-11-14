import Link from "next/link";
import { formatPrice, workbookFor } from "@/lib/shop";

// A quiet offer at the end of an article for the workbook that goes deeper on the same topic.
export function WorkbookCTA({ path }: { path: string }) {
  const w = workbookFor(path);
  if (!w) return null;
  return (
    <aside className="workbook-cta">
      <p className="eyebrow">Go deeper</p>
      <h2>{w.name}</h2>
      <p>{w.short}</p>
      <Link className="btn" href={`/workbooks/${w.slug}`}>See what is inside · {formatPrice(w.price)}</Link>
    </aside>
  );
}
