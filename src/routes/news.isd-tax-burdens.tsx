import { createFileRoute, Link } from "@tanstack/react-router";
import { AdSlot } from "@/components/ad-slot";

const TEA_2026_MCR_URL = "https://tea.texas.gov/taa-letters/tax-year-2026-maximum-compressed-tax-rates";
const TEA_STATE_FUNDING_URL = "https://tea.texas.gov/about-tea/state-funding/state-funding";
const COMPTROLLER_RATES_URL = "https://comptroller.texas.gov/taxes/property-tax/rates/index.php";

export const Route = createFileRoute("/news/isd-tax-burdens")({
  head: () => ({
    meta: [
      { title: "Texas School Property Taxes in 2026: Current Rates and District Tracker — Keep TX Red" },
      {
        name: "description",
        content:
          "Texas has set the 2026 school-tax compression framework. Track the official 2026 MCR range, maximum M&O rates, and district-level data as TEA releases it.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: SchoolTaxRatesArticle,
});

function SchoolTaxRatesArticle() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/news" className="hover:text-primary">Newsroom</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Tax &amp; Spending</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Tax &amp; Spending</span>
      <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05] mt-2">
        Texas School Property Taxes in 2026: Current Rates and District Tracker
      </h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-snug font-serif italic">
        Texas has set the 2026 school-tax compression framework. District-specific 2026 maximum compressed rates are being finalized in August, so this page tracks the official 2026 numbers without mixing them with prior-year adopted rates.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-y border-border py-3">
        <span className="font-semibold text-foreground">By Keep TX Red Data Desk</span>
        <span>•</span>
        <span>Updated August 7, 2026</span>
        <span>•</span>
        <span>Tax &amp; Spending</span>
      </div>

      <p className="mt-5 text-sm bg-accent/10 border-l-4 border-accent px-4 py-3 italic text-foreground/80">
        <strong className="not-italic font-semibold text-accent uppercase tracking-wider text-[10px] block mb-1">2026 status</strong>
        TEA has published the statewide 2026 compression formula and rate limits. Its public State Funding page had not yet posted a statewide district-by-district 2026 MCR list as of this update. We will not substitute 2025 district rates and label them 2026.
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

        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Which districts have the highest 2026 rates?</h2>
          <p>
            That ranking is not final yet. TEA's June 18 guidance says districts submitted 2026 local property-value data during the July 18–August 1 Local Property Value Survey window. TEA then uses those submissions to calculate each district's 2026 maximum compressed Tier One rate and makes approved MCRs available in August.
          </p>
          <p>
            As of August 7, TEA's public State Funding page still listed the 2025 final district MCR file, not a statewide 2026 district list. Until the 2026 list is posted, any statewide “top 10 districts” ranking would either be incomplete or would quietly reuse 2025 figures. We are not doing that.
          </p>
          <p>
            When TEA publishes the statewide 2026 district file, this page should rank districts using a clearly labeled metric—preferably <strong>adopted total school tax rate</strong> once adopted-rate data are complete, with separate columns for M&amp;O and I&amp;S. Until then, the official statewide 2026 rate framework above is the current authoritative comparison.
          </p>
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
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Official sources</h2>
          <ul>
            <li><a href={TEA_2026_MCR_URL} target="_blank" rel="noreferrer">Texas Education Agency — Tax Year 2026 Maximum Compressed Tax Rates</a></li>
            <li><a href={TEA_STATE_FUNDING_URL} target="_blank" rel="noreferrer">Texas Education Agency — State Funding / District &amp; Charter Planning Tools</a></li>
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
