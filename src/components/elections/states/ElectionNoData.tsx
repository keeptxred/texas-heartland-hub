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
      className={`rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center ${className}`.trim()}
    >
      <div
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-card text-xl font-bold text-primary shadow-sm ring-1 ring-border"
      >
        {ICONS[icon]}
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mx-auto mt-2 max-w-2xl font-display text-3xl leading-none tracking-tight text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{message}</p>

      {primaryAction && (
        <a
          href={primaryAction.href}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {primaryAction.label} →
        </a>
      )}

      {secondaryActions.length > 0 && (
        <nav aria-label="Related election resources" className="mx-auto mt-7 max-w-3xl border-t border-border pt-6">
          <ul className="grid gap-3 text-left sm:grid-cols-2">
            {secondaryActions.map((action) => (
              <li key={`${action.href}-${action.label}`}>
                <a
                  href={action.href}
                  className="block rounded-lg border border-border bg-card p-4 transition hover:border-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span className="text-sm font-semibold text-primary">{action.label} →</span>
                  {action.description && <span className="mt-1 block text-sm leading-5 text-muted-foreground">{action.description}</span>}
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
