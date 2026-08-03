import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { resourcesForSite, type SharedResource, type SharedSite } from "./registry";

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreResource(resource: SharedResource, query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;

  const title = normalize(resource.title);
  const description = normalize(resource.description);
  const topics = normalize(resource.topics.join(" "));
  const journeys = normalize(resource.journeys.join(" "));
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  let score = 0;
  if (title === normalizedQuery) score += 100;
  if (title.startsWith(normalizedQuery)) score += 60;
  if (title.includes(normalizedQuery)) score += 40;
  if (description.includes(normalizedQuery)) score += 20;

  for (const term of terms) {
    if (title.includes(term)) score += 12;
    if (description.includes(term)) score += 5;
    if (topics.includes(term)) score += 4;
    if (journeys.includes(term)) score += 3;
  }

  if (resource.featured) score += 2;
  if (resource.official) score += 1;
  return score;
}

export function searchSharedResources(query: string, site: SharedSite, limit = 8) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  return resourcesForSite(site)
    .map((resource) => ({ resource, score: scoreResource(resource, normalizedQuery) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.resource.title.localeCompare(b.resource.title))
    .slice(0, limit)
    .map((result) => result.resource);
}

export function SharedResourceSearch({
  site,
  title = "Search Texas resources",
  description = "Search guides, calculators, laws, government information and community resources.",
}: {
  site: SharedSite;
  title?: string;
  description?: string;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchSharedResources(query, site), [query, site]);
  const hasQuery = query.trim().length > 0;

  return (
    <section className="rounded-2xl border bg-card p-6 sm:p-8" aria-labelledby="shared-resource-search-title">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Find an answer</p>
        <h2 id="shared-resource-search-title" className="mt-2 font-display text-4xl">{title}</h2>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </div>

      <label className="relative mt-6 block">
        <span className="sr-only">Search Texas resources</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try property taxes, moving, representative, mortgage or Texas laws"
          className="h-14 w-full rounded-xl border bg-background pl-12 pr-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          autoComplete="off"
        />
      </label>

      {hasQuery && (
        <div className="mt-5" aria-live="polite">
          {results.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {results.map((resource) => (
                <Link
                  key={resource.id}
                  to={resource.route}
                  className="rounded-xl border bg-background p-4 transition hover:border-primary hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold">{resource.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{resource.description}</p>
                    </div>
                    {resource.official && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">Official</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
              No matching shared resources yet. Try a broader term such as taxes, moving, home, government or laws.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
