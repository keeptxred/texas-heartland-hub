import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { STATE_BUDGET_DATA_REVIEWED_AT, STATE_BUDGET_METRICS } from "@/data/state-budget-data";
import {
  CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS,
  PROJECTED_ESF_BALANCE_BILLIONS,
  calculateRainyDayFundScenario,
} from "@/lib/texas-rainy-day-fund";

const SITE_URL = "https://keeptxred.com";
const PAGE_URL = `${SITE_URL}/tools/texas-rainy-day-fund`;
const ESF_METRIC = STATE_BUDGET_METRICS.find((item) => item.label.startsWith("Projected Rainy Day Fund balance"));

export const Route = createFileRoute("/tools/texas-rainy-day-fund")({
  head: () => ({
    meta: [
      { title: "Texas Rainy Day Fund Explorer | Economic Stabilization Fund" },
      { name: "description", content: "Test a hypothetical Texas Economic Stabilization Fund withdrawal against the latest official-source-backed projection in KTR's state-budget dataset." },
      { property: "og:title", content: "Texas Rainy Day Fund Explorer | Keep TX Red" },
      { property: "og:description", content: "See how a proposed withdrawal would change the projected Texas Economic Stabilization Fund balance." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Texas Rainy Day Fund Explorer",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: "A scenario tool for comparing a hypothetical withdrawal with Texas Economic Stabilization Fund budget metrics.",
      }),
    }],
  }),
  component: RainyDayFundExplorer,
});

function parseInput(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatBillions(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B`;
}

function RainyDayFundExplorer() {
  const [withdrawal, setWithdrawal] = useState("5");
  const result = useMemo(() => calculateRainyDayFundScenario(parseInput(withdrawal)), [withdrawal]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <nav className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" aria-label="Breadcrumb">
        <a href="/issues" className="hover:text-primary">Texas Issues</a> <span aria-hidden="true">/</span> Fiscal Policy Tool
      </nav>

      <header className="mt-5 max-w-4xl">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ State Budget Tool</span>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-tight md:text-6xl">TEXAS RAINY DAY<br /><span className="text-primary">FUND EXPLORER</span></h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Test a hypothetical withdrawal from the Texas Economic Stabilization Fund against the latest official-source-backed projection stored in KTR&apos;s state-budget dataset. This is a scenario tool, not a forecast of what lawmakers will spend.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Current reference metrics">
        <div className="border bg-muted/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Projected fund balance</p>
          <p className="mt-2 font-display text-4xl">{formatBillions(PROJECTED_ESF_BALANCE_BILLIONS)}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">End-of-FY-2027 projection in the current state-budget dataset.</p>
        </div>
        <div className="border bg-muted/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Certified general-purpose spending</p>
          <p className="mt-2 font-display text-4xl">{formatBillions(CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS)}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Used only as a scale comparison for the scenario.</p>
        </div>
        <div className="border bg-muted/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dataset reviewed</p>
          <p className="mt-2 font-display text-3xl">{STATE_BUDGET_DATA_REVIEWED_AT}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Update the source dataset when official projections change.</p>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="border p-6" aria-labelledby="withdrawal-heading">
          <h2 id="withdrawal-heading" className="font-display text-3xl tracking-tight">Scenario input</h2>
          <label className="mt-5 block">
            <span className="text-sm font-semibold">Hypothetical withdrawal ($ billions)</span>
            <input
              value={withdrawal}
              onChange={(event) => setWithdrawal(event.target.value)}
              inputMode="decimal"
              aria-label="Hypothetical Rainy Day Fund withdrawal in billions of dollars"
              className="mt-2 w-full border bg-background px-3 py-3"
            />
          </label>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Enter a policy proposal or your own scenario. The tool does not cap the input at the projected fund balance; proposals larger than the projection are shown as overdrawn instead of being silently clipped.
          </p>
        </section>

        <section className="border bg-muted/20 p-6" aria-labelledby="scenario-result-heading">
          <h2 id="scenario-result-heading" className="font-display text-3xl tracking-tight">Scenario result</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="border-b pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Remaining projected balance</dt>
              <dd className="mt-1 font-display text-4xl">{formatBillions(result.remainingBalanceBillions)}</dd>
            </div>
            <div className="border-b pb-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Share of fund used</dt>
              <dd className="mt-1 font-display text-4xl">{result.percentOfFundUsed.toFixed(1)}%</dd>
            </div>
            <div className="border-b pb-4 sm:border-b-0">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Withdrawal vs. general-purpose spending</dt>
              <dd className="mt-1 font-display text-4xl">{result.withdrawalAsPercentOfGeneralPurposeSpending.toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount beyond projection</dt>
              <dd className="mt-1 font-display text-4xl">{formatBillions(result.overdrawnByBillions)}</dd>
            </div>
          </dl>
          {result.overdrawnByBillions > 0 ? (
            <p className="mt-5 border-l-4 border-primary bg-background px-4 py-3 text-sm leading-6">
              This scenario exceeds the projected fund balance by {formatBillions(result.overdrawnByBillions)}. That does not mean the state could legally or practically make such a withdrawal; it means the requested amount is larger than the projection used by this tool.
            </p>
          ) : null}
        </section>
      </div>

      <section className="mt-10 max-w-4xl space-y-4 leading-relaxed text-muted-foreground">
        <h2 className="font-display text-3xl tracking-tight text-foreground">Source and interpretation</h2>
        <p>
          The opening balance is pulled from KTR&apos;s reviewed state-budget dataset rather than duplicated as a separate hard-coded figure in this calculator. When that dataset is updated, this tool&apos;s reference balance updates with it.
        </p>
        {ESF_METRIC ? (
          <p>
            Official reference: <a href={ESF_METRIC.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">{ESF_METRIC.label}</a>. The metric note in KTR&apos;s dataset says: {ESF_METRIC.note}
          </p>
        ) : null}
        <p>
          The Economic Stabilization Fund is governed by Texas law and constitutional provisions. This explorer is arithmetic context only; it does not determine whether a particular appropriation is legally authorized or politically likely.
        </p>
      </section>

      <section className="mt-10 border-t pt-7">
        <h2 className="font-display text-3xl tracking-tight">Related KTR guides and tools</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/issues/texas-economy-no-income-tax" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">How Texas pays for government →</a>
          <a href="/issues/texas-property-tax-relief" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Texas property-tax relief →</a>
          <a href="/tools/texas-spending-growth-cap" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Spending growth calculator →</a>
        </div>
      </section>
    </main>
  );
}
