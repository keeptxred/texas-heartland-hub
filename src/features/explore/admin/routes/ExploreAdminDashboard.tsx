import { useMemo, useState } from "react";
import { ExploreAdminShell } from "../components/ExploreAdminShell";

export type ExploreAdminSection =
  | "overview"
  | "entities"
  | "relationships"
  | "sources"
  | "duplicates"
  | "imports"
  | "review";

interface DashboardMetrics {
  entities: number;
  pendingReview: number;
  duplicateCandidates: number;
  activeImports: number;
}

export function ExploreAdminDashboard() {
  const [section, setSection] =
    useState<ExploreAdminSection>("overview");

  // These values should be replaced by TanStack Query hooks that
  // already exist in the Explore repository layer.
  const metrics = useMemo<DashboardMetrics>(
    () => ({
      entities: 0,
      pendingReview: 0,
      duplicateCandidates: 0,
      activeImports: 0,
    }),
    [],
  );

  return (
    <ExploreAdminShell
      activeSection={section}
      onSectionChange={setSection}
      counts={{
        review: metrics.pendingReview,
        duplicates: metrics.duplicateCandidates,
        imports: metrics.activeImports,
      }}
    >
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold">
            Explore Texas Administration
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage imported destinations, review pending changes,
            monitor source imports, and maintain the Explore Texas
            knowledge graph.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Entities"
            value={metrics.entities}
          />

          <DashboardCard
            title="Pending Review"
            value={metrics.pendingReview}
          />

          <DashboardCard
            title="Duplicate Candidates"
            value={metrics.duplicateCandidates}
          />

          <DashboardCard
            title="Running Imports"
            value={metrics.activeImports}
          />
        </div>

        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">
            {sectionTitle(section)}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Individual management screens for this section will be
            implemented in subsequent files.
          </p>
        </section>
      </div>
    </ExploreAdminShell>
  );
}

interface DashboardCardProps {
  title: string;
  value: number;
}

function DashboardCard({
  title,
  value,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="text-sm text-muted-foreground">
        {title}
      </div>

      <div className="mt-3 text-3xl font-bold">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function sectionTitle(
  section: ExploreAdminSection,
): string {
  switch (section) {
    case "overview":
      return "Overview";

    case "entities":
      return "Entity Management";

    case "relationships":
      return "Relationship Explorer";

    case "sources":
      return "Import Sources";

    case "duplicates":
      return "Duplicate Resolution";

    case "imports":
      return "Import Health";

    case "review":
      return "Review Queue";
  }
}
