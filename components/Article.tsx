import { Toc } from "@/components/Toc";
import { WorkbookCTA } from "@/components/WorkbookCTA";
import { JsonLd } from "./JsonLd";
import { site, type PageMeta } from "@/lib/site";

type Props = {
  meta: PageMeta;
  eyebrow: string;
  heading: string;
  lede: string;
  accent?: "wood" | "fire" | "earth";
  toc?: { id: string; label: string }[];
  updated: string; // ISO date
  howTo?: { name: string; steps: { name: string; text: string }[] };
  children: React.ReactNode;
};

export function Article({ meta, eyebrow, heading, lede, accent = "wood", toc, updated, howTo, children }: Props) {
  const url = site.url + meta.path;
  const graph: object[] = [
    {
      "@type": "Article",
      headline: meta.title,
      description: meta.description,
      url,
      dateModified: updated,
      author: { "@type": "Person", name: site.author.name, jobTitle: site.author.role },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
    },
  ];
  if (howTo) {
    graph.push({
      "@type": "HowTo",
      name: howTo.name,
      step: howTo.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
    });
  }
  return (
    <article className={`accent-${accent}`}>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
      <header className="article-head">
        <div className="wrap">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{heading}</h1>
          <p className="lede" style={{ marginTop: 16 }}>{lede}</p>
          <p className="byline">
            By {site.author.name}, {site.author.role.toLowerCase()} · Updated{" "}
            {new Date(updated + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </header>
      <div className="wrap">
        {toc && (
          <details className="toc-mobile no-print">
            <summary>On this page</summary>
            <ol>
              {toc.map((t) => (
                <li key={t.id}><a href={`#${t.id}`}>{t.label}</a></li>
              ))}
            </ol>
          </details>
        )}
        <div className={toc ? "article-grid" : undefined}>
          <div className="prose">
            {children}
            <WorkbookCTA path={meta.path} />
          </div>
          {toc && <Toc items={toc} />}
        </div>
      </div>
    </article>
  );
}
