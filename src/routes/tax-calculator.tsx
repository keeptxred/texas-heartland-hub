import { createFileRoute, Link } from "@tanstack/react-router";
import { TaxCalculator } from "@/components/tax-calculator";
import { MANUAL_ENTRY_COUNTIES, TAX_RATE_DATASET } from "@/data/counties";

const FAQS = [
  {
    q: "How do I calculate property taxes in Texas?",
    a: "Add the tax rates from the property's county, city, independent school district (ISD), and any special districts such as a hospital district, MUD, PID, college district, or ESD. Multiply each rate by the taxable value that applies to that taxing unit. This calculator supports all 254 counties through exact local-rate entry or available address lookup.",
  },
  {
    q: "Does Texas have a homestead exemption?",
    a: "Yes. Texas offers a general residence homestead exemption for an owner-occupied primary home. The statewide school-district residence homestead exemption is $140,000. Counties, cities, and special districts may offer additional local exemptions.",
  },
  {
    q: "How much can a Texas homestead exemption save?",
    a: "Savings depend on the property's school-district rate and any additional local exemptions. The calculator applies the $140,000 statewide ISD homestead exemption when selected, but the result remains a planning estimate rather than an official tax bill.",
  },
  {
    q: "Do seniors get property tax relief in Texas?",
    a: "Texas homeowners age 65 or older may qualify for an additional school-district exemption and a school-tax ceiling. Counties, cities, and other taxing units may offer additional local exemptions. Confirm eligibility and amounts with the appraisal district.",
  },
  {
    q: "Are all 254 counties supported?",
    a: "Yes. Every Texas county is selectable. The calculator intentionally does not preload local tax rates because county, city, ISD, MUD/PID, hospital, college, ESD, and other taxing units vary by exact property and effective year.",
  },
];

export const Route = createFileRoute("/tax-calculator")({
  head: () => ({
    meta: [
      { title: "Texas Property Tax Calculator 2026 | County & ISD Estimate" },
      { name: "description", content: "Estimate Texas property taxes using exact county, city, ISD, special-district, and homestead inputs for any of Texas's 254 counties." },
      { name: "keywords", content: "Texas property tax calculator, Texas homestead exemption calculator, county property tax estimate, Texas ISD tax calculator" },
      { property: "og:title", content: "Texas Property Tax Calculator — County, ISD & Homestead Estimate" },
      { property: "og:description", content: "Estimate Texas property taxes using exact local rates with transparent assumptions and official source guidance." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.keeptxred.com/tax-calculator" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Texas Property Tax Calculator" },
      { name: "twitter:description", content: "Estimate county, city, ISD, and special-district property taxes with the Texas homestead exemption." },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/tax-calculator" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Texas Property Tax Calculator",
          description: "Estimate Texas property taxes by county, city, ISD, special districts, and exemptions using exact local rates.",
          url: "https://www.keeptxred.com/tax-calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0" },
          citation: [TAX_RATE_DATASET.sourceUrl, TAX_RATE_DATASET.exemptionSourceUrl],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.keeptxred.com/" },
            { "@type": "ListItem", position: 2, name: "Texas Property Tax Calculator", item: "https://www.keeptxred.com/tax-calculator" },
          ],
        }),
      },
    ],
  }),
  component: TaxPage,
});

function TaxPage() {
  return (
    <>
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">★ Taxpayer Tools</span>
          <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-2 leading-none">
            TEXAS PROPERTY <br />
            <span className="text-primary">TAX CALCULATOR</span>
          </h1>
          <p className="mt-5 max-w-2xl text-white/70">
            Estimate county, city, ISD, and special-district taxes using exact rates from your appraisal district, tax statement, or available address lookup.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-12">
        <h2 className="font-display text-3xl tracking-tight">Texas Property Tax Relief Calculator</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Texas does not have a{" "}
          <Link to="/texas/$slug" params={{ slug: "why-texas-has-no-income-tax" }} className="text-primary underline">
            state individual income tax
          </Link>
          , so property-tax planning matters. This tool avoids stale statewide averages and lets you use the taxing units that actually apply to the property.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <TaxCalculator />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground pb-3 mb-6">All 254 Texas Counties Supported</h2>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Every Texas county is selectable. Rates begin at zero until supplied by address lookup or entered from the property's current tax records, preventing old planning snapshots from being mistaken for official rates.
        </p>

        <div className="border border-border bg-muted p-5 text-sm text-muted-foreground">
          {MANUAL_ENTRY_COUNTIES.length} counties use exact local-rate entry. Confirm the effective year and include every taxing unit shown on the property's appraisal or tax statement.
        </div>

        <div className="mt-10 bg-muted border-l-4 border-primary p-6">
          <h2 className="font-display text-2xl mb-2 tracking-tight">How Texas Property Taxes Work</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your annual bill can include county, city, school-district, hospital, MUD, PID, community-college, ESD, and other taxing-unit charges. Each taxing unit can apply different exemptions and taxable values. The statewide school-district residence homestead exemption is currently ${TAX_RATE_DATASET.statewideSchoolHomesteadExemption.toLocaleString("en-US")}.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground pb-3 mb-6">How Texas Property Tax Relief Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-border bg-card p-5">
              <h3 className="font-display text-xl mb-2">Texas Homestead Exemption</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The statewide school-district residence homestead exemption reduces the school-tax taxable value of an eligible primary residence by ${TAX_RATE_DATASET.statewideSchoolHomesteadExemption.toLocaleString("en-US")}. Local taxing units may adopt additional exemptions.
              </p>
            </div>
            <div className="border border-border bg-card p-5">
              <h3 className="font-display text-xl mb-2">Senior and Disabled Exemptions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Eligible homeowners may qualify for additional exemptions and a school-tax ceiling. Confirm eligibility, application deadlines, and exact amounts with the appraisal district.
              </p>
            </div>
            <div className="border border-border bg-card p-5">
              <h3 className="font-display text-xl mb-2">Disabled Veteran Exemptions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Texas provides exemption amounts based on qualifying disability status, including a potential full homestead exemption for certain 100% disabled veterans and eligible surviving spouses.
              </p>
            </div>
            <div className="border border-border bg-card p-5">
              <h3 className="font-display text-xl mb-2">Local Exemptions and Districts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cities, counties, and special districts may adopt optional exemptions. MUD, PID, hospital, college, road, and ESD charges vary by exact address and must be verified locally.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border border-border bg-card p-6">
          <h2 className="font-display text-xl mb-2 tracking-tight">Data Scope and Sources</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{TAX_RATE_DATASET.scopeNote}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a className="text-primary underline" href={TAX_RATE_DATASET.sourceUrl} target="_blank" rel="noreferrer">Texas Comptroller property-tax rate resources</a></li>
            <li><a className="text-primary underline" href={TAX_RATE_DATASET.exemptionSourceUrl} target="_blank" rel="noreferrer">Texas Comptroller property-tax exemption guidance</a></li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Guidance reviewed {TAX_RATE_DATASET.lastUpdated}; next review {TAX_RATE_DATASET.nextReviewOn}.</p>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground pb-3 mb-6">Texas Property Tax Calculator FAQ</h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-b border-border pb-5 last:border-b-0">
                <h3 className="font-display text-lg mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
