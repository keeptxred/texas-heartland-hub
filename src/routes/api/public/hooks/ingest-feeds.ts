import { createFileRoute } from "@tanstack/react-router";
import { resolvePublishTimestamp } from "@/lib/article-slug-integrity";
import { isLowValueTitle } from "@/lib/low-value-titles";
import { scoreFeedItem, TEXAS_RELEVANCE_MIN } from "@/lib/viral-score";
export { publishSingleFeedItem } from "@/lib/ingest-feeds-legacy";

type Item = {
  title: string;
  link: string;
  pub_date: string;
  source: string;
  description: string;
};

type SourceMode = "rss" | "tpwd-html" | "texas-standard-html";
type Source = { name: string; url: string; category?: string | null; mode: SourceMode };
type FetchResult = {
  source: string;
  url: string;
  status: number;
  attempts: number;
  mode: SourceMode;
  items: Item[];
  error?: string;
};

const DIRECT_SOURCES: Source[] = [
  { name: "Office of the Governor", url: "https://gov.texas.gov/news/rss", mode: "rss" },
  { name: "Texas Secretary of State", url: "https://www.sos.state.tx.us/rss/press.xml", mode: "rss" },
  { name: "Texas Register", url: "https://www.sos.state.tx.us/texreg/texreg.xml", mode: "rss" },
  { name: "Texas Parks & Wildlife", url: "https://tpwd.texas.gov/newsmedia/releases/", category: "Non-Political", mode: "tpwd-html" },
  { name: "Texas Monthly", url: "https://www.texasmonthly.com/feed/", category: "Non-Political", mode: "rss" },
  { name: "Texas Standard", url: "https://www.texasstandard.org/feed/", category: "Non-Political", mode: "rss" },
  { name: "Texas Tribune", url: "https://feeds.texastribune.org/feeds/main/", mode: "rss" },
  { name: "Houston Public Media", url: "https://www.houstonpublicmedia.org/feed/", mode: "rss" },
  { name: "Dallas Cowboys", url: "https://www.dallascowboys.com/rss/news", category: "Sports", mode: "rss" },
  { name: "Houston Texans", url: "https://www.houstontexans.com/rss/news", category: "Sports", mode: "rss" },
  { name: "National Hurricane Center", url: "https://www.nhc.noaa.gov/index-at.xml", category: "Weather", mode: "rss" },
];

const VERIFIED_YOUTUBE = new Map<string, string>([
  ["ABC13 Houston (YouTube)", "https://www.youtube.com/feeds/videos.xml?channel_id=UCDmNmxF3ZVMeGyvWE9tOqPQ"],
  ["WFAA Dallas (YouTube)", "https://www.youtube.com/feeds/videos.xml?channel_id=UCBu0KdNokE4MqdkacvH37_A"],
]);

const TRANSIENT_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const GOOGLE_NEWS_RE = /^https:\/\/news\.google\.com\/rss\/search/i;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decode(m[1]) : "";
}

function parseFeed(xml: string, fallbackSource: string): Item[] {
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) ?? [];
  const items: Item[] = [];
  for (const block of blocks.slice(0, 40)) {
    let title = pick(block, "title");
    let link = pick(block, "link");
    if (!link) {
      const href = block.match(/<link[^>]+href=["']([^"']+)["']/i);
      link = href?.[1] ?? "";
    }
    const rawDate = pick(block, "pubDate") || pick(block, "updated") || pick(block, "published");
    const description = pick(block, "description") || pick(block, "summary") || pick(block, "content");
    if (!title || !link || isLowValueTitle(title)) continue;

    let source = fallbackSource;
    if (GOOGLE_NEWS_RE.test(link) || /news\.google\.com/i.test(link)) {
      const parts = title.split(" - ");
      if (parts.length > 1) {
        source = parts.pop()!.trim() || fallbackSource;
        title = parts.join(" - ").trim() || title;
      }
    }

    items.push({
      title: title.slice(0, 500),
      link,
      pub_date: resolvePublishTimestamp(rawDate || null),
      source,
      description: description.slice(0, 1200),
    });
  }
  return items;
}

function absoluteUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return "";
  }
}

function parseTpwdHtml(html: string): Item[] {
  const out: Item[] = [];
  const seen = new Set<string>();
  const re = /<a[^>]+href=["']([^"']*\?req=[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(re)) {
    const link = absoluteUrl(match[1], "https://tpwd.texas.gov/newsmedia/releases/");
    const title = decode(match[2]);
    if (!link || !title || title.length < 12 || seen.has(link) || isLowValueTitle(title)) continue;
    seen.add(link);
    out.push({
      title: title.slice(0, 500),
      link,
      pub_date: new Date().toISOString(),
      source: "Texas Parks & Wildlife",
      description: title,
    });
    if (out.length >= 25) break;
  }
  return out;
}

function parseTexasStandardHtml(html: string): Item[] {
  const out: Item[] = [];
  const seen = new Set<string>();
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(re)) {
    const link = absoluteUrl(match[1], "https://texasstandard.org/");
    const title = decode(match[2]);
    if (!link.includes("texasstandard.org/") || /\/(about|contact|archive|subscribe|faq)\/?$/i.test(link)) continue;
    if (!title || title.length < 25 || title.length > 220 || seen.has(link) || isLowValueTitle(title)) continue;
    seen.add(link);
    out.push({
      title: title.slice(0, 500),
      link,
      pub_date: new Date().toISOString(),
      source: "Texas Standard",
      description: title,
    });
    if (out.length >= 20) break;
  }
  return out;
}

async function fetchText(url: string, accept: string): Promise<{ status: number; text: string | null; attempts: number; error?: string }> {
  let lastStatus = 0;
  let lastError = "request failed";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.1; +https://keeptxred.com)",
          Accept: accept,
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(25000),
      });
      lastStatus = response.status;
      if (response.ok) return { status: response.status, text: await response.text(), attempts: attempt };
      lastError = `HTTP ${response.status}`;
      if (!TRANSIENT_STATUS.has(response.status)) return { status: response.status, text: null, attempts: attempt, error: lastError };
    } catch (error) {
      lastError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    }
    if (attempt < 3) await sleep(800 * attempt + Math.floor(Math.random() * 350));
  }
  return { status: lastStatus, text: null, attempts: 3, error: lastError };
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const output: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length || 1)) }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      output[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return output;
}

function normalizeDbSource(row: { source_name: string; rss_url: string | null; category: string | null }): Source | null {
  const name = row.source_name;
  let url = (row.rss_url ?? "").trim();
  if (!url) return null;

  if (/tpwd\.texas\.gov\/newsmedia\/releases\/rss\/?/i.test(url)) {
    return { name: "Texas Parks & Wildlife", url: "https://tpwd.texas.gov/newsmedia/releases/", category: row.category, mode: "tpwd-html" };
  }

  if (/youtube\.com\/feeds\/videos\.xml\?user=/i.test(url)) {
    const verified = VERIFIED_YOUTUBE.get(name);
    if (!verified) return null;
    url = verified;
  }

  return { name, url, category: row.category, mode: "rss" };
}

async function loadSources(): Promise<{ sources: Source[]; skippedLegacyYoutube: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const list: Source[] = [...DIRECT_SOURCES];
  const seen = new Set(list.map((source) => `${source.mode}:${source.url.toLowerCase()}`));
  let skippedLegacyYoutube = 0;

  const { data, error } = await supabaseAdmin
    .from("content_sources")
    .select("source_name,rss_url,category,enabled")
    .eq("enabled", true)
    .not("rss_url", "is", null);
  if (error) console.warn("[ingest-feeds] content_sources read failed", error.message);

  for (const row of (data ?? []) as Array<{ source_name: string; rss_url: string | null; category: string | null }>) {
    const normalized = normalizeDbSource(row);
    if (!normalized) {
      if (/youtube\.com\/feeds\/videos\.xml\?user=/i.test(row.rss_url ?? "")) skippedLegacyYoutube++;
      continue;
    }
    const key = `${normalized.mode}:${normalized.url.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(normalized);
  }
  return { sources: list, skippedLegacyYoutube };
}

function isTexasRelevant(item: Item): boolean {
  const result = scoreFeedItem({
    title: item.title,
    source: item.source,
    pub_date: item.pub_date,
    description: item.description,
  });
  return result.texasRelevanceScore >= TEXAS_RELEVANCE_MIN;
}

async function fetchSource(source: Source): Promise<FetchResult> {
  const isGoogle = GOOGLE_NEWS_RE.test(source.url);
  const accept = source.mode === "rss"
    ? "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*"
    : "text/html,application/xhtml+xml,*/*";
  const fetched = await fetchText(source.url, accept);

  if (!fetched.text && source.name === "Texas Standard" && source.mode === "rss") {
    const fallback = await fetchText("https://texasstandard.org/", "text/html,application/xhtml+xml,*/*");
    return {
      source: source.name,
      url: "https://texasstandard.org/",
      status: fallback.status,
      attempts: fetched.attempts + fallback.attempts,
      mode: "texas-standard-html",
      items: fallback.text ? parseTexasStandardHtml(fallback.text) : [],
      error: fallback.text ? undefined : fallback.error,
    };
  }

  if (!fetched.text) {
    return { source: source.name, url: source.url, status: fetched.status, attempts: fetched.attempts, mode: source.mode, items: [], error: fetched.error };
  }

  const items = source.mode === "tpwd-html"
    ? parseTpwdHtml(fetched.text)
    : parseFeed(fetched.text, source.name);
  return {
    source: source.name,
    url: source.url,
    status: fetched.status,
    attempts: fetched.attempts,
    mode: source.mode,
    items: items.slice(0, isGoogle ? 20 : 30),
  };
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sources, skippedLegacyYoutube } = await loadSources();

  const direct = sources.filter((source) => !GOOGLE_NEWS_RE.test(source.url));
  const google = sources.filter((source) => GOOGLE_NEWS_RE.test(source.url));

  // Direct publishers can tolerate moderate concurrency. Google News is kept to
  // two concurrent requests so dozens of query feeds do not trigger 503 bursts.
  const directResults = await mapWithConcurrency(direct, 6, fetchSource);
  const googleResults = await mapWithConcurrency(google, 2, fetchSource);
  const results = [...directResults, ...googleResults];

  const unique = new Map<string, Item>();
  for (const result of results) {
    for (const item of result.items) {
      if (!isTexasRelevant(item)) continue;
      if (!unique.has(item.link)) unique.set(item.link, item);
    }
  }
  const rows = [...unique.values()];

  let inserted = 0;
  if (rows.length > 0) {
    const { count, error } = await supabaseAdmin
      .from("texas_news_feed")
      .upsert(rows, { onConflict: "link", ignoreDuplicates: true, count: "exact" });
    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
    inserted = count ?? 0;
  }

  const diag = results.map(({ items, ...rest }) => ({ ...rest, count: items.length }));
  return Response.json({
    ok: true,
    fetched: rows.length,
    inserted,
    candidates: inserted,
    nativeMinted: 0,
    aiCalls: 0,
    sourceCount: sources.length,
    directSources: direct.length,
    googleNewsSources: google.length,
    skippedLegacyYoutube,
    healthySources: results.filter((result) => result.status >= 200 && result.status < 300 && result.items.length > 0).length,
    failedSources: results.filter((result) => !(result.status >= 200 && result.status < 300) || result.items.length === 0).length,
    diag,
  });
}

export const Route = createFileRoute("/api/public/hooks/ingest-feeds")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
