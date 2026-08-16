import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getNewsroomAdminSnapshot,
  updateNewsroomEditorialState,
} from "@/lib/newsroom-admin.functions";

export const Route = createFileRoute("/admin/newsroom")({
  head: () => ({
    meta: [
      { title: "Newsroom Control Center — Keep TX Red" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: NewsroomControlCenter,
});

type EditorialAction = "SELECT" | "HOLD" | "REJECT" | "RELEASE";
type Snapshot = Awaited<ReturnType<typeof getNewsroomAdminSnapshot>>;

type QueueRow = Snapshot["queue"][number];

function adminToken() {
  return (
    sessionStorage.getItem("ktr-admin-passcode") ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    "keeptxred"
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", { timeZone: "America/Chicago" });
}

function NewsroomControlCenter() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("PENDING");
  const [format, setFormat] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [working, setWorking] = useState<Record<string, boolean>>({});
  const [reason, setReason] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await getNewsroomAdminSnapshot({ data: { token: adminToken() } });
      setSnapshot(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load newsroom control center");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const rows = useMemo(() => {
    if (!snapshot) return [];
    return snapshot.queue.filter((row) => {
      if (filter !== "ALL" && row.status !== filter) return false;
      if (format !== "ALL" && row.recommended_format !== format) return false;
      return true;
    });
  }, [snapshot, filter, format]);

  async function act(row: QueueRow, action: EditorialAction) {
    setWorking((current) => ({ ...current, [row.id]: true }));
    setError(null);
    try {
      await updateNewsroomEditorialState({
        data: {
          token: adminToken(),
          candidateId: row.id,
          action,
          reason: reason[row.id] ?? "",
        },
      });
      setReason((current) => ({ ...current, [row.id]: "" }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Editorial action failed");
    } finally {
      setWorking((current) => ({ ...current, [row.id]: false }));
    }
  }

  const budget = snapshot?.budget;
  const cronFailures = snapshot?.cronHealth.filter((job) => !job.active || job.status !== "succeeded") ?? [];

  return (
    <div className="min-h-screen bg-muted/20">
      <section className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">★ Internal newsroom</div>
              <h1 className="mt-2 font-display text-3xl md:text-5xl">Editorial Control Center</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/80">
                Zero-AI review surface for story clusters, scoring, evidence, budgets, drafts and Daily Brief state.
                Editorial actions here never invoke generation.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild><Link to="/admin">← Dashboard</Link></Button>
              <Button variant="outline" onClick={() => void load()} disabled={loading}>Refresh</Button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        {error ? (
          <div role="alert" className="border-2 border-destructive bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-4">
          <Metric label="Normal AI" value={budget ? `${budget.normal_used}/${budget.normal_limit}` : "—"} sub={budget ? `${budget.normal_reserved} reserved` : "No row"} />
          <Metric label="Breaking AI" value={budget ? `${budget.breaking_used}/${budget.breaking_limit}` : "—"} sub={budget ? `${budget.breaking_reserved} reserved` : "No row"} />
          <Metric label="Daily Brief" value={budget ? `${budget.briefing_used}/${budget.briefing_limit}` : "—"} sub={budget ? `${budget.briefing_reserved ?? 0} reserved` : "No row"} />
          <Metric label="Cron health" value={loading ? "…" : cronFailures.length === 0 ? "Healthy" : `${cronFailures.length} issue${cronFailures.length === 1 ? "" : "s"}`} sub={`${snapshot?.cronHealth.length ?? 0} KeepTXRed jobs`} tone={cronFailures.length ? "warn" : "ok"} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(["PENDING", "SELECTED", "HELD", "REJECTED", "PUBLISHED"] as const).map((status) => (
            <Metric key={status} label={status} value={snapshot?.statusCounts[status] ?? 0} sub="top 100 candidates" />
          ))}
        </section>

        <section className="border-2 border-foreground/10 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Editorial queue</div>
              <h2 className="font-display text-2xl">Story Candidates</h2>
              <p className="mt-1 text-sm text-muted-foreground">Ranked globally by editorial score. No pillar quotas are applied.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <select className="border bg-white px-3 py-2" value={filter} onChange={(event) => setFilter(event.target.value)}>
                {['ALL','PENDING','SELECTED','HELD','REJECTED','PUBLISHED'].map((value) => <option key={value}>{value}</option>)}
              </select>
              <select className="border bg-white px-3 py-2" value={format} onChange={(event) => setFormat(event.target.value)}>
                {['ALL','SINGLE','MERGE','SYNTHESIS','SKIP','BRIEF_ITEM'].map((value) => <option key={value}>{value}</option>)}
              </select>
            </div>
          </div>

          {loading ? <div className="py-8 text-sm text-muted-foreground">Loading newsroom state…</div> : null}
          {!loading && rows.length === 0 ? <div className="py-8 text-sm text-muted-foreground">No candidates match these filters.</div> : null}
          {!loading ? (
            <div className="divide-y divide-border">
              {rows.map((row) => {
                const cluster = row.cluster;
                const packet = row.packet?.packet_json as any;
                const sources = Array.isArray(packet?.sources) ? packet.sources : [];
                const isExpanded = expanded === row.id;
                const disabled = working[row.id] || row.status === "PUBLISHED";
                return (
                  <article key={row.id} className="py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-primary">Score {row.editorial_score}</span>
                          <Badge>{row.recommended_format}</Badge>
                          <Badge>{row.status}</Badge>
                          <span className="text-muted-foreground">{cluster?.pillar_slug ?? "unrouted"}</span>
                          {cluster ? <span className="text-muted-foreground">{cluster.source_count} sources · {cluster.primary_source_count} primary</span> : null}
                        </div>
                        <h3 className="mt-2 font-display text-xl leading-tight">{cluster?.canonical_headline || cluster?.canonical_subject || row.cluster_id}</h3>
                        <div className="mt-1 text-xs text-muted-foreground">First seen {formatDate(cluster?.first_seen_at)} · Updated {formatDate(row.updated_at)}</div>
                        {row.selection_reason ? <p className="mt-2 text-xs text-emerald-800">Selection: {row.selection_reason}</p> : null}
                        {row.rejection_reason ? <p className="mt-2 text-xs text-destructive">Rejection: {row.rejection_reason}</p> : null}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setExpanded(isExpanded ? null : row.id)}>{isExpanded ? "Hide evidence" : "Review evidence"}</Button>
                    </div>

                    {isExpanded ? (
                      <div className="mt-4 grid gap-4 border bg-muted/20 p-4 lg:grid-cols-[1.3fr_0.7fr]">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Source evidence</div>
                          {sources.length ? (
                            <ul className="mt-2 space-y-3">
                              {sources.map((source: any, index: number) => (
                                <li key={`${source.url ?? index}`} className="border-l-2 border-primary/30 pl-3 text-sm">
                                  <div className="font-semibold">{source.title ?? "Untitled source"}</div>
                                  <div className="text-xs text-muted-foreground">{source.source ?? "Unknown source"} {source.isPrimarySource ? "· PRIMARY" : ""}</div>
                                  {source.description ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{source.description}</p> : null}
                                  {source.url ? <a className="mt-1 block break-all text-xs text-primary hover:underline" href={source.url} target="_blank" rel="noreferrer">Open source ↗</a> : null}
                                </li>
                              ))}
                            </ul>
                          ) : <p className="mt-2 text-sm text-muted-foreground">No research packet is available for this candidate yet.</p>}
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Editorial action</div>
                          <Input className="mt-2" placeholder="Optional reason / note" value={reason[row.id] ?? ""} onChange={(event) => setReason((current) => ({ ...current, [row.id]: event.target.value }))} />
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <Button disabled={disabled} onClick={() => void act(row, "SELECT")}>Select</Button>
                            <Button disabled={disabled} variant="outline" onClick={() => void act(row, "HOLD")}>Hold</Button>
                            <Button disabled={disabled} variant="destructive" onClick={() => void act(row, "REJECT")}>Reject</Button>
                            <Button disabled={disabled} variant="outline" onClick={() => void act(row, "RELEASE")}>Release</Button>
                          </div>
                          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">These controls only change candidate/cluster editorial state and write an audit entry. They do not call AI or publish content.</p>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Generation Draft Ledger" eyebrow="Phase 9 shadow review">
            <CompactRows rows={snapshot?.drafts ?? []} render={(row: any) => (
              <>
                <div className="font-semibold">{row.status} · {row.mode}</div>
                <div className="text-xs text-muted-foreground">{row.main_word_count} words · {row.provider}/{row.model} · {row.provider_attempts} attempt(s)</div>
                {row.validation_reasons?.length ? <div className="mt-1 text-xs text-destructive">{row.validation_reasons.join(" · ")}</div> : null}
                <div className="mt-1 text-[11px] text-muted-foreground">{formatDate(row.created_at)}</div>
              </>
            )} empty="No newsroom generation drafts yet." />
          </Panel>
          <Panel title="Texas Daily Brief Ledger" eyebrow="Phase 10">
            <CompactRows rows={snapshot?.briefs ?? []} render={(row: any) => (
              <>
                <div className="font-semibold">{row.brief_date} · {row.status} · {row.mode}</div>
                <div className="text-xs text-muted-foreground">{row.cluster_ids?.length ?? 0} developments · {row.main_word_count} words · {row.provider}/{row.model}</div>
                {row.validation_reasons?.length ? <div className="mt-1 text-xs text-destructive">{row.validation_reasons.join(" · ")}</div> : null}
              </>
            )} empty="No Daily Brief generations yet." />
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Pipeline Cron Health" eyebrow="Schedules remain enabled">
            <CompactRows rows={snapshot?.cronHealth ?? []} render={(job: any) => (
              <>
                <div className="flex items-center justify-between gap-3"><span className="font-semibold">{job.jobname}</span><span className={job.active && job.status === "succeeded" ? "text-emerald-700" : "text-destructive"}>{job.active ? job.status ?? "no run" : "disabled"}</span></div>
                <div className="text-xs text-muted-foreground">{job.schedule} · last run {formatDate(job.start_time)}</div>
              </>
            )} empty="No KeepTXRed cron health rows returned." />
          </Panel>
          <Panel title="Editorial Action Audit" eyebrow="Phase 11">
            <CompactRows rows={snapshot?.actions ?? []} render={(row: any) => (
              <>
                <div className="font-semibold">{row.action}: {row.previous_candidate_status ?? "—"} → {row.next_candidate_status}</div>
                {row.reason ? <div className="text-xs text-muted-foreground">{row.reason}</div> : null}
                <div className="text-[11px] text-muted-foreground">{formatDate(row.created_at)}</div>
              </>
            )} empty="No editorial actions recorded yet." />
          </Panel>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, sub, tone = "default" }: { label: string; value: string | number; sub: string; tone?: "default" | "ok" | "warn" }) {
  const toneClass = tone === "ok" ? "border-emerald-300 bg-emerald-50" : tone === "warn" ? "border-amber-300 bg-amber-50" : "border-foreground/10 bg-white";
  return <div className={`border-2 p-4 ${toneClass}`}><div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div><div className="mt-1 font-display text-3xl">{value}</div><div className="mt-1 text-xs text-muted-foreground">{sub}</div></div>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="border border-foreground/20 bg-muted/40 px-2 py-0.5 text-foreground">{children}</span>;
}

function Panel({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return <div className="border-2 border-foreground/10 bg-white p-5"><div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</div><h2 className="font-display text-2xl">{title}</h2><div className="mt-4">{children}</div></div>;
}

function CompactRows({ rows, render, empty }: { rows: any[]; render: (row: any) => React.ReactNode; empty: string }) {
  if (!rows.length) return <div className="text-sm text-muted-foreground">{empty}</div>;
  return <div className="max-h-[420px] divide-y divide-border overflow-auto">{rows.map((row, index) => <div key={row.id ?? row.jobname ?? index} className="py-3 text-sm">{render(row)}</div>)}</div>;
}
