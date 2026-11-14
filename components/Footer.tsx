import Link from "next/link";
import { pages, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="grid">
          <div>
            <p className="brand-name">Abundant Home</p>
            <p className="tagline">{site.tagline}</p>
            <p>{site.author.bio}</p>
          </div>
          <div>
            <h3>Read</h3>
            <ul>
              <li><Link href={pages.ideas.path}>Vision board ideas</Link></li>
              <li><Link href={pages.howTo.path}>How to make a vision board</Link></li>
              <li><Link href={pages.bedroomColors.path}>Bedroom colors</Link></li>
            </ul>
          </div>
          <div>
            <h3>Free</h3>
            <ul>
              <li><Link href={pages.template.path}>Vision board template</Link></li>
              <li><Link href={pages.challenge.path}>5-day declutter challenge</Link></li>
              <li><a href={site.instagram} rel="noopener">Instagram</a></li>
              <li><a href={site.pinterest} rel="noopener">Pinterest</a></li>
            </ul>
          </div>
        </div>
        <p className="fineprint">
          © {new Date().getFullYear()} Abundant Home. Design ideas for your home, not financial, medical or
          professional advice.
        </p>
      </div>
    </footer>
  );
}
