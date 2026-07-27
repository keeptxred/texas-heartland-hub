export interface ElectionNoDataAction {
  label: string;
  href: string;
  description?: string;
}

export interface ElectionNoDataProps {
  title?: string;
  message?: string;
  eyebrow?: string;
  primaryAction?: ElectionNoDataAction;
  secondaryActions?: readonly ElectionNoDataAction[];
  icon?: "ballot" | "poll" | "forecast" | "candidate" | "race";
  className?: string;
}

const ICONS: Record<NonNullable<ElectionNoDataProps["icon"]>, string> = {
  ballot: "▣",
  poll: "▥",
  forecast: "↗",
  candidate: "●",
  race: "◎",
};

export function ElectionNoData({
  title = "Election data is not available yet",
  message = "We are still gathering and verifying information for this election. Check back as official filings, polling, and race updates become available.",
  eyebrow = "Election Central",
  primaryAction,
  secondaryActions = [],
  icon = "ballot",
  className = "",
}: ElectionNoDataProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className={`rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center ${className}`.trim()}
    >
      <div
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-red-700 shadow-sm ring-1 ring-slate-200"
      >
        {ICONS[icon]}
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-red-700">{eyebrow}</p>
      <h2 className="mx-auto mt-2 max-w-2xl text-2xl font-bold tracking-tight text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">{message}</p>

      {primaryAction && (
        <a
          href={primaryAction.href}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
        >
          {primaryAction.label} →
        </a>
      )}

      {secondaryActions.length > 0 && (
        <nav aria-label="Related election resources" className="mx-auto mt-7 max-w-3xl border-t border-slate-200 pt-6">
          <ul className="grid gap-3 text-left sm:grid-cols-2">
            {secondaryActions.map((action) => (
              <li key={`${action.href}-${action.label}`}>
                <a
                  href={action.href}
                  className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-red-200 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
                >
                  <span className="text-sm font-semibold text-red-700">{action.label} →</span>
                  {action.description && <span className="mt-1 block text-sm leading-5 text-slate-600">{action.description}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}

export default ElectionNoData;
