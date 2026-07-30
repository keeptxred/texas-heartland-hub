import { useState } from "react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { CalculatorInput } from "@/components/calculators/CalculatorInputs";
import CalculatorResults from "@/components/calculators/CalculatorResults";
import { electricitySavings } from "@/lib/calculators/relocationDecisionTools";

const PUCT_CONSUMER_URL = "https://www.puc.texas.gov/consumer/electricity/";
const POWER_TO_CHOOSE_URL = "https://www.powertochoose.org/";

export default function TexasElectricityPlanSavingsCalculator() {
  const [values, setValues] = useState({
    kwh: 2000,
    currentRate: 16,
    newRate: 13.5,
    fee: 10,
  });

  const result = electricitySavings(
    values.kwh,
    values.currentRate,
    values.newRate,
    values.fee,
  );

  const update = (key: keyof typeof values, value: string) => {
    const parsed = Number(value);
    setValues((current) => ({
      ...current,
      [key]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    }));
  };

  return (
    <CalculatorLayout
      title="Texas Electricity Plan Savings Calculator"
      description="Compare Texas electricity plans using the all-in average rates shown on Electricity Facts Labels at the same monthly usage level."
      canonicalUrl="https://keeptxred.com/tools/texas-electricity-plan-savings-calculator"
      lastUpdated="July 2026"
      schema={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Texas Electricity Plan Savings Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        isAccessibleForFree: true,
        citation: [PUCT_CONSUMER_URL, POWER_TO_CHOOSE_URL],
      }}
    >
      <div className="space-y-8">
        <section className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <h2 className="font-semibold">Use matching Electricity Facts Label figures</h2>
          <p className="mt-1">
            Enter the average price in cents per kWh shown on each plan&apos;s EFL for the same usage level—typically 500, 1,000, or 2,000 kWh. That published average generally reflects energy charges, recurring delivery charges, and recurring plan fees at that usage level.
          </p>
          <p className="mt-2">
            Only enter an additional monthly fee below when it is not already included in the all-in average rate you entered.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2" aria-label="Electricity plan inputs">
          <CalculatorInput
            id="kwh"
            label="Monthly usage"
            suffix="kWh"
            value={values.kwh}
            onChange={(value) => update("kwh", value)}
          />
          <CalculatorInput
            id="currentRate"
            label="Current plan all-in EFL rate"
            suffix="¢/kWh"
            step={0.1}
            value={values.currentRate}
            onChange={(value) => update("currentRate", value)}
          />
          <CalculatorInput
            id="newRate"
            label="Proposed plan all-in EFL rate"
            suffix="¢/kWh"
            step={0.1}
            value={values.newRate}
            onChange={(value) => update("newRate", value)}
          />
          <CalculatorInput
            id="fee"
            label="Additional monthly fee not included above"
            prefix="$"
            value={values.fee}
            onChange={(value) => update("fee", value)}
          />
        </section>

        <CalculatorResults
          title="Plan comparison"
          results={[
            { label: "Current estimated bill", value: result.currentMonthly, type: "currency" },
            { label: "Proposed estimated bill", value: result.newMonthly, type: "currency", highlight: true },
            { label: "Monthly savings", value: result.monthlySavings, type: "currency" },
            { label: "Annual savings", value: result.annualSavings, type: "currency" },
          ]}
        />

        <section className="rounded-xl border p-5 text-sm text-gray-600">
          <h2 className="font-semibold text-gray-900">Official comparison sources</h2>
          <ul className="mt-3 space-y-3">
            <li>
              <a className="font-medium text-red-700 underline underline-offset-2" href={POWER_TO_CHOOSE_URL} target="_blank" rel="noreferrer">
                Public Utility Commission of Texas — Power to Choose
              </a>
              <p className="mt-1">Search by ZIP code and open each plan&apos;s current Electricity Facts Label before entering rates.</p>
            </li>
            <li>
              <a className="font-medium text-red-700 underline underline-offset-2" href={PUCT_CONSUMER_URL} target="_blank" rel="noreferrer">
                Public Utility Commission of Texas — Electricity consumer information
              </a>
              <p className="mt-1">Review contract terms, customer protections, provider information, and complaint resources.</p>
            </li>
          </ul>
          <p className="mt-4">
            Estimate only. Verify usage credits, minimum-use charges, time-of-use pricing, delivery-charge changes, contract length, renewable content, deposits, and early termination fees. This tool does not determine whether a plan is available at a specific address.
          </p>
          <p className="mt-2 text-xs text-gray-500">Sources reviewed July 22, 2026. Review again by October 15, 2026 because retail offers change frequently.</p>
        </section>
      </div>
    </CalculatorLayout>
  );
}
