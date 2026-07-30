import React from "react";
import { CalculatorInput, CalculatorSelect } from "@/components/calculators/CalculatorInputs";
import type { RelocationProfile } from "@/lib/calculators/relocationTools";

interface Props {
  value: RelocationProfile;
  onChange: (value: RelocationProfile) => void;
  showCommute?: boolean;
}

export default function SharedRelocationProfile({ value, onChange, showCommute = true }: Props) {
  const set = (key: keyof RelocationProfile, next: string) => {
    onChange({ ...value, [key]: key === "currentCity" || key === "destinationCity" ? next : Number(next) });
  };

  return (
    <section className="space-y-5 rounded-xl border bg-gray-50 p-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Your relocation profile</h2>
        <p className="text-sm text-gray-600">These shared inputs keep estimates consistent across Texas relocation tools.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <CalculatorInput id="currentCity" type="text" label="Current city" value={value.currentCity} onChange={(v) => set("currentCity", v)} />
        <CalculatorSelect id="destinationCity" label="Texas destination" value={value.destinationCity} onChange={(v) => set("destinationCity", v)} options={[
          { label: "Houston", value: "Houston" }, { label: "Dallas–Fort Worth", value: "Dallas–Fort Worth" },
          { label: "Austin", value: "Austin" }, { label: "San Antonio", value: "San Antonio" },
          { label: "Other Texas city", value: "Other Texas city" },
        ]} />
        <CalculatorInput id="householdSize" label="Household size" min={1} max={12} value={value.householdSize} onChange={(v) => set("householdSize", v)} />
        <CalculatorInput id="annualIncome" label="Annual household income" prefix="$" value={value.annualIncome} onChange={(v) => set("annualIncome", v)} />
        <CalculatorInput id="monthlyHousing" label="Expected monthly housing" prefix="$" value={value.monthlyHousing} onChange={(v) => set("monthlyHousing", v)} />
        <CalculatorInput id="vehicles" label="Number of vehicles" min={0} max={10} value={value.vehicles} onChange={(v) => set("vehicles", v)} />
        {showCommute && <CalculatorInput id="commuteMiles" label="One-way commute" suffix="miles" value={value.commuteMiles} onChange={(v) => set("commuteMiles", v)} />}
      </div>
    </section>
  );
}
