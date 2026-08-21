import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getContentSourceDiagnosticsFn,
  type SourceDiagnostics,
  type SourceDiagnosticRow,
} from "@/services/contentSourceDiagnostics.functions";

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

function statusLabel(row: SourceDiagnosticRow): string {
  if (row.health_status === "no_rss") return "No RSS configured";
  if (row.health_status === "never_seen") return "Feed configured · no rows seen";
  if (row.health_status === "stale") return "Stale";
  if (row.health_status === "quiet") return "Quiet";
  if (row.health_status === "healthy") return "Healthy";
  return row.health_status;
}

function statusClass(status: string): string {
  if (status === "healthy") return "text-emerald-700";
  if (status === "quiet") return "text-amber-700";
  if (status === "stale" || status === "never_seen") return "text-red-700";
  return "text-muted-foreground";
}

export function SourceHealthDiagnostics() {
  const [data, setData] = useState<SourceDiagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getContentSourceDiagnosticsFn({ data: { token: getAdminToken() } });
      if (!res.ok) throw new Error(res.error);
      setData(res.diagnostics);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load source diagnostics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleRows = useMemo(() => {
    if (!data) return [];
    return showAll ? data.rows : data.rows.slice(0, 25);
  }, [data, showAll]);

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Source Library Diagnostics</h2>
          <p className="text-xs text-muted-foreground">
            Shows which enabled sources are actually feed-configured and whether they contributed rows in the last 7 days.
          </p>
        </div>
        <button type="button" onClick={() => void load()} className="text-[11px] underline text-muted-foreground">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-muted-foreground">Loading…</div>
      ) : error ? (
        <div className="mt-4 text-sm text-destructive">{error}</div>
      ) : data ? (
        <>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            <Metric label="Enabled" value={data.enabled} />
            <Metric label="RSS configured" value={data.rssConfigured} />
            <Metric label="Healthy feeds" value={data.healthy} />
            <Metric label="Contributing 7d" value={data.contributing7d} />
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 pr-3">Source</th>
                  <th className="py-2 pr-3">Feed status</th>
                  <th className="py-2 pr-3 text-right">Rows 7d</th>
                  <th className="py-2 pr-3">Latest row</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.source_name} className="border-b border-border/50">
                    <td className="py-2 pr-3">
                      <div className="font-medium">{row.source_name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {row.category ?? "Uncategorized"} · {row.rss_url ? "RSS configured" : "Direct/manual only"}
                      </div>
                    </td>
                    <td className={`py-2 pr-3 text-[11px] ${statusClass(row.health_status)}`}>
                      {statusLabel(row)}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">{row.items_7d ?? "—"}</td>
                    <td className="py-2 pr-3 text-[11px] text-muted-foreground whitespace-nowrap">
                      {row.latest_item_at
                        ? new Date(row.latest_item_at).toLocaleString("en-US", { timeZone: "America/Chicago" })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.rows.length > 25 ? (
            <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
              <span>Showing {visibleRows.length} of {data.rows.length} enabled sources.</span>
              <button
                type="button"
                onClick={() => setShowAll((value) => !value)}
                className="px-3 py-1 border border-border font-bold uppercase tracking-widest text-foreground hover:bg-muted"
              >
                {showAll ? "Show first 25" : "Show all"}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border p-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-2xl mt-1">{value}</div>
    </div>
  );
}
