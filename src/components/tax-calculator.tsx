import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTIES, TAX_RATE_DATASET } from "@/data/counties";
import {
  buildShareableCalculationUrl,
  lookupTexasProperty,
  PropertyLookupError,
  type PropertyLookupResult,
} from "@/lib/property-address-lookup";

type Exemptions = {
  homestead: boolean;
  over65: boolean;
  disabled: boolean;
  veteran: 0 | 10 | 30 | 50 | 70 | 100;
};

type StartMode = "choice" | "address" | "manual";
type LookupStatus = "idle" | "loading" | "error";

const SENIOR_DISABLED_ISD_EXEMPTION = 60_000;
const HOMESTEAD_CAP = 0.1;

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const rateLabel = (value: number) => `${value.toFixed(4)} per $100`;
const safeMoney = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(value, 100_000_000)) : 0;
const safeRate = (value: number) => (Number.isFinite(value) ? Math.max(0, Math.min(value, 20)) : 0);

function veteranExemption(value: number, rating: Exemptions["veteran"]) {
  if (rating === 100) return value;
  if (rating >= 70) return 12_000;
  if (rating >= 50) return 10_000;
  if (rating >= 30) return 7_500;
  if (rating >= 10) return 5_000;
  return 0;
}

function selectZeroOnFocus(event: React.FocusEvent<HTMLInputElement>) {
  if (Number(event.currentTarget.value) === 0) event.currentTarget.select();
}

export function TaxCalculator() {
  const first = COUNTIES[0];
  const firstKnownDistricts = first.schoolDistricts.filter((district) => district.rate > 0);
  const lookupController = useRef<AbortController | null>(null);
  const [startMode, setStartMode] = useState<StartMode>("choice");
  const [streetAddress, setStreetAddress] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("TX");
  const [addressZip, setAddressZip] = useState("");
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>("idle");
  const [lookupError, setLookupError] = useState("");
  const [lookupResult, setLookupResult] = useState<PropertyLookupResult | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const [countySlug, setCountySlug] = useState(first.slug);
  const [isdName, setIsdName] = useState(firstKnownDistricts[0]?.name ?? "");
  const [value, setValue] = useState(400_000);
  const [priorValue, setPriorValue] = useState(365_000);
  const [cityRate, setCityRate] = useState(first.cityAvgRate);
  const [countyRate, setCountyRate] = useState(first.countyRate);
  const [schoolRate, setSchoolRate] = useState(firstKnownDistricts[0]?.rate ?? 0);
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
  const schoolDistrictLabel = isdName || "School district";
  const selectedSpecials = county.specialDistricts.filter((district) =>
    selectedSpecialNames.includes(district.name),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sharedCounty = params.get("county");
    if (!sharedCounty) return;
    const sharedCountyData = COUNTIES.find((item) => item.slug === sharedCounty);
    if (!sharedCountyData) return;

    const parsedRate = (key: string, fallback: number) => {
      const parsed = Number(params.get(key));
      return Number.isFinite(parsed) ? safeRate(parsed) : fallback;
    };
    const parsedMoney = (key: string, fallback: number) => {
      const parsed = Number(params.get(key));
      return Number.isFinite(parsed) ? safeMoney(parsed) : fallback;
    };

    setCountySlug(sharedCountyData.slug);
    setIsdName(
      params.get("isd") ??
        sharedCountyData.schoolDistricts.find((item) => item.rate > 0)?.name ??
        "",
    );
    setCountyRate(parsedRate("countyRate", sharedCountyData.countyRate));
    setCityRate(parsedRate("cityRate", sharedCountyData.cityAvgRate));
    setSchoolRate(parsedRate("schoolRate", 0));
    setValue(parsedMoney("value", 400_000));
    setPriorValue(parsedMoney("prior", 365_000));
    setManualOtherRate(sharedCountyData.specialDistrictRate);
    setStartMode("manual");
  }, []);

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
        note:
          cityRate === 0 ? "Enter your city rate if applicable" : "Selected or entered city rate",
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

    const pid = safeMoney(pidAnnualAssessment);
    const annualTotal = lines.reduce((sum, line) => sum + line.amount, 0) + pid;
    const listedRate =
      safeRate(countyRate) +
      safeRate(cityRate) +
      safeRate(schoolRate) +
      specialRate +
      safeRate(manualMudRate) +
      safeRate(manualOtherRate);
    const grossAnnualTotal = (marketValue / 100) * listedRate + pid;

    return {
      cappedValue,
      generalTaxable,
      schoolTaxable,
      schoolExemption,
      lines,
      pid,
      annualTotal,
      estimatedRelief: Math.max(0, grossAnnualTotal - annualTotal),
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
    const nextIsd = next.schoolDistricts.find((district) => district.rate > 0);
    setCountySlug(next.slug);
    setIsdName(nextIsd?.name ?? "");
    setCountyRate(next.countyRate);
    setCityRate(next.cityAvgRate);
    setSchoolRate(nextIsd?.rate ?? 0);
    setManualOtherRate(next.specialDistrictRate);
    setSelectedSpecialNames([]);
    setLookupResult(null);
  }

  function changeIsd(name: string) {
    const next = knownSchoolDistricts.find((item) => item.name === name);
    if (!next) return;
    setIsdName(next.name);
    setSchoolRate(next.rate);
  }

  function applyLookupResult(result: PropertyLookupResult) {
    const matchedCounty = COUNTIES.find((item) => item.slug === result.countySlug) ?? first;
    setCountySlug(result.countySlug);
    setIsdName(result.schoolDistrictName);
    setCountyRate(result.countyRate);
    setCityRate(result.cityRate);
    setSchoolRate(result.schoolRate);
    setManualOtherRate(matchedCounty.specialDistrictRate);
    setSelectedSpecialNames([]);
    setLookupResult(result);
    setStartMode("manual");
  }

  async function findProperty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    lookupController.current?.abort();
    const controller = new AbortController();
    lookupController.current = controller;
    setLookupStatus("loading");
    setLookupError("");

    const completeAddress = [streetAddress, addressCity, addressState, addressZip]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(", ");

    try {
      const result = await lookupTexasProperty(completeAddress, controller.signal);
      applyLookupResult(result);
      setLookupStatus("idle");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setLookupStatus("error");
      setLookupError(
        error instanceof PropertyLookupError
          ? error.message
          : "We could not complete the lookup. Continue manually or try again.",
      );
    }
  }

  async function copyShareLink() {
    const shareUrl = buildShareableCalculationUrl({
      countySlug,
      schoolDistrictName: isdName,
      countyRate,
      cityRate,
      schoolRate,
      currentValue: value,
      priorValue,
    });

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Link copied. Your street address was not included.");
    } catch {
      setShareMessage(
        "Copy was blocked by the browser. Use the current page URL after opening the shared link.",
      );
    }
  }

  function reset() {
    setCountySlug(first.slug);
    setIsdName(firstKnownDistricts[0]?.name ?? "");
    setValue(400_000);
    setPriorValue(365_000);
    setCountyRate(first.countyRate);
    setCityRate(first.cityAvgRate);
    setSchoolRate(firstKnownDistricts[0]?.rate ?? 0);
    setSelectedSpecialNames([]);
    setManualMudRate(0);
    setManualOtherRate(first.specialDistrictRate);
    setPidAnnualAssessment(0);
    setLookupResult(null);
    setShareMessage("");
    setExemptions({ homestead: true, over65: false, disabled: false, veteran: 0 });
  }

  if (startMode === "choice") {
    return (
      <section className="border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--color-foreground)]">
        <header className="border-b-2 border-foreground p-6 text-center md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            All 254 Texas Counties
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">
            Texas Property Tax Calculator
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Choose the easiest way to begin. An address will never be required.
          </p>
        </header>
        <div className="grid gap-5 p-6 md:grid-cols-2 md:p-8">
          <button
            type="button"
            onClick={() => setStartMode("address")}
            className="group flex min-h-56 flex-col border-2 border-primary bg-primary/5 p-6 text-left transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="w-fit bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
              Recommended
            </span>
            <span className="mt-5 font-display text-2xl">Find rates by address</span>
            <span className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Enter a Texas property address and we’ll identify available local taxing information.
            </span>
            <span className="mt-auto pt-5 text-xs font-bold uppercase tracking-widest text-primary">
              Use my address →
            </span>
          </button>
          <button
            type="button"
            onClick={() => setStartMode("manual")}
            className="group flex min-h-56 flex-col border-2 border-foreground bg-card p-6 text-left transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="font-display text-2xl">Enter details manually</span>
            <span className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Skip the address and use the county, district, and tax-rate fields directly.
            </span>
            <span className="mt-auto pt-5 text-xs font-bold uppercase tracking-widest">
              Continue manually →
            </span>
          </button>
        </div>
        <footer className="border-t border-border p-4 text-center text-xs text-muted-foreground">
          No account required. Address lookup is optional.
        </footer>
      </section>
    );
  }

  if (startMode === "address") {
    return (
      <section className="border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--color-foreground)]">
        <header className="border-b-2 border-foreground p-6 md:p-8">
          <button
            type="button"
            onClick={() => setStartMode("choice")}
            className="text-xs font-bold uppercase tracking-widest text-primary"
          >
            ← Back
          </button>
          <h2 className="mt-5 font-display text-3xl">Find rates by address</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We’ll use trusted public geographic data to automatically identify your Texas county,
            city, and school district.
          </p>
        </header>
        <form onSubmit={findProperty} className="p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Street address" id="tax-address">
                <input
                  id="tax-address"
                  type="text"
                  value={streetAddress}
                  onChange={(event) => setStreetAddress(event.target.value)}
                  placeholder="123 Main St"
                  autoComplete="street-address"
                  className="tax-input"
                  required
                />
              </Field>
            </div>
            <Field label="City" id="tax-address-city">
              <input
                id="tax-address-city"
                type="text"
                value={addressCity}
                onChange={(event) => setAddressCity(event.target.value)}
                placeholder="Katy"
                autoComplete="address-level2"
                className="tax-input"
                required
              />
            </Field>
            <div className="grid grid-cols-[.65fr_1fr] gap-4">
              <Field label="State" id="tax-address-state">
                <input
                  id="tax-address-state"
                  type="text"
                  value={addressState}
                  onChange={(event) =>
                    setAddressState(event.target.value.toUpperCase().slice(0, 2))
                  }
                  autoComplete="address-level1"
                  className="tax-input"
                  required
                />
              </Field>
              <Field label="ZIP" id="tax-address-zip">
                <input
                  id="tax-address-zip"
                  type="text"
                  inputMode="numeric"
                  value={addressZip}
                  onChange={(event) =>
                    setAddressZip(event.target.value.replace(/[^0-9-]/g, "").slice(0, 10))
                  }
                  placeholder="77493"
                  autoComplete="postal-code"
                  className="tax-input"
                  required
                />
              </Field>
            </div>
          </div>

          {lookupStatus === "loading" && (
            <div
              className="mt-5 border border-primary bg-primary/5 p-5"
              role="status"
              aria-live="polite"
            >
              <p className="font-display text-xl">Finding property…</p>
              <div className="mt-4 grid gap-2 text-sm">
                <p>◌ Verifying address</p>
                <p>◌ Finding county and city</p>
                <p>◌ Finding school district</p>
                <p>◌ Matching available tax rates</p>
              </div>
            </div>
          )}

          {lookupStatus === "error" && (
            <div className="mt-5 border border-destructive bg-destructive/5 p-5" role="alert">
              <p className="font-semibold">We couldn’t verify this address.</p>
              <p className="mt-2 text-sm text-muted-foreground">{lookupError}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Check the spelling, include the ZIP code, or continue manually.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={lookupStatus === "loading"}
            className="mt-5 w-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-wait disabled:opacity-60"
          >
            {lookupStatus === "loading" ? "Finding property…" : "Find my property"}
          </button>
          <button
            type="button"
            onClick={() => setStartMode("manual")}
            className="mt-4 w-full border border-border px-5 py-3 text-sm font-bold uppercase tracking-widest"
          >
            Continue manually
          </button>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Your address is used only to identify the correct local tax jurisdictions. It is never
            stored by this calculator and is never included in shared links.
          </p>
        </form>
      </section>
    );
  }

  return (
    <section className="border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--color-foreground)]">
      <header className="border-b-2 border-foreground p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => setStartMode("choice")}
              className="mb-4 text-xs font-bold uppercase tracking-widest text-primary"
            >
              ← Change start method
            </button>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              All 254 Texas Counties
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">
              Texas Property Tax Calculator
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Dataset year {TAX_RATE_DATASET.taxYear} • refreshed {TAX_RATE_DATASET.lastUpdated}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="border border-border px-3 py-2 text-xs font-bold uppercase tracking-wider"
          >
            Reset
          </button>
        </div>
      </header>

      {lookupResult && (
        <div className="border-b-2 border-foreground bg-muted p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Property information
              </p>
              <p className="mt-2 font-display text-2xl">{lookupResult.matchedAddress}</p>
              <div className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                <p>
                  <strong>County:</strong> {lookupResult.countyName}
                </p>
                <p>
                  <strong>School district:</strong>{" "}
                  {lookupResult.schoolDistrictName || "Not identified"}
                </p>
                <p>
                  <strong>City:</strong>{" "}
                  {lookupResult.cityName || "Unincorporated / not identified"}
                </p>
              </div>
            </div>
            <span
              className={`border px-3 py-2 text-xs font-bold uppercase tracking-widest ${lookupResult.confidence === "high" ? "border-green-700 bg-green-50 text-green-800" : "border-amber-700 bg-amber-50 text-amber-900"}`}
            >
              {lookupResult.confidence === "high" ? "● High confidence" : "● Medium confidence"}
            </span>
          </div>

          {lookupResult.missingFields.length > 0 && (
            <div className="mt-5 border-l-4 border-amber-600 bg-card p-4 text-sm">
              <p className="font-semibold">
                Complete the highlighted rate fields for a better estimate.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                {lookupResult.missingFields.includes("cityRate") && (
                  <li>Enter the city tax rate if the property is inside city limits.</li>
                )}
                {lookupResult.missingFields.includes("schoolRate") && (
                  <li>Enter the school district tax rate from the property tax statement.</li>
                )}
              </ul>
            </div>
          )}

          <div className="mt-5 border-l-4 border-primary bg-card p-4 text-sm">
            <p className="font-semibold">Additional address-specific districts may still apply.</p>
            <p className="mt-1 text-muted-foreground">
              Compare this estimate with the property’s tax statement for MUD, PID,
              emergency-services, hospital, college, road, and other special districts.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-7">
          <fieldset>
            <legend className="mb-4 font-display text-xl">Property and jurisdictions</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="County" id="tax-county">
                <select
                  id="tax-county"
                  value={countySlug}
                  onChange={(event) => changeCounty(event.target.value)}
                  className="tax-input"
                >
                  {COUNTIES.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              {hasKnownSchoolDistricts ? (
                <Field label="School district" id="tax-isd">
                  <select
                    id="tax-isd"
                    value={isdName}
                    onChange={(event) => changeIsd(event.target.value)}
                    className="tax-input"
                  >
                    {!knownSchoolDistricts.some((item) => item.name === isdName) && isdName && (
                      <option value={isdName}>{isdName} — enter rate below</option>
                    )}
                    {knownSchoolDistricts.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name} ({item.rate.toFixed(4)})
                      </option>
                    ))}
                  </select>
                </Field>
              ) : (
                <div className="tax-notice">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    School district
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    District data is not yet available for this county. Enter the school district
                    tax rate below from your tax statement.
                  </p>
                </div>
              )}
              <MoneyField
                id="tax-value"
                label="Current appraised value"
                value={value}
                onChange={setValue}
              />
              <MoneyField
                id="tax-prior"
                label="Prior-year appraised value"
                value={priorValue}
                onChange={setPriorValue}
              />
            </div>
          </fieldset>

          <fieldset className="border-t border-border pt-6">
            <legend className="mb-4 font-display text-xl">Exemptions</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Check
                checked={exemptions.homestead}
                onChange={(checked) =>
                  setExemptions((current) => ({ ...current, homestead: checked }))
                }
                title="Residence homestead"
              />
              <Check
                checked={exemptions.over65}
                onChange={(checked) =>
                  setExemptions((current) => ({ ...current, over65: checked }))
                }
                title="Age 65 or older"
              />
              <Check
                checked={exemptions.disabled}
                onChange={(checked) =>
                  setExemptions((current) => ({ ...current, disabled: checked }))
                }
                title="Disabled homeowner"
              />
              <Field label="Disabled-veteran rating" id="tax-veteran">
                <select
                  id="tax-veteran"
                  value={exemptions.veteran}
                  onChange={(event) =>
                    setExemptions((current) => ({
                      ...current,
                      veteran: Number(event.target.value) as Exemptions["veteran"],
                    }))
                  }
                  className="tax-input"
                >
                  <option value={0}>Not selected</option>
                  <option value={10}>10%–29%</option>
                  <option value={30}>30%–49%</option>
                  <option value={50}>50%–69%</option>
                  <option value={70}>70%–99%</option>
                  <option value={100}>100%</option>
                </select>
              </Field>
            </div>
          </fieldset>

          <fieldset className="border-t border-border pt-6">
            <legend className="mb-4 font-display text-xl">Exact tax rates</legend>
            <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
              Statewide rates are prefilled when available. Enter the exact figures from your
              appraisal-district or tax statement for address-level precision.
            </p>
            <div className="grid items-end gap-4 sm:grid-cols-2">
              <RateField
                id="county-rate"
                label="County rate"
                value={countyRate}
                onChange={setCountyRate}
              />
              <RateField
                id="city-rate"
                label="City rate"
                value={cityRate}
                onChange={setCityRate}
                attention={lookupResult?.missingFields.includes("cityRate")}
              />
              <RateField
                id="school-rate"
                label="School district tax rate"
                value={schoolRate}
                onChange={setSchoolRate}
                attention={lookupResult?.missingFields.includes("schoolRate")}
              />
              <RateField
                id="mud-rate"
                label="MUD / water-district rate"
                value={manualMudRate}
                onChange={setManualMudRate}
              />
              <RateField
                id="other-rate"
                label="Other special-district rate"
                value={manualOtherRate}
                onChange={setManualOtherRate}
              />
              <MoneyField
                id="pid-assessment"
                label="Annual PID assessment"
                value={pidAnnualAssessment}
                onChange={setPidAnnualAssessment}
                step={100}
              />
            </div>
            {county.specialDistricts.length > 0 && (
              <Field label="Known special districts (select any that apply)" id="tax-specials">
                <select
                  id="tax-specials"
                  multiple
                  value={selectedSpecialNames}
                  onChange={(event) =>
                    setSelectedSpecialNames(
                      Array.from(event.target.selectedOptions, (option) => option.value),
                    )
                  }
                  className="tax-input min-h-32"
                >
                  {county.specialDistricts.map((district) => (
                    <option key={district.name} value={district.name}>
                      {district.name} — {district.rate.toFixed(4)}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </fieldset>
        </div>

        <div>
          <div className="bg-secondary p-6 text-secondary-foreground">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">
              Estimated annual total
            </p>
            <div className="mt-2 font-display text-5xl leading-none text-primary tabular-nums">
              {money(calculation.annualTotal)}
            </div>
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
                    <p className="text-[10px] text-muted-foreground">
                      {rateLabel(line.rate)} on {money(line.taxable)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{line.note}</p>
                  </div>
                  <strong className="tabular-nums">{money(line.amount)}</strong>
                </div>
              </div>
            ))}
            {calculation.pid > 0 && (
              <div className="py-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">PID annual assessment</p>
                    <p className="text-[10px] text-muted-foreground">
                      Flat assessment, not an ad valorem rate
                    </p>
                  </div>
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
            <Card label="Estimated selected relief" value={money(calculation.estimatedRelief)} />
          </div>
          <div className="mt-5 border border-border p-4">
            <p className="font-display text-xl">Share this calculation</p>
            <p className="mt-1 text-xs text-muted-foreground">
              The link includes the selected jurisdictions, rates, and values. It does not include
              the property’s street address.
            </p>
            <button
              type="button"
              onClick={copyShareLink}
              className="mt-3 w-full border-2 border-foreground px-4 py-3 text-xs font-bold uppercase tracking-widest"
            >
              Copy link
            </button>
            {shareMessage && (
              <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
                {shareMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-border p-6 text-xs leading-relaxed text-muted-foreground">
        Rates are cached from Texas Comptroller statewide files and may change after publication.
        MUD, PID, emergency-service, hospital, college, road, and other districts are
        address-specific. Confirm the exact taxing entities and assessment amounts shown on the
        property’s local tax statement.
      </footer>
      <style>{`.tax-field{display:flex;min-width:0;flex-direction:column}.tax-field-label{display:flex;min-height:2.15rem;align-items:flex-end;margin-bottom:.375rem;font-size:.625rem;font-weight:700;line-height:1.25;letter-spacing:.1em;text-transform:uppercase;color:var(--color-muted-foreground)}.tax-input{width:100%;min-height:44px;border:1px solid var(--color-border);background:var(--color-muted);padding:.75rem;font-size:.875rem;font-weight:500;outline:none}.tax-input:focus,.tax-affix-control:focus-within{box-shadow:0 0 0 2px var(--color-primary)}.tax-affix-control{display:flex;min-height:44px;overflow:hidden;border:1px solid var(--color-border);background:var(--color-muted)}.tax-affix-control-attention{border-color:#b45309;box-shadow:0 0 0 1px #b45309}.tax-affix{display:flex;flex:0 0 auto;align-items:center;padding:0 .75rem;font-size:.75rem;font-weight:700;color:var(--color-muted-foreground);white-space:nowrap}.tax-affix-prefix{border-right:1px solid var(--color-border)}.tax-affix-suffix{border-left:1px solid var(--color-border);text-transform:uppercase}.tax-affix-input{min-width:0;width:100%;border:0;background:transparent;padding:.75rem;font-size:.875rem;font-weight:500;outline:none}.tax-affix-input::-webkit-inner-spin-button,.tax-affix-input::-webkit-outer-spin-button{margin:0;-webkit-appearance:none}.tax-affix-input[type=number]{appearance:textfield;-moz-appearance:textfield}.tax-notice{min-height:44px;border:1px dashed var(--color-border);background:var(--color-muted);padding:.75rem}`}</style>
    </section>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="tax-field">
      <label htmlFor={id} className="tax-field-label">
        {label}
      </label>
      {children}
    </div>
  );
}

function MoneyField({
  id,
  label,
  value,
  onChange,
  step = 5000,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <Field label={label} id={id}>
      <div className="tax-affix-control">
        <span className="tax-affix tax-affix-prefix" aria-hidden="true">
          $
        </span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={100000000}
          step={step}
          value={value}
          onFocus={selectZeroOnFocus}
          onChange={(event) => onChange(safeMoney(Number(event.target.value)))}
          className="tax-affix-input"
        />
      </div>
    </Field>
  );
}

function RateField({
  id,
  label,
  value,
  onChange,
  attention = false,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  attention?: boolean;
}) {
  return (
    <Field label={label} id={id}>
      <div className={`tax-affix-control ${attention ? "tax-affix-control-attention" : ""}`}>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={20}
          step={0.0001}
          value={value}
          onFocus={selectZeroOnFocus}
          onChange={(event) => onChange(safeRate(Number(event.target.value)))}
          className="tax-affix-input"
        />
        <span className="tax-affix tax-affix-suffix" aria-hidden="true">
          per $100
        </span>
      </div>
    </Field>
  );
}

function Check({
  checked,
  onChange,
  title,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
}) {
  return (
    <label
      className={`flex items-center gap-3 border p-3 ${checked ? "border-primary bg-primary/5" : "border-border bg-muted"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-primary"
      />
      <span className="text-sm font-semibold">{title}</span>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-white/65">{label}</p>
      <p className="mt-1 font-semibold text-white tabular-nums">{value}</p>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border p-3">
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-semibold tabular-nums">{value}</p>
    </div>
  );
}
