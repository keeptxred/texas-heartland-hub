import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractEntities } from "@/lib/nlp";
import {
  buildImagePrompt,
  buildNegativeImagePrompt,
  inferArticleImageDomain,
  inferDomain,
  parseVisionVerdict,
  type Domain,
  type SubjectExtract,
  type VisionVerdict,
} from "./featured-image-core";
import { CLOUDFLARE_CULTURE_IMAGE_MODEL, generateImageBytes, validateImageMatchesArticle } from "./featured-image-cloudflare";
import {
  buildArticleFallbackImagePrompt,
  detectImageContentType,
  extensionForImageContentType,
  generateOpenAiImageBytes,
  OPENAI_IMAGE_FALLBACK_MODEL,
} from "./openai-image-fallback.server";
import {
  buildMultiSourceImageGrounding,
  extractSelectedImageLead,
  type MultiSourceImageFact,
  type MultiSourceImageGrounding,
} from "./multisource-image-grounding";

export { buildImagePrompt, buildNegativeImagePrompt, inferDomain, parseVisionVerdict } from "./featured-image-core";
export type { Domain, SubjectExtract, VisionVerdict } from "./featured-image-core";

const BUCKET = "article-images";
const STALE_GENERATION_LEASE_MS = 20 * 60 * 1000;
const SENSITIVE_IMAGE_SUBJECT_RE = /\b(shooting|shot|gunfire|road rage|killed|dead|death|fatal|murder|homicide|victim|suspect|attack|assault)\b/i;
const DATA_CENTER_IMAGE_SUBJECT_RE = /\b(data center(?:s)?|data-center(?:s)?|server farm(?:s)?|hyperscale)\b/i;

type ArticleRow = {
  slug: string;
  title: string;
  dek: string | null;
  category: string | null;
  keywords: string[] | null;
  seo_keywords: string[] | null;
  affected_regions: string[] | null;
  seo_headline: string | null;
  discover_category: string | null;
  texas_impact_summary: string | null;
  featured_image_url: string | null;
  image_generation_status: string | null;
  image_validation_note: string | null;
  body_json: unknown;
};

type BodySection = { heading?: string; paragraphs?: string[]; bullets?: string[] };

function bodyJsonText(bodyJson: unknown): string {
  if (!bodyJson || typeof bodyJson !== "object") return "";
  const bj = bodyJson as { intro?: unknown; sections?: unknown; faq?: unknown; keyTakeaways?: unknown };
  const parts: string[] = [];
  if (Array.isArray(bj.intro)) for (const p of bj.intro) if (typeof p === "string") parts.push(p);
  if (Array.isArray(bj.sections)) {
    for (const raw of bj.sections) {
      const s = raw as BodySection;
      if (typeof s.heading === "string") parts.push(s.heading);
      if (Array.isArray(s.paragraphs)) for (const p of s.paragraphs) if (typeof p === "string") parts.push(p);
      if (Array.isArray(s.bullets)) for (const p of s.bullets) if (typeof p === "string") parts.push(p);
    }
  }
  if (Array.isArray(bj.faq)) {
    for (const raw of bj.faq) {
      const f = raw as { q?: unknown; a?: unknown };
      if (typeof f.q === "string") parts.push(f.q);
      if (typeof f.a === "string") parts.push(f.a);
    }
  }
  if (Array.isArray(bj.keyTakeaways)) for (const p of bj.keyTakeaways) if (typeof p === "string") parts.push(p);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function firstParagraph(bodyJson: unknown): string {
  if (!bodyJson || typeof bodyJson !== "object") return "";
  const bj = bodyJson as { intro?: unknown; sections?: unknown };
  if (Array.isArray(bj.intro) && typeof bj.intro[0] === "string") return bj.intro[0].slice(0, 420);
  if (Array.isArray(bj.sections) && bj.sections.length) {
    const s = bj.sections[0] as { paragraphs?: unknown; body?: unknown };
    if (Array.isArray(s.paragraphs) && typeof s.paragraphs[0] === "string") return s.paragraphs[0].slice(0, 420);
    if (typeof s.body === "string") return s.body.slice(0, 420);
  }
  return "";
}

function sanitizeFilename(slug: string): string {
  return slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "article";
}

function extractImageSubject(row: ArticleRow, grounding: MultiSourceImageGrounding | null = null): SubjectExtract {
  const title = row.seo_headline?.trim() || row.title;
  if (grounding && grounding.mode !== "hold_image" && grounding.leadFact) {
    const evidenceText = [grounding.leadFact, ...grounding.verifiedFacts].join(" ");
    const entities = extractEntities(`${title} ${evidenceText}`);
    const locations = [...(row.affected_regions ?? []), ...entities.filter((e) => /houston|dallas|austin|san antonio|fort worth|el paso|rio grande|texas/i.test(e))]
      .filter((v, i, a) => a.indexOf(v) === i);
    const domain = inferDomain(evidenceText);
    const supporting = grounding.verifiedFacts.filter((fact) => fact !== grounding.leadFact).slice(0, 2).join(" ");
    const concreteSubject = grounding.mode === "verified_symbolic"
      ? `${grounding.leadFact} Neutral real Texas institutional setting representing only this verified action.`
      : `${grounding.leadFact}${supporting ? ` ${supporting}` : ""}`;
    return {
      title,
      firstParagraph: grounding.leadFact,
      entities,
      locations,
      domain,
      concreteSubject,
      evidenceGuidance: grounding.guidance,
      imageGroundingMode: grounding.mode,
    };
  }

  const intro = firstParagraph(row.body_json);
  const haystack = `${title} ${row.dek ?? ""} ${intro} ${bodyJsonText(row.body_json).slice(0, 1800)}`;
  const entities = extractEntities(haystack);
  const locations = [...(row.affected_regions ?? []), ...entities.filter((e) => /houston|dallas|austin|san antonio|fort worth|el paso|rio grande|texas/i.test(e))]
    .filter((v, i, a) => a.indexOf(v) === i);
  const domain = inferArticleImageDomain(`${title} ${row.dek ?? ""}`, haystack);
  const concreteSubject = domain === "legal"
    ? `${title}. A real Texas courthouse or courtroom representing the judicial ruling. ${intro}`.trim()
    : `${title}. ${intro}`.trim();
  return { title, firstParagraph: intro, entities, locations, domain, concreteSubject };
}

export function buildAltText(a: { title: string; category?: string | null }): string {
  return `Editorial news photograph for Keep TX Red article: ${a.title}${a.category ? ` — ${a.category}` : ""}`;
}

export function buildGenerationSafeSubject(subject: SubjectExtract): SubjectExtract {
  const storyText = `${subject.title} ${subject.firstParagraph} ${subject.concreteSubject}`;
  const location = subject.locations[0]?.trim();
  if (SENSITIVE_IMAGE_SUBJECT_RE.test(storyText)) {
    return {
      ...subject,
      title: `${location ? `${location} ` : "Texas "}interstate roadway infrastructure`.trim(),
      firstParagraph: "",
      concreteSubject: `An empty section of ${location ? `interstate roadway in ${location}` : "Texas interstate roadway"} in daylight, with asphalt travel lanes, concrete overpass, shoulder, guardrails, lane markings, and roadside traffic equipment clearly visible.`,
    };
  }
  if (subject.domain === "energy" && DATA_CENTER_IMAGE_SUBJECT_RE.test(storyText)) {
    return {
      ...subject,
      domain: "general",
      title: "Texas data-center and electrical infrastructure",
      firstParagraph: "",
      concreteSubject: "The exterior of a large Texas server facility in daylight, with cooling equipment, a utility substation, transmission lines, transformers, fenced industrial grounds, and electrical infrastructure clearly visible.",
    };
  }
  return subject;
}

export function buildGenerationOnlyImagePrompt(subject: SubjectExtract, extraGuidance = ""): string {
  const location = subject.locations.slice(0, 2).join(", ");
  const correction = extraGuidance ? `Correction from rejected attempt: ${extraGuidance}. ` : "";
  return [
    correction,
    "Physical-camera editorial news photograph, horizontal 16:9.",
    "Unstaged documentary photojournalism in natural daylight with true-to-life materials, realistic optics, and photographic depth of field.",
    `Assignment: ${subject.title}.`,
    `Primary physical scene: ${subject.concreteSubject}`,
    location ? `Texas location context: ${location}.` : "Texas location context.",
    "Fill the frame with the named physical infrastructure and ordinary environmental details in one coherent real-world scene.",
  ].join(" ").replace(/\s+/g, " ").trim().slice(0, 1800);
}

async function serviceClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function resetStaleFeaturedImageGenerationLeasesDirect(): Promise<{ reset: number; error?: string }> {
  const supabase = await serviceClient();
  const staleBefore = new Date(Date.now() - STALE_GENERATION_LEASE_MS).toISOString();
  // Generated Supabase types can lag internal image-generation audit fields.
  // Keep this maintenance write inside the existing registered image writer and
  // narrowly limit it to published rows with no stored image that have remained
  // in `generating` beyond twice the guarded workflow request timeout.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  const { data, error } = await db
    .from("daily_articles")
    .update({
      image_generation_status: "failed",
      image_validation_note: "Image generation lease expired before completion; returned to guarded recovery backlog.",
    })
    .is("featured_image_url", null)
    .eq("image_generation_status", "generating")
    .not("published_at", "is", null)
    .lt("updated_at", staleBefore)
    .select("slug");
  if (error) return { reset: 0, error: error.message };
  return { reset: data?.length ?? 0 };
}

async function loadMultiSourceImageGrounding(db: any, slug: string): Promise<MultiSourceImageGrounding | null> {
  const clusterResult = await db
    .from("news_event_clusters")
    .select("id,source_count,independent_source_count")
    .eq("published_slug", slug)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (clusterResult.error || !clusterResult.data) return null;
  if (Number(clusterResult.data.independent_source_count ?? 0) < 2) return null;

  const factsResult = await db
    .from("news_event_facts")
    .select("fact_text,fact_type,corroboration_count,primary_record_support,has_conflict")
    .eq("cluster_id", clusterResult.data.id);

  let selectedLeadFact: string | null = null;
  const sourcesResult = await db
    .from("news_event_cluster_sources")
    .select("feed_item_id,is_primary_record,relationship_type")
    .eq("cluster_id", clusterResult.data.id)
    .order("is_primary_record", { ascending: false })
    .limit(5);
  const feedIds = (sourcesResult.data ?? [])
    .map((source: { feed_item_id?: unknown }) => Number(source.feed_item_id))
    .filter((id: number) => Number.isInteger(id) && id > 0);
  if (feedIds.length) {
    const feedResult = await db
      .from("texas_news_feed")
      .select("id,cluster_json")
      .in("id", feedIds);
    for (const feed of feedResult.data ?? []) {
      selectedLeadFact = extractSelectedImageLead(feed.cluster_json);
      if (selectedLeadFact) break;
    }
  }

  return buildMultiSourceImageGrounding({
    facts: factsResult.error ? [] : (factsResult.data ?? []) as MultiSourceImageFact[],
    selectedLeadFact,
  });
}

async function generateAndStore(row: ArticleRow, opts: { overwrite?: boolean } = {}): Promise<{ ok: true; url: string; alt: string } | { ok: false; error: string }> {
  const supabase = await serviceClient();
  if (!opts.overwrite && row.featured_image_url) return { ok: true, url: row.featured_image_url, alt: buildAltText(row) };

  const grounding = await loadMultiSourceImageGrounding(supabase as any, row.slug);
  if (grounding?.mode === "hold_image") {
    const note = `multisource-image-hold: no safe verified visual fact; excluded_conflicts=${grounding.excludedConflictCount}`;
    await supabase.from("daily_articles").update({
      image_generation_status: "failed",
      image_prompt: null,
      image_validation_note: note,
    }).eq("slug", row.slug);
    return { ok: false, error: "Featured image held: the multi-source story has no safe corroborated or primary-record fact for visual generation." };
  }

  const subject = extractImageSubject(row, grounding);
  const generationSubject = buildGenerationSafeSubject(subject);
  const usesGenerationOnlyPrompt = generationSubject !== subject;
  const makeGenerationPrompt = (guidance = "") => usesGenerationOnlyPrompt
    ? buildGenerationOnlyImagePrompt(generationSubject, guidance)
    : buildImagePrompt(generationSubject, guidance);
  const previousFailure = row.image_generation_status === "failed" && row.image_validation_note?.trim()
    ? row.image_validation_note.trim().slice(0, 600)
    : "";
  const initialCorrection = previousFailure
    ? "Discard the prior composition entirely and start from a new physical-camera viewpoint centered on the concrete real-world subject."
    : "";
  const prompt = makeGenerationPrompt(initialCorrection);
  const alt = buildAltText(row);
  await supabase.from("daily_articles").update({ image_generation_status: "generating", image_prompt: prompt }).eq("slug", row.slug);

  try {
    let bytes: Uint8Array | null = null;
    let verdict: { matches: boolean; reason: string } = { matches: false, reason: "Cloudflare generation not attempted" };
    let usedPrompt = prompt;
    let provider = "cloudflare";
    let cloudflareFailure = "";

    try {
      let negativePrompt = buildNegativeImagePrompt(generationSubject, previousFailure);
      const imageModel = subject.domain === "culture" ? CLOUDFLARE_CULTURE_IMAGE_MODEL : undefined;
      bytes = await generateImageBytes(prompt, negativePrompt, imageModel);
      verdict = await validateImageMatchesArticle(bytes, subject);

      for (let attempt = 1; !verdict.matches && attempt <= 3; attempt += 1) {
        const correction = `Retry ${attempt}. Discard the prior composition completely. Create a new physical-camera news photograph from a different camera position, with the concrete physical subject filling the frame in a believable real-world setting.`;
        const stronger = makeGenerationPrompt(correction);
        usedPrompt = stronger;
        negativePrompt = buildNegativeImagePrompt(generationSubject, verdict.reason);
        bytes = await generateImageBytes(stronger, negativePrompt, imageModel);
        verdict = await validateImageMatchesArticle(bytes, subject);
      }

      if (!verdict.matches) cloudflareFailure = `strict validation rejected Cloudflare image: ${verdict.reason}`;
    } catch (error) {
      cloudflareFailure = error instanceof Error ? error.message : String(error);
      bytes = null;
      verdict = { matches: false, reason: cloudflareFailure };
    }

    if (!bytes || !verdict.matches) {
      const contextExcerpt = firstParagraph(row.body_json) || bodyJsonText(row.body_json).slice(0, 700);
      for (let attempt = 1; attempt <= 2; attempt += 1) {
        const correction = attempt === 1
          ? `The primary image pipeline could not produce an acceptable story match. ${cloudflareFailure || verdict.reason}`
          : `The prior OpenAI fallback was rejected by the story-match validator. ${verdict.reason}. Start over with a materially different composition centered on the article's concrete subject.`;
        const openAiPrompt = buildArticleFallbackImagePrompt({
          title: row.seo_headline?.trim() || row.title,
          dek: row.dek,
          category: row.category || row.discover_category,
          region: row.affected_regions?.slice(0, 2).join(", ") || null,
          excerpt: contextExcerpt,
          existingPrompt: `${makeGenerationPrompt(correction)} ${subject.evidenceGuidance ?? ""}`.trim(),
        });
        usedPrompt = openAiPrompt;
        provider = `openai:${OPENAI_IMAGE_FALLBACK_MODEL}`;
        bytes = await generateOpenAiImageBytes(openAiPrompt);
        verdict = await validateImageMatchesArticle(bytes, subject);
        if (verdict.matches) break;
      }
    }

    if (!bytes || !verdict.matches) {
      throw new Error(`Generated image failed all contextual AI attempts and strict story-match validation: ${verdict.reason}`);
    }

    const contentType = detectImageContentType(bytes);
    const filename = `${sanitizeFilename(row.slug)}.${extensionForImageContentType(contentType)}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(filename, bytes, {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
      upsert: true,
    });
    if (upErr) throw upErr;

    const url = `/api/public/article-image/${filename}`;
    await supabase.from("daily_articles").update({
      featured_image_url: url,
      image_alt_text: alt,
      image_generation_status: "ready",
      image_prompt: usedPrompt,
      image_validation_note: `${grounding ? `multisource-${grounding.mode}; ` : ""}${provider}; strict-vision ok: ${verdict.reason}`,
    }).eq("slug", row.slug);
    return { ok: true, url, alt };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabase.from("daily_articles").update({
      image_generation_status: "failed",
      image_validation_note: msg.slice(0, 1000),
    }).eq("slug", row.slug);
    return { ok: false, error: msg };
  }
}

const SELECT_COLS = "slug,title,dek,category,keywords,seo_keywords,affected_regions,seo_headline,discover_category,texas_impact_summary,featured_image_url,image_generation_status,image_validation_note,body_json";

export const generateFeaturedImageForSlug = createServerFn({ method: "POST" })
  .validator((d) => z.object({ slug: z.string().min(1).max(200), overwrite: z.boolean().optional() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = await serviceClient();
    const { data: row, error } = await supabase.from("daily_articles").select(SELECT_COLS).eq("slug", data.slug).maybeSingle();
    if (error || !row) return { ok: false as const, error: "Article not found" };
    return generateAndStore(row as ArticleRow, { overwrite: !!data.overwrite });
  });

export async function generateFeaturedImageForSlugDirect(slug: string, overwrite = false): Promise<{ ok: true; url: string; alt: string } | { ok: false; error: string }> {
  const supabase = await serviceClient();
  const { data: row, error } = await supabase.from("daily_articles").select(SELECT_COLS).eq("slug", slug).maybeSingle();
  if (error || !row) return { ok: false, error: "Article not found" };
  return generateAndStore(row as ArticleRow, { overwrite });
}

export const regenerateFeaturedImage = createServerFn({ method: "POST" })
  .validator((d) => z.object({ slug: z.string().min(1).max(200), token: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
    if (data.token !== expected) return { ok: false as const, error: "Unauthorized" };
    const supabase = await serviceClient();
    const { data: row, error } = await supabase.from("daily_articles").select(SELECT_COLS).eq("slug", data.slug).maybeSingle();
    if (error || !row) return { ok: false as const, error: "Article not found" };
    return generateAndStore(row as ArticleRow, { overwrite: true });
  });

export async function backfillBatch(limit = 5, overwrite = false): Promise<{ processed: number; ok: number; failed: number; results: { slug: string; ok: boolean; error?: string }[] }> {
  const supabase = await serviceClient();
  let q = supabase.from("daily_articles").select(SELECT_COLS).neq("image_generation_status", "generating").in("kind", ["evergreen", "ingested", "news", "sports-nfl", "sports-mlb", "sports-nba"]).order("published_at", { ascending: false }).limit(limit);
  if (!overwrite) q = q.is("featured_image_url", null).in("image_generation_status", ["pending", "failed"]);
  const { data: rows } = await q;
  const results: { slug: string; ok: boolean; error?: string }[] = [];
  for (const row of (rows ?? []) as ArticleRow[]) {
    const r = await generateAndStore(row, { overwrite });
    results.push({ slug: row.slug, ok: r.ok, error: r.ok ? undefined : r.error });
  }
  return { processed: results.length, ok: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, results };
}
