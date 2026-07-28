import type { ReactNode } from "react";
import { ELECTION_ROUTES } from "@/lib/elections";
import type { CandidateSummary } from "@/types/elections";

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

export interface CandidateComparisonRecord extends CandidateSummary {
  biography?: string | null;
  experience?: readonly SourcedComparisonItem[];
  issuePositions?: readonly SourcedComparisonItem[];
  endorsements?: readonly SourcedComparisonItem[];
  fundraising?: {
    totalRaised: number | null;
    totalSpent: number | null;
    cashOnHand: number | null;
    debtsOwed: number | null;
    reportingPeriodEnd: string | null;
    sourceUrl: string | null;
  } | null;
  polling?: readonly {
    pollsterName: string;
    percentage: number;
    fieldEndDate: string;
    sourceUrl: string;
  }[];
  recentStatements?: readonly SourcedComparisonItem[];
  votingRecord?: readonly SourcedComparisonItem[];
}

export interface CandidateComparisonProps {
  candidates: readonly CandidateComparisonRecord[];
  onClear: () => void;
}

export function CandidateComparison({ candidates, onClear }: CandidateComparisonProps) {
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
              {candidates.map((candidate) => (
                <th
                  key={candidate.id}
                  className="min-w-64 p-4 font-bold text-slate-950"
                  scope="col"
                >
                  <a
                    href={ELECTION_ROUTES.candidate(candidate.slug)}
                    className="hover:text-red-700 hover:underline"
                  >
                    {candidate.fullName}
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ComparisonRow
              label="Party"
              candidates={candidates}
              value={(candidate) => candidate.partyLabel ?? formatValue(candidate.party)}
            />
            <ComparisonRow
              label="Race"
              candidates={candidates}
              value={(candidate) => candidate.primaryRace?.name ?? "Not assigned"}
            />
            <ComparisonRow
              label="Office"
              candidates={candidates}
              value={(candidate) => candidate.primaryRace?.officeName ?? "Not assigned"}
            />
            <ComparisonRow
              label="District"
              candidates={candidates}
              value={(candidate) => candidate.primaryRace?.districtName ?? "Statewide"}
            />
            <ComparisonRow
              label="Incumbency"
              candidates={candidates}
              value={(candidate) => formatValue(candidate.incumbencyType)}
            />
            <ComparisonRow
              label="Biography"
              candidates={candidates}
              value={(candidate) => candidate.biography || "No sourced biography available"}
            />
            <ComparisonRow
              label="Experience"
              candidates={candidates}
              value={(candidate) => renderSourcedItems(candidate.experience, "No documented experience found")}
            />
            <ComparisonRow
              label="Issue positions"
              candidates={candidates}
              value={(candidate) =>
                renderSourcedItems(candidate.issuePositions, "No documented position found")
              }
            />
            <ComparisonRow
              label="Endorsements"
              candidates={candidates}
              value={(candidate) => renderSourcedItems(candidate.endorsements, "No sourced endorsements found")}
            />
            <ComparisonRow
              label="Fundraising"
              candidates={candidates}
              value={(candidate) => renderFundraising(candidate.fundraising)}
            />
            <ComparisonRow
              label="Polling"
              candidates={candidates}
              value={(candidate) => renderPolling(candidate.polling)}
            />
            <ComparisonRow
              label="Recent statements"
              candidates={candidates}
              value={(candidate) => renderSourcedItems(candidate.recentStatements, "No sourced recent statement found")}
            />
            <ComparisonRow
              label="Voting record"
              candidates={candidates}
              value={(candidate) => renderSourcedItems(candidate.votingRecord, "No applicable sourced voting record found")}
            />
            <ComparisonRow
              label="Candidate status"
              candidates={candidates}
              value={(candidate) => formatValue(candidate.status)}
            />
            <ComparisonRow
              label="Last verified data update"
              candidates={candidates}
              value={(candidate) => formatDate(candidate.updatedAt)}
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
  candidates: readonly CandidateComparisonRecord[];
  value: (candidate: CandidateComparisonRecord) => ReactNode;
}) {
  return (
    <tr className="border-t border-slate-200 align-top">
      <th className="bg-slate-50 p-4 font-semibold text-slate-700" scope="row">
        {label}
      </th>
      {candidates.map((candidate) => (
        <td key={candidate.id} className="p-4 leading-6 text-slate-800">
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

function renderFundraising(candidate: CandidateComparisonRecord["fundraising"]) {
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

function renderPolling(candidate: CandidateComparisonRecord["polling"]) {
  if (!candidate?.length) return <span className="text-slate-500">No published poll result found</span>;
  return (
    <ul className="space-y-2">
      {candidate.slice(0, 3).map((poll) => (
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
