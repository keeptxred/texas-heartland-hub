import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { TAX_RATE_DATASET } from "@/data/counties";

const REVIEWED_DATE = "July 25, 2026";

type FinancialTrustPanelProps = {
  calculatorName: string;
  propertyTaxRelated?: boolean;
};

export default function FinancialTrustPanel({
  calculatorName,
  propertyTaxRelated = /property tax|homeownership|affordability|mortgage|rent vs buy/i.test(
    calculatorName,
  ),
}: FinancialTrustPanelProps) {
  return (
    <section
      aria-labelledby="financial-trust-heading"
      className="mx-auto my-10 w-full max-w-6xl rounded-xl border bg-white p-6 shadow-sm md:p-8"
    >
      <div className="border-b pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
          Methodology and editorial review
        </p>
        <h2 id="financial-trust-heading" className="mt-2 text-2xl font-bold text-gray-900">
          How the {calculatorName} works
        </h2>
        <div className="mt-4 grid gap-3 text-sm text-gray-700 md:grid-cols-2">
          <p>
            <strong>Prepared by:</strong>{" "}
            <Link to="/authors/$slug" params={{ slug: "data-desk" }} className="text-red-700 underline">
              Keep TX Red Data Desk
            </Link>
            , which builds calculators from primary-source government data and publishes auditable
            methodology.
          </p>
          <p>
            <strong>Reviewed by:</strong>{" "}
            <Link to="/authors/$slug" params={{ slug: "taxpayer-desk" }} className="text-red-700 underline">
              Keep TX Red Taxpayer Desk
            </Link>
            , the editorial desk covering Texas property taxes, exemptions, appraisal procedures,
            and local-government finance.
          </p>
          <p><strong>Last reviewed:</strong> {REVIEWED_DATE}</p>
          <p>
            <strong>Model status:</strong> Educational deterministic calculator; results are not an
            appraisal, tax bill, loan estimate, insurance quote, or eligibility decision.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Calculation methodology</h3>
          {propertyTaxRelated ? (
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                The property-tax portion estimates each taxing unit separately. The basic formula is:
                <strong> taxable value ÷ 100 × tax rate</strong>. Applicable exemptions are removed
                from the value for the taxing unit that grants them. Estimated county, city, school,
                and special-district amounts are then added together.
              </p>
              <p>
                When a residence-homestead appraisal cap is modeled, the calculator limits the
                appraised-value input to the prior qualifying value plus 10%, before exemptions.
                That is a planning model of the statutory cap—not a determination that a parcel
                qualifies. Tax ceilings, proration, omitted property, rollback taxes, frozen values,
                special appraisals, and local optional exemptions may require parcel-specific handling.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
              <p>
                The calculator applies the displayed inputs to fixed formulas in your browser. It
                combines the amounts shown, converts between monthly and annual figures where labeled,
                and applies only the assumptions disclosed on the page. It does not retrieve a private
                underwriting, payroll, utility, insurance, or program-eligibility decision.
              </p>
              <p>
                Defaults and presets are examples, not statewide averages or quotes. Replace them with
                current written figures, retain the source and effective date of each important input,
                and compare an expected scenario with a conservative scenario.
              </p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Worked example</h3>
          {propertyTaxRelated ? (
            <div className="mt-3 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
              <p>
                A $400,000 qualifying residence with a $140,000 school-district homestead exemption
                has an estimated ISD taxable value of $260,000. At an example ISD rate of $0.90 per
                $100, the estimated school tax is:
              </p>
              <p className="my-3 font-semibold">($260,000 ÷ 100) × $0.90 = $2,340</p>
              <p>
                County, city, MUD, hospital, college, ESD, PID, and other amounts must be calculated
                using their own taxable values, exemptions, rates, or assessments and then added.
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
              <p>
                If a tool estimates $2,400 per month from entered recurring costs, the annualized
                planning figure is $28,800. Raising uncertain inputs by 10% produces a $31,680
                conservative scenario—a $2,880 annual contingency. The output remains an estimate
                until each material input is replaced with a current official figure or written quote.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Data sources and effective dates</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
            {propertyTaxRelated ? (
              <>
                <li>
                  Rate dataset:{" "}
                  <a href={TAX_RATE_DATASET.sourceUrl} className="text-red-700 underline">
                    Texas Comptroller property-tax rate resources
                  </a>
                  ; tax year {TAX_RATE_DATASET.taxYear}; dataset refreshed{" "}
                  {new Date(`${TAX_RATE_DATASET.lastUpdated}T12:00:00Z`).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  })}.
                </li>
                <li>
                  Parcel values, taxing units, exemptions, and final rates:{" "}
                  <a
                    href="https://comptroller.texas.gov/taxes/property-tax/county-directory/"
                    className="text-red-700 underline"
                  >
                    Texas Comptroller county appraisal-district directory
                  </a>
                  . Verify against the parcel record and current tax statement.
                </li>
                <li>
                  Statutory framework:{" "}
                  <a href="https://statutes.capitol.texas.gov/Docs/TX/htm/TX.11.htm" className="text-red-700 underline">
                    Texas Tax Code Chapter 11
                  </a>{" "}
                  (exemptions),{" "}
                  <a href="https://statutes.capitol.texas.gov/Docs/TX/htm/TX.23.htm#23.23" className="text-red-700 underline">
                    §23.23
                  </a>{" "}
                  (residence-homestead appraisal limitation), and{" "}
                  <a href="https://statutes.capitol.texas.gov/Docs/TX/htm/TX.26.htm" className="text-red-700 underline">
                    Chapter 26
                  </a>{" "}
                  (assessment and tax-rate process).
                </li>
              </>
            ) : (
              <>
                <li>
                  Texas tax and state-finance context:{" "}
                  <a href="https://comptroller.texas.gov/taxes/" className="text-red-700 underline">
                    Texas Comptroller
                  </a>
                  .
                </li>
                <li>
                  Mortgage and consumer-finance guidance:{" "}
                  <a href="https://www.consumerfinance.gov/consumer-tools/mortgages/" className="text-red-700 underline">
                    Consumer Financial Protection Bureau
                  </a>
                  .
                </li>
                <li>
                  Federal tax rules and withholding resources:{" "}
                  <a href="https://www.irs.gov/" className="text-red-700 underline">Internal Revenue Service</a>.
                  User-entered rates and quotes remain effective only as of the date shown by their issuer.
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Limitations and disclaimer</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
            <li>Results are estimates for education and planning, not financial, tax, legal, mortgage, insurance, or investment advice.</li>
            <li>Actual amounts depend on the specific property, jurisdiction, contract, provider, eligibility rules, timing, and information entered.</li>
            <li>Rates and laws can change after the effective and review dates shown above.</li>
            <li>Confirm material decisions with the responsible government office and an appropriately licensed professional.</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-lg border-l-4 border-red-700 bg-red-50 p-5 text-sm text-gray-800">
        <h3 className="font-semibold text-gray-900">Corrections and questions</h3>
        <p className="mt-2 leading-relaxed">
          Found an outdated rate, formula problem, or unclear assumption?{" "}
          <Link to="/contact" className="font-semibold text-red-700 underline">
            Contact the newsroom
          </Link>{" "}
          with the calculator URL, affected field, source link, and effective date. We review
          documented corrections against our{" "}
          <Link to="/editorial-standards" className="font-semibold text-red-700 underline">
            editorial standards
          </Link>{" "}
          and update the review date when a material correction is published.
        </p>
      </div>
    </section>
  );
}

export function withFinancialTrust<P extends object>(
  Page: ComponentType<P>,
  calculatorName: string,
  propertyTaxRelated?: boolean,
) {
  return function FinanciallyReviewedPage(props: P) {
    return (
      <>
        <Page {...props} />
        <FinancialTrustPanel
          calculatorName={calculatorName}
          propertyTaxRelated={propertyTaxRelated}
        />
      </>
    );
  };
}
