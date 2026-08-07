import { createFileRoute, Link } from "@tanstack/react-router";
import { AdSlot } from "@/components/ad-slot";

const COMPTROLLER_RATES_URL = "https://comptroller.texas.gov/taxes/property-tax/rates/index.php";
const TEA_2026_MCR_URL = "https://tea.texas.gov/taa-letters/tax-year-2026-maximum-compressed-tax-rates";
const TEA_2025_FINAL_MCR_URL = "https://tea.texas.gov/taa-letters/2025-final-maximum-compressed-tax-rates-mcr-and-adoption-tax-rate";

export const Route = createFileRoute("/news/isd-tax-burdens")({
  head: () => ({
    meta: [
      { title: "Texas School Tax Rates: What the 2025 Data Shows — Keep TX Red" },
      {
        name: "description",
        content:
          "The latest complete statewide school-district tax-rate data is for tax year 2025. Here is what is known, what changed for 2026, and why a final 2026 ranking is premature.",
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
        Texas School Tax Rates: What the 2025 Data Shows — and Why 2026 Is Not Final Yet
      </h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-snug font-serif italic">
        The Comptroller has published the statewide 2025 school-district rates and levies. Texas has also set the 2026 compression framework, but districts had not yet completed adoption of their final 2026 tax rates when this update was published.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-y border-border py-3">
        <span className="font-semibold text-foreground">By Keep TX Red Data Desk</span>
        <span>•</span>
        <span>Updated August 7, 2026</span>
        <span>•</span>
        <span>Tax &amp; Spending</span>
      </div>

      <p className="mt-5 text-sm bg-accent/10 border-l-4 border-accent px-4 py-3 italic text-foreground/80">
        <strong className="not-italic font-semibold text-accent uppercase tracking-wider text-[10px] block mb-1">Correction</strong>
        An earlier version of this page was labeled as a 2024 county ranking and implied that a current 2026 county-by-county ranking could be produced from incomplete information. We have replaced that framing. The latest complete statewide school-district tax-rate dataset published by the Texas Comptroller is for tax year 2025.
      </p>

      <div className="prose prose-neutral max-w-none mt-8">
        <p className="font-serif text-lg leading-relaxed text-foreground">
          Texas school property taxes are assessed by school districts, not by counties. A county can contain multiple school districts, and some school districts cross county lines. That means a simple list of “counties with the highest school tax burden” can be misleading unless the methodology specifies exactly how district rates, taxable values, exemptions, and overlapping geography are combined.
        </p>

        <p>
          For statewide comparisons, the most defensible source is the Texas Comptroller’s Property Tax Assistance Division. Its Tax Rates and Levies page now lists <strong>2025 School District Rates and Levies</strong> as the latest complete statewide dataset. The Comptroller explains that the figures are reported by appraisal districts and may be updated as certified property-value information is finalized.
        </p>

        <AdSlot placement="top" />

        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">What changed from 2025 to 2026</h2>
          <p>
            Texas continued compressing school-district maintenance-and-operations tax rates. For tax year 2025, the statewide maximum compressed Tier One rate was <strong>$0.6322 per $100 of taxable value</strong>, with local-compression rates potentially lower.
          </p>
          <p>
            For tax year 2026, the Texas Education Agency calculated a statewide maximum compressed Tier One rate of <strong>$0.6254 per $100</strong>. Depending on local property-value growth, a district’s rate may be lower. TEA set the 2026 local-compression floor at <strong>$0.5628</strong>, creating a possible maximum-compressed-rate range of $0.5628 to $0.6254 before enrichment pennies are considered.
          </p>
          <p>
            TEA also states that the maximum 2026 M&amp;O tax rate for most districts is <strong>$0.7954</strong>, which is the $0.6254 statewide compressed rate plus up to 17 enrichment pennies. Some districts will have a lower maximum because of local compression.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Why there is no honest final 2026 ranking yet</h2>
          <p>
            The 2026 compression formula is available, but that is not the same thing as a complete list of adopted 2026 district tax rates. TEA’s June 18 guidance said districts would submit local property-value information during a July 18–August 1 collection window and that district maximum compressed rates would be made available in August. Districts adopt their own tax rates after the required calculations and local rate-setting process.
          </p>
          <p>
            Until those adopted rates are available statewide, calling any list a definitive “2026 ranking” would mix final 2025 figures with preliminary or calculated 2026 values. Keep TX Red will not do that.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">How to compare school taxes correctly</h2>
          <ul>
            <li><strong>Use district-level rates.</strong> School districts are the taxing units; county boundaries are not a reliable substitute.</li>
            <li><strong>Separate M&amp;O from I&amp;S.</strong> Maintenance-and-operations rates and debt-service rates serve different purposes and can move differently.</li>
            <li><strong>Account for exemptions.</strong> The tax rate alone does not equal the bill paid by a homeowner.</li>
            <li><strong>Use the same tax year.</strong> Do not compare a final 2025 adopted rate against a preliminary 2026 compression calculation.</li>
            <li><strong>Label the metric.</strong> “Highest rate,” “highest levy,” and “highest tax bill on a typical home” are three different rankings.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">Official sources</h2>
          <ul>
            <li><a href={COMPTROLLER_RATES_URL} target="_blank" rel="noreferrer">Texas Comptroller — Tax Rates and Levies</a></li>
            <li><a href={TEA_2026_MCR_URL} target="_blank" rel="noreferrer">Texas Education Agency — Tax Year 2026 Maximum Compressed Tax Rates</a></li>
            <li><a href={TEA_2025_FINAL_MCR_URL} target="_blank" rel="noreferrer">Texas Education Agency — 2025 Final Maximum Compressed Tax Rates and Adoption of Tax Rate</a></li>
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
