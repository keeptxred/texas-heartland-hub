import type { ElectionResultDetail } from "@/types/elections";
import {
  CERTIFICATION_STATUS_LABELS,
  ELECTION_RESULT_STATUS_LABELS,
  RESULT_REPORTING_STATUS_LABELS,
  WINNER_STATUS_LABELS,
} from "@/types/elections/resultClassifications";

export function ResultDetailView({ result }: { result: ElectionResultDetail }) {
  const certified = result.status === "certified" || result.certificationStatus === "certified";

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
          {certified ? "Certified result" : "Unofficial result"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {result.race.name}
        </h1>
        <p className="mt-3 text-base text-slate-600">
          {ELECTION_RESULT_STATUS_LABELS[result.status]} ·{" "}
          {RESULT_REPORTING_STATUS_LABELS[result.reportingStatus]}
        </p>
      </header>

      {!certified ? (
        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          These totals are unofficial and may change as ballots are counted. Results are final only
          after certification by the responsible election authority.
        </aside>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Reporting status</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <Detail
            label="Reporting"
            value={
              result.reporting.reportingPercentage == null
                ? RESULT_REPORTING_STATUS_LABELS[result.reportingStatus]
                : `${result.reporting.reportingPercentage.toFixed(1)}%`
            }
          />
          <Detail label="Total votes" value={result.totalVotes.toLocaleString("en-US")} />
          <Detail
            label="Certification"
            value={CERTIFICATION_STATUS_LABELS[result.certificationStatus]}
          />
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Candidate totals</h2>
        <div className="mt-4 divide-y divide-slate-200">
          {result.candidateSummaries.map((candidate) => (
            <div
              key={candidate.candidateId}
              className="grid gap-2 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6"
            >
              <div>
                <p className="font-semibold text-slate-950">{candidate.ballotName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {[candidate.partyLabel, WINNER_STATUS_LABELS[candidate.winnerStatus]]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <p className="font-mono text-sm font-semibold text-slate-700">
                {candidate.votes.toLocaleString("en-US")} votes
              </p>
              <p className="font-mono text-lg font-bold text-slate-950">
                {candidate.voteShare == null ? "—" : `${candidate.voteShare.toFixed(1)}%`}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 pt-5 text-sm text-slate-600">
        <p>
          Source:{" "}
          <a
            href={result.source.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-red-700 hover:underline"
          >
            {result.source.sourceName}
          </a>
        </p>
        <p className="mt-1">Updated {formatDateTime(result.updatedAt)}</p>
      </footer>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-slate-950">{value}</dd>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default ResultDetailView;
