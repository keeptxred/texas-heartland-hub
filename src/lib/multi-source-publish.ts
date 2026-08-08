import {
  buildSourcePacket,
  buildStoryCluster,
  clusterSourceList,
  type ClusterableFeedItem,
  type StoryCluster,
} from "@/lib/story-clustering";
import { publishSingleFeedItem as publishLegacySingleFeedItem } from "@/lib/ingest-feeds-legacy";

type PublishResult = { ok: boolean; slug?: string; error?: string; alreadyPublished?: boolean; clusteredSources?: number };

const CLUSTER_LOOKBACK_HOURS = 72;
const STRONG_MERGE_SCORE = 65;
const SAME_EVENT_SCORE = 80;
const MAX_CLUSTER_SOURCES = 5;

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

async function fetchReadableText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "KeepTXRed/1.2 (+https://keeptxred.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml/i.test(type)) return null;
    const html = await response.text();
    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<(header|footer|nav|aside|form)[\s\S]*?<\/\1>/gi, " ");
    const article = stripped.match(/<article[\s\S]*?<\/article>/i)?.[0] ?? stripped;
    const text = article
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
    if (wordCount(text) < 80) return null;
    return text.slice(0, 6500);
  } catch {
    return null;
  }
}

async function enrichClusterBodies(cluster: StoryCluster, supabaseAdmin: any): Promise<StoryCluster> {
  const rows = [cluster.primary, ...cluster.members];
  const enriched: ClusterableFeedItem[] = [];

  for (const row of rows) {
    let body = (row.extracted_body ?? "").trim();
    const description = (row.description ?? "").trim();
    if (!body && wordCount(description) < 180 && /^https?:\/\//i.test(row.link)) {
      body = (await fetchReadableText(row.link)) ?? "";
      if (body && row.id) {
        await supabaseAdmin
          .from("texas_news_feed")
          .update({ extracted_body: body })
          .eq("id", row.id);
      }
    }
    enriched.push({ ...row, extracted_body: body || description });
  }

  const primary = enriched[0];
  const members = cluster.members.map((member, index) => ({ ...member, ...enriched[index + 1] }));
  return { ...cluster, primary, members };
}

async function writeClusterMetadata(supabaseAdmin: any, cluster: StoryCluster, slug?: string): Promise<void> {
  const ids = [cluster.primary, ...cluster.members].map((row) => row.id).filter((id): id is number => typeof id === "number");
  if (!ids.length) return;
  const metadata = {
    cluster_score: cluster.score,
    source_count: cluster.sourceCount,
    source_links: clusterSourceList(cluster),
    clustered_at: new Date().toISOString(),
  };
  // Keep this best-effort because deployments may not yet have optional cluster
  // columns. The core pipeline does not depend on these diagnostics existing.
  try {
    await supabaseAdmin.from("texas_news_feed").update({ cluster_json: metadata }).in("id", ids);
  } catch {
    // no-op: migration is optional for runtime synthesis
  }
  if (slug) {
    await supabaseAdmin.from("texas_news_feed").update({ internal_slug: slug }).in("id", ids);
  }
}

export async function publishSingleFeedItem(feedItemId: number): Promise<PublishResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;

  const { data: primary, error } = await db
    .from("texas_news_feed")
    .select("id,title,link,source,description,pub_date,internal_slug,extracted_body")
    .eq("id", feedItemId)
    .maybeSingle();
  if (error || !primary) return { ok: false, error: error?.message ?? "Feed item not found" };
  if (primary.internal_slug) return { ok: true, slug: primary.internal_slug, alreadyPublished: true };

  const since = new Date(Date.now() - CLUSTER_LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
  const { data: recent } = await db
    .from("texas_news_feed")
    .select("id,title,link,source,description,pub_date,internal_slug,extracted_body")
    .gte("pub_date", since)
    .neq("id", feedItemId)
    .order("pub_date", { ascending: false })
    .limit(140);

  let cluster = buildStoryCluster(primary, (recent ?? []) as ClusterableFeedItem[], MAX_CLUSTER_SOURCES);
  if (!cluster.strongMerge || cluster.score < STRONG_MERGE_SCORE) {
    return publishLegacySingleFeedItem(feedItemId);
  }

  // When a very strong same-event match has already been published, connect the
  // new feed row to the existing article instead of spending another AI call.
  const existing = cluster.members
    .filter((row) => row.internal_slug && row.combinationScore >= SAME_EVENT_SCORE)
    .sort((a, b) => b.combinationScore - a.combinationScore)[0];
  if (existing?.internal_slug) {
    await db.from("texas_news_feed").update({ internal_slug: existing.internal_slug }).eq("id", feedItemId);
    await writeClusterMetadata(db, cluster, existing.internal_slug);
    return {
      ok: true,
      slug: existing.internal_slug,
      alreadyPublished: true,
      clusteredSources: cluster.sourceCount,
    };
  }

  cluster = await enrichClusterBodies(cluster, db);
  const packet = buildSourcePacket(cluster);
  const sourceNames = [cluster.primary, ...cluster.members].map((row) => row.source);
  const synthesisHeader = [
    "MULTI-SOURCE STORY PACKET.",
    "Use only facts supported by the sources below. Reconcile duplicate facts. Attribute claims when sources differ. Do not copy source wording.",
    `Independent sources: ${sourceNames.join(" | ")}.`,
    "Treat this as one developing Texas story when the evidence supports it; do not invent a connection that is not supported.",
  ].join("\n");

  // The legacy rewrite path already caches extracted_body and performs exactly
  // one budgeted editorial rewrite. By staging the combined packet here, the AI
  // sees 2-5 independent sources in that one call without adding an AI-based
  // clustering step or increasing Lovable-agent usage.
  await db
    .from("texas_news_feed")
    .update({ extracted_body: `${synthesisHeader}\n\n${packet}`.slice(0, 26000) })
    .eq("id", feedItemId);

  await writeClusterMetadata(db, cluster);
  const result = await publishLegacySingleFeedItem(feedItemId);
  if (result.ok && result.slug) {
    await writeClusterMetadata(db, cluster, result.slug);
    return { ...result, clusteredSources: cluster.sourceCount };
  }
  return { ...result, clusteredSources: cluster.sourceCount };
}
