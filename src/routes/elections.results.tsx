import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ElectionResultsListPage } from "@/pages/elections";

interface OfficialCandidate {
  party: string;
  name: string;
  votes: number | null;
}
interface EstimatedCountSource {
  sourceName: string;
  sourceFamily: string;
  sourceUrl: string;
  updatedAt: string;
  percent: number;
}
interface EstimatedCountProgress {
  percent: number;
  method: "single_provider" | "independent_mean";
  sources: EstimatedCountSource[];
  updatedAt: string;
}
interface OfficialRace {
  id: string;
  title: string;
  reportingPercent: number | null;
  totalReportedVotes: number | null;
  candidates: OfficialCandidate[];
  estimatedVotesCounted?: EstimatedCountProgress | null;
}
interface OfficialFeed {
  source: string;
  estimatedCountStatus?: "not_configured" | "available" | "unavailable";
  sourceUrl: string;
  sourceUpdatedLabel: string | null;
  retrievedAt: string;
  reportingNow: boolean;
  stale: boolean;
  sourceAgeMinutes?: number | null;
  sourceLagging?: boolean;
  providerError?: string;
  races: OfficialRace[];
}
const REFRESH_MS = 30_000;
const SOS_URL = "https://electionresults.sos.state.tx.us/results.html";
const featured = [
  "U. S. SENATOR",
  "GOVERNOR",
  "LIEUTENANT GOVERNOR",
  "ATTORNEY GENERAL",
  "COMPTROLLER OF PUBLIC ACCOUNTS",
  "COMMISSIONER OF THE GENERAL LAND OFFICE",
  "COMMISSIONER OF AGRICULTURE",
  "RAILROAD COMMISSIONER",
];
const votesLabel = (votes: number | null) => votes === null ? "Not reported" : votes.toLocaleString("en-US");
const localTime = (iso: string) => {
  const time = new Date(iso);
  return Number.isFinite(time.getTime()) ? time.toLocaleString("en-US", {
    timeZone: "America/Chicago", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", timeZoneName: "short",
  }) : "Time unavailable";
};

export const Route = createFileRoute("/elections/results")({
  head: () => ({
    meta: [
      { title: "Live 2026 Texas Election Results | Keep TX Red" },
      { name: "description", content: "Unofficial 2026 Texas general election returns from the Texas Secretary of State, refreshed automatically on election night." },
      { property: "og:title", content: "2026 Texas Election Results | Keep TX Red" },
      { property: "og:url", content: "https://keeptxred.com/elections/results" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/results" }],
  }),
  component: ElectionNightResultsPage,
});

function ElectionNightResultsPage() {
  const [feed, setFeed] = useState<OfficialFeed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("");
  const [visible, setVisible] = useState(60);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/public/election-results", {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal,
      });
      const payload: OfficialFeed & { error?: string } = await response.json();
      if (!response.ok || !Array.isArray(payload.races)) {
        throw new Error(payload.error || "Election results provider unavailable.");
      }
      if (!signal?.aborted) { setFeed(payload); setError(null); }
    } catch (caught) {
      if (!signal?.aborted) {
        setError(caught instanceof Error ? caught.message : "Results could not be loaded.");
      }
    } finally {
      if (!signal?.aborted) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, REFRESH_MS);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [refresh]);

  const sorted = useMemo(() => {
    const races = (feed?.races ?? []).filter((race) =>
      race.title.toLowerCase().includes(filter.trim().toLowerCase()) ||
      race.candidates.some((candidate) => candidate.name.toLowerCase().includes(filter.trim().toLowerCase())),
    );
    return races.sort((left, right) => {
      const a = featured.indexOf(left.title);
      const b = featured.indexOf(right.title);
      if (a >= 0 || b >= 0) return (a < 0 ? featured.length : a) - (b < 0 ? featured.length : b);
      return left.title.localeCompare(right.title, "en-US", { numeric: true });
    });
  }, [feed, filter]);

  return (
    <ElectionResultsListPage>
      <div className="space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
          <div>
            <p className="font-bold text-slate-900">
              {feed?.stale ? "Official feed temporarily unavailable — last verified snapshot" :
                feed?.sourceLagging ? "Unofficial SOS results — source update delayed" :
                feed?.reportingNow ? "Unofficial results reporting" :
                "Waiting for official election-night returns"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {feed ? "Last retrieved " + localTime(feed.retrievedAt) : "Connecting to the Texas Secretary of State"}
              {feed?.sourceUpdatedLabel ? " · State source updated " + feed.sourceUpdatedLabel : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-600">Checks every 30 seconds while open</span>
            <button type="button" onClick={() => void refresh()} disabled={refreshing}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50">
              {refreshing ? "Checking…" : "Refresh now"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
          <p className="font-bold">Reporting percentage is NOT the percentage of votes counted</p>
          <p className="mt-1">
            The Texas Secretary of State reports the percentage of <strong>polling locations</strong> reporting to the state,
            not an estimate of ballots counted. Early-voting totals can represent millions of votes even when few
            polling locations show as reported. Other live election outlets may display a higher estimated-vote percentage,
            which is a different measure. Do not compare the two percentages directly.
          </p>
          {feed?.sourceUpdatedLabel ? (
            <p className="mt-2 font-semibold">SOS source last updated: {feed.sourceUpdatedLabel} Central
              {feed.sourceAgeMinutes !== null && feed.sourceAgeMinutes !== undefined
                ? " (" + feed.sourceAgeMinutes + " minutes ago)" : ""}.
            </p>
          ) : null}
        </div>

        {feed && feed.estimatedCountStatus !== "available" ? (
          <p role="status" className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <strong>Estimated votes counted:</strong> Not available from a verified external provider.
            The SOS polling-location percentage below is a different measure and must not be used as a substitute.
          </p>
        ) : null}
        {feed?.estimatedCountStatus === "available" ? (
          <p className="text-sm font-semibold text-slate-700">
            Estimated votes counted are shown separately where an authorized, current provider supplied them.
            They are unofficial estimates, not Texas SOS figures.
          </p>
        ) : null}

        {feed?.sourceLagging ? (
          <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
            <strong>State data update delayed:</strong> the official SOS source has not published a new update for
            {feed.sourceAgeMinutes ? " " + feed.sourceAgeMinutes + " minutes" : " some time"}.
            KTR is still checking automatically, but its vote totals and reporting figures may lag other providers.
          </div>
        ) : null}

        {error ? (
          <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
            <p className="font-bold">Official feed connection issue</p>
            <p className="mt-1">{error} {feed ? "Showing the last successfully retrieved data below; do not treat it as current." : "No vote totals are being shown until the source is verified."}</p>
            <a className="mt-3 inline-block font-semibold underline" href={SOS_URL} target="_blank" rel="noopener noreferrer">
              View official Texas SOS results
            </a>
          </div>
        ) : null}
        {feed?.stale && !error ? (
          <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
            Results may be delayed: the official source could not be refreshed. Last validated source data is displayed.
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="block w-full max-w-lg text-sm font-semibold text-slate-800">
            Search races or candidates
            <input type="search" value={filter} onChange={(e) => { setFilter(e.target.value); setVisible(60); }}
              placeholder="Senate, governor, district, candidate…" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900" />
          </label>
          <div className="text-sm text-slate-600">
            {feed ? String(sorted.length) + " of " + feed.races.length + " official contests" : "Loading contests…"}
            <p><a href={SOS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">Official Texas SOS source</a></p>
          </div>
        </div>

        {!feed && !error ? (
          <p role="status" className="rounded-xl border border-slate-200 bg-white p-6">Loading verified Texas election results…</p>
        ) : null}
        {feed && sorted.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-6">No matching contests. Try another race or candidate name.</p>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-2">
          {sorted.slice(0, visible).map((race) => (
            <section key={race.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-label={race.title}>
              <h3 className="text-lg font-bold text-slate-950">{race.title}</h3>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-600">
                <span>SOS polling locations reporting: {race.reportingPercent === null ? "Not reported" : race.reportingPercent + "%"}</span>
                <span>Votes shown: {votesLabel(race.totalReportedVotes)}</span>
              </div>
              {race.estimatedVotesCounted ? (
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <p className="font-semibold text-slate-900">
                    Estimated votes counted: {race.estimatedVotesCounted.percent.toFixed(1)}%
                    {" · "}{race.estimatedVotesCounted.method === "independent_mean"
                      ? "Independent-provider average" : "Single-provider estimate"}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Updated {localTime(race.estimatedVotesCounted.updatedAt)} · Unofficial estimate
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Sources: {race.estimatedVotesCounted.sources.map((source, index) => (
                      <span key={source.sourceFamily}>
                        {index > 0 ? " · " : ""}
                        <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="font-semibold underline underline-offset-2">{source.sourceName}</a>
                      </span>
                    ))}
                  </p>
                </div>
              ) : null}
              <div className="mt-4 space-y-3">
                {race.candidates.map((candidate, index) => {
                  const share = race.totalReportedVotes && candidate.votes !== null
                    ? (100 * candidate.votes / race.totalReportedVotes) : null;
                  return (
                    <div key={candidate.party + "-" + candidate.name + "-" + index} className="border-t border-slate-100 pt-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{candidate.name}</p>
                          <p className="text-xs text-slate-600">{candidate.party}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold tabular-nums text-slate-900">{votesLabel(candidate.votes)}</p>
                          {share !== null ? <p className="text-xs tabular-nums text-slate-600">{share.toFixed(1)}% of votes shown</p> : null}
                        </div>
                      </div>
                      {share !== null ? <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-slate-700" style={{ width: Math.min(100, share) + "%" }} />
                      </div> : null}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-slate-500">Source: Texas Secretary of State · Unofficial · No winner projected</p>
            </section>
          ))}
        </div>
        {sorted.length > visible ? (
          <div className="text-center">
            <button type="button" onClick={() => setVisible((previous) => previous + 60)}
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold hover:bg-slate-100">
              Show more contests ({sorted.length - visible} remaining)
            </button>
          </div>
        ) : null}
        <p className="text-sm leading-6 text-slate-600">
          These are unofficial returns published by the Texas Secretary of State. Polling-location reporting is not the
          percentage of all votes counted. Results may be corrected or delayed; no candidate is declared the winner
          here until an authoritative source makes that determination.
        </p>
      </div>
    </ElectionResultsListPage>
  );
}
