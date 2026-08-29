import { createFileRoute } from "@tanstack/react-router";
import {
  fetchReadableNewsroomSource,
  shouldFetchNewsroomSourcePage,
} from "@/lib/newsroom-source-page.server";

const MAX_FEED_IDS = 20;
const CONCURRENCY = 4;

type FeedRow = {
  id: number;
  link: string | null;
  extracted_body: string | null;
};

function normalizeIds(input: unknown): number[] {
  if (!Array.isArray(input)) return [];
  return [...new Set(input
    .map((value) => Number(value))
    .filter((value) => Number.isSafeInteger(value) && value > 0))]
    .slice(0, MAX_FEED_IDS);
}

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

async function handler({ request }: { request: Request }) {
  const body = request.method === "POST" ? await request.json().catch(() => ({})) : {};
  const url = new URL(request.url);
  const queryIds = url.searchParams.get("ids")?.split(",") ?? [];
  const ids = normalizeIds(Array.isArray((body as { ids?: unknown }).ids) ? (body as { ids?: unknown }).ids : queryIds);

  if (!ids.length) {
    return Response.json({ ok: false, error: "Provide 1-20 positive integer feed IDs." }, { status: 400 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Newsroom source-page recovery intentionally leads generated Database types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;

  const { data, error } = await newsroomDb
    .from("texas_news_feed")
    .select("id,link,extracted_body")
    .in("id", ids);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  const rows = (data ?? []) as FeedRow[];
  const foundIds = new Set(rows.map((row) => row.id));
  const missingIds = ids.filter((id) => !foundIds.has(id));
  const targetIds = new Set<number>();
  const targets = rows.filter((row) => {
    const shouldFetch = shouldFetchNewsroomSourcePage({ url: row.link, extractedBody: row.extracted_body });
    if (shouldFetch) targetIds.add(row.id);
    return shouldFetch;
  });

  const results = await mapWithConcurrency(targets, CONCURRENCY, async (row) => {
    const bodyText = row.link ? await fetchReadableNewsroomSource(row.link) : null;
    return { row, bodyText };
  });

  let updated = 0;
  let charsWritten = 0;
  const failedIds: number[] = [];
  const skippedIds = rows.filter((row) => !targetIds.has(row.id)).map((row) => row.id);

  for (const result of results) {
    const text = result.bodyText?.trim() ?? "";
    if (!text) {
      failedIds.push(result.row.id);
      continue;
    }
    const existing = (result.row.extracted_body ?? "").trim();
    if (text.length <= existing.length + 100 && existing.length >= 4_000) {
      skippedIds.push(result.row.id);
      continue;
    }
    const { error: updateError } = await newsroomDb
      .from("texas_news_feed")
      .update({ extracted_body: text })
      .eq("id", result.row.id);
    if (updateError) {
      failedIds.push(result.row.id);
      continue;
    }
    updated++;
    charsWritten += text.length;
  }

  return Response.json({
    ok: true,
    requested: ids.length,
    found: rows.length,
    attempted: targets.length,
    updated,
    charsWritten,
    skippedIds: [...new Set(skippedIds)].sort((a, b) => a - b),
    failedIds: [...new Set(failedIds)].sort((a, b) => a - b),
    missingIds,
    aiCalls: 0,
    publishes: 0,
  });
}

export const Route = createFileRoute("/api/public/hooks/enrich-newsroom-feed-items")({
  server: { handlers: { GET: handler, POST: handler } },
});
