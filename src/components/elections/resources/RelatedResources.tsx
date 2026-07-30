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
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`.trim()}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">KeepTXRed guides</p>
        <h2 id="related-election-resources" className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>}
      </div>

      <ul className={`mt-6 grid gap-4 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {resources.map((resource) => (
          <li key={`${resource.href}-${resource.title}`}>
            <a
              href={resource.href}
              className="group block h-full rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
            >
              {resource.eyebrow && (
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-700">
                  {resource.eyebrow}
                </span>
              )}
              <h3 className="mt-1 font-semibold text-slate-950 group-hover:text-red-700">{resource.title}</h3>
              {resource.description && (
                <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>
              )}
              <span className="mt-3 inline-block text-sm font-semibold text-red-700">View resource →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RelatedResources;
