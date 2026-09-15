import { KTR_PREFERRED_SOURCE_URL } from "@/lib/google-preferred-source";

type Props = {
  compact?: boolean;
};

export function GooglePreferredSourceCta({ compact = false }: Props) {
  return (
    <aside
      className={
        compact
          ? "rounded-md border border-border bg-background px-4 py-3"
          : "mt-5 flex flex-col gap-3 border border-border bg-muted/35 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
      }
      aria-label="Follow Keep TX Red on Google"
      data-google-preferred-source-cta="true"
    >
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Google Preferred Sources</p>
        <p className="mt-1 text-sm leading-5 text-foreground">
          Want to see more Keep TX Red reporting in Google? Add us as a Preferred Source.
        </p>
      </div>
      <a
        href={KTR_PREFERRED_SOURCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center rounded-md border border-primary bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
        data-google-preferred-source-link="true"
      >
        Add on Google ↗
      </a>
    </aside>
  );
}
