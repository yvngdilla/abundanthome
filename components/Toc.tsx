"use client";

import { useEffect, useState } from "react";

// "On this page": stays in view below the sticky header and highlights the section you are reading.
export function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((t) => document.getElementById(t.id)).filter((el): el is HTMLElement => Boolean(el));
    const onScroll = () => {
      const line = 140; // just below the header
      let current = headings[0]?.id;
      for (const h of headings) if (h.getBoundingClientRect().top - line <= 0) current = h.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <aside className="toc no-print" aria-label="On this page">
      <p className="eyebrow">On this page</p>
      <ol>
        {items.map((t) => (
          <li key={t.id}>
            <a href={`#${t.id}`} aria-current={active === t.id ? "location" : undefined}>{t.label}</a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
