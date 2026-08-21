import { useMemo, useState } from "react";
import { COUNTIES, TAX_RATE_DATASET } from "@/data/counties";
import {
  PROPERTY_TAX_DATA_REVIEWED_AT,
  PROPERTY_TAX_HISTORY_FILES,
  PROPERTY_TAX_OFFICIAL_FILES,
  PROPERTY_TAX_REFERENCE_LINKS,
} from "@/data/property-tax-data";
import { buildCountyRateCsv, estimateTaxFromRate, summarizeCountyRates } from "@/lib/property-tax-data-utils";

function formatRate(rate: number): string {
  return `${rate.toFixed(4)}%`;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function PropertyTaxDataPanel() {
  const [query, setQuery] = useState("");
  const [countySlug, setCountySlug] = useState("");
  const [taxableValue, setTaxableValue] = useState("100000");
  const summary = useMemo(() => summarizeCountyRates(COUNTIES), []);
  const selectedCounty = useMemo(() => COUNTIES.find((county) => county.slug === countySlug), [countySlug]);
  const visibleCounties = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...COUNTIES]
      .filter((county) => !normalized || county.name.toLowerCase().includes(normalized))
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [query]);
  const parsedTaxableValue = Number.parseFloat(taxableValue.replaceAll(",", ""));
  const countyOnlyEstimate = selectedCounty ? estimateTaxFromRate(parsedTaxableValue, selectedCounty.countyRate) : 0;

  function downloadCountyCsv() {
    const blob = new Blob([buildCountyRateCsv(COUNTIES)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `texas-county-property-tax-rates-${TAX_RATE_DATASET.taxYear}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-10 space-y-8">
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Usable statewide dataset</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl tracking-tight">{TAX_RATE_DATASET.taxYear} county property-tax rates</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              KTR's normalized county table is generated from the Texas Comptroller's statewide rate-and-levy workbooks. Rates are per $100 of taxable value. County rates are only one layer of a Texas property-tax bill; school districts, cities and special districts can add separate rates.
            </p>
          </div>
          <button type="button" onClick={downloadCountyCsv} className="rounded-md border bg-background px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
            Download county CSV
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DataStat label="Counties" value={summary.countyCount.toLocaleString("en-US")} />
          <DataStat label="Median county rate" value={formatRate(summary.medianCountyRate)} />
          <DataStat label="Average county rate" value={formatRate(summary.averageCountyRate)} />
          <DataStat label="County-rate range" value={`${formatRate(summary.lowestCountyRate)}–${formatRate(summary.highestCountyRate)}`} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border bg-background p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">County-rate calculator</p>
            <h3 className="mt-2 font-display text-2xl tracking-tight">Estimate the county portion only</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                County
                <select value={countySlug} onChange={(event) => setCountySlug(event.target.value)} className="mt-2 w-full rounded-md border bg-background px-3 py-2 font-normal">
                  <option value="">Select a county</option>
                  {[...COUNTIES].sort((left, right) => left.name.localeCompare(right.name)).map((county) => (
                    <option key={county.slug} value={county.slug}>{county.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Taxable value
                <input value={taxableValue} onChange={(event) => setTaxableValue(event.target.value)} inputMode="decimal" className="mt-2 w-full rounded-md border bg-background px-3 py-2 font-normal" aria-label="Taxable value" />
              </label>
            </div>
            <div className="mt-5 rounded-md bg-muted/40 p-4">
              {selectedCounty ? (
                <>
                  <p className="text-sm text-muted-foreground">{selectedCounty.name} county rate: <strong className="text-foreground">{formatRate(selectedCounty.countyRate)}</strong></p>
                  <p className="mt-1 text-2xl font-bold">{formatMoney(countyOnlyEstimate)}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Illustrative county levy on the taxable value entered. This is not a full tax-bill estimate and excludes school, city and special-district rates, exemptions, ceilings, caps and local adjustments.</p>
                </>
              ) : <p className="text-sm text-muted-foreground">Select a county to calculate its county-tax portion from the official statewide rate.</p>}
            </div>
          </div>

          <div className="rounded-lg border bg-background p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Historical archive</p>
            <h3 className="mt-2 font-display text-2xl tracking-tight">2021–2025 official workbooks</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Use the county workbook for county-rate history or the combined workbook to compare cities, counties, school districts and special districts for the same tax year.</p>
            <div className="mt-4 divide-y rounded-md border">
              {PROPERTY_TAX_HISTORY_FILES.map((file) => (
                <div key={file.year} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                  <strong>{file.year}</strong>
                  <div className="flex gap-4">
                    <a href={file.countyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">County XLSX</a>
                    <a href={file.combinedUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">All units XLSX</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">County table</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">All 254 Texas counties</h2>
          </div>
          <label className="text-sm font-semibold">
            Filter counties
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Harris, Travis, El Paso..." className="mt-2 block w-64 max-w-full rounded-md border bg-background px-3 py-2 font-normal" />
          </label>
        </div>
        <div className="mt-5 max-h-[34rem] overflow-auto rounded-md border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">County</th>
                <th className="px-4 py-3 font-semibold">County rate</th>
                <th className="px-4 py-3 font-semibold">County levy / $100k taxable</th>
                <th className="px-4 py-3 font-semibold">Tax year</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visibleCounties.map((county) => (
                <tr key={county.slug}>
                  <td className="px-4 py-3 font-semibold">{county.name}</td>
                  <td className="px-4 py-3 tabular-nums">{formatRate(county.countyRate)}</td>
                  <td className="px-4 py-3 tabular-nums">{formatMoney(estimateTaxFromRate(100_000, county.countyRate))}</td>
                  <td className="px-4 py-3 tabular-nums">{county.taxYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Showing {visibleCounties.length} of {COUNTIES.length} counties. Source: {TAX_RATE_DATASET.sourceUrl}. Dataset refreshed {TAX_RATE_DATASET.lastUpdated}.</p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Current official files</p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">2025 Texas tax rates and levies</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">The Comptroller states that these calculated levies are not actual collections and can change when appraisal districts submit updated information.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {PROPERTY_TAX_OFFICIAL_FILES.map((file) => (
            <a key={file.url} href={file.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 hover:border-primary">
              <div className="flex items-start justify-between gap-3"><span className="font-semibold text-primary">{file.label}</span><span className="rounded bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider">{file.format}</span></div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{file.scope}</p>
            </a>
          ))}
        </div>
        <div className="mt-6 border-t pt-5">
          <h3 className="font-semibold">Verify and drill down</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {PROPERTY_TAX_REFERENCE_LINKS.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 text-sm hover:border-primary">
                <span className="font-semibold text-primary">{link.label}</span><p className="mt-2 leading-5 text-muted-foreground">{link.note}</p>
              </a>
            ))}
          </div>
        </div>
        <p className="mt-5 text-xs leading-5 text-muted-foreground">Official-file links reviewed {PROPERTY_TAX_DATA_REVIEWED_AT}. Parcel-specific values and bills remain controlled by local appraisal districts and taxing units.</p>
      </div>
    </section>
  );
}

function DataStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-background p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 text-xl font-bold tabular-nums">{value}</p></div>;
}
