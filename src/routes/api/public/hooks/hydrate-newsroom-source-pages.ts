import { createFileRoute } from "@tanstack/react-router";
import {
  fetchReadableNewsroomSource,
  shouldFetchNewsroomSourcePage,
} from "@/lib/newsroom-source-page.server";

const MAX_FEED_IDS = 40;
const CONCURRENCY = 4;

type FeedRow = {
  id: number;
  link: string | null;
  extracted_body: string | null;
};

type HydrationResult = {
  feedItemId: number;
  fetched: boolean;
  updated: boolean;
  chars: number;
  reason?: string;
};

async function mapWithConcurrency<T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const output: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, Math.max(items.length, 1)) }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      output[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return output;
}

function normalizeFeedIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value
    .filter((item): item is number => Number.isInteger(item) && Number(item) > 0)
    .map(Number))]
    .slice(0, MAX_FEED_IDS);
}

async function handler({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "POST required" }, { status: 405 });
  }

  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }
  const feedIds = normalizeFeedIds((payload as { feedIds?: unknown } | null)?.feedIds);
  if (!feedIds.length) {
    return Response.json({ ok: false, error: "feedIds must contain 1-40 positive integer feed IDs" }, { status: 400 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // New newsroom columns intentionally lead the generated Database type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const { data, error } = await newsroomDb
    .from("texas_news_feed")
    .select("id,link,extracted_body")
    .in("id", feedIds);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  const rows = (data ?? []) as FeedRow[];
  const byId = new Map(rows.map((row) => [row.id, row]));
  const targets = feedIds.flatMap((id) => {
    const row = byId.get(id);
    if (!row || !row.link) return [];
    if (!shouldFetchNewsroomSourcePage({ url: row.link, extractedBody: row.extracted_body })) return [];
    return [row];
  });

  const results = await mapWithConcurrency(targets, CONCURRENCY, async (row): Promise<HydrationResult> => {
    const body = row.link ? await fetchReadableNewsroomSource(row.link) : null;
    if (!body) return { feedItemId: row.id, fetched: true, updated: false, chars: 0, reason: "no_readable_body" };
    const existing = (row.extracted_body ?? "").trim();
    if (body.length <= existing.length + 100) {
      return { feedItemId: row.id, fetched: true, updated: false, chars: existing.length, reason: "existing_body_is_equivalent_or_better" };
    }
    const { error: updateError } = await newsroomDb
      .from("texas_news_feed")
      .update({ extracted_body: body })
      .eq("id", row.id);
    if (updateError) {
      return { feedItemId: row.id, fetched: true, updated: false, chars: existing.length, reason: `update_failed:${updateError.message}` };
    }
    return { feedItemId: row.id, fetched: true, updated: true, chars: body.length };
  });

  if (results.length) {
    const attemptedAt = new Date().toISOString();
    const stateRows = results.map((result) => ({
      feed_item_id: result.feedItemId,
      last_attempt_at: attemptedAt,
      last_success_at: result.reason === "no_readable_body" || result.reason?.startsWith("update_failed:") ? null : attemptedAt,
      last_result: result.reason === "no_readable_body"
        ? "no_readable_body"
        : result.reason?.startsWith("update_failed:")
          ? "update_failed"
          : "success",
      chars: result.chars,
    }));
    const { error: stateError } = await newsroomDb
      .from("newsroom_source_page_fetch_state")
      .upsert(stateRows, { onConflict: "feed_item_id" });
    if (stateError) console.warn("[newsroom-hydration] source-page fetch state write failed", stateError.message);
  }

  const resultById = new Map(results.map((result) => [result.feedItemId, result]));
  const responseRows: HydrationResult[] = feedIds.map((id) => {
    if (!byId.has(id)) return { feedItemId: id, fetched: false, updated: false, chars: 0, reason: "feed_item_not_found" };
    return resultById.get(id) ?? {
      feedItemId: id,
      fetched: false,
      updated: false,
      chars: (byId.get(id)?.extracted_body ?? "").trim().length,
      reason: "fetch_not_required",
    };
  });

  return Response.json({
    ok: true,
    requested: feedIds.length,
    found: rows.length,
    fetched: results.length,
    updated: results.filter((result) => result.updated).length,
    charsWritten: results.filter((result) => result.updated).reduce((sum, result) => sum + result.chars, 0),
    aiCalls: 0,
    results: responseRows,
  });
}

export const Route = createFileRoute("/api/public/hooks/hydrate-newsroom-source-pages")({
  server: { handlers: { POST: handler } },
});