import { useMemo, useState } from "react";
import { texasMortgageDefaults } from "@/data/mortgage/texasMortgageDefaults";
import { calculateTexasMortgage } from "@/lib/mortgage/texasMortgageEngine";
import { formatMortgageCurrency } from "@/lib/mortgage/texasMortgageHelpers";

export default function TexasMortgageCalculator() {
  const [homePrice, setHomePrice] = useState(texasMortgageDefaults.homePrice);
  const [downPayment, setDownPayment] = useState(texasMortgageDefaults.downPayment);
  const [rate, setRate] = useState(texasMortgageDefaults.annualInterestRate);
  const [comparisonRate, setComparisonRate] = useState(5.75);

  const current = useMemo(
    () =>
      calculateTexasMortgage({
        ...texasMortgageDefaults,
        homePrice,
        downPayment,
        annualInterestRate: rate,
      }),
    [homePrice, downPayment, rate],
  );

  const comparison = useMemo(
    () =>
      calculateTexasMortgage({
        ...texasMortgageDefaults,
        homePrice,
        downPayment,
        annualInterestRate: comparisonRate,
      }),
    [homePrice, downPayment, comparisonRate],
  );

  const monthlyDifference = current.principalAndInterest - comparison.principalAndInterest;
  const termMonths = texasMortgageDefaults.termYears * 12;

  return (
    <section className="space-y-6 rounded-xl border p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label>
          Home price
          <input className="w-full rounded border p-2" type="number" value={homePrice} onChange={(event) => setHomePrice(Number(event.target.value))} />
        </label>
        <label>
          Down payment
          <input className="w-full rounded border p-2" type="number" value={downPayment} onChange={(event) => setDownPayment(Number(event.target.value))} />
        </label>
        <label>
          Current interest rate
          <input className="w-full rounded border p-2" type="number" step="0.01" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
        </label>
        <label>
          Comparison interest rate
          <input className="w-full rounded border p-2" type="number" step="0.01" value={comparisonRate} onChange={(event) => setComparisonRate(Number(event.target.value))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">Estimated payment at {rate}%</p>
          <p className="text-3xl font-bold">{formatMortgageCurrency(current.totalMonthlyPayment)} / month</p>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">Estimated payment at {comparisonRate}%</p>
          <p className="text-3xl font-bold">{formatMortgageCurrency(comparison.totalMonthlyPayment)} / month</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Principal-and-interest difference</p>
          <p className="text-xl font-semibold">{formatMortgageCurrency(Math.abs(monthlyDifference))} / month</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Difference across the loan term</p>
          <p className="text-xl font-semibold">{formatMortgageCurrency(Math.abs(monthlyDifference) * termMonths)}</p>
        </div>
      </div>
    </section>
  );
}
