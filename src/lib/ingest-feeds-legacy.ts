import { dedupeArticleBody } from "@/lib/article-dedupe";
import { articleMainWordCount } from "@/lib/article-length";
import { resolvePublishTimestamp } from "@/lib/article-slug-integrity";
import { runCloudflareJson } from "@/lib/cloudflare-json-ai.server";
import { enrichArticleRow } from "@/lib/content-quality";
import {
  editorialMinimumFor,
  runEditorialRewrite,
  type ArticleShape,
} from "@/lib/editorial-pipeline";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { neutralizeFirstPersonTitle } from "@/lib/neutralize-headline";
import { validatePoliticalAuthority } from "@/lib/political-entity-authority";
import {
  assessRewritePreflight,
  assertRewriteableOrThrow,
  toPersistedSnapshot,
} from "@/lib/rewrite-preflight";
import { resolveRewriteSource } from "@/lib/rewrite-source";

/**
 * Compatibility module for the final feed-item publishing step.
 *
 * Feed discovery and storage live in the current ingest route. This module is
 * intentionally limited to source extraction, deterministic preflight,
 * rewrite-budget accounting, direct Cloudflare Workers AI generation,
 * editorial validation, and the final guarded article insert. Keeping that
 * boundary small prevents obsolete ingestion/provider code from becoming a
 * second publication path.
 */

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

type Item = {
  title: string;
  link: string;
  pub_date: string;
  source: string;
  description: string;
  category?: string;
};

type Rewrite = ArticleShape & {
  title: string;
  dek: string;
  keywords: string[];
  summary: string;
  relevance: string;
  analysis?: string;
  sections?: { heading: string; paragraphs: string[] }[];
  keyTakeaways: string[];
  faq?: { q: string; a: string }[];
  category?: string;
};

type GeneratedArticleBody = {
  intro: string[];
  sections: { heading?: string; paragraphs?: string[]; bullets?: string[] }[];
  faq?: { q?: string; a?: string }[];
  keyTakeaways?: string[];
};

type RedditPostData = {
  selftext: string | null;
  externalUrl: string | null;
};

const REWRITE_SYSTEM = `You are the Keep TX Red editorial engine. Rewrite a Texas news item into a fully original article for keeptxred.com.

HARD RULES:
- Use only facts supported by the supplied source packet. Never invent facts, quotes, polling, statistics, offices, relationships, or chronology.
- Never copy source sentences. Paraphrase independently; keep any direct quote very short and source-attributed.
- Neutral, factual tone in Summary, Relevance, and Key Takeaways. Analysis is optional and must be clearly separated from reported fact.
- Title must be original, concrete, SEO-useful, and consistent with the article body.
- dek must be 155 characters or fewer.
- Produce 5-10 lowercase, Texas-relevant keywords.
- Texas relevance is required and must identify the concrete Texas stake.
- Use short web paragraphs and descriptive sections. Do not pad thin evidence.
- Let the editorial validator's evidence-driven word floor control length.
- Return valid JSON only.

CATEGORY: Choose exactly one of Politics, Elections, Laws, Legislature, Business, Sports, Education, Non-Political. Use Non-Political for human-interest, wildlife, culture, festivals, weather, travel, lifestyle, entertainment, science, and parks. Use Education only for genuine school or academic policy.

SCHEMA:
{"brief":{"hasClearNewsEvent":true},"title":"...","dek":"...","keywords":["..."],"summary":"...","relevance":"...","analysis":"optional","sections":[{"heading":"...","paragraphs":["..."]}],"keyTakeaways":["..."],"faq":[{"q":"...","a":"..."}],"category":"..."}`;

export function isPuzzleTitle(title: string): boolean {
  const value = title.toLowerCase();
  return (
    /\bcrossword\b/.test(value) ||
    /\bsudoku\b/.test(value) ||
    /\bword\s*(game|search|jumble|wrangler)\b/.test(value) ||
    /\b(daily|weekly)\s+puzzle\b/.test(value) ||
    /\bpuzzle\s+(for|of\s+the\s+day)\b/.test(value) ||
    /\bmini\s+puzzle\b/.test(value) ||
    /\bhoroscope(s)?\b/.test(value) ||
    /\bquiz\s+of\s+the\s+(day|week)\b/.test(value) ||
    /\bcartoon\s+of\s+the\s+day\b/.test(value) ||
    /\bnewsletter\b/.test(value)
  );
}

function categoryFor(source: string): string {
  const value = source.toLowerCase();
  if (value.includes("governor")) return "Politics";
  if (value.includes("secretary")) return "Elections";
  if (value.includes("register")) return "Laws";
  if (
    value.includes("parks") ||
    value.includes("monthly") ||
    value.includes("standard") ||
    value.includes("reddit")
  ) {
    return "Non-Political";
  }
  return "Legislature";
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function hashString(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36).slice(0, 6);
}

function articleBodyText(body: GeneratedArticleBody): string {
  const parts: string[] = [];
  for (const paragraph of body.intro ?? []) parts.push(paragraph);
  for (const section of body.sections ?? []) {
    if (section.heading) parts.push(section.heading);
    for (const paragraph of section.paragraphs ?? []) parts.push(paragraph);
    for (const bullet of section.bullets ?? []) parts.push(bullet);
  }
  for (const entry of body.faq ?? []) {
    if (entry.q) parts.push(entry.q);
    if (entry.a) parts.push(entry.a);
  }
  for (const takeaway of body.keyTakeaways ?? []) parts.push(takeaway);
  return parts.join(" ");
}

function isRedditLink(link: string): boolean {
  try {
    return /(^|\.)reddit\.com$/i.test(new URL(link).hostname);
  } catch {
    return false;
  }
}

async function fetchRedditPostData(link: string): Promise<RedditPostData> {
  try {
    const url = new URL(link);
    const jsonUrl = `https://www.reddit.com${url.pathname.replace(/\/?$/, "")}.json`;
    const response = await fetch(jsonUrl, {
      headers: { "User-Agent": "KeepTXRed/1.0 (+https://keeptxred.com)" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return { selftext: null, externalUrl: null };

    const data = (await response.json()) as Array<{
      data?: {
        children?: Array<{
          data?: {
            selftext?: string;
            url_overridden_by_dest?: string;
            url?: string;
            is_self?: boolean;
          };
        }>;
      };
    }>;
    const post = data?.[0]?.data?.children?.[0]?.data ?? {};
    const selftext = (post.selftext ?? "").replace(/\s+/g, " ").trim() || null;
    const candidate = post.url_overridden_by_dest || post.url || "";
    if (!candidate || post.is_self) return { selftext, externalUrl: null };

    try {
      const external = new URL(candidate);
      if (/(^|\.)reddit\.com$/i.test(external.hostname) || /(^|\.)redd\.it$/i.test(external.hostname)) {
        return { selftext, externalUrl: null };
      }
      return { selftext, externalUrl: external.toString() };
    } catch {
      return { selftext, externalUrl: null };
    }
  } catch {
    return { selftext: null, externalUrl: null };
  }
}

async function fetchLinkedArticleText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "KeepTXRed/1.0 (+https://keeptxred.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml/i.test(contentType)) return null;

    const html = await response.text();
    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<(header|footer|nav|aside|form)[\s\S]*?<\/\1>/gi, " ");
    const region = stripped.match(/<article[\s\S]*?<\/article>/i)?.[0] ?? stripped;
    const text = region
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return null;
    return text.length > 8_000 ? text.slice(0, 8_000) : text;
  } catch {
    return null;
  }
}

async function contentFingerprint(item: Item): Promise<string> {
  const normalized = [
    item.link.trim().toLowerCase(),
    item.title.trim().replace(/\s+/g, " ").toLowerCase(),
    item.pub_date.slice(0, 10),
    item.description.trim().replace(/\s+/g, " "),
  ].join("\n");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function rewriteItem(item: Item): Promise<{ article: Rewrite | null; failure: string | null }> {
  const neutralized = neutralizeFirstPersonTitle(item.title);
  if (neutralized && neutralized !== item.title) item.title = neutralized;

  const user = `SOURCE: ${item.source}\nORIGINAL HEADLINE: ${item.title}\nSOURCE MATERIAL: ${item.description}\nLINK: ${item.link}\nDATE: ${item.pub_date}\n\nRewrite per the rules. Return JSON only.`;
  let providerFailure: string | null = null;

  const result = await runEditorialRewrite<Rewrite>(async (addendum, attempt) => {
    try {
      const generated = await runCloudflareJson<Record<string, unknown>>({
        system: REWRITE_SYSTEM + addendum,
        user,
        maxTokens: 9_000,
        maxAttempts: 1,
        requestTimeoutMs: 90_000,
      });
      return { raw: JSON.stringify(generated.value) };
    } catch (error) {
      providerFailure = `Cloudflare Workers AI failed during ${attempt}: ${error instanceof Error ? error.message : String(error)}`;
      return { raw: null };
    }
  }, `${item.title}\n${item.description}`);

  const article = result.article;
  if (!article) {
    const validation = result.validation.reasons.join(", ") || result.droppedReason || "unknown rejection";
    return {
      article: null,
      failure:
        providerFailure ||
        (result.droppedReason === "no_clear_news_event"
          ? "Editorial analysis found no clear news event"
          : `Editorial validation rejected the draft: ${validation}`),
    };
  }

  if (!article.title || !article.summary || !article.dek) {
    return { article: null, failure: "Editorial output was missing title, summary, or dek" };
  }
  if (!article.relevance || article.relevance.trim().length < 40) {
    return { article: null, failure: "Editorial output was missing a usable Texas relevance explanation" };
  }

  article.dek = article.dek.slice(0, 155);
  article.keywords = (article.keywords ?? []).slice(0, 10).map((keyword) => String(keyword).toLowerCase());
  article.keyTakeaways = (article.keyTakeaways ?? []).slice(0, 5);
  article.sections = (article.sections ?? [])
    .filter((section) => section?.heading && Array.isArray(section.paragraphs) && section.paragraphs.length > 0)
    .slice(0, 10);
  return { article, failure: null };
}

function buildArticleRow(item: Item, rewrite: Rewrite) {
  const publishIso = resolvePublishTimestamp(item.pub_date);
  const datePrefix = publishIso.slice(0, 10);
  const descriptiveSlug = slugify(rewrite.title).split("-").filter(Boolean).slice(0, 12).join("-");
  const slug = `${datePrefix}-${descriptiveSlug}-${hashString(item.link)}`;
  const aiCategory =
    rewrite.category && (ALLOWED_CATEGORIES as readonly string[]).includes(rewrite.category)
      ? rewrite.category
      : null;
  const category = aiCategory ?? item.category ?? categoryFor(item.source);

  const sections: { heading: string; paragraphs: string[] }[] = [
    { heading: "Texas relevance", paragraphs: [rewrite.relevance] },
    ...(rewrite.sections ?? []).map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs,
    })),
    ...(rewrite.analysis ? [{ heading: "Analysis", paragraphs: [rewrite.analysis] }] : []),
    {
      heading: "Source attribution",
      paragraphs: [
        `Keep TX Red produced this report independently from source material published by ${item.source}. The original source is linked below for verification.`,
      ],
    },
  ];

  const bodyJson = dedupeArticleBody({
    updated: datePrefix,
    intro: [rewrite.summary],
    sections,
    faq: rewrite.faq ?? [],
    sources: [{ label: `${item.source} — source`, url: item.link }],
    keyTakeaways: rewrite.keyTakeaways ?? [],
  });

  return {
    slug,
    internal_url: `/news/${slug}`,
    is_ingested: true,
    category,
    title: rewrite.title.slice(0, 200),
    dek: rewrite.dek.slice(0, 155),
    body: articleBodyText(bodyJson),
    author: "Keep TX Red Newsroom",
    source_name: item.source,
    source_url: item.link,
    published_at: publishIso,
    kind: "ingested",
    is_breaking: false,
    score: 0,
    keywords: rewrite.keywords ?? [],
    body_json: bodyJson,
  };
}

async function resolveSourceText(row: {
  link: string;
  description: string | null;
  extracted_body?: string | null;
}): Promise<{ text: string; wordCount: number }> {
  const cached = (row.extracted_body ?? "").trim();
  if (cached) return { text: cached, wordCount: wordCount(cached) };

  if (isRedditLink(row.link)) {
    const post = await fetchRedditPostData(row.link);
    const linkedText = post.externalUrl ? await fetchLinkedArticleText(post.externalUrl) : null;
    const resolved = resolveRewriteSource({
      storedDescription: row.description,
      redditSelftext: post.selftext,
      linkedArticleText: linkedText,
      linkedArticleUrl: post.externalUrl,
    });
    return { text: resolved.text, wordCount: resolved.wordCount };
  }

  const stored = (row.description ?? "").trim();
  if (wordCount(stored) >= 400 || !/^https?:\/\//i.test(row.link)) {
    return { text: stored, wordCount: wordCount(stored) };
  }

  const linked = await fetchLinkedArticleText(row.link);
  if (linked && wordCount(linked) > wordCount(stored)) {
    const text = stored ? `${stored}\n\n${linked}` : linked;
    return { text, wordCount: wordCount(text) };
  }
  return { text: stored, wordCount: wordCount(stored) };
}

/**
 * Final guarded publication step used by multi-source publication and explicit
 * admin publishing. Repeated calls are idempotent once a feed row is linked.
 */
export async function publishSingleFeedItem(
  feedItemId: number,
): Promise<{ ok: boolean; slug?: string; error?: string; alreadyPublished?: boolean }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: row, error: rowError } = await supabaseAdmin
    .from("texas_news_feed")
    .select("id,title,link,source,description,pub_date,internal_slug,extracted_body,preflight_json")
    .eq("id", feedItemId)
    .maybeSingle();

  if (rowError || !row) return { ok: false, error: rowError?.message ?? "Feed item not found" };
  if (row.internal_slug) return { ok: true, slug: row.internal_slug, alreadyPublished: true };
  if (isPuzzleTitle(row.title)) return { ok: false, error: "Puzzle / filler titles are blocked from publish." };
  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
    return { ok: false, error: "Cloudflare Workers AI is not configured" };
  }

  const resolved = await resolveSourceText(row);
  const item: Item = {
    title: row.title,
    link: row.link,
    source: row.source,
    pub_date: row.pub_date,
    description: resolved.text,
  };

  const preflight = assessRewritePreflight({
    title: item.title,
    description: item.description,
    link: item.link,
  });
  await supabaseAdmin
    .from("texas_news_feed")
    .update({
      extracted_body: item.description || null,
      preflight_json: toPersistedSnapshot(preflight, preflight.rewriteable ? "none" : "preflight"),
    } as never)
    .eq("id", feedItemId);

  if (!preflight.rewriteable) {
    return { ok: false, error: `Rewrite skipped before AI generation: ${preflight.message}` };
  }
  assertRewriteableOrThrow(preflight);

  const fingerprint = await contentFingerprint(item);
  // Generated database types can lag publication-cache migrations.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cacheClient = supabaseAdmin as any;
  const { data: cachedRow } = await cacheClient
    .from("ai_rewrite_cache")
    .select("result_json,status,failure_reason")
    .eq("content_fingerprint", fingerprint)
    .maybeSingle();

  const cached = cachedRow as {
    result_json?: Rewrite | null;
    status?: string;
    failure_reason?: string | null;
  } | null;
  let rewrite = cached?.status === "completed" && cached.result_json ? cached.result_json : null;
  let rewriteFailure = cached?.failure_reason ?? null;

  if (!rewrite) {
    const configuredLimit = Number.parseInt(process.env.DAILY_AI_REWRITE_LIMIT ?? "8", 10);
    const dailyLimit = Number.isFinite(configuredLimit)
      ? Math.min(50, Math.max(1, configuredLimit))
      : 8;
    const { data: claimData, error: claimError } = await supabaseAdmin.rpc(
      "claim_ai_rewrite_slot" as never,
      {
        p_content_fingerprint: fingerprint,
        p_feed_item_id: feedItemId,
        p_daily_limit: dailyLimit,
      } as never,
    );
    if (claimError) {
      return { ok: false, error: `Could not reserve AI rewrite budget: ${claimError.message}` };
    }

    const claim = claimData as unknown as string;
    if (claim === "budget_exhausted") {
      return { ok: false, error: `Daily AI rewrite budget reached (${dailyLimit}). Try again after midnight UTC.` };
    }
    if (claim === "in_progress") {
      return { ok: false, error: "This source is already being rewritten. Try again in a few minutes." };
    }
    if (claim === "cached") {
      const { data: refreshedRow } = await cacheClient
        .from("ai_rewrite_cache")
        .select("result_json,failure_reason")
        .eq("content_fingerprint", fingerprint)
        .maybeSingle();
      rewrite = refreshedRow?.result_json ?? null;
      rewriteFailure = refreshedRow?.failure_reason ?? rewriteFailure;
    } else {
      const generated = await rewriteItem(item);
      rewrite = generated.article;
      rewriteFailure = generated.failure;
      await cacheClient
        .from("ai_rewrite_cache")
        .update(
          rewrite
            ? {
                status: "completed",
                result_json: rewrite,
                failure_reason: null,
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : {
                status: "failed",
                result_json: null,
                failure_reason: rewriteFailure ?? "AI rewrite failed",
                completed_at: null,
                updated_at: new Date().toISOString(),
              },
        )
        .eq("content_fingerprint", fingerprint);
    }
  }

  if (!rewrite) return { ok: false, error: rewriteFailure ?? "AI rewrite failed" };

  const articleRow = buildArticleRow(item, rewrite);
  const target = editorialMinimumFor(rewrite.category ?? categoryFor(item.source), item.description);
  const words = articleMainWordCount(articleRow.body_json);
  if (words < target) {
    return { ok: false, error: `Rewrite below tiered minimum (${words}/${target} words). Try again.` };
  }

  enrichArticleRow(articleRow);
  const entityValidation = validatePoliticalAuthority({
    headline: articleRow.title,
    body: `${articleRow.dek} ${articleRow.body} ${item.description}`,
  });
  if (!entityValidation.valid) {
    return {
      ok: false,
      error: `Political entity validation failed: ${entityValidation.errors.join(" ")}`,
    };
  }

  const { error: upsertError } = await supabaseAdmin
    .from("daily_articles")
    .upsert([articleRow], { onConflict: "slug", ignoreDuplicates: true });
  if (upsertError) return { ok: false, error: upsertError.message };

  await supabaseAdmin
    .from("texas_news_feed")
    .update({ internal_slug: articleRow.slug })
    .eq("id", feedItemId);

  void generateFeaturedImageForSlugDirect(articleRow.slug, true).catch(() => undefined);
  return { ok: true, slug: articleRow.slug };
}
