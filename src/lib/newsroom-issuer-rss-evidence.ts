import { sourceUrlSupportsPrimaryRecord } from "@/data/source-authority";
import { extractFirstPartyRssArticleBody } from "./newsroom-firstparty-rss-body";
import { isSubstantiveEventPrimary, primaryRecordMatchesEvent } from "./newsroom-primary-evidence";
import type { ResearchPacketSource } from "./newsroom-research-packet";

export type IssuerResearchFeed = {
  source: string;
  url: string;
  subject: RegExp;
};

// Verified publisher-owned feeds, not an unrestricted search/URL fetcher.
// Add an issuer only after verifying its feed, ownership and document paths.
export const ISSUER_RESEARCH_FEEDS: readonly IssuerResearchFeed[] = [
  { source: "NVIDIA Newsroom — Official Corporate Releases", url: "https://nvidianews.nvidia.com/cats/press_release.xml", subject: /\b(?:nvidia|jensen huang)\b/i },
];

export function issuerResearchFeedsForSubjects(subjects: readonly string[]): IssuerResearchFeed[] {
  return ISSUER_RESEARCH_FEEDS.filter((feed) => subjects.some((subject) => feed.subject.test(subject)));
}

function field(xml: string, tag: "title" | "link" | "pubDate"): string {
  return (xml.match(new RegExp("<" + tag + "\\b[^>]*>([\\s\\S]*?)</" + tag + ">", "i"))?.[1] ?? "")
    .replace(/^<!\[CDATA\[|\]\]>$/g, "").replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"').replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/<[^>]+>/g, " ").trim();
}

// The signed research-only archive pass may inspect seven days of issuer releases.
// The normal publication path retains its original 72-hour bound.
export const ISSUER_ARCHIVE_HOURS = 168;
export function issuerRecordNearEvent(publishedAt: string | null, eventAt: string): boolean {
  if (!publishedAt) return false;
  const published = Date.parse(publishedAt);
  const event = Date.parse(eventAt);
  return Number.isFinite(published) && Number.isFinite(event) && Math.abs(published - event) <= 72 * 3_600_000;
}

export function parseIssuerResearchRecords(xml: string, feed: IssuerResearchFeed, subjects: readonly string[], nowMs: number, archiveResearch = false): ResearchPacketSource[] {
  if (!ISSUER_RESEARCH_FEEDS.some((known) => known.url === feed.url && known.source === feed.source)) return [];
  if (!/<rss\b/i.test(xml) || xml.length > 2_000_000) return [];
  const relevant = subjects.filter((subject) => feed.subject.test(subject));
  if (!relevant.length) return [];
  const records: ResearchPacketSource[] = [];
  const seen = new Set<string>();
  const host = new URL(feed.url).hostname;
  for (const match of xml.matchAll(/<item\b[^>]*>[\s\S]*?<\/item>/gi)) {
    const block = match[0];
    const title = field(block, "title");
    const link = field(block, "link");
    const timestamp = Date.parse(field(block, "pubDate"));
    if (!title || !link || !Number.isFinite(timestamp) || timestamp > nowMs + 3_600_000 || nowMs - timestamp > (archiveResearch ? ISSUER_ARCHIVE_HOURS : 72) * 3_600_000) continue;
    if (seen.has(link)) continue;
    try {
      const url = new URL(link);
      if (url.hostname !== host || url.protocol !== "https:" || url.username || url.password || url.port || !sourceUrlSupportsPrimaryRecord(link, feed.source)) continue;
    } catch { continue; }
    const body = extractFirstPartyRssArticleBody(block, feed.source, link);
    if (!body) continue;
    const source: ResearchPacketSource = { feedItemId: 0, title: title.slice(0, 500), source: feed.source, url: link, publishedAt: new Date(timestamp).toISOString(), description: "", extractedBody: body, isPrimarySource: true, sourceReputationScore: 95 };
    if (!relevant.some((subject) => isSubstantiveEventPrimary(source, subject))) continue;
    seen.add(link);
    records.push(source);
    if (records.length >= 4) break;
  }
  return records;
}

// The issuer's own newsroom index is a second representation of its
// releases, not another independent publisher. Follow only exact first-party
// release anchors; never synthesize a URL from the event subject.
const NVIDIA_NEWSROOM = "https://nvidianews.nvidia.com/";
function htmlText(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ").trim();
}
export function issuerReleaseLinks(html: string, subjects: readonly string[]): string[] {
  if (html.length > 2_000_000) return [];
  const links = new Set<string>();
  for (const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    try {
      const url = new URL(match[1].replace(/&amp;/gi, "&"), NVIDIA_NEWSROOM);
      if (url.origin !== new URL(NVIDIA_NEWSROOM).origin || url.username || url.password || !/^\/news\/[^/]+\/?$/.test(url.pathname)) continue;
      const title = htmlText(match[2]);
      // The link label must carry the matching event, not "Read more".
      if (!subjects.some((subject) => primaryRecordMatchesEvent(subject, title, title))) continue;
      url.hash = ""; url.search = "";
      links.add(url.href);
      if (links.size >= 4) break;
    } catch { /* malformed anchor */ }
  }
  return [...links];
}
export function parseIssuerReleasePage(html: string, url: string, feed: IssuerResearchFeed, subjects: readonly string[], nowMs: number, archiveResearch: boolean): ResearchPacketSource | null {
  if (html.length > 2_000_000 || !ISSUER_RESEARCH_FEEDS.some((known) => known.url === feed.url && known.source === feed.source)) return null;
  try {
    const parsed = new URL(url);
    if (parsed.origin !== new URL(NVIDIA_NEWSROOM).origin || parsed.username || parsed.password || !/^\/news\/[^/]+\/?$/.test(parsed.pathname)) return null;
  } catch { return null; }
  const clean = html.replace(/<(script|style|nav|footer|aside|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const heading = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(clean);
  if (!heading || heading.index === undefined) return null;
  const title = htmlText(heading[1]);
  const after = clean.slice(heading.index + heading[0].length);
  // NVIDIA publishes the calendar date immediately after the release heading.
  // Prefer structured publication time where present; never infer from fetch time.
  const dateText = html.match(/"datePublished"\s*:\s*"([^"]+)"/i)?.[1]
    ?? htmlText(after.slice(0, 1800)).match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/i)?.[0];
  const stamp = Date.parse(dateText ?? "");
  if (!Number.isFinite(stamp) || stamp > nowMs + 3_600_000 || nowMs - stamp > (archiveResearch ? ISSUER_ARCHIVE_HOURS : 72) * 3_600_000) return null;
  // Do not include media contacts, downloads or related headlines in evidence.
  const boundary = /<(?:h[2-6])\b[^>]*>\s*(?:<[^>]+>\s*)*(?:Media Contacts|Downloads|More News)\b/i.exec(after);
  if (!boundary || boundary.index === undefined) return null;
  const paragraphs = [...after.slice(0, boundary.index).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => htmlText(m[1])).filter(Boolean);
  const body = paragraphs.join("\n");
  if (body.length < 500 || body.split(/\s+/).length < 85) return null;
  const source: ResearchPacketSource = { feedItemId: 0, title: title.slice(0, 500), source: feed.source, url, publishedAt: new Date(stamp).toISOString(), description: "", extractedBody: body.slice(0, 8000), isPrimarySource: true, sourceReputationScore: 95 };
  return subjects.some((subject) => feed.subject.test(subject) && isSubstantiveEventPrimary(source, subject)) ? source : null;
}

export type IssuerResearchResult = { records: ResearchPacketSource[]; fetched: number; diagnostics: string[] };
export async function fetchIssuerResearchRecords(feed: IssuerResearchFeed, subjects: readonly string[], archiveResearch = false): Promise<IssuerResearchResult> {
  const result: IssuerResearchResult = { records: [], fetched: 0, diagnostics: [] };
  if (!ISSUER_RESEARCH_FEEDS.some((known) => known.url === feed.url && known.source === feed.source)) return result;
  async function read(url: string, accept: string, type: RegExp): Promise<string | null> {
    result.fetched++;
    try {
      const response = await fetch(url, {
        redirect: "error", signal: AbortSignal.timeout(8_000),
        headers: { Accept: accept, "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.2; +https://keeptxred.com)" },
      });
      result.diagnostics.push(new URL(url).pathname + " HTTP " + response.status);
      if (!response.ok || response.url !== url || !type.test(response.headers.get("content-type") ?? "")) return null;
      if (Number(response.headers.get("content-length") || "0") > 2_000_000) return null;
      const text = await response.text();
      return text.length <= 2_000_000 ? text : null;
    } catch (error) {
      result.diagnostics.push(new URL(url).pathname + " " + (error instanceof Error ? error.name : "fetch_error"));
      return null;
    }
  }
  const xml = await read(feed.url, "application/rss+xml,application/xml,text/xml", /xml|rss/i);
  if (xml) result.records = parseIssuerResearchRecords(xml, feed, subjects, Date.now(), archiveResearch);
  result.diagnostics.push("rss_records=" + result.records.length);
  // At most two additional GETs, only when the existing signed archive pass
  // recovered nothing from RSS. Preserve the normal publication path.
  if (!archiveResearch || result.records.length || feed.url !== ISSUER_RESEARCH_FEEDS[0]?.url) return result;
  const index = await read(NVIDIA_NEWSROOM, "text/html,application/xhtml+xml", /^(?:text\/html|application\/xhtml\+xml)\b/i);
  if (!index) return result;
  const links = issuerReleaseLinks(index, subjects);
  result.diagnostics.push("matched_release_links=" + links.length);
  if (!links.length) return result;
  const html = await read(links[0], "text/html,application/xhtml+xml", /^(?:text\/html|application\/xhtml\+xml)\b/i);
  const record = html && parseIssuerReleasePage(html, links[0], feed, subjects, Date.now(), archiveResearch);
  if (record) result.records.push(record);
  result.diagnostics.push("release_records=" + result.records.length);
  return result;
}
