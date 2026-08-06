import { useEffect, useMemo, useState } from "react";

type SourceHealthRow = {
  source_name: string;
  rss_url: string;
  category: string | null;
  latest_item_at: string | null;
  items_24h: number;
  items_7d: number;
  covered_7d: number;
  health_status: "healthy" | "quiet" | "stale" | "never_seen";
  coverage_rate_7d: number;
};

type HealthPayload = {
  ok: boolean;
  sources?: SourceHealthRow[];
  errors?: string[];
};

const statusLabel: Record<SourceHealthRow["health_status"], string> = {
  healthy: "Healthy",
  quiet: "Quiet",
  stale: "Stale",
  never_seen: "Never seen",
};

const statusClass: Record<SourceHealthRow["health_status"], string> = {
  healthy: "border-emerald-300 bg-emerald-50 text-emerald-900",
  quiet: "border-amber-300 bg-amber-50 text-amber-950",
  stale: "border-red-300 bg-red-50 text-red-900",
  never_seen: "border-slate-300 bg-slate-50 text-slate-800",
};

export function NewsSourceHealthPanel() {
  const [rows, setRows] = useState<SourceHealthRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | SourceHealthRow["health_status"]>("all");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch("/api/public/newsroom-health", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const payload = (await response.json()) as HealthPayload;
        if (!active) return;
        if (!response.ok || payload.ok !== true) {
          setError(payload.errors?.join("; ") || `Source-health request failed with HTTP ${response.status}`);
        } else {
          setRows(payload.sources ?? []);
        }
      } catch (requestError) {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load source health");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc[row.health_status] += 1;
        return acc;
      },
      { healthy: 0, quiet: 0, stale: 0, never_seen: 0 },
    );
  }, [rows]);

  const visible = filter === "all" ? rows : rows.filter((row) => row.health_status === filter);

  if (loading) return <div className="text-sm text-muted-foreground">Loading source health…</div>;
  if (error) {
    return (
      <div role="alert" className="border-2 border-red-300 bg-red-50 p-4 text-sm text-red-900">
        Source-health reporting could not load from the newsroom health endpoint.
        <div className="mt-1 text-xs opacity-75">{error}</div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Healthy" value={counts.healthy} />
        <Summary label="Quiet" value={counts.quiet} />
        <Summary label="Stale" value={counts.stale} />
        <Summary label="Never seen" value={counts.never_seen} />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "healthy", "quiet", "stale", "never_seen"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`border px-3 py-1.5 text-xs font-semibold ${
              filter === value ? "border-primary bg-primary text-primary-foreground" : "border-foreground/20 bg-white"
            }`}
          >
            {value === "all" ? "All sources" : statusLabel[value]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.length === 0 ? (
          <div className="border border-foreground/10 bg-white p-5 text-sm text-muted-foreground">
            No sources match this filter.
          </div>
        ) : (
          visible.map((row) => (
            <article key={row.rss_url} className="border-2 border-foreground/10 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {row.category || "Uncategorized"}
                  </div>
                  <h2 className="font-display text-xl leading-tight">{row.source_name}</h2>
                  <div className="mt-1 break-all text-xs text-muted-foreground">{row.rss_url}</div>
                </div>
                <span className={`border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${statusClass[row.health_status]}`}>
                  {statusLabel[row.health_status]}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Items, 24 hours" value={row.items_24h} />
                <Metric label="Items, 7 days" value={row.items_7d} />
                <Metric label="Articles, 7 days" value={row.covered_7d} />
                <Metric label="Coverage rate" value={`${row.coverage_rate_7d}%`} />
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                Latest item: {row.latest_item_at
                  ? new Date(row.latest_item_at).toLocaleString("en-US", { timeZone: "America/Chicago" })
                  : "No matching feed item has been stored"}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-2 border-foreground/10 bg-white p-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl">{value}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
