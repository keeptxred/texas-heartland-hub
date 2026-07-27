import { ElectionNoData, type ElectionNoDataAction } from "./ElectionNoData";

export type ElectionEmptyStateKind =
  | "races"
  | "candidates"
  | "polls"
  | "forecasts"
  | "results"
  | "search"
  | "filters"
  | "admin";

export interface ElectionEmptyStateProps {
  kind: ElectionEmptyStateKind;
  title?: string;
  message?: string;
  primaryAction?: ElectionNoDataAction;
  secondaryActions?: readonly ElectionNoDataAction[];
  className?: string;
}

interface ElectionEmptyStatePreset {
  title: string;
  message: string;
  icon: "ballot" | "poll" | "forecast" | "candidate" | "race";
  primaryAction?: ElectionNoDataAction;
  secondaryActions: readonly ElectionNoDataAction[];
}

const PUBLIC_RESOURCES = [
  {
    label: "Register to vote",
    href: "/register-to-vote",
    description: "Review Texas voter-registration requirements and deadlines.",
  },
  {
    label: "Texas election laws",
    href: "/laws",
    description: "Understand the laws and procedures that govern Texas elections.",
  },
] as const;

export const ELECTION_EMPTY_STATE_PRESETS: Record<ElectionEmptyStateKind, ElectionEmptyStatePreset> = {
  races: {
    title: "No races are available yet",
    message:
      "Race pages will appear after districts, offices, election dates, and candidate filings have been verified.",
    icon: "race",
    primaryAction: { label: "Return to Election Central", href: "/elections" },
    secondaryActions: PUBLIC_RESOURCES,
  },
  candidates: {
    title: "No candidate profiles are available yet",
    message:
      "Candidate profiles will be published after filing information, party details, and race assignments have been confirmed.",
    icon: "candidate",
    primaryAction: { label: "Browse election races", href: "/elections/races" },
    secondaryActions: PUBLIC_RESOURCES,
  },
  polls: {
    title: "No qualifying polls are available",
    message:
      "Election Central only displays polls with identifiable sources, field dates, sample details, and usable methodology information.",
    icon: "poll",
    primaryAction: { label: "Review forecast methodology", href: "/elections/methodology" },
    secondaryActions: [
      {
        label: "Follow Texas politics",
        href: "/texas-politics",
        description: "Read current reporting and analysis from across Texas.",
      },
      ...PUBLIC_RESOURCES,
    ],
  },
  forecasts: {
    title: "Forecasts are not available yet",
    message:
      "Forecasts will appear only after the model has sufficient verified race, candidate, polling, and contextual data.",
    icon: "forecast",
    primaryAction: { label: "Read the methodology", href: "/elections/methodology" },
    secondaryActions: PUBLIC_RESOURCES,
  },
  results: {
    title: "Election results are not reporting yet",
    message:
      "Results will appear when official reporting begins. All election-night totals remain unofficial until certified by the appropriate authority.",
    icon: "ballot",
    primaryAction: { label: "View Election Central", href: "/elections" },
    secondaryActions: PUBLIC_RESOURCES,
  },
  search: {
    title: "No election matches found",
    message:
      "Try a different candidate name, office, district, county, or election year.",
    icon: "ballot",
    primaryAction: { label: "Clear search", href: "/elections" },
    secondaryActions: [
      {
        label: "Browse all races",
        href: "/elections/races",
        description: "Explore available statewide, congressional, legislative, and local races.",
      },
      {
        label: "Browse candidates",
        href: "/elections/candidates",
        description: "Review available candidate profiles and race assignments.",
      },
    ],
  },
  filters: {
    title: "No elections match these filters",
    message:
      "Remove one or more filters or return to the complete Election Central view.",
    icon: "race",
    primaryAction: { label: "Reset filters", href: "/elections/races" },
    secondaryActions: PUBLIC_RESOURCES,
  },
  admin: {
    title: "No election records have been added",
    message:
      "This workspace is ready, but live race, candidate, polling, forecast, and results data have not been connected yet.",
    icon: "ballot",
    primaryAction: { label: "Open admin overview", href: "/admin/elections" },
    secondaryActions: [
      {
        label: "Preview public Election Central",
        href: "/elections",
        description: "Review the public shell and verify navigation before data publication.",
      },
      {
        label: "Return to editorial dashboard",
        href: "/admin",
        description: "Manage the broader KeepTXRed publishing workflow.",
      },
    ],
  },
};

export function ElectionEmptyState({
  kind,
  title,
  message,
  primaryAction,
  secondaryActions,
  className,
}: ElectionEmptyStateProps) {
  const preset = ELECTION_EMPTY_STATE_PRESETS[kind];

  return (
    <ElectionNoData
      eyebrow={kind === "admin" ? "Election Central Admin" : "Election Central"}
      title={title ?? preset.title}
      message={message ?? preset.message}
      icon={preset.icon}
      primaryAction={primaryAction ?? preset.primaryAction}
      secondaryActions={secondaryActions ?? preset.secondaryActions}
      className={className}
    />
  );
}

export const ElectionRacesEmpty = (props: Omit<ElectionEmptyStateProps, "kind">) => (
  <ElectionEmptyState kind="races" {...props} />
);

export const ElectionCandidatesEmpty = (props: Omit<ElectionEmptyStateProps, "kind">) => (
  <ElectionEmptyState kind="candidates" {...props} />
);

export const ElectionPollsEmpty = (props: Omit<ElectionEmptyStateProps, "kind">) => (
  <ElectionEmptyState kind="polls" {...props} />
);

export const ElectionForecastsEmpty = (props: Omit<ElectionEmptyStateProps, "kind">) => (
  <ElectionEmptyState kind="forecasts" {...props} />
);

export const ElectionResultsEmpty = (props: Omit<ElectionEmptyStateProps, "kind">) => (
  <ElectionEmptyState kind="results" {...props} />
);

export default ElectionEmptyState;
