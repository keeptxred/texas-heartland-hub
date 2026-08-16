import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getNewsroomShadowProduction } from "@/lib/newsroom-shadow-production.functions";

export const Route = createFileRoute("/admin/newsroom-shadow")({
  head: () => ({
    meta: [
      { title: "Newsroom Shadow Production — Keep TX Red" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: NewsroomShadowProduction,
});

type Snapshot = Awaited<ReturnType<typeof getNewsroomShadowProduction>>;
type ShadowRow = Snapshot["result"]["rows"][number];

function adminToken() {
  return sessionStorage.getItem("ktr-admin-passcode") || (import.meta.env.VITE_ADMIN_PASSCODE as string) || "keeptxred";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", { timeZone: "America/Chicago" });
}

function Metric({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="border-2 border-foreground/10 bg-white p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">{label}</div>
      <div className="mt-2 font-display text-3xl">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function NewsroomShadowProduction() {
  const [hours, setHours] = useState(48);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pillar, setPillar] = useState("ALL");

  async function load(nextHours = hours) {
    setLoading(true);
    setError(null);
    try {
      const result = await getNewsroomShadowProduction({ data: { token: adminToken(), hours: nextHours } });
      setSnapshot(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load shadow production state");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(48); }, []);

  const pillars = useMemo(() => [
    "ALL",
    ...new Set((snapshot?.result.rows ?? []).map((row: ShadowRow) => row.pillar).sort()),
  ], [snapshot]);
  const rows = (snapshot?.result.rows ?? []).filter((row: ShadowRow) => pillar === "ALL" || row.pillar === pillar);
  const result = snapshot?.result;

  function changeWindow(next: number) {
    setHours(next);
    void load(next);
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <section className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">★ Phase 13 · live shadow</div>
              <h1 className="mt-2 font-display text-3xl md:text-5xl">Newsroom Shadow Production</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/80">
                Observe the real production newsroom pipeline without publishing. This dashboard replays live decisions,
                checks research-packet coverage, previews standalone and Daily Brief selection, and audits shadow drafts.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild><Link to="/admin/newsroom">← Control Center</Link></Button>
              <Button variant="outline" asChild><Link to="/admin/newsroom-backtest">Historical Backtest</Link></Button>
              <Button variant="outline" onClick={() => void load()} disabled={loading}>Refresh</Button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        {error ? <div role="alert" className="border-2 border-destructive bg-destructive/5 p-4 text-sm text-destructive">{error}</div> : null}

        <section className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[24, 48, 72, 168].map((value) => (
              <Button key={value} size="sm" variant={hours === value ? "default" : "outline"} onClick={() => changeWindow(value)}>
                {value < 168 ? `${value}h` : "7d"}
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {snapshot ? `Generated ${formatDate(snapshot.generatedAt)} · AI ${snapshot.aiCalls} · writes ${snapshot.writes} · publishes ${snapshot.publishes}` : "Loading…"}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Metric label="Live candidates" value={result?.totalCandidates ?? "—"} sub={`${hours}h observation window`} />
          <Metric label="Advanced" value={result?.advancedCandidates ?? "—"} sub="Current replay non-SKIP" />
          <Metric label="Decision agreement" value={result ? `${result.decisionAgreementRate}%` : "—"} sub={`${result?.decisionDriftCount ?? 0} drift`} />
          <Metric label="Packet coverage" value={result ? `${result.packetCoverageRate}%` : "—"} sub="Non-SKIP candidates" />
          <Metric label="Primary-backed" value={result ? `${result.primaryBackedRate}%` : "—"} sub="Non-SKIP candidates" />
          <Metric label="Launch gate" value={result ? (result.readyForControlledLaunch ? "READY" : "HOLD") : "—"} sub="Phase 14 readiness" />
        </section>

        <section className="border-2 border-foreground/10 bg-white p-5">
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Controlled-launch gate</div>
            <h2 className="font-display text-2xl">Shadow Readiness Checks</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(result?.readiness ?? []).map((check) => (
              <div key={check.key} className={`border p-4 ${check.passed ? "border-emerald-300 bg-emerald-50/40" : "border-amber-300 bg-amber-50/50"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{check.label}</div>
                  <div className={`text-xs font-bold ${check.passed ? "text-emerald-700" : "text-amber-800"}`}>{check.passed ? "PASS" : "HOLD"}</div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{check.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <SelectionPanel title="Standalone shadow slate" subtitle="Top eight packet-backed live candidates" rows={result?.standaloneSelection ?? []} />
          <SelectionPanel title="Daily Brief shadow slate" subtitle="Next-best secondary statewide developments" rows={result?.dailyBriefSelection ?? []} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="border-2 border-foreground/10 bg-white p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Optional AI shadow evidence</div>
            <h2 className="font-display text-2xl">Draft Validation</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric label="Shadow drafts" value={result?.draftStats.total ?? 0} sub="Observation window" />
              <Metric label="Validation pass" value={result?.draftStats.total ? `${result.draftStats.validationPassRate}%` : "—"} sub={`${result?.draftStats.rejected ?? 0} rejected`} />
              <Metric label="Average words" value={result?.draftStats.averageWordCount || "—"} sub="Completed shadow drafts" />
              <Metric label="Published" value={result?.draftStats.publishedFromShadow ?? 0} sub="Must remain zero" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              This page never invokes AI. If the existing guarded Phase 9 endpoint is later run in shadow mode, its draft results appear here for validation.
            </p>
          </div>

          <div className="border-2 border-foreground/10 bg-white p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Live replay</div>
                <h2 className="font-display text-2xl">Decision Drift</h2>
              </div>
              <select className="border bg-white px-3 py-2 text-sm" value={pillar} onChange={(event) => setPillar(event.target.value)}>
                {pillars.map((value) => <option key={value}>{value}</option>)}
              </select>
            </div>
            {loading ? <div className="py-8 text-sm text-muted-foreground">Reading live newsroom state…</div> : null}
            {!loading ? (
              <div className="max-h-[620px] divide-y overflow-auto">
                {rows.map((row: ShadowRow) => (
                  <div key={row.candidateId} className="py-3">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-primary">{row.score}</span>
                      <span>{row.pillar}</span>
                      <span className={row.decisionMatches ? "text-emerald-700" : "text-destructive"}>
                        {row.storedDecision ?? "unset"} → {row.replayDecision}
                      </span>
                      <span className="text-muted-foreground">{row.sourceCount} src · {row.primarySourceCount} primary</span>
                      <span className={row.hasResearchPacket ? "text-emerald-700" : "text-amber-700"}>{row.hasResearchPacket ? "packet" : "no packet"}</span>
                    </div>
                    <div className="mt-1 font-semibold leading-tight">{row.subject}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

function SelectionPanel({ title, subtitle, rows }: { title: string; subtitle: string; rows: ShadowRow[] }) {
  return (
    <section className="border-2 border-foreground/10 bg-white p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Live selection</div>
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-4 divide-y">
        {rows.length ? rows.map((row, index) => (
          <div key={row.candidateId} className="py-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary">#{index + 1} · Score {row.score} · {row.replayDecision} · {row.pillar}</div>
            <div className="mt-1 font-semibold leading-tight">{row.subject}</div>
            <div className="mt-1 text-xs text-muted-foreground">{row.sourceCount} sources · {row.primarySourceCount} primary</div>
          </div>
        )) : <div className="py-6 text-sm text-muted-foreground">No eligible candidates in this window.</div>}
      </div>
    </section>
  );
}
