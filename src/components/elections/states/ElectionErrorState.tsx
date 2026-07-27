export type ElectionErrorKind =
  | "generic"
  | "network"
  | "timeout"
  | "stale"
  | "service"
  | "not_found"
  | "permission"
  | "admin_operation";

export interface ElectionErrorAction {
  label: string;
  href?: string;
  onClick?: () => void;
  description?: string;
}

export interface ElectionErrorStateProps {
  kind?: ElectionErrorKind;
  title?: string;
  message?: string;
  technicalMessage?: string;
  retryAction?: ElectionErrorAction;
  secondaryActions?: readonly ElectionErrorAction[];
  showTechnicalMessage?: boolean;
  compact?: boolean;
  className?: string;
}

interface ElectionErrorPreset {
  eyebrow: string;
  title: string;
  message: string;
  symbol: string;
}

const ERROR_PRESETS: Record<ElectionErrorKind, ElectionErrorPreset> = {
  generic: {
    eyebrow: "Election Central",
    title: "We could not load this election information",
    message: "The requested election data is temporarily unavailable. Try again or use one of the related resources below.",
    symbol: "!",
  },
  network: {
    eyebrow: "Connection problem",
    title: "Election data could not be reached",
    message: "Your connection or the data service may be unavailable. Check your connection and try again.",
    symbol: "↻",
  },
  timeout: {
    eyebrow: "Request timed out",
    title: "This election update is taking too long",
    message: "The data source did not respond in time. No results or forecasts have been changed. Try the request again.",
    symbol: "◷",
  },
  stale: {
    eyebrow: "Update delayed",
    title: "The latest election data is not current",
    message: "We are showing the most recently verified information while a newer update is being checked. Treat live totals, polling, and forecasts as potentially outdated.",
    symbol: "△",
  },
  service: {
    eyebrow: "Service unavailable",
    title: "An election data provider is temporarily unavailable",
    message: "A source used by Election Central is not responding. We will not substitute unverified figures or estimates.",
    symbol: "×",
  },
  not_found: {
    eyebrow: "Not found",
    title: "This election page is unavailable",
    message: "The race, candidate, poll, forecast, or result may not be published yet, may have moved, or may no longer be active.",
    symbol: "?",
  },
  permission: {
    eyebrow: "Access required",
    title: "You do not have access to this election workspace",
    message: "Open the editorial admin dashboard and unlock the session before returning to this page.",
    symbol: "•",
  },
  admin_operation: {
    eyebrow: "Admin action failed",
    title: "The Election Central change was not saved",
    message: "The operation did not complete. Existing published election data was not replaced. Review the inputs and try again.",
    symbol: "!",
  },
};

const DEFAULT_SECONDARY_ACTIONS: readonly ElectionErrorAction[] = [
  {
    label: "Election Central home",
    href: "/elections",
    description: "Return to the main Texas election hub.",
  },
  {
    label: "Texas election laws",
    href: "/laws/texas-election-laws-explained",
    description: "Review voter registration, voting, and election-law guidance.",
  },
  {
    label: "Register to vote",
    href: "/register-to-vote",
    description: "Use the KeepTXRed voter registration guide.",
  },
];

function ElectionErrorActionControl({ action, primary = false }: { action: ElectionErrorAction; primary?: boolean }) {
  const className = primary
    ? "inline-flex min-h-11 items-center justify-center rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
    : "block rounded-lg border border-red-200 bg-white p-4 text-left transition hover:border-red-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2";

  if (action.href) {
    return (
      <a href={action.href} className={className} onClick={action.onClick}>
        {primary ? (
          <>{action.label} →</>
        ) : (
          <>
            <span className="text-sm font-semibold text-red-700">{action.label} →</span>
            {action.description ? <span className="mt-1 block text-sm leading-5 text-slate-600">{action.description}</span> : null}
          </>
        )}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={action.onClick}>
      {primary ? (
        <>{action.label} →</>
      ) : (
        <>
          <span className="text-sm font-semibold text-red-700">{action.label} →</span>
          {action.description ? <span className="mt-1 block text-sm leading-5 text-slate-600">{action.description}</span> : null}
        </>
      )}
    </button>
  );
}

export function ElectionErrorState({
  kind = "generic",
  title,
  message,
  technicalMessage,
  retryAction,
  secondaryActions = DEFAULT_SECONDARY_ACTIONS,
  showTechnicalMessage = false,
  compact = false,
  className = "",
}: ElectionErrorStateProps) {
  const preset = ERROR_PRESETS[kind];

  return (
    <section
      role="alert"
      aria-live="assertive"
      className={`rounded-xl border border-red-200 bg-red-50 ${compact ? "p-5" : "px-6 py-10 text-center"} ${className}`.trim()}
    >
      <div
        aria-hidden="true"
        className={`${compact ? "h-10 w-10" : "mx-auto h-12 w-12"} flex items-center justify-center rounded-full bg-white text-xl font-bold text-red-700 shadow-sm ring-1 ring-red-200`}
      >
        {preset.symbol}
      </div>

      <div className={compact ? "mt-4" : "mt-5"}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">{preset.eyebrow}</p>
        <h2 className={`${compact ? "text-xl" : "mx-auto max-w-2xl text-2xl"} mt-2 font-bold tracking-tight text-slate-950`}>
          {title ?? preset.title}
        </h2>
        <p className={`${compact ? "max-w-3xl" : "mx-auto max-w-2xl"} mt-3 text-sm leading-6 text-slate-700`}>
          {message ?? preset.message}
        </p>
      </div>

      {showTechnicalMessage && technicalMessage ? (
        <details className={`${compact ? "max-w-3xl" : "mx-auto max-w-2xl"} mt-5 rounded-lg border border-red-200 bg-white p-4 text-left`}>
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">Technical details</summary>
          <p className="mt-2 break-words font-mono text-xs leading-5 text-slate-600">{technicalMessage}</p>
        </details>
      ) : null}

      {retryAction ? (
        <div className={compact ? "mt-5" : "mt-6"}>
          <ElectionErrorActionControl action={retryAction} primary />
        </div>
      ) : null}

      {secondaryActions.length > 0 ? (
        <nav
          aria-label="Election error recovery resources"
          className={`${compact ? "mt-5" : "mx-auto mt-7 max-w-3xl"} border-t border-red-200 pt-5`}
        >
          <ul className="grid gap-3 text-left sm:grid-cols-2">
            {secondaryActions.map((action) => (
              <li key={`${action.href ?? "button"}-${action.label}`}>
                <ElectionErrorActionControl action={action} />
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </section>
  );
}

export function ElectionLoadError(props: Omit<ElectionErrorStateProps, "kind">) {
  return <ElectionErrorState kind="network" {...props} />;
}

export function ElectionStaleDataError(props: Omit<ElectionErrorStateProps, "kind">) {
  return <ElectionErrorState kind="stale" {...props} />;
}

export function ElectionServiceError(props: Omit<ElectionErrorStateProps, "kind">) {
  return <ElectionErrorState kind="service" {...props} />;
}

export function ElectionNotFoundError(props: Omit<ElectionErrorStateProps, "kind">) {
  return <ElectionErrorState kind="not_found" {...props} />;
}

export function ElectionAdminOperationError(props: Omit<ElectionErrorStateProps, "kind">) {
  return <ElectionErrorState kind="admin_operation" {...props} />;
}

export default ElectionErrorState;
