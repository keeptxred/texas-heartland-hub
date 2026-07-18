// Central content-readiness helper. Callers use this to decide whether a
// category/section is thick enough to (a) render as its own destination
// page, (b) be listed in the sitemap, and (c) be marked indexable.
//
// Anything below the minimum should be `noindex,follow` and dropped from
// the sitemap so Google doesn't treat it as a thin/soft-404 page while
// we're still building the section out.

import { createClient } from "@supabase/supabase-js";

export const MIN_ARTICLES_DEFAULT = 3;

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type ReadinessFilter =
  | { kind: string }                       // daily_articles.kind = X
  | { kindIn: string[] }                   // kind IN (...)
  | { teamSlug: string; league?: string }; // teams[] contains slug

/** Count published articles matching a filter (best-effort; failures → 0). */
export async function countArticles(filter: ReadinessFilter): Promise<number> {
  const supabase = client();
  if (!supabase) return 0;
  let q = supabase
    .from("daily_articles")
    .select("slug", { count: "exact", head: true });
  if ("kind" in filter) q = q.eq("kind", filter.kind);
  else if ("kindIn" in filter) q = q.in("kind", filter.kindIn);
  else {
    q = q.contains("teams", [filter.teamSlug]);
    if (filter.league) q = q.eq("kind", `sports-${filter.league}`);
  }
  const { count, error } = await q;
  if (error) return 0;
  return count ?? 0;
}

/** True when the section has at least `minimum` real articles. */
export async function hasEnoughContent(
  filter: ReadinessFilter,
  minimum: number = MIN_ARTICLES_DEFAULT,
): Promise<boolean> {
  return (await countArticles(filter)) >= minimum;
}

/** Synchronous check when the caller already has the items in memory. */
export function isReadyFromItems(items: unknown[], minimum: number = MIN_ARTICLES_DEFAULT): boolean {
  return (items?.length ?? 0) >= minimum;
}
