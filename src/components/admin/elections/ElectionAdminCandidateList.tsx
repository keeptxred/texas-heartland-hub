import { ElectionErrorState, ElectionLoading } from "@/components/elections";
import { useAdminElectionCandidates } from "@/hooks/elections";
import { CANDIDATE_FILING_STATUS_LABELS } from "@/types/elections/candidateClassifications";
import { ElectionAdminMenu } from "./ElectionAdminMenu";
import { ElectionAdminDataNotice } from "./ElectionAdminDataNotice";

export function ElectionAdminCandidateList() {
  const candidates = useAdminElectionCandidates();
  return (
    <div className="space-y-8">
      <ElectionAdminMenu currentPath="/admin/elections/candidates" />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Candidate records</h2>
        <p className="mt-2 text-sm text-slate-600">
          Read-only race relationship, filing, and publication overview.
        </p>
        {candidates.isLoading ? (
          <ElectionLoading variant="list" label="Loading admin candidate records" />
        ) : candidates.error ? (
          <ElectionErrorState
            compact
            kind="admin_operation"
            technicalMessage={candidates.error.message}
            retryAction={{ label: "Try again", onClick: () => void candidates.refetch() }}
          />
        ) : (
          <div className="mt-6 space-y-4">
            <ElectionAdminDataNotice
              isEmpty={!candidates.data?.length}
              hasStaleData={
                candidates.data?.some(
                  ({ summary }) =>
                    summary.freshnessStatus === "stale" || summary.freshnessStatus === "expired",
                ) ?? false
              }
            />
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <caption className="sr-only">Election candidate status records</caption>
                <thead>
                  <tr>
                    <th className="px-3 py-2">Candidate</th>
                    <th className="px-3 py-2">Race</th>
                    <th className="px-3 py-2">Filing</th>
                    <th className="px-3 py-2">Publication</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.data?.map(({ summary, publicationStatus }) => (
                    <tr key={summary.id}>
                      <td className="px-3 py-3 font-semibold">{summary.ballotName}</td>
                      <td className="px-3 py-3">{summary.primaryRace?.name ?? "Not assigned"}</td>
                      <td className="px-3 py-3">
                        {CANDIDATE_FILING_STATUS_LABELS[summary.filingStatus]}
                      </td>
                      <td className="px-3 py-3">{format(publicationStatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function format(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
