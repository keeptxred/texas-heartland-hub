import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ELECTION_ROUTES } from "@/lib/elections";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { CandidateDetail, CandidateSummary, ElectionPollSummary } from "@/types/elections";

interface SourcedComparisonItem {
  label?: string;
  title?: string;
  position?: string;
  statement?: string;
  organizationName?: string;
  officeName?: string;
  description?: string;
  sourceUrl?: string | null;
}

interface CandidateComparisonExtras {
  experience?: readonly SourcedComparisonItem[];
  issuePositions?: readonly SourcedComparisonItem[];
  recentStatements?: readonly SourcedComparisonItem[];
  votingRecord?: readonly SourcedComparisonItem[];
}

interface LoadedComparisonData {
  detail: (CandidateDetail & CandidateComparisonExtras) | null;
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
        return [candidate.id, { detail: detail as LoadedComparisonData["detail"], polls }] as const;
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
              value={({ detail }) => detail?.biography || "No sourced biography available"}
            />
            <ComparisonRow
              label="Experience"
              candidates={comparisonCandidates}
              value={({ detail }) =>
                renderSourcedItems(
                  detail?.experience ?? detail?.officeHistory,
                  "No documented experience found",
                )
              }
            />
            <ComparisonRow
              label="Issue positions"
              candidates={comparisonCandidates}
              value={({ detail }) =>
                renderSourcedItems(detail?.issuePositions, "No documented position found")
              }
            />
            <ComparisonRow
              label="Endorsements"
              candidates={comparisonCandidates}
              value={({ detail }) =>
                renderSourcedItems(detail?.endorsements, "No sourced endorsements found")
              }
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
              value={({ detail }) =>
                renderSourcedItems(detail?.recentStatements, "No sourced recent statement found")
              }
            />
            <ComparisonRow
              label="Voting record"
              candidates={comparisonCandidates}
              value={({ detail }) =>
                renderSourcedItems(
                  detail?.votingRecord,
                  "No applicable sourced voting record found",
                )
              }
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

function ComparisonRow({
  label,
  candidates,
  value,
}: {
  label: string;
  candidates: readonly {
    summary: CandidateSummary;
    detail: LoadedComparisonData["detail"];
    polls: readonly ElectionPollSummary[];
  }[];
  value: (candidate: {
    summary: CandidateSummary;
    detail: LoadedComparisonData["detail"];
    polls: readonly ElectionPollSummary[];
  }) => ReactNode;
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

function renderSourcedItems(
  items: readonly SourcedComparisonItem[] | undefined,
  emptyLabel: string,
) {
  if (!items?.length) return <span className="text-slate-500">{emptyLabel}</span>;
  return (
    <ul className="space-y-2">
      {items.map((item, index) => {
        const text =
          item.position ??
          item.statement ??
          item.organizationName ??
          item.officeName ??
          item.description ??
          item.title ??
          item.label ??
          "Documented item";
        return (
          <li key={`${text}-${index}`}>
            {item.sourceUrl ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-800 underline-offset-4 hover:underline"
              >
                {text}
              </a>
            ) : (
              text
            )}
          </li>
        );
      })}
    </ul>
  );
}

function renderFundraising(candidate: CandidateDetail["fundraising"]) {
  if (!candidate) return <span className="text-slate-500">No sourced finance summary found</span>;
  const body = (
    <div className="space-y-1">
      <div>Raised: {formatMoney(candidate.totalRaised)}</div>
      <div>Spent: {formatMoney(candidate.totalSpent)}</div>
      <div>Cash on hand: {formatMoney(candidate.cashOnHand)}</div>
      <div>Debt: {formatMoney(candidate.debtsOwed)}</div>
      {candidate.reportingPeriodEnd ? <div>Through {formatDate(candidate.reportingPeriodEnd)}</div> : null}
    </div>
  );
  return candidate.sourceUrl ? (
    <a href={candidate.sourceUrl} target="_blank" rel="noreferrer" className="block hover:text-blue-800">
      {body}
    </a>
  ) : (
    body
  );
}

function renderPolling(candidateId: string, polls: readonly ElectionPollSummary[]) {
  const entries = polls.flatMap((poll) => {
    const response = poll.primaryQuestion?.responses.find(
      (item) => item.candidateId === candidateId && item.percentage != null,
    );
    return response?.percentage == null
      ? []
      : [
          {
            pollsterName: poll.pollsterName,
            percentage: response.percentage,
            fieldEndDate: poll.fieldEndDate,
            sourceUrl: poll.sourceUrl,
          },
        ];
  });
  if (!entries.length) return <span className="text-slate-500">No published poll result found</span>;
  return (
    <ul className="space-y-2">
      {entries.slice(0, 3).map((poll) => (
        <li key={`${poll.pollsterName}-${poll.fieldEndDate}`}>
          <a
            href={poll.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-800 underline-offset-4 hover:underline"
          >
            {poll.pollsterName}: {poll.percentage.toFixed(1)}% ({formatDate(poll.fieldEndDate)})
          </a>
        </li>
      ))}
    </ul>
  );
}

function formatValue(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
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
