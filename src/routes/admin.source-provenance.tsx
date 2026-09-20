import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSourceProvenanceAdminSnapshot,
  mutateSourceProvenanceAdmin,
  type SourceProvenanceAdminMutation,
} from "@/lib/article-source-transparency-admin.functions";

export const Route = createFileRoute("/admin/source-provenance")({
  head: () => ({ meta: [{ title: "Source Provenance — Keep TX Red" }, { name: "robots", content: "noindex, follow" }] }),
  component: SourceProvenanceAdmin,
});

type Snapshot = Awaited<ReturnType<typeof getSourceProvenanceAdminSnapshot>>;
type Cluster = Snapshot["clusters"][number];
type Source = Cluster["sources"][number];
type Relationship = "primary" | "supporting" | "confirmation" | "background";

function adminToken() {
  return sessionStorage.getItem("ktr-admin-passcode") || (import.meta.env.VITE_ADMIN_PASSCODE as string) || "keeptxred";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", { timeZone: "America/Chicago" });
}

function reasonText(reason: unknown) {
  if (!reason) return "—";
  if (typeof reason === "string") return reason;
  try { return JSON.stringify(reason); } catch { return "—"; }
}

function SourceProvenanceAdmin() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const [note, setNote] = useState<Record<string, string>>({});
  const [mergeTarget, setMergeTarget] = useState<Record<string, string>>({});
  const [relationship, setRelationship] = useState<Record<string, Relationship>>({});
  const [family, setFamily] = useState<Record<string, string>>({});
  const [independent, setIndependent] = useState<Record<string, boolean>>({});

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setSnapshot(await getSourceProvenanceAdminSnapshot({ data: { token: adminToken() } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load source provenance");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const clusters = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (snapshot?.clusters ?? []).filter((cluster: Cluster) => {
      if (status !== "ALL" && cluster.status !== status) return false;
      if (!needle) return true;
      return [cluster.canonical_headline, cluster.published_slug, cluster.status, ...cluster.sources.map((source: Source) => `${source.source_name ?? ""} ${source.source_family ?? ""} ${source.headline ?? ""}`)]
        .join(" ").toLowerCase().includes(needle);
    });
  }, [snapshot, query, status]);

  async function mutate(key: string, input: SourceProvenanceAdminMutation, success: string) {
    setWorking(key);
    setError(null);
    setMessage(null);
    try {
      await mutateSourceProvenanceAdmin({ data: input });
      setMessage(success);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Provenance update failed");
    } finally {
      setWorking(null);
    }
  }

  async function sync(cluster: Cluster) {
    await mutate(`sync:${cluster.id}`, {
      action: "SYNC_ARTICLE_SOURCES",
      token: adminToken(),
      clusterId: cluster.id,
      note: note[cluster.id] ?? "",
    }, "Article source list synchronized from the durable provenance ledger.");
  }

  async function merge(cluster: Cluster) {
    const targetClusterId = mergeTarget[cluster.id];
    if (!targetClusterId) return setError("Choose a target cluster first.");
    const target = snapshot?.clusters.find((item: Cluster) => item.id === targetClusterId);
    const prompt = `Merge “${cluster.canonical_headline}” into “${target?.canonical_headline ?? targetClusterId}”? This moves every source to the target cluster and archives the source cluster.`;
    if (typeof window !== "undefined" && !window.confirm(prompt)) return;
    await mutate(`merge:${cluster.id}`, {
      action: "MERGE_CLUSTER",
      token: adminToken(),
      clusterId: cluster.id,
      targetClusterId,
      note: note[cluster.id] ?? "",
    }, "Clusters merged and provenance synchronized without creating a new article.");
  }

  async function split(cluster: Cluster, source: Source) {
    if (typeof window !== "undefined" && !window.confirm(`Split “${source.headline}” into a new collecting cluster?`)) return;
    await mutate(`split:${source.id}`, {
      action: "SPLIT_SOURCE",
      token: adminToken(),
      clusterId: cluster.id,
      sourceId: source.id,
      note: note[cluster.id] ?? "",
    }, "Source split into a new collecting cluster and the published article provenance was resynchronized.");
  }

  async function saveRelationship(cluster: Cluster, source: Source) {
    await mutate(`relationship:${source.id}`, {
      action: "SET_RELATIONSHIP",
      token: adminToken(),
      clusterId: cluster.id,
      sourceId: source.id,
      relationshipType: relationship[source.id] ?? source.relationship_type as Relationship,
      note: note[cluster.id] ?? "",
    }, "Source relationship updated and article provenance synchronized.");
  }

  async function saveLineage(cluster: Cluster, source: Source) {
    await mutate(`lineage:${source.id}`, {
      action: "SET_LINEAGE",
      token: adminToken(),
      clusterId: cluster.id,
      sourceId: source.id,
      sourceFamily: (family[source.id] ?? source.source_family ?? source.source_name ?? "").trim(),
      isIndependent: independent[source.id] ?? source.is_independent_source,
      note: note[cluster.id] ?? "",
    }, "Source lineage corrected and independent-source counts recalculated.");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <section className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">★ Phase 9 · guarded provenance controls</div>
              <h1 className="mt-2 font-display text-3xl md:text-5xl">Source & Cluster Management</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/80">Correct false matches without generating another story. Mutations run transactionally, recalculate durable source counts, update feed ownership, synchronize the existing article source list, and write an audit record.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild><Link to="/admin/newsroom">← Newsroom</Link></Button>
              <Button variant="outline" onClick={() => void load()} disabled={loading}>Refresh</Button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-7 px-4 py-8">
        {error ? <div role="alert" className="border-2 border-destructive bg-destructive/5 p-4 text-sm text-destructive">{error}</div> : null}
        {message ? <div role="status" className="border-2 border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">{message}</div> : null}

        <section className="border-2 border-foreground/10 bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Durable event clusters</div>
              <p className="mt-1 text-sm text-muted-foreground">{loading ? "Loading…" : `${clusters.length} of ${snapshot?.clusters.length ?? 0} recent active clusters`}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select className="border bg-white px-3 py-2 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
                {["ALL", "collecting", "ready", "synthesized", "published"].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <Input className="w-72 bg-white" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search headline, slug, source…" />
            </div>
          </div>
        </section>

        <div className="space-y-4">
          {clusters.map((cluster: Cluster) => {
            const open = expanded === cluster.id;
            const single = cluster.independent_source_count <= 1;
            const targets = (snapshot?.clusters ?? []).filter((item: Cluster) => item.id !== cluster.id);
            return (
              <article key={cluster.id} className="border-2 border-foreground/10 bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-primary">{cluster.status}</span>
                      <span>{cluster.source_count} sources</span>
                      <span>{cluster.independent_source_count} independent</span>
                      <span>{cluster.primaryRecordCount} primary records</span>
                      {single ? <span className="text-amber-700">single-source</span> : null}
                    </div>
                    <h2 className="mt-2 font-display text-xl leading-tight">{cluster.canonical_headline}</h2>
                    {cluster.published_slug ? <div className="mt-1 break-all text-xs text-muted-foreground">/news/{cluster.published_slug}</div> : null}
                    <div className="mt-1 text-xs text-muted-foreground">First {formatDate(cluster.first_seen_at)} · Last source {formatDate(cluster.last_seen_at)}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cluster.published_slug ? <Button size="sm" variant="outline" asChild><a href={`/news/${cluster.published_slug}`} target="_blank" rel="noreferrer">Open article ↗</a></Button> : null}
                    {cluster.published_article_id ? <Button size="sm" variant="outline" disabled={working === `sync:${cluster.id}`} onClick={() => void sync(cluster)}>Sync article sources</Button> : null}
                    <Button size="sm" variant="outline" onClick={() => setExpanded(open ? null : cluster.id)}>{open ? "Hide controls" : "Manage cluster"}</Button>
                  </div>
                </div>

                {open ? (
                  <div className="mt-5 space-y-5 border-t pt-5">
                    <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
                      <div><strong className="text-foreground">Cluster ID:</strong> {cluster.id}</div>
                      <div><strong className="text-foreground">Cluster key:</strong> {cluster.cluster_key}</div>
                      <div><strong className="text-foreground">Match score:</strong> {cluster.match_score ?? "—"}</div>
                    </div>

                    <div className="grid gap-3 border bg-muted/20 p-4 lg:grid-cols-[1fr_auto]">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Merge this cluster into another</div>
                        <select className="mt-2 w-full border bg-white px-3 py-2 text-sm" value={mergeTarget[cluster.id] ?? ""} onChange={(event) => setMergeTarget((current) => ({ ...current, [cluster.id]: event.target.value }))}>
                          <option value="">Choose target cluster…</option>
                          {targets.map((target: Cluster) => <option key={target.id} value={target.id}>{target.status} · {target.canonical_headline.slice(0, 100)}</option>)}
                        </select>
                        <p className="mt-2 text-[11px] text-muted-foreground">Safety rule: clusters tied to different published articles cannot be merged here. A published cluster must be the target.</p>
                      </div>
                      <Button className="self-end" variant="destructive" disabled={!mergeTarget[cluster.id] || working === `merge:${cluster.id}`} onClick={() => void merge(cluster)}>Merge & archive source</Button>
                    </div>

                    <Input value={note[cluster.id] ?? ""} onChange={(event) => setNote((current) => ({ ...current, [cluster.id]: event.target.value }))} placeholder="Optional audit note for changes to this cluster" />

                    <div className="space-y-3">
                      {cluster.sources.map((source: Source) => {
                        const currentRelationship = relationship[source.id] ?? source.relationship_type as Relationship;
                        const currentFamily = family[source.id] ?? source.source_family ?? source.source_name ?? "";
                        const currentIndependent = independent[source.id] ?? source.is_independent_source;
                        return (
                          <div key={source.id} className="border-l-2 border-primary/30 bg-muted/20 p-4 pl-5 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold">{source.source_name || source.source_family || "Unknown source"}</span>
                              {source.is_primary_record ? <span className="rounded-full border border-primary/30 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Primary record</span> : null}
                              <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">{source.is_independent_source ? "Independent" : "Same lineage"}</span>
                            </div>
                            {source.headline ? <div className="mt-1 font-medium">{source.headline}</div> : null}
                            <div className="mt-1 text-xs text-muted-foreground">Family: {source.source_family || "—"} · Match: {source.match_score ?? "—"} · Published: {formatDate(source.published_at)}</div>
                            <div className="mt-1 text-xs text-muted-foreground"><strong>Why clustered:</strong> {reasonText(source.match_reason)}</div>
                            {source.canonical_url || source.source_url ? <a className="mt-1 block break-all text-xs text-primary hover:underline" href={source.canonical_url || source.source_url} target="_blank" rel="noreferrer">Open source ↗</a> : null}

                            <div className="mt-4 grid gap-3 xl:grid-cols-[0.8fr_auto_1.2fr_auto_auto] xl:items-end">
                              <label className="text-xs">
                                <span className="mb-1 block font-semibold">Relationship</span>
                                <select className="w-full border bg-white px-2 py-2" value={currentRelationship} onChange={(event) => setRelationship((current) => ({ ...current, [source.id]: event.target.value as Relationship }))}>
                                  {(["primary", "supporting", "confirmation", "background"] as Relationship[]).map((value) => <option key={value}>{value}</option>)}
                                </select>
                              </label>
                              <Button size="sm" variant="outline" disabled={working === `relationship:${source.id}`} onClick={() => void saveRelationship(cluster, source)}>Save role</Button>
                              <label className="text-xs">
                                <span className="mb-1 block font-semibold">Source family / lineage</span>
                                <Input value={currentFamily} onChange={(event) => setFamily((current) => ({ ...current, [source.id]: event.target.value }))} />
                              </label>
                              <label className="flex h-9 items-center gap-2 text-xs font-semibold">
                                <input type="checkbox" checked={currentIndependent} onChange={(event) => setIndependent((current) => ({ ...current, [source.id]: event.target.checked }))} /> Independent
                              </label>
                              <Button size="sm" variant="outline" disabled={working === `lineage:${source.id}`} onClick={() => void saveLineage(cluster, source)}>Save lineage</Button>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button size="sm" variant="destructive" disabled={cluster.sources.length <= 1 || working === `split:${source.id}`} onClick={() => void split(cluster, source)}>Split into new cluster</Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
          {!loading && clusters.length === 0 ? <div className="border bg-white p-8 text-center text-sm text-muted-foreground">No active provenance rows match these filters.</div> : null}
        </div>

        <section className="border-2 border-foreground/10 bg-white p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Immutable action history</div>
          <h2 className="mt-1 font-display text-2xl">Recent provenance corrections</h2>
          <div className="mt-4 divide-y">
            {(snapshot?.audit ?? []).map((row: any) => (
              <div key={row.id} className="py-3 text-sm">
                <div className="font-semibold">{row.action}</div>
                <div className="mt-1 break-all text-xs text-muted-foreground">Cluster {row.source_cluster_id ?? "—"}{row.target_cluster_id ? ` → ${row.target_cluster_id}` : ""}{row.source_row_id ? ` · source ${row.source_row_id}` : ""}</div>
                {row.note ? <div className="mt-1 text-xs">{row.note}</div> : null}
                <div className="mt-1 text-[11px] text-muted-foreground">{row.actor} · {formatDate(row.created_at)}</div>
              </div>
            ))}
            {!loading && (snapshot?.audit.length ?? 0) === 0 ? <div className="py-6 text-sm text-muted-foreground">No Phase 9 provenance corrections have been recorded yet.</div> : null}
          </div>
        </section>
      </main>
    </div>
  );
}