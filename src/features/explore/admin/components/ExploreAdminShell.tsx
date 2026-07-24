import type { ComponentType, ReactNode } from "react";
import {
  AlertTriangle,
  Database,
  FileSearch,
  LayoutDashboard,
  Map,
  Network,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ExploreAdminSection =
  | "overview"
  | "entities"
  | "relationships"
  | "sources"
  | "duplicates"
  | "imports"
  | "reviews";

type ExploreAdminNavigationItem = {
  id: ExploreAdminSection;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const EXPLORE_ADMIN_NAVIGATION: readonly ExploreAdminNavigationItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Platform health and content readiness",
    icon: LayoutDashboard,
  },
  {
    id: "entities",
    label: "Entities",
    description: "Destinations, wildlife, activities, and resources",
    icon: Map,
  },
  {
    id: "relationships",
    label: "Relationships",
    description: "Connections between Explore Texas records",
    icon: Network,
  },
  {
    id: "sources",
    label: "Sources",
    description: "Provenance, citations, and source confidence",
    icon: FileSearch,
  },
  {
    id: "duplicates",
    label: "Duplicates",
    description: "Potential duplicate entity review",
    icon: Search,
  },
  {
    id: "imports",
    label: "Import Health",
    description: "Import runs, failures, and record status",
    icon: Upload,
  },
  {
    id: "reviews",
    label: "Review Queue",
    description: "Editorial and publication review items",
    icon: ShieldCheck,
  },
] as const;

type ExploreAdminShellProps = {
  activeSection: ExploreAdminSection;
  onSectionChange: (section: ExploreAdminSection) => void;
  children: ReactNode;
  reviewCount?: number;
  importFailureCount?: number;
  duplicateCount?: number;
  className?: string;
};

export function ExploreAdminShell({
  activeSection,
  onSectionChange,
  children,
  reviewCount = 0,
  importFailureCount = 0,
  duplicateCount = 0,
  className,
}: ExploreAdminShellProps) {
  const activeNavigationItem =
    EXPLORE_ADMIN_NAVIGATION.find((item) => item.id === activeSection) ??
    EXPLORE_ADMIN_NAVIGATION[0];

  return (
    <section
      aria-labelledby="explore-texas-admin-heading"
      className={cn(
        "overflow-hidden border-2 border-foreground/10 bg-card",
        className,
      )}
    >
      <header className="border-b-4 border-primary bg-secondary px-5 py-6 text-secondary-foreground sm:px-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              <Database className="h-3.5 w-3.5" aria-hidden="true" />
              Internal CMS
            </div>

            <h2
              id="explore-texas-admin-heading"
              className="mt-2 font-display text-3xl leading-none tracking-tight sm:text-4xl"
            >
              Explore Texas <span className="text-primary">Admin</span>
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Manage Explore Texas entities, relationships, sources, imports,
              and editorial review without exposing draft content publicly.
            </p>
          </div>

          <StatusSummary
            reviewCount={reviewCount}
            importFailureCount={importFailureCount}
            duplicateCount={duplicateCount}
          />
        </div>
      </header>

      <div className="grid min-h-[640px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside
          aria-label="Explore Texas administration"
          className="border-b border-border bg-muted/30 p-3 lg:border-b-0 lg:border-r"
        >
          <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
            {EXPLORE_ADMIN_NAVIGATION.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeSection;
              const badgeCount = getNavigationBadgeCount(item.id, {
                reviewCount,
                importFailureCount,
                duplicateCount,
              });

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "group flex w-full items-start gap-3 border-l-4 px-3 py-3 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isActive
                      ? "border-primary bg-background shadow-sm"
                      : "border-transparent hover:border-primary/40 hover:bg-background/70",
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm font-bold",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </span>

                      {badgeCount > 0 ? (
                        <span
                          className={cn(
                            "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                            item.id === "imports"
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-primary text-primary-foreground",
                          )}
                        >
                          {formatBadgeCount(badgeCount)}
                        </span>
                      ) : null}
                    </span>

                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 bg-background">
          <div className="border-b border-border px-5 py-4 sm:px-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Explore Texas
            </div>
            <h3 className="mt-1 font-display text-2xl">
              {activeNavigationItem.label}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeNavigationItem.description}
            </p>
          </div>

          <div className="p-5 sm:p-7">{children}</div>
        </main>
      </div>
    </section>
  );
}

type StatusSummaryProps = {
  reviewCount: number;
  importFailureCount: number;
  duplicateCount: number;
};

function StatusSummary({
  reviewCount,
  importFailureCount,
  duplicateCount,
}: StatusSummaryProps) {
  const requiresAttention =
    reviewCount > 0 || importFailureCount > 0 || duplicateCount > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusChip
        label="Reviews"
        value={reviewCount}
        tone={reviewCount > 0 ? "attention" : "healthy"}
      />
      <StatusChip
        label="Duplicates"
        value={duplicateCount}
        tone={duplicateCount > 0 ? "attention" : "healthy"}
      />
      <StatusChip
        label="Import failures"
        value={importFailureCount}
        tone={importFailureCount > 0 ? "critical" : "healthy"}
      />

      <div
        className={cn(
          "inline-flex h-9 items-center gap-2 border px-3 text-xs font-bold uppercase tracking-wider",
          requiresAttention
            ? "border-amber-300 bg-amber-100 text-amber-950"
            : "border-emerald-300 bg-emerald-100 text-emerald-950",
        )}
      >
        {requiresAttention ? (
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {requiresAttention ? "Action needed" : "Systems healthy"}
      </div>
    </div>
  );
}

type StatusChipProps = {
  label: string;
  value: number;
  tone: "healthy" | "attention" | "critical";
};

function StatusChip({ label, value, tone }: StatusChipProps) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center gap-2 border px-3 text-xs",
        tone === "critical" &&
          "border-red-300 bg-red-100 text-red-950",
        tone === "attention" &&
          "border-amber-300 bg-amber-100 text-amber-950",
        tone === "healthy" &&
          "border-white/20 bg-white/10 text-white",
      )}
    >
      <span className="font-medium">{label}</span>
      <span className="font-bold tabular-nums">{value.toLocaleString()}</span>
    </div>
  );
}

type NavigationCounts = {
  reviewCount: number;
  importFailureCount: number;
  duplicateCount: number;
};

function getNavigationBadgeCount(
  section: ExploreAdminSection,
  counts: NavigationCounts,
): number {
  switch (section) {
    case "reviews":
      return counts.reviewCount;
    case "imports":
      return counts.importFailureCount;
    case "duplicates":
      return counts.duplicateCount;
    default:
      return 0;
  }
}

function formatBadgeCount(value: number): string {
  return value > 99 ? "99+" : value.toLocaleString();
}

export function ExploreAdminSectionButton({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return <Button {...props}>{children}</Button>;
}
