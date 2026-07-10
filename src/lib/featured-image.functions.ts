// AI Featured Image System.
// Generates a unique, original editorial image per article via the
// Lovable AI Gateway (Nano Banana 2), uploads it to the private
// "article-images" Supabase bucket, and stores CDN-safe metadata
// on daily_articles. Never touches article slug, URL, body, or
// existing image_url — featured_image_url is a separate column
// that takes priority at render time.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.1-flash-image";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/images/generations";
const BUCKET = "article-images";

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
};

function sanitizeFilename(slug: string): string {
  return (
    slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "article"
  );
}

/** Build a detailed editorial image prompt from article context.
 *  Enforces the "no logos, no trademarks, no political symbols,
 *  no text in image" rules and steers away from generic
 *  flag/capitol shots unless the story is literally about them. */
export function buildImagePrompt(a: {
  title: string;
  dek?: string | null;
  category?: string | null;
  keywords?: string[] | null;
  regions?: string[] | null;
  summary?: string | null;
}): string {
  const kw = [...(a.keywords ?? [])].slice(0, 8).join(", ");
  const regions = (a.regions ?? []).slice(0, 3).join(", ");
  const subject = [a.title, a.dek, a.summary].filter(Boolean).join(" — ");
  const capitolAllowed = /capitol|legislature|governor|abbott|session|state house|state senate/i.test(
    `${a.title} ${a.dek ?? ""}`,
  );
  const flagAllowed = /flag|patriot|independence|texas day/i.test(`${a.title} ${a.dek ?? ""}`);

  const avoid = [
    "no logos of any kind",
    "no brand names or trademarks",
    "no political party symbols (elephants, donkeys, MAGA, campaign signs)",
    "no copyrighted characters or celebrities",
    "no text, letters, watermarks, or captions anywhere in the image",
    "no news-anchor desks or fake newsrooms",
    "no AI hands with extra fingers, no distorted anatomy",
    !capitolAllowed ? "avoid the Texas State Capitol dome and generic government-building shots" : "",
    !flagAllowed ? "avoid generic Texas or American flag imagery" : "",
  ]
    .filter(Boolean)
    .join("; ");

  const style =
    "Professional editorial photography style, or high-quality magazine illustration suitable for a Texas news publication. Natural lighting, realistic scene composition, cinematic depth of field, 16:9 landscape framing, muted editorial color palette with warm Texas tones. Focused on the actual story subject, not stock symbolism.";

  return [
    `Editorial featured image for a Texas news article.`,
    `Article subject: ${subject}.`,
    a.category ? `Topic area: ${a.category}.` : "",
    kw ? `Key concepts to depict: ${kw}.` : "",
    regions ? `Regional context: ${regions}, Texas.` : "",
    `Depict a specific, believable real-world scene that would run above this article in a serious publication. Do not depict identifiable real politicians or celebrities; if a person is needed, show anonymous everyday Texans from behind or in silhouette, faces obscured or out of frame.`,
    style,
    `Strict rules: ${avoid}.`,
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildAltText(a: { title: string; category?: string | null }): string {
  const cat = a.category ? ` — ${a.category}` : "";
  return `Editorial illustration for Keep TX Red news article: ${a.title}${cat}`;
}

async function generateImageBytes(prompt: string): Promise<Uint8Array> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Image gateway ${res.status}: ${body.slice(0, 400)}`);
  }
  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("Gateway returned no image data");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function serviceClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function generateAndStore(
  row: ArticleRow,
  opts: { overwrite?: boolean } = {},
): Promise<{ ok: true; url: string; alt: string } | { ok: false; error: string }> {
  const supabase = await serviceClient();

  if (!opts.overwrite && row.featured_image_url) {
    return { ok: true, url: row.featured_image_url, alt: buildAltText(row) };
  }

  const prompt = buildImagePrompt({
    title: row.seo_headline?.trim() || row.title,
    dek: row.dek,
    category: row.category,
    keywords: row.seo_keywords ?? row.keywords,
    regions: row.affected_regions,
    summary: row.texas_impact_summary,
  });
  const alt = buildAltText(row);
  const filename = `${sanitizeFilename(row.slug)}.png`;

  await supabase
    .from("daily_articles")
    .update({ image_generation_status: "generating", image_prompt: prompt })
    .eq("slug", row.slug);

  try {
    const bytes = await generateImageBytes(prompt);
    const path = filename;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, {
        contentType: "image/png",
        cacheControl: "public, max-age=31536000, immutable",
        upsert: true,
      });
    if (upErr) throw upErr;

    // Public passthrough URL — private bucket served via our own route.
    const url = `/api/public/article-image/${filename}`;

    await supabase
      .from("daily_articles")
      .update({
        featured_image_url: url,
        image_alt_text: alt,
        image_generation_status: "ready",
      })
      .eq("slug", row.slug);

    return { ok: true, url, alt };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabase
      .from("daily_articles")
      .update({ image_generation_status: "failed" })
      .eq("slug", row.slug);
    return { ok: false, error: msg };
  }
}

const SELECT_COLS =
  "slug,title,dek,category,keywords,seo_keywords,affected_regions,seo_headline,discover_category,texas_impact_summary,featured_image_url,image_generation_status";

/** Generate featured image for one slug (idempotent unless overwrite=true). */
export const generateFeaturedImageForSlug = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({ slug: z.string().min(1).max(200), overwrite: z.boolean().optional() })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const supabase = await serviceClient();
    const { data: row, error } = await supabase
      .from("daily_articles")
      .select(SELECT_COLS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !row) return { ok: false as const, error: "Article not found" };
    return generateAndStore(row as ArticleRow, { overwrite: !!data.overwrite });
  });

/** Admin-gated regenerate (checks shared passcode header). */
export const regenerateFeaturedImage = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ slug: z.string().min(1).max(200), token: z.string().min(1) }).parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
    if (data.token !== expected) return { ok: false as const, error: "Unauthorized" };
    const supabase = await serviceClient();
    const { data: row, error } = await supabase
      .from("daily_articles")
      .select(SELECT_COLS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !row) return { ok: false as const, error: "Article not found" };
    return generateAndStore(row as ArticleRow, { overwrite: true });
  });

/** Backfill helper: pull N articles missing a featured image and generate them. */
export async function backfillBatch(limit = 5): Promise<{
  processed: number;
  ok: number;
  failed: number;
  results: { slug: string; ok: boolean; error?: string }[];
}> {
  const supabase = await serviceClient();
  const { data: rows } = await supabase
    .from("daily_articles")
    .select(SELECT_COLS)
    .is("featured_image_url", null)
    .neq("image_generation_status", "generating")
    .in("image_generation_status", ["pending", "failed"])
    .in("kind", ["evergreen", "ingested", "news", "sports-nfl", "sports-mlb", "sports-nba"])
    .order("published_at", { ascending: false })
    .limit(limit);

  const results: { slug: string; ok: boolean; error?: string }[] = [];
  for (const row of (rows ?? []) as ArticleRow[]) {
    const r = await generateAndStore(row, { overwrite: false });
    results.push({ slug: row.slug, ok: r.ok, error: r.ok ? undefined : r.error });
  }
  return {
    processed: results.length,
    ok: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  };
}