import React, { useState } from "react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { CalculatorInput } from "@/components/calculators/CalculatorInputs";
import CalculatorResults from "@/components/calculators/CalculatorResults";
import BreakdownTable from "@/components/calculators/BreakdownTable";
import ShareResults from "@/components/calculators/ShareResults";
import SharedRelocationProfile from "@/components/calculators/SharedRelocationProfile";
import { calculateLivingCosts, defaultRelocationProfile } from "@/lib/calculators/relocationTools";

export default function TexasMonthlyLivingCostCalculator() {
  const [profile, setProfile] = useState(defaultRelocationProfile);
  const [extras, setExtras] = useState({ childcare: 0, healthcare: 550, savingsRate: 10 });
  const result = calculateLivingCosts({ ...profile, ...extras });
  const setExtra = (key: keyof typeof extras, value: string) => setExtras({ ...extras, [key]: Number(value) });
  return <CalculatorLayout title="Texas Monthly Living Cost Calculator" description="Estimate a complete monthly Texas household budget including housing, utilities, groceries, transportation, insurance, healthcare, childcare, entertainment, and savings." canonicalUrl="https://keeptxred.com/tools/texas-monthly-living-cost-calculator" lastUpdated="July 2026" schema={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Texas Monthly Living Cost Calculator", applicationCategory: "FinanceApplication" }}>
    <div className="space-y-8">
      <SharedRelocationProfile value={profile} onChange={setProfile} />
      <div className="grid gap-5 md:grid-cols-3">
        <CalculatorInput id="healthcare" label="Monthly healthcare" prefix="$" value={extras.healthcare} onChange={(v) => setExtra("healthcare", v)} />
        <CalculatorInput id="childcare" label="Monthly childcare" prefix="$" value={extras.childcare} onChange={(v) => setExtra("childcare", v)} />
        <CalculatorInput id="savingsRate" label="Savings target" suffix="%" value={extras.savingsRate} onChange={(v) => setExtra("savingsRate", v)} />
      </div>
      <CalculatorResults title="Estimated Living Costs" results={[
        { label: "Monthly Cost", value: result.monthlyTotal, type: "currency", highlight: true },
        { label: "Annual Cost", value: result.annualTotal, type: "currency" },
        { label: "Monthly Income Remaining", value: result.incomeRemaining, type: "currency" },
      ]} />
      <BreakdownTable title="Monthly Budget Breakdown" rows={result.breakdown.map(([label, value]) => ({ label, value }))} showTotal totalLabel="Monthly Living Cost" />
      <ShareResults title="Texas Monthly Living Cost Calculator" summary={`Estimated monthly Texas living cost: ${result.monthlyTotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}`} />
    </div>
  </CalculatorLayout>;
}
