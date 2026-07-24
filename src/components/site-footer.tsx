import { Link } from "@tanstack/react-router";
import { SocialLinks } from "@/components/social-links";

const PRIMARY_LINKS = [
  { to: "/", label: "Home" },
  { to: "/texas-news", label: "Texas News" },
  { to: "/texas-politics", label: "Politics" },
  { to: "/moving-to-texas", label: "Moving to Texas" },
  { to: "/living-in-texas", label: "Living in Texas" },
  { to: "/texas-financial-tools", label: "Texas Tools" },
  { to: "/tax-calculator", label: "Property Taxes" },
  { to: "/shop", label: "Shop" },
] as const;

const NEWS_LINKS = [
  { to: "/texas-news/economy", label: "Economy" },
  { to: "/texas-news/housing", label: "Housing" },
  { to: "/texas-news/education", label: "Education" },
  { to: "/texas-business", label: "Business" },
  { to: "/texas-sports", label: "Sports" },
  { to: "/houston", label: "Houston" },
  { to: "/dallas-fort-worth", label: "Dallas–Fort Worth" },
  { to: "/san-antonio", label: "San Antonio" },
  { to: "/austin", label: "Austin" },
  { to: "/el-paso", label: "El Paso" },
] as const;

const TRUST_LINKS = [
  { to: "/about", label: "About" },
  { to: "/editorial-standards", label: "Editorial Standards" },
  { to: "/privacy", label: "Privacy Policy" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div
              className="mb-5 grid size-12 place-items-center rounded-full border border-white/20"
              aria-hidden
            >
              <span className="font-display text-2xl leading-none text-accent">★</span>
            </div>
            <h2 className="font-display text-3xl tracking-tight">KEEP TEXAS RED</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
              Practical guidance for moving to Texas, living in Texas, using trusted calculators,
              and staying informed about the state.
            </p>
          </div>
          <FooterColumn heading="Explore" links={PRIMARY_LINKS} />
          <FooterColumn heading="Texas News" links={NEWS_LINKS} />
          <FooterColumn heading="About" links={TRUST_LINKS} />
        </div>
        <SocialLinks variant="footer" />
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-[10px] uppercase leading-relaxed tracking-[0.25em] text-white/75">
          &copy; {new Date().getFullYear()} keeptxred.com — All rights reserved
          <br />
          <span className="normal-case tracking-normal">
            Independent commentary. Not authorized by any candidate or candidate&apos;s committee.
          </span>
        </div>
      </div>
    </footer>
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
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        {heading}
      </h2>
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
