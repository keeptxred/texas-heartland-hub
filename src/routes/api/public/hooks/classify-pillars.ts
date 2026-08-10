import { createFileRoute } from "@tanstack/react-router";
import { classifyContentPillar, type ContentPillarSlug } from "@/lib/content-pillars";

const BATCH_SIZE = 500;

type FeedCandidate = {
  id: number;
  title: string;
  source: string;
  description: string | null;
  extracted_body: string | null;
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

  return Response.json({
    ok: true,
    examined: (candidates ?? []).length,
    persisted,
    unmatched: unmatched.length,
    byPillar: Object.fromEntries([...groups.entries()].map(([slug, ids]) => [slug, ids.length])),
  });
}

export const Route = createFileRoute("/api/public/hooks/classify-pillars")({
  server: { handlers: { GET: handler, POST: handler } },
});
