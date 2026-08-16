import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractEntities } from "@/lib/nlp";
import {
  buildImagePrompt,
  buildNegativeImagePrompt,
  inferDomain,
  parseVisionVerdict,
  type Domain,
  type SubjectExtract,
  type VisionVerdict,
} from "./featured-image-core";
import { generateImageBytes, validateImageMatchesArticle } from "./featured-image-cloudflare";

export { buildImagePrompt, buildNegativeImagePrompt, inferDomain, parseVisionVerdict } from "./featured-image-core";
export type { Domain, SubjectExtract, VisionVerdict } from "./featured-image-core";

const BUCKET = "article-images";
const PURPLE_HEART_IMAGE_URL = "/images/military-honors/purple-heart.svg";

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

function extractImageSubject(row: ArticleRow): SubjectExtract {
  const title = row.seo_headline?.trim() || row.title;
  const intro = firstParagraph(row.body_json);
  const haystack = `${title} ${row.dek ?? ""} ${intro} ${bodyJsonText(row.body_json).slice(0, 1800)}`;
  const entities = extractEntities(haystack);
  const locations = [...(row.affected_regions ?? []), ...entities.filter((e) => /houston|dallas|austin|san antonio|fort worth|el paso|rio grande|texas/i.test(e))]
    .filter((v, i, a) => a.indexOf(v) === i);
  const domain = inferDomain(haystack);
  const concreteSubject = domain === "legal"
    ? `${title}. A real Texas courthouse or courtroom representing the judicial ruling. ${intro}`.trim()
    : `${title}. ${intro}`.trim();
  return { title, firstParagraph: intro, entities, locations, domain, concreteSubject };
}

export function buildAltText(a: { title: string; category?: string | null }): string {
  return `Editorial news photograph for Keep TX Red article: ${a.title}${a.category ? ` — ${a.category}` : ""}`;
}

function staticFeaturedImage(row: ArticleRow): { url: string; alt: string } | null {
  const subject = `${row.title} ${row.seo_headline ?? ""} ${row.dek ?? ""}`;
  return /\bpurple heart\b/i.test(subject)
    ? { url: PURPLE_HEART_IMAGE_URL, alt: `Purple Heart medal — ${row.title}` }
    : null;
}

async function serviceClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function generateAndStore(row: ArticleRow, opts: { overwrite?: boolean } = {}): Promise<{ ok: true; url: string; alt: string } | { ok: false; error: string }> {
  const supabase = await serviceClient();
  const staticImage = staticFeaturedImage(row);
  if (staticImage) {
    await supabase.from("daily_articles").update({
      featured_image_url: staticImage.url,
      image_alt_text: staticImage.alt,
      image_generation_status: "ready",
      image_prompt: null,
      image_validation_note: "static military-honor asset",
    }).eq("slug", row.slug);
    return { ok: true, url: staticImage.url, alt: staticImage.alt };
  }
  if (!opts.overwrite && row.featured_image_url) return { ok: true, url: row.featured_image_url, alt: buildAltText(row) };

  const subject = extractImageSubject(row);
  const prompt = buildImagePrompt(subject);
  const alt = buildAltText(row);
  const filename = `${sanitizeFilename(row.slug)}.jpg`;
  await supabase.from("daily_articles").update({ image_generation_status: "generating", image_prompt: prompt }).eq("slug", row.slug);

  try {
    let negativePrompt = buildNegativeImagePrompt(subject);
    let bytes = await generateImageBytes(prompt, negativePrompt);
    let verdict = await validateImageMatchesArticle(bytes, subject);
    let usedPrompt = prompt;

    for (let attempt = 1; !verdict.matches && attempt <= 3; attempt += 1) {
      const correction = `Previous attempt rejected: ${verdict.reason}. Generate a completely new photographic composition. Use unmistakably real camera photography with natural materials and lighting. Do not repeat the rejected motif.`;
      const stronger = buildImagePrompt(subject, correction);
      usedPrompt = stronger;
      negativePrompt = buildNegativeImagePrompt(subject, verdict.reason);
      bytes = await generateImageBytes(stronger, negativePrompt);
      verdict = await validateImageMatchesArticle(bytes, subject);
    }

    if (!verdict.matches) throw new Error(`Generated image failed Cloudflare story-match/photorealism validation: ${verdict.reason}`);

    const { error: upErr } = await supabase.storage.from(BUCKET).upload(filename, bytes, {
      contentType: "image/jpeg",
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
      image_validation_note: `cloudflare-vision ok: ${verdict.reason}`,
    }).eq("slug", row.slug);
    return { ok: true, url, alt };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabase.from("daily_articles").update({ image_generation_status: "failed" }).eq("slug", row.slug);
    return { ok: false, error: msg };
  }
}

const SELECT_COLS = "slug,title,dek,category,keywords,seo_keywords,affected_regions,seo_headline,discover_category,texas_impact_summary,featured_image_url,image_generation_status,body_json";

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
