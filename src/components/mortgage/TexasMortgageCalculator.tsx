import { useMemo, useState } from "react";
import { texasMortgageDefaults } from "@/data/mortgage/texasMortgageDefaults";
import { calculateTexasMortgage } from "@/lib/mortgage/texasMortgageEngine";
import { formatMortgageCurrency } from "@/lib/mortgage/texasMortgageHelpers";

const comparisonDefaults = { ...texasMortgageDefaults, comparisonRate: 5.75, extraMonthlyPayment: 0 };

export default function TexasMortgageCalculator() {
  const [values, setValues] = useState(comparisonDefaults);
  const downPaymentPercent = values.homePrice > 0 ? values.downPayment / values.homePrice : 0;
  const estimatedPmi = downPaymentPercent < 0.2 ? Math.max(0, values.homePrice - values.downPayment) * 0.007 / 12 : 0;
  const effectivePmi = values.monthlyPmi || estimatedPmi;
  const errors = {
    ...(values.homePrice <= 0 ? { homePrice: "Home price must be greater than zero." } : {}),
    ...(values.downPayment < 0 || values.downPayment > values.homePrice ? { downPayment: "Down payment must be between zero and the home price." } : {}),
    ...(values.annualInterestRate < 0 || values.annualInterestRate > 25 ? { annualInterestRate: "Enter a rate from 0% to 25%." } : {}),
    ...(values.comparisonRate < 0 || values.comparisonRate > 25 ? { comparisonRate: "Enter a comparison rate from 0% to 25%." } : {}),
  };
  const hasErrors = Object.keys(errors).length > 0;

  const current = useMemo(() => calculateTexasMortgage({ ...values, monthlyPmi: effectivePmi }), [effectivePmi, values]);
  const comparison = useMemo(() => calculateTexasMortgage({ ...values, annualInterestRate: values.comparisonRate, monthlyPmi: effectivePmi }), [effectivePmi, values]);
  const monthlyDifference = current.totalMonthlyPayment - comparison.totalMonthlyPayment;
  const fiveYearDifference = monthlyDifference * 60;
  const termDifference = monthlyDifference * values.termYears * 12;
  const extraAnnual = Math.max(0, values.extraMonthlyPayment) * 12;

  const update = (key: keyof typeof comparisonDefaults, value: number) => setValues((currentValues) => ({ ...currentValues, [key]: value }));

  return (
    <section className="space-y-6 rounded-xl border p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Home price" value={values.homePrice} min={50000} max={10000000} prefix="$" error={errors.homePrice} onChange={(value) => update("homePrice", value)} />
        <Field label="Down payment" value={values.downPayment} min={0} max={values.homePrice} prefix="$" error={errors.downPayment} onChange={(value) => update("downPayment", value)} />
        <Field label="Current interest rate" value={values.annualInterestRate} min={0} max={25} step={0.01} suffix="%" error={errors.annualInterestRate} onChange={(value) => update("annualInterestRate", value)} />
        <Field label="Hypothetical comparison rate" value={values.comparisonRate} min={0} max={25} step={0.01} suffix="%" error={errors.comparisonRate} onChange={(value) => update("comparisonRate", value)} />
        <Field label="Annual property tax" value={values.annualPropertyTax} min={0} max={500000} prefix="$" onChange={(value) => update("annualPropertyTax", value)} />
        <Field label="Annual home insurance" value={values.annualHomeInsurance} min={0} max={200000} prefix="$" onChange={(value) => update("annualHomeInsurance", value)} />
        <Field label="Monthly HOA" value={values.monthlyHoa} min={0} max={10000} prefix="$" onChange={(value) => update("monthlyHoa", value)} />
        <Field label="Monthly PMI override" value={values.monthlyPmi} min={0} max={10000} prefix="$" help="Leave at zero to use an illustrative PMI estimate below 20% down." onChange={(value) => update("monthlyPmi", value)} />
        <Field label="Optional extra monthly principal" value={values.extraMonthlyPayment} min={0} max={100000} prefix="$" onChange={(value) => update("extraMonthlyPayment", value)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setValues(comparisonDefaults)} className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50">Reset to defaults</button>
        <button type="button" onClick={() => setValues({ ...comparisonDefaults, homePrice: 400000, downPayment: 40000, annualInterestRate: 6.5, comparisonRate: 5.75 })} className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50">First-time buyer example</button>
        <button type="button" onClick={() => setValues({ ...comparisonDefaults, homePrice: 550000, downPayment: 110000, annualInterestRate: 6.75, comparisonRate: 6 })} className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50">20% down example</button>
      </div>

      {hasErrors ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">Correct the highlighted mortgage inputs to view results.</div> : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Result title="Current-rate total payment" value={current.totalMonthlyPayment} emphasis />
            <Result title="Comparison-rate total payment" value={comparison.totalMonthlyPayment} />
            <Result title="Monthly payment difference" value={monthlyDifference} />
            <Result title="Five-year payment difference" value={fiveYearDifference} />
            <Result title="Full-term payment difference" value={termDifference} />
            <Result title="Estimated monthly PMI" value={effectivePmi} />
            <Result title="Extra principal per year" value={extraAnnual} />
            <div className="rounded-lg border p-4"><p className="text-sm text-gray-600">Down payment</p><p className="text-xl font-bold">{(downPaymentPercent * 100).toFixed(1)}%</p></div>
          </div>
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold">Payment assumptions</h3>
            <p className="mt-2 text-sm text-gray-600">Both scenarios use the same home price, down payment, property tax, insurance, HOA, PMI, and {values.termYears}-year term. Only the interest rate changes. The comparison rate is hypothetical and is not a lender quote.</p>
          </div>
        </>
      )}
    </section>
  );
}

function Field({ label, value, onChange, min, max, step = 1, prefix, suffix, help, error }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; step?: number; prefix?: string; suffix?: string; help?: string; error?: string }) {
  return <label className="space-y-1 text-sm font-medium">{label}<div className="flex items-center rounded border bg-white px-2">{prefix}<input className="w-full p-2 outline-none" type="number" inputMode="decimal" value={value} min={min} max={max} step={step} aria-invalid={Boolean(error)} onChange={(event) => onChange(Number(event.target.value) || 0)} />{suffix}</div>{error ? <span role="alert" className="block text-xs text-red-700">{error}</span> : help ? <span className="block text-xs text-gray-500">{help}</span> : null}</label>;
}
function Result({ title, value, emphasis = false }: { title: string; value: number; emphasis?: boolean }) {
  return <div className={`rounded-lg border p-4 ${emphasis ? "bg-red-50" : ""}`}><p className="text-sm text-gray-600">{title}</p><p className="text-xl font-bold">{formatMortgageCurrency(value)}{title.includes("payment") && !title.includes("difference") ? " / month" : ""}</p></div>;
}
