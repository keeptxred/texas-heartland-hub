import { useEffect, useMemo, useState, type ReactNode } from "react";
import { calculatePollingAverage, ELECTION_ROUTES } from "@/lib/elections";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { CandidateDetail, CandidateSummary, ElectionPollSummary } from "@/types/elections";

interface LoadedComparisonData {
  detail: CandidateDetail | null;
  polls: readonly ElectionPollSummary[];
}

export interface CandidateComparisonProps {
  candidates: readonly CandidateSummary[];
  onClear: () => void;
}

export function CandidateComparison({ candidates, onClear }: CandidateComparisonProps) {
  const repositories = useElectionRepositories();
  const [loaded, setLoaded] = useState<Readonly<Record<string, LoadedComparisonData>>>({});

  useEffect(() => {
    let active = true;
    if (candidates.length < 2) {
      setLoaded({});
      return () => {
        active = false;
      };
    }
    void Promise.all(
      candidates.map(async (candidate) => {
        const [detail, polls] = await Promise.all([
          repositories.candidates.findDetailById(candidate.id),
          repositories.polls.listByCandidate(candidate.id, candidate.electionCycleId),
        ]);
        return [candidate.id, { detail, polls }] as const;
      }),
    ).then((entries) => {
      if (active) setLoaded(Object.fromEntries(entries));
    });
    return () => {
      active = false;
    };
  }, [candidates, repositories]);

  const comparisonCandidates = useMemo(
    () =>
      candidates.map((summary) => ({
        summary,
        detail: loaded[summary.id]?.detail ?? null,
        polls: loaded[summary.id]?.polls ?? [],
      })),
    [candidates, loaded],
  );

  if (candidates.length < 2) return null;

  return (
    <section
      aria-labelledby="candidate-comparison-heading"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
        <div>
          <h2 id="candidate-comparison-heading" className="text-xl font-bold text-slate-950">
            Candidate comparison
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Compare documented, sourced fields from the published candidate directory. Missing
            information is shown plainly and is never inferred.
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-red-300 hover:text-red-700"
        >
          Clear comparison
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 font-semibold text-slate-700" scope="col">
                Field
              </th>
              {comparisonCandidates.map(({ summary }) => (
                <th
                  key={summary.id}
                  className="min-w-64 p-4 font-bold text-slate-950"
                  scope="col"
                >
                  <a
                    href={ELECTION_ROUTES.candidate(summary.slug)}
                    className="hover:text-red-700 hover:underline"
                  >
                    {summary.fullName}
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ComparisonRow
              label="Party"
              candidates={comparisonCandidates}
              value={({ summary }) => summary.partyLabel ?? formatValue(summary.party)}
            />
            <ComparisonRow
              label="Race"
              candidates={comparisonCandidates}
              value={({ summary }) => summary.primaryRace?.name ?? "Not assigned"}
            />
            <ComparisonRow
              label="Office"
              candidates={comparisonCandidates}
              value={({ summary }) => summary.primaryRace?.officeName ?? "Not assigned"}
            />
            <ComparisonRow
              label="District"
              candidates={comparisonCandidates}
              value={({ summary }) => summary.primaryRace?.districtName ?? "Statewide"}
            />
            <ComparisonRow
              label="Incumbency"
              candidates={comparisonCandidates}
              value={({ summary }) => formatValue(summary.incumbencyType)}
            />
            <ComparisonRow
              label="Biography"
              candidates={comparisonCandidates}
              value={({ detail }) => detail?.biography || muted("No sourced biography available")}
            />
            <ComparisonRow
              label="Experience"
              candidates={comparisonCandidates}
              value={({ detail }) => renderExperience(detail)}
            />
            <ComparisonRow
              label="Issue positions"
              candidates={comparisonCandidates}
              value={({ detail }) => renderIssuePositions(detail)}
            />
            <ComparisonRow
              label="Endorsements"
              candidates={comparisonCandidates}
              value={({ detail }) => renderEndorsements(detail)}
            />
            <ComparisonRow
              label="Fundraising"
              candidates={comparisonCandidates}
              value={({ detail }) => renderFundraising(detail?.fundraising ?? null)}
            />
            <ComparisonRow
              label="Polling"
              candidates={comparisonCandidates}
              value={({ summary, polls }) => renderPolling(summary.id, polls)}
            />
            <ComparisonRow
              label="Recent statements"
              candidates={comparisonCandidates}
              value={({ detail }) => renderRecentStatements(detail)}
            />
            <ComparisonRow
              label="Voting record"
              candidates={comparisonCandidates}
              value={({ detail }) => renderVotingRecord(detail)}
            />
            <ComparisonRow
              label="Candidate status"
              candidates={comparisonCandidates}
              value={({ summary }) => formatValue(summary.status)}
            />
            <ComparisonRow
              label="Last verified data update"
              candidates={comparisonCandidates}
              value={({ summary }) => formatDate(summary.updatedAt)}
            />
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface ComparisonCandidate {
  summary: CandidateSummary;
  detail: CandidateDetail | null;
  polls: readonly ElectionPollSummary[];
}

function ComparisonRow({
  label,
  candidates,
  value,
}: {
  label: string;
  candidates: readonly ComparisonCandidate[];
  value: (candidate: ComparisonCandidate) => ReactNode;
}) {
  return (
    <tr className="border-t border-slate-200 align-top">
      <th className="bg-slate-50 p-4 font-semibold text-slate-700" scope="row">
        {label}
      </th>
      {candidates.map((candidate) => (
        <td key={candidate.summary.id} className="p-4 leading-6 text-slate-800">
          {value(candidate)}
        </td>
      ))}
    </tr>
  );
}

function renderExperience(detail: CandidateDetail | null) {
  if (!detail) return muted("Loading sourced experience…");
  if (detail.officeHistory.length) {
    return (
      <ul className="space-y-2">
        {detail.officeHistory.map((entry, index) => {
          const text = `${entry.officeName}${entry.districtName ? ` — ${entry.districtName}` : ""}${entry.current ? " (current)" : ""}`;
          return <li key={`${entry.officeName}-${index}`}>{sourceLink(text, entry.sourceUrl)}</li>;
        })}
      </ul>
    );
  }
  const fallback = [detail.currentOfficeName, detail.occupation].filter(Boolean).join("; ");
  return fallback || muted("No documented experience found");
}

function renderIssuePositions(detail: CandidateDetail | null) {
  if (!detail) return muted("Loading documented positions…");
  const positions = detail.issuePositions ?? [];
  if (!positions.length) return muted("No documented position found");
  return (
    <ul className="space-y-3">
      {positions.map((position) => (
        <li key={position.id}>
          {sourceLink(position.issueName, position.sourceUrl, true)}
          <p className="mt-1">{position.positionSummary}</p>
        </li>
      ))}
    </ul>
  );
}

function renderEndorsements(detail: CandidateDetail | null) {
  if (!detail) return muted("Loading sourced endorsements…");
  if (!detail.endorsements.length) return muted("No sourced endorsements found");
  return (
    <ul className="space-y-2">
      {detail.endorsements.map((endorsement, index) => {
        const text = `${endorsement.organizationName}${endorsement.endorsementDate ? ` — ${formatDate(endorsement.endorsementDate)}` : ""}`;
        return <li key={`${endorsement.organizationName}-${index}`}>{sourceLink(text, endorsement.sourceUrl)}</li>;
      })}
    </ul>
  );
}

function renderFundraising(finance: CandidateDetail["fundraising"]) {
  if (!finance) return muted("No sourced finance summary found");
  const body = (
    <div className="space-y-1">
      <div>Raised: {formatMoney(finance.totalRaised)}</div>
      <div>Spent: {formatMoney(finance.totalSpent)}</div>
      <div>Cash on hand: {formatMoney(finance.cashOnHand)}</div>
      <div>Debt: {formatMoney(finance.debtsOwed)}</div>
      {finance.reportingPeriodEnd ? <div>Through {formatDate(finance.reportingPeriodEnd)}</div> : null}
    </div>
  );
  return finance.sourceUrl ? (
    <a href={finance.sourceUrl} target="_blank" rel="noreferrer" className="block hover:text-blue-800">
      {body}
    </a>
  ) : (
    body
  );
}

function renderPolling(candidateId: string, polls: readonly ElectionPollSummary[]) {
  const average = calculatePollingAverage(polls);
  const candidate = average?.candidates.find((item) => item.candidateId === candidateId);
  if (!average || !candidate) return muted("No published poll result found");
  const sourcePoll = polls.find((poll) =>
    poll.primaryQuestion?.responses.some(
      (response) => response.candidateId === candidateId && response.percentage != null,
    ),
  );
  const text = `${candidate.averagePercentage.toFixed(1)}% weighted average across ${candidate.pollCount} poll${candidate.pollCount === 1 ? "" : "s"} (${formatDate(average.fieldDateFrom)}–${formatDate(average.fieldDateTo)})`;
  return sourceLink(text, sourcePoll?.sourceUrl ?? null, true);
}

function renderRecentStatements(detail: CandidateDetail | null) {
  if (!detail) return muted("Loading sourced statements…");
  const statements = detail.recentStatements ?? [];
  if (!statements.length) return muted("No sourced recent statement found");
  return (
    <ul className="space-y-3">
      {statements.map((statement, index) => (
        <li key={`${statement.title}-${index}`}>
          {sourceLink(statement.title, statement.sourceUrl, true)}
          <p className="mt-1">{statement.summary}</p>
        </li>
      ))}
    </ul>
  );
}

function renderVotingRecord(detail: CandidateDetail | null) {
  if (!detail) return muted("Loading sourced voting record…");
  const records = detail.votingRecord ?? [];
  if (!records.length) return muted("No applicable sourced voting record found");
  return (
    <ul className="space-y-3">
      {records.map((record, index) => (
        <li key={`${record.title}-${index}`}>
          {sourceLink(record.title, record.sourceUrl, true)}
          <p className="mt-1">{record.summary}</p>
        </li>
      ))}
    </ul>
  );
}

function sourceLink(text: string, sourceUrl?: string | null, strong = false) {
  if (!sourceUrl) return <span className={strong ? "font-semibold" : undefined}>{text}</span>;
  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noreferrer"
      className={`${strong ? "font-semibold " : "font-medium "}text-blue-800 underline-offset-4 hover:underline`}
    >
      {text}
    </a>
  );
}

function muted(text: string) {
  return <span className="text-slate-500">{text}</span>;
}

function formatValue(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "America/Chicago",
  }).format(new Date(value.includes("T") ? value : `${value}T12:00:00Z`));
}

function formatMoney(value: number | null) {
  return value == null
    ? "Not reported"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
}
