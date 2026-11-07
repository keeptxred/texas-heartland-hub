import { createFileRoute, Link } from "@tanstack/react-router";
import { AdSlot } from "@/components/ad-slot";
import { useMemo, useState } from "react";

const TEA_2026_MCR_URL = "https://tea.texas.gov/taa-letters/tax-year-2026-maximum-compressed-tax-rates";
const TEA_FINAL_2026_URL = "https://tea.texas.gov/taa-letters/final-maximum-compressed-tax-rates-mcr-and-adoption-tax-rate-tax-year-2026";
const TEA_STATE_FUNDING_URL = "https://tea.texas.gov/about-tea/state-funding/state-funding";
const TEA_HISTORIC_RATES_URL = "https://tea.texas.gov/about-tea/state-funding/additional-finance-resources/school-district-property-values-and-tax-rates";
const COMPTROLLER_RATES_URL = "https://comptroller.texas.gov/taxes/property-tax/rates/index.php";

export const Route = createFileRoute("/news/isd-tax-burdens")({
  head: () => ({
    meta: [
      { title: "Texas School Property Taxes in 2026: 2026 School Tax Rates, Comparisons and Homeowner Calculator — Keep TX Red" },
      {
        name: "description",
        content:
          "Texas has set the 2026 school-tax compression framework. Review official 2026 compression limits and TEA’s final district MCR release, distinct from adopted total school-tax rates.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: SchoolTaxRatesArticle,
});

function SchoolTaxRatesArticle() {
  const [homeValue, setHomeValue] = useState("350000");
  const [exemption, setExemption] = useState("140000");
  const [maintenanceRate, setMaintenanceRate] = useState("0.7254");
  const [debtRate, setDebtRate] = useState("0.20");
  const estimate = useMemo(() => {
    const nums = [homeValue, exemption, maintenanceRate, debtRate].map(Number);
    if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null;
    const [value, exempt, mo, debt] = nums;
    if (mo > 5 || debt > 5) return null;
    const taxable = Math.max(0, value - exempt);
    return { taxable, moTax: taxable * mo / 100, debtTax: taxable * debt / 100, total: taxable * (mo + debt) / 100 };
  }, [homeValue, exemption, maintenanceRate, debtRate]);
  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/news" className="hover:text-primary">Newsroom</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Tax &amp; Spending</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Tax &amp; Spending</span>
      <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05] mt-2">
        Texas School Property Taxes in 2026: Current Rates, Comparisons and Homeowner Calculator
      </h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-snug font-serif italic">
        Texas has set the 2026 school-tax compression framework. TEA published final district-specific 2026 maximum compressed rates on August 27. These Tier One limits are not adopted total school-tax rates.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-y border-border py-3">
        <span className="font-semibold text-foreground">By Keep TX Red Data Desk</span>
        <span>•</span>
        <span>Updated November 7, 2026</span>
        <span>•</span>
        <span>Tax &amp; Spending</span>
      </div>

      <p className="mt-5 text-sm bg-accent/10 border-l-4 border-accent px-4 py-3 italic text-foreground/80">
        <strong className="not-italic font-semibold text-accent uppercase tracking-wider text-[10px] block mb-1">2026 status</strong>
        TEA released final district-by-district 2026 maximum compressed tax rates on August 27, superseding the August 5 preliminary list. These Tier One limits are not adopted total M&O-plus-debt tax rates.
      </p>

      <div className="prose prose-neutral max-w-none mt-8">
        <p className="font-serif text-lg leading-relaxed text-foreground">
          Texas school property taxes are levied by school districts, not counties. A county can contain several districts, and a district can cross county lines. That is why the old county-based ranking on this page has been retired. The cleaner 2026 comparison is district-level and should distinguish the Tier One maximum compressed rate, enrichment pennies, debt-service tax rate, exemptions, and the final adopted total rate.
        </p>

        <AdSlot placement="top" />

        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">The official 2026 school-tax numbers</h2>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>2026 metric</th>
                  <th>Official rate</th>
                  <th>What it means</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Statewide Tier One compression rate</td>
                  <td><strong>$0.6254</strong></td>
                  <td>State-calculated maximum compressed Tier One rate per $100 of taxable value before local compression.</td>
                </tr>
                <tr>
                  <td>Local-compression floor</td>
                  <td><strong>$0.5628</strong></td>
                  <td>No district's MCR may fall below 90% of the statewide maximum compression rate.</td>
                </tr>
                <tr>
                  <td>Possible 2026 MCR range</td>
                  <td><strong>$0.5628–$0.6254</strong></td>
                  <td>A district's approved Tier One MCR will fall in this range depending on local property-value growth.</td>
                </tr>
                <tr>
                  <td>Maximum M&amp;O rate for most districts</td>
                  <td><strong>$0.7954</strong></td>
                  <td>The $0.6254 statewide MCR plus up to 17 Tier Two enrichment pennies; locally compressed districts can have a lower maximum.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">All rates are per $100 of taxable property value.</p>
        </section>

        <section className="mt-10" aria-labelledby="homeowner-calculator">
          <h2 id="homeowner-calculator" className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Estimate your school property-tax bill</h2>
          <p>This is an illustrative calculator, not a quote or a district tax lookup. Enter your home's appraised value, applicable school exemptions, and your district's <strong>adopted</strong> M&amp;O and I&amp;S rates per $100 of taxable value. The starting example rates are hypothetical, not attributed to any district.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
            {([
              ["Home value ($)", homeValue, setHomeValue],
              ["Applicable school exemptions ($)", exemption, setExemption],
              ["Adopted M&O rate per $100", maintenanceRate, setMaintenanceRate],
              ["Adopted I&S rate per $100", debtRate, setDebtRate],
            ] as const).map(([label, value, setter]) => (
              <label key={label} className="block text-sm font-medium">{label}
                <input className="mt-1 block w-full rounded border border-border bg-background p-2 text-foreground" type="number" min="0" step="any" value={value} onChange={(e) => setter(e.target.value)} />
              </label>
            ))}
          </div>
          {estimate ? <div aria-live="polite" className="rounded border border-border p-4">
            <p>Estimated taxable value: <strong>{money(estimate.taxable)}</strong></p>
            <p>M&amp;O estimate: <strong>{money(estimate.moTax)}</strong></p>
            <p>I&amp;S estimate: <strong>{money(estimate.debtTax)}</strong></p>
            <p className="text-lg">Estimated annual school tax: <strong>{money(estimate.total)}</strong></p>
          </div> : <p role="alert">Enter nonnegative values and plausible rates (no more than $5 per $100).</p>}
          <p className="text-sm text-muted-foreground mt-3">Formula: max(0, home value − applicable exemptions) × (adopted M&amp;O + adopted I&amp;S rate) ÷ 100. Actual tax bills can differ due to appraisal caps, special exemptions, separate taxable values, and other adjustments. Confirm your taxable value and rates with your appraisal district and school district.</p>
        </section>

        <section className="mt-10" aria-labelledby="rate-comparison">
          <h2 id="rate-comparison" className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">What changed in the statewide framework?</h2>
          <div className="overflow-x-auto"><table><thead><tr><th>Metric, per $100 taxable value</th><th>2025</th><th>2026</th><th>Difference</th></tr></thead><tbody>
            <tr><td>State Tier One MCR ceiling</td><td>$0.6322</td><td>$0.6254</td><td>−$0.0068</td></tr>
            <tr><td>90% local-compression floor</td><td>$0.5689</td><td>$0.5628</td><td>−$0.0061</td></tr>
            <tr><td>Maximum M&amp;O for most districts</td><td>$0.8022</td><td>$0.7954</td><td>−$0.0068</td></tr>
          </tbody></table></div>
          <p>The statewide Tier One ceiling decreased by about <strong>1.08%</strong> ($0.0068 ÷ $0.6322). For an illustrative $210,000 taxable value, a $0.0068 rate reduction would equal <strong>$14.28 per year</strong> if every other factor remained unchanged. This is a comparison of statutory ceilings, <strong>not</strong> a prediction of an individual homeowner's tax savings.</p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Which districts have the highest 2026 rates?</h2>
          <p>TEA finalized the district-specific 2026 MCR list on August 27, following the Local Property Value Survey and appeals. The final file under District &amp; Charter Planning Tools on TEA's State Funding page supersedes the August 5 preliminary rates.</p>
          <p>A ranking of actual 2026 school-tax burdens requires comparable adopted total rates, including maintenance-and-operations (M&amp;O) and interest-and-sinking (I&amp;S) debt rates. TEA says total M&amp;O figures in its Summary of Finances will be updated by February 2027 after Comptroller data arrive. Final MCRs alone cannot establish which districts have the highest total rates.</p>
          <p>The <strong>final 2026 district MCR file is published</strong>, but it is not a district-by-district adopted-tax-rate dataset. This article does not present a fabricated ranking or claim to have verified each district record. For district-level Tier One ceilings, consult the <a href={TEA_STATE_FUNDING_URL} target="_blank" rel="noreferrer">final 2026 district MCR file</a> for Tier One ceilings. A future adopted-rate ranking should identify M&amp;O, I&amp;S and total adopted rates separately using a complete 2026 dataset.</p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Why the old county ranking was misleading</h2>
          <ul>
            <li><strong>Counties do not levy ISD taxes.</strong> School districts do.</li>
            <li><strong>District boundaries do not follow county lines.</strong> One county can have several ISDs with different rates.</li>
            <li><strong>M&amp;O is not the whole bill.</strong> Debt-service, or I&amp;S, rates can materially change the total.</li>
            <li><strong>Tax rate is not tax burden.</strong> Exemptions and taxable value determine what a homeowner actually pays.</li>
            <li><strong>Tax years must match.</strong> A 2026 article should not rank districts using 2025 adopted rates unless they are explicitly labeled as prior-year context.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">What changed from 2025</h2>
          <p>
            The statewide maximum compressed Tier One rate fell from $0.6322 in tax year 2025 to $0.6254 in tax year 2026. The local-compression floor fell from $0.5689 to $0.5628. That means the 2026 Tier One framework is lower statewide before district-specific enrichment and debt-service rates are added.
          </p>
          <p>
            TEA also notes that the 2026 maximum M&amp;O rate for most districts is $0.7954, down from $0.8022 in 2025. Districts with stronger local compression can have lower ceilings.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Research methodology and corrections</h2>
          <p>Research by Keep TX Red Data Desk. We compare the TEA June 18, 2026 statewide compression framework with its August 27 final district determinations, keeping statutory Tier One MCRs separate from district-adopted M&amp;O and I&amp;S rates. The arithmetic examples above are original calculations using stated assumptions, not observed household bills.</p>
          <p>District-specific final MCRs are available through TEA's planning tools. TEA's historical adopted-rate spreadsheets currently cover through tax year 2025; we will not silently substitute them for 2026. TEA expects its 2026 total M&amp;O data to be updated by February 2027. Corrections should cite the official district, year, rate type and source document; we will update this page when a verified comparable dataset becomes available.</p>
          <p>Last source review: November 7, 2026. Primary sources are linked below. This page is an editorial explanation, not legal or tax advice.</p>
        </section>
        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Official sources</h2>
          <ul>
            <li><a href={TEA_2026_MCR_URL} target="_blank" rel="noreferrer">Texas Education Agency — Tax Year 2026 Maximum Compressed Tax Rates</a></li>
            <li><a href={TEA_FINAL_2026_URL} target="_blank" rel="noreferrer">Texas Education Agency — Final 2026 MCR Determinations (August 27, 2026)</a></li>
            <li><a href={TEA_STATE_FUNDING_URL} target="_blank" rel="noreferrer">Texas Education Agency — State Funding / District &amp; Charter Planning Tools</a></li>
            <li><a href={TEA_HISTORIC_RATES_URL} target="_blank" rel="noreferrer">TEA — School District Property Values and Adopted Tax Rates (historical through 2025)</a></li>
            <li><a href={COMPTROLLER_RATES_URL} target="_blank" rel="noreferrer">Texas Comptroller — Tax Rates and Levies</a></li>
          </ul>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-6 flex flex-wrap gap-4 text-sm">
        <Link to="/texas-business" search={{ topic: "taxation" }} className="text-primary hover:underline">More Texas tax coverage →</Link>
        <Link to="/news" className="text-primary hover:underline">Browse the newsroom →</Link>
      </div>
    </article>
  );
}
