import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const RSS_SOURCES: { name: string; url: string; category: string }[] = [
  { name: "Texas Scorecard", url: "https://texasscorecard.com/feed/", category: "Legislature" },
  { name: "The Texan", url: "https://thetexan.news/feed/", category: "Legislature" },
  { name: "Dallas Express", url: "https://dallasexpress.com/feed/", category: "Elections" },
  { name: "The Center Square — Texas", url: "https://www.thecentersquare.com/texas/?f=rss", category: "Tax & Spending" },
  { name: "Texas Public Policy Foundation", url: "https://www.texaspolicy.com/feed/", category: "Tax & Spending" },
  { name: "Houston Chronicle — Politics", url: "https://www.houstonchronicle.com/rss/feed/politics-9764.php", category: "Legislature" },
  { name: "Houston Public Media — News", url: "https://www.houstonpublicmedia.org/feed/?post_type=articles", category: "Legislature" },
  { name: "KHOU 11 — Local", url: "https://www.khou.com/feeds/syndication/rss/news/local", category: "Legislature" },
];

const CATEGORIES = ["Legislature", "Border", "Elections", "Tax & Spending", "Energy", "Education"] as const;

type RssItem = {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
  source: string;
  sourceCategory: string;
};

function stripHtml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  return m ? stripHtml(m[1]) : "";
}

function parseRss(xml: string, source: string, sourceCategory: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRe = /<item[\s\S]*?<\/item>/gi;
  const matches = xml.match(itemRe) ?? [];
  for (const block of matches.slice(0, 6)) {
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const description = extractTag(block, "description");
    const pubDate = extractTag(block, "pubDate");
    if (title && link) items.push({ title, link, description, pubDate, source, sourceCategory });
  }
  return items;
}

// ── Breaking News Priority Engine ─────────────────────────────────────────
// Scores a raw RSS item before it's ever sent to the rewriter. Items below
// the publish threshold are discarded; items above the breaking threshold
// get the BREAKING badge on the homepage.
const TEXAS_KEYWORDS = ["texas", "lone star", "ercot", "txdot", "rgv", "permian"];
const METRO_KEYWORDS = ["houston", "harris county", "katy", "sugar land", "cypress", "the woodlands"];
const POLITICS_KEYWORDS = ["legislature", "governor", "abbott", "paxton", "patrick", "senate", "house bill", "sb ", "hb ", "capitol", "election", "vote", "ballot", "campaign"];
const BREAKING_KEYWORDS = ["breaking", "shooting", "killed", "arrested", "explosion", "tornado", "hurricane", "flood", "emergency", "evacuation", "manhunt", "amber alert", "indicted", "resign"];
const ENGAGEMENT_KEYWORDS = ["exclusive", "revealed", "what we know", "first on", "investigation", "leaked", "exposes", "warns"];

function scoreItem(item: RssItem, titleRepetition: number): number {
  const haystack = `${item.title} ${item.description}`.toLowerCase();
  let score = 0;
  if (TEXAS_KEYWORDS.some((k) => haystack.includes(k))) score += 10;
  if (METRO_KEYWORDS.some((k) => haystack.includes(k))) score += 10;
  if (POLITICS_KEYWORDS.some((k) => haystack.includes(k))) score += 8;
  if (BREAKING_KEYWORDS.some((k) => haystack.includes(k))) score += 8;
  if (ENGAGEMENT_KEYWORDS.some((k) => haystack.includes(k))) score += 6;
  if (titleRepetition >= 2) score += 5; // trending across multiple sources
  return score;
}

function titleFingerprint(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 6)
    .sort()
    .join(" ");
}

type ScoredItem = RssItem & { score: number; isBreaking: boolean };

function scoreAndFilter(items: RssItem[]): ScoredItem[] {
  // Count rough title overlap across sources for trending boost.
  const fingerprints = new Map<string, number>();
  for (const it of items) {
    const fp = titleFingerprint(it.title);
    fingerprints.set(fp, (fingerprints.get(fp) ?? 0) + 1);
  }
  return items
    .map((it) => {
      const reps = fingerprints.get(titleFingerprint(it.title)) ?? 1;
      const score = scoreItem(it, reps);
      return { ...it, score, isBreaking: score >= 18 };
    })
    .filter((it) => it.score >= 12)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function fetchWithTimeout(url: string, ms = 10000): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "KeepTXRed/1.0 (+https://keeptxred.com)" },
    });
    clearTimeout(t);
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null;
  }
}

async function rewriteWithAi(items: RssItem[], lovableApiKey: string) {
  const list = items
    .map((it, i) => `${i + 1}. [${it.source} — ${it.sourceCategory}] ${it.title}\n   ${it.description.slice(0, 400)}\n   URL: ${it.link}`)
    .join("\n\n");

  const system = `You are the senior editor of Keep TX Red, a Texas conservative news site. Rewrite headlines and lede paragraphs in a sharp, principled, Reagan-conservative editorial voice: pro-Second Amendment, pro-border-security, pro-life, pro-energy, pro-property-rights, skeptical of federal overreach. Avoid slurs, avoid conspiracy framing, stay factual, never invent quotes or statistics.

SEO REQUIREMENTS for every headline and dek:
- Headline must be keyword-rich and under 110 characters. Lead with the concrete subject (a bill number, an agency, a city, a policy).
- Headline MUST include at least one Texas-specific keyword: "Texas", a Texas city (Houston, Dallas, Austin, San Antonio, Fort Worth, El Paso), a Texas region (Permian Basin, Rio Grande Valley, Hill Country), or a Texas institution (ERCOT, TxDOT, the Legislature, the AG, the Governor).
- The "dek" is the meta description — make it compelling, 140-240 characters, summarize the actual reported facts, and naturally include 1-2 additional Texas-specific keywords.
- Never use clickbait, never use the word "shocking", never end the headline in a question mark unless the source did.

Pick the best ${Math.min(10, items.length)} stories from the list. Return ONLY valid JSON in this exact shape — no markdown, no commentary:
{"articles":[{"source_index":1,"category":"Legislature","title":"...","dek":"..."}]}

Valid categories: ${CATEGORIES.join(", ")}.`;

  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": lovableApiKey,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Source stories:\n\n${list}` },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!r.ok) {
    const body = await r.text();
    throw new Error(`AI gateway ${r.status}: ${body.slice(0, 300)}`);
  }

  const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content) as {
    articles?: { source_index: number; category: string; title: string; dek: string }[];
  };
  return parsed.articles ?? [];
}

export const Route = createFileRoute("/api/public/hooks/generate-news")({
  server: {
    handlers: {
      POST: async () => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const lovableApiKey = process.env.LOVABLE_API_KEY;

        if (!supabaseUrl || !serviceKey || !lovableApiKey) {
          return Response.json({ error: "Missing required environment variables" }, { status: 500 });
        }

        // 1. Pull every RSS feed in parallel.
        const feeds = await Promise.all(
          RSS_SOURCES.map(async (s) => {
            const xml = await fetchWithTimeout(s.url);
            return xml ? parseRss(xml, s.name, s.category) : [];
          }),
        );
        const items = feeds.flat();
        if (items.length === 0) {
          return Response.json({ error: "No RSS items fetched" }, { status: 502 });
        }

        // 2. Ask Lovable AI to rewrite the best stories in editorial voice.
        let rewritten: { source_index: number; category: string; title: string; dek: string }[];
        try {
          rewritten = await rewriteWithAi(items, lovableApiKey);
        } catch (err) {
          console.error("AI rewrite failed", err);
          return Response.json({ error: "AI rewrite failed", details: String(err) }, { status: 500 });
        }

        // 3. Insert rewritten articles into the database.
        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const now = new Date();
        const datePrefix = now.toISOString().slice(0, 10);
        const rows = rewritten
          .filter((a) => a.title && a.dek && a.source_index >= 1 && a.source_index <= items.length)
          .map((a) => {
            const src = items[a.source_index - 1];
            const category = (CATEGORIES as readonly string[]).includes(a.category) ? a.category : src.sourceCategory;
            return {
              slug: `${datePrefix}-${slugify(a.title)}`,
              category,
              title: a.title.slice(0, 200),
              dek: a.dek.slice(0, 400),
              source_name: src.source,
              source_url: src.link,
              published_at: now.toISOString(),
            };
          });

        if (rows.length === 0) {
          return Response.json({ error: "No valid rewritten articles" }, { status: 500 });
        }

        const { error: insertError, count } = await supabase
          .from("daily_articles")
          .upsert(rows, { onConflict: "slug", count: "exact" });

        if (insertError) {
          console.error("Insert failed", insertError);
          return Response.json({ error: insertError.message }, { status: 500 });
        }

        // 4. Prune anything older than 30 days so the table stays lean.
        const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        await supabase.from("daily_articles").delete().lt("published_at", cutoff);

        return Response.json({ ok: true, inserted: count ?? rows.length, fetched: items.length });
      },
    },
  },
});