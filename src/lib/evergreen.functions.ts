import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { articleMainWordCount, meetsArticleMainWordCount, sanitizeArticleFaqs } from "@/lib/article-length";
import { isSitemapEligibleSlug } from "@/lib/article-slug-integrity";
import { selectCanonicalArticles } from "@/lib/article-canonical";
import { isPublicArticleReady } from "@/lib/public-article-readiness";
import { getChatNewsFallbackBySlug } from "@/lib/chat-news-fallback";

export type EvergreenSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};
export type EvergreenBody = {
  updated: string;
  intro: string[];
  sections: EvergreenSection[];
  faq: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  editorNote?: string;
  keyTakeaways?: string[];
  entities?: {
    type: "Person" | "Organization" | "Event";
    name: string;
    identifier?: string;
    url?: string;
    sameAs?: string;
  }[];
};
export type EvergreenArticle = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  author: string;
  image_url: string | null;
  image_category: string | null;
  featured_image_url: string | null;
  image_alt_text: string | null;
  seo_headline: string | null;
  discover_category: string | null;
  seo_keywords: string[] | null;
  ctr_score: number | null;
  headline_variants: { a: string; b: string } | null;
  published_at: string;
  kind: string;
  keywords: string[] | null;
  body: EvergreenBody | null;
};

const GENERIC_VISIBLE_CONTENT = [
  /keep tx red is tracking this story/i,
  /check back for updates/i,
  /affects texans and is being tracked/i,
  /this story is developing/i,
  /more information will be added as it becomes available/i,
];

const PUBLIC_ARTICLE_KINDS = new Set([
  "evergreen",
  "ingested",
  "news",
  "sports-nfl",
  "sports-mlb",
  "sports-nba",
  "sports-cfb",
]);

/**
 * `live-` slugs belong to the original provisional/rapid-publish pipeline that
 * preceded the site's current publication-quality gates. Search Console showed
 * that several of those URLs received the site's initial discovery burst and
 * then disappeared from search as visibility collapsed. Keep the URLs available
 * for users and historical links, but never proactively re-advertise them via
 * XML discovery feeds. A future live-blog product should use its own explicitly
 * reviewed indexability contract instead of inheriting these legacy slugs.
 */
function isLegacyLiveSlug(slug: string): boolean {
  return String(slug ?? "").trim().toLowerCase().startsWith("live-");
}

export function isLegacyArticleAllowedInSitemap(
  slug: string,
  qualityFlags: string[] | null | undefined,
): boolean {
  if (!isLegacyLiveSlug(slug)) return true;
  return (qualityFlags ?? []).some(
    (flag) => String(flag).trim().toLowerCase() === "legacy_url_restored",
  );
}

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function cleanText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function isGenericVisibleText(value: string): boolean {
  return GENERIC_VISIBLE_CONTENT.some((pattern) => pattern.test(value));
}

function validDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function sanitizeEvergreenBody(body: EvergreenBody, publishedAt: string): EvergreenBody {
  const published = validDate(publishedAt) ?? new Date().toISOString();
  const candidateUpdated = validDate(body.updated) ?? published;
  const updated = new Date(candidateUpdated).getTime() < new Date(published).getTime()
    ? published
    : candidateUpdated;
  const intro = (Array.isArray(body.intro) ? body.intro : [])
    .map(cleanText)
    .filter((text) => text.length > 0 && !isGenericVisibleText(text));
  const sections = (Array.isArray(body.sections) ? body.sections : [])
    .map((section) => ({
      ...section,
      heading: cleanText(section.heading ?? ""),
      paragraphs: (Array.isArray(section.paragraphs) ? section.paragraphs : [])
        .map(cleanText)
        .filter((text) => text.length > 0 && !isGenericVisibleText(text)),
      bullets: (Array.isArray(section.bullets) ? section.bullets : [])
        .map(cleanText)
        .filter((text) => text.length > 0 && !isGenericVisibleText(text)),
    }))
    .filter((section) =>
      section.heading.length > 0
      && ((section.paragraphs?.length ?? 0) > 0 || (section.bullets?.length ?? 0) > 0),
    );
  const sources = (Array.isArray(body.sources) ? body.sources : [])
    .map((source) => ({ label: cleanText(source.label ?? ""), url: cleanText(source.url ?? "") }))
    .filter((source) => {
      if (!source.label || !source.url) return false;
      try {
        const parsed = new URL(source.url);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    });

  return {
    ...body,
    updated,
    intro,
    sections,
    faq: sanitizeArticleFaqs(body.faq).map((faq) => ({ q: cleanText(faq.q), a: cleanText(faq.a) })),
    sources,
    keyTakeaways: body.keyTakeaways?.map(cleanText).filter(Boolean),
  };
}

export const getEvergreenBySlug = createServerFn({ method: "GET" })
  .validator((d) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }): Promise<EvergreenArticle | null> => {
    const fallback = getChatNewsFallbackBySlug(data.slug) as EvergreenArticle | null;
    const supabase = client();
    if (!supabase) return fallback;

    // Use the same array-mode PostgREST response shape as the working newsroom
    // list loader. Object-mode `.maybeSingle()` made a valid production article
    // disappear behind a 404 even though the same row was visible in `/news`.
    // Slugs are unique in production, so one ordered/limited row is sufficient.
    const { data: rows, error } = await supabase
      .from("daily_articles")
      .select("slug,category,title,dek,author,source_name,source_url,image_url,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,seo_keywords,ctr_score,headline_variants,published_at,keywords,body_json,kind")
      .eq("slug", data.slug)
      .limit(1);
    if (error) {
      console.error("getEvergreenBySlug lookup failed", { slug: data.slug, code: error.code });
      return fallback;
    }
    const row = rows?.[0] ?? null;
    if (!row || !PUBLIC_ARTICLE_KINDS.has(row.kind)) return fallback;
    const rawBody = (row as { body_json?: EvergreenBody | null }).body_json ?? null;
    if (!rawBody) return fallback;
    const body = sanitizeEvergreenBody(rawBody, row.published_at);
    if (!meetsArticleMainWordCount(row.kind, body)) return fallback;
    return {
      slug: row.slug,
      category: row.category,
      title: row.title,
      dek: row.dek,
      author: row.author ?? "Keep TX Red Editorial Team",
      image_url: row.image_url,
      image_category: (row as { image_category?: string | null }).image_category ?? null,
      featured_image_url:
        (row as { featured_image_url?: string | null }).featured_image_url ?? null,
      image_alt_text:
        (row as { image_alt_text?: string | null }).image_alt_text ?? null,
      seo_headline: (row as { seo_headline?: string | null }).seo_headline ?? null,
      discover_category: (row as { discover_category?: string | null }).discover_category ?? null,
      seo_keywords: (row as { seo_keywords?: string[] | null }).seo_keywords ?? null,
      ctr_score: (row as { ctr_score?: number | null }).ctr_score ?? null,
      headline_variants:
        (row as { headline_variants?: { a: string; b: string } | null }).headline_variants ?? null,
      published_at: row.published_at,
      kind: row.kind,
      keywords: (row as { keywords?: string[] | null }).keywords ?? null,
      body,
    };
  });

export const listEvergreenSlugs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = client();
  if (!supabase) return { slugs: [] as { slug: string; published_at: string }[] };
  const { data, error } = await supabase
    .from("daily_articles")
    .select("slug,published_at")
    .eq("kind", "evergreen")
    .order("published_at", { ascending: false })
    .limit(500);
  if (error) return { slugs: [] };
  return { slugs: data ?? [] };
});

export type SitemapArticle = {
  slug: string;
  title: string;
  published_at: string;
  updated_at: string | null;
  image_url: string | null;
  kind: string;
};

export const resolveArticleSlugRedirect = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string().min(1).max(240) }).parse(d))
  .handler(async ({ data }): Promise<{ slug: string | null }> => {
    const supabase = client();
    if (!supabase) return { slug: null };
    const { resolveRedirectChain, MAX_REDIRECT_HOPS } = await import("@/lib/article-canonical");

    const map = new Map<string, string>();
    let current = data.slug;
    for (let hop = 0; hop < MAX_REDIRECT_HOPS; hop++) {
      const { data: row, error } = await supabase
        .from("article_slug_redirects")
        .select("old_slug,new_slug")
        .eq("old_slug", current)
        .maybeSingle();
      if (error || !row) break;
      const next = (row as { new_slug: string }).new_slug;
      map.set(current, next);
      if (map.has(next)) break;
      current = next;
    }
    if (map.size === 0) return { slug: null };
    return { slug: resolveRedirectChain(map, data.slug) };
  });

const SITEMAP_ARTICLE_PAGE_SIZE = 1000;
const MAX_CLOUD_SITEMAP_ARTICLES = 45000;

export const listSitemapArticles = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ articles: SitemapArticle[] }> => {
    const supabase = client();
    if (!supabase) return { articles: [] };

    type Row = SitemapArticle & {
      category?: string | null;
      source_name?: string | null;
      source_url?: string | null;
      body_json?: EvergreenBody | null;
      quality_flags?: string[] | null;
      content_quality_score?: number | null;
    };
    const rows: Row[] = [];
    for (let from = 0; from < MAX_CLOUD_SITEMAP_ARTICLES; from += SITEMAP_ARTICLE_PAGE_SIZE) {
      const { data, error } = await supabase
        .from("daily_articles")
        .select("slug,title,category,source_name,source_url,published_at,updated_at,image_url,kind,body_json,quality_flags,content_quality_score")
        .in("kind", ["evergreen", "ingested", "news", "sports-nfl", "sports-mlb", "sports-nba", "sports-cfb"])
        .order("published_at", { ascending: false })
        .order("slug", { ascending: true })
        .range(from, from + SITEMAP_ARTICLE_PAGE_SIZE - 1);
      if (error || !data) return { articles: [] };
      const page = data as Row[];
      rows.push(...page);
      if (page.length < SITEMAP_ARTICLE_PAGE_SIZE) break;
    }

    const eligible = rows
      .filter((a) => {
        if (!a.body_json) return false;
        if (!isLegacyArticleAllowedInSitemap(a.slug, a.quality_flags)) return false;
        if (!isSitemapEligibleSlug(a.slug, a.published_at)) return false;
        if (!isPublicArticleReady(a)) return false;
        const sanitized = sanitizeEvergreenBody(a.body_json, a.published_at);
        return meetsArticleMainWordCount(a.kind, sanitized);
      })
      .map(({ body_json, quality_flags: _flags, category: _category, source_name: _sourceName, source_url: _sourceUrl, ...a }) => ({
        ...a,
        main_word_count: articleMainWordCount(sanitizeEvergreenBody(body_json!, a.published_at)),
      }));

    const canonical = selectCanonicalArticles(eligible);
    const articles = canonical.map(
      ({ main_word_count: _wc, content_quality_score: _score, ...a }) => a,
    );
    return { articles };
  },
);

export const resolveArticleSlugByTail = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ tail: z.string().min(4).max(200) }).parse(d))
  .handler(async ({ data }): Promise<{ slug: string | null }> => {
    const supabase = client();
    if (!supabase) return { slug: null };
    const { data: rows, error } = await supabase
      .from("daily_articles")
      .select("slug")
      .like("slug", `%-${data.tail}`)
      .limit(2);
    if (error || !rows || rows.length !== 1) return { slug: null };
    return { slug: (rows[0] as { slug: string }).slug };
  });
