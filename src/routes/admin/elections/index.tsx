import { createFileRoute, Link } from "@tanstack/react-router";
import { ElectionAdminDashboard } from "@/components/admin/elections";
import { ElectionErrorState, ElectionLoading } from "@/components/elections";
import { useActiveElectionCycle, useElectionSummaryMetrics } from "@/hooks/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";

export const Route = createFileRoute("/admin/elections/")({
  head: () => ({
    meta: [
      { title: "Election Central — Keep TX Red Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ElectionAdminPage,
});

function ElectionAdminPage() {
  const unlocked = typeof window !== "undefined" && sessionStorage.getItem("ktr-admin-ok") === "1";

  if (!unlocked) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Admin access required</h1>
        <p className="mt-2 text-muted-foreground">
          Unlock the editorial dashboard before opening Election Central administration.
        </p>
        <Link
          to="/admin"
          className="mt-6 inline-flex h-10 items-center bg-primary px-4 font-semibold text-primary-foreground"
        >
          Open admin
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link to="/admin" className="text-xs font-bold uppercase tracking-widest text-accent">
            ← Editorial Dashboard
          </Link>
          <h1 className="mt-2 font-display text-4xl">Election Central Administration</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/90">
            Manage launch readiness, election data quality, publishing safeguards, and future
            election-night operations.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <ElectionRepositoryProvider>
          <ElectionAdminDashboardData />
        </ElectionRepositoryProvider>
      </div>
    </main>
  );
}

function ElectionAdminDashboardData() {
  const cycle = useActiveElectionCycle();
  const metrics = useElectionSummaryMetrics(cycle.data?.id);
  const values = metrics.data;
  if (cycle.isLoading || metrics.isLoading) {
    return <ElectionLoading variant="metrics" label="Loading election admin metrics" />;
  }
  const error = cycle.error ?? metrics.error;
  if (error) {
    return (
      <ElectionErrorState
        kind="admin_operation"
        technicalMessage={error.message}
        retryAction={{
          label: "Try again",
          onClick: () => {
            void cycle.refetch();
            void metrics.refetch();
          },
        }}
      />
    );
  }

  return (
    <ElectionAdminDashboard
      metrics={
        values
          ? [
              {
                label: "Races",
                value: values.raceCount,
                description: "Race records in the active election cycle.",
                status: "ready",
              },
              {
                label: "Candidates",
                value: values.candidateCount,
                description: "Candidate records connected to active-cycle races.",
                status: "ready",
              },
              {
                label: "Polls",
                value: values.pollCount,
                description: "Poll records in the active election cycle.",
                status: "ready",
              },
              {
                label: "Forecasts",
                value: values.forecastCount,
                description: "Forecast records in the active election cycle.",
                status: "ready",
              },
              {
                label: "Results",
                value: values.resultCount,
                description: "Result records in the active election cycle.",
                status: "ready",
              },
            ]
          : []
      }
      lastUpdated={metrics.dataUpdatedAt ? new Date(metrics.dataUpdatedAt) : undefined}
    />
  );
}
