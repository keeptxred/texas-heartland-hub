import { sourceUrlSupportsPrimaryRecord } from "@/data/source-authority";
import { extractFirstPartyRssArticleBody } from "./newsroom-firstparty-rss-body";
import { isSubstantiveEventPrimary } from "./newsroom-primary-evidence";
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

export function parseIssuerResearchRecords(xml: string, feed: IssuerResearchFeed, subjects: readonly string[], nowMs: number): ResearchPacketSource[] {
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
    if (!title || !link || !Number.isFinite(timestamp) || timestamp > nowMs + 3_600_000 || nowMs - timestamp > 72 * 3_600_000) continue;
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

export async function fetchIssuerResearchRecords(feed: IssuerResearchFeed, subjects: readonly string[]): Promise<ResearchPacketSource[]> {
  if (!ISSUER_RESEARCH_FEEDS.some((known) => known.url === feed.url && known.source === feed.source)) return [];
  try {
    const response = await fetch(feed.url, {
      redirect: "error", signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/rss+xml,application/xml,text/xml", "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.2; +https://keeptxred.com)" },
    });
    if (!response.ok || response.url !== feed.url || !/xml|rss/i.test(response.headers.get("content-type") ?? "")) return [];
    const size = Number(response.headers.get("content-length") || "0");
    if (size > 2_000_000) return [];
    return parseIssuerResearchRecords(await response.text(), feed, subjects, Date.now());
  } catch { return []; }
}
