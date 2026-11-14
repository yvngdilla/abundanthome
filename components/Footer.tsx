import Link from "next/link";
import { site } from "@/lib/site";
import { nav } from "@/lib/nav";

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
            <p className="mantra">“{site.mantra}”</p>
          </div>
          {nav.map((g) => (
            <div key={g.label}>
              <h3>{g.label}</h3>
              <ul>
                {g.items.map((i) => (
                  <li key={i.href + i.label}><Link href={i.href}>{i.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3>Connect</h3>
            <ul>
              <li><Link href="/contact">Contact Nancy</Link></li>
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
          <p><Link href="/contact">Contact</Link> · <Link href="/privacy-policy">Privacy policy</Link></p>
        </div>
      </div>
    </footer>
  );
}
