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

type PriorNormalizationRow = ExistingNormalization & {
  normalized_title: string;
  normalized_description: string;
  content_fingerprint: string | null;
  duplicate_of_feed_item_id: number | null;
  duplicate_reason: string | null;
  dedupe_confidence: number | null;
  normalization_version: number;
};

type DesiredNormalizationRow = PriorNormalizationRow;

function sameNormalization(left: DesiredNormalizationRow, right: PriorNormalizationRow | undefined): boolean {
  if (!right) return false;
  return left.feed_item_id === right.feed_item_id
    && left.normalized_title === right.normalized_title
    && left.normalized_description === right.normalized_description
    && left.canonical_url === right.canonical_url
    && left.source_key === right.source_key
    && left.title_fingerprint === right.title_fingerprint
    && left.content_fingerprint === right.content_fingerprint
    && left.duplicate_of_feed_item_id === right.duplicate_of_feed_item_id
    && left.duplicate_reason === right.duplicate_reason
    && left.dedupe_confidence === right.dedupe_confidence
    && left.observed_at === right.observed_at
    && left.normalization_version === right.normalization_version;
}

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
      .select("feed_item_id,normalized_title,normalized_description,canonical_url,source_key,title_fingerprint,content_fingerprint,duplicate_of_feed_item_id,duplicate_reason,dedupe_confidence,observed_at,normalization_version")
      .gte("observed_at", since)
      .order("observed_at", { ascending: true })
      .limit(5000),
  ]);

  if (feedError) return Response.json({ ok: false, error: feedError.message }, { status: 500 });
  if (priorError) return Response.json({ ok: false, error: priorError.message }, { status: 500 });
  const feedRows = (feedData ?? []) as FeedNormalizationRow[];
  const priorRows = (priorData ?? []) as PriorNormalizationRow[];
  const priorByFeedItemId = new Map(priorRows.map((row) => [row.feed_item_id, row]));

  const canonicalRows: ExistingNormalization[] = priorRows
    .filter((row) => row.duplicate_of_feed_item_id === null)
    .map((row) => ({
      feed_item_id: row.feed_item_id,
      canonical_url: row.canonical_url,
      source_key: row.source_key,
      title_fingerprint: row.title_fingerprint,
      observed_at: row.observed_at,
    }));
  const normalized: DesiredNormalizationRow[] = [...feedRows]
    .sort((a, b) => Date.parse(a.pub_date ?? a.created_at) - Date.parse(b.pub_date ?? b.created_at) || a.id - b.id)
    .map((row) => {
      const item = normalizeNewsFeedItem(row);
      const duplicate = findDeterministicDuplicate(item, canonicalRows);
      const output: DesiredNormalizationRow = {
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

  const normalizedAt = new Date().toISOString();
  const rowsToWrite = normalized
    .filter((row) => !sameNormalization(row, priorByFeedItemId.get(row.feed_item_id)))
    .map((row) => ({ ...row, normalized_at: normalizedAt }));
  if (rowsToWrite.length) {
    const { error: upsertError } = await newsroomDb
      .from("news_feed_normalization")
      .upsert(rowsToWrite, { onConflict: "feed_item_id" });
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
    written: rowsToWrite.length,
    unchanged: normalized.length - rowsToWrite.length,
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