import { isSyntheticNewsroomEvidence } from "./newsroom-evidence-integrity";

const RSS_EVIDENCE_FEEDS = [
  "https://gov.texas.gov/news/rss",
  "https://www.sos.state.tx.us/rss/press.xml",
  "https://www.sos.state.tx.us/texreg/texreg.xml",
  "https://public.govdelivery.com/topics/TXCOMPT_1/feed.rss",
  "https://feeds.feedburner.com/uil-press-releases",
  "https://www.texasmonthly.com/feed/",
  "https://www.texasstandard.org/feed/",
  "https://feeds.texastribune.org/feeds/main/",
  "https://www.houstonpublicmedia.org/feed/",
  "https://www.ksat.com/arc/outboundfeeds/rss/category/news/local/?outputType=xml&size=25",
  "https://www.ksat.com/arc/outboundfeeds/rss/tags_slug/spurs/?outputType=xml&size=25",
  "https://www.dallascowboys.com/rss/news",
  "https://www.houstontexans.com/rss/news",
] as const;

const MIN_USEFUL_BODY_CHARS = 400;
const MAX_BODY_CHARS = 30_000;
const FETCH_TIMEOUT_MS = 12_000;

type ExistingFeedRow = { id: number; link: string | null; extracted_body: string | null };

type EvidenceRefreshResult = {
  feedsChecked: number;
  feedsSucceeded: number;
  evidenceItems: number;
  matchedRows: number;
  updatedRows: number;
  repairedSyntheticRows: number;
  evidenceCharsWritten: number;
  failures: Array<{ url: string; error: string }>;
  aiCalls: 0;
};

function decodeXmlHtml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(parseInt(decimal, 10)))
    .replace(/&nbsp;|&#160;/gi, " ")
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
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = block.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return match ? decodeXmlHtml(match[1]) : "";
}

function itemLink(block: string): string {
  const textLink = pick(block, "link");
  if (textLink) return textLink;
  const href = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  return href?.[1]?.trim() ?? "";
}

export function extractRssEvidence(xml: string): Map<string, string> {
  const evidence = new Map<string, string>();
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) ?? [];
  for (const block of blocks.slice(0, 60)) {
    const link = itemLink(block);
    if (!/^https?:\/\//i.test(link)) continue;
    const body = (
      pick(block, "content:encoded") ||
      pick(block, "content") ||
      pick(block, "description") ||
      pick(block, "summary")
    ).slice(0, MAX_BODY_CHARS);
    if (body.length < MIN_USEFUL_BODY_CHARS || isSyntheticNewsroomEvidence(body)) continue;
    const previous = evidence.get(link) ?? "";
    if (body.length > previous.length) evidence.set(link, body);
  }
  return evidence;
}

export function shouldReplaceExistingEvidence(existing: string | null | undefined, cleanBody: string): boolean {
  if (cleanBody.length < MIN_USEFUL_BODY_CHARS || isSyntheticNewsroomEvidence(cleanBody)) return false;
  const current = existing ?? "";
  if (isSyntheticNewsroomEvidence(current)) return true;
  return cleanBody.length > current.length + 100;
}

async function fetchFeed(url: string): Promise<{ url: string; evidence: Map<string, string>; error?: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.2; +https://keeptxred.com)",
        Accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) return { url, evidence: new Map(), error: `HTTP ${response.status}` };
    return { url, evidence: extractRssEvidence(await response.text()) };
  } catch (error) {
    return { url, evidence: new Map(), error: error instanceof Error ? `${error.name}: ${error.message}` : String(error) };
  }
}

async function mapWithConcurrency<T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const output: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, Math.max(items.length, 1)) }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      output[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return output;
}

export async function refreshNewsroomRssEvidence(): Promise<EvidenceRefreshResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Feed evidence columns intentionally lead the generated Database type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;
  const fetched = await mapWithConcurrency(RSS_EVIDENCE_FEEDS, 4, fetchFeed);
  const failures = fetched.filter((item) => item.error).map((item) => ({ url: item.url, error: item.error! }));
  const evidenceByLink = new Map<string, string>();
  for (const result of fetched) {
    for (const [link, body] of result.evidence) {
      const current = evidenceByLink.get(link) ?? "";
      if (body.length > current.length) evidenceByLink.set(link, body);
    }
  }

  const links = [...evidenceByLink.keys()];
  let matchedRows = 0;
  let updatedRows = 0;
  let repairedSyntheticRows = 0;
  let evidenceCharsWritten = 0;
  for (let start = 0; start < links.length; start += 100) {
    const chunk = links.slice(start, start + 100);
    const { data, error } = await db.from("texas_news_feed").select("id,link,extracted_body").in("link", chunk);
    if (error) throw new Error(`rss evidence feed lookup failed: ${error.message}`);
    const rows = (data ?? []) as ExistingFeedRow[];
    matchedRows += rows.length;
    for (const row of rows) {
      if (!row.link) continue;
      const body = evidenceByLink.get(row.link) ?? "";
      const existing = row.extracted_body ?? "";
      if (!shouldReplaceExistingEvidence(existing, body)) continue;
      const wasSynthetic = isSyntheticNewsroomEvidence(existing);
      const { error: updateError } = await db.from("texas_news_feed").update({ extracted_body: body }).eq("id", row.id);
      if (updateError) throw new Error(`rss evidence update failed for feed ${row.id}: ${updateError.message}`);
      updatedRows++;
      if (wasSynthetic) repairedSyntheticRows++;
      evidenceCharsWritten += body.length;
    }
  }

  return {
    feedsChecked: RSS_EVIDENCE_FEEDS.length,
    feedsSucceeded: fetched.length - failures.length,
    evidenceItems: evidenceByLink.size,
    matchedRows,
    updatedRows,
    repairedSyntheticRows,
    evidenceCharsWritten,
    failures,
    aiCalls: 0,
  };
}
