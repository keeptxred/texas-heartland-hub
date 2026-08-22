export interface RelatedResourceItem {
  title: string;
  href: string;
  description?: string;
  eyebrow?: string;
}

export interface RelatedResourcesProps {
  resources: readonly RelatedResourceItem[];
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export function RelatedResources({
  resources,
  title = "Helpful election resources",
  description = "Use these KeepTXRed guides and tools to prepare for the next Texas election.",
  className = "",
  compact = false,
}: RelatedResourcesProps) {
  if (resources.length === 0) return null;

  return (
    <section
      aria-labelledby="related-election-resources"
      className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className}`.trim()}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">KeepTXRed guides</p>
        <h2 id="related-election-resources" className="mt-2 font-display text-3xl leading-none tracking-tight text-foreground">
          {title}
        </h2>
        {description && <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>

      <ul className={`mt-6 grid gap-4 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {resources.map((resource) => (
          <li key={`${resource.href}-${resource.title}`}>
            <a
              href={resource.href}
              className="group block h-full rounded-lg border border-border bg-muted/30 p-4 transition hover:-translate-y-0.5 hover:border-primary hover:bg-background hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {resource.eyebrow && (
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  {resource.eyebrow}
                </span>
              )}
              <h3 className="mt-1 font-semibold text-foreground group-hover:text-primary">{resource.title}</h3>
              {resource.description && (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
              )}
              <span className="mt-3 inline-block text-sm font-semibold text-primary">View resource →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RelatedResources;
