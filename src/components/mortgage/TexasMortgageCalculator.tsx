import { useMemo, useState } from "react";
import { texasMortgageDefaults } from "@/data/mortgage/texasMortgageDefaults";
import { calculateTexasMortgage } from "@/lib/mortgage/texasMortgageEngine";
import { formatMortgageCurrency } from "@/lib/mortgage/texasMortgageHelpers";

export default function TexasMortgageCalculator() {
  const [homePrice, setHomePrice] = useState(texasMortgageDefaults.homePrice);
  const [downPayment, setDownPayment] = useState(texasMortgageDefaults.downPayment);
  const [rate, setRate] = useState(texasMortgageDefaults.annualInterestRate);
  const result = useMemo(() => calculateTexasMortgage({ ...texasMortgageDefaults, homePrice, downPayment, annualInterestRate: rate }), [homePrice, downPayment, rate]);

  return <section className="space-y-4 rounded-xl border p-6">
    <div className="grid gap-4 md:grid-cols-3">
      <label>Home price<input className="w-full rounded border p-2" type="number" value={homePrice} onChange={e => setHomePrice(Number(e.target.value))} /></label>
      <label>Down payment<input className="w-full rounded border p-2" type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} /></label>
      <label>Interest rate<input className="w-full rounded border p-2" type="number" step="0.01" value={rate} onChange={e => setRate(Number(e.target.value))} /></label>
    </div>
    <div className="text-3xl font-bold">{formatMortgageCurrency(result.totalMonthlyPayment)} / month</div>
  </section>;
}
