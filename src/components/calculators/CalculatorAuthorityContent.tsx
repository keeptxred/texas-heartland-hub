import { Link } from "@tanstack/react-router";

interface FieldSummary {
  key: string;
  label: string;
  helpText?: string;
}

interface PresetSummary {
  label: string;
  description: string;
}

interface CalculatorAuthorityContentProps {
  title: string;
  description: string;
  category: string;
  slug: string;
  fields: FieldSummary[];
  assumptions: string[];
  presets?: PresetSummary[];
  resultMeaning: string;
}

const counties = [
  ["Harris County", "harris"],
  ["Dallas County", "dallas"],
  ["Tarrant County", "tarrant"],
  ["Bexar County", "bexar"],
  ["Travis County", "travis"],
  ["Collin County", "collin"],
  ["Denton County", "denton"],
  ["Fort Bend County", "fort-bend"],
] as const;

const cities = ["Houston", "Dallas", "Fort Worth", "San Antonio", "Austin", "Katy", "Plano", "Round Rock"] as const;

const relatedCalculators = [
  ["Texas Moving Cost Calculator", "/texas-moving-cost-calculator"],
  ["Texas Cost of Living Calculator", "/texas-cost-of-living-calculator"],
  ["Texas Salary Comparison by City", "/texas-salary-comparison-by-city"],
  ["Texas Budget Planner", "/texas-budget-planner"],
  ["Texas Home Affordability Calculator", "/texas-home-affordability-calculator"],
  ["Texas Property Tax Calculator", "/tax-calculator"],
] as const;

export default function CalculatorAuthorityContent({
  title,
  description,
  category,
  slug,
  fields,
  assumptions,
  presets = [],
  resultMeaning,
}: CalculatorAuthorityContentProps) {
  const inputNames = fields.slice(0, 6).map((field) => field.label.toLowerCase());
  const inputSentence = inputNames.length > 1
    ? `${inputNames.slice(0, -1).join(", ")}, and ${inputNames.at(-1)}`
    : inputNames[0] ?? "the requested information";
  const examples = presets.length > 0
    ? presets.slice(0, 2)
    : [
        { label: "Conservative estimate", description: "Use cautious assumptions and include a contingency." },
        { label: "Expected estimate", description: "Use the figures that best match your current plan." },
      ];
  const visibleRelated = relatedCalculators.filter(([, to]) => to !== slug).slice(0, 5);

  return (
    <div className="mt-12 space-y-12 border-t pt-10">
      <section aria-labelledby="calculator-guide-heading" className="prose prose-gray max-w-none">
        <h2 id="calculator-guide-heading">How to use the {title}</h2>
        <p>
          {description} This free Texas-focused tool is designed to turn a collection of separate
          costs and assumptions into one practical planning estimate. Start with information you can
          verify, then use reasonable placeholders for figures that are still uncertain. The most
          useful result is not necessarily the lowest number. It is the estimate that gives your
          household enough room to make a decision without being surprised by expenses that were
          left out of the first draft of the plan.
        </p>
        <p>
          The calculator asks for {inputSentence}. Review every default before relying on the result.
          Defaults are examples, not statewide averages or promises about what a provider, lender,
          employer, taxing unit, mover, insurer, or utility will charge. Texas costs can vary sharply
          by metro area, county, neighborhood, property type, household size, season, commute, and
          personal choices. A family moving to suburban Houston can face a very different mix of
          housing, insurance, toll, utility, and special-district costs than a household moving to
          central Dallas, Austin, San Antonio, or a smaller Texas community.
        </p>
        <p>
          Enter a first-pass scenario, save or share the result, and then create a second scenario
          using more conservative assumptions. Comparing scenarios is more useful than treating one
          output as a quote. Build in a contingency for items that are easy to overlook, including
          deposits, service activation fees, temporary lodging, storage, repairs, insurance changes,
          vehicle expenses, school or childcare transitions, and the gap between an estimated bill
          and the first actual bill. Revisit the calculation when a written quote or official rate
          replaces one of your assumptions.
        </p>
      </section>

      <section aria-labelledby="examples-heading">
        <h2 id="examples-heading" className="text-2xl font-bold">Worked planning examples</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {examples.map((example, index) => (
            <article key={example.label} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-semibold">Example {index + 1}: {example.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {example.description} Load this scenario as a starting point, then replace each value
                with a number that applies to your household. Compare the result with a version that
                is 10% to 20% higher for uncertain costs. The difference becomes a useful contingency
                target rather than an unexpected shortfall.
              </p>
            </article>
          ))}
        </div>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          For example, a relocating household may know its salary and housing target but still be
          estimating insurance, utilities, commute costs, and setup expenses. A current Texas resident
          may know recent bills but need to test how a move, home purchase, refinance, appraisal change,
          or larger household would affect the budget. In both cases, the calculator is strongest when
          the user records the source and date of each important input and updates the scenario as new
          information becomes available.
        </p>
      </section>

      <section aria-labelledby="interpret-heading" className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h2 id="interpret-heading" className="text-xl font-bold">How to interpret the estimate</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{resultMeaning}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Treat the result as a planning range. Check whether it is monthly, annual, one-time, or a
            combination of those time periods before comparing it with another calculator. Avoid
            counting the same expense twice when moving a result into a broader household budget.
            Round uncertain figures up, especially when the decision depends on having enough cash at
            closing, enough savings after a move, or enough monthly margin after recurring bills.
          </p>
        </div>
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-bold">Important assumptions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
            <li>Results use the values entered and do not automatically verify a quote or eligibility decision.</li>
            <li>Local Texas costs and rules may change, so confirm time-sensitive figures before acting.</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="local-links-heading">
        <h2 id="local-links-heading" className="text-2xl font-bold">Compare Texas counties and cities</h2>
        <p className="mt-3 max-w-4xl leading-relaxed text-muted-foreground">
          Location is one of the largest drivers of a Texas estimate. Property taxes, insurance risk,
          housing prices, utilities, commute patterns, toll exposure, and service fees can differ even
          between nearby communities. Use these links to continue the research with a local comparison,
          then return to this calculator and replace broad assumptions with county- and city-specific numbers.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">Popular county calculations</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {counties.map(([name, county]) => (
                <Link key={county} to={`/tax-calculator?county=${county}`} className="rounded-full border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary">
                  {name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Popular Texas city comparisons</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link key={city} to={`/texas-cost-of-living-calculator?city=${encodeURIComponent(city)}`} className="rounded-full border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary">
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-2xl font-bold">Related Texas calculators</h2>
        <p className="mt-3 text-muted-foreground">
          A {category.toLowerCase()} estimate is usually only one part of a complete Texas plan. Use
          the related tools below to connect one-time costs, recurring living expenses, income,
          housing, and taxes without rebuilding the same assumptions from scratch.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRelated.map(([name, to]) => (
            <Link key={to} to={to} className="rounded-xl border p-4 font-semibold text-primary transition hover:-translate-y-0.5 hover:shadow-sm">
              {name} →
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq-guidance-heading" className="prose prose-gray max-w-none">
        <h2 id="faq-guidance-heading">Common questions about calculator accuracy</h2>
        <h3>How accurate is this calculator?</h3>
        <p>
          Accuracy depends primarily on the inputs. The formulas apply the entered values consistently,
          but the tool cannot know a future bill, quote, rate change, underwriting decision, appraisal,
          or household choice. Use current written information whenever possible and run a conservative
          scenario for uncertain costs.
        </p>
        <h3>Does the result include every Texas expense?</h3>
        <p>
          No single calculator can include every expense. Review the assumptions and use the related
          calculators for costs outside this tool's scope. Depending on the decision, missing items may
          include property taxes, insurance, utilities, HOA or special-district charges, tolls, vehicle
          costs, deposits, maintenance, childcare, healthcare, and emergency savings.
        </p>
        <h3>How often should I update the calculation?</h3>
        <p>
          Update it whenever a major assumption changes or a real quote replaces an estimate. For a
          relocation or home purchase, that may mean recalculating after choosing a city, receiving an
          insurance quote, confirming a tax rate, selecting a utility plan, or negotiating a contract.
        </p>
        <h3>Is my information stored?</h3>
        <p>
          The calculation runs in the browser and does not require an account. A saved scenario stays in
          local browser storage unless the page explicitly states otherwise. Do not enter sensitive
          identifiers such as Social Security, bank-account, or full payment-card numbers.
        </p>
      </section>

      <aside className="rounded-xl border-l-4 border-primary bg-muted p-6 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Next step:</strong> verify the largest two or three inputs
        with current sources, rerun the estimate, and save a conservative version. Browse all tools in
        the <Link to="/texas-financial-tools" className="font-semibold text-primary underline">Texas financial tools hub</Link>,
        or review the <Link to="/moving-to-texas" className="font-semibold text-primary underline">moving to Texas guide</Link> and
        <Link to="/living-in-texas" className="ml-1 font-semibold text-primary underline">living in Texas resources</Link>.
      </aside>
    </div>
  );
}
