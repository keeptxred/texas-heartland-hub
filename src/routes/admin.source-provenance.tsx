import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSourceProvenanceAdminSnapshot } from "@/lib/article-source-transparency-admin.functions";

export const Route = createFileRoute("/admin/source-provenance")({
  head: () => ({ meta: [{ title: "Source Provenance — Keep TX Red" }, { name: "robots", content: "noindex, follow" }] }),
  component: SourceProvenanceAdmin,
});

type Snapshot = Awaited<ReturnType<typeof getSourceProvenanceAdminSnapshot>>;
type Cluster = Snapshot["clusters"][number];

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
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

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
    if (!needle) return snapshot?.clusters ?? [];
    return (snapshot?.clusters ?? []).filter((cluster: Cluster) =>
      [cluster.canonical_headline, cluster.published_slug, ...cluster.sources.map((source: any) => `${source.source_name ?? ""} ${source.source_family ?? ""} ${source.headline ?? ""}`)]
        .join(" ").toLowerCase().includes(needle),
    );
  }, [snapshot, query]);

  return (
    <div className="min-h-screen bg-muted/20">
      <section className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">★ Read-only provenance</div>
              <h1 className="mt-2 font-display text-3xl md:text-5xl">Published Source Transparency</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/80">Inspect the durable event cluster, independent-source accounting, primary records and internal clustering rationale behind published KTR stories. Phase 8 is diagnostic only; no cluster edits are available here.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild><Link to="/admin/newsroom">← Newsroom</Link></Button>
              <Button variant="outline" onClick={() => void load()} disabled={loading}>Refresh</Button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {error ? <div role="alert" className="mb-5 border-2 border-destructive bg-destructive/5 p-4 text-sm text-destructive">{error}</div> : null}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Published clusters</div>
            <p className="mt-1 text-sm text-muted-foreground">{loading ? "Loading…" : `${clusters.length} of ${snapshot?.clusters.length ?? 0} recent published clusters`}</p>
          </div>
          <Input className="max-w-sm bg-white" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search headline, slug, source…" />
        </div>

        <div className="space-y-4">
          {clusters.map((cluster: Cluster) => {
            const open = expanded === cluster.id;
            const single = cluster.independent_source_count <= 1;
            return (
              <article key={cluster.id} className="border-2 border-foreground/10 bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-primary">{cluster.source_count} sources</span>
                      <span>{cluster.independent_source_count} independent</span>
                      <span>{cluster.primaryRecordCount} primary</span>
                      {single ? <span className="text-amber-700">single-source</span> : null}
                    </div>
                    <h2 className="mt-2 font-display text-xl leading-tight">{cluster.canonical_headline}</h2>
                    <div className="mt-1 break-all text-xs text-muted-foreground">/news/{cluster.published_slug}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Published {formatDate(cluster.published_at)} · Last source {formatDate(cluster.last_seen_at)}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild><a href={`/news/${cluster.published_slug}`} target="_blank" rel="noreferrer">Open article ↗</a></Button>
                    <Button size="sm" variant="outline" onClick={() => setExpanded(open ? null : cluster.id)}>{open ? "Hide diagnostics" : "Inspect sources"}</Button>
                  </div>
                </div>

                {open ? (
                  <div className="mt-5 space-y-3 border-t pt-4">
                    <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                      <div><strong className="text-foreground">Cluster ID:</strong> {cluster.id}</div>
                      <div><strong className="text-foreground">Cluster key:</strong> {cluster.cluster_key}</div>
                      <div><strong className="text-foreground">Cluster score:</strong> {cluster.match_score ?? "—"}</div>
                    </div>
                    {cluster.sources.map((source: any) => (
                      <div key={source.id} className="border-l-2 border-primary/30 bg-muted/20 p-3 pl-4 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{source.source_name || source.source_family || "Unknown source"}</span>
                          {source.is_primary_record ? <span className="rounded-full border border-primary/30 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Primary record</span> : null}
                          {source.is_independent_source ? <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">Independent</span> : <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">Same lineage</span>}
                          <span className="text-[10px] uppercase text-muted-foreground">{source.relationship_type}</span>
                        </div>
                        {source.headline ? <div className="mt-1 font-medium">{source.headline}</div> : null}
                        <div className="mt-1 text-xs text-muted-foreground">Family: {source.source_family || "—"} · Match: {source.match_score ?? "—"} · Published: {formatDate(source.published_at)}</div>
                        <div className="mt-1 text-xs text-muted-foreground"><strong>Why clustered:</strong> {reasonText(source.match_reason)}</div>
                        {source.canonical_url || source.source_url ? <a className="mt-1 block break-all text-xs text-primary hover:underline" href={source.canonical_url || source.source_url} target="_blank" rel="noreferrer">Open source ↗</a> : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
          {!loading && clusters.length === 0 ? <div className="border bg-white p-8 text-center text-sm text-muted-foreground">No published provenance rows match this search.</div> : null}
        </div>
      </main>
    </div>
  );
}
