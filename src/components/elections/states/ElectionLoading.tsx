export type ElectionLoadingVariant =
  | "page"
  | "section"
  | "cards"
  | "list"
  | "metrics"
  | "detail";

export interface ElectionLoadingProps {
  variant?: ElectionLoadingVariant;
  label?: string;
  count?: number;
  className?: string;
}

const shimmerClass =
  "animate-pulse rounded bg-slate-200 motion-reduce:animate-none";

function LoadingLine({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`${shimmerClass} h-3 ${className}`.trim()} />;
}

function LoadingCard() {
  return (
    <div aria-hidden="true" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className={`${shimmerClass} h-3 w-24`} />
          <div className={`${shimmerClass} h-6 w-3/4`} />
          <div className={`${shimmerClass} h-3 w-full`} />
          <div className={`${shimmerClass} h-3 w-5/6`} />
        </div>
        <div className={`${shimmerClass} h-12 w-12 shrink-0 rounded-full`} />
      </div>
      <div className="mt-5 flex gap-2">
        <div className={`${shimmerClass} h-8 w-24`} />
        <div className={`${shimmerClass} h-8 w-20`} />
      </div>
    </div>
  );
}

function LoadingMetric() {
  return (
    <div aria-hidden="true" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`${shimmerClass} h-3 w-24`} />
      <div className={`${shimmerClass} mt-4 h-9 w-20`} />
      <div className={`${shimmerClass} mt-3 h-3 w-32`} />
    </div>
  );
}

function LoadingListItem() {
  return (
    <li aria-hidden="true" className="flex items-start gap-4 border-b border-slate-200 py-4 last:border-b-0">
      <div className={`${shimmerClass} h-10 w-10 shrink-0 rounded-full`} />
      <div className="min-w-0 flex-1 space-y-3">
        <div className={`${shimmerClass} h-4 w-2/3`} />
        <div className={`${shimmerClass} h-3 w-full`} />
        <div className={`${shimmerClass} h-3 w-1/2`} />
      </div>
    </li>
  );
}

export function ElectionLoading({
  variant = "section",
  label = "Loading Election Central data",
  count = 4,
  className = "",
}: ElectionLoadingProps) {
  const safeCount = Math.max(1, Math.min(count, 12));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={className}
    >
      <span className="sr-only">{label}</span>

      {variant === "metrics" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: safeCount }, (_, index) => (
            <LoadingMetric key={index} />
          ))}
        </div>
      ) : null}

      {variant === "cards" ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: safeCount }, (_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      ) : null}

      {variant === "list" ? (
        <ul className="rounded-xl border border-slate-200 bg-white px-5 shadow-sm">
          {Array.from({ length: safeCount }, (_, index) => (
            <LoadingListItem key={index} />
          ))}
        </ul>
      ) : null}

      {variant === "detail" ? (
        <div aria-hidden="true" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className={`${shimmerClass} h-3 w-28`} />
            <div className={`${shimmerClass} h-9 w-3/4`} />
            <div className={`${shimmerClass} h-4 w-full`} />
            <div className={`${shimmerClass} h-4 w-5/6`} />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className={`${shimmerClass} h-28 w-full`} />
            <div className={`${shimmerClass} h-28 w-full`} />
          </div>
          <div className="mt-8 space-y-3">
            <LoadingLine className="w-full" />
            <LoadingLine className="w-full" />
            <LoadingLine className="w-4/5" />
            <LoadingLine className="w-2/3" />
          </div>
        </div>
      ) : null}

      {variant === "section" ? (
        <div aria-hidden="true" className="space-y-5">
          <div className="space-y-3">
            <div className={`${shimmerClass} h-3 w-28`} />
            <div className={`${shimmerClass} h-7 w-64 max-w-full`} />
            <div className={`${shimmerClass} h-4 w-full max-w-2xl`} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: Math.min(safeCount, 4) }, (_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </div>
      ) : null}

      {variant === "page" ? (
        <div aria-hidden="true" className="space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`${shimmerClass} h-3 w-32`} />
            <div className={`${shimmerClass} mt-4 h-10 w-80 max-w-full`} />
            <div className={`${shimmerClass} mt-4 h-4 w-full max-w-3xl`} />
            <div className={`${shimmerClass} mt-3 h-4 w-4/5 max-w-2xl`} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <LoadingMetric key={index} />
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: Math.min(safeCount, 6) }, (_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ElectionPageLoading(props: Omit<ElectionLoadingProps, "variant">) {
  return <ElectionLoading variant="page" {...props} />;
}

export function ElectionCardGridLoading(props: Omit<ElectionLoadingProps, "variant">) {
  return <ElectionLoading variant="cards" {...props} />;
}

export function ElectionListLoading(props: Omit<ElectionLoadingProps, "variant">) {
  return <ElectionLoading variant="list" {...props} />;
}

export function ElectionMetricsLoading(props: Omit<ElectionLoadingProps, "variant">) {
  return <ElectionLoading variant="metrics" {...props} />;
}

export default ElectionLoading;
