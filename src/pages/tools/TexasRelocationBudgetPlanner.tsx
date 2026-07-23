import React, { useMemo, useState } from "react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import {
  CalculatorInput,
  CalculatorSelect,
} from "@/components/calculators/CalculatorInputs";
import CalculatorResults from "@/components/calculators/CalculatorResults";
import BreakdownTable from "@/components/calculators/BreakdownTable";
import ShareResults from "@/components/calculators/ShareResults";
import {
  calculateRelocationBudget,
  type MoveDistance,
} from "@/lib/calculators/relocationBudget";

const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function TexasRelocationBudgetPlanner() {
  const [inputs, setInputs] = useState({
    householdSize: 4,
    bedrooms: 3,
    moveDistance: "long-distance" as MoveDistance,
    miles: 1000,
    monthlyRentOrMortgage: 2400,
    utilityDeposit: 450,
    insuranceDeposit: 350,
    vehicles: 2,
    adultsNeedingLicense: 2,
    travelCost: 600,
    temporaryLodgingNights: 3,
    lodgingNightlyRate: 160,
    packingSupplies: 350,
    professionalMovers: true,
    emergencyFundMonths: 3,
    monthlyLivingExpenses: 5500,
  });

  const results = useMemo(() => calculateRelocationBudget(inputs), [inputs]);

  const updateNumber = (key: keyof typeof inputs, value: string) =>
    setInputs((current) => ({ ...current, [key]: Number(value) }));

  return (
    <CalculatorLayout
      title="Texas Relocation Budget Planner"
      description="Build a complete Texas moving budget covering movers, deposits, travel, vehicle fees, licenses, contingency funds, and an emergency reserve."
      canonicalUrl="https://keeptxred.com/tools/texas-relocation-budget-planner"
      lastUpdated="July 2026"
      schema={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Texas Relocation Budget Planner",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
      }}
    >
      <div className="space-y-8">
        <section className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900">Move details</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <CalculatorInput id="household-size" label="Household size" min={1} max={12} value={inputs.householdSize} onChange={(v) => updateNumber("householdSize", v)} />
            <CalculatorInput id="bedrooms" label="Bedrooms being moved" min={1} max={8} value={inputs.bedrooms} onChange={(v) => updateNumber("bedrooms", v)} />
            <CalculatorSelect
              id="move-distance"
              label="Move type"
              value={inputs.moveDistance}
              options={[
                { label: "Local Texas move", value: "local" },
                { label: "Regional move", value: "regional" },
                { label: "Long-distance move", value: "long-distance" },
              ]}
              onChange={(value) => setInputs((current) => ({ ...current, moveDistance: value as MoveDistance }))}
            />
            <CalculatorInput id="miles" label="Estimated moving distance" suffix="miles" min={0} max={4000} value={inputs.miles} onChange={(v) => updateNumber("miles", v)} />
            <CalculatorInput id="packing" label="Packing supplies" prefix="$" min={0} value={inputs.packingSupplies} onChange={(v) => updateNumber("packingSupplies", v)} />
          </div>
          <label className="flex items-center gap-3 rounded-xl border bg-gray-50 p-4">
            <input type="checkbox" checked={inputs.professionalMovers} onChange={(event) => setInputs((current) => ({ ...current, professionalMovers: event.target.checked }))} className="h-5 w-5" />
            <span className="font-medium text-gray-800">Use professional movers</span>
          </label>
        </section>

        <section className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900">Move-in and travel costs</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <CalculatorInput id="housing" label="Expected monthly rent or mortgage" prefix="$" min={0} value={inputs.monthlyRentOrMortgage} onChange={(v) => updateNumber("monthlyRentOrMortgage", v)} helpText="Planner reserves two months for deposits, first payment, and setup." />
            <CalculatorInput id="utility-deposit" label="Utility deposits and connection fees" prefix="$" min={0} value={inputs.utilityDeposit} onChange={(v) => updateNumber("utilityDeposit", v)} />
            <CalculatorInput id="insurance-deposit" label="Insurance deposits or initial premiums" prefix="$" min={0} value={inputs.insuranceDeposit} onChange={(v) => updateNumber("insuranceDeposit", v)} />
            <CalculatorInput id="vehicles" label="Vehicles to register" min={0} max={8} value={inputs.vehicles} onChange={(v) => updateNumber("vehicles", v)} />
            <CalculatorInput id="licenses" label="Adults needing a Texas license" min={0} max={8} value={inputs.adultsNeedingLicense} onChange={(v) => updateNumber("adultsNeedingLicense", v)} />
            <CalculatorInput id="travel" label="Fuel, airfare, meals, and other travel" prefix="$" min={0} value={inputs.travelCost} onChange={(v) => updateNumber("travelCost", v)} />
            <CalculatorInput id="lodging-nights" label="Temporary lodging nights" min={0} max={60} value={inputs.temporaryLodgingNights} onChange={(v) => updateNumber("temporaryLodgingNights", v)} />
            <CalculatorInput id="lodging-rate" label="Nightly lodging cost" prefix="$" min={0} value={inputs.lodgingNightlyRate} onChange={(v) => updateNumber("lodgingNightlyRate", v)} />
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900">Emergency reserve</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <CalculatorInput id="living-expenses" label="Expected monthly living expenses" prefix="$" min={0} value={inputs.monthlyLivingExpenses} onChange={(v) => updateNumber("monthlyLivingExpenses", v)} />
            <CalculatorInput id="emergency-months" label="Emergency fund target" suffix="months" min={0} max={12} value={inputs.emergencyFundMonths} onChange={(v) => updateNumber("emergencyFundMonths", v)} />
          </div>
        </section>

        <CalculatorResults
          title="Recommended relocation cash target"
          results={[
            { label: "Move and setup budget", value: results.total, type: "currency", highlight: true },
            { label: "Emergency fund", value: results.emergencyFund, type: "currency" },
            { label: "Recommended cash target", value: results.recommendedCashTarget, type: "currency", highlight: true },
          ]}
        />

        <BreakdownTable
          title="Relocation budget breakdown"
          rows={results.breakdown.map((item) => ({ label: item.label, value: item.amount }))}
          showTotal
          totalLabel="Recommended cash target"
        />

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          This planner provides budgeting estimates, not quotes. Registration, licensing, deposits, insurance, mover pricing, and local fees vary. Verify current charges with the relevant provider or government agency before moving.
        </div>

        <ShareResults title="Texas Relocation Budget Planner" summary={`Recommended relocation cash target: ${currency(results.recommendedCashTarget)}`} />
      </div>
    </CalculatorLayout>
  );
}
