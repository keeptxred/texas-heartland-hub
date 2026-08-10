import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Activity, Bot, GitMerge, Layers3, ShieldAlert, Sparkles } from "lucide-react";

type Metrics = {
  feedRows: number;
  linkedFeedRows: number;
  autoPublishEligibleRows: number;
  postRewriteReviewBlocks: number;
  clusteredRows: number;
  uniqueClusters: number;
  confirmations: number;
  followUps: number;
  multiSourceSyntheses: number;
  sourceRelationshipsAdded: number;
  estimatedRewriteCallsAvoided: number;
  averageSourcesPerCluster: number;
};

type MetricsResponse = {
  ok: boolean;
  windowHours?: number;
  generatedAt?: string;
  metrics?: Metrics;
  error?: string;
};

export const Route = createFileRoute("/admin/newsroom-metrics")({
  head: () => ({
    meta: [
      { title: "Newsroom Metrics — Keep TX Red" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: NewsroomMetricsPage,
});

const WINDOWS = [24, 72, 168] as const;

function NewsroomMetricsPage() {
  const [hours, setHours] = useState<number>(72);
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (selectedHours: number) => {
    setLoading(true);
    try {
      const passcode = sessionStorage.getItem("ktr-admin-passcode") ?? "";
      const response = await fetch(`/api/admin/newsroom-metrics?hours=${selectedHours}`, {
        headers: { "x-admin-passcode": passcode },
      });
      const body = (await response.json()) as MetricsResponse;
      setData(body);
    } catch (error) {
      setData({ ok: false, error: error instanceof Error ? error.message : "Metrics request failed" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(hours);
  }, [hours, load]);

  const metrics = data?.metrics;

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">★ Internal newsroom</div>
              <h1 className="mt-2 font-display text-3xl leading-none md:text-5xl">Newsroom Metrics</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80">
                Multi-source coverage, developing-story reuse, review blocks, and estimated rewrite savings.
              </p>
            </div>
            <Link to="/admin" className="text-sm font-bold text-white underline underline-offset-4">← Editorial Dashboard</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {WINDOWS.map((windowHours) => (
              <button
                key={windowHours}
                type="button"
                onClick={() => setHours(windowHours)}
                className={`border px-3 py-2 text-[11px] font-bold uppercase tracking-widest ${
                  hours === windowHours ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                }`}
              >
                {windowHours === 24 ? "24 hours" : windowHours === 72 ? "3 days" : "7 days"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void load(hours)}
            disabled={loading}
            className="text-[11px] font-bold uppercase tracking-widest text-primary underline disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {!data?.ok && !loading ? (
          <div role="alert" className="border-2 border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {data?.error ?? "Unable to load newsroom metrics."}
          </div>
        ) : null}

        {loading && !metrics ? <div className="text-sm text-muted-foreground">Loading newsroom metrics…</div> : null}

        {metrics ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard icon={Layers3} label="Multi-source clusters" value={metrics.uniqueClusters} detail={`${metrics.clusteredRows} feed rows grouped`} />
              <MetricCard icon={Bot} label="Rewrite calls avoided" value={metrics.estimatedRewriteCallsAvoided} detail="Estimated vs. one rewrite per source" />
              <MetricCard icon={GitMerge} label="Source relationships" value={metrics.sourceRelationshipsAdded} detail={`${metrics.averageSourcesPerCluster.toFixed(2)} sources per cluster`} />
              <MetricCard icon={ShieldAlert} label="Post-rewrite review blocks" value={metrics.postRewriteReviewBlocks} detail="Sensitive drafts kept out of auto-publish" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <MetricCard icon={Sparkles} label="Combined syntheses" value={metrics.multiSourceSyntheses} detail="Multiple sources → one article" />
              <MetricCard icon={Activity} label="Confirmation reuses" value={metrics.confirmations} detail="Existing article reused without rewrite" />
              <MetricCard icon={Activity} label="Material follow-ups" value={metrics.followUps} detail="New development routed as follow-up" />
            </div>

            <div className="mt-6 border border-border bg-card p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Pipeline snapshot</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <SmallStat label="Feed rows scanned" value={metrics.feedRows} />
                <SmallStat label="Rows linked to articles" value={metrics.linkedFeedRows} />
                <SmallStat label="Currently auto-publish eligible" value={metrics.autoPublishEligibleRows} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Rewrite savings are intentionally conservative. Confirmation reuse counts as one avoided rewrite; multi-source synthesis counts only the extra source rewrites replaced by the single combined synthesis.
              </p>
            </div>

            {data.generatedAt ? (
              <p className="mt-3 text-[11px] text-muted-foreground">
                Updated {new Date(data.generatedAt).toLocaleString("en-US", { timeZone: "America/Chicago" })} · {data.windowHours ?? hours}-hour window
              </p>
            ) : null}
          </>
        ) : null}
      </section>
    </main>
  );
}

function MetricCard({ icon: Icon, label, value, detail }: { icon: typeof Activity; label: string; value: number; detail: string }) {
  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center gap-2 text-primary"><Icon size={16} /><span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span></div>
      <div className="mt-3 font-display text-4xl tabular-nums">{value.toLocaleString()}</div>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return <div><div className="font-display text-2xl tabular-nums">{value.toLocaleString()}</div><div className="text-xs text-muted-foreground">{label}</div></div>;
}
