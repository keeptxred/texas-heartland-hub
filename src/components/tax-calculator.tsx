import { useMemo, useState } from "react";
import { COUNTIES } from "@/data/counties";

const fmtCurrency = (value: number, maximumFractionDigits = 0) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  });

const fmtRate = (value: number) => `${value.toFixed(4)} per $100`;

const clampMoney = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(value, 100_000_000)) : 0;

type ExemptionState = {
  homestead: boolean;
  over65: boolean;
  disabled: boolean;
  disabledVeteranPercent: 0 | 10 | 30 | 50 | 70 | 100;
};

type RateState = {
  county: number;
  city: number;
  school: number;
  special: number;
};

type TaxLine = {
  key: keyof RateState;
  label: string;
  rate: number;
  taxableValue: number;
  amount: number;
  description: string;
  highlight?: boolean;
};

const SENIOR_OR_DISABLED_SCHOOL_EXEMPTION = 10_000;
const HOMESTEAD_CAP_RATE = 0.1;

function calculateVeteranExemption(
  appraisedValue: number,
  percent: ExemptionState["disabledVeteranPercent"],
) {
  if (percent === 100) return appraisedValue;
  if (percent >= 70) return 12_000;
  if (percent >= 50) return 10_000;
  if (percent >= 30) return 7_500;
  if (percent >= 10) return 5_000;
  return 0;
}

export function TaxCalculator() {
  const [countySlug, setCountySlug] = useState(COUNTIES[0].slug);
  const [isdName, setIsdName] = useState(COUNTIES[0].schoolDistricts[0].name);
  const [appraisedValue, setAppraisedValue] = useState(400_000);
  const [priorYearValue, setPriorYearValue] = useState(365_000);
  const [exemptions, setExemptions] = useState<ExemptionState>({
    homestead: true,
    over65: false,
    disabled: false,
    disabledVeteranPercent: 0,
  });
  const [useCustomRates, setUseCustomRates] = useState(false);

  const county = COUNTIES.find((item) => item.slug === countySlug) ?? COUNTIES[0];
  const isd =
    county.schoolDistricts.find((district) => district.name === isdName) ??
    county.schoolDistricts[0];

  const defaultRates = useMemo<RateState>(
    () => ({
      county: county.countyRate,
      city: county.cityAvgRate,
      school: isd.rate,
      special: county.specialDistrictRate,
    }),
    [county, isd],
  );

  const [customRates, setCustomRates] = useState<RateState>(defaultRates);

  const activeRates = useCustomRates ? customRates : defaultRates;

  const calculation = useMemo(() => {
    const marketValue = clampMoney(appraisedValue);
    const previousValue = clampMoney(priorYearValue);

    const cappedValue =
      exemptions.homestead && previousValue > 0
        ? Math.min(marketValue, previousValue * (1 + HOMESTEAD_CAP_RATE))
        : marketValue;

    const veteranExemption = calculateVeteranExemption(
      cappedValue,
      exemptions.disabledVeteranPercent,
    );

    const generalTaxableValue = Math.max(0, cappedValue - veteranExemption);

    const schoolExemption =
      (exemptions.homestead ? county.homesteadExemption : 0) +
      (exemptions.over65 || exemptions.disabled
        ? SENIOR_OR_DISABLED_SCHOOL_EXEMPTION
        : 0) +
      veteranExemption;

    const schoolTaxableValue = Math.max(0, cappedValue - schoolExemption);
    const perHundred = (rate: number, taxableValue: number) =>
      (taxableValue / 100) * Math.max(0, rate);

    const lines: TaxLine[] = [
      {
        key: "county",
        label: "County General Levy",
        rate: activeRates.county,
        taxableValue: generalTaxableValue,
        amount: perHundred(activeRates.county, generalTaxableValue),
        description: `${county.name} countywide estimate`,
      },
      {
        key: "city",
        label: "City / Municipal",
        rate: activeRates.city,
        taxableValue: generalTaxableValue,
        amount: perHundred(activeRates.city, generalTaxableValue),
        description: "County-area average; replace with your city rate for precision",
      },
      {
        key: "school",
        label: `${isd.name} School Tax`,
        rate: activeRates.school,
        taxableValue: schoolTaxableValue,
        amount: perHundred(activeRates.school, schoolTaxableValue),
        description: "Calculated after eligible school exemptions",
        highlight: true,
      },
      {
        key: "special",
        label: "Special / Hospital Districts",
        rate: activeRates.special,
        taxableValue: generalTaxableValue,
        amount: perHundred(activeRates.special, generalTaxableValue),
        description: "Illustrative local district average; MUD/PID rates vary",
      },
    ];

    const annualTotal = lines.reduce((sum, line) => sum + line.amount, 0);
    const monthlyTotal = annualTotal / 12;
    const effectiveRate = marketValue > 0 ? (annualTotal / marketValue) * 100 : 0;
    const combinedNominalRate = Object.values(activeRates).reduce(
      (sum, rate) => sum + Math.max(0, rate),
      0,
    );

    const noExemptionTotal =
      Object.entries(activeRates).reduce(
        (sum, [, rate]) => sum + perHundred(rate, marketValue),
        0,
      ) || 0;

    return {
      marketValue,
      cappedValue,
      capSavingsValue: Math.max(0, marketValue - cappedValue),
      generalTaxableValue,
      schoolTaxableValue,
      veteranExemption,
      schoolExemption,
      lines,
      annualTotal,
      monthlyTotal,
      effectiveRate,
      combinedNominalRate,
      estimatedExemptionSavings: Math.max(0, noExemptionTotal - annualTotal),
    };
  }, [
    activeRates,
    appraisedValue,
    county,
    exemptions,
    isd.name,
    priorYearValue,
  ]);

  const updateCounty = (slug: string) => {
    const nextCounty = COUNTIES.find((item) => item.slug === slug) ?? COUNTIES[0];
    const nextIsd = nextCounty.schoolDistricts[0];

    setCountySlug(nextCounty.slug);
    setIsdName(nextIsd.name);
    setCustomRates({
      county: nextCounty.countyRate,
      city: nextCounty.cityAvgRate,
      school: nextIsd.rate,
      special: nextCounty.specialDistrictRate,
    });
  };

  const updateIsd = (name: string) => {
    const nextIsd =
      county.schoolDistricts.find((district) => district.name === name) ??
      county.schoolDistricts[0];

    setIsdName(nextIsd.name);
    setCustomRates((current) => ({ ...current, school: nextIsd.rate }));
  };

  const updateExemption = <K extends keyof ExemptionState>(
    key: K,
    value: ExemptionState[K],
  ) => {
    setExemptions((current) => ({ ...current, [key]: value }));
  };

  const updateCustomRate = (key: keyof RateState, value: number) => {
    setCustomRates((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? Math.max(0, Math.min(value, 10)) : 0,
    }));
  };

  const resetCalculator = () => {
    const firstCounty = COUNTIES[0];
    const firstIsd = firstCounty.schoolDistricts[0];

    setCountySlug(firstCounty.slug);
    setIsdName(firstIsd.name);
    setAppraisedValue(400_000);
    setPriorYearValue(365_000);
    setExemptions({
      homestead: true,
      over65: false,
      disabled: false,
      disabledVeteranPercent: 0,
    });
    setUseCustomRates(false);
    setCustomRates({
      county: firstCounty.countyRate,
      city: firstCounty.cityAvgRate,
      school: firstIsd.rate,
      special: firstCounty.specialDistrictRate,
    });
  };

  return (
    <section
      aria-labelledby="property-tax-calculator-title"
      className="bg-card text-card-foreground border-2 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)]"
    >
      <div className="border-b-2 border-foreground p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="size-10 bg-primary text-primary-foreground grid place-items-center font-display text-xl"
            >
              ★
            </div>
            <div>
              <h2
                id="property-tax-calculator-title"
                className="font-display text-2xl md:text-3xl leading-none tracking-tight"
              >
                Texas Property Tax Calculator
              </h2>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mt-1.5">
                County, City, School & Special District Estimate
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetCalculator}
            className="self-start border border-border px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
          >
            Reset Calculator
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="space-y-7">
            <fieldset>
              <legend className="font-display text-xl tracking-tight mb-4">
                Property Location & Value
              </legend>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="County" htmlFor="tax-county">
                  <select
                    id="tax-county"
                    value={countySlug}
                    onChange={(event) => updateCounty(event.target.value)}
                    className="input-control"
                  >
                    {COUNTIES.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name} — {item.region}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="School District (ISD)" htmlFor="tax-isd">
                  <select
                    id="tax-isd"
                    value={isdName}
                    onChange={(event) => updateIsd(event.target.value)}
                    className="input-control"
                  >
                    {county.schoolDistricts.map((district) => (
                      <option key={district.name} value={district.name}>
                        {district.name} ({district.rate.toFixed(4)})
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Current Appraised Value" htmlFor="tax-value">
                  <MoneyInput
                    id="tax-value"
                    value={appraisedValue}
                    onChange={setAppraisedValue}
                  />
                </Field>

                <Field label="Prior-Year Appraised Value" htmlFor="tax-prior-value">
                  <MoneyInput
                    id="tax-prior-value"
                    value={priorYearValue}
                    onChange={setPriorYearValue}
                  />
                </Field>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Prior-year value is used to illustrate the Texas 10% homestead appraisal
                cap. The cap limits growth in taxable appraised value, not the tax bill or
                market value.
              </p>
            </fieldset>

            <fieldset className="border-t border-border pt-6">
              <legend className="font-display text-xl tracking-tight mb-4">
                Exemptions
              </legend>

              <div className="grid sm:grid-cols-2 gap-3">
                <CheckCard
                  checked={exemptions.homestead}
                  onChange={(checked) => updateExemption("homestead", checked)}
                  title="Residence Homestead"
                  description={`${fmtCurrency(county.homesteadExemption)} school exemption plus appraisal-cap estimate`}
                />
                <CheckCard
                  checked={exemptions.over65}
                  onChange={(checked) => updateExemption("over65", checked)}
                  title="Age 65 or Older"
                  description={`Adds an illustrative ${fmtCurrency(SENIOR_OR_DISABLED_SCHOOL_EXEMPTION)} school exemption`}
                />
                <CheckCard
                  checked={exemptions.disabled}
                  onChange={(checked) => updateExemption("disabled", checked)}
                  title="Disabled Homeowner"
                  description={`Adds an illustrative ${fmtCurrency(SENIOR_OR_DISABLED_SCHOOL_EXEMPTION)} school exemption`}
                />

                <Field label="Disabled Veteran Rating" htmlFor="veteran-rating">
                  <select
                    id="veteran-rating"
                    value={exemptions.disabledVeteranPercent}
                    onChange={(event) =>
                      updateExemption(
                        "disabledVeteranPercent",
                        Number(event.target.value) as ExemptionState["disabledVeteranPercent"],
                      )
                    }
                    className="input-control"
                  >
                    <option value={0}>Not selected</option>
                    <option value={10}>10%–29%</option>
                    <option value={30}>30%–49%</option>
                    <option value={50}>50%–69%</option>
                    <option value={70}>70%–99%</option>
                    <option value={100}>100% disabled</option>
                  </select>
                </Field>
              </div>
            </fieldset>

            <fieldset className="border-t border-border pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <legend className="font-display text-xl tracking-tight">
                  Tax Rates
                </legend>
                <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomRates}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      if (checked) setCustomRates(defaultRates);
                      setUseCustomRates(checked);
                    }}
                    className="size-4 accent-primary"
                  />
                  Enter exact local rates
                </label>
              </div>

              {useCustomRates ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <RateInput
                    id="county-rate"
                    label="County Rate"
                    value={customRates.county}
                    onChange={(value) => updateCustomRate("county", value)}
                  />
                  <RateInput
                    id="city-rate"
                    label="City Rate"
                    value={customRates.city}
                    onChange={(value) => updateCustomRate("city", value)}
                  />
                  <RateInput
                    id="school-rate"
                    label="School Rate"
                    value={customRates.school}
                    onChange={(value) => updateCustomRate("school", value)}
                  />
                  <RateInput
                    id="special-rate"
                    label="Special District Rate"
                    value={customRates.special}
                    onChange={(value) => updateCustomRate("special", value)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <RateSummary label="County" rate={defaultRates.county} />
                  <RateSummary label="City average" rate={defaultRates.city} />
                  <RateSummary label="School" rate={defaultRates.school} />
                  <RateSummary label="Special districts" rate={defaultRates.special} />
                </div>
              )}
            </fieldset>
          </div>

          <div>
            <div className="bg-secondary text-secondary-foreground p-5 md:p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Estimated Annual Property Tax
              </div>
              <div className="font-display text-5xl md:text-6xl text-primary leading-none mt-2 tabular-nums">
                {fmtCurrency(calculation.annualTotal)}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/15 pt-5">
                <ResultMetric
                  label="Monthly Equivalent"
                  value={fmtCurrency(calculation.monthlyTotal)}
                />
                <ResultMetric
                  label="Effective Tax Rate"
                  value={`${calculation.effectiveRate.toFixed(2)}%`}
                />
                <ResultMetric
                  label="Combined Listed Rate"
                  value={`${calculation.combinedNominalRate.toFixed(4)}%`}
                />
                <ResultMetric
                  label="Estimated Exemption Savings"
                  value={fmtCurrency(calculation.estimatedExemptionSavings)}
                />
              </div>
            </div>

            <div className="mt-5 divide-y divide-border border-y border-border">
              {calculation.lines.map((line) => (
                <TaxBreakdownLine key={line.key} line={line} />
              ))}
            </div>

            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              <ValueCard
                label="Capped Appraised Value"
                value={fmtCurrency(calculation.cappedValue)}
                note={
                  calculation.capSavingsValue > 0
                    ? `${fmtCurrency(calculation.capSavingsValue)} below current value`
                    : "No appraisal-cap reduction shown"
                }
              />
              <ValueCard
                label="School Taxable Value"
                value={fmtCurrency(calculation.schoolTaxableValue)}
                note={`${fmtCurrency(calculation.schoolExemption)} total school exemptions`}
              />
              <ValueCard
                label="Other Taxable Value"
                value={fmtCurrency(calculation.generalTaxableValue)}
                note={
                  calculation.veteranExemption > 0
                    ? `${fmtCurrency(calculation.veteranExemption)} veteran exemption`
                    : "Before local optional exemptions"
                }
              />
              <ValueCard
                label="Selected Jurisdiction"
                value={county.name}
                note={`${isd.name} • ${county.region}`}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground leading-relaxed">
          <p>
            This calculator provides an educational estimate using the rate data stored
            by Keep Texas Red. City, MUD, PID, hospital, college, emergency-service, and
            other local taxing-unit rates can differ substantially by address.
          </p>
          <p className="mt-2">
            Exemption eligibility, appraisal caps, tax ceilings, prorations, and disabled
            veteran rules can change the final bill. Confirm your taxable value and exact
            taxing entities with your county appraisal district and tax assessor-collector.
            This is not legal, financial, or tax advice.
          </p>
        </div>
      </div>

      <style>{`
        .input-control {
          width: 100%;
          border: 1px solid var(--color-border);
          background: var(--color-muted);
          padding: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
        }

        .input-control:focus {
          box-shadow: 0 0 0 2px var(--color-primary);
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function MoneyInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold"
      >
        $
      </span>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={value}
        min={0}
        max={100_000_000}
        step={5_000}
        onChange={(event) => onChange(clampMoney(Number(event.target.value)))}
        className="input-control pl-7"
      />
    </div>
  );
}

function CheckCard({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label
      className={`flex gap-3 border p-3 cursor-pointer transition-colors ${
        checked ? "border-primary bg-primary/5" : "border-border bg-muted"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 accent-primary shrink-0"
      />
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-[11px] leading-relaxed text-muted-foreground mt-0.5">
          {description}
        </span>
      </span>
    </label>
  );
}

function RateInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={10}
          step={0.0001}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="input-control pr-20"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          per $100
        </span>
      </div>
    </Field>
  );
}

function RateSummary({ label, rate }: { label: string; rate: number }) {
  return (
    <div className="border border-border bg-muted p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="font-semibold tabular-nums mt-1">{fmtRate(rate)}</div>
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] font-semibold uppercase tracking-widest text-white/70">
        {label}
      </div>
      <div className="font-semibold text-white tabular-nums mt-1">{value}</div>
    </div>
  );
}

function TaxBreakdownLine({ line }: { line: TaxLine }) {
  return (
    <div
      className={`py-4 ${
        line.highlight ? "bg-primary/5 px-3 -mx-3 border-primary/20" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className={`text-sm font-semibold ${
              line.highlight ? "text-primary" : ""
            }`}
          >
            {line.label}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {fmtRate(line.rate)} on {fmtCurrency(line.taxableValue)}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {line.description}
          </div>
        </div>
        <div
          className={`font-semibold tabular-nums shrink-0 ${
            line.highlight ? "text-primary" : ""
          }`}
        >
          {fmtCurrency(line.amount)}
        </div>
      </div>
    </div>
  );
}

function ValueCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="border border-border p-3">
      <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="font-semibold mt-1">{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
        {note}
      </div>
    </div>
  );
}
