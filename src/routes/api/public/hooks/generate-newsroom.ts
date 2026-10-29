import { createFileRoute } from "@tanstack/react-router";
import { sourceAuthorityLabel } from "@/data/source-authority";
import { enrichArticleRow } from "@/lib/content-quality";
import { runCloudflareJson } from "@/lib/cloudflare-json-ai.server";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { getGovernmentGraphLinks } from "@/lib/government-graph";
import { prepareFeaturedImageForUnpublishedNewsroomArticle } from "@/lib/featured-image.functions";
import { newsroomNewStoryCutoff } from "@/lib/newsroom-candidate-window";
import { newsroomHasPublisherDiversity, newsroomLeadSourceUrl, uniquePacketSources } from "@/lib/newsroom-publication-preflight";
import {
  categoryForPillar,
  NEWSROOM_DRAFT_JSON_SCHEMA,
  newsroomRewriteSystemPrompt,
  newsroomRewriteUserPrompt,
  normalizeNewsroomDraft,
  repeatedNewsroomParagraphPositions,
  slugifyNewsroomTitle,
  validateNewsroomDraft,
  type NewsroomDraft,
} from "@/lib/newsroom-rewrite-adapter";
import {
  compactResearchPacket,
  researchPacketEvidenceChars,
  type ResearchPacket,
  type ResearchPacketSource,
} from "@/lib/newsroom-research-packet";

const SITE = "keeptxred";
const STANDARD_MIN_SOURCE_EVIDENCE_CHARS = 5_000;
const LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS = 9_000;
// Match the 500-candidate packet-building pool without constructing oversized
// PostgREST .in() filters or fetching all research packets at once.
const NEWSROOM_PUBLISH_SCAN_LIMIT = 500;
const NEWSROOM_CANDIDATE_BATCH_SIZE = 100;
const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const PRODUCTION_WORKFLOW_PATH = ".github/workflows/run-daily-news-now.yml";
const GENERATED_NEWS_PROVENANCE_SIGNATURE =
  "Keep TX Red rewrote the coverage independently and links to the original for verification.";

// Explicit editorial approval received October 25 for already drafted factual
// election reporting from the preceding fourteen days. This ONLY authorizes
// re-evaluating saved drafts; it never waives independent sourcing, AI draft
// validation, image vision verification, freshness context or duplicate checks.
const ELECTION_RECOVERY_START = "2026-10-11T00:00:00Z";
const ELECTION_RECOVERY_END = "2026-10-26T00:00:00Z";
const ELECTION_RECOVERY_EXPIRES = "2026-10-30T23:59:59Z";
function isFactualVotingAdministrationSubject(subject: string): boolean {
  return /\b(?:voters?|voting|ballots?|registration|polling|election turnout|election updates)\b/i.test(subject);
}
function electionDraftHeadlineMatchesEvent(subject: string, title: string): boolean {
  // A draft originally clustered as a ballot error may drift into a completely
  // different turnout story. Editorial approval cannot justify publishing a
  // topic-shifted archived draft as though it verified the reported incident.
  if (/ballot (?:errors?|issues?|discrepanc(?:y|ies))/.test(subject)) {
    return /\bballot\b/i.test(title) && /\b(?:error|issue|discrepanc)/i.test(title);
  }
  if (/voter registrations?|registered vote/.test(subject)) {
    return /\b(?:registrations?|registered|voters?)\b/i.test(title);
  }
  return true;
}
function electionStoryTokens(value: string): Set<string> {
  const raw = value.toLowerCase()
    .replace(/\b(\d{1,3})[ ,](\d{3})\b/g, "$1$2")
    .replace(/[^a-z0-9]+/g, " ")
    .trim().split(/\s+/);
  const stop = new Set(["a", "an", "the", "are", "as", "for", "to", "of", "in", "by", "and", "from", "over", "more", "than", "with"]);
  return new Set(raw.filter((token) => token.length > 1 && !stop.has(token)));
}
function duplicatesExistingElectionStory(subject: string, existingTitles: readonly string[]): boolean {
  const tokens = electionStoryTokens(subject);
  if (tokens.size < 4) return false;
  return existingTitles.some((title) => {
    const other = electionStoryTokens(title);
    const shared = [...tokens].filter((token) => other.has(token)).length;
    return shared >= 4 && shared / Math.max(tokens.size, other.size) >= 0.75;
  });
}


type CandidateRow = {
  id: string;
  cluster_id: string;
  editorial_score: number;
  recommended_format: string;
  status: string;
};
type ClusterRow = { id: string; canonical_subject: string; pillar_slug: string | null };
type PacketRow = { cluster_id: string; packet_json: ResearchPacket; source_count: number; primary_source_count: number };
type SavedGeneratedDraft = { id: string; candidate_id: string; draft_json: NewsroomDraft; created_at: string; validation_reasons: string[]; model: string | null };

type AuthorityMetadata = {
  model: "aggregated";
  storyClusterId: string;
  recommendedFormat: string;
  sourceCount: number;
  primarySourceCount: number;
  nonPrimarySourceCount: number;
  generatedFromResearchPacket: true;
  indexability: "indexable" | "noindex";
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

function evidenceFloorForPillar(pillar: string | null): number {
  const category = categoryForPillar(pillar).toLowerCase();
  return category === "sports" || category === "education" || category === "non-political"
    ? LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS
    : STANDARD_MIN_SOURCE_EVIDENCE_CHARS;
}

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function authorized(request: Request, mode: "shadow" | "publish"): Promise<boolean> {
  const expected = process.env.NEWSROOM_HOOK_TOKEN;
  if (expected && request.headers.get("x-newsroom-hook-token") === expected) return true;
  if (mode !== "publish") return false;

  const token = bearerToken(request);
  if (!token) return false;
  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: PRODUCTION_WORKFLOW_PATH,
      allowedEventNames: ["schedule", "workflow_dispatch", "workflow_run"],
    });
    return true;
  } catch {
    return false;
  }
}

function coverageTimeline(sources: ResearchPacketSource[]): string[] {
  const seen = new Set<string>();
  return sources
    .filter((source) => source.publishedAt && Number.isFinite(Date.parse(source.publishedAt)))
    .sort((a, b) => Date.parse(a.publishedAt ?? "") - Date.parse(b.publishedAt ?? ""))
    .filter((source) => {
      const key = `${source.publishedAt?.slice(0, 10)}|${source.title.trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(-6)
    .map((source) => {
      const date = new Date(source.publishedAt as string).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Chicago",
      });
      return `${date} — ${source.source}: ${source.title}`;
    });
}

function provenanceSummary(input: {
  sourceCount: number;
  primarySourceCount: number;
  recommendedFormat: string;
}): string {
  const primary = input.primarySourceCount === 1
    ? "1 primary or official record"
    : `${input.primarySourceCount} primary or official records`;
  const remaining = Math.max(0, input.sourceCount - input.primarySourceCount);
  const other = remaining === 1 ? "1 other published source" : `${remaining} other published sources`;
  const format = input.recommendedFormat.toLowerCase();
  return `Keep TX Red built this ${format} story from ${input.sourceCount} linked source records in one story cluster, including ${primary} and ${other}. Source links are preserved below so readers can check the underlying material directly. Inclusion of a source does not imply endorsement.`;
}

function newsroomRepairUserPrompt(
  packet: ResearchPacket,
  previousDraft: NewsroomDraft,
  validationReasons: string[],
): string {
  return JSON.stringify({
    instruction: "Repair the previous draft rather than restarting. Preserve every source-supported fact that already works. Fix every listed validation failure, remove unsupported/generic phrasing, keep the exact required JSON shape, and do not add facts that are absent from the packet. Return the complete corrected draft JSON.",
    validationFailures: validationReasons,
    repeatedParagraphLocations: validationReasons.includes("repeated_newsroom_paragraphs")
      ? repeatedNewsroomParagraphPositions(previousDraft)
      : [],
    repetitionRepairRule: "For each listed repeat, keep a factual first occurrence if supported. Rewrite the repeated location using genuinely different specific facts found in the supplied packet, without recycling another paragraph's facts. Do not merely rephrase the original, add generic commentary, or invent new details to meet a word target. If the packet lacks distinct evidence for all required paragraphs, set brief.hasClearNewsEvent=false rather than returning repetitive or unsupported copy.",
    previousDraft,
    packet: JSON.parse(newsroomRewriteUserPrompt(packet)),
  });
}

function productionAuthorityEligible(packetRow: PacketRow): boolean {
  return packetRow.source_count >= 2 || packetRow.primary_source_count >= 1;
}

async function handler({ request }: { request: Request }) {
  const url = new URL(request.url);
  const requestedMode = url.searchParams.get("mode") === "publish" ? "publish" : "shadow";
  const recoveryRequested = requestedMode === "publish" && url.searchParams.get("recover_election") === "1";
  const recoverElectionDraft = recoveryRequested && Date.now() <= Date.parse(ELECTION_RECOVERY_EXPIRES);
  if (!(await authorized(request, requestedMode))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.NEWSROOM_AI_ENABLED !== "true") {
    return Response.json({ ok: false, disabled: true, reason: "newsroom_ai_disabled" }, { status: 503 });
  }
  if (requestedMode === "publish" && process.env.NEWSROOM_PUBLISH_ENABLED !== "true") {
    return Response.json({ ok: false, disabled: true, reason: "newsroom_publish_disabled" }, { status: 503 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Newsroom tables intentionally lead generated Supabase types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;

  if (recoveryRequested && !recoverElectionDraft) {
    return Response.json({ ok: true, no_items: true, reason: "approved_election_recovery_window_expired", aiCalls: 0 });
  }
  const candidateQuery = recoverElectionDraft
    ? db.from("news_publish_candidates")
      .select("id,cluster_id,editorial_score,recommended_format,status")
      // Only untried, explicitly held October 11–25 drafts; no status override.
      .eq("status", "HELD")
      .is("rejection_reason", null)
      .in("recommended_format", ["SINGLE", "MERGE", "SYNTHESIS"])
      .gte("created_at", ELECTION_RECOVERY_START)
      .lt("created_at", ELECTION_RECOVERY_END)
    : db.from("news_publish_candidates")
      .select("id,cluster_id,editorial_score,recommended_format,status")
      // Normal generation never selects a held draft for another paid AI call.
      .eq("status", "PENDING")
      .in("recommended_format", ["SINGLE", "MERGE", "SYNTHESIS"])
      .gte("created_at", newsroomNewStoryCutoff());
  const { data: candidateData, error: candidateError } = await candidateQuery
    .order("editorial_score", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .limit(requestedMode === "publish" ? NEWSROOM_PUBLISH_SCAN_LIMIT : NEWSROOM_CANDIDATE_BATCH_SIZE);
  if (candidateError) return Response.json({ error: candidateError.message }, { status: 500 });
  const candidates = (candidateData ?? []) as CandidateRow[];
  if (!candidates.length) return Response.json({ ok: true, no_items: true, reason: "no_candidates", aiCalls: 0 });

  // Short-circuit as soon as a qualified candidate is found. Deeper ranked
  // candidates are still reachable when the top 100 lack sufficient evidence.
  // A single 500-UUID .in() filter can exceed provider URL/query limits; only
  // load the 100 candidates in the active batch and their packet bodies.
  let candidate: CandidateRow | undefined;
  let cluster: ClusterRow | undefined;
  let packetRow: PacketRow | undefined;
  let savedGeneratedDraft: SavedGeneratedDraft | undefined;
  let sawUnshadowed = false;
  let sawEvidenceEligible = false;
  let sawAuthorityEligible = false;
  let sawIndependentSources = false;
  let sawNovelSubject = false;
  const recentlyPublishedSubjects = new Set<string>();
  const existingLeadSources = new Set<string>();
  // Unlike the normal 72h newsroom duplicate scan, previously generated
  // October 11–25 stories can collide with content published earlier in the
  // approved period. Protect stable live URLs and avoid stale repeat coverage.
  const existingElectionTitles: string[] = [];
  if (recoverElectionDraft) {
    const { data: existingElectionArticles, error: existingElectionError } = await db
      .from("daily_articles").select("title")
      .eq("category", "Elections")
      .gte("published_at", ELECTION_RECOVERY_START)
      .limit(300);
    if (existingElectionError) return Response.json({ error: existingElectionError.message }, { status: 500 });
    existingElectionTitles.push(...(existingElectionArticles ?? []).map((row: { title: string }) => row.title));
  }

  for (let batchStart = 0; batchStart < candidates.length; batchStart += NEWSROOM_CANDIDATE_BATCH_SIZE) {
    const batch = candidates.slice(batchStart, batchStart + NEWSROOM_CANDIDATE_BATCH_SIZE);
    const clusterIds = [...new Set(batch.map((row) => row.cluster_id))];
    const candidateIds = batch.map((row) => row.id);
    const shadowDraftQuery = requestedMode === "shadow"
      ? db.from("newsroom_generation_drafts").select("candidate_id").eq("mode", "shadow").in("candidate_id", candidateIds)
      : Promise.resolve({ data: [], error: null });
    // No AI bill for previously GENERATED election drafts. Recover the last
    // previously validated publish-mode draft from the exact candidate record.
    const recoveryDraftQuery = recoverElectionDraft
      ? db.from("newsroom_generation_drafts")
        .select("id,candidate_id,draft_json,created_at,validation_reasons,model")
        .eq("mode", "publish").eq("status", "GENERATED")
        .in("candidate_id", candidateIds)
        .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null });
    const [
      { data: clusterData, error: clusterError },
      { data: packetData, error: packetError },
      { data: shadowDraftData, error: shadowDraftError },
      { data: recoveryDraftData, error: recoveryDraftError },
    ] = await Promise.all([
      db.from("news_story_clusters").select("id,canonical_subject,pillar_slug").in("id", clusterIds),
      db.from("news_research_packets").select("cluster_id,packet_json,source_count,primary_source_count").in("cluster_id", clusterIds),
      shadowDraftQuery,
      recoveryDraftQuery,
    ]);
    if (clusterError) return Response.json({ error: clusterError.message }, { status: 500 });
    if (packetError) return Response.json({ error: packetError.message }, { status: 500 });
    if (shadowDraftError) return Response.json({ error: shadowDraftError.message }, { status: 500 });
    if (recoveryDraftError) return Response.json({ error: recoveryDraftError.message }, { status: 500 });

    const clusterById = new Map(((clusterData ?? []) as ClusterRow[]).map((row) => [row.id, row]));
    const packetByCluster = new Map(((packetData ?? []) as PacketRow[]).map((row) => [row.cluster_id, row]));
    const shadowedCandidateIds = new Set<string>((shadowDraftData ?? []).map((row: { candidate_id: string }) => row.candidate_id));
    const savedDraftByCandidate = new Map<string, SavedGeneratedDraft>();
    for (const stored of ((recoveryDraftData ?? []) as SavedGeneratedDraft[])) {
      if (!savedDraftByCandidate.has(stored.candidate_id)) savedDraftByCandidate.set(stored.candidate_id, stored);
    }
    const unshadowedCandidates = batch.filter((row) => {
      if (shadowedCandidateIds.has(row.id)) return false;
      if (!recoverElectionDraft) return true;
      const record = clusterById.get(row.cluster_id);
      const saved = savedDraftByCandidate.get(row.id);
      return record?.pillar_slug === "texas-elections"
        && isFactualVotingAdministrationSubject(record.canonical_subject)
        && Boolean(saved && (saved.validation_reasons ?? []).length === 0)
        && electionDraftHeadlineMatchesEvent(record.canonical_subject, saved?.draft_json?.title ?? "");
    });
    sawUnshadowed ||= unshadowedCandidates.length > 0;
    const evidenceEligibleCandidates = unshadowedCandidates.filter((row) => {
      const packetRow = packetByCluster.get(row.cluster_id);
      const cluster = clusterById.get(row.cluster_id);
      if (!packetRow || !cluster || packetRow.source_count <= 0) return false;
      return researchPacketEvidenceChars(packetRow.packet_json) >= evidenceFloorForPillar(cluster.pillar_slug);
    });
    sawEvidenceEligible ||= evidenceEligibleCandidates.length > 0;

    // Keep the primary-source and independent-publisher requirements *before*
    // the paid reservation. Source counts alone can include syndicated mirrors.
    const authorityEligibleCandidates = evidenceEligibleCandidates.filter(
      (row) => productionAuthorityEligible(packetByCluster.get(row.cluster_id)!),
    );
    sawAuthorityEligible ||= authorityEligibleCandidates.length > 0;
    const independentlySourcedCandidates = authorityEligibleCandidates.filter((row) => {
      const sources = packetByCluster.get(row.cluster_id)?.packet_json.sources ?? [];
      return newsroomHasPublisherDiversity(sources);
    });
    sawIndependentSources ||= independentlySourcedCandidates.length > 0;

    // Distinct clusters can describe an already published event using other
    // publishers' URLs. Check the exact normalized subject as well as the lead
    // URL so expanding candidate depth never repackages recent coverage.
    if (requestedMode === "publish" && independentlySourcedCandidates.length) {
      const subjects = [...new Set(independentlySourcedCandidates
        .map((row) => clusterById.get(row.cluster_id)?.canonical_subject)
        .filter((subject): subject is string => Boolean(subject)))];
      for (let offset = 0; offset < subjects.length; offset += 20) {
        const publishedQuery = db.from("news_story_clusters")
          .select("canonical_subject")
          .eq("status", "PUBLISHED");
        const publishedWindowQuery = recoverElectionDraft
          ? publishedQuery.gte("published_at", ELECTION_RECOVERY_START)
          : publishedQuery.gte("published_at", newsroomNewStoryCutoff());
        const { data: publishedClusters, error: subjectError } = await publishedWindowQuery
          .in("canonical_subject", subjects.slice(offset, offset + 20));
        if (subjectError) return Response.json({ error: subjectError.message }, { status: 500 });
        for (const publishedCluster of publishedClusters ?? []) {
          if (publishedCluster.canonical_subject) recentlyPublishedSubjects.add(publishedCluster.canonical_subject);
        }
      }
    }
    const novelSubjectCandidates = requestedMode === "publish"
      ? independentlySourcedCandidates.filter((row) => {
        const subject = clusterById.get(row.cluster_id)?.canonical_subject;
        return Boolean(subject && !recentlyPublishedSubjects.has(subject)
          && (!recoverElectionDraft || !duplicatesExistingElectionStory(subject, existingElectionTitles)));
      })
      : independentlySourcedCandidates;
    sawNovelSubject ||= novelSubjectCandidates.length > 0;

    // Match the database's duplicate daily_articles.source_url protection.
    // Inspect exact lead URLs in bounded sets rather than spend an AI call
    // and discover the duplicate only after attempting publication.
    if (requestedMode === "publish" && novelSubjectCandidates.length) {
      const leadUrls = [...new Set(novelSubjectCandidates
        .map((row) => newsroomLeadSourceUrl(packetByCluster.get(row.cluster_id)?.packet_json.sources ?? []))
        .filter((url): url is string => Boolean(url)))];
      for (let offset = 0; offset < leadUrls.length; offset += 25) {
        const { data: existingRows, error: lookupError } = await db.from("daily_articles")
          .select("source_url")
          .in("source_url", leadUrls.slice(offset, offset + 25));
        if (lookupError) return Response.json({ error: lookupError.message }, { status: 500 });
        for (const row of existingRows ?? []) {
          if (row.source_url) existingLeadSources.add(row.source_url);
        }
      }
    }

    const chosen = requestedMode === "publish"
      ? novelSubjectCandidates.find((row) => {
        const leadUrl = newsroomLeadSourceUrl(packetByCluster.get(row.cluster_id)?.packet_json.sources ?? []);
        return Boolean(leadUrl && !existingLeadSources.has(leadUrl));
      })
      : evidenceEligibleCandidates[0];
    if (chosen) {
      candidate = chosen;
      cluster = clusterById.get(chosen.cluster_id);
      packetRow = packetByCluster.get(chosen.cluster_id);
      savedGeneratedDraft = recoverElectionDraft ? savedDraftByCandidate.get(chosen.id) : undefined;
      break;
    }
  }

  if (!candidate) {
    const reason = requestedMode === "shadow" && !sawUnshadowed
      ? "no_unshadowed_candidates"
      : requestedMode === "publish" && sawNovelSubject
        ? "already_published_source_url"
        : requestedMode === "publish" && sawIndependentSources
          ? "already_published_story_subject"
        : requestedMode === "publish" && sawAuthorityEligible
          ? "insufficient_independent_sources"
          : requestedMode === "publish" && sawEvidenceEligible
            ? "insufficient_authority_evidence"
            : "insufficient_source_evidence";
    return Response.json({ ok: true, no_items: true, reason, aiCalls: 0, candidatesScanned: candidates.length });
  }
  if (!cluster || !packetRow) return Response.json({ error: "Selected candidate is missing cluster or packet" }, { status: 500 });
  const evidenceChars = researchPacketEvidenceChars(packetRow.packet_json);
  const evidenceFloor = evidenceFloorForPillar(cluster.pillar_slug);
  const packet = compactResearchPacket(packetRow.packet_json);
  const kind = "normal";

  // Reusing a saved, validated draft consumes zero new AI generation budget.
  if (!recoverElectionDraft) {
    const { data: reservation, error: reserveError } = await db.rpc("newsroom_reserve_ai_generation", {
      p_site: SITE,
      p_kind: kind,
    });
    if (reserveError) return Response.json({ error: reserveError.message }, { status: 500 });
    if (!reservation?.reserved) {
      return Response.json({ ok: true, no_items: true, reason: "ai_budget_exhausted", budget: reservation, aiCalls: 0 });
    }
  }

  const selectedQuery = db.from("news_publish_candidates").update({
    status: "SELECTED",
    selected_at: new Date().toISOString(),
  }).eq("id", candidate.id);
  if (recoverElectionDraft) {
    // Exactly one scheduler can claim a held draft; no duplicate publications.
    const { data: claimed, error: claimError } = await selectedQuery.eq("status", "HELD").select("id");
    if (claimError) return Response.json({ error: claimError.message }, { status: 500 });
    if (!claimed?.length) return Response.json({ ok: true, no_items: true, reason: "recovery_claimed_elsewhere", aiCalls: 0 });
  } else {
    await selectedQuery;
  }

  let generated = false;
  try {
    let ai = recoverElectionDraft
      ? {
          value: savedGeneratedDraft!.draft_json,
          provider: "cloudflare-workers-ai" as const,
          model: savedGeneratedDraft!.model ?? "reused-validated-newsroom-draft",
          attempts: 0,
        }
      : await runCloudflareJson<NewsroomDraft>({
          system: newsroomRewriteSystemPrompt(packet),
          user: newsroomRewriteUserPrompt(packet),
          maxTokens: 12000,
          maxAttempts: 1,
          jsonSchema: NEWSROOM_DRAFT_JSON_SCHEMA,
        });
    generated = !recoverElectionDraft;
    let draft = normalizeNewsroomDraft(ai.value) as NewsroomDraft;
    let validation = validateNewsroomDraft(draft, packet);
    const firstValidationReasons = [...validation.reasons];
    let aiCalls = recoverElectionDraft ? 0 : 1;
    let providerAttempts = ai.attempts;
    let repairAttempted = false;

    if (!recoverElectionDraft && !validation.ok && !validation.reasons.includes("brief_no_clear_news_event")) {
      repairAttempted = true;
      const repaired = await runCloudflareJson<NewsroomDraft>({
        system: `${newsroomRewriteSystemPrompt(packet)}\n\nREPAIR MODE: The previous draft failed local validation. Correct only the listed failures while preserving supported facts, a 4–6-section source-proportional structure, 2–3 factual paragraphs per section, and all existing source and anti-repetition quality requirements. Every repaired paragraph must stay at or below 130 words and 4 sentences; never merge multiple factual roles into one oversized paragraph. Do not invent detail or pad with generic commentary.`,
        user: newsroomRepairUserPrompt(packet, draft, validation.reasons),
        maxTokens: 12000,
        maxAttempts: 1,
        jsonSchema: NEWSROOM_DRAFT_JSON_SCHEMA,
      });
      aiCalls += 1;
      providerAttempts += repaired.attempts;
      ai = repaired;
      draft = normalizeNewsroomDraft(repaired.value) as NewsroomDraft;
      validation = validateNewsroomDraft(draft, packet);
    }

    const { data: draftRows, error: draftError } = recoverElectionDraft
      ? { data: [{ id: savedGeneratedDraft!.id }], error: null }
      : await db.from("newsroom_generation_drafts").insert({
          candidate_id: candidate.id,
          cluster_id: candidate.cluster_id,
          mode: requestedMode,
          status: validation.ok ? "GENERATED" : "REJECTED",
          draft_json: draft,
          validation_reasons: validation.reasons,
          main_word_count: validation.mainWordCount,
          provider: ai.provider,
          model: ai.model,
          provider_attempts: providerAttempts,
        }).select("id").limit(1);
    if (draftError) throw new Error(draftError.message);
    const draftId = draftRows?.[0]?.id as string | undefined;

    if (!validation.ok) {
      const shadowFailure = requestedMode === "shadow" || recoverElectionDraft;
      await db.from("news_publish_candidates").update(shadowFailure ? {
        status: "HELD",
        ...(recoverElectionDraft ? { rejection_reason: ("recovery_draft_failed_revalidation:" + validation.reasons.join(",")).slice(0, 1000) } : {}),
      } : {
        status: "REJECTED",
        rejection_reason: validation.reasons.join(",").slice(0, 1000),
      }).eq("id", candidate.id);
      if (!recoverElectionDraft) await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: true });
      return Response.json({
        ok: true,
        generated: true,
        published: false,
        mode: requestedMode,
        candidateId: candidate.id,
        clusterId: candidate.cluster_id,
        draftId,
        evidenceChars,
        evidenceFloor,
        validation,
        firstValidationReasons,
        repairAttempted,
        provider: ai.provider,
        model: ai.model,
        attempts: providerAttempts,
        aiCalls,
      });
    }

    if (requestedMode === "shadow") {
      await db.from("news_publish_candidates").update({ status: "HELD" }).eq("id", candidate.id);
      if (!recoverElectionDraft) await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: true });
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
        evidenceChars,
        evidenceFloor,
        validation,
        firstValidationReasons,
        repairAttempted,
        provider: ai.provider,
        model: ai.model,
        attempts: providerAttempts,
        aiCalls,
      });
    }

    const now = new Date();
    const slug = slugifyNewsroomTitle(draft.title, now.toISOString().slice(0, 10));
    const packetSources = uniquePacketSources(packet.sources);
    const sourceDates = packetSources
      .map((source) => source.publishedAt)
      .filter((date): date is string => Boolean(date && Number.isFinite(Date.parse(date))))
      .sort();
    const firstSourceDate = sourceDates[0] ?? savedGeneratedDraft?.created_at ?? now.toISOString();
    const sourceCount = packetSources.length;
    const primarySourceCount = packetSources.filter((source) => source.isPrimarySource).length;
    const nonPrimarySourceCount = Math.max(0, sourceCount - primarySourceCount);
    const shouldNoindex = sourceCount < 2 && primarySourceCount === 0;
    const timeline = coverageTimeline(packetSources);
    const sources = packetSources.map((source) => ({
      label: sourceAuthorityLabel(source),
      url: source.url,
    }));
    const primary = packetSources.find((source) => source.isPrimarySource) ?? packetSources[0];
    const authority: AuthorityMetadata = {
      model: "aggregated",
      storyClusterId: candidate.cluster_id,
      recommendedFormat: candidate.recommended_format,
      sourceCount,
      primarySourceCount,
      nonPrimarySourceCount,
      generatedFromResearchPacket: true,
      indexability: shouldNoindex ? "noindex" : "indexable",
    };
    const authoritySections = [
      {
        heading: "What We Know — Key Takeaways",
        paragraphs: draft.keyTakeaways.map((takeaway) => takeaway.trim()).filter(Boolean),
      },
      {
        heading: "How This Story Was Built",
        paragraphs: [
          provenanceSummary({ sourceCount, primarySourceCount, recommendedFormat: candidate.recommended_format }),
          "[See Keep TX Red's source classifications and primary-source policy](/sources).",
        ],
      },
      ...(timeline.length >= 2 ? [{
        heading: "Coverage Timeline",
        paragraphs: timeline,
      }] : []),
    ].filter((section) => section.paragraphs.length > 0);
    const graphText = [
      cluster.canonical_subject,
      cluster.pillar_slug ?? "",
      draft.title,
      draft.dek,
      draft.summary,
      draft.relevance,
      ...draft.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
      ...draft.keyTakeaways,
    ].join(" ");
    const graphLinks = getGovernmentGraphLinks(graphText, 6, [`/news/${slug}`]);
    const permanentContextSections = graphLinks.length > 0 ? [{
      heading: "Permanent KTR Context",
      paragraphs: [
        `This story connects to KTR's permanent policy and government coverage: ${graphLinks.map((node) => `[${node.label}](${node.href})`).join(", ")}. These pages continue tracking the issue after this news cycle moves on.`,
      ],
    }] : [];
    const bodyJson = {
      updated: now.toISOString(),
      intro: recoverElectionDraft ? [
        `Retrospective election report: this article reviews source material originally published on or after ${new Date(firstSourceDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" })}. This retrospective was published only after the saved draft, source record and featured image underwent additional checks. It is not a live election-night result or a claim that conditions have remained unchanged since those source reports.`,
        draft.summary.trim(),
      ] : [draft.summary.trim()],
      sections: [
        ...authoritySections,
        { heading: "Texas relevance", paragraphs: [draft.relevance.trim()] },
        ...draft.sections,
        ...permanentContextSections,
        {
          heading: "Source Attribution",
          paragraphs: [
            GENERATED_NEWS_PROVENANCE_SIGNATURE,
            "Keep TX Red is an aggregation and synthesis publication. This story was independently rewritten from the linked source material rather than copied from a single publisher. Where the research packet contains an exact primary or official record, that record is labeled separately in the source list below.",
          ],
        },
      ],
      faq: draft.faq,
      sources,
      keyTakeaways: [],
      authority,
    };
    const row = {
      slug,
      internal_url: `/news/${slug}`,
      is_ingested: false,
      category: categoryForPillar(cluster.pillar_slug),
      title: draft.title.slice(0, 200),
      dek: draft.dek.slice(0, 400),
      author: "Keep TX Red Newsroom",
      source_name: primary?.source ?? "Keep TX Red aggregation packet",
      source_url: primary?.url ?? null,
      published_at: now.toISOString(),
      score: candidate.editorial_score,
      is_breaking: false,
      kind: "news",
      body: articleBodyText(bodyJson),
      body_json: bodyJson,
    };
    enrichArticleRow(row);
    // Classifying a story as "Texas" does not establish statewide impact.
    // The generic geographic template can falsely imply direct effects in
    // San Antonio, statewide, or other incidental mentions. Reuse the
    // factual Texas relevance prose that passed newsroom draft validation.
    (row as typeof row & { texas_impact_summary?: string | null }).texas_impact_summary =
      draft.relevance.trim().slice(0, 750);

    if (shouldNoindex) {
      const enriched = row as typeof row & { quality_flags?: string[] | null };
      enriched.quality_flags = [...new Set([...(enriched.quality_flags ?? []), "seo_noindex", "single_source_aggregation"] )];
    }

    // Editorial readiness and featured-image readiness are separate.
    // Always validate a candidate's source, draft and uniqueness BEFORE this
    // step. An image error must not strand an independently verified website
    // article; Facebook and image-required distribution still require a
    // separately approved hero and will not select a failed image.
    const preparedImage = await prepareFeaturedImageForUnpublishedNewsroomArticle({
      slug, title: row.title, dek: row.dek, category: row.category, body_json: row.body_json,
    });
    const imageReady = Boolean(preparedImage.ok && preparedImage.url && preparedImage.imageValidationNote);
    if (!imageReady) {
      console.warn("[newsroom] image distribution held; publishing source-verified text-only article", {
        candidateId: candidate.id,
        clusterId: candidate.cluster_id,
      });
    }
    const editorialRow = row as typeof row & { quality_flags?: string[] | null };
    const readyRow = preparedImage.ok && preparedImage.url && preparedImage.imageValidationNote
      ? {
        ...editorialRow,
        featured_image_url: preparedImage.url,
        image_url: preparedImage.url,
        image_alt_text: preparedImage.alt,
        image_generation_status: "ready",
        image_validation_note: preparedImage.imageValidationNote,
        image_prompt: preparedImage.imagePrompt ?? null,
      }
      : {
        ...editorialRow,
        // This marker is added only AFTER the complete source/editorial
        // publisher preflight, never to legacy backfills or external imports.
        quality_flags: [...new Set([...(editorialRow.quality_flags ?? []), "newsroom_text_first_verified"])],
        featured_image_url: null,
        image_url: null,
        image_alt_text: null,
        image_generation_status: "failed",
        image_validation_note: null,
        image_prompt: null,
      };
    const { data: articles, error: articleError } = await db
      .from("daily_articles")
      .upsert(readyRow, { onConflict: "slug" })
      .select("id")
      .limit(1);
    if (articleError) throw new Error(articleError.message);
    const articleId = articles?.[0]?.id as string | undefined;

    await Promise.all([
      db.from("news_publish_candidates").update({ status: "PUBLISHED", published_at: now.toISOString() }).eq("id", candidate.id),
      db.from("news_story_clusters").update({ status: "PUBLISHED", published_at: now.toISOString(), published_article_id: articleId ?? null }).eq("id", candidate.cluster_id),
      draftId ? db.from("newsroom_generation_drafts").update({ status: "PUBLISHED", published_article_id: articleId ?? null }).eq("id", draftId) : Promise.resolve(),
    ]);
    if (!recoverElectionDraft) await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: true });

    return Response.json({
      ok: true,
      generated: true,
      published: true,
      imageReady,
      webOnly: !imageReady,
      candidateId: candidate.id,
      clusterId: candidate.cluster_id,
      draftId,
      articleId,
      slug,
      sourceCount,
      primarySourceCount,
      indexability: shouldNoindex ? "noindex" : "indexable",
      evidenceChars,
      evidenceFloor,
      validation,
      firstValidationReasons,
      repairAttempted,
      provider: ai.provider,
      model: ai.model,
      attempts: providerAttempts,
      aiCalls,
      reusedApprovedDraft: recoverElectionDraft,
      graphLinks: graphLinks.map((node) => node.href),
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    const heldReason = details.startsWith("newsroom_image_publication_hold:")
      ? "image_verification_failed"
      : "publication_failed";
    // Record the exact blocked step; otherwise a validated GENERATED draft
    // becomes an opaque HELD candidate, and production silently goes stale.
    // HELD remains non-retryable by the paid generator until explicitly
    // reviewed or recovered. Never bypass the image/source quality gates.
    const failureDetails = `${heldReason}: ${details}`.slice(0, 1000);
    console.error("[newsroom] publication held", {
      candidateId: candidate.id,
      clusterId: candidate.cluster_id,
      reason: failureDetails,
    });
    await db.from("news_publish_candidates").update({
      status: "HELD",
      rejection_reason: failureDetails,
    }).eq("id", candidate.id);
    if (!recoverElectionDraft) await db.rpc("newsroom_finalize_ai_generation", { p_site: SITE, p_kind: kind, p_success: generated });
    return Response.json({
      error: "Newsroom generation failed",
      details: failureDetails,
      candidateId: candidate.id,
      heldReason,
    }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/hooks/generate-newsroom")({
  server: { handlers: { POST: handler } },
});
