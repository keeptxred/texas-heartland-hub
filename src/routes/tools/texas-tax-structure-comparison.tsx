import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

const PAGE_URL = "https://keeptxred.com/tools/texas-tax-structure-comparison";

export const Route = createFileRoute("/tools/texas-tax-structure-comparison")({
  head: () => ({
    meta: [
      { title: "Texas Tax Structure Comparison Tool | Keep TX Red" },
      { name: "description", content: "Estimate how property taxes, sales taxes, fees and a hypothetical income tax affect a household. Enter your own figures instead of relying on a statewide average." },
      { property: "og:title", content: "Texas Tax Structure Comparison Tool | Keep TX Red" },
      { property: "og:description", content: "Compare a household's entered Texas state and local taxes with a hypothetical income-tax scenario." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Texas Tax Structure Comparison Tool",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: "A user-input calculator comparing property, sales and other taxes with a hypothetical income-tax scenario.",
      }),
    }],
  }),
  component: TaxStructureComparison,
});

function number(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function TaxStructureComparison() {
  const [income, setIncome] = useState("100000");
  const [propertyTax, setPropertyTax] = useState("7000");
  const [taxableSpending, setTaxableSpending] = useState("30000");
  const [salesTaxRate, setSalesTaxRate] = useState("8.25");
  const [otherTaxes, setOtherTaxes] = useState("1000");
  const [hypotheticalIncomeTaxRate, setHypotheticalIncomeTaxRate] = useState("5");
  const [hypotheticalPropertyTaxReduction, setHypotheticalPropertyTaxReduction] = useState("25");

  const result = useMemo(() => {
    const annualIncome = Math.max(0, number(income));
    const property = Math.max(0, number(propertyTax));
    const spending = Math.max(0, number(taxableSpending));
    const salesRate = Math.max(0, number(salesTaxRate)) / 100;
    const other = Math.max(0, number(otherTaxes));
    const incomeRate = Math.max(0, number(hypotheticalIncomeTaxRate)) / 100;
    const propertyReduction = Math.min(100, Math.max(0, number(hypotheticalPropertyTaxReduction))) / 100;

    const salesTax = spending * salesRate;
    const enteredCurrentTaxes = property + salesTax + other;
    const hypotheticalIncomeTax = annualIncome * incomeRate;
    const hypotheticalPropertyTax = property * (1 - propertyReduction);
    const hypotheticalTotal = hypotheticalPropertyTax + salesTax + other + hypotheticalIncomeTax;

    return {
      salesTax,
      enteredCurrentTaxes,
      currentShare: annualIncome > 0 ? enteredCurrentTaxes / annualIncome : 0,
      hypotheticalIncomeTax,
      hypotheticalPropertyTax,
      hypotheticalTotal,
      hypotheticalShare: annualIncome > 0 ? hypotheticalTotal / annualIncome : 0,
      difference: hypotheticalTotal - enteredCurrentTaxes,
    };
  }, [income, propertyTax, taxableSpending, salesTaxRate, otherTaxes, hypotheticalIncomeTaxRate, hypotheticalPropertyTaxReduction]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <nav className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" aria-label="Breadcrumb">
        <a href="/issues" className="hover:text-primary">Texas Issues</a> <span aria-hidden="true">/</span> Policy Tool
      </nav>
      <header className="mt-5 max-w-4xl">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">★ Fiscal Policy Tool</span>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-tight md:text-6xl">TEXAS TAX STRUCTURE<br /><span className="text-primary">COMPARISON TOOL</span></h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Texas has no state individual income tax, but households still pay property taxes, sales taxes, fees and other levies. Enter your own figures to compare that mix with a hypothetical income-tax scenario.</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="border p-6" aria-labelledby="current-inputs">
          <h2 id="current-inputs" className="font-display text-3xl tracking-tight">Your inputs</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Annual household income" value={income} onChange={setIncome} />
            <Field label="Annual property taxes" value={propertyTax} onChange={setPropertyTax} />
            <Field label="Annual taxable purchases" value={taxableSpending} onChange={setTaxableSpending} />
            <Field label="Combined sales-tax rate (%)" value={salesTaxRate} onChange={setSalesTaxRate} />
            <Field label="Other state/local taxes & fees" value={otherTaxes} onChange={setOtherTaxes} />
          </div>

          <h3 className="mt-8 font-display text-2xl tracking-tight">Hypothetical alternative</h3>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field label="Hypothetical income-tax rate (%)" value={hypotheticalIncomeTaxRate} onChange={setHypotheticalIncomeTaxRate} />
            <Field label="Property-tax reduction (%)" value={hypotheticalPropertyTaxReduction} onChange={setHypotheticalPropertyTaxReduction} />
          </div>
        </section>

        <section className="border bg-muted/20 p-6" aria-labelledby="comparison-results">
          <h2 id="comparison-results" className="font-display text-3xl tracking-tight">Comparison</h2>
          <dl className="mt-5 space-y-5">
            <Result label="Estimated sales tax from your inputs" value={money(result.salesTax)} />
            <Result label="Entered current tax mix" value={money(result.enteredCurrentTaxes)} note={`${(result.currentShare * 100).toFixed(2)}% of entered household income`} />
            <Result label="Hypothetical income tax" value={money(result.hypotheticalIncomeTax)} />
            <Result label="Hypothetical property tax" value={money(result.hypotheticalPropertyTax)} />
            <Result label="Hypothetical combined tax mix" value={money(result.hypotheticalTotal)} note={`${(result.hypotheticalShare * 100).toFixed(2)}% of entered household income`} />
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difference</dt>
              <dd className="mt-1 font-display text-4xl">{result.difference >= 0 ? "+" : "−"}{money(Math.abs(result.difference))}</dd>
              <p className="mt-2 text-sm text-muted-foreground">The hypothetical scenario is {result.difference > 0 ? "higher" : result.difference < 0 ? "lower" : "the same"} based only on the figures you entered.</p>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-10 max-w-4xl space-y-4 leading-relaxed text-muted-foreground">
        <h2 className="font-display text-3xl tracking-tight text-foreground">What this tool does — and does not do</h2>
        <p>This is a scenario calculator, not a tax-return estimator and not a claim about the average Texan. It intentionally requires user-entered values because property taxes, taxable purchases, local sales-tax rates, fees and household income vary widely.</p>
        <p>The hypothetical income-tax scenario is not current Texas law. It is included so readers can test policy claims about changing the tax mix. For official state revenue information, use the <a href="https://comptroller.texas.gov/transparency/revenue/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Texas Comptroller's revenue resources</a>.</p>
      </section>

      <section className="mt-10 border-t pt-7">
        <h2 className="font-display text-3xl tracking-tight">Related KTR resources</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/issues/texas-economy-no-income-tax" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">How Texas pays for government →</a>
          <a href="/issues/texas-property-tax-relief" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Texas property-tax relief →</a>
          <a href="/tools/texas-spending-growth-cap" className="border px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Spending-growth calculator →</a>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} inputMode="decimal" className="mt-2 w-full border bg-background px-3 py-3" aria-label={label} />
    </label>
  );
}

function Result({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border-b pb-4 last:border-0">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-4xl">{value}</dd>
      {note ? <p className="mt-1 text-sm text-muted-foreground">{note}</p> : null}
    </div>
  );
}
