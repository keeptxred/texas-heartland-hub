import { ElectionErrorState, ElectionLoading } from "@/components/elections";
import { useAdminElectionRaces } from "@/hooks/elections";
import { RACE_STATUS_LABELS } from "@/types/elections/raceClassifications";
import { ElectionAdminMenu } from "./ElectionAdminMenu";
import { ElectionAdminDataNotice } from "./ElectionAdminDataNotice";

export function ElectionAdminRaceList() {
  const races = useAdminElectionRaces();
  return (
    <div className="space-y-8">
      <ElectionAdminMenu currentPath="/admin/elections/races" />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Race records</h2>
        <p className="mt-2 text-sm text-slate-600">
          Read-only status, publication, and verification overview.
        </p>
        {races.isLoading ? (
          <div className="mt-6">
            <ElectionLoading variant="list" label="Loading admin race records" />
          </div>
        ) : races.error ? (
          <div className="mt-6">
            <ElectionErrorState
              compact
              kind="admin_operation"
              technicalMessage={races.error.message}
              retryAction={{ label: "Try again", onClick: () => void races.refetch() }}
            />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <ElectionAdminDataNotice
              isEmpty={!races.data?.items.length}
              hasStaleData={
                races.data?.items.some(
                  (race) => race.freshnessStatus === "stale" || race.freshnessStatus === "expired",
                ) ?? false
              }
            />
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <caption className="sr-only">Election race status records</caption>
                <thead>
                  <tr className="text-slate-500">
                    <th className="px-3 py-2">Race</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Publication</th>
                    <th className="px-3 py-2">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {races.data?.items.map((race) => (
                    <tr key={race.id}>
                      <td className="px-3 py-3 font-semibold text-slate-950">{race.name}</td>
                      <td className="px-3 py-3">{RACE_STATUS_LABELS[race.status]}</td>
                      <td className="px-3 py-3">{format(race.publicationStatus)}</td>
                      <td className="px-3 py-3">{format(race.verificationStatus)}</td>
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
