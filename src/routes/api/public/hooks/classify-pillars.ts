import { createFileRoute } from "@tanstack/react-router";
import {
  classifyContentPillar,
  getContentPillar,
  isContentPillarSlug,
  type ContentPillarSlug,
} from "@/lib/content-pillars";

const BATCH_SIZE = 500;
const ARTICLE_SYNC_LIMIT = 250;

type FeedCandidate = {
  id: number;
  title: string;
  source: string;
  description: string | null;
  extracted_body: string | null;
};

type LinkedFeedRow = {
  internal_slug: string | null;
  pillar_slug: string | null;
};

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const classifiedAt = new Date().toISOString();

  const { data: candidates, error: candidateError } = await db
    .from("texas_news_feed")
    .select("id,title,source,description,extracted_body")
    .is("pillar_classified_at", null)
    .order("pub_date", { ascending: false })
    .limit(BATCH_SIZE);

  if (candidateError) {
    return Response.json({ ok: false, error: candidateError.message }, { status: 500 });
  }

  const groups = new Map<ContentPillarSlug, number[]>();
  const unmatched: number[] = [];
  for (const row of (candidates ?? []) as FeedCandidate[]) {
    const pillar = classifyContentPillar({
      title: row.title,
      description: row.description,
      body: row.extracted_body,
      category: row.source,
    });
    if (!pillar) {
      unmatched.push(row.id);
      continue;
    }
    groups.set(pillar, [...(groups.get(pillar) ?? []), row.id]);
  }

  let persisted = 0;
  for (const [pillarSlug, ids] of groups) {
    if (!ids.length) continue;
    const { error } = await db
      .from("texas_news_feed")
      .update({ pillar_slug: pillarSlug, pillar_classified_at: classifiedAt })
      .in("id", ids);
    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
    persisted += ids.length;
  }
  if (unmatched.length) {
    const { error } = await db
      .from("texas_news_feed")
      .update({ pillar_slug: null, pillar_classified_at: classifiedAt })
      .in("id", unmatched);
    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Keep published article metadata aligned with the persisted feed decision.
  // This runs after publish as well as after ingest, so the publication path
  // does not need to recalculate or maintain a second taxonomy.
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data: linkedRows } = await db
    .from("texas_news_feed")
    .select("internal_slug,pillar_slug")
    .not("internal_slug", "is", null)
    .not("pillar_slug", "is", null)
    .gte("pub_date", since)
    .order("pub_date", { ascending: false })
    .limit(ARTICLE_SYNC_LIMIT);

  let articleMetadataSynced = 0;
  for (const feedRow of (linkedRows ?? []) as LinkedFeedRow[]) {
    if (!feedRow.internal_slug || !isContentPillarSlug(feedRow.pillar_slug)) continue;
    const pillar = getContentPillar(feedRow.pillar_slug);
    const { data: article } = await db
      .from("daily_articles")
      .select("body_json")
      .eq("slug", feedRow.internal_slug)
      .maybeSingle();
    if (!article?.body_json || typeof article.body_json !== "object" || Array.isArray(article.body_json)) continue;
    const current = (article.body_json as Record<string, unknown>).contentPillar as { slug?: string } | undefined;
    if (current?.slug === pillar.slug) continue;
    const bodyJson = {
      ...(article.body_json as Record<string, unknown>),
      contentPillar: {
        slug: pillar.slug,
        title: pillar.title,
        href: pillar.href,
      },
    };
    const { error } = await db.from("daily_articles").update({ body_json: bodyJson }).eq("slug", feedRow.internal_slug);
    if (!error) articleMetadataSynced++;
  }

  return Response.json({
    ok: true,
    examined: (candidates ?? []).length,
    persisted,
    unmatched: unmatched.length,
    byPillar: Object.fromEntries([...groups.entries()].map(([slug, ids]) => [slug, ids.length])),
    articleMetadataSynced,
  });
}

export const Route = createFileRoute("/api/public/hooks/classify-pillars")({
  server: { handlers: { GET: handler, POST: handler } },
});
