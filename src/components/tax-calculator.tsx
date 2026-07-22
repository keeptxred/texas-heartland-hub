import { useMemo, useState } from "react";
import { COUNTIES, TAX_RATE_DATASET } from "@/data/counties";

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const rateLabel = (value: number) => `${value.toFixed(4)} per $100`;
const safeMoney = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(value, 100_000_000)) : 0;
const safeRate = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(value, 20)) : 0;

type Exemptions = {
  homestead: boolean;
  over65: boolean;
  disabled: boolean;
  veteran: 0 | 10 | 30 | 50 | 70 | 100;
};

const SENIOR_DISABLED_ISD_EXEMPTION = 10_000;
const HOMESTEAD_CAP = 0.1;

function veteranExemption(value: number, rating: Exemptions["veteran"]) {
  if (rating === 100) return value;
  if (rating >= 70) return 12_000;
  if (rating >= 50) return 10_000;
  if (rating >= 30) return 7_500;
  if (rating >= 10) return 5_000;
  return 0;
}

export function TaxCalculator() {
  const first = COUNTIES[0];
  const firstHasKnownIsd = first.schoolDistricts.some((district) => district.rate > 0);
  const [countySlug, setCountySlug] = useState(first.slug);
  const [isdName, setIsdName] = useState(firstHasKnownIsd ? first.schoolDistricts[0].name : "");
  const [value, setValue] = useState(400_000);
  const [priorValue, setPriorValue] = useState(365_000);
  const [cityRate, setCityRate] = useState(first.cityAvgRate);
  const [countyRate, setCountyRate] = useState(first.countyRate);
  const [schoolRate, setSchoolRate] = useState(first.schoolDistricts[0].rate);
  const [selectedSpecialNames, setSelectedSpecialNames] = useState<string[]>([]);
  const [manualMudRate, setManualMudRate] = useState(0);
  const [manualOtherRate, setManualOtherRate] = useState(first.specialDistrictRate);
  const [pidAnnualAssessment, setPidAnnualAssessment] = useState(0);
  const [exemptions, setExemptions] = useState<Exemptions>({
    homestead: true,
    over65: false,
    disabled: false,
    veteran: 0,
  });

  const county = COUNTIES.find((item) => item.slug === countySlug) ?? first;
  const knownSchoolDistricts = county.schoolDistricts.filter((district) => district.rate > 0);
  const hasKnownSchoolDistricts = knownSchoolDistricts.length > 0;
  const schoolDistrictLabel = isdName.trim() || "School district";

  const selectedSpecials = county.specialDistricts.filter((district) =>
    selectedSpecialNames.includes(district.name),
  );

  const calculation = useMemo(() => {
    const marketValue = safeMoney(value);
    const previous = safeMoney(priorValue);
    const cappedValue =
      exemptions.homestead && previous > 0
        ? Math.min(marketValue, previous * (1 + HOMESTEAD_CAP))
        : marketValue;
    const vetExemption = veteranExemption(cappedValue, exemptions.veteran);
    const generalTaxable = Math.max(0, cappedValue - vetExemption);
    const schoolExemption =
      (exemptions.homestead ? county.homesteadExemption : 0) +
      (exemptions.over65 || exemptions.disabled ? SENIOR_DISABLED_ISD_EXEMPTION : 0) +
      vetExemption;
    const schoolTaxable = Math.max(0, cappedValue - schoolExemption);
    const per100 = (rate: number, taxable: number) => (taxable / 100) * safeRate(rate);

    const specialRate = selectedSpecials.reduce((sum, district) => sum + district.rate, 0);
    const lines = [
      {
        label: county.name,
        rate: countyRate,
        taxable: generalTaxable,
        amount: per100(countyRate, generalTaxable),
        note: "County rate",
      },
      {
        label: "City / municipality",
        rate: cityRate,
        taxable: generalTaxable,
        amount: per100(cityRate, generalTaxable),
        note: cityRate === 0 ? "Enter your city rate if applicable" : "Selected or entered city rate",
      },
      {
        label: schoolDistrictLabel,
        rate: schoolRate,
        taxable: schoolTaxable,
        amount: per100(schoolRate, schoolTaxable),
        note: "School district rate after eligible ISD exemptions",
      },
      ...selectedSpecials.map((district) => ({
        label: district.name,
        rate: district.rate,
        taxable: generalTaxable,
        amount: per100(district.rate, generalTaxable),
        note: district.kind,
      })),
      {
        label: "Manual MUD / water district",
        rate: manualMudRate,
        taxable: generalTaxable,
        amount: per100(manualMudRate, generalTaxable),
        note: "Use the exact rate from your tax statement",
      },
      {
        label: "Other special districts",
        rate: manualOtherRate,
        taxable: generalTaxable,
        amount: per100(manualOtherRate, generalTaxable),
        note: "Hospital, ESD, college, road, or other local district",
      },
    ].filter((line) => line.rate > 0);

    const adValoremTotal = lines.reduce((sum, line) => sum + line.amount, 0);
    const pid = safeMoney(pidAnnualAssessment);
    const annualTotal = adValoremTotal + pid;
    const listedRate =
      safeRate(countyRate) +
      safeRate(cityRate) +
      safeRate(schoolRate) +
      specialRate +
      safeRate(manualMudRate) +
      safeRate(manualOtherRate);

    return {
      marketValue,
      cappedValue,
      generalTaxable,
      schoolTaxable,
      schoolExemption,
      lines,
      adValoremTotal,
      pid,
      annualTotal,
      monthly: annualTotal / 12,
      effectiveRate: marketValue > 0 ? (annualTotal / marketValue) * 100 : 0,
      listedRate,
    };
  }, [
    cityRate,
    county.homesteadExemption,
    county.name,
    countyRate,
    exemptions,
    manualMudRate,
    manualOtherRate,
    pidAnnualAssessment,
    priorValue,
    schoolDistrictLabel,
    schoolRate,
    selectedSpecials,
    value,
  ]);

  function changeCounty(slug: string) {
    const next = COUNTIES.find((item) => item.slug === slug) ?? first;
    const nextKnownDistricts = next.schoolDistricts.filter((district) => district.rate > 0);
    const nextIsd = nextKnownDistricts[0] ?? next.schoolDistricts[0];
    setCountySlug(next.slug);
    setIsdName(nextKnownDistricts.length > 0 ? nextIsd.name : "");
    setCountyRate(next.countyRate);
    setCityRate(next.cityAvgRate);
    setSchoolRate(nextIsd.rate);
    setManualOtherRate(next.specialDistrictRate);
    setSelectedSpecialNames([]);
  }

  function changeIsd(name: string) {
    const next = knownSchoolDistricts.find((item) => item.name === name);
    if (!next) return;
    setIsdName(next.name);
    setSchoolRate(next.rate);
  }

  function reset() {
    setCountySlug(first.slug);
    setIsdName(firstHasKnownIsd ? first.schoolDistricts[0].name : "");
    setValue(400_000);
    setPriorValue(365_000);
    setCountyRate(first.countyRate);
    setCityRate(first.cityAvgRate);
    setSchoolRate(first.schoolDistricts[0].rate);
    setSelectedSpecialNames([]);
    setManualMudRate(0);
    setManualOtherRate(first.specialDistrictRate);
    setPidAnnualAssessment(0);
    setExemptions({ homestead: true, over65: false, disabled: false, veteran: 0 });
  }

  return (
    <section className="border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--color-foreground)]">
      <header className="border-b-2 border-foreground p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              All 254 Texas Counties
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">Texas Property Tax Calculator</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Dataset year {TAX_RATE_DATASET.taxYear} • refreshed {TAX_RATE_DATASET.lastUpdated}
            </p>
          </div>
          <button type="button" onClick={reset} className="border border-border px-3 py-2 text-xs font-bold uppercase tracking-wider">
            Reset
          </button>
        </div>
      </header>

      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-7">
          <fieldset>
            <legend className="mb-4 font-display text-xl">Property and jurisdictions</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="County" id="tax-county">
                <select id="tax-county" value={countySlug} onChange={(event) => changeCounty(event.target.value)} className="tax-input">
                  {COUNTIES.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
              </Field>

              {hasKnownSchoolDistricts ? (
                <Field label="School district" id="tax-isd">
                  <select id="tax-isd" value={isdName} onChange={(event) => changeIsd(event.target.value)} className="tax-input">
                    {knownSchoolDistricts.map((item) => (
                      <option key={item.name} value={item.name}>{item.name} ({item.rate.toFixed(4)})</option>
                    ))}
                  </select>
                </Field>
              ) : (
                <Field label="School district name" id="tax-isd-name">
                  <input
                    id="tax-isd-name"
                    type="text"
                    value={isdName}
                    onChange={(event) => setIsdName(event.target.value)}
                    placeholder="Enter your school district"
                    className="tax-input"
                  />
                </Field>
              )}

              <MoneyField id="tax-value" label="Current appraised value" value={value} onChange={setValue} />
              <MoneyField id="tax-prior" label="Prior-year appraised value" value={priorValue} onChange={setPriorValue} />
            </div>
          </fieldset>

          <fieldset className="border-t border-border pt-6">
            <legend className="mb-4 font-display text-xl">Exemptions</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Check checked={exemptions.homestead} onChange={(checked) => setExemptions((current) => ({ ...current, homestead: checked }))} title="Residence homestead" />
              <Check checked={exemptions.over65} onChange={(checked) => setExemptions((current) => ({ ...current, over65: checked }))} title="Age 65 or older" />
              <Check checked={exemptions.disabled} onChange={(checked) => setExemptions((current) => ({ ...current, disabled: checked }))} title="Disabled homeowner" />
              <Field label="Disabled-veteran rating" id="tax-veteran">
                <select id="tax-veteran" value={exemptions.veteran} onChange={(event) => setExemptions((current) => ({ ...current, veteran: Number(event.target.value) as Exemptions["veteran"] }))} className="tax-input">
                  <option value={0}>Not selected</option><option value={10}>10%–29%</option><option value={30}>30%–49%</option><option value={50}>50%–69%</option><option value={70}>70%–99%</option><option value={100}>100%</option>
                </select>
              </Field>
            </div>
          </fieldset>

          <fieldset className="border-t border-border pt-6">
            <legend className="mb-4 font-display text-xl">Exact tax rates</legend>
            <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
              Statewide rates are prefilled when available. Enter the exact figures from your appraisal-district or tax statement for address-level precision.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <RateField id="county-rate" label="County rate" value={countyRate} onChange={setCountyRate} />
              <RateField id="city-rate" label="City rate" value={cityRate} onChange={setCityRate} />
              <RateField id="school-rate" label="School district tax rate" value={schoolRate} onChange={setSchoolRate} />
              <RateField id="mud-rate" label="MUD / water-district rate" value={manualMudRate} onChange={setManualMudRate} />
              <RateField id="other-rate" label="Other special-district rate" value={manualOtherRate} onChange={setManualOtherRate} />
              <MoneyField id="pid-assessment" label="Annual PID assessment" value={pidAnnualAssessment} onChange={setPidAnnualAssessment} step={100} />
            </div>

            {county.specialDistricts.length > 0 && (
              <Field label="Known special districts (select any that apply)" id="tax-specials">
                <select
                  id="tax-specials"
                  multiple
                  value={selectedSpecialNames}
                  onChange={(event) => setSelectedSpecialNames(Array.from(event.target.selectedOptions, (option) => option.value))}
                  className="tax-input min-h-32"
                >
                  {county.specialDistricts.map((district) => (
                    <option key={district.name} value={district.name}>{district.name} — {district.rate.toFixed(4)}</option>
                  ))}
                </select>
              </Field>
            )}
          </fieldset>
        </div>

        <div>
          <div className="bg-secondary p-6 text-secondary-foreground">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">Estimated annual total</p>
            <div className="mt-2 font-display text-5xl leading-none text-primary tabular-nums">{money(calculation.annualTotal)}</div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 text-sm">
              <Metric label="Monthly equivalent" value={money(calculation.monthly)} />
              <Metric label="Effective burden" value={`${calculation.effectiveRate.toFixed(2)}%`} />
              <Metric label="Listed tax rate" value={`${calculation.listedRate.toFixed(4)}%`} />
              <Metric label="PID assessment" value={money(calculation.pid)} />
            </div>
          </div>

          <div className="mt-5 divide-y divide-border border-y border-border">
            {calculation.lines.map((line) => (
              <div key={line.label} className="py-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{line.label}</p>
                    <p className="text-[10px] text-muted-foreground">{rateLabel(line.rate)} on {money(line.taxable)}</p>
                    <p className="text-[10px] text-muted-foreground">{line.note}</p>
                  </div>
                  <strong className="tabular-nums">{money(line.amount)}</strong>
                </div>
              </div>
            ))}
            {calculation.pid > 0 && (
              <div className="py-4">
                <div className="flex justify-between gap-4">
                  <div><p className="text-sm font-semibold">PID annual assessment</p><p className="text-[10px] text-muted-foreground">Flat assessment, not an ad valorem rate</p></div>
                  <strong className="tabular-nums">{money(calculation.pid)}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Card label="Capped appraised value" value={money(calculation.cappedValue)} />
            <Card label="ISD taxable value" value={money(calculation.schoolTaxable)} />
            <Card label="Other taxable value" value={money(calculation.generalTaxable)} />
            <Card label="ISD exemptions" value={money(calculation.schoolExemption)} />
          </div>
        </div>
      </div>

      <footer className="border-t border-border p-6 text-xs leading-relaxed text-muted-foreground">
        Rates are cached from Texas Comptroller statewide files and may change after publication. MUD, PID, emergency-service, hospital, college, road, and other districts are address-specific. Confirm the exact taxing entities and assessment amounts shown on the property’s local tax statement.
      </footer>

      <style>{`
        .tax-input {
          width: 100%;
          min-height: 44px;
          border: 1px solid var(--color-border);
          background: var(--color-muted);
          padding: .75rem;
          font-size: .875rem;
          font-weight: 500;
          outline: none;
        }
        .tax-input:focus,
        .tax-affix-control:focus-within {
          box-shadow: 0 0 0 2px var(--color-primary);
        }
        .tax-affix-control {
          display: flex;
          min-height: 44px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          background: var(--color-muted);
        }
        .tax-affix {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          padding: 0 .75rem;
          font-size: .75rem;
          font-weight: 700;
          color: var(--color-muted-foreground);
          white-space: nowrap;
        }
        .tax-affix-prefix {
          border-right: 1px solid var(--color-border);
        }
        .tax-affix-suffix {
          border-left: 1px solid var(--color-border);
          text-transform: uppercase;
        }
        .tax-affix-input {
          min-width: 0;
          width: 100%;
          border: 0;
          background: transparent;
          padding: .75rem;
          font-size: .875rem;
          font-weight: 500;
          outline: none;
        }
        .tax-affix-input::-webkit-inner-spin-button,
        .tax-affix-input::-webkit-outer-spin-button {
          margin: 0;
          -webkit-appearance: none;
        }
        .tax-affix-input[type="number"] {
          appearance: textfield;
          -moz-appearance: textfield;
        }
      `}</style>
    </section>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return <div><label htmlFor={id} className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>{children}</div>;
}

function MoneyField({ id, label, value, onChange, step = 5000 }: { id: string; label: string; value: number; onChange: (value: number) => void; step?: number }) {
  return (
    <Field label={label} id={id}>
      <div className="tax-affix-control">
        <span className="tax-affix tax-affix-prefix" aria-hidden="true">$</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={100000000}
          step={step}
          value={value}
          onChange={(event) => onChange(safeMoney(Number(event.target.value)))}
          className="tax-affix-input"
        />
      </div>
    </Field>
  );
}

function RateField({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (value: number) => void }) {
  return (
    <Field label={label} id={id}>
      <div className="tax-affix-control">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={20}
          step={0.0001}
          value={value}
          onChange={(event) => onChange(safeRate(Number(event.target.value)))}
          className="tax-affix-input"
        />
        <span className="tax-affix tax-affix-suffix" aria-hidden="true">per $100</span>
      </div>
    </Field>
  );
}

function Check({ checked, onChange, title }: { checked: boolean; onChange: (checked: boolean) => void; title: string }) {
  return <label className={`flex items-center gap-3 border p-3 ${checked ? "border-primary bg-primary/5" : "border-border bg-muted"}`}><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-primary" /><span className="text-sm font-semibold">{title}</span></label>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[9px] font-bold uppercase tracking-widest text-white/65">{label}</p><p className="mt-1 font-semibold text-white tabular-nums">{value}</p></div>;
}

function Card({ label, value }: { label: string; value: string }) {
  return <div className="border border-border p-3"><p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p><p className="mt-1 font-semibold tabular-nums">{value}</p></div>;
}
