import { createFileRoute } from "@tanstack/react-router";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { publishSingleFeedItem } from "@/lib/multi-source-publish";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/run-daily-news-now.yml";
const OVERDUE_HOURS = 10;
const MAX_ATTEMPTS = 4;
const MAX_PUBLISHED = 3;

type GapRow = {
  id: number;
  title: string;
  coverage_priority: number | null;
  source_reputation_score: number | null;
  pub_date: string;
};

type FeedRow = {
  id: number;
  title: string;
  target_site: string | null;
  internal_slug: string | null;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function titleKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

async function publishOverdueGaps(request: Request) {
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });
  }

  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: "GitHub Actions OIDC verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 403 },
    );
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const cutoff = new Date(Date.now() - OVERDUE_HOURS * 60 * 60 * 1000).toISOString();

  const { data: rawGaps, error: gapError } = await db
    .from("news_coverage_gaps")
    .select("id,title,coverage_priority,source_reputation_score,pub_date")
    .eq("gap_reason", "article_generation_or_publish_gap")
    .lt("pub_date", cutoff)
    .order("coverage_priority", { ascending: false })
    .order("source_reputation_score", { ascending: false })
    .order("pub_date", { ascending: true })
    .limit(20);

  if (gapError) {
    return Response.json({ ok: false, error: gapError.message }, { status: 500 });
  }

  const gaps = (rawGaps ?? []) as GapRow[];
  if (gaps.length === 0) {
    return Response.json({ ok: true, no_items: true, attempted: 0, published: 0, results: [] });
  }

  const ids = gaps.map((gap) => gap.id);
  const { data: rawFeedRows, error: feedError } = await db
    .from("texas_news_feed")
    .select("id,title,target_site,internal_slug")
    .in("id", ids);

  if (feedError) {
    return Response.json({ ok: false, error: feedError.message }, { status: 500 });
  }

  const feedById = new Map<number, FeedRow>(
    ((rawFeedRows ?? []) as FeedRow[]).map((row) => [row.id, row]),
  );
  const seenTitles = new Set<string>();
  const candidates = gaps.filter((gap) => {
    const feed = feedById.get(gap.id);
    if (!feed || feed.internal_slug) return false;
    if (feed.target_site !== "keeptxred") return false;
    const key = titleKey(feed.title || gap.title);
    if (!key || seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });

  const results: Array<{
    feed_item_id: number;
    title: string;
    ok: boolean;
    slug?: string;
    alreadyPublished?: boolean;
    error?: string;
  }> = [];
  let published = 0;

  for (const gap of candidates.slice(0, MAX_ATTEMPTS)) {
    const result = await publishSingleFeedItem(gap.id);
    results.push({
      feed_item_id: gap.id,
      title: gap.title,
      ok: result.ok,
      slug: result.slug,
      alreadyPublished: result.alreadyPublished,
      error: result.error,
    });

    if (result.ok && result.slug) {
      published += result.alreadyPublished ? 0 : 1;

      // Exact-title duplicates are the same syndicated headline in our feed
      // (for example direct Texas Tribune plus Google News). Link all recent
      // unlinked copies to the one canonical KTR article instead of allowing
      // the health contract to treat them as separate missing publications.
      const recentCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      await db
        .from("texas_news_feed")
        .update({ internal_slug: result.slug })
        .eq("title", gap.title)
        .is("internal_slug", null)
        .eq("target_site", "keeptxred")
        .gte("pub_date", recentCutoff);
    }

    if (published >= MAX_PUBLISHED) break;
  }

  return Response.json({
    ok: true,
    no_items: candidates.length === 0,
    overdue_count: gaps.length,
    candidate_count: candidates.length,
    attempted: results.length,
    published,
    results,
  });
}

export const Route = createFileRoute("/api/public/hooks/publish-overdue-gap")({
  server: {
    handlers: {
      POST: async ({ request }) => publishOverdueGaps(request),
    },
  },
});
