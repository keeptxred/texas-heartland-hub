import { runCloudflareJson } from "@/lib/cloudflare-json-ai.server";
import {
  NEWSROOM_DRAFT_JSON_SCHEMA,
  newsroomRewriteSystemPrompt,
  newsroomRewriteUserPrompt,
  validateNewsroomDraft,
  type NewsroomDraft,
} from "@/lib/newsroom-rewrite-adapter";
import { buildResearchPacket } from "@/lib/newsroom-research-packet";
import { isPrimaryRecordSource } from "@/lib/publication-quality-gate";
import type { StoryCluster } from "@/lib/story-clustering";
import type { StoryAnglePlan } from "@/lib/story-angle-selector";
import type { StoryNovelty } from "@/lib/story-novelty";

const SITE = "keeptxred";
const AI_KIND = "normal";
const UPDATE_CLAIM_TTL_SECONDS = 20 * 60;

export type LivingStoryUpdateResult = {
  ok: boolean;
  slug: string;
  error?: string;
  articleId?: string;
  titleChanged?: boolean;
  provider?: string;
  model?: string;
};

function articleBodyText(body: {
  intro: string[];
  sections: Array<{ heading: string; paragraphs: string[] }>;
  faq: Array<{ q: string; a: string }>;
  keyTakeaways: string[];
}): string {
  return [
    ...(body.intro ?? []),
    ...(body.sections ?? []).flatMap((section) => [section.heading, ...(section.paragraphs ?? [])]),
    ...(body.faq ?? []).flatMap((item) => [item.q, item.a]),
    ...(body.keyTakeaways ?? []),
  ].filter(Boolean).join(" ");
}

function rows(cluster: StoryCluster) {
  return [cluster.primary, ...cluster.members];
}

function packetFor(clusterId: string, cluster: StoryCluster, anglePlan: StoryAnglePlan | null) {
  return buildResearchPacket({
    clusterId,
    subject: anglePlan?.leadFact ?? cluster.primary.title,
    pillar: null,
    recommendedFormat: "SYNTHESIS",
    editorialScore: cluster.score,
    sources: rows(cluster)
      .filter((row) => typeof row.id === "number")
      .map((row) => ({
        feedItemId: row.id as number,
        title: row.title,
        source: row.source,
        url: row.link,
        publishedAt: row.pub_date ?? null,
        description: row.description ?? "",
        extractedBody: row.extracted_body ?? row.description ?? "",
        isPrimarySource: isPrimaryRecordSource(row),
        sourceReputationScore: null,
      })),
  });
}

function shouldRefreshHeadline(novelty: StoryNovelty): boolean {
  return novelty.hasNewPrimaryDocument
    || novelty.newActions.length > 0
    || novelty.newNumbers.length >= 2
    || novelty.score >= 5;
}

function updateSystemPrompt(packet: ReturnType<typeof packetFor>, novelty: StoryNovelty, anglePlan: StoryAnglePlan | null): string {
  return `${newsroomRewriteSystemPrompt(packet)}

LIVING-STORY UPDATE RULES:
- You are updating an already-published canonical Keep TX Red article, not creating a second story or URL.
- The existing article is editing context only. Every factual assertion in the revised draft must still be supported by the supplied source packet.
- Preserve useful background only when the current source packet supports it. Remove or correct stale details when newer verified evidence supersedes them.
- Lead with the material new development. New actions: ${novelty.newActions.join(" | ") || "none"}. New figures: ${novelty.newNumbers.join(" | ") || "none"}. New dates: ${novelty.newDates.join(" | ") || "none"}.
- ${anglePlan ? `The verified evidence-led angle is: ${anglePlan.leadFact}` : "Choose the lead only from verified facts in the source packet."}
- Do not describe unchanged background as newly occurring.
- Do not mention that an automated update occurred.
- Return a complete replacement article draft; the application will preserve the canonical slug, original publication timestamp, article ID, and image fields.`;
}

export async function acquireLivingStoryUpdateClaim(
  db: any,
  clusterId: string,
): Promise<{ acquired: boolean; token?: string; reason: string }> {
  const token = crypto.randomUUID();
  try {
    const { data, error } = await db.rpc("claim_news_event_cluster_update", {
      p_cluster_id: clusterId,
      p_claim_token: token,
      p_claim_ttl_seconds: UPDATE_CLAIM_TTL_SECONDS,
    });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return row?.acquired
      ? { acquired: true, token, reason: "atomic canonical-update claim acquired" }
      : { acquired: false, reason: "another worker currently owns the canonical-update claim" };
  } catch (error) {
    console.warn("[living-story] update claim unavailable", error instanceof Error ? error.message : String(error));
    return { acquired: false, reason: "canonical-update claim unavailable" };
  }
}

export async function releaseLivingStoryUpdateClaim(db: any, clusterId: string, token?: string): Promise<void> {
  if (!token) return;
  try {
    const { error } = await db.rpc("release_news_event_cluster_publication_claim", {
      p_cluster_id: clusterId,
      p_claim_token: token,
    });
    if (error) throw error;
  } catch (error) {
    console.warn("[living-story] update claim release skipped", error instanceof Error ? error.message : String(error));
  }
}

export async function updateCanonicalLivingStory(input: {
  db: any;
  slug: string;
  clusterId: string;
  feedItemId: number;
  cluster: StoryCluster;
  novelty: StoryNovelty;
  anglePlan: StoryAnglePlan | null;
}): Promise<LivingStoryUpdateResult> {
  const { db, slug, clusterId, feedItemId, cluster, novelty, anglePlan } = input;
  const { data: existing, error: existingError } = await db
    .from("daily_articles")
    .select("id,slug,title,dek,body,body_json,published_at,category,source_name,source_url")
    .eq("slug", slug)
    .maybeSingle();
  if (existingError || !existing) {
    return { ok: false, slug, error: existingError?.message ?? "Canonical article not found" };
  }

  const packet = packetFor(clusterId, cluster, anglePlan);
  if (!packet.sources.length) return { ok: false, slug, error: "No source packet available for canonical update" };

  const { data: reservation, error: reserveError } = await db.rpc("newsroom_reserve_ai_generation", {
    p_site: SITE,
    p_kind: AI_KIND,
  });
  if (reserveError) return { ok: false, slug, error: reserveError.message };
  if (!reservation?.reserved) return { ok: false, slug, error: "AI budget exhausted; canonical update deferred" };

  let generated = false;
  try {
    const baseUser = JSON.parse(newsroomRewriteUserPrompt(packet)) as Record<string, unknown>;
    const ai = await runCloudflareJson<NewsroomDraft>({
      system: updateSystemPrompt(packet, novelty, anglePlan),
      user: JSON.stringify({
        ...baseUser,
        livingStory: {
          canonicalSlug: slug,
          noveltyScore: novelty.score,
          newActions: novelty.newActions,
          newNumbers: novelty.newNumbers,
          newDates: novelty.newDates,
          hasNewPrimaryDocument: novelty.hasNewPrimaryDocument,
        },
        currentArticle: {
          title: existing.title ?? "",
          dek: existing.dek ?? "",
          body: (existing.body ?? "").slice(0, 14000),
        },
      }),
      maxTokens: 12000,
      maxAttempts: 1,
      jsonSchema: NEWSROOM_DRAFT_JSON_SCHEMA,
    });
    generated = true;
    const validation = validateNewsroomDraft(ai.value, packet);
    if (!validation.ok) {
      await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: AI_KIND, p_success: true });
      return { ok: false, slug, error: `Canonical update rejected: ${validation.reasons.join(", ")}` };
    }

    const now = new Date();
    const sourceMap = new Map<string, { label: string; url: string }>();
    const previousBodyJson = existing.body_json && typeof existing.body_json === "object" ? existing.body_json : {};
    const previousSources = Array.isArray((previousBodyJson as Record<string, unknown>).sources)
      ? ((previousBodyJson as Record<string, unknown>).sources as Array<{ label?: string; url?: string }>)
      : [];
    for (const source of previousSources) {
      if (source.url) sourceMap.set(source.url, { label: source.label ?? "Source", url: source.url });
    }
    for (const source of packet.sources) sourceMap.set(source.url, { label: `${source.source} — source`, url: source.url });

    const bodyJson = {
      ...(previousBodyJson as Record<string, unknown>),
      updated: now.toISOString().slice(0, 10),
      intro: [ai.value.summary.trim()],
      sections: [
        { heading: "Texas relevance", paragraphs: [ai.value.relevance.trim()] },
        ...ai.value.sections,
        {
          heading: "Source attribution",
          paragraphs: ["Keep TX Red synthesized the cited reporting independently and links to the original sources for verification."],
        },
      ],
      faq: ai.value.faq,
      sources: [...sourceMap.values()],
      keyTakeaways: ai.value.keyTakeaways,
      livingStory: {
        lastMaterialUpdateAt: now.toISOString(),
        noveltyScore: novelty.score,
        newActions: novelty.newActions,
        newNumbers: novelty.newNumbers,
        newDates: novelty.newDates,
      },
    };
    const refreshHeadline = shouldRefreshHeadline(novelty);
    const nextTitle = refreshHeadline ? ai.value.title.slice(0, 200) : existing.title;
    const nextDek = ai.value.dek.slice(0, 400);
    const nextBody = articleBodyText(bodyJson as {
      intro: string[];
      sections: Array<{ heading: string; paragraphs: string[] }>;
      faq: Array<{ q: string; a: string }>;
      keyTakeaways: string[];
    });

    const { error: updateError } = await db
      .from("daily_articles")
      .update({
        title: nextTitle,
        dek: nextDek,
        body: nextBody,
        body_json: bodyJson,
        source_name: packet.sources.length > 1 ? "Multiple independent sources" : packet.sources[0]?.source ?? existing.source_name,
        source_url: packet.sources[0]?.url ?? existing.source_url,
      })
      .eq("id", existing.id)
      .eq("slug", slug);
    if (updateError) throw new Error(updateError.message);

    const { error: historyError } = await db.from("news_event_article_updates").insert({
      cluster_id: clusterId,
      article_id: existing.id,
      feed_item_id: feedItemId,
      canonical_slug: slug,
      novelty_score: novelty.score,
      new_actions: novelty.newActions,
      new_numbers: novelty.newNumbers,
      new_dates: novelty.newDates,
      has_new_primary_document: novelty.hasNewPrimaryDocument,
      prior_title: existing.title,
      new_title: nextTitle,
      title_changed: nextTitle !== existing.title,
      provider: ai.provider,
      model: ai.model,
    });
    if (historyError) console.warn("[living-story] update history not persisted", historyError.message);

    await db.from("texas_news_feed").update({ internal_slug: slug }).eq("id", feedItemId);
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: AI_KIND, p_success: true });
    return {
      ok: true,
      slug,
      articleId: existing.id,
      titleChanged: nextTitle !== existing.title,
      provider: ai.provider,
      model: ai.model,
    };
  } catch (error) {
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: AI_KIND, p_success: generated });
    return { ok: false, slug, error: error instanceof Error ? error.message : String(error) };
  }
}
