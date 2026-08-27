import { createFileRoute } from "@tanstack/react-router";
import { resolvePublishTimestamp } from "@/lib/article-slug-integrity";
import { isLowValueTitle } from "@/lib/low-value-titles";
import { scoreFeedItem, TEXAS_RELEVANCE_MIN } from "@/lib/viral-score";
export { publishSingleFeedItem } from "@/lib/multi-source-publish";
export { isPuzzleTitle } from "@/lib/ingest-feeds-legacy";

type Item = {
  title: string;
  link: string;
  pub_date: string;
  source: string;
  description: string;
};
type IngestRow = Item & { trend_source: string };

type SourceMode = "rss" | "tpwd-html" | "texas-standard-html" | "html-links";
type Source = {
  name: string;
  url: string;
  category?: string | null;
  mode: SourceMode;
  include?: string;
  texasOnly?: boolean;
};
type FetchResult = {
  source: string;
  url: string;
  status: number;
  attempts: number;
  mode: SourceMode;
  items: Item[];
  error?: string;
};

// Direct and first-party publishers are the backbone. Google News remains a
// rotating supplemental discovery layer below so a Google outage cannot blind
// KeepTXRed to the statewide/local stories readers expect.
const DIRECT_SOURCES: Source[] = [
  { name: "Office of the Governor", url: "https://gov.texas.gov/news/rss", mode: "rss" },
  { name: "Texas Secretary of State", url: "https://www.sos.state.tx.us/rss/press.xml", mode: "rss" },
  { name: "Texas Register", url: "https://www.sos.state.tx.us/texreg/texreg.xml", mode: "rss" },
  { name: "Texas Comptroller", url: "https://public.govdelivery.com/topics/TXCOMPT_1/feed.rss", mode: "rss" },
  { name: "UIL Press Releases", url: "https://feeds.feedburner.com/uil-press-releases", category: "Sports", mode: "rss" },
  { name: "Texas Parks & Wildlife", url: "https://tpwd.texas.gov/newsmedia/releases/", category: "Non-Political", mode: "tpwd-html" },
  { name: "Texas Monthly", url: "https://www.texasmonthly.com/feed/", category: "Non-Political", mode: "rss" },
  { name: "Texas Standard", url: "https://www.texasstandard.org/feed/", category: "Non-Political", mode: "rss" },
  { name: "Texas Tribune", url: "https://feeds.texastribune.org/feeds/main/", mode: "rss" },
  { name: "Houston Public Media", url: "https://www.houstonpublicmedia.org/feed/", mode: "rss" },
  { name: "KSAT San Antonio Local", url: "https://www.ksat.com/arc/outboundfeeds/rss/category/news/local/?outputType=xml&size=25", mode: "rss" },
  { name: "KSAT Spurs", url: "https://www.ksat.com/arc/outboundfeeds/rss/tags_slug/spurs/?outputType=xml&size=25", category: "Sports", mode: "rss" },
  {
    name: "CBP Texas Local Releases",
    url: "https://www.cbp.gov/newsroom/media-releases/all?combine=&field_date_release_value=All&field_newsroom_type_target_id_1=54&items_per_page=25&sort_bef_combine=sort_by_DESC&tid_1=All",
    mode: "html-links",
    include: "^/newsroom/(local-media-release|media-releases)/",
    texasOnly: true,
  },
  { name: "Laredo Morning Times", url: "https://www.lmtonline.com/local/", mode: "html-links", include: "^/local/" },
  { name: "NewsChannel 10 Amarillo", url: "https://www.newschannel10.com/news/", mode: "html-links", include: "^/20\\d{2}/" },
  { name: "KCEN Central Texas", url: "https://www.kcentv.com/", mode: "html-links", include: "^/article/news/(local|community|education|military)/" },
  { name: "City of Dallas News", url: "https://www.dallascitynews.net/", mode: "html-links", include: "^/20\\d{2}/" },
  { name: "WFAA Dallas Local", url: "https://www.wfaa.com/", mode: "html-links", include: "^/article/news/local/" },
  { name: "Dallas Cowboys", url: "https://www.dallascowboys.com/rss/news", category: "Sports", mode: "rss" },
  { name: "Houston Texans", url: "https://www.houstontexans.com/rss/news", category: "Sports", mode: "rss" },
  { name: "Dallas Mavericks", url: "https://www.mavs.com/news/", category: "Sports", mode: "html-links", include: "^/news/" },
  { name: "San Antonio Spurs", url: "https://www.nba.com/spurs/news", category: "Sports", mode: "html-links", include: "^/spurs/news/" },
  { name: "Texas Rangers", url: "https://www.mlb.com/rangers/news", category: "Sports", mode: "html-links", include: "^/rangers/news/" },
  { name: "Houston Astros", url: "https://www.mlb.com/astros/news", category: "Sports", mode: "html-links", include: "^/astros/news/" },
  { name: "Dallas Stars", url: "https://www.nhl.com/stars/news/", category: "Sports", mode: "html-links", include: "^/stars/news/" },
  { name: "Texas Longhorns", url: "https://texaslonghorns.com/news/", category: "Sports", mode: "html-links", include: "^/news/20\\d{2}/" },
  { name: "Texas A&M Aggies", url: "https://12thman.com/news/", category: "Sports", mode: "html-links", include: "^/news/20\\d{2}/" },
  { name: "Texas Tech Athletics", url: "https://texastech.com/news/", category: "Sports", mode: "html-links", include: "^/news/20\\d{2}/" },
  { name: "National Hurricane Center", url: "https://www.nhc.noaa.gov/index-at.xml", category: "Weather", mode: "rss" },
];

const VERIFIED_YOUTUBE = new Map<string, string>([
  ["ABC13 Houston (YouTube)", "https://www.youtube.com/feeds/videos.xml?channel_id=UCDmNmxF3ZVMeGyvWE9tOqPQ"],
  ["WFAA Dallas (YouTube)", "https://www.youtube.com/feeds/videos.xml?channel_id=UCBu0KdNokE4MqdkacvH37_A"],
]);

const TRANSIENT_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const GOOGLE_NEWS_RE = /^https:\/\/news\.google\.com\/rss\/search/i;
const GOOGLE_FEEDS_PER_RUN = 10;
const OFFICIAL_HYPERLOCAL_SOURCE_RE = /— CivicEngage$/i;
const TEXAS_LOCATION_RE = /\b(texas|tx|amarillo|austin|beaumont|brownsville|college station|corpus christi|dallas|del rio|eagle pass|el paso|fort worth|galveston|harlingen|hereford|houston|killeen|laredo|longview|lubbock|mcallen|midland|odessa|san angelo|san antonio|temple|texarkana|tyler|victoria|waco|webb county|bexar county|harris county|tarrant county|travis county|denton county|collin county|rio grande valley|panhandle)\b/i;
const HTML_NAV_RE = /\b(home|about|contact|privacy|terms|advertise|subscribe|newsletter|weather|watch live|shop|careers|login|sign in|search|facebook|instagram|youtube|twitter|x)\b/i;

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
  for (const block of blocks.slice(0, 50)) {
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

function parseHtmlLinks(html: string, source: Source): Item[] {
  const out: Item[] = [];
  const seen = new Set<string>();
  const include = source.include ? new RegExp(source.include, "i") : null;
  const base = new URL(source.url);
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(re)) {
    const href = match[1].trim();
    const link = absoluteUrl(href, source.url);
    const title = decode(match[2]);
    if (!link || !title || title.length < 18 || title.length > 240 || isLowValueTitle(title)) continue;
    if (HTML_NAV_RE.test(title) && title.split(/\s+/).length <= 5) continue;
    let parsed: URL;
    try {
      parsed = new URL(link);
    } catch {
      continue;
    }
    if (parsed.hostname !== base.hostname && !parsed.hostname.endsWith(`.${base.hostname}`)) continue;
    if (include && !include.test(parsed.pathname)) continue;
    if (source.texasOnly && !TEXAS_LOCATION_RE.test(`${title} ${parsed.pathname}`)) continue;
    const cleanLink = `${parsed.origin}${parsed.pathname}${parsed.search}`;
    if (seen.has(cleanLink)) continue;
    seen.add(cleanLink);
    out.push({
      title: title.slice(0, 500),
      link: cleanLink,
      pub_date: new Date().toISOString(),
      source: source.name,
      description: `${source.name}: ${title}`.slice(0, 1200),
    });
    if (out.length >= 30) break;
  }
  return out;
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
    out.push({ title: title.slice(0, 500), link, pub_date: new Date().toISOString(), source: "Texas Parks & Wildlife", description: title });
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
    out.push({ title: title.slice(0, 500), link, pub_date: new Date().toISOString(), source: "Texas Standard", description: title });
    if (out.length >= 20) break;
  }
  return out;
}

async function fetchText(url: string, accept: string, maxAttempts = 3, timeoutMs = 25000): Promise<{ status: number; text: string | null; attempts: number; error?: string }> {
  let lastStatus = 0;
  let lastError = "request failed";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.2; +https://keeptxred.com)",
          Accept: accept,
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });
      lastStatus = response.status;
      if (response.ok) return { status: response.status, text: await response.text(), attempts: attempt };
      lastError = `HTTP ${response.status}`;
      if (!TRANSIENT_STATUS.has(response.status)) return { status: response.status, text: null, attempts: attempt, error: lastError };
    } catch (error) {
      lastError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    }
    if (attempt < maxAttempts) await sleep(500 * attempt + Math.floor(Math.random() * 250));
  }
  return { status: lastStatus, text: null, attempts: maxAttempts, error: lastError };
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
  const { data, error } = await supabaseAdmin.from("content_sources").select("source_name,rss_url,category,enabled").eq("enabled", true).not("rss_url", "is", null);
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

function isTexasRelevant(item: Item, configuredSource: string): boolean {
  // Official municipal CivicEngage feeds are explicitly allowlisted Texas primary sources.
  // Their agenda titles are often generic ("Regular Meeting") and should not be discarded
  // merely because the city/state name lives in the configured feed identity, not the title.
  if (OFFICIAL_HYPERLOCAL_SOURCE_RE.test(configuredSource)) return true;
  const result = scoreFeedItem({ title: item.title, source: item.source, pub_date: item.pub_date, description: item.description });
  return result.texasRelevanceScore >= TEXAS_RELEVANCE_MIN;
}

function rotateGoogleSources(sources: Source[]): Source[] {
  if (sources.length <= GOOGLE_FEEDS_PER_RUN) return sources;
  const window = Math.floor(Date.now() / (30 * 60 * 1000));
  const start = (window * GOOGLE_FEEDS_PER_RUN) % sources.length;
  const selected: Source[] = [];
  for (let i = 0; i < GOOGLE_FEEDS_PER_RUN; i++) selected.push(sources[(start + i) % sources.length]);
  return selected;
}

async function fetchSource(source: Source): Promise<FetchResult> {
  const isGoogle = GOOGLE_NEWS_RE.test(source.url);
  const isHtmlLinks = source.mode === "html-links";
  const accept = source.mode === "rss" ? "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*" : "text/html,application/xhtml+xml,*/*";
  const fetched = await fetchText(source.url, accept, isGoogle ? 2 : isHtmlLinks ? 1 : 3, isGoogle ? 10000 : isHtmlLinks ? 12000 : 25000);
  if (!fetched.text && source.name === "Texas Standard" && source.mode === "rss") {
    const fallback = await fetchText("https://texasstandard.org/", "text/html,application/xhtml+xml,*/*", 2, 15000);
    return { source: source.name, url: "https://texasstandard.org/", status: fallback.status, attempts: fetched.attempts + fallback.attempts, mode: "texas-standard-html", items: fallback.text ? parseTexasStandardHtml(fallback.text) : [], error: fallback.text ? undefined : fallback.error };
  }
  if (!fetched.text) return { source: source.name, url: source.url, status: fetched.status, attempts: fetched.attempts, mode: source.mode, items: [], error: fetched.error };
  const items = source.mode === "tpwd-html" ? parseTpwdHtml(fetched.text) : source.mode === "html-links" ? parseHtmlLinks(fetched.text, source) : parseFeed(fetched.text, source.name);
  return { source: source.name, url: source.url, status: fetched.status, attempts: fetched.attempts, mode: source.mode, items: items.slice(0, isGoogle ? 20 : 30) };
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sources, skippedLegacyYoutube } = await loadSources();
  const direct = sources.filter((source) => !GOOGLE_NEWS_RE.test(source.url));
  const allGoogle = sources.filter((source) => GOOGLE_NEWS_RE.test(source.url));
  const google = rotateGoogleSources(allGoogle);
  const directResults = await mapWithConcurrency(direct, 8, fetchSource);
  const googleResults = await mapWithConcurrency(google, 4, fetchSource);
  const results = [...directResults, ...googleResults];
  const unique = new Map<string, IngestRow>();
  const attributionGroups = new Map<string, string[]>();
  for (const result of results) {
    for (const item of result.items) {
      if (!isTexasRelevant(item, result.source)) continue;
      if (!unique.has(item.link)) {
        unique.set(item.link, { ...item, trend_source: result.source });
        const links = attributionGroups.get(result.source) ?? [];
        links.push(item.link);
        attributionGroups.set(result.source, links);
      }
    }
  }
  const rows = [...unique.values()];
  let inserted = 0;
  if (rows.length > 0) {
    const { count, error } = await supabaseAdmin.from("texas_news_feed").upsert(rows, { onConflict: "link", ignoreDuplicates: true, count: "exact" });
    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
    inserted = count ?? 0;

    // Existing rows may predate attribution. Backfill only a missing trend_source;
    // never overwrite an earlier configured-source attribution.
    await Promise.all([...attributionGroups.entries()].map(async ([trendSource, links]) => {
      const { error: attributionError } = await supabaseAdmin
        .from("texas_news_feed")
        .update({ trend_source: trendSource })
        .in("link", links)
        .is("trend_source", null);
      if (attributionError) console.warn("[ingest-feeds] trend_source backfill failed", trendSource, attributionError.message);
    }));
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
    googleNewsSourcesConfigured: allGoogle.length,
    googleNewsSourcesChecked: google.length,
    skippedLegacyYoutube,
    healthySources: results.filter((result) => result.status >= 200 && result.status < 300 && result.items.length > 0).length,
    failedSources: results.filter((result) => !(result.status >= 200 && result.status < 300) || result.items.length === 0).length,
    diag,
  });
}

export const Route = createFileRoute("/api/public/hooks/ingest-feeds")({
  server: { handlers: { GET: handler, POST: handler } },
});