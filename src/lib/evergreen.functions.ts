import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

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
};
export type EvergreenArticle = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  author: string;
  image_url: string | null;
  image_category: string | null;
  seo_headline: string | null;
  discover_category: string | null;
  seo_keywords: string[] | null;
  ctr_score: number | null;
  headline_variants: { a: string; b: string } | null;
  published_at: string;
  keywords: string[] | null;
  body: EvergreenBody | null;
};

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const getEvergreenBySlug = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }): Promise<EvergreenArticle | null> => {
    const supabase = client();
    if (!supabase) return null;
    const { data: row, error } = await supabase
      .from("daily_articles")
      .select("slug,category,title,dek,author,source_name,source_url,image_url,image_category,seo_headline,discover_category,seo_keywords,ctr_score,headline_variants,published_at,keywords,body_json,kind")
      .eq("slug", data.slug)
      .in("kind", ["evergreen", "ingested", "news", "sports-nfl", "sports-mlb", "sports-nba"])
      .maybeSingle();
    if (error || !row) return null;
    return {
      slug: row.slug,
      category: row.category,
      title: row.title,
      dek: row.dek,
      author: row.author ?? "Keep TX Red Editorial Team",
      image_url: row.image_url,
      image_category: (row as { image_category?: string | null }).image_category ?? null,
      seo_headline: (row as { seo_headline?: string | null }).seo_headline ?? null,
      discover_category: (row as { discover_category?: string | null }).discover_category ?? null,
      seo_keywords: (row as { seo_keywords?: string[] | null }).seo_keywords ?? null,
      ctr_score: (row as { ctr_score?: number | null }).ctr_score ?? null,
      headline_variants:
        (row as { headline_variants?: { a: string; b: string } | null }).headline_variants ?? null,
      published_at: row.published_at,
      keywords: (row as { keywords?: string[] | null }).keywords ?? null,
      body: (row as { body_json?: EvergreenBody | null }).body_json ?? synthMinimalBody(row),
    };
  });

function synthMinimalBody(row: {
  dek: string;
  title: string;
  source_name?: string | null;
  source_url?: string | null;
  category?: string | null;
}): EvergreenBody {
  const intro = [
    row.dek || `${row.title}.`,
    "This story is developing. Keep TX Red is following updates and will expand this report as more verified information becomes available.",
  ];
  const sections: EvergreenSection[] = [
    {
      heading: "Why This Matters for Texans",
      paragraphs: [
        `This ${row.category ?? "Texas"} story affects how the state is governed, funded, and represented. Keep TX Red is monitoring it because policy decisions in Austin and Washington ripple through every Texas community.`,
      ],
    },
  ];
  const sources = row.source_url && row.source_name
    ? [{ label: row.source_name, url: row.source_url }]
    : [];
  return {
    updated: new Date().toISOString(),
    intro,
    sections,
    faq: [],
    sources,
    keyTakeaways: [row.dek || row.title],
  };
}

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