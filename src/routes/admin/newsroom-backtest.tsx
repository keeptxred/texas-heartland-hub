import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getNewsroomHistoricalBacktest } from "@/lib/newsroom-backtest.functions";

export const Route = createFileRoute("/admin/newsroom-backtest")({
  head: () => ({
    meta: [
      { title: "Newsroom Historical Backtest — Keep TX Red" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: NewsroomBacktestPage,
});

type BacktestSnapshot = Awaited<ReturnType<typeof getNewsroomHistoricalBacktest>>;

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

function NewsroomBacktestPage() {
  const [days, setDays] = useState(30);
  const [snapshot, setSnapshot] = useState<BacktestSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pillar, setPillar] = useState("ALL");

  async function load(windowDays = days) {
    setLoading(true);
    setError(null);
    try {
      const result = await getNewsroomHistoricalBacktest({
        data: { token: adminToken(), days: windowDays },
      });
      setSnapshot(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Historical backtest failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(30);
  }, []);

  const result = snapshot?.result;
  const pillars = useMemo(
    () => ["ALL", ...Object.keys(result?.pillarCounts ?? {}).sort()],
    [result],
  );
  const rows = useMemo(
    () => (result?.rows ?? []).filter((row) => pillar === "ALL" || row.pillar === pillar),
    [result, pillar],
  );

  return (
    <div className="min-h-screen bg-muted/20">
      <section className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">★ Phase 12 · zero AI</div>
              <h1 className="mt-2 font-display text-3xl md:text-5xl">Historical Newsroom Backtest</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/80">
                Replays the deterministic newsroom decision engine against historical candidates and observed publication outcomes.
                This surface is read-only: no AI calls, no budget reservations, no publishing, and no database writes.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild><Link to="/admin/newsroom">← Control Center</Link></Button>
              <Button variant="outline" onClick={() => void load()} disabled={loading}>Refresh</Button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        {error ? <div role="alert" className="border-2 border-destructive bg-destructive/5 p-4 text-sm text-destructive">{error}</div> : null}

        <section className="flex flex-wrap items-end gap-3 border bg-white p-4">
          <label className="text-sm font-semibold">
            Historical window
            <select
              className="ml-2 border bg-white px-3 py-2"
              value={days}
              onChange={(event) => {
                const next = Number(event.target.value);
                setDays(next);
                void load(next);
              }}
            >
              {[7, 14, 30, 60, 90, 120].map((value) => <option key={value} value={value}>{value} days</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Pillar
            <select className="ml-2 border bg-white px-3 py-2" value={pillar} onChange={(event) => setPillar(event.target.value)}>
              {pillars.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <div className="text-xs text-muted-foreground">Generated {formatDate(snapshot?.generatedAt)} · AI calls {snapshot?.aiCalls ?? 0} · writes {snapshot?.writes ?? 0}</div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Candidates replayed" value={result?.totalCandidates ?? 0} sub={`${snapshot?.days ?? days}-day window`} />
          <Metric label="Actually published" value={result?.publishedCandidates ?? 0} sub="historical observed outcome" />
          <Metric label="Published captured" value={`${result?.captureRate ?? 0}%`} sub={`${result?.publishedMissed ?? 0} published stories missed by replay`} tone={(result?.publishedMissed ?? 0) > 0 ? "warn" : "ok"} />
          <Metric label="Advance yield" value={`${result?.yieldRate ?? 0}%`} sub={`${result?.replayAdvanced ?? 0} would advance`} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="SKIP" value={result?.decisionCounts.SKIP ?? 0} sub="replay decisions" />
          <Metric label="SINGLE" value={result?.decisionCounts.SINGLE ?? 0} sub="replay decisions" />
          <Metric label="MERGE" value={result?.decisionCounts.MERGE ?? 0} sub="replay decisions" />
          <Metric label="SYNTHESIS" value={result?.decisionCounts.SYNTHESIS ?? 0} sub="replay decisions" />
          <Metric label="Decision agreement" value={result?.historicalAgreementRate == null ? "—" : `${result.historicalAgreementRate}%`} sub="vs stored historical format" />
        </section>

        <section className="border-2 border-foreground/10 bg-white p-5">
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Counterfactual policy test</div>
            <h2 className="font-display text-2xl">Standalone Score Threshold Sweep</h2>
            <p className="mt-1 text-sm text-muted-foreground">Compare the current 45-point cutoff with stricter or looser thresholds using actual historical publication outcomes.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="py-2 pr-4">Threshold</th><th className="py-2 pr-4">Advance</th><th className="py-2 pr-4">Skip</th><th className="py-2 pr-4">Published captured</th><th className="py-2 pr-4">Published missed</th><th className="py-2 pr-4">Capture</th><th className="py-2">Yield</th></tr>
              </thead>
              <tbody className="divide-y">
                {(result?.thresholdSweep ?? []).map((row) => (
                  <tr key={row.threshold} className={row.threshold === 45 ? "font-semibold" : ""}>
                    <td className="py-3 pr-4">{row.threshold}{row.threshold === 45 ? " · current" : ""}</td>
                    <td className="py-3 pr-4">{row.advanced}</td><td className="py-3 pr-4">{row.skipped}</td><td className="py-3 pr-4">{row.publishedCaptured}</td><td className="py-3 pr-4">{row.publishedMissed}</td><td className="py-3 pr-4">{row.captureRate}%</td><td className="py-3">{row.yieldRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-2 border-foreground/10 bg-white p-5">
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Replay ledger</div>
            <h2 className="font-display text-2xl">Historical Candidates</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sorted by editorial score. Publication status is observational only; this page cannot publish.</p>
          </div>
          {loading ? <div className="py-8 text-sm text-muted-foreground">Running deterministic replay…</div> : null}
          {!loading && rows.length === 0 ? <div className="py-8 text-sm text-muted-foreground">No historical candidates in this window.</div> : null}
          {!loading ? (
            <div className="divide-y">
              {rows.slice(0, 250).map((row) => (
                <article key={row.candidateId} className="grid gap-2 py-4 lg:grid-cols-[90px_1fr_150px_140px] lg:items-start">
                  <div className="font-display text-2xl text-primary">{row.editorialScore}</div>
                  <div>
                    <div className="font-semibold leading-tight">{row.subject}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{row.pillar} · {row.sourceCount} sources · {row.primarySourceCount} primary · {row.trendSignalCount} trend signals</div>
                    <div className="mt-1 text-xs text-muted-foreground">{row.replayReason}</div>
                  </div>
                  <div className="text-sm"><div className="font-semibold">Replay: {row.replayDecision}</div><div className="text-xs text-muted-foreground">Historical: {row.historicalFormat ?? "—"}</div></div>
                  <div className={row.published ? "text-sm font-semibold text-emerald-700" : "text-sm text-muted-foreground"}>{row.published ? `Published ${formatDate(row.publishedAt)}` : "Not published"}</div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, sub, tone = "default" }: { label: string; value: string | number; sub: string; tone?: "default" | "ok" | "warn" }) {
  const toneClass = tone === "ok" ? "border-emerald-300" : tone === "warn" ? "border-amber-300" : "border-foreground/10";
  return <div className={`border-2 bg-white p-4 ${toneClass}`}><div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div><div className="mt-1 font-display text-3xl">{value}</div><div className="mt-1 text-xs text-muted-foreground">{sub}</div></div>;
}
