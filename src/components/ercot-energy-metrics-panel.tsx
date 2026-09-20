import {
  ERCOT_2025_ANNUAL_REPORT_URL,
  ERCOT_2025_CAPACITY,
  ERCOT_2025_ENERGY_USE,
  ERCOT_2025_TOTAL_CAPACITY_MW,
  ERCOT_GENERATION_DATA_URL,
  ERCOT_HELPFUL_RESOURCES_URL,
  ERCOT_METRICS_REVIEWED_AT,
  ERCOT_YEARLY_PEAK_DEMAND,
  ERCOT_YEARLY_PEAK_SOURCE_URL,
  ercotPeakDemandCsv,
  peakDemandGrowthSince2000,
} from "@/data/ercot-energy-metrics";

const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function ErcotEnergyMetricsPanel() {
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(ercotPeakDemandCsv())}`;
  const currentPeak = ERCOT_YEARLY_PEAK_DEMAND[0];
  const historicalMax = Math.max(...ERCOT_YEARLY_PEAK_DEMAND.map((row) => row.demandMw));

  return (
    <section className="mt-10 rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">ERCOT operating and resource data</p>
      <h2 className="mt-2 font-display text-3xl tracking-tight">Texas grid demand, capacity and 2025 energy mix</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        ERCOT publishes different measures for actual electric demand, installed capacity and energy produced. KTR keeps those measures separate: a megawatt of installed capacity is not the same thing as a megawatt-hour generated, and neither guarantees output during a specific grid event.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="2026 yearly peak to date" value={`${integer.format(currentPeak.demandMw)} MW`} note="Provisional until final settlement" />
        <Metric label="Peak-demand growth since 2000" value={`+${oneDecimal.format(peakDemandGrowthSince2000())}%`} note="Yearly peak MW, 2000 vs. current 2026 record" />
        <Metric label="2025 installed capacity" value={`${integer.format(ERCOT_2025_TOTAL_CAPACITY_MW)} MW`} note="ERCOT annual-report capacity snapshot" />
        <Metric label="2025 natural-gas energy share" value="41.1%" note="Share of ERCOT energy use, not capacity" />
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border bg-background p-5">
          <h3 className="font-display text-2xl tracking-tight">2025 energy use by fuel</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Actual annual energy share from ERCOT&apos;s 2025 fact sheet.</p>
          <div className="mt-5 space-y-4">
            {ERCOT_2025_ENERGY_USE.map((row) => (
              <div key={row.fuel}>
                <div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium">{row.fuel}</span><span className="font-semibold tabular-nums">{row.percent.toFixed(1)}%</span></div>
                <div className="mt-1 h-3 overflow-hidden rounded bg-muted">
                  <div className="h-full rounded bg-primary" style={{ width: `${Math.max(0, row.percent)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">ERCOT reports “Other” as -0.1% because the category includes net imports/exports, storage-load adjustments and several small resource types; totals can reflect those net adjustments.</p>
        </section>

        <section className="rounded-lg border bg-background p-5">
          <h3 className="font-display text-2xl tracking-tight">2025 installed-capacity snapshot</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Installed Capacity Ratings in the 2025 ERCOT Annual Report.</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead><tr className="border-b text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><th className="py-3 text-left">Resource</th><th className="px-3 py-3 text-left">Class</th><th className="py-3 text-right">MW</th></tr></thead>
              <tbody>{ERCOT_2025_CAPACITY.map((row) => <tr key={row.resource} className="border-b last:border-b-0"><td className="py-3 font-medium">{row.resource}</td><td className="px-3 py-3 text-muted-foreground">{row.classification}</td><td className="py-3 text-right font-semibold tabular-nums">{integer.format(row.capacityMw)}</td></tr>)}</tbody>
              <tfoot><tr className="border-t-2"><td className="py-3 font-bold" colSpan={2}>Total installed capacity</td><td className="py-3 text-right font-bold tabular-nums">{integer.format(ERCOT_2025_TOTAL_CAPACITY_MW)}</td></tr></tfoot>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-7 rounded-lg border bg-background p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><h3 className="font-display text-2xl tracking-tight">Yearly ERCOT peak demand</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Integrated system load for the full peak hour; current-year records remain provisional until settlements finish.</p></div>
          <a href={csvHref} download="ercot-yearly-peak-demand-2000-2026.csv" className="text-sm font-semibold text-primary underline underline-offset-4">Download CSV</a>
        </div>
        <div className="mt-5 space-y-2">
          {ERCOT_YEARLY_PEAK_DEMAND.map((row) => (
            <div key={row.year} className="grid grid-cols-[3rem_1fr_6rem] items-center gap-3 text-xs">
              <span className="font-semibold tabular-nums">{row.year}</span>
              <div className="h-3 overflow-hidden rounded bg-muted" aria-label={`${row.year} peak demand ${row.demandMw} MW`}><div className="h-full rounded bg-primary" style={{ width: `${(row.demandMw / historicalMax) * 100}%` }} /></div>
              <span className="text-right font-semibold tabular-nums">{integer.format(row.demandMw)} MW{row.provisional ? "*" : ""}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SourceLink href={ERCOT_YEARLY_PEAK_SOURCE_URL} label="Yearly peak-demand archive" note="ERCOT yearly peak records back to 2000." />
        <SourceLink href={ERCOT_GENERATION_DATA_URL} label="Fuel Mix data" note="ERCOT 15-minute, monthly and year-to-date fuel-mix reports, including downloadable XLSX files." />
        <SourceLink href={ERCOT_HELPFUL_RESOURCES_URL} label="Demand & Energy reports" note="Current and historical ERCOT demand-and-energy workbooks and planning resources." />
        <SourceLink href={ERCOT_2025_ANNUAL_REPORT_URL} label="2025 Annual Report" note="Official capacity snapshot and 2025 grid metrics." />
      </div>

      <aside className="mt-5 border-l-2 border-primary/40 pl-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Methodology:</strong> yearly peak demand is actual integrated system load for a full hour. The 2026 peak is provisional because ERCOT can revise recent values during settlement. Installed capacity is nameplate/Installed Capacity Rating context; fuel mix is actual energy produced. KTR does not treat capacity, generation, reserves, or forecast demand as interchangeable.</aside>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">ERCOT metrics reviewed {ERCOT_METRICS_REVIEWED_AT}.</p>
    </section>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-lg border bg-background p-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p><p className="mt-2 font-display text-3xl tracking-tight text-primary">{value}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p></div>;
}

function SourceLink({ href, label, note }: { href: string; label: string; note: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 text-sm hover:border-primary"><span className="font-semibold text-primary">{label}</span><p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p></a>;
}

export default ErcotEnergyMetricsPanel;
