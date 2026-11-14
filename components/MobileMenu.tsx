"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { nav } from "@/lib/nav";

// The phone menu: every page on the site, grouped the same way as the desktop menus.
export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (ref.current) ref.current.open = false; // close after navigating
  }, [pathname]);

  return (
    <details className="mobile-menu" ref={ref}>
      <summary aria-label="Menu">
        <span className="bars" aria-hidden="true"><i /><i /><i /></span>
        <span>Menu</span>
      </summary>
      <div className="mobile-panel">
        {nav.map((g) => (
          <div key={g.label} className="mobile-group">
            <p className="eyebrow">{g.label}</p>
            <ul>
              {g.items.map((i) => (
                <li key={i.href + i.label}><Link href={i.href}>{i.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}
