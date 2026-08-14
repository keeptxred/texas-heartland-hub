import { createFileRoute } from "@tanstack/react-router";
import { SPORTS_SOURCES, type SportsSource } from "@/lib/sports-sources";
import { classifySportsText } from "@/lib/sports-taxonomy";

const TRANSIENT = new Set([408, 425, 429, 500, 502, 503, 504]);

type FeedRow = { title: string; link: string; pub_date: string; source: string; description: string };
type SourceResult = { source: string; status: number; items: FeedRow[]; error?: string };

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function pick(block: string, tag: string): string {
  return decode(block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] ?? "");
}

function safeIso(value?: string): string {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function parseRss(xml: string, source: SportsSource): FeedRow[] {
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) ?? [];
  const out: FeedRow[] = [];
  for (const block of blocks.slice(0, 40)) {
    const title = pick(block, "title");
    let link = pick(block, "link");
    if (!link) link = block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] ?? "";
    const date = pick(block, "pubDate") || pick(block, "updated") || pick(block, "published");
    const description = pick(block, "description") || pick(block, "summary") || pick(block, "content") || title;
    if (!title || !/^https?:\/\//i.test(link)) continue;
    const classification = classifySportsText(`${title} ${description} ${source.name}`);
    if (!source.team && !source.topic && !classification.isSports) continue;
    out.push({ title: title.slice(0, 500), link, pub_date: safeIso(date), source: source.name, description: description.slice(0, 1200) });
  }
  return out;
}

function absoluteUrl(href: string, base: string): string {
  try { return new URL(href, base).toString(); } catch { return ""; }
}

function parseHtml(html: string, source: SportsSource): FeedRow[] {
  const base = new URL(source.url);
  const include = source.include ? new RegExp(source.include, "i") : null;
  const seen = new Set<string>();
  const out: FeedRow[] = [];
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(re)) {
    const title = decode(match[2]);
    const link = absoluteUrl(match[1], source.url);
    if (!title || title.length < 18 || title.length > 240 || !link) continue;
    let parsed: URL;
    try { parsed = new URL(link); } catch { continue; }
    if (parsed.hostname !== base.hostname && !parsed.hostname.endsWith(`.${base.hostname}`)) continue;
    if (include && !include.test(parsed.pathname)) continue;
    const canonical = `${parsed.origin}${parsed.pathname}${parsed.search}`;
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    const description = `${source.name}: ${title}`;
    out.push({ title: title.slice(0, 500), link: canonical, pub_date: new Date().toISOString(), source: source.name, description: description.slice(0, 1200) });
    if (out.length >= 20) break;
  }
  return out;
}

async function fetchText(url: string, accept: string, attempts = 2): Promise<{ status: number; text?: string; error?: string }> {
  let lastStatus = 0;
  let lastError = "request failed";
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "KeepTXRedSportsBot/1.0 (+https://keeptxred.com)", Accept: accept }, redirect: "follow", signal: AbortSignal.timeout(15000) });
      lastStatus = response.status;
      if (response.ok) return { status: response.status, text: await response.text() };
      lastError = `HTTP ${response.status}`;
      if (!TRANSIENT.has(response.status)) break;
    } catch (error) { lastError = error instanceof Error ? error.message : String(error); }
  }
  return { status: lastStatus, error: lastError };
}

async function fetchSource(source: SportsSource): Promise<SourceResult> {
  const accept = source.mode === "rss" ? "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*" : "text/html,application/xhtml+xml,*/*";
  const fetched = await fetchText(source.url, accept);
  if (!fetched.text) return { source: source.name, status: fetched.status, items: [], error: fetched.error };
  const items = source.mode === "rss" ? parseRss(fetched.text, source) : parseHtml(fetched.text, source);
  return { source: source.name, status: fetched.status, items };
}

async function mapWithConcurrency<T, R>(values: readonly T[], concurrency: number, fn: (value: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(values.length);
  let cursor = 0;
  async function worker() { while (cursor < values.length) { const index = cursor++; results[index] = await fn(values[index]); } }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
  return results;
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const results = await mapWithConcurrency(SPORTS_SOURCES, 6, fetchSource);
  const unique = new Map<string, FeedRow>();
  for (const result of results) for (const row of result.items) if (!unique.has(row.link)) unique.set(row.link, row);
  const rows = [...unique.values()];
  let inserted = 0;
  if (rows.length) {
    const { count, error } = await supabaseAdmin.from("texas_news_feed").upsert(rows, { onConflict: "link", ignoreDuplicates: true, count: "exact" });
    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
    inserted = count ?? 0;
  }
  return Response.json({ ok: true, sourceCount: SPORTS_SOURCES.length, fetched: rows.length, inserted, healthySources: results.filter((result) => result.status >= 200 && result.status < 300 && result.items.length).length, failedSources: results.filter((result) => result.status < 200 || result.status >= 300 || !result.items.length).map((result) => ({ source: result.source, status: result.status, error: result.error })) });
}

export const Route = createFileRoute("/api/public/hooks/ingest-sports")({ server: { handlers: { GET: handler, POST: handler } } });
