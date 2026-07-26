import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EntityGrid } from "@/components/explore/EntityGrid";
import { Button } from "@/components/ui/button";
import { exploreSearchSchema } from "@/schemas/explore/public.schema";
import { autocompleteExplore, searchExplore } from "@/services/explore/public.functions";
import type {
  ExploreAutocompleteItem,
  ExploreSearchInput,
  ExploreSearchResult,
} from "@/types/explore/public";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/explore/search")({
  validateSearch: (search) => exploreSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => searchExplore({ data: deps }),
  head: ({ loaderData }) => {
    const query = loaderData?.items.length
      ? `${loaderData.total} Texas destinations`
      : "Search Texas destinations";
    const seo = buildSeo({
      title: `${query} | Explore Texas`,
      description:
        "Search and filter published Texas destinations by type, region, county, activity, amenity, accessibility, family fit, and location.",
      path: "/explore/search",
      type: "website",
    });
    return { meta: [...seo.meta, { name: "robots", content: "noindex,follow" }], links: seo.links };
  },
  component: ExploreSearch,
});

function ExploreSearch() {
  const search = Route.useSearch() as ExploreSearchInput & {
    page: number;
    pageSize: number;
    sort: "relevance" | "name" | "distance";
  };
  const result = Route.useLoaderData() as ExploreSearchResult;
  const navigate = useNavigate({ from: Route.fullPath });
  const [query, setQuery] = useState(search.q ?? "");
  const [suggestions, setSuggestions] = useState<ExploreAutocompleteItem[]>([]);
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timeout = window.setTimeout(() => {
      void autocompleteExplore({ data: { q: query.trim(), limit: 8 } })
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 180);
    return () => window.clearTimeout(timeout);
  }, [query]);
  const setFilter = (key: "types" | "regions" | "activities", value: string) => {
    const current = (search[key] ?? []) as string[];
    const next = current.includes(value)
      ? current.filter((item: string) => item !== value)
      : [...current, value];
    void navigate({
      to: ".",
      search: (old: ExploreSearchInput) => ({
        ...old,
        [key]: next.length ? next : undefined,
        page: 1,
      }),
    });
  };
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Explore Texas directory
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">Find a Texas destination</h1>
          <p className="mt-2 text-muted-foreground">
            {result.total.toLocaleString()} published results
          </p>
        </div>
        <Button asChild>
          <Link to="/explore/trip-planner">Build a trip</Link>
        </Button>
      </div>
      <form
        className="relative mt-8 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void navigate({
            to: ".",
            search: (old: ExploreSearchInput) => ({ ...old, q: query || undefined, page: 1 }),
          });
        }}
      >
        <label htmlFor="directory-search" className="sr-only">
          Search destinations
        </label>
        <input
          id="directory-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
          aria-controls="explore-suggestions"
          className="h-11 flex-1 rounded-md border px-4"
          placeholder="Name, alternate name, activity, or place"
        />
        <Button type="submit">Search</Button>
        {suggestions.length > 0 && (
          <ul
            id="explore-suggestions"
            role="listbox"
            className="absolute left-0 right-24 top-12 z-20 overflow-hidden rounded-md border bg-popover shadow-lg"
          >
            {suggestions.map((item) => (
              <li key={item.slug} role="option" aria-selected="false">
                <Link
                  to="/explore/$slug"
                  params={{ slug: item.slug }}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-muted focus:bg-muted"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {[item.entityType.replaceAll("_", " "), item.region]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </form>
      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside aria-label="Search filters" className="space-y-6">
          {(
            [
              ["types", "Destination type", result.facets.entityTypes],
              ["regions", "Region", result.facets.regions],
              ["activities", "Activity", result.facets.activities],
            ] as const
          ).map(
            ([key, label, options]) =>
              options.length > 0 && (
                <fieldset key={key}>
                  <legend className="font-semibold">{label}</legend>
                  <div className="mt-2 max-h-52 space-y-2 overflow-auto">
                    {options.map((option: string) => (
                      <label key={option} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={(search[key] ?? []).includes(option)}
                          onChange={() => setFilter(key, option)}
                        />
                        <span>{option.replaceAll("_", " ")}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ),
          )}
          <fieldset>
            <legend className="font-semibold">Travel needs</legend>
            <div className="mt-2 space-y-2">
              {(
                [
                  ["familyFriendly", "Family friendly"],
                  ["petFriendly", "Pet friendly"],
                  ["accessible", "Accessibility features"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={search[key] === true}
                    onChange={() =>
                      void navigate({
                        to: ".",
                        search: (old: ExploreSearchInput) => ({
                          ...old,
                          [key]: old[key] ? undefined : true,
                          page: 1,
                        }),
                      })
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <Button
            variant="outline"
            onClick={() =>
              void navigate({ to: ".", search: { page: 1, pageSize: 24, sort: "relevance" } })
            }
          >
            Clear filters
          </Button>
        </aside>
        <div>
          {(() => {
            const hasFilters = Boolean(
              (search.q && search.q.trim()) ||
                (search.types && search.types.length) ||
                (search.regions && search.regions.length) ||
                (search.counties && search.counties.length) ||
                (search.activities && search.activities.length) ||
                (search.amenities && search.amenities.length) ||
                search.familyFriendly ||
                search.petFriendly ||
                search.accessible,
            );
            const emptyMessage =
              result.total === 0 && !hasFilters
                ? "Destination records are being prepared. Published Explore Texas destinations will appear here automatically after editorial review."
                : "No published destinations match this search. Try removing a filter or using a broader term.";
            return <EntityGrid items={result.items} empty={emptyMessage} />;
          })()}
          {result.total > result.pageSize && (
            <nav aria-label="Search results pages" className="mt-8 flex justify-center gap-3">
              <Button
                variant="outline"
                disabled={search.page <= 1}
                onClick={() =>
                  void navigate({
                    to: ".",
                    search: (old: ExploreSearchInput & { page: number }) => ({
                      ...old,
                      page: old.page - 1,
                    }),
                  })
                }
              >
                Previous
              </Button>
              <span className="self-center text-sm">
                Page {search.page} of {Math.ceil(result.total / result.pageSize)}
              </span>
              <Button
                variant="outline"
                disabled={search.page * result.pageSize >= result.total}
                onClick={() =>
                  void navigate({
                    to: ".",
                    search: (old: ExploreSearchInput & { page: number }) => ({
                      ...old,
                      page: old.page + 1,
                    }),
                  })
                }
              >
                Next
              </Button>
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}
