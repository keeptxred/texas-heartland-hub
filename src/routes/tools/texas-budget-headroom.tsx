import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { STATE_BUDGET_DATA_REVIEWED_AT, STATE_BUDGET_METRICS } from "@/data/state-budget-data";
import {
  CERTIFIED_ENDING_GR_BALANCE_BILLIONS,
  CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS,
  CERTIFIED_GR_RELATED_REVENUE_BILLIONS,
  calculateBudgetHeadroomScenario,
} from "@/lib/texas-budget-headroom";

const SITE_URL = "https://keeptxred.com";
const PAGE_URL = `${SITE_URL}/tools/texas-budget-headroom`;
const REVENUE_METRIC = STATE_BUDGET_METRICS.find((item) => item.label.startsWith("Certified GR-related revenue available"));
const SPENDING_METRIC = STATE_BUDGET_METRICS.find((item) => item.label.startsWith("Certified general-purpose spending"));

export const Route = createFileRoute("/tools/texas-budget-headroom")({
  head: () => ({
    meta: [
      { title: "Texas Budget Headroom Calculator | Revenue vs. Spending" },
      { name: "description", content: "Model how changes in Texas certified GR-related revenue, general-purpose spending, and one-time appropriations would affect the projected ending balance." },
      { property: "og:title", content: "Texas Budget Headroom Calculator | Keep TX Red" },
      { property: "og:description", content: "Stress-test Texas General Revenue-related budget headroom using KTR's reviewed official-source fiscal dataset." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Texas Budget Headroom Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: "A scenario calculator for Texas certified GR-related revenue, general-purpose spending, and projected ending budget balance.",
      }),
    }],
  }),
  component: TexasBudgetHeadroomCalculator,
});

function parseInput(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatBillions(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B`;
}

function TexasBudgetHeadroomCalculator() {
  const [revenueChange, setRevenueChange] = useState("0");
  const [spendingChange, setSpendingChange] = useState("0");
  const [oneTimeSpending, setOneTimeSpending] = useState("0");
  const result = useMemo(() => calculateBudgetHeadroomScenario({
    revenueChangePercent: parseInput(revenueChange),
    spendingChangePercent: parseInput(spendingChange),
    additionalOneTimeSpendingBillions: parseInput(oneTimeSpending),
  }), [revenueChange, spendingChange, oneTimeSpending]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <nav className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" aria-label="Breadcrumb">
        <a href="/tools" className="hover:text-primary">Policy Tools</a> <span aria-hidden="true">/</span> Budget Headroom
      </nav>

      <header className="mt-5 max-w-4xl">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ State Budget Tool</span>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-tight md:text-6xl">TEXAS BUDGET<br /><span className="text-primary">HEADROOM CALCULATOR</span></h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Stress-test the certified 2026–27 General Revenue-related budget by changing revenue, recurring general-purpose spending, or adding a one-time appropriation. The result shows how much projected ending balance remains—or how large a shortfall the scenario creates.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-4" aria-label="Certified budget reference metrics">
        <div className="border bg-muted/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">GR-related revenue available</p>
          <p className="mt-2 font-display text-3xl">{formatBillions(CERTIFIED_GR_RELATED_REVENUE_BILLIONS)}</p>
        </div>
        <div className="border bg-muted/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">General-purpose spending</p>
          <p className="mt-2 font-display text-3xl">{formatBillions(CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS)}</p>
        </div>
        <div className="border bg-muted/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Certified ending balance</p>
          <p className="mt-2 font-display text-3xl">{formatBillions(CERTIFIED_ENDING_GR_BALANCE_BILLIONS)}</p>
        </div>
        <div className="border bg-muted/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dataset reviewed</p>
          <p className="mt-2 font-display text-2xl">{STATE_BUDGET_DATA_REVIEWED_AT}</p>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="border p-6" aria-labelledby="scenario-input-heading">
          <h2 id="scenario-input-heading" className="font-display text-3xl tracking-tight">Scenario inputs</h2>
          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold">GR-related revenue change (%)</span>
              <input value={revenueChange} onChange={(event) => setRevenueChange(event.target.value)} inputMode="decimal" className="mt-2 w-full border bg-background px-3 py-3" />
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">Use a negative number for a revenue decline.</span>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">General-purpose spending change (%)</span>
              <input value={spendingChange} onChange={(event) => setSpendingChange(event.target.value)} inputMode="decimal" className="mt-2 w-full border bg-background px-3 py-3" />
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">Changes the certified general-purpose spending baseline.</span>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Additional one-time spending ($ billions)</span>
              <input value={oneTimeSpending} onChange={(event) => setOneTimeSpending(event.target.value)} inputMode="decimal" className="mt-2 w-full border bg-background px-3 py-3" />
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">Negative values are treated as zero so they cannot create artificial headroom.</span>
            </label>
          </div>
        </section>

        <section className="border bg-muted/20 p-6" aria-labelledby="scenario-result-heading">
          <h2 id="scenario-result-heading" className="font-display text-3xl tracking-tight">Scenario result</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="border-b pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scenario revenue</dt>
              <dd className="mt-1 font-display text-4xl">{formatBillions(result.projectedRevenueBillions)}</dd>
            </div>
            <div className="border-b pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scenario spending</dt>
              <dd className="mt-1 font-display text-4xl">{formatBillions(result.projectedSpendingBillions)}</dd>
            </div>
            <div className="border-b pb-4 sm:border-b-0">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projected ending balance</dt>
              <dd className="mt-1 font-display text-4xl">{formatBillions(result.projectedEndingBalanceBillions)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change from certified balance</dt>
              <dd className="mt-1 font-display text-4xl">{formatBillions(result.changeFromCertifiedBalanceBillions)}</dd>
            </div>
          </dl>
          {result.shortfallBillions > 0 ? (
            <p className="mt-5 border-l-4 border-primary bg-background px-4 py-3 text-sm leading-6">
              This scenario produces a projected GR-related shortfall of {formatBillions(result.shortfallBillions)} relative to the revenue and spending assumptions entered here.
            </p>
          ) : (
            <p className="mt-5 border-l-4 border-primary bg-background px-4 py-3 text-sm leading-6">
              This scenario leaves {formatBillions(result.remainingHeadroomBillions)} of projected GR-related ending balance under the assumptions entered here.
            </p>
          )}
        </section>
      </div>

      <section className="mt-10 max-w-4xl space-y-4 leading-relaxed text-muted-foreground">
        <h2 className="font-display text-3xl tracking-tight text-foreground">What this calculator does—and does not do</h2>
        <p>
          This tool uses the certified GR-related revenue and general-purpose spending metrics already maintained in KTR&apos;s reviewed state-budget dataset. It is a scenario calculator, not a forecast of future collections, a constitutional spending-limit test, or a determination of whether a specific appropriation is legally available.
        </p>
        {REVENUE_METRIC ? <p>Revenue source: <a href={REVENUE_METRIC.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">{REVENUE_METRIC.label}</a>. {REVENUE_METRIC.note}</p> : null}
        {SPENDING_METRIC ? <p>Spending source: <a href={SPENDING_METRIC.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">{SPENDING_METRIC.label}</a>. {SPENDING_METRIC.note}</p> : null}
      </section>

      <section className="mt-10 border-t pt-7">
        <h2 className="font-display text-3xl tracking-tight">Related KTR guides and tools</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/issues/texas-economy-no-income-tax" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Texas economy & fiscal policy →</a>
          <a href="/tools/texas-spending-growth-cap" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Spending growth calculator →</a>
          <a href="/tools/texas-rainy-day-fund" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Rainy Day Fund explorer →</a>
          <a href="/tools/texas-tax-structure-comparison" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Tax structure comparison →</a>
        </div>
      </section>
    </main>
  );
}
