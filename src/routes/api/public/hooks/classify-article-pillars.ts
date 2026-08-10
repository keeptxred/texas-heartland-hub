import { createFileRoute } from "@tanstack/react-router";
import { classifyContentPillar } from "@/lib/content-pillars";

const BATCH_SIZE = 10000;
const CLASSIFIER_VERSION = "content-pillars-v2";

type ArticleCandidate = {
  slug: string;
  title: string;
  dek: string | null;
  category: string | null;
  source_url: string | null;
};

type ExistingAssignment = {
  article_slug: string;
  classifier_version: string | null;
};

function belongsToTexasDefined(article: ArticleCandidate): boolean {
  return /(^|\.)texasdefined\.com$/i.test((() => {
    try { return article.source_url ? new URL(article.source_url).hostname : ""; }
    catch { return ""; }
  })());
}

async function syncVisibleCategories(db: any): Promise<number> {
  const { data, error } = await db.rpc("sync_historical_article_categories_from_pillars");
  if (error) throw new Error(error.message);
  return typeof data === "number" ? data : Number(data ?? 0);
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;

  const { data: assigned, error: assignedError } = await db
    .from("article_pillar_assignments")
    .select("article_slug,classifier_version")
    .order("classified_at", { ascending: false })
    .limit(10000);
  if (assignedError) {
    return Response.json({ ok: false, error: assignedError.message }, { status: 500 });
  }

  const currentAssignments = new Set(
    ((assigned ?? []) as ExistingAssignment[])
      .filter((row) => row.classifier_version === CLASSIFIER_VERSION)
      .map((row) => row.article_slug),
  );

  const { data: articles, error: articleError } = await db
    .from("daily_articles")
    .select("slug,title,dek,category,source_url")
    .order("published_at", { ascending: false })
    .limit(10000);
  if (articleError) {
    return Response.json({ ok: false, error: articleError.message }, { status: 500 });
  }

  const candidates = ((articles ?? []) as ArticleCandidate[])
    .filter((article) => !currentAssignments.has(article.slug))
    .slice(0, BATCH_SIZE);

  if (!candidates.length) {
    try {
      const categoriesReclassified = await syncVisibleCategories(db);
      return Response.json({
        ok: true,
        classifierVersion: CLASSIFIER_VERSION,
        examined: 0,
        assigned: 0,
        unmatched: 0,
        texasDefinedExcluded: 0,
        categoriesReclassified,
        complete: true,
      });
    } catch (error) {
      return Response.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
  }

  let texasDefinedExcluded = 0;
  const rows = candidates.map((article) => {
    const excluded = belongsToTexasDefined(article);
    if (excluded) texasDefinedExcluded++;
    return {
      article_slug: article.slug,
      pillar_slug: excluded ? null : classifyContentPillar({
        title: article.title,
        description: article.dek,
        category: article.category,
      }),
      classified_at: new Date().toISOString(),
      classifier_version: excluded ? `${CLASSIFIER_VERSION}:texasdefined-excluded` : CLASSIFIER_VERSION,
    };
  });

  const { error: upsertError } = await db
    .from("article_pillar_assignments")
    .upsert(rows, { onConflict: "article_slug" });
  if (upsertError) {
    return Response.json({ ok: false, error: upsertError.message }, { status: 500 });
  }

  let categoriesReclassified = 0;
  try {
    categoriesReclassified = await syncVisibleCategories(db);
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }

  const matched = rows.filter((row) => row.pillar_slug !== null);
  const byPillar = matched.reduce<Record<string, number>>((acc, row) => {
    acc[row.pillar_slug!] = (acc[row.pillar_slug!] ?? 0) + 1;
    return acc;
  }, {});

  return Response.json({
    ok: true,
    classifierVersion: CLASSIFIER_VERSION,
    examined: candidates.length,
    assigned: matched.length,
    unmatched: rows.length - matched.length,
    texasDefinedExcluded,
    categoriesReclassified,
    complete: candidates.length < BATCH_SIZE,
    byPillar,
  });
}

export const Route = createFileRoute("/api/public/hooks/classify-article-pillars")({
  server: { handlers: { GET: handler, POST: handler } },
});