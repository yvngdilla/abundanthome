import Link from "next/link";
import { pages } from "@/lib/site";

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
          <Link href={pages.ideas.path}>Vision boards</Link>
          <Link href={pages.bedroomColors.path}>Bedroom colors</Link>
          <Link href={pages.challenge.path}>Declutter challenge</Link>
          <Link className="btn" href={pages.template.path}>Free vision board template</Link>
        </nav>
      </div>
    </header>
  );
}
