import { createFileRoute } from "@tanstack/react-router";
import {
  findDeterministicDuplicate,
  normalizeNewsFeedItem,
  type ExistingNormalization,
} from "@/lib/newsroom-normalization";

const NORMALIZATION_VERSION = 1;
const FEED_LIMIT = 1000;
const LOOKBACK_DAYS = 14;

type FeedNormalizationRow = {
  id: number;
  title: string | null;
  source: string | null;
  link: string | null;
  description: string | null;
  pub_date: string | null;
  created_at: string;
};

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // The committed generated Database type intentionally trails recent feed columns and newsroom migrations.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: feedData, error: feedError }, { data: priorData, error: priorError }] = await Promise.all([
    newsroomDb
      .from("texas_news_feed")
      .select("id,title,source,link,description,pub_date,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(FEED_LIMIT),
    newsroomDb
      .from("news_feed_normalization")
      .select("feed_item_id,canonical_url,source_key,title_fingerprint,observed_at")
      .gte("observed_at", since)
      .is("duplicate_of_feed_item_id", null)
      .order("observed_at", { ascending: true })
      .limit(5000),
  ]);

  if (feedError) return Response.json({ ok: false, error: feedError.message }, { status: 500 });
  if (priorError) return Response.json({ ok: false, error: priorError.message }, { status: 500 });
  const feedRows = (feedData ?? []) as FeedNormalizationRow[];
  const priorRows = (priorData ?? []) as ExistingNormalization[];

  const canonicalRows: ExistingNormalization[] = [...priorRows];
  const normalized = [...feedRows]
    .sort((a, b) => Date.parse(a.pub_date ?? a.created_at) - Date.parse(b.pub_date ?? b.created_at) || a.id - b.id)
    .map((row) => {
      const item = normalizeNewsFeedItem(row);
      const duplicate = findDeterministicDuplicate(item, canonicalRows);
      const output = {
        feed_item_id: item.feedItemId,
        normalized_title: item.normalizedTitle,
        normalized_description: item.normalizedDescription,
        canonical_url: item.canonicalUrl,
        source_key: item.sourceKey,
        title_fingerprint: item.titleFingerprint,
        content_fingerprint: item.contentFingerprint,
        duplicate_of_feed_item_id: duplicate?.feedItemId ?? null,
        duplicate_reason: duplicate?.reason ?? null,
        dedupe_confidence: duplicate?.confidence ?? null,
        observed_at: item.observedAt,
        normalization_version: NORMALIZATION_VERSION,
        normalized_at: new Date().toISOString(),
      };
      if (!duplicate) {
        canonicalRows.push({
          feed_item_id: item.feedItemId,
          canonical_url: item.canonicalUrl,
          source_key: item.sourceKey,
          title_fingerprint: item.titleFingerprint,
          observed_at: item.observedAt,
        });
      }
      return output;
    });

  if (normalized.length) {
    const { error: upsertError } = await newsroomDb
      .from("news_feed_normalization")
      .upsert(normalized, { onConflict: "feed_item_id" });
    if (upsertError) return Response.json({ ok: false, error: upsertError.message }, { status: 500 });
  }

  const duplicates = normalized.filter((row) => row.duplicate_of_feed_item_id !== null);
  const byReason = duplicates.reduce<Record<string, number>>((counts, row) => {
    const reason = row.duplicate_reason ?? "unknown";
    counts[reason] = (counts[reason] ?? 0) + 1;
    return counts;
  }, {});

  return Response.json({
    ok: true,
    scanned: feedRows.length,
    normalized: normalized.length,
    unique: normalized.length - duplicates.length,
    duplicates: duplicates.length,
    duplicateReasons: byReason,
    normalizationVersion: NORMALIZATION_VERSION,
    aiCalls: 0,
  });
}

export const Route = createFileRoute("/api/public/hooks/normalize-newsroom-feed")({
  server: { handlers: { GET: handler, POST: handler } },
});
