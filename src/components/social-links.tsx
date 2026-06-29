const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61591363654407",
    label: "Follow Keep Texas Red on Facebook",
  },
] as const;

export function SocialLinks({ variant = "default" }: { variant?: "default" | "footer" }) {
  const isFooter = variant === "footer";
  return (
    <section
      aria-label="Follow Keep Texas Red"
      className={
        isFooter
          ? "mt-8 pt-6 border-t border-white/10 text-white/85"
          : "mt-10 border-t border-border pt-6"
      }
    >
      <h3
        className={
          isFooter
            ? "font-display text-sm tracking-[0.25em] uppercase text-accent mb-3"
            : "font-display text-xs tracking-[0.25em] uppercase text-primary mb-3"
        }
      >
        ★ Follow Keep Texas Red
      </h3>
      <p className={isFooter ? "text-sm text-white/75 max-w-2xl" : "text-sm text-muted-foreground max-w-2xl"}>
        Stay connected with our Texas-focused newsroom. Follow Keep Texas Red on social media for breaking Lone Star headlines,
        legislative updates, election coverage, and policy explainers as they publish. We share the same reporting you read on
        keeptxred.com — straight from our editors, verified against primary Texas sources, and delivered without spin.
      </p>
      <ul className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
        {SOCIAL_LINKS.map((s) => (
          <li key={s.name}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className={
                isFooter
                  ? "inline-flex items-center gap-2 px-4 py-2 border border-white/25 hover:border-accent hover:text-accent transition-colors uppercase tracking-[0.2em] text-xs"
                  : "inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 hover:border-primary hover:text-primary transition-colors uppercase tracking-[0.2em] text-xs"
              }
            >
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}