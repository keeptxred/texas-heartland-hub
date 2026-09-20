import { createFileRoute } from "@tanstack/react-router";
import { runCloudflareJson } from "@/lib/cloudflare-json-ai.server";
import {
  assertKeepTxRedPublication,
  inferKeepTxRedDomain,
} from "@/lib/content-publication-guard";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import {
  compactResearchPacket,
  type ResearchPacket,
  type ResearchPacketSource,
} from "@/lib/newsroom-research-packet";
import { assessStoryNovelty, type StoryNovelty } from "@/lib/story-novelty";

const SITE = "keeptxred";
const AI_KIND = "normal";
const OIDC_AUDIENCE = "keeptxred-newsroom-refresh";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/refresh-published-news.yml";
const LOOKBACK_HOURS = 48;
const MAX_CANDIDATES = 80;
const MAX_NEW_SOURCES_IN_PROMPT = 4;
const LATEST_UPDATE_PREFIX = "Latest update — ";

type RefreshDraft = {
  paragraphs: string[];
};

type CandidateRow = {
  id: string;
  cluster_id: string;
  editorial_score: number;
  status: string;
  published_at: string | null;
};

type ClusterRow = {
  id: string;
  status: string;
  published_at: string | null;
  last_seen_at: string | null;
  published_article_id: string | null;
};

type PacketRow = {
  cluster_id: string;
  packet_json: ResearchPacket;
  built_at: string;
  source_count: number;
  primary_source_count: number;
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  body: string | null;
  body_json: Record<string, unknown> | null;
  published_at: string;
  updated_at: string | null;
  category: string | null;
  source_name: string | null;
  source_url: string | null;
};

type MaterialSource = {
  source: ResearchPacketSource;
  novelty: StoryNovelty;
};

type RefreshCandidate = {
  candidate: CandidateRow;
  cluster: ClusterRow;
  packetRow: PacketRow;
  packet: ResearchPacket;
  article: ArticleRow;
  newSources: ResearchPacketSource[];
  materialSources: MaterialSource[];
  noveltyScore: number;
};

const REFRESH_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    paragraphs: {
      type: "array",
      minItems: 1,
      maxItems: 2,
      items: { type: "string", minLength: 60, maxLength: 1200 },
    },
  },
  required: ["paragraphs"],
} as const;

function bearerToken(request: Request): string | null {
  const auth = request.headers.get("authorization") ?? "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function authorized(request: Request): Promise<boolean> {
  const token = bearerToken(request);
  if (!token) return false;
  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
    });
    return true;
  } catch {
    return false;
  }
}

function timestamp(value: string | null | undefined): number {
  if (!value) return Number.NEGATIVE_INFINITY;
  const valueMs = Date.parse(value);
  return Number.isNaN(valueMs) ? Number.NEGATIVE_INFINITY : valueMs;
}

function wordCount(value: string): number {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function currentSourceUrls(bodyJson: Record<string, unknown> | null): Set<string> {
  const rows = Array.isArray(bodyJson?.sources)
    ? bodyJson.sources as Array<{ url?: unknown }>
    : [];
  return new Set(
    rows
      .map((row) => typeof row?.url === "string" ? row.url.trim() : "")
      .filter(Boolean),
  );
}

function articleBodyText(bodyJson: Record<string, unknown>): string {
  const intro = Array.isArray(bodyJson.intro) ? bodyJson.intro as string[] : [];
  const sections = Array.isArray(bodyJson.sections)
    ? bodyJson.sections as Array<{ heading?: string; paragraphs?: string[]; bullets?: string[] }>
    : [];
  const faq = Array.isArray(bodyJson.faq)
    ? bodyJson.faq as Array<{ q?: string; a?: string }>
    : [];
  const takeaways = Array.isArray(bodyJson.keyTakeaways) ? bodyJson.keyTakeaways as string[] : [];
  return [
    ...intro,
    ...sections.flatMap((section) => [
      section.heading ?? "",
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
    ]),
    ...faq.flatMap((item) => [item.q ?? "", item.a ?? ""]),
    ...takeaways,
  ].filter(Boolean).join(" ");
}

function materialNovelty(
  source: ResearchPacketSource,
  existingText: string,
): StoryNovelty {
  return assessStoryNovelty({
    title: source.title,
    description: source.description,
    extracted_body: source.extractedBody,
    source: source.source,
    link: source.url,
  }, existingText);
}

function isMaterialSource(source: ResearchPacketSource, novelty: StoryNovelty): boolean {
  if (novelty.material) return true;
  return source.isPrimarySource
    && novelty.score >= 36
    && (novelty.newActions.length > 0 || novelty.newNumbers.length > 0 || novelty.newDates.length > 0);
}

function updateHeading(now: Date): string {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(now);
  return `${LATEST_UPDATE_PREFIX}${formatted}`;
}

function mergeSources(
  bodyJson: Record<string, unknown> | null,
  packet: ResearchPacket,
): Array<{ label: string; url: string }> {
  const byUrl = new Map<string, { label: string; url: string }>();
  const previous = Array.isArray(bodyJson?.sources)
    ? bodyJson.sources as Array<{ label?: unknown; url?: unknown }>
    : [];
  for (const row of previous) {
    if (typeof row?.url !== "string" || !row.url.trim()) continue;
    byUrl.set(row.url.trim(), {
      label: typeof row.label === "string" && row.label.trim() ? row.label.trim() : "Source",
      url: row.url.trim(),
    });
  }
  for (const source of packet.sources) {
    if (!source.url) continue;
    byUrl.set(source.url, { label: `${source.source} — source`, url: source.url });
  }
  return [...byUrl.values()];
}

function refreshSystemPrompt(materialSources: MaterialSource[]): string {
  const novelty = materialSources.map(({ source, novelty }) => ({
    source: source.source,
    url: source.url,
    newActions: novelty.newActions,
    newNumbers: novelty.newNumbers,
    newDates: novelty.newDates,
    primary: source.isPrimarySource,
  }));
  return `You are a neutral factual update editor for a Texas news article.
Write only the material new development supported by the NEW SOURCE MATERIAL.
Do not advocate for or against any candidate, official, party, policy, law, or political position.
Do not speculate about motives, intent, health, competence, or likely political outcomes.
Attribute claims to the source that makes them and distinguish allegations from established facts.
Do not invent facts, quotes, numbers, dates, or context.
Do not copy source prose. If an exact quotation is essential, use at most one short quote under 20 words and only when that exact quote appears in the supplied material.
Do not repeat old background merely to create an update.
Return 1 or 2 concise paragraphs, normally 2–4 sentences total and roughly 50–170 words.
Do not say that an automated update occurred and do not use generic phrases such as "this story is developing."
Material novelty markers: ${JSON.stringify(novelty)}`;
}

function refreshUserPrompt(candidate: RefreshCandidate): string {
  const sourceMaterial = candidate.newSources.slice(0, MAX_NEW_SOURCES_IN_PROMPT).map((source) => ({
    title: source.title,
    source: source.source,
    url: source.url,
    publishedAt: source.publishedAt,
    isPrimarySource: source.isPrimarySource,
    evidence: (source.extractedBody || source.description || "").slice(0, 7000),
  }));
  return JSON.stringify({
    currentArticle: {
      title: candidate.article.title,
      dek: candidate.article.dek,
      body: (candidate.article.body ?? "").slice(0, 12000),
    },
    newSourceMaterial: sourceMaterial,
  });
}

async function handler({ request }: { request: Request }) {
  if (!(await authorized(request))) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const { data: candidates, error: candidateError } = await db
    .from("news_publish_candidates")
    .select("id,cluster_id,editorial_score,status,published_at")
    .eq("status", "PUBLISHED")
    .gte("published_at", since)
    .order("editorial_score", { ascending: false })
    .limit(MAX_CANDIDATES);
  if (candidateError) return Response.json({ ok: false, error: candidateError.message }, { status: 500 });

  const candidateRows = (candidates ?? []) as CandidateRow[];
  if (!candidateRows.length) {
    return Response.json({ ok: true, refreshed: false, no_items: true, reason: "no_recent_published_candidates", aiCalls: 0 });
  }

  const clusterIds = [...new Set(candidateRows.map((row) => row.cluster_id))];
  const { data: clusters, error: clusterError } = await db
    .from("news_story_clusters")
    .select("id,status,published_at,last_seen_at,published_article_id")
    .in("id", clusterIds)
    .eq("status", "PUBLISHED");
  if (clusterError) return Response.json({ ok: false, error: clusterError.message }, { status: 500 });

  const clusterRows = (clusters ?? []) as ClusterRow[];
  const articleIds = clusterRows
    .map((row) => row.published_article_id)
    .filter((value): value is string => Boolean(value));

  const [{ data: packets, error: packetError }, { data: articles, error: articleError }] = await Promise.all([
    db.from("news_research_packets")
      .select("cluster_id,packet_json,built_at,source_count,primary_source_count")
      .in("cluster_id", clusterIds),
    db.from("daily_articles")
      .select("id,slug,title,dek,body,body_json,published_at,updated_at,category,source_name,source_url")
      .in("id", articleIds),
  ]);
  if (packetError) return Response.json({ ok: false, error: packetError.message }, { status: 500 });
  if (articleError) return Response.json({ ok: false, error: articleError.message }, { status: 500 });

  const clusterById = new Map(clusterRows.map((row) => [row.id, row]));
  const packetByCluster = new Map(((packets ?? []) as PacketRow[]).map((row) => [row.cluster_id, row]));
  const articleById = new Map(((articles ?? []) as ArticleRow[]).map((row) => [row.id, row]));
  const eligible: RefreshCandidate[] = [];

  for (const candidate of candidateRows) {
    const cluster = clusterById.get(candidate.cluster_id);
    if (!cluster?.published_article_id) continue;
    const packetRow = packetByCluster.get(candidate.cluster_id);
    const article = articleById.get(cluster.published_article_id);
    if (!packetRow || !article) continue;

    const articleChangedAt = timestamp(article.updated_at ?? article.published_at);
    if (timestamp(packetRow.built_at) <= articleChangedAt) continue;
    if (timestamp(cluster.last_seen_at) <= articleChangedAt) continue;

    const packet = compactResearchPacket(packetRow.packet_json);
    const previousUrls = currentSourceUrls(article.body_json);
    const newSources = packet.sources.filter((source) => source.url && !previousUrls.has(source.url));
    if (!newSources.length) continue;

    const existingText = `${article.title} ${article.dek ?? ""} ${article.body ?? ""}`;
    const assessed = newSources.map((source) => ({
      source,
      novelty: materialNovelty(source, existingText),
    }));
    const materialSources = assessed.filter(({ source, novelty }) => isMaterialSource(source, novelty));
    if (!materialSources.length) continue;

    eligible.push({
      candidate,
      cluster,
      packetRow,
      packet,
      article,
      newSources,
      materialSources,
      noveltyScore: Math.max(...materialSources.map(({ novelty }) => novelty.score)),
    });
  }

  eligible.sort((a, b) =>
    b.noveltyScore - a.noveltyScore
    || b.candidate.editorial_score - a.candidate.editorial_score
    || timestamp(b.cluster.last_seen_at) - timestamp(a.cluster.last_seen_at)
  );

  const selected = eligible[0];
  if (!selected) {
    return Response.json({
      ok: true,
      refreshed: false,
      no_items: true,
      reason: "no_material_source_expansion_after_last_article_update",
      scanned: candidateRows.length,
      aiCalls: 0,
    });
  }

  const { data: reservation, error: reserveError } = await db.rpc("newsroom_reserve_ai_generation", {
    p_site: SITE,
    p_kind: AI_KIND,
  });
  if (reserveError) return Response.json({ ok: false, error: reserveError.message }, { status: 500 });
  if (!reservation?.reserved) {
    return Response.json({
      ok: true,
      refreshed: false,
      no_items: true,
      reason: "ai_budget_exhausted",
      slug: selected.article.slug,
      aiCalls: 0,
    });
  }

  let generated = false;
  try {
    const ai = await runCloudflareJson<RefreshDraft>({
      system: refreshSystemPrompt(selected.materialSources),
      user: refreshUserPrompt(selected),
      maxTokens: 1800,
      maxAttempts: 1,
      jsonSchema: REFRESH_JSON_SCHEMA,
    });
    generated = true;

    const paragraphs = (ai.value.paragraphs ?? []).map((value) => value.trim()).filter(Boolean);
    const updateWords = wordCount(paragraphs.join(" "));
    if (paragraphs.length < 1 || paragraphs.length > 2 || updateWords < 40 || updateWords > 220) {
      await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: AI_KIND, p_success: true });
      return Response.json({
        ok: true,
        refreshed: false,
        no_items: true,
        reason: "generated_update_failed_length_guard",
        slug: selected.article.slug,
        updateWords,
        aiCalls: 1,
      });
    }

    const now = new Date();
    const previousBody = selected.article.body_json && typeof selected.article.body_json === "object"
      ? selected.article.body_json
      : {};
    const priorSections = Array.isArray(previousBody.sections)
      ? previousBody.sections as Array<{ heading?: string; paragraphs?: string[]; bullets?: string[] }>
      : [];
    const previousUpdateSections = priorSections
      .filter((section) => String(section.heading ?? "").startsWith(LATEST_UPDATE_PREFIX))
      .slice(0, 2);
    const baseSections = priorSections.filter(
      (section) => !String(section.heading ?? "").startsWith(LATEST_UPDATE_PREFIX),
    );
    const sources = mergeSources(previousBody, selected.packet);
    const previousLivingStory = previousBody.livingStory && typeof previousBody.livingStory === "object"
      ? previousBody.livingStory as Record<string, unknown>
      : {};
    const previousUpdateCount = Number(previousLivingStory.updateCount ?? 0);

    const nextBody: Record<string, unknown> = {
      ...previousBody,
      updated: now.toISOString(),
      sections: [
        { heading: updateHeading(now), paragraphs },
        ...previousUpdateSections,
        ...baseSections,
      ],
      sources,
      livingStory: {
        ...previousLivingStory,
        storyClusterId: selected.cluster.id,
        lastMaterialUpdateAt: now.toISOString(),
        packetBuiltAt: selected.packetRow.built_at,
        noveltyScore: selected.noveltyScore,
        newSourceUrls: selected.newSources.map((source) => source.url),
        updateCount: Number.isFinite(previousUpdateCount) ? previousUpdateCount + 1 : 1,
      },
    };
    const nextBodyText = articleBodyText(nextBody);
    const proposedUrl = `https://keeptxred.com/news/${selected.article.slug}`;

    assertKeepTxRedPublication({
      id: selected.article.id,
      title: selected.article.title,
      description: selected.article.dek ?? "",
      category: selected.article.category,
      domain: inferKeepTxRedDomain(
        selected.article.category,
        `${selected.article.title} ${selected.article.dek ?? ""} ${nextBodyText}`,
      ),
      source: selected.article.source_name ?? selected.newSources[0]?.source ?? "Keep TX Red newsroom",
      sourceSite: "KeepTXRed",
      sourceCanonicalUrl: selected.article.source_url ?? selected.newSources[0]?.url ?? proposedUrl,
      proposedUrl,
      writer: "refresh-published-newsroom",
    });

    const { error: updateError } = await db
      .from("daily_articles")
      .update({
        body: nextBodyText,
        body_json: nextBody,
      })
      .eq("id", selected.article.id)
      .eq("slug", selected.article.slug);
    if (updateError) throw new Error(updateError.message);

    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: AI_KIND, p_success: true });
    return Response.json({
      ok: true,
      refreshed: true,
      slug: selected.article.slug,
      clusterId: selected.cluster.id,
      noveltyScore: selected.noveltyScore,
      newSources: selected.newSources.length,
      materialSources: selected.materialSources.length,
      updateWords,
      provider: ai.provider,
      model: ai.model,
      aiCalls: 1,
    });
  } catch (error) {
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: AI_KIND, p_success: generated });
    return Response.json({
      ok: false,
      error: "Published newsroom refresh failed",
      detail: error instanceof Error ? error.message : String(error),
      slug: selected.article.slug,
    }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/hooks/refresh-published-newsroom")({
  server: { handlers: { POST: handler } },
});
