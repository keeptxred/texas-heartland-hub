import { createFileRoute } from "@tanstack/react-router";
import { TaxCalculator } from "@/components/tax-calculator";
import { COUNTIES } from "@/data/counties";

export const Route = createFileRoute("/tax-calculator")({
  head: () => ({
    meta: [
      { title: "Texas Property Tax Calculator by County — Keep TX Red" },
      { name: "description", content: "Free Texas property tax calculator. Estimate your annual tax bill by county and school district (ISD), with homestead exemption applied." },
      { property: "og:title", content: "Texas Property Tax Calculator — Keep TX Red" },
      { property: "og:description", content: "Estimate Texas property taxes by county and ISD, including school district levies." },
      { property: "og:url", content: "/tax-calculator" },
    ],
    links: [{ rel: "canonical", href: "/tax-calculator" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Texas Property Tax Calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0" },
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
            Pick your county and independent school district. We'll estimate your annual property tax bill — including the ISD line that usually dominates the total — with the homestead exemption applied.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <TaxCalculator />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground pb-3 mb-6">Counties Covered</h2>
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
          <h3 className="font-display text-2xl mb-2 tracking-tight">How Texas Property Taxes Work</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Texas has no state income tax — local governments fund themselves through property taxes. Your annual bill is the sum of levies from your county, city, school district (ISD), and any special districts (hospital, MUD, college). The school district line item is almost always the largest, and the 2023 homestead exemption raised the ISD exemption to $100,000 of appraised value for owner-occupied homes.
          </p>
        </div>
      </section>
    </>
  );
}