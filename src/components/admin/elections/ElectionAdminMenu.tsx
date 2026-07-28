export interface ElectionAdminMenuItem {
  label: string;
  href: string;
  description: string;
  status?: "ready" | "planned";
}

export interface ElectionAdminMenuProps {
  currentPath?: string;
  items?: readonly ElectionAdminMenuItem[];
  className?: string;
}

export const DEFAULT_ELECTION_ADMIN_MENU_ITEMS: readonly ElectionAdminMenuItem[] = [
  {
    label: "Overview",
    href: "/admin/elections",
    description: "Review Election Central readiness, data freshness, and publishing status.",
    status: "ready",
  },
  {
    label: "Races",
    href: "/admin/elections/races",
    description: "Manage race records, ratings, districts, dates, and publication state.",
    status: "ready",
  },
  {
    label: "Candidates",
    href: "/admin/elections/candidates",
    description: "Maintain candidate profiles, party details, biographies, and race assignments.",
    status: "ready",
  },
  {
    label: "Polls",
    href: "/admin/elections/polls",
    description: "Review poll sources, methodology, field dates, samples, and results.",
    status: "planned",
  },
  {
    label: "Forecast",
    href: "/admin/elections/forecast",
    description: "Monitor model inputs, confidence, projected margins, and update history.",
    status: "planned",
  },
  {
    label: "Results",
    href: "/admin/elections/results",
    description: "Prepare election-night reporting and track unofficial and certified results.",
    status: "planned",
  },
] as const;

export function ElectionAdminMenu({
  currentPath = "",
  items = DEFAULT_ELECTION_ADMIN_MENU_ITEMS,
  className = "",
}: ElectionAdminMenuProps) {
  return (
    <nav
      aria-label="Election Central administration"
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`.trim()}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
            Admin workspace
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Election Central</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Manage election data, publishing readiness, and Election Central updates from one
            workspace.
          </p>
        </div>
        <a
          href="/elections"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
        >
          Preview public hub →
        </a>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const isCurrent = currentPath === item.href;
          const isReady = item.status !== "planned";

          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                aria-disabled={!isReady || undefined}
                className={`block h-full rounded-lg border p-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 ${
                  isCurrent
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200 bg-slate-50 hover:border-red-200 hover:bg-white"
                } ${!isReady ? "opacity-70" : ""}`.trim()}
                onClick={(event) => {
                  if (!isReady) event.preventDefault();
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-950">{item.label}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      isReady ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isReady ? "Ready" : "Planned"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-5 text-slate-600">{item.description}</p>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 pt-4 text-sm">
        <a href="/admin" className="font-semibold text-red-700 underline-offset-4 hover:underline">
          Editorial dashboard
        </a>
        <a
          href="/elections/methodology"
          className="font-semibold text-red-700 underline-offset-4 hover:underline"
        >
          Public methodology
        </a>
        <a
          href="/register-to-vote"
          className="font-semibold text-red-700 underline-offset-4 hover:underline"
        >
          Voter registration guide
        </a>
      </div>
    </nav>
  );
}

export default ElectionAdminMenu;
