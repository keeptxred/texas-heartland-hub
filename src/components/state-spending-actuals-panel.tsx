import {
  STATE_SPENDING_ACTUALS,
  STATE_SPENDING_ACTUALS_FISCAL_YEAR,
  STATE_SPENDING_ACTUALS_REPORT_URL,
  STATE_SPENDING_ACTUALS_REVIEWED_AT,
  STATE_SPENDING_ACTUALS_SOURCE_URL,
  STATE_SPENDING_ACTUALS_XLSX_URL,
  STATE_SPENDING_TOTALS,
  stateSpendingShare,
} from "@/data/state-spending-actuals";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

export function StateSpendingActualsPanel() {
  return (
    <section className="mt-7 rounded-xl border bg-background p-5">
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Actual cash expenditures</p>
          <h3 className="mt-2 font-display text-2xl tracking-tight">Fiscal {STATE_SPENDING_ACTUALS_FISCAL_YEAR}: what Texas actually paid</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            The Comptroller&apos;s Annual Cash Report records cash-basis net expenditures from funds held in the State Treasury. This is actual spending, not an appropriation ceiling or a forecast. The table uses the report&apos;s all-funds-excluding-trust expenditure categories.
          </p>
        </div>
        <div className="shrink-0 rounded-lg border bg-muted/20 px-4 py-3 text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Total net expenditures</p>
          <p className="mt-1 font-display text-3xl tracking-tight text-primary">{currency.format(STATE_SPENDING_TOTALS.fiscal2025)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{percent.format(STATE_SPENDING_TOTALS.percentChange)}% vs. fiscal 2024</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="py-3 pr-4 font-bold">Expenditure category</th>
              <th className="px-3 py-3 text-right font-bold">FY 2024</th>
              <th className="px-3 py-3 text-right font-bold">FY 2025</th>
              <th className="px-3 py-3 text-right font-bold">Change</th>
              <th className="py-3 pl-3 text-right font-bold">FY25 share</th>
            </tr>
          </thead>
          <tbody>
            {STATE_SPENDING_ACTUALS.map((row) => (
              <tr key={row.category} className="border-b last:border-b-0">
                <td className="py-3 pr-4 font-medium">{row.category}</td>
                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{currency.format(row.fiscal2024)}</td>
                <td className="px-3 py-3 text-right font-semibold tabular-nums">{currency.format(row.fiscal2025)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{percent.format(row.percentChange)}%</td>
                <td className="py-3 pl-3 text-right tabular-nums text-muted-foreground">{stateSpendingShare(row.fiscal2025).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <a href={STATE_SPENDING_ACTUALS_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border p-4 text-sm hover:border-primary">
          <span className="font-semibold text-primary">Fiscal 2025 Cash Report</span>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Primary Comptroller report containing the expenditure-category table and statewide totals.</p>
        </a>
        <a href={STATE_SPENDING_ACTUALS_XLSX_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border p-4 text-sm hover:border-primary">
          <span className="font-semibold text-primary">Download official XLSX</span>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Comptroller workbook for revenues, expenditures and cash balances of state funds.</p>
        </a>
        <a href={STATE_SPENDING_ACTUALS_REPORT_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border p-4 text-sm hover:border-primary">
          <span className="font-semibold text-primary">Cash Report archive</span>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Current and prior fiscal-year reports and downloadable official data files.</p>
        </a>
      </div>

      <aside className="mt-5 border-l-2 border-primary/40 pl-4 text-xs leading-5 text-muted-foreground">
        <strong className="text-foreground">Methodology:</strong> these figures are cash disbursements recorded in the fiscal year and exclude funds held outside the State Treasury except the limited items identified by the Comptroller. The cash report and the state&apos;s accrual-based ACFR use different accounting frameworks, so their totals should not be treated as interchangeable.
      </aside>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Actual-spending dataset reviewed {STATE_SPENDING_ACTUALS_REVIEWED_AT}.</p>
    </section>
  );
}

export default StateSpendingActualsPanel;
