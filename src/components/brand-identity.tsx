export function BrandIdentity({ variant = "default" }: { variant?: "default" | "muted" }) {
  const isMuted = variant === "muted";
  return (
    <section
      aria-label="About Keep Texas Red"
      className={
        isMuted
          ? "border-t border-border bg-muted/40"
          : "border-t border-border"
      }
    >
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Brand Identity</span>
        <h2 className="font-display text-2xl md:text-3xl tracking-tight mt-2">
          Who We Are
        </h2>
        <p className="mt-3 text-base text-foreground leading-relaxed max-w-3xl">
          <strong>
            Keep Texas Red is a Texas-focused news and analysis outlet covering policy, elections, and issues shaping the state.
          </strong>
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl">
          We are a news publication — not a political action committee, campaign, or candidate organization. Our editors and
          contributors produce daily reporting and explainers focused on Texas government, elections, the economy, the border,
          energy, and statewide developments, sourced from primary Texas records and verified before publication.
        </p>
      </div>
    </section>
  );
}