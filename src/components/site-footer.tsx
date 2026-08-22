import { Link } from "@tanstack/react-router";
import { AIReferralTracker } from "@/components/analytics/AIReferralTracker";
import { CitationCollectionTrustRouter } from "@/components/authority/CitationCollectionTrustRouter";
import { NewsGovernmentGraphRouter } from "@/components/news-government-graph-router";
import { SocialLinks } from "@/components/social-links";
import { TexasDefinedCrosslinks } from "@/components/texas-defined-crosslinks";
import { ABOUT_LINKS, SHOP_LINK, SHOP_POLICY_LINKS, SITE_NAV_GROUPS } from "@/lib/site-navigation";

export function SiteFooter() {
  return (
    <>
      <AIReferralTracker />
      <CitationCollectionTrustRouter />
      <NewsGovernmentGraphRouter />
      <TexasDefinedCrosslinks />
      <footer className="mt-16 bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.45fr_repeat(5,1fr)]">
            <div>
              <div className="mb-5 grid size-12 place-items-center rounded-full border border-white/20" aria-hidden>
                <span className="font-display text-2xl leading-none text-accent">★</span>
              </div>
              <h2 className="font-display text-3xl tracking-tight">KEEP TEXAS RED</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                Texas news, commentary, government accountability, and common-sense analysis.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to="/news"
                  className="rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
                >
                  Latest news
                </Link>
                <Link
                  to={SHOP_LINK.to}
                  className="rounded-md border border-white/20 px-3 py-2 text-xs font-bold text-white/90 hover:border-white/40 hover:text-white"
                >
                  KTR Shop
                </Link>
              </div>
            </div>

            {SITE_NAV_GROUPS.map((group) => (
              <FooterColumn
                key={group.id}
                heading={group.label}
                links={group.links.map((link) => ({ to: link.to, label: link.label }))}
              />
            ))}
          </div>

          <SocialLinks variant="footer" />

          <div className="mt-10 grid gap-6 border-t border-white/10 pt-7 md:grid-cols-2 md:items-start">
            <nav aria-label="About Keep TX Red" className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
              {ABOUT_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Site and shop policies" className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70 md:justify-end">
              {SHOP_POLICY_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-7 border-t border-white/10 pt-6 text-center text-[10px] uppercase leading-relaxed tracking-[0.25em] text-white/75">
            &copy; {new Date().getFullYear()} keeptxred.com — All rights reserved
            <br />
            <span className="normal-case tracking-normal">Independent commentary. Not authorized by any candidate or candidate&apos;s committee.</span>
            <br />
            <span className="normal-case tracking-normal">
              Looking for the nonpolitical side of Texas?{" "}
              <a href="https://texasdefined.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                Visit TexasDefined ↗
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: ReadonlyArray<{ readonly to: string; readonly label: string }>;
}) {
  return (
    <nav aria-label={`${heading} footer links`}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent">{heading}</h2>
      <ul className="space-y-2 text-sm text-white/75">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
