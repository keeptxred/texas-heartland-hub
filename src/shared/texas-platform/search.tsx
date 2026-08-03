import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  SHARED_ENTITIES,
  searchEntityCollection,
  type SharedEntity,
  type SharedEntityType,
} from "./entities";
import { mergeEntityCollections } from "./adapters";
import type { SharedSite } from "./registry";

const TYPE_LABELS: Record<SharedEntityType, string> = {
  city: "City",
  county: "County",
  representative: "Representative",
  bill: "Bill",
  committee: "Committee",
  agency: "Agency",
  guide: "Guide",
  calculator: "Calculator",
  park: "Park",
  "school-district": "School district",
  resource: "Resource",
};

export function SharedResourceSearch({
  site,
  entities = [],
  isLoading = false,
  title = "Search Texas resources",
  description = "Search guides, calculators, representatives, laws, government information and community resources.",
}: {
  site: SharedSite;
  entities?: ReadonlyArray<SharedEntity>;
  isLoading?: boolean;
  title?: string;
  description?: string;
}) {
  const [query, setQuery] = useState("");
  const searchableEntities = useMemo(() => mergeEntityCollections(SHARED_ENTITIES, entities), [entities]);
  const results = useMemo(
    () => searchEntityCollection(query, searchableEntities, site, 12),
    [query, searchableEntities, site],
  );
  const hasQuery = query.trim().length > 0;

  return (
    <section className="rounded-2xl border bg-card p-6 sm:p-8" aria-labelledby="shared-resource-search-title">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Find an answer</p>
        <h2 id="shared-resource-search-title" className="mt-2 font-display text-4xl">{title}</h2>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </div>

      <label className="relative mt-6 block">
        <span className="sr-only">Search Texas resources and representatives</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try property taxes, Charles Schwertner, House District 132, mortgage or Texas laws"
          className="h-14 w-full rounded-xl border bg-background pl-12 pr-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          autoComplete="off"
        />
      </label>

      {hasQuery && (
        <div className="mt-5" aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">Searching current Texas resources…</div>
          ) : results.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {results.map((entity) => (
                <Link
                  key={entity.id}
                  to={entity.route}
                  className="rounded-xl border bg-background p-4 transition hover:border-primary hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{entity.title}</h3>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                          {TYPE_LABELS[entity.type]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{entity.summary}</p>
                    </div>
                    {entity.officialSources?.length ? (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">Official source</span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
              No matching resources yet. Try a broader term such as taxes, moving, representative, district, government or laws.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
