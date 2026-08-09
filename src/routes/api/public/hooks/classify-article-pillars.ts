import { createFileRoute } from "@tanstack/react-router";
import { classifyContentPillar } from "@/lib/content-pillars";

const BATCH_SIZE = 500;

type ArticleCandidate = {
  slug: string;
  title: string;
  dek: string | null;
  body: string | null;
  category: string | null;
};

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;

  const { data: assigned, error: assignedError } = await db
    .from("article_pillar_assignments")
    .select("article_slug")
    .order("classified_at", { ascending: false })
    .limit(10000);
  if (assignedError) {
    return Response.json({ ok: false, error: assignedError.message }, { status: 500 });
  }

  const assignedSlugs = new Set((assigned ?? []).map((row: { article_slug: string }) => row.article_slug));
  const { data: articles, error: articleError } = await db
    .from("daily_articles")
    .select("slug,title,dek,body,category")
    .order("published_at", { ascending: false })
    .limit(10000);
  if (articleError) {
    return Response.json({ ok: false, error: articleError.message }, { status: 500 });
  }

  const candidates = ((articles ?? []) as ArticleCandidate[])
    .filter((article) => !assignedSlugs.has(article.slug))
    .slice(0, BATCH_SIZE);

  if (!candidates.length) {
    return Response.json({ ok: true, examined: 0, assigned: 0, unmatched: 0, complete: true });
  }

  const rows = candidates.map((article) => ({
    article_slug: article.slug,
    pillar_slug: classifyContentPillar({
      title: article.title,
      description: article.dek,
      body: article.body,
      category: article.category,
    }),
    classified_at: new Date().toISOString(),
    classifier_version: "content-pillars-v1",
  }));

  const { error: upsertError } = await db
    .from("article_pillar_assignments")
    .upsert(rows, { onConflict: "article_slug" });
  if (upsertError) {
    return Response.json({ ok: false, error: upsertError.message }, { status: 500 });
  }

  const matched = rows.filter((row) => row.pillar_slug !== null);
  const byPillar = matched.reduce<Record<string, number>>((acc, row) => {
    acc[row.pillar_slug!] = (acc[row.pillar_slug!] ?? 0) + 1;
    return acc;
  }, {});

  return Response.json({
    ok: true,
    examined: candidates.length,
    assigned: matched.length,
    unmatched: rows.length - matched.length,
    complete: candidates.length < BATCH_SIZE,
    byPillar,
  });
}

export const Route = createFileRoute("/api/public/hooks/classify-article-pillars")({
  server: { handlers: { GET: handler, POST: handler } },
});