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
      { name: "description", content: "About Keep TX Red — Texas news, commentary, government accountability, common-sense analysis, editorial standards, sourcing, corrections, store information, and contact information." },
      { property: "og:title", content: "About Keep TX Red | Texas News & Standards" },
      { property: "og:description", content: "Texas news, commentary, government accountability, common-sense analysis, and the standards behind Keep TX Red." },
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
        description: "Keep TX Red delivers Texas news, commentary, government accountability, common-sense analysis, and a direct-to-consumer branded merchandise shop.",
        url: PAGE_URL,
        isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL },
        about: {
          "@type": "Organization",
          name: "Keep TX Red",
          url: SITE_URL,
          email: "admin@keeptxred.com",
          description: "Independent Texas news and analysis publication with a branded merchandise storefront on keeptxred.com.",
        },
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
          <p className="mt-3 text-lg"><strong>Keep TX Red delivers Texas news, commentary, government accountability, and common-sense analysis.</strong></p>
          <p className="mt-3 text-muted-foreground">We cover politics, elections, legislation, public officials, policy debates, and major statewide developments with an emphasis on clear context, primary sources, and the decisions that affect Texans.</p>
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

        <section id="store-business-information" className="rounded-xl border border-border bg-secondary/30 p-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Store &amp; Business Information</span>
          <h2 className="mt-2 font-display text-3xl tracking-tight">How the Keep TX Red Shop Works</h2>
          <p className="mt-3 text-muted-foreground">Keep TX Red operates the branded merchandise storefront at <strong className="text-foreground">keeptxred.com/shop</strong> alongside this publication. Products offered there are ordinary retail merchandise purchases; they are not political donations or campaign contributions.</p>
          <p className="mt-3 text-muted-foreground">Most merchandise is made to order after checkout and is manufactured and fulfilled by third-party print-on-demand production partners. Keep TX Red provides the storefront and customer-support relationship for orders placed on keeptxred.com. Card payments are processed securely through Stripe.</p>
          <p className="mt-3 text-muted-foreground">For order questions, damaged or incorrect products, delivery issues, or refund requests, contact <a href="mailto:admin@keeptxred.com" className="text-primary underline">admin@keeptxred.com</a>. Our public customer-service location is Texas, United States. We currently ship merchandise only to U.S. addresses.</p>
          <p className="mt-3 text-muted-foreground">Keep TX Red is not a government entity, political party, campaign, candidate organization, or political action committee, and the shop does not imply endorsement by the State of Texas or any public office.</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <a href="/shipping-policy" className="text-primary underline underline-offset-4">Shipping Policy</a>
            <a href="/return-refund-policy" className="text-primary underline underline-offset-4">Return &amp; Refund Policy</a>
            <a href="/terms-of-service" className="text-primary underline underline-offset-4">Terms of Service</a>
            <a href="/privacy" className="text-primary underline underline-offset-4">Privacy Policy</a>
            <a href="/contact" className="text-primary underline underline-offset-4">Customer Support</a>
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl tracking-tight">Nonpolitical Texas Resources</h2>
          <p className="mt-3 text-muted-foreground">TexasDefined is a nonpolitical sister publication from the same publisher. It covers Texas travel, relocation, food, events, culture, property-tax planning, household calculators, county and city directories, and other lifestyle resources separately from Keep TX Red&apos;s political and public-affairs coverage.</p>
          <p className="mt-3"><a href="https://texasdefined.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Visit TexasDefined</a>.</p>
        </section>

        <section>
          <h2 className="font-display text-3xl tracking-tight">Contact</h2>
          <p className="mt-3 text-muted-foreground">General inquiries, tips, corrections, and shop support: <a href="mailto:admin@keeptxred.com" className="text-primary underline">admin@keeptxred.com</a>. Additional contact options are available on the <a href="/contact" className="text-primary underline">Contact page</a>.</p>
        </section>

        <div className="border-l-4 border-primary bg-muted/40 p-5"><a href="/keep-texas-red" className="font-semibold text-primary hover:underline">Read what “Keep Texas Red” means →</a></div>
        <BrandIdentity />
        <SocialLinks />
      </div>
    </main>
  );
}
