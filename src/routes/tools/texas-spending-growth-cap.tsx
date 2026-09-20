import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

const SITE_URL = "https://keeptxred.com";
const PAGE_URL = `${SITE_URL}/tools/texas-spending-growth-cap`;

export const Route = createFileRoute("/tools/texas-spending-growth-cap")({
  head: () => ({
    meta: [
      { title: "Texas Spending Growth Calculator | Population + Inflation Benchmark" },
      { name: "description", content: "Compare a Texas budget or spending proposal with a population-plus-inflation growth benchmark. Enter the prior budget, population growth and inflation to calculate a reference limit." },
      { property: "og:title", content: "Texas Spending Growth Calculator | Keep TX Red" },
      { property: "og:description", content: "Test state or local spending growth against a population-plus-inflation benchmark." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Texas Spending Growth Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: "A calculator for comparing spending growth with a population-plus-inflation benchmark.",
      }),
    }],
  }),
  component: SpendingGrowthCalculator,
});

function parseNumber(value: string) {
  const number = Number(value.replace(/,/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function SpendingGrowthCalculator() {
  const [baseSpending, setBaseSpending] = useState("1000000000");
  const [populationGrowth, setPopulationGrowth] = useState("1.5");
  const [inflation, setInflation] = useState("2.5");
  const [proposedSpending, setProposedSpending] = useState("1050000000");

  const result = useMemo(() => {
    const base = Math.max(0, parseNumber(baseSpending));
    const pop = parseNumber(populationGrowth) / 100;
    const cpi = parseNumber(inflation) / 100;
    const proposal = Math.max(0, parseNumber(proposedSpending));
    const benchmarkRate = pop + cpi;
    const benchmarkSpending = base * (1 + benchmarkRate);
    const proposedRate = base > 0 ? proposal / base - 1 : 0;
    const difference = proposal - benchmarkSpending;
    return { base, benchmarkRate, benchmarkSpending, proposedRate, proposal, difference };
  }, [baseSpending, populationGrowth, inflation, proposedSpending]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <nav className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" aria-label="Breadcrumb">
        <a href="/issues" className="hover:text-primary">Texas Issues</a> <span aria-hidden="true">/</span> Policy Tool
      </nav>
      <header className="mt-5 max-w-4xl">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Fiscal Policy Tool</span>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-tight md:text-6xl">TEXAS SPENDING<br /><span className="text-primary">GROWTH CALCULATOR</span></h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Compare a proposed budget with the commonly used fiscal benchmark of prior spending plus population growth plus inflation. This is a policy comparison tool, not a statement of Texas's constitutional spending limit.</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <section className="border p-6" aria-labelledby="inputs-heading">
          <h2 id="inputs-heading" className="font-display text-3xl tracking-tight">Inputs</h2>
          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold">Prior-period spending</span>
              <input value={baseSpending} onChange={(e) => setBaseSpending(e.target.value)} inputMode="decimal" className="mt-2 w-full border bg-background px-3 py-3" aria-label="Prior-period spending" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Population growth (%)</span>
              <input value={populationGrowth} onChange={(e) => setPopulationGrowth(e.target.value)} inputMode="decimal" className="mt-2 w-full border bg-background px-3 py-3" aria-label="Population growth percentage" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Inflation (%)</span>
              <input value={inflation} onChange={(e) => setInflation(e.target.value)} inputMode="decimal" className="mt-2 w-full border bg-background px-3 py-3" aria-label="Inflation percentage" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Proposed spending</span>
              <input value={proposedSpending} onChange={(e) => setProposedSpending(e.target.value)} inputMode="decimal" className="mt-2 w-full border bg-background px-3 py-3" aria-label="Proposed spending" />
            </label>
          </div>
        </section>

        <section className="border bg-muted/20 p-6" aria-labelledby="results-heading">
          <h2 id="results-heading" className="font-display text-3xl tracking-tight">Result</h2>
          <dl className="mt-5 space-y-5">
            <div className="border-b pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Population + inflation benchmark</dt>
              <dd className="mt-1 font-display text-4xl">{(result.benchmarkRate * 100).toFixed(2)}%</dd>
            </div>
            <div className="border-b pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Benchmark spending level</dt>
              <dd className="mt-1 font-display text-4xl">{formatMoney(result.benchmarkSpending)}</dd>
            </div>
            <div className="border-b pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proposed spending growth</dt>
              <dd className="mt-1 font-display text-4xl">{(result.proposedRate * 100).toFixed(2)}%</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proposal vs. benchmark</dt>
              <dd className="mt-1 font-display text-4xl">{result.difference >= 0 ? "+" : "−"}{formatMoney(Math.abs(result.difference))}</dd>
              <p className="mt-2 text-sm text-muted-foreground">{result.difference > 0 ? "Above" : result.difference < 0 ? "Below" : "At"} the population-plus-inflation reference level.</p>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-10 max-w-4xl space-y-4 leading-relaxed text-muted-foreground">
        <h2 className="font-display text-3xl tracking-tight text-foreground">How to use this responsibly</h2>
        <p>Population plus inflation is one fiscal-policy benchmark, not a complete budget analysis. A government may add or remove responsibilities, face one-time emergencies, receive dedicated revenue, or change accounting between periods. Always compare equivalent spending measures.</p>
        <p>For official Texas revenue and spending data, use the <a className="text-primary underline" href="https://comptroller.texas.gov/transparency/" target="_blank" rel="noopener noreferrer">Texas Comptroller's transparency resources</a>. For constitutional and statutory limits, consult the controlling legal text rather than treating this calculator as a legal limit.</p>
      </section>

      <section className="mt-10 border-t pt-7">
        <h2 className="font-display text-3xl tracking-tight">Related KTR guides</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/issues/texas-economy-no-income-tax" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">How Texas pays for government →</a>
          <a href="/issues/texas-property-tax-relief" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Texas property-tax relief →</a>
          <a href="/issues/texas-state-federal-power" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Texas vs. Washington →</a>
        </div>
      </section>
    </main>
  );
}
