import React, { useState } from "react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { CalculatorInput } from "@/components/calculators/CalculatorInputs";
import CalculatorResults from "@/components/calculators/CalculatorResults";
import BreakdownTable from "@/components/calculators/BreakdownTable";
import ShareResults from "@/components/calculators/ShareResults";
import { calculateVehicleFees } from "@/lib/calculators/relocationTools";

export default function TexasVehicleFeesEstimator() {
  const [inputs, setInputs] = useState({ vehicles: 2, titleTransfers: 2, countyFee: 11.5 });
  const set = (key: keyof typeof inputs, value: string) => setInputs({ ...inputs, [key]: Number(value) });
  const result = calculateVehicleFees(inputs);
  return <CalculatorLayout title="Texas Vehicle Registration & Fees Estimator" description="Estimate common Texas registration, title-transfer, local county, processing, and new-resident vehicle charges." canonicalUrl="https://keeptxred.com/tools/texas-vehicle-fees-estimator" lastUpdated="July 2026" schema={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Texas Vehicle Registration & Fees Estimator", applicationCategory: "FinanceApplication" }}>
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-3">
        <CalculatorInput id="vehicles" label="Vehicles to register" min={1} max={10} value={inputs.vehicles} onChange={(v) => set("vehicles", v)} />
        <CalculatorInput id="titles" label="Out-of-state title transfers" min={0} max={10} value={inputs.titleTransfers} onChange={(v) => set("titleTransfers", v)} />
        <CalculatorInput id="countyFee" label="Estimated local county fee per vehicle" prefix="$" step={0.25} value={inputs.countyFee} onChange={(v) => set("countyFee", v)} helpText="Local fees vary by county; replace this allowance with your county's published amount." />
      </div>
      <CalculatorResults title="Estimated Texas Vehicle Fees" results={[{ label: "Estimated Total", value: result.total, type: "currency", highlight: true }]} />
      <BreakdownTable title="Estimated Fee Breakdown" rows={[
        { label: "Base registration", value: result.registration }, { label: "Local county fees", value: result.localFees },
        { label: "Processing allowances", value: result.processing }, { label: "Title transfers", value: result.titleFees },
        { label: "New resident tax allowances", value: result.newResidentTax },
      ]} showTotal totalLabel="Estimated Total" />
      <div className="rounded-xl border bg-amber-50 p-4 text-sm text-amber-900">This planning estimate does not include every possible inspection, specialty plate, late, lien, weight, or county-specific charge. Verify final fees with the Texas DMV or county tax office.</div>
      <ShareResults title="Texas Vehicle Registration & Fees Estimator" summary={`Estimated Texas vehicle fees: ${result.total.toLocaleString("en-US", { style: "currency", currency: "USD" })}`} />
    </div>
  </CalculatorLayout>;
}
