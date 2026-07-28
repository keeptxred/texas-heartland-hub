import { ElectionErrorState, ElectionLoading } from "@/components/elections";
import { useAdminElectionResults } from "@/hooks/elections";
import {
  CERTIFICATION_STATUS_LABELS,
  RESULT_REPORTING_STATUS_LABELS,
} from "@/types/elections/resultClassifications";
import { ElectionAdminMenu } from "./ElectionAdminMenu";
export function ElectionAdminResultList() {
  const results = useAdminElectionResults();
  return (
    <div className="space-y-8">
      <ElectionAdminMenu currentPath="/admin/elections/results" />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Result records</h2>
        <p className="mt-2 text-sm text-slate-600">
          Read-only reporting, certification, and update overview.
        </p>
        {results.isLoading ? (
          <ElectionLoading variant="list" label="Loading admin result records" />
        ) : results.error ? (
          <ElectionErrorState
            compact
            kind="admin_operation"
            technicalMessage={results.error.message}
            retryAction={{ label: "Try again", onClick: () => void results.refetch() }}
          />
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2">Race</th>
                  <th className="px-3 py-2">Reporting</th>
                  <th className="px-3 py-2">Certification</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.data?.items.map((result) => (
                  <tr key={result.id}>
                    <td className="px-3 py-3 font-semibold">{result.race.name}</td>
                    <td className="px-3 py-3">
                      {RESULT_REPORTING_STATUS_LABELS[result.reportingStatus]}
                    </td>
                    <td className="px-3 py-3">
                      {CERTIFICATION_STATUS_LABELS[result.certificationStatus]}
                    </td>
                    <td className="px-3 py-3">
                      {new Date(result.updatedAt).toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
