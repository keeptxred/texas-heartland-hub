## Root cause

Production database is missing the Explore public read layer. The base `explore_*` tables exist (31 tables), but these objects were **never applied**:

- View `public.explore_public_entities`
- View `public.explore_public_observations`
- RPC `public.search_explore_entities`
- RPC `public.autocomplete_explore_entities`
- Table `public.explore_trips` (+ related trip sharing objects)
- Import-platform grants

The three migrations that create them exist in the repo but never ran on production:

- `20260725120000_explore_public_platform.sql`
- `20260725143000_grant_explore_import_access.sql`
- `20260725160000_explore_aliases_and_trip_sharing.sql`

`getExploreLanding()` calls `client.rpc('search_explore_entities', …)` six times in parallel. Every call throws `Explore search failed: Could not find the function public.search_explore_entities`, the loader rejects, and TanStack renders the root error boundary — hence the "This page didn't load" screen at `/explore`. `/explore/search` and `/explore/trip-planner` share the same service and fail for the same reason.

## Fix

Two changes only — no redesign, no new files beyond one migration.

### 1. Re-apply the three missing migrations as a single new migration

Create one migration whose body is the concatenation of the three unapplied SQL files, in their original order. Same SQL, same object names, same grants, same RLS. No edits to their semantics.

This restores:

- The `explore_public_entities` and `explore_public_observations` views (with the anon/authenticated grants and RLS the originals defined).
- The `search_explore_entities` and `autocomplete_explore_entities` SQL functions.
- The `explore_entity_slug_history` grants and the `explore_trips` table + share-token policies.
- The import-platform grants from the middle migration.

### 2. Harden the public Explore service so a query failure renders the empty state instead of crashing the page

File: `src/services/explore/public.functions.ts`

- Wrap the RPC call and facet query inside `search()` in a `try/catch`. On failure, `console.error` the underlying Supabase error with request context and return the empty fallback:

  ```
  { items: [], total: 0, page, pageSize, facets: { entityTypes: [], regions: [], counties: [], activities: [], amenities: [] } }
  ```

  (same shape `search()` already returns when `publicClient()` is null — reuse `emptyFacets()`).

- `getExploreLanding` needs no further change; because each `search()` call now resolves to the fallback instead of throwing, `Promise.all` succeeds and `ExploreLanding` renders its existing "Destination records are being prepared" empty state.

- Leave `getExploreEntity`, `getExploreSlugTarget`, `autocompleteExplore`, `getSharedExploreTrip`, and `generateExploreTrip` untouched — the request is explicit that fallbacks only apply to the landing experience, and those endpoints should keep surfacing errors.

### Out of scope (already correct)

- `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` env vars — verified populated (the service correctly built a `publicClient`; failure was inside the RPC, not client construction).
- The Explore route files, components, schemas, and types — no changes.
- Existing Explore migrations that already applied — untouched.

## Verification

- `bunx tsgo --noEmit`
- `bunx vitest run src/services/explore src/schemas/explore` (existing Explore tests)
- After the migration is approved and runs, hit `/explore`, `/explore/search`, and `/explore/trip-planner` in the preview to confirm they render (empty state acceptable if no published entities exist yet).

## Deliverables

- 1 new SQL migration file (concatenation of the three missing ones).
- Edits scoped to `search()` in `src/services/explore/public.functions.ts`.
