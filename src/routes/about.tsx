import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/about-hero.png.asset.json";
import { SocialLinks } from "@/components/social-links";
import { BrandIdentity } from "@/components/brand-identity";

const SITE_URL = "https://keeptxred.com";
const PAGE_URL = `${SITE_URL}/about`;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Keep TX Red | Texas News & Standards" },
      { name: "description", content: "About Keep TX Red — our mission, editorial standards, sourcing, corrections policy, and contact information for the Texas politics and news publication." },
      { property: "og:title", content: "About Keep TX Red | Texas News & Standards" },
      { property: "og:description", content: "Mission, standards, sourcing, corrections policy, and contact information for Keep TX Red." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: SITE_URL + heroImg.url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Keep TX Red",
        description: "Mission, editorial standards, sourcing, corrections policy, and contact information for Keep TX Red.",
        url: PAGE_URL,
        isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL },
      }),
    }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ About</span>
      <h1 className="mt-2 font-display text-5xl leading-none tracking-tight md:text-6xl">ABOUT <br /><span className="text-primary">KEEP TX RED</span></h1>

      <div className="mt-10 space-y-8 text-base leading-relaxed">
        <section>
          <h2 className="font-display text-3xl tracking-tight">Mission</h2>
          <p className="mt-3 text-lg"><strong>Keep TX Red is an independent Texas news and analysis publication covering politics, elections, legislation, public officials, government accountability, and major statewide developments.</strong></p>
          <p className="mt-3 text-muted-foreground">We are not a political action committee, campaign, or candidate organization. We do not raise money for candidates or coordinate with campaigns. Our work is informational and explanatory.</p>
        </section>

        <div className="aspect-video overflow-hidden bg-muted"><img src={heroImg.url} alt="Keep TX Red banner" width="1200" height="675" loading="lazy" decoding="async" className="size-full object-cover" /></div>

        <section>
          <h2 className="font-display text-3xl tracking-tight">What We Cover</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Texas elections, candidates, voting, polling, forecasts, and results</li>
            <li>The Texas Legislature, committees, bills, votes, and special sessions</li>
            <li>Statewide officials, agencies, ethics, investigations, and government accountability</li>
            <li>Border policy, energy, education, regulation, taxes, and the Texas economy</li>
            <li>Major statewide breaking news, Texas business, and Texas sports</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl tracking-tight">Editorial Standards</h2>
          <p className="mt-3 text-muted-foreground">Our reporting prioritizes verifiable facts and primary sources, including Texas Legislature Online, the Secretary of State, the Comptroller, state agencies, court records, and county filings. Opinion and analysis are labeled. We do not publish anonymous attacks, fabricated quotations, or sponsored content disguised as reporting.</p>
          <p className="mt-3"><a href="/editorial-standards" className="text-primary underline">Read our full Editorial Standards</a>.</p>
        </section>

        <section>
          <h2 className="font-display text-3xl tracking-tight">AI Disclosure</h2>
          <p className="mt-3 text-muted-foreground">Keep TX Red may use AI tools to help organize, summarize, or draft material based on public information. AI-assisted work is reviewed before publication and is held to the same sourcing, accuracy, and corrections standards as other content.</p>
        </section>

        <section>
          <h2 className="font-display text-3xl tracking-tight">Corrections</h2>
          <p className="mt-3 text-muted-foreground">To report a factual error, email <a href="mailto:admin@keeptxred.com" className="text-primary underline">admin@keeptxred.com</a> with the article URL and the specific correction. We review correction requests and add a dated note when a published article is materially changed.</p>
        </section>

        <section>
          <h2 className="font-display text-3xl tracking-tight">Editorial Independence</h2>
          <p className="mt-3 text-muted-foreground">Keep TX Red is reader-supported and ad-supported. It is not authorized by any candidate or candidate&apos;s committee. We do not accept money from campaigns or political action committees in exchange for editorial coverage.</p>
        </section>

        <section>
          <h2 className="font-display text-3xl tracking-tight">Nonpolitical Texas Resources</h2>
          <p className="mt-3 text-muted-foreground">Travel, relocation, food, events, Texas culture, property-tax planning, household calculators, county and city directories, and other lifestyle resources are published separately by TexasDefined.</p>
        </section>

        <section>
          <h2 className="font-display text-3xl tracking-tight">Contact</h2>
          <p className="mt-3 text-muted-foreground">General inquiries, tips, and corrections: <a href="mailto:admin@keeptxred.com" className="text-primary underline">admin@keeptxred.com</a>. Additional contact options are available on the <a href="/contact" className="text-primary underline">Contact page</a>.</p>
        </section>

        <div className="border-l-4 border-primary bg-muted/40 p-5"><a href="/keep-texas-red" className="font-semibold text-primary hover:underline">Read what “Keep Texas Red” means →</a></div>
        <BrandIdentity />
        <SocialLinks />
      </div>
    </main>
  );
}
