import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteQueueEntry,
  listQueueEntries,
  setQueueStatus,
  type QueueEntry,
  type QueueStatus,
} from "@/services/publishingQueue";

const TABS: QueueStatus[] = ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"];

export function PublishingQueuePanel({
  onOpenPackage,
}: {
  onOpenPackage?: (packageId: string) => void;
}) {
  const [rows, setRows] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<QueueStatus>("DRAFT");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      setRows(await listQueueEntries());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const listener = () => void load();
    window.addEventListener("ktr-publishing-queue-updated", listener);
    void load();
    return () => window.removeEventListener("ktr-publishing-queue-updated", listener);
  }, [load]);

  async function change(id: string, status: QueueStatus) {
    setBusyId(id);
    try {
      await setQueueStatus(id, status);
      setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this queue entry?")) return;
    setBusyId(id);
    try {
      await deleteQueueEntry(id);
      setRows((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(() => rows.filter((r) => r.status === tab), [rows, tab]);
  const counts = useMemo(() => {
    const c: Record<QueueStatus, number> = { DRAFT: 0, READY: 0, PUBLISHED: 0, ARCHIVED: 0 };
    for (const r of rows) c[r.status] += 1;
    return c;
  }, [rows]);

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-display text-xl">Publishing Queue</h2>
          <p className="text-xs text-muted-foreground">
            Approved content packages staged for publishing. No external calls yet.
          </p>
        </div>
        <button type="button" onClick={load} className="text-[11px] underline text-muted-foreground">
          Refresh
        </button>
      </div>

      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`text-[11px] uppercase tracking-widest px-3 py-2 border-b-2 ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {err ? <div className="text-xs text-destructive mt-3">{err}</div> : null}
      {loading ? (
        <div className="text-sm text-muted-foreground mt-3">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground mt-3">Nothing in {tab.toLowerCase()}.</div>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {filtered.map((r) => (
            <li key={r.id} className="py-3 flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {r.platform}
                  {r.category ? <span className="text-muted-foreground"> · {r.category}</span> : null}
                </div>
                <div className="text-sm font-medium leading-snug break-words">
                  {r.source_title ?? "(untitled package)"}
                </div>
                {r.notes ? (
                  <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">{r.notes}</div>
                ) : null}
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Created{" "}
                  {new Date(r.created_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                  {r.published_time ? (
                    <>
                      {" · Published "}
                      {new Date(r.published_time).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                    </>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-end text-[11px] shrink-0">
                {onOpenPackage ? (
                  <button
                    type="button"
                    onClick={() => onOpenPackage(r.content_package_id)}
                    className="underline text-primary"
                  >
                    Open Package
                  </button>
                ) : null}
                {r.status !== "READY" && r.status !== "PUBLISHED" ? (
                  <button
                    type="button"
                    onClick={() => change(r.id, "READY")}
                    disabled={busyId === r.id}
                    className="underline text-emerald-700 disabled:opacity-50"
                  >
                    Move to Ready
                  </button>
                ) : null}
                {r.status !== "PUBLISHED" ? (
                  <button
                    type="button"
                    onClick={() => change(r.id, "PUBLISHED")}
                    disabled={busyId === r.id}
                    className="underline text-primary disabled:opacity-50"
                  >
                    Mark Published
                  </button>
                ) : null}
                {r.status !== "ARCHIVED" ? (
                  <button
                    type="button"
                    onClick={() => change(r.id, "ARCHIVED")}
                    disabled={busyId === r.id}
                    className="underline text-muted-foreground disabled:opacity-50"
                  >
                    Archive
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => change(r.id, "DRAFT")}
                    disabled={busyId === r.id}
                    className="underline text-muted-foreground disabled:opacity-50"
                  >
                    Restore
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  disabled={busyId === r.id}
                  className="underline text-destructive disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}