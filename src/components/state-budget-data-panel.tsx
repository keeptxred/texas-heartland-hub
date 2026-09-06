import {
  STATE_BUDGET_DATA_REVIEWED_AT,
  STATE_BUDGET_METRICS,
  STATE_BUDGET_OFFICIAL_RESOURCES,
} from "@/data/state-budget-data";
import { StateSpendingActualsPanel } from "@/components/state-spending-actuals-panel";

export function StateBudgetDataPanel() {
  return (
    <section className="mt-10 rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Texas Money Watch foundation</p>
      <h2 className="mt-2 font-display text-3xl tracking-tight">2026–27 Texas budget snapshot</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        These figures separate enacted appropriations from the Comptroller&apos;s post-session certified revenue estimate. Appropriations are legal spending authority; they are not the same as actual expenditures. The fiscal-year table below adds the Comptroller&apos;s cash-basis record of what the state actually paid.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STATE_BUDGET_METRICS.map((metric) => (
          <a key={metric.label} href={metric.sourceUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 hover:border-primary">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{metric.label}</p>
            <p className="mt-2 font-display text-3xl tracking-tight text-primary">{metric.value}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{metric.note}</p>
          </a>
        ))}
      </div>

      <StateSpendingActualsPanel />

      <div className="mt-7 border-t pt-5">
        <h3 className="font-display text-2xl tracking-tight">Official budget and spending records</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {STATE_BUDGET_OFFICIAL_RESOURCES.map((resource) => (
            <a key={resource.url} href={resource.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-background p-4 hover:border-primary">
              <span className="font-semibold text-primary">{resource.label}</span>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{resource.publisher}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.scope}</p>
            </a>
          ))}
        </div>
      </div>

      <aside className="mt-5 border-l-2 border-primary/40 pl-4 text-xs leading-5 text-muted-foreground">
        <strong className="text-foreground">Reading the numbers:</strong> “All funds,” “General Revenue funds,” “General Revenue-related revenue,” appropriations, and actual expenditures are different measures. KTR labels each measure explicitly rather than treating them as interchangeable.
      </aside>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Official budget snapshot reviewed {STATE_BUDGET_DATA_REVIEWED_AT}.</p>
    </section>
  );
}

export default StateBudgetDataPanel;
