import { ELECTION_ROUTES } from "@/lib/elections";
import type { CandidateSummary } from "@/types/elections";

export interface CandidateComparisonProps {
  candidates: readonly CandidateSummary[];
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
            Compare verified fields from the published candidate directory.
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
                  className="min-w-52 p-4 font-bold text-slate-950"
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
  candidates: readonly CandidateSummary[];
  value: (candidate: CandidateSummary) => string;
}) {
  return (
    <tr className="border-t border-slate-200">
      <th className="bg-slate-50 p-4 font-semibold text-slate-700" scope="row">
        {label}
      </th>
      {candidates.map((candidate) => (
        <td key={candidate.id} className="p-4 text-slate-800">
          {value(candidate)}
        </td>
      ))}
    </tr>
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
