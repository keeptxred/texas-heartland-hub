import { useState } from 'react';

import { ExploreAdminShell } from '../components/ExploreAdminShell';
import { ExploreDuplicateResolutionPanel } from '../components/ExploreDuplicateResolutionPanel';
import { ExploreEntityEditorDialog } from '../components/ExploreEntityEditorDialog';
import { ExploreEntityManagementPanel } from '../components/ExploreEntityManagementPanel';
import { ExploreReviewQueuePanel } from '../components/ExploreReviewQueuePanel';
import { useExploreAdminPendingDuplicateCount } from '../hooks/useExploreAdminDuplicateCandidates';
import { useExploreAdminReviewQueueCounts } from '../hooks/useExploreAdminReviewQueue';

export type ExploreAdminSection =
  | 'overview'
  | 'entities'
  | 'relationships'
  | 'sources'
  | 'duplicates'
  | 'imports'
  | 'review';

interface DashboardMetrics {
  entities: number;
  pendingReview: number;
  duplicateCandidates: number;
  activeImports: number;
}

export function ExploreAdminDashboard() {
  const [section, setSection] = useState<ExploreAdminSection>('overview');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const reviewCounts = useExploreAdminReviewQueueCounts();
  const duplicateCount = useExploreAdminPendingDuplicateCount();

  const metrics: DashboardMetrics = {
    entities: 0,
    pendingReview: reviewCounts.total,
    duplicateCandidates: duplicateCount.data ?? 0,
    activeImports: 0,
  };

  const metricsLoading = reviewCounts.isLoading || duplicateCount.isLoading;

  function handleSectionChange(nextSection: ExploreAdminSection) {
    setSection(nextSection);
    setSelectedEntityId(null);
  }

  return (
    <ExploreAdminShell
      activeSection={section}
      onSectionChange={handleSectionChange}
      counts={{
        review: metrics.pendingReview,
        duplicates: metrics.duplicateCandidates,
        imports: metrics.activeImports,
      }}
    >
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Explore Texas Administration</h1>
          <p className="mt-2 text-muted-foreground">
            Manage imported destinations, review pending changes, monitor source imports, and
            maintain the Explore Texas knowledge graph.
          </p>
        </header>

        {section === 'overview' ? (
          <Overview
            metrics={metrics}
            metricsLoading={metricsLoading}
            onOpenSection={handleSectionChange}
          />
        ) : section === 'entities' ? (
          <ExploreEntityManagementPanel onOpenEntity={setSelectedEntityId} />
        ) : section === 'review' ? (
          <ExploreReviewQueuePanel onOpenEntity={setSelectedEntityId} />
        ) : section === 'duplicates' ? (
          <ExploreDuplicateResolutionPanel onOpenEntity={setSelectedEntityId} />
        ) : (
          <SectionIntroduction section={section} />
        )}
      </div>

      <ExploreEntityEditorDialog
        entityId={selectedEntityId}
        open={selectedEntityId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedEntityId(null);
        }}
      />
    </ExploreAdminShell>
  );
}

interface OverviewProps {
  metrics: DashboardMetrics;
  metricsLoading: boolean;
  onOpenSection: (section: ExploreAdminSection) => void;
}

function Overview({ metrics, metricsLoading, onOpenSection }: OverviewProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Entities"
          value={metrics.entities}
          onClick={() => onOpenSection('entities')}
        />
        <DashboardCard
          title="Pending Review"
          value={metrics.pendingReview}
          loading={metricsLoading}
          onClick={() => onOpenSection('review')}
        />
        <DashboardCard
          title="Duplicate Candidates"
          value={metrics.duplicateCandidates}
          loading={metricsLoading}
          onClick={() => onOpenSection('duplicates')}
        />
        <DashboardCard
          title="Running Imports"
          value={metrics.activeImports}
          onClick={() => onOpenSection('imports')}
        />
      </div>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Administration workspace</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Use the navigation to maintain Explore Texas records, inspect relationships, review
          source provenance, resolve duplicate candidates, and monitor import execution.
        </p>
      </section>
    </>
  );
}

interface DashboardCardProps {
  title: string;
  value: number;
  loading?: boolean;
  onClick: () => void;
}

function DashboardCard({ title, value, loading = false, onClick }: DashboardCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border bg-card p-6 text-left transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-3 text-3xl font-bold" aria-busy={loading}>
        {loading ? '—' : value.toLocaleString()}
      </div>
    </button>
  );
}

function SectionIntroduction({
  section,
}: {
  section: Exclude<ExploreAdminSection, 'overview' | 'entities' | 'review' | 'duplicates'>;
}) {
  const descriptions: Record<typeof section, string> = {
    relationships:
      'Inspect how destinations, regions, activities, amenities, and editorial collections connect.',
    sources:
      'Manage source definitions, provenance, trust settings, and synchronization configuration.',
    imports:
      'Monitor import jobs, execution statistics, validation failures, warnings, and rollback state.',
  };

  return (
    <section className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold">{sectionTitle(section)}</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{descriptions[section]}</p>
    </section>
  );
}

function sectionTitle(section: ExploreAdminSection): string {
  switch (section) {
    case 'overview':
      return 'Overview';
    case 'entities':
      return 'Entity Management';
    case 'relationships':
      return 'Relationship Explorer';
    case 'sources':
      return 'Import Sources';
    case 'duplicates':
      return 'Duplicate Resolution';
    case 'imports':
      return 'Import Health';
    case 'review':
      return 'Review Queue';
  }
}
