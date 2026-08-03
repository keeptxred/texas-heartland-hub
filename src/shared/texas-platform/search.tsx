import { Link } from "@tanstack/react-router";
import { Link2, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  SHARED_ENTITIES,
  searchEntityCollection,
  type SharedEntity,
  type SharedEntityType,
} from "./entities";
import { mergeEntityCollections } from "./adapters";
import {
  searchTypeCounts,
  SEARCH_TYPE_LABELS,
} from "./search-filters";
import {
  paginatedSearchResults,
  SEARCH_PAGE_SIZE,
} from "./search-pagination";
import { resourceSearchHref } from "./search-params";
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

const SUGGESTED_SEARCHES = [
  "Property taxes",
  "Moving to Texas",
  "Find my representative",
  "Mortgage calculator",
  "Texas laws",
];

export function SharedResourceSearch({
  site,
  entities = [],
  isLoading = false,
  title = "Search Texas resources",
  description = "Search guides, calculators, representatives, laws, government information and community resources.",
  initialQuery = "",
  initialType = "all",
}: {
  site: SharedSite;
  entities?: ReadonlyArray<SharedEntity>;
  isLoading?: boolean;
  title?: string;
  description?: string;
  initialQuery?: string;
  initialType?: SharedEntityType | "all";
}) {
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<SharedEntityType | "all">(initialType);
  const [visibleCount, setVisibleCount] = useState(SEARCH_PAGE_SIZE);
  const searchableEntities = useMemo(() => mergeEntityCollections(SHARED_ENTITIES, entities), [entities]);
  const results = useMemo(
    () => searchEntityCollection(query, searchableEntities, site, 80),
    [query, searchableEntities, site],
  );
  const typeCounts = useMemo(() => searchTypeCounts(results), [results]);
  const page = useMemo(
    () => paginatedSearchResults(results, activeType, visibleCount),
    [activeType, results, visibleCount],
  );
  const hasQuery = query.trim().length > 0;
  const shareHref = useMemo(() => resourceSearchHref(query, activeType), [activeType, query]);

  useEffect(() => {
    setQuery(initialQuery);
    setActiveType(initialType);
    setVisibleCount(SEARCH_PAGE_SIZE);
  }, [initialQuery, initialType]);

  useEffect(() => {
    if (activeType !== "all" && !typeCounts.some((item) => item.type === activeType)) {
      setActiveType("all");
    }
  }, [activeType, typeCounts]);

  useEffect(() => {
    setVisibleCount(SEARCH_PAGE_SIZE);
  }, [query, activeType]);

  function clearSearch() {
    setQuery("");
    setActiveType("all");
    setVisibleCount(SEARCH_PAGE_SIZE);
  }

  function chooseSuggestion(suggestion: string) {
    setQuery(suggestion);
    setActiveType("all");
  }

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
          className="h-14 w-full rounded-xl border bg-background pl-12 pr-12 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          autoComplete="off"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Clear resource search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </label>

      {!hasQuery ? (
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Suggested searches">
          {SUGGESTED_SEARCHES.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => chooseSuggestion(suggestion)}
              className="rounded-full border bg-background px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      {hasQuery && (
        <div className="mt-5" aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">Searching current Texas resources…</div>
          ) : results.length ? (
            <>
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter search results by type">
                <button
                  type="button"
                  onClick={() => setActiveType("all")}
                  aria-pressed={activeType === "all"}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${activeType === "all" ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary hover:text-primary"}`}
                >
                  All ({results.length})
                </button>
                {typeCounts.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setActiveType(item.type)}
                    aria-pressed={activeType === item.type}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${activeType === item.type ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary hover:text-primary"}`}
                  >
                    {item.label} ({item.count})
                  </button>
                ))}
              </div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing {page.visible.length} of {page.total} {activeType === "all" ? "matches" : SEARCH_TYPE_LABELS[activeType].toLowerCase()}
                </p>
                <Link
                  to={shareHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  aria-label="Open a shareable link for this resource search"
                >
                  <Link2 className="size-4" /> Share this search
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {page.visible.map((entity) => (
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
              {page.canLoadMore ? (
                <button
                  type="button"
                  onClick={() => setVisibleCount(page.nextVisibleCount)}
                  className="mt-5 rounded-md border bg-background px-4 py-2.5 text-sm font-bold hover:border-primary hover:text-primary"
                >
                  Show more results
                </button>
              ) : null}
            </>
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
