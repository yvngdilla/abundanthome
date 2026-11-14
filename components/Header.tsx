import Link from "next/link";
import { pages } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label="Abundant Home, home page">
          <span className="brand-mark" aria-hidden="true">AH</span>
          <span className="brand-name">Abundant Home</span>
        </Link>
        <nav className="nav" aria-label="Main">
          <Link href={pages.ideas.path}>Vision boards</Link>
          <Link href={pages.template.path}>Free template</Link>
          <Link href={pages.bedroomColors.path}>Bedroom colors</Link>
          <Link href={pages.challenge.path}>Declutter challenge</Link>
        </nav>
      </div>
    </header>
  );
}
