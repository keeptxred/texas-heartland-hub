import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { meetsArticleMainWordCount, sanitizeArticleFaqs } from "@/lib/article-length";

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
    const supabase = client();
    if (!supabase) return null;
    const { data: row, error } = await supabase
      .from("daily_articles")
      .select("slug,category,title,dek,author,source_name,source_url,image_url,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,seo_keywords,ctr_score,headline_variants,published_at,keywords,body_json,kind")
      .eq("slug", data.slug)
      .in("kind", ["evergreen", "ingested", "news", "sports-nfl", "sports-mlb", "sports-nba", "sports-cfb"])
      .maybeSingle();
    if (error || !row) return null;
    const rawBody = (row as { body_json?: EvergreenBody | null }).body_json ?? null;
    if (!rawBody) return null;
    const body = sanitizeEvergreenBody(rawBody, row.published_at);
    if (!meetsArticleMainWordCount(row.kind, body)) return null;
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

/** Returns all indexable cloud articles (evergreen + ingested news/sports) with data
 *  needed to build page, news, evergreen, and image sitemaps in one query. */
export const listSitemapArticles = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ articles: SitemapArticle[] }> => {
    const supabase = client();
    if (!supabase) return { articles: [] };
    const { data, error } = await supabase
      .from("daily_articles")
      .select("slug,title,published_at,image_url,kind,body_json")
      .in("kind", ["evergreen", "ingested", "news", "sports-nfl", "sports-mlb", "sports-nba", "sports-cfb"])
      .order("published_at", { ascending: false })
      .limit(5000);
    if (error || !data) return { articles: [] };
    return {
      articles: (data as (Omit<SitemapArticle, "updated_at"> & { body_json?: EvergreenBody | null })[])
        .filter((a) => {
          if (!a.body_json) return false;
          const sanitized = sanitizeEvergreenBody(a.body_json, a.published_at);
          return meetsArticleMainWordCount(a.kind, sanitized);
        })
        .map(({ body_json: _bodyJson, ...a }) => ({
          ...a,
          updated_at: null,
        })),
    };
  },
);
