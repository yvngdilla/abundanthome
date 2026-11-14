import Link from "next/link";
import { pages, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="footer-logo" src="/brand/ah-monogram-paper.png" alt="" width={90} height={40} />
            <p className="brand-name">Abundant Home</p>
            <p className="tagline">{site.tagline}</p>
            <p className="bio">{site.author.bio}</p>
          </div>
          <div>
            <h3>Vision boards</h3>
            <ul>
              <li><Link href={pages.ideas.path}>Vision board ideas</Link></li>
              <li><Link href={pages.howTo.path}>How to make a vision board</Link></li>
              <li><Link href={pages.template.path}>Free vision board template</Link></li>
            </ul>
          </div>
          <div>
            <h3>Your home</h3>
            <ul>
              <li><Link href={pages.bedroomColors.path}>Bedroom colors</Link></li>
              <li><Link href={pages.challenge.path}>5-day declutter challenge</Link></li>
            </ul>
          </div>
          <div>
            <h3>Follow</h3>
            <ul>
              <li><a href={site.instagram} rel="noopener">Instagram</a></li>
              <li><a href={site.pinterest} rel="noopener">Pinterest</a></li>
            </ul>
          </div>
        </div>
        <div className="fineprint">
          <p>
            © {new Date().getFullYear()} Abundant Home. Design ideas for your home, not financial, medical or
            professional advice.
          </p>
          <p><Link href="/privacy-policy">Privacy policy</Link></p>
        </div>
      </div>
    </footer>
  );
}
