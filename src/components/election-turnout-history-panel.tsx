import {
  ELECTION_RESULTS_ARCHIVE_URL,
  ELECTION_TURNOUT_HISTORY_REVIEWED_AT,
  ELECTION_TURNOUT_HISTORY_SOURCE_URL,
  TEXAS_GENERAL_ELECTION_TURNOUT,
  VOTER_REGISTRATION_ARCHIVE_URL,
  electionTurnoutCsv,
  turnoutRegistrationGrowthPercent,
} from "@/data/election-turnout-history";

const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function ElectionTurnoutHistoryPanel() {
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(electionTurnoutCsv())}`;
  const newest = TEXAS_GENERAL_ELECTION_TURNOUT[0];
  const presidential = TEXAS_GENERAL_ELECTION_TURNOUT.filter((row) => row.electionType === "Presidential");
  const gubernatorial = TEXAS_GENERAL_ELECTION_TURNOUT.filter((row) => row.electionType === "Gubernatorial");
  const highestPresidential = presidential.reduce((best, row) => row.percentTurnoutRegistered > best.percentTurnoutRegistered ? row : best);
  const highestGubernatorial = gubernatorial.reduce((best, row) => row.percentTurnoutRegistered > best.percentTurnoutRegistered ? row : best);

  return (
    <section className="mt-10 rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Official statewide history</p>
      <h2 className="mt-2 font-display text-3xl tracking-tight">Texas general-election turnout, 2000–2024</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        This series uses the Texas Secretary of State&apos;s statewide voter-registration and turnout table for every November general election from 2000 through 2024. Presidential and gubernatorial cycles are labeled separately because turnout levels are structurally different and should not be compared as if they were the same election type.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="2024 registered voters" value={integer.format(newest.registeredVoters)} note={`${oneDecimal.format(newest.percentVapRegistered)}% of voting-age population`} />
        <Metric label="Registration growth since 2000" value={`+${oneDecimal.format(turnoutRegistrationGrowthPercent())}%`} note="November general-election registration" />
        <Metric label="Highest presidential turnout" value={`${oneDecimal.format(highestPresidential.percentTurnoutRegistered)}%`} note={`${highestPresidential.year} • registered-voter denominator`} />
        <Metric label="Highest gubernatorial turnout" value={`${oneDecimal.format(highestGubernatorial.percentTurnoutRegistered)}%`} note={`${highestGubernatorial.year} • registered-voter denominator`} />
      </div>

      <div className="mt-7 rounded-lg border bg-background p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-display text-2xl tracking-tight">Turnout as a share of registered voters</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Each bar uses the SOS registered-voter denominator for that election.</p>
          </div>
          <div className="text-xs text-muted-foreground">Presidential and gubernatorial cycles alternate.</div>
        </div>
        <div className="mt-5 space-y-3">
          {TEXAS_GENERAL_ELECTION_TURNOUT.map((row) => (
            <div key={row.year} className="grid grid-cols-[3rem_1fr_4rem] items-center gap-3 text-xs">
              <span className="font-semibold tabular-nums">{row.year}</span>
              <div className="h-4 overflow-hidden rounded bg-muted" aria-label={`${row.year} turnout ${row.percentTurnoutRegistered}%`}>
                <div className="h-full rounded bg-primary" style={{ width: `${row.percentTurnoutRegistered}%` }} />
              </div>
              <span className="text-right font-semibold tabular-nums">{row.percentTurnoutRegistered.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 overflow-x-auto rounded-lg border bg-background">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/20 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-4 py-3 font-bold">Year</th>
              <th className="px-3 py-3 font-bold">Cycle</th>
              <th className="px-3 py-3 text-right font-bold">Registered</th>
              <th className="px-3 py-3 text-right font-bold">VAP</th>
              <th className="px-3 py-3 text-right font-bold">Turnout</th>
              <th className="px-3 py-3 text-right font-bold">Turnout / registered</th>
              <th className="px-4 py-3 text-right font-bold">Turnout / VAP</th>
            </tr>
          </thead>
          <tbody>
            {TEXAS_GENERAL_ELECTION_TURNOUT.map((row) => (
              <tr key={row.year} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-semibold tabular-nums">{row.year}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.electionType}</td>
                <td className="px-3 py-3 text-right tabular-nums">{integer.format(row.registeredVoters)}</td>
                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{integer.format(row.votingAgePopulation)}</td>
                <td className="px-3 py-3 text-right font-semibold tabular-nums">{integer.format(row.turnout)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{row.percentTurnoutRegistered.toFixed(2)}%</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.percentTurnoutVap.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <a href={csvHref} download="texas-general-election-turnout-2000-2024.csv" className="rounded-lg border bg-background p-4 text-sm hover:border-primary">
          <span className="font-semibold text-primary">Download KTR CSV</span>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">The 13-row derived series shown above, preserving SOS values and election-type labels.</p>
        </a>
        <a href={ELECTION_TURNOUT_HISTORY_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 text-sm hover:border-primary">
          <span className="font-semibold text-primary">SOS turnout history</span>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Official statewide registration and turnout figures from 1970 to current.</p>
        </a>
        <a href={ELECTION_RESULTS_ARCHIVE_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 text-sm hover:border-primary">
          <span className="font-semibold text-primary">Election results archive</span>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Official statewide election-result archives and presidential history.</p>
        </a>
        <a href={VOTER_REGISTRATION_ARCHIVE_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 text-sm hover:border-primary">
          <span className="font-semibold text-primary">Registration archive</span>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">County and statewide voter-registration snapshots from 1991 to present.</p>
        </a>
      </div>

      <aside className="mt-5 border-l-2 border-primary/40 pl-4 text-xs leading-5 text-muted-foreground">
        <strong className="text-foreground">Methodology:</strong> turnout is a count of voters who participated, while “turnout / registered” and “turnout / VAP” use different denominators. VAP is not the same as citizen voting-age population or eligible-voter population. Texas does not register voters by political party, so this dataset does not infer party registration.
      </aside>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Official statewide turnout series reviewed {ELECTION_TURNOUT_HISTORY_REVIEWED_AT}.</p>
    </section>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl tracking-tight text-primary">{value}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p>
    </div>
  );
}

export default ElectionTurnoutHistoryPanel;
