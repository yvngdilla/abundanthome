import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/ProductPage";
import { formatPrice, products, workbooks } from "@/lib/shop";

export const dynamicParams = false;

export function generateStaticParams() {
  return workbooks.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = products[(await params).slug];
  if (!p) return {};
  const title = `${p.name} (${formatPrice(p.price)} Printable PDF)`;
  return {
    title,
    description: `${p.short} From The Guide to Living in Abundance, by interior designer Nancy Swanton.`,
    alternates: { canonical: `/workbooks/${p.slug}` },
    openGraph: { title, description: p.short, url: `/workbooks/${p.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = products[(await params).slug];
  if (!p || p.kind !== "workbook") notFound();
  const faqs = [
    { q: "What do I get?", a: `${p.files.length === 1 ? "A PDF workbook" : `${["", "One", "Two", "Three", "Four"][p.files.length] ?? p.files.length} PDF files`} you download right after checkout, plus an email with your download links so you can find them later. Print the pages or work through them on screen.` },
    { q: "Is this part of The Guide to Living in Abundance?", a: "Yes. It comes from the Guide, sold on its own so you can start with the part of your home that needs it most." },
    { q: "What if I have a question?", a: "Reply to your order email. It goes straight to Nancy." },
  ];
  return <ProductPage product={p} path={`/workbooks/${p.slug}`} faqs={faqs} />;
}
