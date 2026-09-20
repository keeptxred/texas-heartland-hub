import {
  BORDER_SECURITY_AGENCY_FUNDING,
  BORDER_SECURITY_DATA_REVIEWED_AT,
  BORDER_SECURITY_FISCAL_SIZEUP_2026_27_URL,
  BORDER_SECURITY_GAA_2024_25_URL,
  BORDER_SECURITY_GAA_2026_27_URL,
  BORDER_SECURITY_HISTORICAL_EXPENDITURE_URL,
  BORDER_SECURITY_HISTORICAL_REPORTED_EXPENDITURE,
  BORDER_SECURITY_REIMBURSEMENT_CONTEXT,
  BORDER_SECURITY_REIMBURSEMENT_CONTEXT_URL,
  BORDER_SECURITY_TOTALS,
  borderSecurityFundingChangePercent,
  borderSecurityFundingCsv,
} from "@/data/border-security-spending";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 1 });
const percent = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: "exceptZero" });

function billions(millions: number) {
  return `$${(millions / 1000).toFixed(2)}B`;
}

export function BorderSecuritySpendingPanel() {
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(borderSecurityFundingCsv())}`;
  const topThree = BORDER_SECURITY_AGENCY_FUNDING
    .filter((row) => ["Texas Military Department", "Department of Public Safety", "Trusteed Programs within the Office of the Governor"].includes(row.agency))
    .reduce((sum, row) => sum + row.biennium2026_27Millions, 0);
  const topThreeShare = (topThree / BORDER_SECURITY_TOTALS.biennium2026_27Millions) * 100;

  return (
    <section className="mt-10 rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Texas border security funding</p>
      <h2 className="mt-2 font-display text-3xl tracking-tight">2026–27 appropriations by agency</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        The 2026–27 General Appropriations Act identifies $3.3517 billion in border-security funding across 13 state agencies. These are appropriations—legal spending authority—not proof that every dollar has already been expended. Article IX requires participating agencies to report expended amounts and performance measures to the Legislative Budget Board on a semiannual schedule.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="2026–27 appropriated" value={billions(BORDER_SECURITY_TOTALS.biennium2026_27Millions)} note="All agencies, GAA Article IX" />
        <Metric label="2024–25 budgeted" value={billions(BORDER_SECURITY_TOTALS.biennium2024_25Millions)} note="Prior biennium comparison" />
        <Metric label="Biennial change" value={`${percent.format(borderSecurityFundingChangePercent())}%`} note="Appropriated/budgeted totals, not actual spending" />
        <Metric label="Top three agency share" value={`${topThreeShare.toFixed(1)}%`} note="TMD, DPS and Governor trusteed programs" />
      </div>

      <div className="mt-7 overflow-x-auto rounded-lg border bg-background">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead><tr className="border-b bg-muted/20 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><th className="px-4 py-3 font-bold">Agency</th><th className="px-3 py-3 text-right font-bold">2024–25</th><th className="px-3 py-3 text-right font-bold">2026–27</th><th className="px-4 py-3 text-right font-bold">Change</th></tr></thead>
          <tbody>
            {BORDER_SECURITY_AGENCY_FUNDING.map((row) => {
              const change = row.biennium2024_25Millions === 0 ? null : ((row.biennium2026_27Millions / row.biennium2024_25Millions) - 1) * 100;
              return <tr key={row.agency} className="border-b last:border-b-0"><td className="px-4 py-3 font-medium">{row.agency}</td><td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{money.format(row.biennium2024_25Millions)}M</td><td className="px-3 py-3 text-right font-semibold tabular-nums">{money.format(row.biennium2026_27Millions)}M</td><td className="px-4 py-3 text-right tabular-nums">{change === null ? "—" : `${percent.format(change)}%`}</td></tr>;
            })}
          </tbody>
          <tfoot><tr className="border-t-2"><td className="px-4 py-3 font-bold">Official statewide total</td><td className="px-3 py-3 text-right font-bold tabular-nums">{money.format(BORDER_SECURITY_TOTALS.biennium2024_25Millions)}M</td><td className="px-3 py-3 text-right font-bold tabular-nums">{money.format(BORDER_SECURITY_TOTALS.biennium2026_27Millions)}M</td><td className="px-4 py-3 text-right font-bold tabular-nums">{percent.format(borderSecurityFundingChangePercent())}%</td></tr></tfoot>
        </table>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">Agency figures are shown in the LBB/GAA’s rounded millions. Because individual rows are rounded, their displayed sum can differ slightly from the official statewide total.</p>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-background p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Historical reported expenditures</p>
          <p className="mt-2 font-display text-2xl tracking-tight">{BORDER_SECURITY_HISTORICAL_REPORTED_EXPENDITURE.biennium}</p>
          <div className="mt-4 grid grid-cols-2 gap-3"><Metric label="Appropriated" value={`${money.format(BORDER_SECURITY_HISTORICAL_REPORTED_EXPENDITURE.appropriatedMillions)}M`} note="LBB comparison" /><Metric label="Agency-reported expended" value={`${money.format(BORDER_SECURITY_HISTORICAL_REPORTED_EXPENDITURE.agencyReportedExpendedMillions)}M`} note={`${BORDER_SECURITY_HISTORICAL_REPORTED_EXPENDITURE.percentExpended}% of headline appropriation`} /></div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">{BORDER_SECURITY_HISTORICAL_REPORTED_EXPENDITURE.note}</p>
        </div>
        <div className="rounded-lg border bg-background p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Federal reimbursement treatment</p>
          <h3 className="mt-2 font-display text-2xl tracking-tight">Do not net a request against state spending</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{BORDER_SECURITY_REIMBURSEMENT_CONTEXT.description}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{BORDER_SECURITY_REIMBURSEMENT_CONTEXT.treatment}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <a href={csvHref} download="texas-border-security-funding-2024-2027.csv" className="rounded-lg border bg-background p-4 text-sm hover:border-primary"><span className="font-semibold text-primary">Download KTR CSV</span><p className="mt-1 text-xs leading-5 text-muted-foreground">Agency-level biennial comparison shown above.</p></a>
        <SourceLink href={BORDER_SECURITY_GAA_2026_27_URL} label="2026–27 GAA" note="Current enacted Article IX border-security table and reporting requirements." />
        <SourceLink href={BORDER_SECURITY_FISCAL_SIZEUP_2026_27_URL} label="2026–27 Fiscal Size-Up" note="LBB explanation of major border-security funding and agencies." />
        <SourceLink href={BORDER_SECURITY_HISTORICAL_EXPENDITURE_URL} label="LBB expenditure history" note="Historical appropriation-versus-agency-reported expenditure comparison." />
        <SourceLink href={BORDER_SECURITY_REIMBURSEMENT_CONTEXT_URL} label="Certification Revenue Estimate" note="Comptroller treatment of uncertain federal border-security reimbursement." />
      </div>
      <p className="mt-3 text-xs"><a href={BORDER_SECURITY_GAA_2024_25_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">2024–25 GAA comparison source</a></p>

      <aside className="mt-5 border-l-2 border-primary/40 pl-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Methodology:</strong> the current table compares legislative budget authority by biennium. It does not label appropriations as cash already spent. Actual expenditure reporting can include timing, interagency, pass-through, or other funding distinctions identified by LBB. Federal reimbursements are recorded separately only when awarded or received.</aside>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Border-security funding dataset reviewed {BORDER_SECURITY_DATA_REVIEWED_AT}.</p>
    </section>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-lg border bg-background p-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p><p className="mt-2 font-display text-2xl tracking-tight text-primary">{value}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p></div>;
}

function SourceLink({ href, label, note }: { href: string; label: string; note: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 text-sm hover:border-primary"><span className="font-semibold text-primary">{label}</span><p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p></a>;
}

export default BorderSecuritySpendingPanel;
