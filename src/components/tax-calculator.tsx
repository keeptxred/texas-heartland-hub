import { useMemo, useState } from "react";
import { COUNTIES } from "@/data/counties";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function TaxCalculator() {
  const [countySlug, setCountySlug] = useState(COUNTIES[0].slug);
  const [isdName, setIsdName] = useState(COUNTIES[0].schoolDistricts[0].name);
  const [value, setValue] = useState(400000);
  const [homestead, setHomestead] = useState(true);

  const county = COUNTIES.find((c) => c.slug === countySlug)!;
  const isd =
    county.schoolDistricts.find((s) => s.name === isdName) ?? county.schoolDistricts[0];

  const calc = useMemo(() => {
    const taxable = Math.max(0, value);
    const schoolTaxable = homestead ? Math.max(0, value - county.homesteadExemption) : taxable;
    const per100 = (rate: number, base: number) => (base / 100) * rate;
    const countyTax = per100(county.countyRate, taxable);
    const cityTax = per100(county.cityAvgRate, taxable);
    const specialTax = per100(county.specialDistrictRate, taxable);
    const schoolTax = per100(isd.rate, schoolTaxable);
    const total = countyTax + cityTax + specialTax + schoolTax;
    const effective = value > 0 ? (total / value) * 100 : 0;
    return { countyTax, cityTax, specialTax, schoolTax, total, effective };
  }, [county, isd, value, homestead]);

  return (
    <div className="bg-card text-card-foreground border-2 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-9 bg-primary text-primary-foreground grid place-items-center font-display text-lg">★</div>
        <div>
          <h3 className="font-display text-2xl leading-none tracking-tight">Property Tax Calculator</h3>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mt-1">
            By County & School District
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="County">
          <select
            value={countySlug}
            onChange={(e) => {
              const s = e.target.value;
              setCountySlug(s);
              const c = COUNTIES.find((x) => x.slug === s)!;
              setIsdName(c.schoolDistricts[0].name);
            }}
            className="w-full bg-muted border border-border px-3 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {COUNTIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="School District (ISD)">
          <select
            value={isdName}
            onChange={(e) => setIsdName(e.target.value)}
            className="w-full bg-muted border border-border px-3 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {county.schoolDistricts.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.rate.toFixed(4)})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Appraised Home Value">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
            <input
              type="number"
              inputMode="numeric"
              value={value}
              min={0}
              step={5000}
              onChange={(e) => setValue(Number(e.target.value) || 0)}
              className="w-full bg-muted border border-border pl-7 pr-3 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </Field>

        <Field label="Homestead Exemption">
          <label className="flex items-center gap-2 px-3 py-3 border border-border bg-muted cursor-pointer">
            <input
              type="checkbox"
              checked={homestead}
              onChange={(e) => setHomestead(e.target.checked)}
              className="size-4 accent-primary"
            />
            <span className="text-sm font-medium">
              Apply {fmt(county.homesteadExemption)} ISD exemption
            </span>
          </label>
        </Field>
      </div>

      <div className="mt-6 divide-y divide-border border-y border-border">
        <Line label="County General Levy" rate={county.countyRate} amount={calc.countyTax} />
        <Line label="City / Municipal (avg.)" rate={county.cityAvgRate} amount={calc.cityTax} />
        <Line label={`${isd.name} (School)`} rate={isd.rate} amount={calc.schoolTax} highlight />
        <Line label="Special / Hospital Districts" rate={county.specialDistrictRate} amount={calc.specialTax} />
      </div>

      <div className="mt-6 bg-secondary text-secondary-foreground p-5 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
            Estimated Annual Total
          </div>
          <div className="text-[10px] text-white/80 mt-1">
            Effective rate: {calc.effective.toFixed(2)}%
          </div>
        </div>
        <div className="font-display text-4xl md:text-5xl text-primary leading-none">
          {fmt(calc.total)}
        </div>
      </div>

      <p className="mt-4 text-[10px] text-muted-foreground leading-relaxed">
        Estimates based on 2023–2024 published rates from county appraisal districts and the Texas Comptroller.
        Actual bills vary by city, MUD/PID, and exemptions. Not legal or tax advice.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Line({
  label,
  rate,
  amount,
  highlight,
}: {
  label: string;
  rate: number;
  amount: number;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-3 ${highlight ? "bg-primary/5 px-3 -mx-3" : ""}`}>
      <div>
        <div className={`text-sm font-medium ${highlight ? "text-primary font-bold" : ""}`}>{label}</div>
        <div className="text-[10px] text-muted-foreground">{rate.toFixed(4)} per $100</div>
      </div>
      <div className={`font-semibold tabular-nums ${highlight ? "text-primary" : ""}`}>
        {amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
      </div>
    </div>
  );
}