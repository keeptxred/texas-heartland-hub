import { createFileRoute } from "@tanstack/react-router";
import { dedupeArticleBody } from "@/lib/article-dedupe";
import { detectDiscoverCategory } from "@/lib/seo-headline";
import { scoreDiscoverMatch, type HeadlineVariants } from "@/lib/ctr-score";
import { getArticleImage } from "@/lib/fallback-images";

// Image-bucket taxonomy. Kept in sync with CATEGORY_IMAGE_POOLS in
// src/lib/fallback-images.ts. AI batch classifier tags each new article with
// one of these so the render layer can pick a matching free stock photo.
const IMAGE_BUCKETS = ["food", "sports", "politics", "business", "weather", "technology", "default"] as const;
type ImageBucket = (typeof IMAGE_BUCKETS)[number];

/**
 * ONE Gemini call per ingestion batch. Sends only {id, title, dek} — never the
 * full body — and asks for a JSON map of id -> image bucket. Cached in
 * daily_articles.image_category so we never re-classify the same article.
 */
async function classifyImageBuckets(
  rows: { slug: string; title: string; dek: string }[],
  lovableApiKey: string,
): Promise<Record<string, ImageBucket>> {
  if (rows.length === 0) return {};
  const payload = rows.map((r) => ({ id: r.slug, title: r.title.slice(0, 180), summary: (r.dek || "").slice(0, 200) }));
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Classify each article into ONE image category: food, sports, politics, business, weather, technology, default. Use 'default' when nothing fits. Return JSON object mapping id -> category. No prose.",
          },
          { role: "user", content: JSON.stringify(payload) },
        ],
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return {};
    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as Record<string, string>;
    const out: Record<string, ImageBucket> = {};
    for (const [id, cat] of Object.entries(parsed)) {
      const c = String(cat).toLowerCase().trim() as ImageBucket;
      if ((IMAGE_BUCKETS as readonly string[]).includes(c)) out[id] = c;
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * ONE Gemini call per ingestion batch. Sends ONLY {id, title} — never the
 * body — and asks for SEO-optimized Google Discover headlines. Cached in
 * daily_articles.seo_headline so the frontend never reprocesses.
 */
async function rewriteHeadlinesBatch(
  rows: { slug: string; title: string }[],
  lovableApiKey: string,
): Promise<Record<string, string>> {
  if (rows.length === 0) return {};
  const payload = rows.map((r) => ({ id: r.slug, title: r.title.slice(0, 200) }));
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Rewrite each headline to be SEO-friendly and optimized for Google Discover. Rules: no clickbait, keep factual accuracy, improve clarity and search relevance, front-load the key topic (Texas, Houston, BBQ, Election, etc.), active voice, 50-90 characters preferred. Return JSON object mapping id -> rewritten_headline. No prose.",
          },
          { role: "user", content: JSON.stringify(payload) },
        ],
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return {};
    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [id, headline] of Object.entries(parsed)) {
      const h = String(headline ?? "").trim();
      if (h.length >= 15 && h.length <= 140) out[id] = h;
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * ONE Gemini call per ingestion batch. Generates 2 factual headline variants
 * (A = SEO-focused, B = direct) for cheap A/B testing at render time. Never
 * called per-request; result cached in daily_articles.headline_variants.
 */
async function generateHeadlineVariantsBatch(
  rows: { slug: string; title: string }[],
  lovableApiKey: string,
): Promise<Record<string, HeadlineVariants>> {
  if (rows.length === 0) return {};
  const payload = rows.map((r) => ({ id: r.slug, title: r.title.slice(0, 200) }));
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Create 2 headline versions for each article optimized for Google Discover CTR. Rules: both must be factual (no clickbait exaggeration); variant 'a' is slightly more SEO-focused (front-loads key entity/topic, 50-90 chars); variant 'b' is more direct and conversational (shorter, punchier). Return JSON object: { id: { a: '...', b: '...' } }. No prose.",
          },
          { role: "user", content: JSON.stringify(payload) },
        ],
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return {};
    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>;
    const out: Record<string, HeadlineVariants> = {};
    for (const [id, v] of Object.entries(parsed)) {
      const obj = v as { a?: unknown; b?: unknown };
      const a = String(obj?.a ?? "").trim();
      const b = String(obj?.b ?? "").trim();
      if (a.length >= 15 && a.length <= 140 && b.length >= 15 && b.length <= 140) {
        out[id] = { a, b };
      }
    }
    return out;
  } catch {
    return {};
  }
}

const SOURCES: { name: string; url: string; category?: string }[] = [
  { name: "Office of the Governor", url: "https://gov.texas.gov/news/rss" },
  { name: "Texas Secretary of State", url: "https://www.sos.state.tx.us/rss/press.xml" },
  { name: "Texas Register", url: "https://www.sos.state.tx.us/texreg/texreg.xml" },
  // Non-Political feed group: human-interest, culture, parks, lifestyle, viral.
  { name: "Texas Parks & Wildlife", url: "https://tpwd.texas.gov/newsmedia/releases/rss/", category: "Non-Political" },
  { name: "Texas Monthly", url: "https://www.texasmonthly.com/feed/", category: "Non-Political" },
  { name: "Texas Standard", url: "https://www.texasstandard.org/feed/", category: "Non-Political" },
];

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&(?:lsquo|rsquo);/g, "'")
    .replace(/&(?:ldquo|rdquo);/g, '"')
    .replace(/&(?:ndash|mdash);/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? decode(m[1]) : "";
}

type Item = { title: string; link: string; pub_date: string; source: string; description: string; category?: string };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function hashStr(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 6);
}

const ALLOWED_CATEGORIES = [
  "Politics",
  "Elections",
  "Laws",
  "Legislature",
  "Business",
  "Sports",
  "Education",
  "Non-Political",
] as const;

function categoryFor(source: string): string {
  const s = source.toLowerCase();
  if (s.includes("governor")) return "Politics";
  if (s.includes("secretary")) return "Elections";
  if (s.includes("register")) return "Laws";
  if (s.includes("parks") || s.includes("monthly") || s.includes("standard")) return "Non-Political";
  return "Legislature";
}

type Rewrite = {
  title: string;
  dek: string;
  keywords: string[];
  summary: string;
  relevance: string;
  analysis?: string;
  keyTakeaways: string[];
  faq?: { q: string; a: string }[];
  category?: string;
};

const REWRITE_SYSTEM = `You are the Keep TX Red editorial engine. Rewrite a Texas news item from an official source into a fully ORIGINAL article for keeptxred.com.

HARD RULES:
- Extract only facts (who/what/when/where/why). Never copy sentences or phrasing from the source. No direct quote longer than 10 words.
- Neutral, factual tone in Summary, Relevance, and Key Takeaways. Analysis is clearly labeled opinion and is optional.
- Mobile-friendly paragraphs (2–4 sentences each).
- Meta description (dek) MUST be <= 155 characters.
- Title must be SEO-optimized, original, and not resemble the source headline.
- 5–10 lowercase keywords, Texas-specific where possible.
- MINIMUM LENGTH: summary + relevance + analysis combined MUST be at least 600 words of original prose. Expand context, background, and impact until the threshold is met.
- TEXAS RELEVANCE IS REQUIRED — the "relevance" field must always name Texas or a specific Texas city/region and explain the local stake, even if the source is national.
- Add a short original CONTEXT paragraph (history, prior action, comparable state precedent) inside the "summary" or as the first sentences of "relevance".
- Output VALID JSON only matching the schema below.

CATEGORY: Choose the best fit from: Politics, Elections, Laws, Legislature, Business, Sports, Education, Non-Political. Use "Non-Political" for human-interest, animals, viral, culture, festivals, weather, travel, lifestyle, entertainment, science, and parks/wildlife stories. Do NOT use Education as a fallback — only true school/academic policy.

SCHEMA:
{"title":"...","dek":"<=155 chars","keywords":["..."],"summary":"2-3 sentence neutral summary","relevance":"why this matters to Texas (2-4 sentences)","analysis":"optional labeled editorial interpretation, or omit","keyTakeaways":["3-5 short bullets"],"faq":[{"q":"...","a":"..."}],"category":"one of the allowed values"}`;

async function rewriteItem(it: Item, lovableApiKey: string): Promise<Rewrite | null> {
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: REWRITE_SYSTEM },
          {
            role: "user",
            content: `SOURCE: ${it.source}\nORIGINAL HEADLINE: ${it.title}\nORIGINAL SUMMARY: ${it.description}\nLINK: ${it.link}\nDATE: ${it.pub_date}\n\nRewrite per the rules. Return JSON only.`,
          },
        ],
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as Rewrite;
    if (!parsed?.title || !parsed?.summary || !parsed?.dek) return null;
    parsed.dek = parsed.dek.slice(0, 155);
    parsed.keywords = (parsed.keywords ?? []).slice(0, 10).map((k) => String(k).toLowerCase());
    parsed.keyTakeaways = (parsed.keyTakeaways ?? []).slice(0, 5);
    return parsed;
  } catch {
    return null;
  }
}

function buildArticleRow(it: Item, rw: Rewrite | null) {
  const datePrefix = it.pub_date.slice(0, 10);
  const baseTitle = rw?.title ?? it.title;
  const slug = `live-${datePrefix}-${slugify(baseTitle)}-${hashStr(it.link)}`;
  const aiCat =
    rw?.category && (ALLOWED_CATEGORIES as readonly string[]).includes(rw.category) ? rw.category : null;
  const cat = aiCat ?? it.category ?? categoryFor(it.source);
  const sections: { heading: string; paragraphs: string[] }[] = [
    {
      heading: "Texas relevance",
      paragraphs: [rw?.relevance ?? `This update from the ${it.source} affects Texans and is being tracked by the Keep TX Red newsroom.`],
    },
  ];
  if (rw?.analysis) {
    sections.push({ heading: "Analysis", paragraphs: [rw.analysis] });
  }
  sections.push({
    heading: "Source attribution",
    paragraphs: [
      `This story was reported using a public release from the ${it.source}. Keep TX Red rewrote the coverage independently and links to the official statement for verification.`,
    ],
  });

  return {
    slug,
    internal_url: `/news/${slug}`,
    is_ingested: true,
    category: cat,
    title: baseTitle.slice(0, 200),
    dek: (rw?.dek ?? (it.description || it.title)).slice(0, 155),
    body: rw?.summary ?? it.description ?? "",
    author: "Keep TX Red Newsroom",
    source_name: it.source,
    source_url: it.link,
    published_at: it.pub_date,
    kind: "ingested",
    is_breaking: false,
    score: 0,
    keywords: rw?.keywords ?? [],
    body_json: dedupeArticleBody({
      updated: it.pub_date.slice(0, 10),
      intro: [rw?.summary ?? it.description ?? `${it.source} released a new update for Texans.`],
      sections,
      faq: rw?.faq ?? [],
      sources: [{ label: `${it.source} — official release`, url: it.link }],
      keyTakeaways:
        rw?.keyTakeaways && rw.keyTakeaways.length > 0
          ? rw.keyTakeaways
          : [
              `Source: ${it.source}.`,
              "Keep TX Red rewrites every ingested story into original editorial coverage.",
            ],
    }),
  };
}

function parseFeed(xml: string, source: string): Item[] {
  const items: Item[] = [];
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) || [];
  for (const b of blocks) {
    const title = pick(b, "title");
    let link = pick(b, "link");
    if (!link) {
      const m = b.match(/<link[^>]*href=["']([^"']+)["']/i);
      if (m) link = m[1];
    }
    const rawDate = pick(b, "pubDate") || pick(b, "updated") || pick(b, "published") || "";
    const description = pick(b, "description") || pick(b, "summary") || pick(b, "content");
    const ts = Date.parse(rawDate);
    if (title && link) {
      // Skip junk titles like "PDF format" / "HTML format" that some feeds
      // (e.g. Texas Register) emit as separate items pointing to the same
      // issue in a different file format. They aren't headlines.
      const t = title.trim().toLowerCase();
      if (/^(pdf|html|rss|xml|word|doc|docx|txt|text|epub)\s*(format|version)?$/.test(t)) {
        continue;
      }
      items.push({
        title: title.slice(0, 500),
        link,
        pub_date: new Date(isNaN(ts) ? Date.now() : ts).toISOString(),
        source,
        description: description.slice(0, 1000),
      });
    }
  }
  return items;
}

export const Route = createFileRoute("/api/public/hooks/ingest-feeds")({
  server: {
    handlers: {
      POST: handler,
      GET: handler,
    },
  },
});

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const results = await Promise.all(
    SOURCES.map(async (s) => {
      try {
        const res = await fetch(s.url, {
          headers: {
            "User-Agent": "KeepTXRedBot/1.0 (+https://www.keeptxred.com)",
            Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
          },
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) return { source: s.name, url: s.url, status: res.status, items: [] as Item[] };
        const items = parseFeed(await res.text(), s.name)
          .slice(0, 25)
          .map((it) => ({ ...it, category: s.category }));
        return { source: s.name, url: s.url, status: res.status, items };
      } catch (e) {
        return { source: s.name, url: s.url, status: 0, error: String(e), items: [] as Item[] };
      }
    }),
  );

  const all = results.flatMap((r) => r.items);
  const diag = results.map(({ items, ...rest }) => ({ ...rest, count: items.length }));
  if (all.length === 0) {
    return new Response(JSON.stringify({ ok: true, inserted: 0, fetched: 0, diag }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Dedupe by link against existing rows
  const links = Array.from(new Set(all.map((i) => i.link)));
  const { data: existing } = await supabaseAdmin
    .from("texas_news_feed")
    .select("link")
    .in("link", links);
  const have = new Set((existing ?? []).map((r: { link: string }) => r.link));
  const fresh = all.filter((i) => !have.has(i.link));

  let inserted = 0;
  if (fresh.length > 0) {
    // texas_news_feed has no `category` column — strip it before insert.
    const feedRows = fresh.map(({ category: _c, ...rest }) => rest);
    const { error, count } = await supabaseAdmin
      .from("texas_news_feed")
      .upsert(feedRows, { onConflict: "link", ignoreDuplicates: true, count: "exact" });
    if (error) {
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    inserted = count ?? fresh.length;
  }

  // Mint a native Keep TX Red article for every freshly ingested feed item so
  // Happening Now only ever links to internal /news/{slug} URLs.
  let nativeMinted = 0;
  if (fresh.length > 0) {
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    const rewrites: (Rewrite | null)[] = lovableApiKey
      ? await Promise.all(fresh.map((it) => rewriteItem(it, lovableApiKey)))
      : fresh.map(() => null);
    const articleRows = fresh.map((it, i) => buildArticleRow(it, rewrites[i]));

    // ONE AI call classifies the whole batch into image buckets (cached in DB).
    const imageMap = lovableApiKey
      ? await classifyImageBuckets(
          articleRows.map((r) => ({ slug: r.slug, title: r.title, dek: r.dek })),
          lovableApiKey,
        )
      : {};
    // ONE AI call rewrites the batch's headlines for SEO/Discover (cached in DB).
    const seoMap = lovableApiKey
      ? await rewriteHeadlinesBatch(
          articleRows.map((r) => ({ slug: r.slug, title: r.title })),
          lovableApiKey,
        )
      : {};
    for (const row of articleRows) {
      const seo = seoMap[row.slug] ?? null;
      const headline = seo ?? row.title;
      const discover = detectDiscoverCategory(`${headline} ${row.dek}`);
      (row as { image_category?: string | null }).image_category = imageMap[row.slug] ?? null;
      (row as { seo_headline?: string | null }).seo_headline = seo;
      (row as { discover_category?: string | null }).discover_category =
        discover === "other" ? null : discover;
      (row as { seo_keywords?: string[] | null }).seo_keywords = row.keywords ?? null;
    }

    // ONE AI call generates A/B headline variants for the whole batch.
    const variantMap = lovableApiKey
      ? await generateHeadlineVariantsBatch(
          articleRows.map((r) => ({
            slug: r.slug,
            title: (r as { seo_headline?: string | null }).seo_headline ?? r.title,
          })),
          lovableApiKey,
        )
      : {};

    // Compute CTR score deterministically for every row (0 AI calls).
    for (const row of articleRows) {
      const anyRow = row as Record<string, unknown>;
      const variants =
        variantMap[row.slug] ??
        ({
          a: (anyRow.seo_headline as string | null) ?? row.title,
          b: row.title,
        } as HeadlineVariants);
      anyRow.headline_variants = variants;

      const resolvedImageUrl = getArticleImage({
        slug: row.slug,
        image_url: (anyRow.image_url as string | null | undefined) ?? null,
        image_category: (anyRow.image_category as string | null) ?? null,
        category: row.category,
        title: variants.a,
        dek: row.dek,
        keywords: row.keywords ?? null,
      });
      anyRow.ctr_score = scoreDiscoverMatch({
        slug: row.slug,
        title: row.title,
        dek: row.dek,
        seo_headline: (anyRow.seo_headline as string | null) ?? null,
        discover_category: (anyRow.discover_category as string | null) ?? null,
        image_category: (anyRow.image_category as string | null) ?? null,
        image_url: (anyRow.image_url as string | null | undefined) ?? null,
        category: row.category,
        keywords: row.keywords ?? null,
        seo_keywords: (anyRow.seo_keywords as string[] | null) ?? null,
        resolvedImageUrl,
      });
    }

    const { error: artErr, count: artCount } = await supabaseAdmin
      .from("daily_articles")
      .upsert(articleRows, { onConflict: "slug", ignoreDuplicates: true, count: "exact" });
    if (!artErr) {
      nativeMinted = artCount ?? articleRows.length;
      // Write the internal slug back onto the feed row so cards can link to it.
      await Promise.all(
        articleRows.map((row: { slug: string }, i: number) =>
          supabaseAdmin
            .from("texas_news_feed")
            .update({ internal_slug: row.slug })
            .eq("link", fresh[i].link),
        ),
      );
    }
  }

  // Backfill internal_slug for any older feed rows that don't have one yet.
  const { data: orphans } = await supabaseAdmin
    .from("texas_news_feed")
    .select("id,title,link,source,description,pub_date")
    .is("internal_slug", null)
    .limit(25);
  if (orphans && orphans.length > 0) {
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    const items: Item[] = orphans.map((row) => ({
      title: row.title,
      link: row.link,
      source: row.source,
      pub_date: row.pub_date,
      description: row.description ?? "",
    }));
    const rewrites: (Rewrite | null)[] = lovableApiKey
      ? await Promise.all(items.map((it) => rewriteItem(it, lovableApiKey)))
      : items.map(() => null);
    const backRows = items.map((it, i) => buildArticleRow(it, rewrites[i]));
    await supabaseAdmin
      .from("daily_articles")
      .upsert(backRows, { onConflict: "slug", ignoreDuplicates: true });
    await Promise.all(
      backRows.map((row, i) =>
        supabaseAdmin.from("texas_news_feed").update({ internal_slug: row.slug }).eq("link", items[i].link),
      ),
    );
  }

  // Canonical-URL dedupe: for any daily_articles rows sharing the same
  // source_url, keep the most-recently-updated slug and drop the rest.
  let dedupedCanonical = 0;
  try {
    const { data: dupes } = await supabaseAdmin
      .from("daily_articles")
      .select("id, slug, source_url, published_at")
      .not("source_url", "is", null)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(1000);
    if (dupes && dupes.length > 0) {
      const seen = new Set<string>();
      const toDelete: string[] = [];
      for (const row of dupes as { id: string; slug: string; source_url: string }[]) {
        const key = row.source_url;
        if (seen.has(key)) toDelete.push(row.id);
        else seen.add(key);
      }
      if (toDelete.length > 0) {
        await supabaseAdmin.from("daily_articles").delete().in("id", toDelete);
        dedupedCanonical = toDelete.length;
      }
    }
  } catch (e) {
    console.error("canonical dedupe failed", e);
  }

  return new Response(
    JSON.stringify({ ok: true, fetched: all.length, candidates: fresh.length, inserted, nativeMinted, dedupedCanonical, diag }),
    { headers: { "Content-Type": "application/json" } },
  );
}