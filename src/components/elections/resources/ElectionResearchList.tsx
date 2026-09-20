export interface ElectionResearchEntry {
  id: string;
  label: string;
  href: string;
}

export interface ElectionResearchListProps {
  entries: readonly ElectionResearchEntry[];
  totalSaved: number;
  onClear: () => void;
}

export function ElectionResearchList({ entries, totalSaved, onClear }: ElectionResearchListProps) {
  if (totalSaved === 0) return null;

  return (
    <aside
      aria-labelledby="election-research-list-heading"
      className="rounded-xl border border-border bg-muted/30 p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Saved research</p>
          <h2 id="election-research-list-heading" className="mt-1 font-bold text-foreground">
            Browser-saved ballot research
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalSaved} item{totalSaved === 1 ? "" : "s"} saved only in this browser. This is a
            research list, not a ballot or ballot-tracking service.
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Clear saved research
        </button>
      </div>
      {entries.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={entry.href}
                className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary hover:underline"
              >
                {entry.label}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Saved items outside the current filters remain stored by ID.
        </p>
      )}
    </aside>
  );
}
