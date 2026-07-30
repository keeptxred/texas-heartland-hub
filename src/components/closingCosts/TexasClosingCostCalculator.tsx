import { useMemo, useState } from "react";
import { texasClosingCostDefaults } from "@/data/closingCosts/texasClosingCostDefaults";
import { calculateTexasClosingCosts } from "@/lib/closingCosts/texasClosingCostEngine";
import { formatClosingCostCurrency } from "@/lib/closingCosts/texasClosingCostHelpers";

export default function TexasClosingCostCalculator() {
  const [homePrice, setHomePrice] = useState(texasClosingCostDefaults.homePrice);
  const [downPayment, setDownPayment] = useState(texasClosingCostDefaults.downPayment);
  const result = useMemo(() => calculateTexasClosingCosts({ ...texasClosingCostDefaults, homePrice, downPayment }), [homePrice, downPayment]);

  return <section className="space-y-4 rounded-xl border p-6">
    <div className="grid gap-4 md:grid-cols-2">
      <label>Home price<input className="w-full rounded border p-2" type="number" value={homePrice} onChange={e => setHomePrice(Number(e.target.value))} /></label>
      <label>Down payment<input className="w-full rounded border p-2" type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} /></label>
    </div>
    <div><span className="text-sm">Estimated closing costs</span><div className="text-3xl font-bold">{formatClosingCostCurrency(result.netClosingCosts)}</div></div>
    <div><span className="text-sm">Estimated cash to close</span><div className="text-2xl font-semibold">{formatClosingCostCurrency(result.cashToClose)}</div></div>
  </section>;
}
