import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TaxCalculator } from "@/components/tax-calculator";
import { HomesteadExemptionGuide } from "@/components/homestead-exemption-guide";
import { COUNTIES } from "@/data/counties";

const FAQS = [
  {
    q: "How do I calculate property taxes in Texas?",
    a: "Add together the tax rates from your county, city, independent school district (ISD), and any special districts (hospital, MUD, community college). Multiply that combined rate by your home's taxable value — appraised value minus any exemptions like the homestead exemption. Our Texas property tax calculator does this automatically once you pick your county and ISD.",
  },
  {
    q: "Does Texas have a homestead exemption?",
    a: "Yes. A qualifying owner who uses a Texas home as a principal residence may receive a $140,000 school-district residence homestead exemption. Counties, cities, and special districts may offer additional local exemptions.",
  },
  {
    q: "How much can a Texas homestead exemption save?",
    a: "Savings depend on the home's taxable value and the school-district and local tax rates. The $140,000 general school-district exemption reduces the value subject to the ISD rate, and additional relief may apply for homeowners age 65 or older, disabled homeowners, disabled veterans, and qualifying surviving spouses.",
  },
  {
    q: "Do seniors get property tax relief in Texas?",
    a: "Yes. A qualifying homeowner age 65 or older receives an additional $60,000 school-district homestead exemption and a school-tax ceiling. Many local taxing units offer additional exemptions, and eligible homeowners may also have deferral options.",
  },
  {
    q: "Why are Texas property taxes higher than some states?",
    a: "Texas has no state income tax, so local governments and school districts rely heavily on property taxes to fund services. That shifts more of the tax burden onto real estate, which is why effective property tax rates in Texas rank among the highest in the country even after recent relief packages.",
  },
];

export const Route = createFileRoute("/tax-calculator")({
  head: () => ({
    meta: [
      { title: "Texas Property Tax Relief Calculator 2026 | Estimate & Save" },
      {
        name: "description",
        content:
          "Use our Texas Property Tax Calculator to estimate your 2026 property taxes, homestead exemption savings, and available Texas property tax relief programs.",
      },
      {
        name: "keywords",
        content:
          "Texas property tax calculator, Texas property tax relief calculator, Texas property tax savings calculator, Texas homestead exemption calculator, Texas property tax estimate 2026",
      },
      {
        property: "og:title",
        content: "Texas Property Tax Relief Calculator 2026 — Estimate Your Tax Bill & Savings",
      },
      {
        property: "og:description",
        content:
          "Estimate your 2026 Texas property taxes, homestead exemption savings, and property tax relief programs — free calculator by county and ISD.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.keeptxred.com/tax-calculator" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Texas Property Tax Relief Calculator 2026" },
      {
        name: "twitter:description",
        content: "Estimate your 2026 Texas property taxes and homestead exemption savings.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/tax-calculator" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Texas Property Tax Relief Calculator 2026",
          description:
            "Estimate your 2026 Texas property taxes, homestead exemption savings, and property tax relief programs by county and ISD.",
          url: "https://www.keeptxred.com/tax-calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
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
            {
              "@type": "ListItem",
              position: 2,
              name: "Texas Property Tax Calculator",
              item: "https://www.keeptxred.com/tax-calculator",
            },
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
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">
            ★ Taxpayer Tools
          </span>
          <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-2 leading-none">
            TEXAS PROPERTY <br />
            <span className="text-primary">TAX CALCULATOR</span>
          </h1>
          <p className="mt-5 max-w-2xl text-white/70">
            Pick your county and independent school district. We'll estimate your annual property
            tax bill — including the ISD line that usually dominates the total — with the homestead
            exemption applied.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-12">
        <h2 className="font-display text-3xl tracking-tight">
          Texas Property Tax Relief Calculator
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Estimate your Texas property tax bill and see how exemptions and relief programs may
          reduce your annual costs. Texas does not have a{" "}
          <Link
            to="/texas/$slug"
            params={{ slug: "why-texas-has-no-income-tax" }}
            className="text-primary underline"
          >
            state income tax
          </Link>
          , so understanding property taxes is important for homeowners.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <TaxCalculator />
        <HomesteadExemptionGuide />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground pb-3 mb-6">
          Counties Covered
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {COUNTIES.map((c) => (
            <div key={c.slug} className="border border-border bg-card p-4">
              <div className="font-semibold">{c.name}</div>
              <div className="text-[11px] text-muted-foreground">{c.region}</div>
              <div className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                {c.schoolDistricts.length} ISDs • County {c.countyRate.toFixed(4)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-muted border-l-4 border-primary p-6">
          <h2 className="font-display text-2xl mb-2 tracking-tight">
            How Texas Property Taxes Work
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Texas has no state income tax — local governments fund themselves through property
            taxes. Your annual bill is the sum of levies from your county, city, school district
            (ISD), and any special districts (hospital, MUD, college). Following voter approval in
            November 2025, the general ISD residence homestead exemption is $140,000 of appraised
            value for qualifying principal residences.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground pb-3 mb-6">
            How Texas Property Tax Relief Works
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-border bg-card p-5">
              <h3 className="font-display text-xl mb-2">Texas Homestead Exemption</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The general residence homestead exemption reduces the taxable value of a qualifying
                principal residence. The mandatory ISD exemption is $140,000 of appraised value. An
                owner generally must have an ownership interest in the property, occupy it as a
                principal residence, and not claim another residence homestead.
              </p>
            </div>
            <div className="border border-border bg-card p-5">
              <h3 className="font-display text-xl mb-2">Senior Citizen Exemptions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Qualifying Texas homeowners age 65 or older receive an additional $60,000 ISD
                homestead exemption and a school-tax ceiling. Qualifying disabled homeowners receive
                the same additional school-district exemption, while local taxing units may offer
                further relief.
              </p>
            </div>
            <div className="border border-border bg-card p-5">
              <h3 className="font-display text-xl mb-2">Disabled Veteran Exemptions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Disabled veterans receive exemptions scaled to their VA disability rating, up to a
                100% property tax exemption on the homestead for veterans rated 100% disabled or
                unemployable. Surviving spouses may continue to qualify.
              </p>
            </div>
            <div className="border border-border bg-card p-5">
              <h3 className="font-display text-xl mb-2">Local Property Tax Exemptions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Counties, cities, and special districts can adopt optional local homestead
                exemptions — often a percentage of value or a flat dollar amount — that stack with
                the state ISD exemption to lower your combined bill.
              </p>
            </div>
            <div className="border border-border bg-card p-5 md:col-span-2">
              <h3 className="font-display text-xl mb-2">How Exemptions Reduce Taxable Value</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each exemption is subtracted from the value subject to the applicable taxing unit. A
                $400,000 home with a $140,000 ISD exemption is taxed by the school district on
                $260,000. Local exemptions may differ, so county, city, and special-district taxable
                values can be higher. See more on{" "}
                <Link
                  to="/texas/$slug"
                  params={{ slug: "texas-governor-powers" }}
                  className="text-primary underline"
                >
                  how Texas governor powers
                </Link>{" "}
                shape statewide tax policy and the{" "}
                <Link to="/texas-economy" className="text-primary underline">
                  Texas economy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground pb-3 mb-6">
            Texas Property Tax Calculator FAQ
          </h2>
          <div className="space-y-6">
            {FAQS.map((f) => (
              <div key={f.q} className="border-b border-border pb-5 last:border-b-0">
                <h3 className="font-display text-lg mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-muted border-l-4 border-primary p-6">
          <h2 className="font-display text-xl mb-2 tracking-tight">Related Reading</h2>
          <ul className="text-sm space-y-2">
            <li>
              <Link
                to="/texas/$slug"
                params={{ slug: "why-texas-has-no-income-tax" }}
                className="text-primary underline"
              >
                Why Texas Has No Income Tax
              </Link>{" "}
              — the trade-off behind higher property taxes.
            </li>
            <li>
              <Link
                to="/texas/$slug"
                params={{ slug: "texas-governor-powers" }}
                className="text-primary underline"
              >
                Texas Governor Powers
              </Link>{" "}
              — how the governor's office shapes property tax relief legislation.
            </li>
            <li>
              <Link to="/texas-economy" className="text-primary underline">
                Texas Economy
              </Link>{" "}
              — how property taxes fit into the state's overall tax structure.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
