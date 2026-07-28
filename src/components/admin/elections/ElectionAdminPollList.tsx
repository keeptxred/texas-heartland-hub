import { ElectionErrorState, ElectionLoading } from "@/components/elections";
import { useAdminElectionPolls } from "@/hooks/elections";
import { ElectionAdminMenu } from "./ElectionAdminMenu";
import { ElectionAdminDataNotice } from "./ElectionAdminDataNotice";
import { PollEntryAdminForm } from "./PollEntryAdminForm";

export function ElectionAdminPollList() {
  const polls = useAdminElectionPolls();
  return (
    <div className="space-y-8">
      <ElectionAdminMenu currentPath="/admin/elections/polls" />
      <PollEntryAdminForm />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Poll records</h2>
        <p className="mt-2 text-sm text-slate-600">
          Read-only pollster, race, field date, and warning overview.
        </p>
        {polls.isLoading ? (
          <ElectionLoading variant="list" label="Loading admin poll records" />
        ) : polls.error ? (
          <ElectionErrorState
            compact
            kind="admin_operation"
            technicalMessage={polls.error.message}
            retryAction={{ label: "Try again", onClick: () => void polls.refetch() }}
          />
        ) : (
          <div className="mt-6 space-y-4">
            <ElectionAdminDataNotice
              isEmpty={!polls.data?.items.length}
              hasStaleData={
                polls.data?.items.some(
                  (poll) => poll.freshnessStatus === "stale" || poll.freshnessStatus === "expired",
                ) ?? false
              }
            />
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <caption className="sr-only">Election poll review records</caption>
                <thead>
                  <tr>
                    <th className="px-3 py-2">Pollster</th>
                    <th className="px-3 py-2">Race</th>
                    <th className="px-3 py-2">Field dates</th>
                    <th className="px-3 py-2">Warnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {polls.data?.items.map((poll) => {
                    const warnings = [
                      poll.partisanPoll && "Partisan",
                      poll.internalPoll && "Internal",
                      ["stale", "expired"].includes(poll.freshnessStatus) && "Stale",
                    ].filter(Boolean);
                    return (
                      <tr key={poll.id}>
                        <td className="px-3 py-3 font-semibold">{poll.pollsterName}</td>
                        <td className="px-3 py-3">
                          {poll.race?.name ?? poll.jurisdictionName ?? "Not assigned"}
                        </td>
                        <td className="px-3 py-3">
                          {poll.fieldStartDate}–{poll.fieldEndDate}
                        </td>
                        <td className="px-3 py-3">{warnings.join(", ") || "None"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
