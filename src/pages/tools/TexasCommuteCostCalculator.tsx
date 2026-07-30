import React, { useState } from "react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { CalculatorInput } from "@/components/calculators/CalculatorInputs";
import CalculatorResults from "@/components/calculators/CalculatorResults";
import BreakdownTable from "@/components/calculators/BreakdownTable";
import ShareResults from "@/components/calculators/ShareResults";
import { calculateCommute } from "@/lib/calculators/relocationTools";

export default function TexasCommuteCostCalculator() {
  const [inputs, setInputs] = useState({ roundTripMiles: 40, workDaysPerMonth: 21, mpg: 24, gasPrice: 2.85, monthlyTolls: 80, monthlyParking: 0, hourlyValue: 30, minutesPerDay: 70 });
  const set = (key: keyof typeof inputs, value: string) => setInputs({ ...inputs, [key]: Number(value) });
  const result = calculateCommute(inputs);
  return <CalculatorLayout title="Texas Commute Cost Calculator" description="Estimate fuel, tolls, parking, vehicle wear, and the value of time spent commuting in Texas." canonicalUrl="https://keeptxred.com/tools/texas-commute-cost-calculator" lastUpdated="July 2026" schema={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Texas Commute Cost Calculator", applicationCategory: "FinanceApplication" }}>
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <CalculatorInput id="miles" label="Daily round-trip commute" suffix="miles" value={inputs.roundTripMiles} onChange={(v) => set("roundTripMiles", v)} />
        <CalculatorInput id="days" label="Work days per month" value={inputs.workDaysPerMonth} onChange={(v) => set("workDaysPerMonth", v)} />
        <CalculatorInput id="mpg" label="Vehicle fuel economy" suffix="MPG" value={inputs.mpg} onChange={(v) => set("mpg", v)} />
        <CalculatorInput id="gas" label="Gas price" prefix="$" value={inputs.gasPrice} step={0.01} onChange={(v) => set("gasPrice", v)} />
        <CalculatorInput id="tolls" label="Monthly tolls" prefix="$" value={inputs.monthlyTolls} onChange={(v) => set("monthlyTolls", v)} />
        <CalculatorInput id="parking" label="Monthly parking" prefix="$" value={inputs.monthlyParking} onChange={(v) => set("monthlyParking", v)} />
        <CalculatorInput id="minutes" label="Daily commute time" suffix="minutes" value={inputs.minutesPerDay} onChange={(v) => set("minutesPerDay", v)} />
        <CalculatorInput id="hourly" label="Value of your time" prefix="$" suffix="/hr" value={inputs.hourlyValue} onChange={(v) => set("hourlyValue", v)} />
      </div>
      <CalculatorResults title="Estimated Commute Cost" results={[
        { label: "Monthly Cash Cost", value: result.monthlyTotal, type: "currency", highlight: true },
        { label: "Annual Cash Cost", value: result.annualTotal, type: "currency" },
        { label: "Monthly Cost Including Time", value: result.economicTotal, type: "currency" },
      ]} />
      <BreakdownTable title="Monthly Commute Breakdown" rows={[
        { label: "Fuel", value: result.fuel }, { label: "Vehicle wear", value: result.wear }, { label: "Tolls", value: inputs.monthlyTolls }, { label: "Parking", value: inputs.monthlyParking }, { label: "Time value", value: result.time },
      ]} />
      <ShareResults title="Texas Commute Cost Calculator" summary={`Estimated monthly commute cost: ${result.monthlyTotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}`} />
    </div>
  </CalculatorLayout>;
}
