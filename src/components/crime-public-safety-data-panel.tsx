import {
  CRIME_PUBLIC_SAFETY_REVIEWED_AT,
  DPS_2025_OFFENSES,
  DPS_2025_SUMMARY,
  DPS_CRIME_IN_TEXAS_2025_URL,
  DPS_CRIME_IN_TEXAS_SUPPLEMENTAL_URL,
  DPS_STATEWIDE_CRIME_TREND,
  OCA_FY2025_FELONY_ACTIVITY,
  TDCJ_FY2025_CUSTODY,
  TDCJ_FY2025_RELEASES,
  TDCJ_FY2025_STATISTICAL_REPORT_URL,
  TDCJ_STATISTICAL_REPORTS_URL,
  TEXAS_COURTS_FELONY_FY2025_URL,
  TEXAS_COURTS_FY2025_URL,
  dpsStatewideTrendCsv,
} from "@/data/crime-public-safety-metrics";

const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const twoDecimals = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CrimePublicSafetyDataPanel() {
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(dpsStatewideTrendCsv())}`;
  const latest = DPS_STATEWIDE_CRIME_TREND.at(-1)!;
  const maxViolentRate = Math.max(...DPS_STATEWIDE_CRIME_TREND.map((row) => row.violentRate));
  const maxPropertyRate = Math.max(...DPS_STATEWIDE_CRIME_TREND.map((row) => row.propertyRate));

  return (
    <section className="mt-10 rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Texas crime and public safety records</p>
      <h2 className="mt-2 font-display text-3xl tracking-tight">Reported crime, felony courts, and TDCJ custody</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Public-safety statistics describe different stages of different systems. DPS counts reported offenses submitted by law-enforcement agencies; the Office of Court Administration counts court cases and dispositions; TDCJ counts people or custody/supervision episodes in the state corrections system. KTR keeps those measures separate instead of treating them as one statewide "crime" number.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="2025 violent crime rate" value={`${twoDecimals.format(latest.violentRate)}`} note={`Per 100,000; ${oneDecimal.format(DPS_2025_SUMMARY.violentRateChangePercent)}% vs. 2024`} />
        <Metric label="2025 property crime rate" value={`${twoDecimals.format(latest.propertyRate)}`} note={`Per 100,000; ${oneDecimal.format(DPS_2025_SUMMARY.propertyRateChangePercent)}% vs. 2024`} />
        <Metric label="FY2025 felony cases disposed" value={integer.format(OCA_FY2025_FELONY_ACTIVITY.totalCasesDisposed)} note="District and statutory county courts; cases, not unique defendants" />
        <Metric label="TDCJ on hand 8/31/2025" value={integer.format(TDCJ_FY2025_CUSTODY.totalOnHand)} note="Prison, state jail and SAFP combined" />
      </div>

      <section className="mt-7 rounded-lg border bg-background p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><h3 className="font-display text-2xl tracking-tight">DPS statewide index-crime trend</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Static annual Crime in Texas snapshots. Rates are reported offenses per 100,000 participating-jurisdiction population.</p></div>
          <a href={csvHref} download="texas-dps-statewide-crime-trend-2021-2025.csv" className="text-sm font-semibold text-primary underline underline-offset-4">Download DPS trend CSV</a>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead><tr className="border-b text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><th className="py-3 text-left">Year</th><th className="px-3 py-3 text-right">Violent volume</th><th className="px-3 py-3 text-right">Violent rate</th><th className="px-3 py-3 text-right">Property volume</th><th className="py-3 text-right">Property rate</th></tr></thead>
            <tbody>{DPS_STATEWIDE_CRIME_TREND.map((row) => <tr key={row.year} className="border-b last:border-b-0"><td className="py-3 font-semibold">{row.year}</td><td className="px-3 py-3 text-right tabular-nums">{integer.format(row.violentVolume)}</td><td className="px-3 py-3 text-right tabular-nums">{twoDecimals.format(row.violentRate)}</td><td className="px-3 py-3 text-right tabular-nums">{integer.format(row.propertyVolume)}</td><td className="py-3 text-right tabular-nums">{twoDecimals.format(row.propertyRate)}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <TrendBars title="Violent crime rate" max={maxViolentRate} values={DPS_STATEWIDE_CRIME_TREND.map((row) => ({ year: row.year, value: row.violentRate }))} />
          <TrendBars title="Property crime rate" max={maxPropertyRate} values={DPS_STATEWIDE_CRIME_TREND.map((row) => ({ year: row.year, value: row.propertyRate }))} />
        </div>
        <p className="mt-5 text-xs leading-5 text-muted-foreground">DPS says the 2025 annual report includes data reported by March 20, 2026. The online UCR portal can later change as local agencies submit or revise records, so KTR records the annual snapshot and its publication cutoff rather than silently replacing historical values.</p>
      </section>

      <section className="mt-7 rounded-lg border bg-background p-5">
        <h3 className="font-display text-2xl tracking-tight">2025 DPS offense detail</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Selected index offenses from the statewide five-year offense table. Volume is the number of reported offenses; rate is per 100,000.</p>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-b text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><th className="py-3 text-left">Offense</th><th className="px-3 py-3 text-right">2024 volume</th><th className="px-3 py-3 text-right">2025 volume</th><th className="px-3 py-3 text-right">2024 rate</th><th className="py-3 text-right">2025 rate</th></tr></thead><tbody>{DPS_2025_OFFENSES.map((row) => <tr key={row.offense} className="border-b last:border-b-0"><td className="py-3 font-medium">{row.offense}</td><td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{integer.format(row.volume2024)}</td><td className="px-3 py-3 text-right font-semibold tabular-nums">{integer.format(row.volume2025)}</td><td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{twoDecimals.format(row.rate2024)}</td><td className="py-3 text-right font-semibold tabular-nums">{twoDecimals.format(row.rate2025)}</td></tr>)}</tbody></table></div>
      </section>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border bg-background p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">Texas courts • FY2025</p>
          <h3 className="mt-2 font-display text-2xl tracking-tight">Statewide felony case activity</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label="Cases on docket" value={integer.format(OCA_FY2025_FELONY_ACTIVITY.totalCasesOnDocket)} note="All felony categories" />
            <Metric label="Filed by indictment/information" value={integer.format(OCA_FY2025_FELONY_ACTIVITY.filedByIndictmentOrInformation)} note="Cases added by this filing method" />
            <Metric label="Total convictions" value={integer.format(OCA_FY2025_FELONY_ACTIVITY.totalConvictions)} note="Court case dispositions" />
            <Metric label="Active pending at FY end" value={integer.format(OCA_FY2025_FELONY_ACTIVITY.activeCasesPendingAtYearEnd)} note="As of August 31, 2025" />
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">{OCA_FY2025_FELONY_ACTIVITY.note}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><SmallStat label="Failure-to-appear cases" value={OCA_FY2025_FELONY_ACTIVITY.defendantFailedToAppearCases} /><SmallStat label="Release-condition violation cases" value={OCA_FY2025_FELONY_ACTIVITY.releaseConditionViolationCases} /><SmallStat label="Offense on bail/supervision cases" value={OCA_FY2025_FELONY_ACTIVITY.offenseWhileOnBailOrSupervisionCases} /></div>
        </section>

        <section className="rounded-lg border bg-background p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">TDCJ • FY2025</p>
          <h3 className="mt-2 font-display text-2xl tracking-tight">Custody and releases</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label="Prison on hand" value={integer.format(TDCJ_FY2025_CUSTODY.prisonOnHand)} note="August 31, 2025" />
            <Metric label="State jail on hand" value={integer.format(TDCJ_FY2025_CUSTODY.stateJailOnHand)} note="August 31, 2025" />
            <Metric label="SAFP on hand" value={integer.format(TDCJ_FY2025_CUSTODY.safpOnHand)} note="August 31, 2025" />
            <Metric label="FY2025 releases" value={integer.format(TDCJ_FY2025_RELEASES.totalReleases)} note={`${integer.format(TDCJ_FY2025_RELEASES.releasesAndDepartures)} including departures`} />
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">The TDCJ statistical report covers incarcerated and supervised populations and can count a person in more than one category when that person experiences multiple episodes or statuses during the fiscal year. The on-hand figure above is a point-in-time custody snapshot, not a count of crimes or convictions during 2025.</p>
        </section>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SourceLink href={DPS_CRIME_IN_TEXAS_2025_URL} label="2025 Crime in Texas" note="DPS statewide annual report and five-year offense trends." />
        <SourceLink href={DPS_CRIME_IN_TEXAS_SUPPLEMENTAL_URL} label="DPS 2025 supplemental reports" note="Offense volume, rate, clearance, weapons, property-loss and demographic supplemental tables." />
        <SourceLink href={TEXAS_COURTS_FY2025_URL} label="Texas Courts FY2025 data" note="Annual statistical supplement with statewide and county court activity files." />
        <SourceLink href={TEXAS_COURTS_FELONY_FY2025_URL} label="FY2025 statewide felony activity" note="OCA district and statutory county court felony case detail." />
        <SourceLink href={TDCJ_FY2025_STATISTICAL_REPORT_URL} label="TDCJ FY2025 Statistical Report" note="Official custody, demographic, receive and release statistics." />
        <SourceLink href={TDCJ_STATISTICAL_REPORTS_URL} label="TDCJ statistical archive" note="Current and historical fiscal-year statistical reports." />
      </div>

      <aside className="mt-5 border-l-2 border-primary/40 pl-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Methodology boundary:</strong> DPS reported-offense statistics answer what participating agencies reported to UCR/NIBRS. OCA statistics answer what happened to court cases. TDCJ statistics answer who was in or moved through state corrections. Arrests, charges, cases, convictions, incarceration, releases, clearances and victimization are different measures; KTR should never substitute one for another.</aside>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Crime/public-safety metrics reviewed {CRIME_PUBLIC_SAFETY_REVIEWED_AT}.</p>
    </section>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-lg border bg-background p-4"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{label}</p><p className="mt-2 font-display text-2xl tracking-tight text-primary">{value}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p></div>;
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return <div className="rounded border bg-muted/20 p-3"><p className="font-bold tabular-nums text-foreground">{integer.format(value)}</p><p className="mt-1 leading-4 text-muted-foreground">{label}</p></div>;
}

function TrendBars({ title, max, values }: { title: string; max: number; values: { year: number; value: number }[] }) {
  return <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{title}</p><div className="mt-3 space-y-2">{values.map((row) => <div key={row.year} className="grid grid-cols-[3rem_1fr_5rem] items-center gap-2 text-xs"><span className="font-semibold">{row.year}</span><div className="h-3 overflow-hidden rounded bg-muted"><div className="h-full rounded bg-primary" style={{ width: `${(row.value / max) * 100}%` }} /></div><span className="text-right font-semibold tabular-nums">{twoDecimals.format(row.value)}</span></div>)}</div></div>;
}

function SourceLink({ href, label, note }: { href: string; label: string; note: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 text-sm hover:border-primary"><span className="font-semibold text-primary">{label}</span><p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p></a>;
}

export default CrimePublicSafetyDataPanel;
