import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/houston")({
  head: () => ({
    meta: [
      { title: "Houston News – Local Updates from Across the Metro" },
      { name: "description", content: "Houston news and local updates from across the metro — Katy, Sugar Land, Cypress, The Woodlands, Pearland — covering politics, growth, and Texas issues that hit home." },
      { property: "og:title", content: "Houston News – Local Updates from Across the Metro" },
      { property: "og:description", content: "Houston news and local updates from across the metro and surrounding Texas communities." },
      { property: "og:url", content: "https://www.keeptxred.com/houston" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/houston" }],
  }),
  component: HoustonPage,
});

function HoustonPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-6 mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Local · Houston</span>
        <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">
          Houston News &amp; Local Texas Updates
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          Coverage of the Houston metro and the communities around it — Katy, Sugar Land, Cypress, The Woodlands, Pearland, and Galveston County. Local government, growth, property taxes, transportation, and the policy decisions reshaping the largest metro in Texas.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        <section>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">What we cover in Houston</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">City Hall &amp; Harris County:</strong> Budget fights, public safety, and the commissioners court.</li>
            <li><strong className="text-foreground">Suburban growth:</strong> Katy ISD, Fort Bend, and the Cypress-Fairbanks corridor.</li>
            <li><strong className="text-foreground">Energy capital:</strong> The companies, jobs, and policy decisions powering the Houston economy.</li>
            <li><strong className="text-foreground">Property taxes:</strong> Appraisal districts, ISD rates, and what homeowners actually pay.</li>
            <li><strong className="text-foreground">Public safety:</strong> HPD, county constables, and the courts.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">Tools for Houston residents</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/tax-calculator" className="text-primary hover:underline">Property tax calculator (Harris, Fort Bend, Montgomery) →</Link></li>
            <li><Link to="/find-representative" className="text-primary hover:underline">Find your Texas representative →</Link></li>
            <li><Link to="/voting-locations" className="text-primary hover:underline">Houston-area voting locations →</Link></li>
            <li><Link to="/register-to-vote" className="text-primary hover:underline">Register to vote in Texas →</Link></li>
            <li><Link to="/contact-legislators" className="text-primary hover:underline">Contact your legislators →</Link></li>
          </ul>
        </section>
      </div>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">Related coverage</h2>
        <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <li><Link to="/texas-news" className="text-primary hover:underline">Statewide Texas News →</Link></li>
          <li><Link to="/texas-politics" className="text-primary hover:underline">Texas Politics →</Link></li>
          <li><Link to="/texas-business" className="text-primary hover:underline">Texas Business →</Link></li>
          <li><Link to="/texas-sports" className="text-primary hover:underline">Texas Sports →</Link></li>
          <li><Link to="/elections" className="text-primary hover:underline">Elections →</Link></li>
          <li><Link to="/county-elections" className="text-primary hover:underline">County Elections →</Link></li>
        </ul>
      </section>
    </div>
  );
}