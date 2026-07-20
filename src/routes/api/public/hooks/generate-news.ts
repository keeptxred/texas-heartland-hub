import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { enrichArticleRow } from "@/lib/content-quality";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { isPuzzleTitle } from "./ingest-feeds";
import { meetsArticleMainWordCount, NON_EVERGREEN_MIN_MAIN_WORDS } from "@/lib/article-length";

type NewsSection = { heading: string; paragraphs: string[] };

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function articleBodyText(body: {
  intro: string[];
  sections: { heading?: string; paragraphs?: string[]; bullets?: string[] }[];
  faq?: { q?: string; a?: string }[];
  keyTakeaways?: string[];
}): string {
  const parts: string[] = [];
  (body.intro ?? []).forEach((p) => parts.push(p));
  (body.sections ?? []).forEach((s) => {
    if (s.heading) parts.push(s.heading);
    (s.paragraphs ?? []).forEach((p) => parts.push(p));
    (s.bullets ?? []).forEach((p) => parts.push(p));
  });
  (body.faq ?? []).forEach((f) => {
    if (f.q) parts.push(f.q);
    if (f.a) parts.push(f.a);
  });
  (body.keyTakeaways ?? []).forEach((p) => parts.push(p));
  return parts.join(" ");
}

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

const CATEGORIES = [
  "Legislature",
  "Border",
  "Elections",
  "Tax & Spending",
  "Energy",
  "Education",
  "Non-Political",
] as const;

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

// Hard disqualifiers — content shapes that must NEVER be tagged breaking,
// regardless of raw keyword score. Covers Reddit-style help posts, personal
// experiences, listicles, travel/restaurant guides, opinion threads, and
// evergreen explainers. Genuine news (politics, public safety, weather
// emergencies, court rulings, elections, major business/sports) is unaffected.
const NON_BREAKING_TITLE_PATTERNS: RegExp[] = [
  /^\s*(looking for|anyone (?:know|have|tried)|recommend|recommendations?|suggestions?|advice|help|where (?:can|do|to)|how (?:do|to|can)|what(?:'s| is) the best|best way to|has anyone|is there|question:|discussion:|thoughts on)\b/i,
  /\b(my|our) (?:experience|story|take|journey|trip)\b/i,
  /\b(top|best|worst)\s+\d+\b/i,
  /\b\d+\s+(?:things|ways|reasons|tips|places|foods|restaurants|hikes|spots|facts|signs)\b/i,
  /\b(travel guide|city guide|restaurant (?:review|guide)|food review|things to do|day trip|road trip|weekend (?:in|getaway)|hidden gems|bucket list)\b/i,
  /\b(opinion|op-ed|editorial|commentary|column|hot take|unpopular opinion|change my mind)\b/i,
  /\b(quiz|horoscope|crossword|sudoku|puzzle|recipe|meal plan|workout|playlist)\b/i,
  /\b(everything you need to know|complete guide|ultimate guide|explained|explainer|primer|faq)\b/i,
  /\b(house call|mobile (?:vet|veterinar)|pet sitter|babysitter|handyman|plumber|electrician|contractor|realtor)\b/i,
];

// Sources that are structurally discussion/personal-experience venues.
// Anything from these is disqualified from breaking even if the neutralized
// headline picks up an incidental keyword.
const NON_BREAKING_SOURCE_PATTERNS: RegExp[] = [
  /^r\//i,           // any subreddit
  /reddit/i,
  /medium/i,
  /substack/i,
  /blog/i,
  /opinion/i,
  /lifestyle/i,
  /travel/i,
  /food(?:ie)?/i,
  /eater/i,
  /culture/i,
];

// Positive signal required for a breaking classification: a real news verb
// or a hard-news noun tied to Texas government / public safety / markets.
// Without at least one of these, we don't upgrade to breaking even if the
// score crosses the threshold via generic Texas/metro weight alone.
const HARD_NEWS_SIGNAL =
  /\b(breaking|shooting|killed|arrested|explosion|tornado|hurricane|flood|emergency|evacuation|manhunt|amber alert|indicted|resign|signs|declares|announces|ruling|verdict|convicted|charged|sues|lawsuit|veto|vetoes|appoints|passes|approves|filed|election|ballot|primary|runoff|governor|legislature|senate bill|house bill|\bsb\s?\d|\bhb\s?\d|paxton|abbott|patrick|cornyn|cruz|border|ercot|grid|recall|impeach|storm|wildfire|evacuat|acquires|merger|ipo|championship|traded|signs deal|hired|fired)\b/i;

function isDisqualifiedFromBreaking(item: RssItem): boolean {
  const title = item.title ?? "";
  const src = item.source ?? "";
  if (NON_BREAKING_TITLE_PATTERNS.some((re) => re.test(title))) return true;
  if (NON_BREAKING_SOURCE_PATTERNS.some((re) => re.test(src))) return true;
  return false;
}

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
      const haystack = `${it.title} ${it.description}`;
      const hasHardNews = HARD_NEWS_SIGNAL.test(haystack);
      const disqualified = isDisqualifiedFromBreaking(it);
      const isBreaking = score >= 18 && hasHardNews && !disqualified;
      return { ...it, score, isBreaking };
    })
    .filter((it) => it.score >= 12 && !isPuzzleTitle(it.title))
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

async function rewriteWithAi(items: ScoredItem[], lovableApiKey: string) {
  const list = items
    .map((it, i) => `${i + 1}. [score=${it.score}${it.isBreaking ? " BREAKING" : ""}] [${it.source} — ${it.sourceCategory}] ${it.title}\n   ${it.description.slice(0, 400)}\n   URL: ${it.link}`)
    .join("\n\n");

  const system = `You are the senior editor of Keep TX Red, a Texas news site optimized for Google Discover and high click-through rates. Stay factually neutral in headlines; reserve principled conservative framing for analysis. Never invent quotes or statistics.

GOOGLE DISCOVER HEADLINE FORMULAS — pick the best fit per story:
  • "BREAKING: <event> impacts Texas residents"
  • "Texas officials respond to <event> affecting <city>"
  • "What we know about <event> in Texas today"
  • "<topic> sparks reaction across Texas"

HEADLINE RULES:
- Under 110 characters, no clickbait, no "shocking", no all-caps shouting beyond the optional "BREAKING:" prefix.
- MUST mention Texas or a major Texas city (Houston, Dallas, Austin, San Antonio, Fort Worth, El Paso).
- Use the "BREAKING:" prefix ONLY when the input is flagged BREAKING.

DEK (first paragraph + meta description) RULES:
- 2 sentences max, hooks the reader, 140–240 characters.
- Sentence 1 names Texas + a specific city.
- Sentence 2 gives the most newsworthy fact.

BODY RULES (required for every picked story):
- Every non-evergreen article MUST be at least ${NON_EVERGREEN_MIN_MAIN_WORDS} words of MAIN STORY PROSE across summary + sections only. Do NOT count Texas relevance, source attribution, FAQ, key takeaways, title, dek, or source lists toward the minimum. There is no upper word limit. Expand until the main story prose meets the minimum.
- "summary": a substantial neutral opening section, grounded in concrete facts drawn from the source blurb. No invented quotes or stats.
- "relevance": a substantial Texas relevance section explaining the specific Texas stake (which city/region/agency/law is affected and why it matters to Texans).
- "sections": 5–8 additional H2-style sections, each with 2–4 substantial paragraphs covering background, timeline, stakeholders, local implications, what changes next, and practical reader context.
- "keyTakeaways": 3–5 short bullet strings.
- "faq": 4–6 Q&A entries answering likely reader questions with substantive answers.

Pick the best ${Math.min(10, items.length)} stories. Return ONLY valid JSON:
{"articles":[{"source_index":1,"category":"Legislature","title":"...","dek":"...","summary":"...","relevance":"...","sections":[{"heading":"...","paragraphs":["..."]}],"keyTakeaways":["..."],"faq":[{"q":"...","a":"..."}]}]}

Valid categories: ${CATEGORIES.join(", ")}.

CATEGORY CLASSIFICATION RULES (strict):
- Classify as "Non-Political" when the story is NOT primarily about: elections or campaigns, political parties, government or legislation, public policy, court rulings tied to politics, border policy, or political opinion. Examples: human-interest, animal stories, viral stories, community news, Texas culture, festivals/events, weather, travel, lifestyle, entertainment, sports, science, space, health (unless primarily political), and consumer news.
- Do NOT use "Education" as a fallback. Only assign "Education" when the primary subject is K–12 schools, colleges or universities, school boards, teachers, students, curriculum, education funding, or academic policy.
- When in doubt between "Education" and "Non-Political" for a human-interest story (e.g. a zoo animal, a festival, a community profile), pick "Non-Political".`;

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
      max_tokens: 9000,
    }),
  });

  if (!r.ok) {
    const body = await r.text();
    throw new Error(`AI gateway ${r.status}: ${body.slice(0, 300)}`);
  }

  const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content) as {
    articles?: {
      source_index: number;
      category: string;
      title: string;
      dek: string;
      summary?: string;
      relevance?: string;
      keyTakeaways?: string[];
      faq?: { q: string; a: string }[];
    }[];
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
        const rawItems = feeds.flat();
        if (rawItems.length === 0) {
          return Response.json({ error: "No RSS items fetched" }, { status: 502 });
        }

        // 2. Breaking News Priority Engine — score, drop low-value items.
        const items = scoreAndFilter(rawItems);
        if (items.length === 0) {
          return Response.json({ error: "No items met the publish threshold" }, { status: 200 });
        }

        // 3. Discover-optimized rewrite.
        let rewritten: {
          source_index: number;
          category: string;
          title: string;
          dek: string;
          summary?: string;
          relevance?: string;
          sections?: NewsSection[];
          keyTakeaways?: string[];
          faq?: { q: string; a: string }[];
        }[];
        try {
          rewritten = await rewriteWithAi(items, lovableApiKey);
        } catch (err) {
          console.error("AI rewrite failed", err);
          return Response.json({ error: "AI rewrite failed", details: String(err) }, { status: 500 });
        }

        // 4. Insert rewritten articles into the database.
        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const now = new Date();
        const datePrefix = now.toISOString().slice(0, 10);
        const rows = rewritten
          .filter(
            (a) =>
              a.title &&
              a.dek &&
              a.source_index >= 1 &&
              a.source_index <= items.length &&
              typeof a.summary === "string" &&
              typeof a.relevance === "string" &&
              a.relevance.trim().length >= 40,
          )
          .map((a) => {
            const src = items[a.source_index - 1];
            const category = (CATEGORIES as readonly string[]).includes(a.category) ? a.category : src.sourceCategory;
            const slug = `${datePrefix}-${slugify(a.title)}`;
            const takeaways =
              Array.isArray(a.keyTakeaways) && a.keyTakeaways.length > 0
                ? a.keyTakeaways.slice(0, 5)
                : [`Source: ${src.source}.`, "Keep TX Red rewrote this update for Texas readers."];
            const bodyJson = {
              updated: now.toISOString().slice(0, 10),
              intro: [a.summary!.trim()],
              sections: [
                { heading: "Texas relevance", paragraphs: [a.relevance!.trim()] },
                ...(Array.isArray(a.sections)
                  ? a.sections
                      .filter((s) => s?.heading && Array.isArray(s.paragraphs) && s.paragraphs.length > 0)
                      .slice(0, 10)
                  : []),
                {
                  heading: "Source attribution",
                  paragraphs: [
                    `This story was reported using a public release from ${src.source}. Keep TX Red rewrote the coverage independently and links to the original for verification.`,
                  ],
                },
              ],
              faq: Array.isArray(a.faq) ? a.faq.slice(0, 6) : [],
              sources: [{ label: `${src.source} — original report`, url: src.link }],
              keyTakeaways: takeaways,
            };
            return {
              slug,
              internal_url: `/news/${slug}`,
              is_ingested: false,
              category,
              title: a.title.slice(0, 200),
              dek: a.dek.slice(0, 400),
              source_name: src.source,
              source_url: src.link,
              published_at: now.toISOString(),
              score: src.score,
              is_breaking: src.isBreaking,
              kind: "news",
              body: articleBodyText(bodyJson),
              body_json: bodyJson,
            };
          })
          .filter((row) => meetsArticleMainWordCount(row.kind, row.body_json));

        if (rows.length === 0) {
          return Response.json({ error: "No valid rewritten articles" }, { status: 500 });
        }

        rows.forEach((r) => enrichArticleRow(r));

        const { error: insertError, count } = await supabase
          .from("daily_articles")
          .upsert(rows, { onConflict: "slug", count: "exact" });

        if (insertError) {
          console.error("Insert failed", insertError);
          return Response.json({ error: insertError.message }, { status: 500 });
        }

        await Promise.allSettled(rows.map((row) => generateFeaturedImageForSlugDirect(row.slug, true)));

        // 5. Prune anything older than 30 days so the table stays lean.
        const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        await supabase.from("daily_articles").delete().lt("published_at", cutoff).eq("kind", "news");

        return Response.json({
          ok: true,
          inserted: count ?? rows.length,
          fetched: rawItems.length,
          scored: items.length,
          breaking: rows.filter((r) => r.is_breaking).length,
        });
      },
    },
  },
});