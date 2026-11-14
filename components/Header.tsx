import Link from "next/link";
import { pages } from "@/lib/site";
import { nav } from "@/lib/nav";
import { MobileMenu } from "@/components/MobileMenu";
import { HeaderScroll } from "@/components/HeaderScroll";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label="Abundant Home, home page">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/brand/ah-monogram-water.png" alt="" width={76} height={34} />
          <span className="brand-name">Abundant Home</span>
        </Link>
        <nav className="nav" aria-label="Main">
          {nav.map((g) => (
            <div key={g.label} className="nav-group">
              <Link href={g.href ?? g.items[0].href} className="nav-top" aria-haspopup="true">
                {g.label}
                <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              </Link>
              <div className="nav-menu">
                <ul>
                  {g.items.map((i) => (
                    <li key={i.href + i.label}>
                      <Link href={i.href}>
                        <span className="nav-label">{i.label}</span>
                        {i.note && <span className="nav-note">{i.note}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <Link className="btn nav-cta" href={pages.template.path}>Free vision board template</Link>
        </nav>
        <MobileMenu />
      </div>
      <HeaderScroll />
    </header>
  );
}
