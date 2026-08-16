import { createFileRoute } from "@tanstack/react-router";
import { enrichArticleRow } from "@/lib/content-quality";
import { runCloudflareJson } from "@/lib/cloudflare-json-ai.server";
import {
  categoryForPillar,
  newsroomRewriteSystemPrompt,
  newsroomRewriteUserPrompt,
  slugifyNewsroomTitle,
  validateNewsroomDraft,
  type NewsroomDraft,
} from "@/lib/newsroom-rewrite-adapter";
import type { ResearchPacket } from "@/lib/newsroom-research-packet";

const SITE = "keeptxred";

type CandidateRow = {
  id: string;
  cluster_id: string;
  editorial_score: number;
  recommended_format: string;
  status: string;
};
type ClusterRow = { id: string; canonical_subject: string; pillar_slug: string | null };
type PacketRow = { cluster_id: string; packet_json: ResearchPacket; source_count: number; primary_source_count: number };

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

function authorized(request: Request): boolean {
  const expected = process.env.NEWSROOM_HOOK_TOKEN;
  return Boolean(expected && request.headers.get("x-newsroom-hook-token") === expected);
}

async function handler({ request }: { request: Request }) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.NEWSROOM_AI_ENABLED !== "true") {
    return Response.json({ ok: false, disabled: true, reason: "newsroom_ai_disabled" }, { status: 503 });
  }

  const url = new URL(request.url);
  const requestedMode = url.searchParams.get("mode") === "publish" ? "publish" : "shadow";
  if (requestedMode === "publish" && process.env.NEWSROOM_PUBLISH_ENABLED !== "true") {
    return Response.json({ ok: false, disabled: true, reason: "newsroom_publish_disabled" }, { status: 503 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Newsroom tables intentionally lead generated Supabase types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;

  const { data: candidateData, error: candidateError } = await db
    .from("news_publish_candidates")
    .select("id,cluster_id,editorial_score,recommended_format,status")
    .in("status", ["PENDING", "HELD"])
    .in("recommended_format", ["SINGLE", "MERGE", "SYNTHESIS"])
    .order("editorial_score", { ascending: false })
    .limit(20);
  if (candidateError) return Response.json({ error: candidateError.message }, { status: 500 });
  const candidates = (candidateData ?? []) as CandidateRow[];
  if (!candidates.length) return Response.json({ ok: true, no_items: true, reason: "no_candidates", aiCalls: 0 });

  const clusterIds = candidates.map((candidate) => candidate.cluster_id);
  const [{ data: clusterData, error: clusterError }, { data: packetData, error: packetError }] = await Promise.all([
    db.from("news_story_clusters").select("id,canonical_subject,pillar_slug").in("id", clusterIds),
    db.from("news_research_packets").select("cluster_id,packet_json,source_count,primary_source_count").in("cluster_id", clusterIds),
  ]);
  if (clusterError) return Response.json({ error: clusterError.message }, { status: 500 });
  if (packetError) return Response.json({ error: packetError.message }, { status: 500 });

  const clusters = (clusterData ?? []) as ClusterRow[];
  const packets = (packetData ?? []) as PacketRow[];
  const clusterById = new Map(clusters.map((row) => [row.id, row]));
  const packetByCluster = new Map(packets.map((row) => [row.cluster_id, row]));
  const candidate = candidates.find((row) => (packetByCluster.get(row.cluster_id)?.source_count ?? 0) > 0);
  if (!candidate) return Response.json({ ok: true, no_items: true, reason: "no_research_packets", aiCalls: 0 });

  const cluster = clusterById.get(candidate.cluster_id);
  const packetRow = packetByCluster.get(candidate.cluster_id);
  if (!cluster || !packetRow) return Response.json({ error: "Selected candidate is missing cluster or packet" }, { status: 500 });
  const packet = packetRow.packet_json;
  const kind = "normal";

  const { data: reservation, error: reserveError } = await db.rpc("newsroom_reserve_ai_generation", {
    p_site: SITE,
    p_kind: kind,
  });
  if (reserveError) return Response.json({ error: reserveError.message }, { status: 500 });
  if (!reservation?.reserved) {
    return Response.json({ ok: true, no_items: true, reason: "ai_budget_exhausted", budget: reservation, aiCalls: 0 });
  }

  await db.from("news_publish_candidates").update({
    status: "SELECTED",
    selected_at: new Date().toISOString(),
  }).eq("id", candidate.id);

  let generated = false;
  try {
    const ai = await runCloudflareJson<NewsroomDraft>({
      system: newsroomRewriteSystemPrompt(packet),
      user: newsroomRewriteUserPrompt(packet),
      maxTokens: 12000,
      maxAttempts: 1,
    });
    generated = true;
    const validation = validateNewsroomDraft(ai.value, packet);

    const { data: draftRows, error: draftError } = await db.from("newsroom_generation_drafts").insert({
      candidate_id: candidate.id,
      cluster_id: candidate.cluster_id,
      mode: requestedMode,
      status: validation.ok ? "GENERATED" : "REJECTED",
      draft_json: ai.value,
      validation_reasons: validation.reasons,
      main_word_count: validation.mainWordCount,
      provider: ai.provider,
      model: ai.model,
      provider_attempts: ai.attempts,
    }).select("id").limit(1);
    if (draftError) throw new Error(draftError.message);
    const draftId = draftRows?.[0]?.id as string | undefined;

    if (!validation.ok) {
      await db.from("news_publish_candidates").update({
        status: "REJECTED",
        rejection_reason: validation.reasons.join(",").slice(0, 1000),
      }).eq("id", candidate.id);
      await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: true });
      return Response.json({
        ok: true,
        generated: true,
        published: false,
        candidateId: candidate.id,
        clusterId: candidate.cluster_id,
        draftId,
        validation,
        provider: ai.provider,
        model: ai.model,
        attempts: ai.attempts,
        aiCalls: 1,
      });
    }

    if (requestedMode === "shadow") {
      await db.from("news_publish_candidates").update({ status: "HELD" }).eq("id", candidate.id);
      await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: true });
      return Response.json({
        ok: true,
        generated: true,
        published: false,
        mode: "shadow",
        candidateId: candidate.id,
        clusterId: candidate.cluster_id,
        draftId,
        editorialScore: candidate.editorial_score,
        recommendedFormat: candidate.recommended_format,
        sourceCount: packetRow.source_count,
        primarySourceCount: packetRow.primary_source_count,
        validation,
        provider: ai.provider,
        model: ai.model,
        attempts: ai.attempts,
        aiCalls: 1,
      });
    }

    const now = new Date();
    const slug = slugifyNewsroomTitle(ai.value.title, now.toISOString().slice(0, 10));
    const sources = packet.sources.map((source) => ({ label: `${source.source} — source`, url: source.url }));
    const primary = packet.sources.find((source) => source.isPrimarySource) ?? packet.sources[0];
    const bodyJson = {
      updated: now.toISOString().slice(0, 10),
      intro: [ai.value.summary.trim()],
      sections: [
        { heading: "Texas relevance", paragraphs: [ai.value.relevance.trim()] },
        ...ai.value.sections,
        {
          heading: "Source attribution",
          paragraphs: ["Keep TX Red rewrote the coverage independently and links to the original for verification."],
        },
      ],
      faq: ai.value.faq,
      sources,
      keyTakeaways: ai.value.keyTakeaways,
    };
    const row = {
      slug,
      internal_url: `/news/${slug}`,
      is_ingested: false,
      category: categoryForPillar(cluster.pillar_slug),
      title: ai.value.title.slice(0, 200),
      dek: ai.value.dek.slice(0, 400),
      source_name: primary?.source ?? "Keep TX Red newsroom packet",
      source_url: primary?.url ?? null,
      published_at: now.toISOString(),
      score: candidate.editorial_score,
      is_breaking: false,
      kind: "news",
      body: articleBodyText(bodyJson),
      body_json: bodyJson,
    };
    enrichArticleRow(row);

    const { data: articles, error: articleError } = await db
      .from("daily_articles")
      .upsert(row, { onConflict: "slug" })
      .select("id")
      .limit(1);
    if (articleError) throw new Error(articleError.message);
    const articleId = articles?.[0]?.id as string | undefined;

    await Promise.all([
      db.from("news_publish_candidates").update({ status: "PUBLISHED", published_at: now.toISOString() }).eq("id", candidate.id),
      db.from("news_story_clusters").update({ status: "PUBLISHED", published_at: now.toISOString(), published_article_id: articleId ?? null }).eq("id", candidate.cluster_id),
      draftId ? db.from("newsroom_generation_drafts").update({ status: "PUBLISHED", published_article_id: articleId ?? null }).eq("id", draftId) : Promise.resolve(),
    ]);
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: true });

    return Response.json({
      ok: true,
      generated: true,
      published: true,
      candidateId: candidate.id,
      clusterId: candidate.cluster_id,
      draftId,
      articleId,
      slug,
      validation,
      provider: ai.provider,
      model: ai.model,
      attempts: ai.attempts,
      aiCalls: 1,
    });
  } catch (error) {
    await db.from("news_publish_candidates").update({ status: "HELD" }).eq("id", candidate.id);
    await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: generated });
    return Response.json({ error: "Newsroom generation failed", details: String(error) }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/hooks/generate-newsroom")({
  server: { handlers: { POST: handler } },
});
