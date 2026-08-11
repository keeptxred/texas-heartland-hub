import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { publishSingleFeedItem } from "./ingest-feeds";

const DISCOVERY_FEEDS = [
  "https://news.google.com/rss/search?q=%28Texas+court+OR+Texas+appeals+court+OR+Texas+lawsuit+OR+Texas+attorney+general+OR+Texas+gun+ban%29+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Texas+police+OR+Texas+sheriff+OR+Texas+game+wardens+OR+Texas+child+endangerment+OR+Texas+fatal+crash%29+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Texas+mosquito+virus+OR+Texas+encephalitis+OR+Texas+public+health+OR+Texas+hospital%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Texas+school+district+OR+Texas+school+scholarship+OR+Texas+campus+flood+OR+Texas+student%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Texas+lake+OR+Texas+reservoir+OR+Texas+state+park+OR+Texas+wildlife+OR+Texas+nature+center%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Texas+scholarship+OR+Texas+LEGO+OR+Texas+wheelchair+OR+Texas+teen+builds+OR+Texas+community+story%29+when%3A5d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Texas+history+OR+Texas+anniversary+OR+%22born+in+Texas%22+OR+Texas+counties+ranking%29+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Texas+store+remodel+OR+Texas+acquisition+OR+Texas+restaurant+OR+Texas+corporate+campus+OR+Texas+redevelopment%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Dallas+Mavericks+OR+Dallas+Cowboys+OR+Texas+Rangers+OR+Houston+Astros+OR+Houston+Texans+OR+San+Antonio+Spurs%29+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Texas+Tech+track+OR+Texas+high+school+sports+OR+Texas+college+athlete+OR+World+Under-20+Texas%29+when%3A3d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Dallas+OR+Fort+Worth+OR+Irving+OR+Plano+OR+Richardson+OR+Lakeside%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen",
  "https://news.google.com/rss/search?q=%28Corpus+Christi+OR+Kingsville+OR+Bastrop+OR+Ingram+OR+Canyon+Lake%29+Texas+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen",
] as const;

const STORY_SPECS = [
  { key: "state-fair-gun-ban", expected: "keeptxred", terms: [/state fair/i, /(gun|handgun|firearm)/i] },
  { key: "fort-worth-alligators-shot", expected: "keeptxred", terms: [/(fort worth|nature center)/i, /alligator/i, /(shot|crossbow|killed)/i] },
  { key: "don-nelson", expected: "keeptxred", terms: [/don nelson/i, /(mavericks|dallas)/i] },
  { key: "ingram-school-flood-repairs", expected: "keeptxred", terms: [/ingram/i, /(school|campus)/i, /(flood|storm|repair)/i] },
  { key: "st-louis-encephalitis", expected: "keeptxred", terms: [/(st\. louis encephalitis|encephalitis)/i, /(corpus christi|kingsville|mosquito)/i] },
  { key: "lakeside-fentanyl-children", expected: "keeptxred", terms: [/fentanyl/i, /(lakeside|children|child endangerment)/i] },
  { key: "dallas-pedestrian-waymo", expected: "keeptxred", terms: [/dallas/i, /(waymo|pedestrian|maple avenue)/i] },
  { key: "bastrop-council-retreat", expected: "keeptxred", terms: [/bastrop/i, /(council|fredericksburg|gerdes)/i] },
  { key: "tate-taylor-sprint-double", expected: "keeptxred", terms: [/tate taylor/i, /(200 meters|sprint|under-20|texas tech)/i] },
  { key: "texas-stadium-mavericks-redevelopment", expected: "keeptxred", terms: [/(texas stadium|irving)/i, /(mavericks|redevelop)/i] },
  { key: "cowboys-quinnen-williams", expected: "keeptxred", terms: [/quinnen williams/i, /cowboys/i] },
  { key: "rangers-jonah-bride", expected: "keeptxred", terms: [/jonah bride/i, /(rangers|round rock|osuna|leiter)/i] },
  { key: "heb-store-upgrades", expected: "keeptxred", terms: [/(h-e-b|heb)/i, /(upgrade|remodel|5\.2 million)/i] },
  { key: "caseys-pak-a-sak", expected: "keeptxred", terms: [/(casey|casey's)/i, /pak-a-sak/i] },
  { key: "sushi-door-dash-dispute", expected: "keeptxred", terms: [/(sushi by the heights|sushi)/i, /(doordash|door dash)/i] },
  { key: "kris6-anchor-layoffs", expected: "keeptxred", terms: [/(kris 6|hofmann)/i, /(layoff|sign off|scripps)/i] },
] as const;

const SENSITIVE_RE = /\b(court|judge|ruling|lawsuit|gun|firearm|fentanyl|child endangerment|killed|death|dies|fatal|crash|virus|encephalitis)\b/i;

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decode(match[1]) : "";
}

function parseGoogleFeed(xml: string) {
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return blocks.slice(0, 40).flatMap((block) => {
    const rawTitle = pick(block, "title");
    const link = pick(block, "link");
    const description = pick(block, "description");
    const rawDate = pick(block, "pubDate");
    if (!rawTitle || !link) return [];
    const parts = rawTitle.split(" - ");
    const source = parts.length > 1 ? parts.pop()!.trim() : "Google News";
    const title = parts.join(" - ").trim() || rawTitle;
    const parsed = Date.parse(rawDate);
    return [{
      title: title.slice(0, 500),
      link,
      description: description.slice(0, 1200),
      source,
      pub_date: new Date(Number.isNaN(parsed) ? Date.now() : parsed).toISOString(),
    }];
  });
}

const matches = (text: string, terms: readonly RegExp[]) => terms.every((term) => term.test(text));

async function handler() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return Response.json({ ok: false, error: "server not configured" }, { status: 500 });
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const fetchedRows = [] as Array<{ title: string; link: string; description: string; source: string; pub_date: string }>;
  const feedErrors: string[] = [];
  await Promise.all(DISCOVERY_FEEDS.map(async (feedUrl) => {
    try {
      const response = await fetch(feedUrl, {
        headers: { "User-Agent": "KeepTXRed-Aug10-Remediation/1.0", Accept: "application/rss+xml,application/xml,text/xml,*/*" },
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      fetchedRows.push(...parseGoogleFeed(await response.text()));
    } catch (error) {
      feedErrors.push(error instanceof Error ? error.message : String(error));
    }
  }));

  const unique = [...new Map(fetchedRows.map((row) => [row.link, row])).values()];
  if (unique.length) {
    const { error } = await supabase.from("texas_news_feed").upsert(unique, { onConflict: "link", ignoreDuplicates: true });
    if (error) return Response.json({ ok: false, error: error.message, feedErrors }, { status: 500 });
  }

  const since = "2026-08-03T00:00:00Z";
  const { data: rows, error: readError } = await supabase
    .from("texas_news_feed")
    .select("id,title,description,internal_slug")
    .gte("pub_date", since)
    .order("pub_date", { ascending: false })
    .limit(5000);
  if (readError) return Response.json({ ok: false, error: readError.message, feedErrors }, { status: 500 });

  const results: Array<Record<string, unknown>> = [];
  for (const spec of STORY_SPECS) {
    const row = (rows ?? []).find((candidate) => matches(`${candidate.title ?? ""} ${candidate.description ?? ""}`, spec.terms));
    if (!row) {
      results.push({ key: spec.key, state: "not_ingested" });
      continue;
    }
    if (row.internal_slug) {
      results.push({ key: spec.key, state: "already_published", id: row.id, slug: row.internal_slug });
      continue;
    }
    if (SENSITIVE_RE.test(`${row.title ?? ""} ${row.description ?? ""}`)) {
      results.push({ key: spec.key, state: "review_required", id: row.id, title: row.title });
      continue;
    }
    try {
      const published = await Promise.race([
        publishSingleFeedItem(row.id),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("publish timeout")), 45_000)),
      ]);
      results.push({ key: spec.key, state: published.ok ? "published" : "publish_failed", id: row.id, ...published });
    } catch (error) {
      results.push({ key: spec.key, state: "publish_failed", id: row.id, error: error instanceof Error ? error.message : String(error) });
    }
  }

  return Response.json({
    ok: true,
    discoveryFetched: unique.length,
    feedErrors,
    results,
  });
}

export const Route = createFileRoute("/api/public/hooks/remediate-aug10-flyover")({
  server: { handlers: { GET: handler, POST: handler } },
});
