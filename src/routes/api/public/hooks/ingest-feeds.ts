import { createFileRoute } from "@tanstack/react-router";
import { resolvePublishTimestamp } from "@/lib/article-slug-integrity";
import { isLowValueTitle } from "@/lib/low-value-titles";
import { scoreFeedItem, TEXAS_RELEVANCE_MIN } from "@/lib/viral-score";
import { selectRotatedSourceWindow } from "@/lib/ingest-source-window";
import { parseTexasAgPressReleaseIndex } from "@/lib/texas-ag-press-releases";
import { datedTdemReleasePublishedAt } from "@/lib/texas-tdem-press-release-date";
import { partitionFeedLinkLookups } from "@/lib/ingest-link-lookup";
import { extractFirstPartyRssArticleBody } from "@/lib/newsroom-firstparty-rss-body";
import { canFailoverTrustedRssStatus, trustedNewsroomRssRelayUrl } from "@/lib/official-rss-egress";
import { isGoogleNewsDiscoveryTransport } from "@/lib/ingest-discovery-source";
export { publishSingleFeedItem } from "@/lib/multi-source-publish";
export { isPuzzleTitle } from "@/lib/ingest-feeds-legacy";

type Item = {
  title: string;
  link: string;
  pub_date: string;
  source: string;
  description: string;
  extracted_body?: string;
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
  relayUsed?: boolean;
  error?: string;
};

// Direct and first-party publishers are the backbone. Google News remains a
// rotating supplemental discovery layer below so a Google outage cannot blind
// KeepTXRed to the statewide/local stories readers expect.
const DIRECT_SOURCES: Source[] = [
  { name: "Office of the Governor", url: "https://gov.texas.gov/news/rss", mode: "rss" },
  // First-party dated release permalinks; Google News TDEM items are discovery pointers only.
  { name: "Texas Division of Emergency Management — Direct Releases", url: "https://www.tdem.texas.gov/press-release", category: "Politics", mode: "html-links", include: "^/press-release/[0-9]{1,2}-[0-9]{1,2}-[0-9]{2}/?$" },
  { name: "Texas Secretary of State", url: "https://www.sos.state.tx.us/rss/press.xml", mode: "rss" },
  // The Attorney General legacy RSS returns HTTP 404; use the verified, dated official release index.
  { name: "Texas Attorney General — Direct News Releases", url: "https://www.texasattorneygeneral.gov/news/press_releases", category: "Politics", mode: "html-links", include: "^/news/releases/" },
  { name: "Texas DPS — Direct Most Wanted RSS", url: "https://www.dps.texas.gov/rss/most-wanted.xml", category: "Local", mode: "rss" },
  { name: "Texas Register", url: "https://www.sos.state.tx.us/texreg/texreg.xml", mode: "rss" },
  { name: "Texas Comptroller", url: "https://public.govdelivery.com/topics/TXCOMPT_1/feed.rss", mode: "rss" },
  // Canonical first-party releases are necessary: Google News RSS wrappers
  // have neither a reliable primary URL nor enough text for quality preflight.
  { name: "Texas Comptroller of Public Accounts", url: "https://comptroller.texas.gov/about/media-center/news/", category: "Politics", mode: "html-links", include: "^/about/media-center/news/20\\d{6}-" },
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
  { name: "NewsChannel 10 Amarillo", url: "https://www.newschannel10.com/news/", mode: "html-links", include: "^/20\\d{2}/" },
  { name: "Dallas Cowboys", url: "https://www.dallascowboys.com/rss/news", category: "Sports", mode: "rss" },
  { name: "Houston Texans", url: "https://www.houstontexans.com/rss/news", category: "Sports", mode: "rss" },
  { name: "Dallas Stars", url: "https://www.nhl.com/stars/news/", category: "Sports", mode: "html-links", include: "^/stars/news/" },
  { name: "Texas A&M Aggies", url: "https://12thman.com/news/", category: "Sports", mode: "html-links", include: "^/news/20\\d{2}/" },
  { name: "National Hurricane Center", url: "https://www.nhc.noaa.gov/index-at.xml", category: "Weather", mode: "rss" },
  { name: "Texas Business Long-Tail — Google News", url: "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-texas-business-longtail", category: "Business", mode: "rss" },
  { name: "Texas Campus Long-Tail — Google News", url: "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-texas-campus-longtail", category: "Education", mode: "rss" },
  { name: "Texas Community Long-Tail — Google News", url: "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-texas-community-longtail", category: "Non-Political", mode: "rss" },
  { name: "Texas Sports Long-Tail — Google News", url: "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-texas-sports-longtail", category: "Sports", mode: "rss" },
];

const VERIFIED_YOUTUBE = new Map<string, string>([
  ["ABC13 Houston (YouTube)", "https://www.youtube.com/feeds/videos.xml?channel_id=UCDmNmxF3ZVMeGyvWE9tOqPQ"],
  ["WFAA Dallas (YouTube)", "https://www.youtube.com/feeds/videos.xml?channel_id=UCBu0KdNokE4MqdkacvH37_A"],
]);

const TRANSIENT_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
// Transport classification also recognizes -priority, -north and -sports relays.
const GOOGLE_FEEDS_PER_RUN = 10;
// Bound each scheduled invocation and rotate additional local feeds across
// consecutive half-hour slots, without skipping primary first-party sources.
const SUPPLEMENTAL_DIRECT_FEEDS_PER_RUN = 12;
const DIRECT_CORE_URLS = new Set(
  DIRECT_SOURCES.filter((source) => !isGoogleNewsDiscoveryTransport(source.url))
    .map((source) => source.url.toLowerCase()),
);
// Keep trigger-heavy feed writes below the production statement timeout.
const INGEST_UPSERT_BATCH_SIZE = 20;
// PostgREST encodes full RSS article links inside a GET query. Large .in()
// arrays can return HTTP 400 for a long request target. Bound URL bytes and
// number of links together, using the shared partition helper.
// Per-source deadline, including transient retries, prevents one stalled feed
// from monopolizing an ingestion wave for 3 × 25 seconds.
const SOURCE_FETCH_TOTAL_BUDGET_MS = 30_000;
const ATTRIBUTION_BACKFILL_BATCH_SIZE = 20;
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
    if (isGoogleNewsDiscoveryTransport(link) || /news\.google\.com/i.test(link)) {
      const parts = title.split(" - ");
      if (parts.length > 1) {
        source = parts.pop()!.trim() || fallbackSource;
        title = parts.join(" - ").trim() || title;
      }
    }
    const embeddedArticle = extractFirstPartyRssArticleBody(block, fallbackSource, link);
    items.push({
      title: title.slice(0, 500),
      link,
      pub_date: resolvePublishTimestamp(rawDate || null),
      source,
      description: description.slice(0, 1200),
      // Real article body supplied by this direct publisher. Never treat
      // Google News or other discovery metadata as article evidence.
      ...(embeddedArticle ? { extracted_body: embeddedArticle } : {}),
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

    let publishDate = new Date().toISOString();
    if (source.name === "Texas Division of Emergency Management — Direct Releases") {
      // The index includes historical releases; admit only real dated
      // first-party links within the existing 21-day recency window.
      const dated = datedTdemReleasePublishedAt(parsed.pathname);
      if (!dated) continue;
      publishDate = dated;
    }
    if (source.name === "Texas Comptroller of Public Accounts") {
      // The index lists years of releases; only ingest fresh stories, and use
      // their actual YYYYMMDD permalink date rather than today's crawl date.
      const datedPath = parsed.pathname.match(/^\/about\/media-center\/news\/(20\d{2})(\d{2})(\d{2})-[^/]+\/?$/i);
      if (!datedPath) continue;
      const ymd = `${datedPath[1]}-${datedPath[2]}-${datedPath[3]}`;
      const releaseDate = new Date(`${ymd}T12:00:00Z`);
      if (Number.isNaN(releaseDate.getTime()) || releaseDate.toISOString().slice(0, 10) !== ymd) continue;
      const age = Date.now() - releaseDate.getTime();
      if (age > 21 * 86_400_000 || age < -2 * 86_400_000) continue;
      publishDate = releaseDate.toISOString();
    }

    seen.add(cleanLink);
    out.push({
      title: title.slice(0, 500),
      link: cleanLink,
      pub_date: publishDate,
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
  let attemptsMade = 0;
  const startedAt = Date.now();
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const remainingMs = SOURCE_FETCH_TOTAL_BUDGET_MS - (Date.now() - startedAt);
    if (remainingMs <= 0) break;
    attemptsMade = attempt;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.2; +https://keeptxred.com)",
          Accept: accept,
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(Math.max(1, Math.min(timeoutMs, remainingMs))),
      });
      lastStatus = response.status;
      if (response.ok) return { status: response.status, text: await response.text(), attempts: attempt };
      lastError = `HTTP ${response.status}`;
      if (!TRANSIENT_STATUS.has(response.status)) return { status: response.status, text: null, attempts: attempt, error: lastError };
    } catch (error) {
      lastError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    }
    if (attempt < maxAttempts) {
      const retryDelayMs = 500 * attempt + Math.floor(Math.random() * 250);
      if (Date.now() - startedAt + retryDelayMs >= SOURCE_FETCH_TOTAL_BUDGET_MS) break;
      await sleep(retryDelayMs);
    }
  }
  return { status: lastStatus, text: null, attempts: attemptsMade, error: lastError };
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
  // Normalize the formerly published AG RSS URL to its live first-party index.
  // The exact source is already in DIRECT_SOURCES and is deduplicated by URL.
  if (name === "Texas Attorney General — Direct News Releases") {
    return { name, url: "https://www.texasattorneygeneral.gov/news/press_releases", category: row.category, mode: "html-links", include: "^/news/releases/" };
  }
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

function isRegionalListingNoise(item: Item, configuredSource: string): boolean {
  if (configuredSource !== "Texas Panhandle and South Plains — Regional Discovery") return false;
  if (item.source.trim().toLowerCase() !== "amarillo tribune") return false;
  const normalizedDescription = decode(item.description).replace(/\s+/g, " ").trim().toLowerCase();
  const expectedDescription = `${item.title} Amarillo Tribune`.replace(/\s+/g, " ").trim().toLowerCase();
  if (normalizedDescription !== expectedDescription) return false;
  const wordCount = item.title.trim().split(/\s+/).filter(Boolean).length;
  return item.title.length <= 64 && wordCount >= 2 && wordCount <= 6 && !/[?!:]/.test(item.title);
}

function isTexasRelevant(item: Item, configuredSource: string): boolean {
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
  const isGoogle = isGoogleNewsDiscoveryTransport(source.url);
  const isHtmlLinks = source.mode === "html-links";
  const accept = source.mode === "rss" ? "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*" : "text/html,application/xhtml+xml,*/*";
  const fixedRelayUrl = source.mode === "rss" ? trustedNewsroomRssRelayUrl(source.url) : null;
  // A real first-party URL must remain the article source. The fixed relay
  // changes only the RSS transport when Cloudflare's egress to that host is
  // failing. Bound both attempts together (7s direct + 19s relay), avoid
  // retries/polling, and never fetch a caller-supplied arbitrary destination.
  const direct = await fetchText(
    source.url, accept,
    fixedRelayUrl ? 1 : isGoogle ? 2 : isHtmlLinks ? 1 : 2,
    fixedRelayUrl ? 7000 : isGoogle ? 10000 : isHtmlLinks ? 12000 : 14000,
  );
  const relayed = fixedRelayUrl && !direct.text && canFailoverTrustedRssStatus(direct.status)
    ? await fetchText(fixedRelayUrl, accept, 1, 19000)
    : null;
  const fetched = relayed
    ? { ...relayed, attempts: direct.attempts + relayed.attempts,
        ...(relayed.text ? {} : { error: `direct=${direct.error ?? direct.status}; relay=${relayed.error ?? relayed.status}` }),
      }
    : direct;
  const relayUsed = Boolean(relayed?.text);
  if (!fetched.text && source.name === "Texas Standard" && source.mode === "rss") {
    const fallback = await fetchText("https://texasstandard.org/", "text/html,application/xhtml+xml,*/*", 1, 12000);
    return { source: source.name, url: "https://texasstandard.org/", status: fallback.status, attempts: fetched.attempts + fallback.attempts, mode: "texas-standard-html", items: fallback.text ? parseTexasStandardHtml(fallback.text) : [], error: fallback.text ? undefined : fallback.error };
  }
  if (!fetched.text) return { source: source.name, url: source.url, status: fetched.status, attempts: fetched.attempts, mode: source.mode, items: [], relayUsed, error: fetched.error };
  const items = source.name === "Texas Attorney General — Direct News Releases" && source.mode === "html-links"
    ? parseTexasAgPressReleaseIndex(fetched.text)
    : source.mode === "tpwd-html" ? parseTpwdHtml(fetched.text)
    : source.mode === "html-links" ? parseHtmlLinks(fetched.text, source)
    : parseFeed(fetched.text, source.name);
  return { source: source.name, url: source.url, status: fetched.status, attempts: fetched.attempts, mode: source.mode, items: items.slice(0, 30), relayUsed };
}

async function upsertFeedRowsAdaptive(
  supabaseAdmin: any,
  batch: IngestRow[],
  singletonRetry = 0,
): Promise<{ inserted: number; splits: number; error?: { code?: string; message: string } }> {
  const { count, error } = await supabaseAdmin
    .from("texas_news_feed")
    .upsert(batch, { onConflict: "link", ignoreDuplicates: true, count: "exact" });

  if (!error) return { inserted: count ?? 0, splits: 0 };

  const timedOut =
    error.code === "57014" ||
    /statement timeout|canceling statement due to statement timeout/i.test(error.message ?? "");

  if (!timedOut) {
    return { inserted: 0, splits: 0, error: { code: error.code, message: error.message } };
  }

  if (batch.length > 1) {
    const midpoint = Math.ceil(batch.length / 2);
    const left = await upsertFeedRowsAdaptive(supabaseAdmin, batch.slice(0, midpoint));
    if (left.error) return left;
    const right = await upsertFeedRowsAdaptive(supabaseAdmin, batch.slice(midpoint));
    if (right.error) return { inserted: left.inserted + right.inserted, splits: left.splits + right.splits + 1, error: right.error };
    return {
      inserted: left.inserted + right.inserted,
      splits: left.splits + right.splits + 1,
    };
  }

  if (singletonRetry < 2) {
    await new Promise((resolve) => setTimeout(resolve, 250 * (singletonRetry + 1)));
    return upsertFeedRowsAdaptive(supabaseAdmin, batch, singletonRetry + 1);
  }

  return { inserted: 0, splits: 0, error: { code: error.code, message: error.message } };
}

async function readExistingLinkBatchAdaptive(
  supabaseAdmin: any,
  links: string[],
): Promise<{ rows: Array<{ link: string | null; trend_source: string | null }>; error?: { message: string; code?: string } }> {
  // Single URLs containing commas or parentheses may not parse correctly in
  // PostgREST's `in.(...)` syntax. Prefer equality for the terminal batch.
  const query = supabaseAdmin.from("texas_news_feed").select("link,trend_source");
  const { data, error } = links.length === 1
    ? await query.eq("link", links[0])
    : await query.in("link", links);
  if (!error) return { rows: (data ?? []) as Array<{ link: string | null; trend_source: string | null }> };

  const oversized = /bad request|uri too long|request[- ]?target|414|too large/i.test(error.message ?? "");
  if (oversized && links.length === 1) {
    // The final malformed/oversized lookup must not abort an entire feed wave.
    // New-row upserts use the unique link constraint with ignoreDuplicates,
    // so treating this URL as unknown cannot create a duplicate article.
    console.warn("[ingest-feeds] single-link lookup deferred to conflict-safe upsert", links[0].length);
    return { rows: [] };
  }
  if (oversized && links.length > 1) {
    const half = Math.ceil(links.length / 2);
    const [left, right] = await Promise.all([
      readExistingLinkBatchAdaptive(supabaseAdmin, links.slice(0, half)),
      readExistingLinkBatchAdaptive(supabaseAdmin, links.slice(half)),
    ]);
    if (left.error) return left;
    if (right.error) return right;
    return { rows: [...left.rows, ...right.rows] };
  }
  return { rows: [], error: { message: error.message, code: error.code } };
}

async function backfillTrendSourceAdaptive(
  supabaseAdmin: any,
  trendSource: string,
  links: string[],
  singletonRetry = 0,
): Promise<{ splits: number; retries: number; error?: { code?: string; message: string } }> {
  const { error } = await supabaseAdmin
    .from("texas_news_feed")
    .update({ trend_source: trendSource })
    .in("link", links)
    .is("trend_source", null);

  if (!error) return { splits: 0, retries: singletonRetry };

  const timedOut =
    error.code === "57014" ||
    /statement timeout|canceling statement due to statement timeout/i.test(error.message ?? "");

  if (!timedOut) {
    return { splits: 0, retries: singletonRetry, error: { code: error.code, message: error.message } };
  }

  if (links.length > 1) {
    const midpoint = Math.ceil(links.length / 2);
    const left = await backfillTrendSourceAdaptive(supabaseAdmin, trendSource, links.slice(0, midpoint));
    if (left.error) return left;
    const right = await backfillTrendSourceAdaptive(supabaseAdmin, trendSource, links.slice(midpoint));
    if (right.error) {
      return {
        splits: left.splits + right.splits + 1,
        retries: left.retries + right.retries,
        error: right.error,
      };
    }
    return {
      splits: left.splits + right.splits + 1,
      retries: left.retries + right.retries,
    };
  }

  if (singletonRetry < 2) {
    await new Promise((resolve) => setTimeout(resolve, 250 * (singletonRetry + 1)));
    return backfillTrendSourceAdaptive(supabaseAdmin, trendSource, links, singletonRetry + 1);
  }

  return { splits: 0, retries: singletonRetry, error: { code: error.code, message: error.message } };
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sources, skippedLegacyYoutube } = await loadSources();
  const configuredDirect = sources.filter((source) => !isGoogleNewsDiscoveryTransport(source.url));
  const allGoogle = sources.filter((source) => isGoogleNewsDiscoveryTransport(source.url));
  const google = rotateGoogleSources(allGoogle);
  const directWindow = selectRotatedSourceWindow(
    configuredDirect,
    DIRECT_CORE_URLS,
    SUPPLEMENTAL_DIRECT_FEEDS_PER_RUN,
    Math.floor(Date.now() / (30 * 60 * 1000)),
  );
  const direct = directWindow.selected;
  // Execute independent Google and direct waves concurrently, while limiting
  // direct remote origins to the Worker request's wall-clock budget.
  const [directResults, googleResults] = await Promise.all([
    mapWithConcurrency(direct, 8, fetchSource),
    mapWithConcurrency(google, 4, fetchSource),
  ]);
  const results = [...directResults, ...googleResults];
  const unique = new Map<string, IngestRow>();
  const attributionGroups = new Map<string, string[]>();
  for (const result of results) {
    for (const item of result.items) {
      if (isRegionalListingNoise(item, result.source)) continue;
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
  let attributionBatches = 0;
  let attributionSplits = 0;
  let attributionRetries = 0;
  let attributionFailures = 0;
  let rssBodiesRecovered = 0;
  if (rows.length > 0) {
    const existingLinks = new Set<string>();
    const attributionNeededLinks = new Set<string>();
    const lookupBatches = partitionFeedLinkLookups(rows.map(row => row.link));
    // Parallel bounded lookup groups save worker wall-clock time without
    // overwhelming PostgREST or constructing 100-link GET request targets.
    const lookedUp = await mapWithConcurrency(
      lookupBatches, 4,
      async ({ links }) => readExistingLinkBatchAdaptive(supabaseAdmin, links),
    );
    for (let i = 0; i < lookupBatches.length; i++) {
      const batch = lookupBatches[i];
      const result = lookedUp[i];
      if (result.error) {
        return Response.json(
          {
            ok: false, error: result.error.message, errorCode: result.error.code ?? null,
            failedExistingLinkOffset: batch.offset, batchSize: batch.links.length,
            lookupGroups: lookupBatches.length,
          },
          { status: 500 },
        );
      }
      for (const existingRow of result.rows) {
        if (!existingRow.link) continue;
        existingLinks.add(existingRow.link);
        if (existingRow.trend_source == null) attributionNeededLinks.add(existingRow.link);
      }
    }

    // Backfill up to twelve ALREADY DISCOVERED direct RSS reports with null
    // source bodies. The conditional update is atomic: never replace a
    // possibly richer source-page extraction that completed concurrently.
    // This also unlocks reporting for existing 72-hour candidates without
    // another outbound HTTP fetch or AI text rewrite.
    // Previous behavior issued twelve conditional PATCHes on every half-hour
    // ingestion even for URLs whose original body had already been saved.
    // Probe null bodies with cheap indexed link-only reads before any writes.
    // Rotate the bounded batch to avoid starving later sources behind a fixed
    // first-twelve window; still retain the atomic NULL guard on each PATCH.
    const originalBodyCandidates = rows
      .filter((row) => existingLinks.has(row.link) && Boolean(row.extracted_body));
    const backfillOffset = originalBodyCandidates.length
      ? (Math.floor(Date.now() / (30 * 60 * 1000)) * 12) % originalBodyCandidates.length
      : 0;
    const bodyProbeWindow = [
      ...originalBodyCandidates.slice(backfillOffset),
      ...originalBodyCandidates.slice(0, backfillOffset),
    ].slice(0, 12);
    const missingBodyLinks = new Set<string>();
    // Small groups keep encoded PostgREST URLs below gateway limits.
    for (let start = 0; start < bodyProbeWindow.length; start += 6) {
      const group = bodyProbeWindow.slice(start, start + 6);
      const { data: missing, error: lookupError } = await supabaseAdmin
        .from("texas_news_feed")
        .select("link")
        .in("link", group.map((row) => row.link))
        .is("extracted_body", null);
      if (lookupError) {
        console.warn("[ingest-feeds] RSS bodyless lookup deferred", lookupError.message);
        continue;
      }
      for (const item of missing ?? []) if (item.link) missingBodyLinks.add(item.link);
    }
    const missingOriginalBodies = rows
      .filter((row) => missingBodyLinks.has(row.link))
      .slice(0, 12);
    for (const row of missingOriginalBodies) {
      const { data: updated, error: recoveryError } = await supabaseAdmin
        .from("texas_news_feed")
        .update({ extracted_body: row.extracted_body })
        .eq("link", row.link)
        .is("extracted_body", null)
        .select("id");
      if (recoveryError) {
        console.warn("[ingest-feeds] first-party RSS body backfill deferred", {
          source: row.source, error: recoveryError.message,
        });
      } else {
        rssBodiesRecovered += updated?.length ?? 0;
      }
    }

    const newRows = rows.filter((row) => !existingLinks.has(row.link));
    let adaptiveSplits = 0;
    for (let offset = 0; offset < newRows.length; offset += INGEST_UPSERT_BATCH_SIZE) {
      const batch = newRows.slice(offset, offset + INGEST_UPSERT_BATCH_SIZE);
      const result = await upsertFeedRowsAdaptive(supabaseAdmin, batch);
      if (result.error) {
        return Response.json(
          {
            ok: false,
            error: result.error.message,
            errorCode: result.error.code ?? null,
            failedBatchOffset: offset,
            batchSize: batch.length,
            adaptiveSplits,
          },
          { status: 500 },
        );
      }
      inserted += result.inserted;
      adaptiveSplits += result.splits;
    }
    for (const [trendSource, links] of attributionGroups.entries()) {
      const missingAttributionLinks = links.filter((link) => attributionNeededLinks.has(link));
      for (let offset = 0; offset < missingAttributionLinks.length; offset += ATTRIBUTION_BACKFILL_BATCH_SIZE) {
        const linkBatch = missingAttributionLinks.slice(offset, offset + ATTRIBUTION_BACKFILL_BATCH_SIZE);
        attributionBatches += 1;
        const result = await backfillTrendSourceAdaptive(supabaseAdmin, trendSource, linkBatch);
        attributionSplits += result.splits;
        attributionRetries += result.retries;
        if (result.error) {
          attributionFailures += 1;
          console.warn(
            "[ingest-feeds] trend_source backfill failed",
            trendSource,
            result.error.code,
            result.error.message,
          );
        }
      }
    }
  }
  const diag = results.map(({ items, ...rest }) => ({ ...rest, count: items.length }));
  const successfulResults = results.filter((result) => result.status >= 200 && result.status < 300);
  return Response.json({
    ok: true,
    fetched: rows.length,
    inserted,
    candidates: inserted,
    nativeMinted: 0,
    aiCalls: 0,
    sourceCount: sources.length,
    directSources: direct.length,
    directSourcesConfigured: configuredDirect.length,
    directSourcesChecked: direct.length,
    directSourcesDeferred: directWindow.deferred,
    directSourceWindows: directWindow.windows,
    googleNewsSourcesConfigured: allGoogle.length,
    googleNewsSourcesChecked: google.length,
    trustedDirectRelayRecoveries: results.filter((result) => result.relayUsed).length,
    skippedLegacyYoutube,
    healthySources: successfulResults.filter((result) => result.items.length > 0).length,
    quietSources: successfulResults.filter((result) => result.items.length === 0).length,
    failedSources: results.filter((result) => !(result.status >= 200 && result.status < 300)).length,
    attributionBatches,
    attributionSplits,
    attributionRetries,
    attributionFailures,
    rssBodiesRecovered,
    diag,
  });
}

export const Route = createFileRoute("/api/public/hooks/ingest-feeds")({
  server: { handlers: { GET: handler, POST: handler } },
});