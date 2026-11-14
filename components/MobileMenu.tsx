"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { nav } from "@/lib/nav";
import { pages } from "@/lib/site";
import { AccountLink } from "@/components/AccountLink";

// The phone and tablet menu: a full-width sheet with one collapsible section per menu group,
// then Contact, Sign in and the free template button. The open section is the one for the current page.
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
        <span className="mm-open">Menu</span>
        <span className="mm-close">Close</span>
      </summary>
      <div className="mobile-panel">
        <nav aria-label="Main">
          {nav.map((g) => {
            const here = g.items.some((i) => i.href === pathname);
            return (
              <details key={g.label} className="mobile-group" open={here}>
                <summary>{g.label}</summary>
                <ul>
                  {g.items.map((i) => (
                    <li key={i.href + i.label}>
                      <Link href={i.href} aria-current={i.href === pathname ? "page" : undefined}>{i.label}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
          <Link className="mobile-link" href="/contact">Contact</Link>
        </nav>
        <div className="mobile-foot">
          <AccountLink className="mobile-account" />
          <Link className="btn" href={pages.template.path}>Free vision board template</Link>
        </div>
      </div>
    </details>
  );
}
