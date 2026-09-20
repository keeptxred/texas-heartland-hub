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
            Keep TX Red delivers Texas news, commentary, government accountability, and common-sense analysis.
          </strong>
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl">
          We are a news publication — not a political action committee, campaign, or candidate organization. Our editors and
          contributors publish reporting, commentary, and explainers focused on Texas government, elections, the economy,
          the border, energy, and statewide developments, with source attribution and publication-quality checks appropriate to the material.
        </p>
      </div>
    </section>
  );
}