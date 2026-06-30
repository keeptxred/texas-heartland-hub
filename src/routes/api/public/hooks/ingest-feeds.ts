import { createFileRoute } from "@tanstack/react-router";

const SOURCES = [
  { name: "Office of the Governor", url: "https://gov.texas.gov/news/rss" },
  { name: "Texas Secretary of State", url: "https://www.sos.state.tx.us/rss/press.xml" },
  { name: "Texas Register", url: "https://www.sos.state.tx.us/texreg/texreg.xml" },
];

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? decode(m[1]) : "";
}

type Item = { title: string; link: string; pub_date: string; source: string; description: string };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function hashStr(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 6);
}

function categoryFor(source: string): string {
  const s = source.toLowerCase();
  if (s.includes("governor")) return "Politics";
  if (s.includes("secretary")) return "Elections";
  if (s.includes("register")) return "Laws";
  return "Legislature";
}

type Rewrite = {
  title: string;
  dek: string;
  keywords: string[];
  summary: string;
  relevance: string;
  analysis?: string;
  keyTakeaways: string[];
  faq?: { q: string; a: string }[];
};

const REWRITE_SYSTEM = `You are the Keep TX Red editorial engine. Rewrite a Texas news item from an official source into a fully ORIGINAL article for keeptxred.com.

HARD RULES:
- Extract only facts (who/what/when/where/why). Never copy sentences or phrasing from the source. No direct quote longer than 10 words.
- Neutral, factual tone in Summary, Relevance, and Key Takeaways. Analysis is clearly labeled opinion and is optional.
- Mobile-friendly paragraphs (2–4 sentences each).
- Meta description (dek) MUST be <= 155 characters.
- Title must be SEO-optimized, original, and not resemble the source headline.
- 5–10 lowercase keywords, Texas-specific where possible.
- Output VALID JSON only matching the schema below.

SCHEMA:
{"title":"...","dek":"<=155 chars","keywords":["..."],"summary":"2-3 sentence neutral summary","relevance":"why this matters to Texas (2-4 sentences)","analysis":"optional labeled editorial interpretation, or omit","keyTakeaways":["3-5 short bullets"],"faq":[{"q":"...","a":"..."}]}`;

async function rewriteItem(it: Item, lovableApiKey: string): Promise<Rewrite | null> {
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: REWRITE_SYSTEM },
          {
            role: "user",
            content: `SOURCE: ${it.source}\nORIGINAL HEADLINE: ${it.title}\nORIGINAL SUMMARY: ${it.description}\nLINK: ${it.link}\nDATE: ${it.pub_date}\n\nRewrite per the rules. Return JSON only.`,
          },
        ],
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as Rewrite;
    if (!parsed?.title || !parsed?.summary || !parsed?.dek) return null;
    parsed.dek = parsed.dek.slice(0, 155);
    parsed.keywords = (parsed.keywords ?? []).slice(0, 10).map((k) => String(k).toLowerCase());
    parsed.keyTakeaways = (parsed.keyTakeaways ?? []).slice(0, 5);
    return parsed;
  } catch {
    return null;
  }
}

function buildArticleRow(it: Item, rw: Rewrite | null) {
  const datePrefix = it.pub_date.slice(0, 10);
  const baseTitle = rw?.title ?? it.title;
  const slug = `live-${datePrefix}-${slugify(baseTitle)}-${hashStr(it.link)}`;
  const cat = categoryFor(it.source);
  const sections: { heading: string; paragraphs: string[] }[] = [
    {
      heading: "Texas relevance",
      paragraphs: [rw?.relevance ?? `This update from the ${it.source} affects Texans and is being tracked by the Keep TX Red newsroom.`],
    },
  ];
  if (rw?.analysis) {
    sections.push({ heading: "Analysis", paragraphs: [rw.analysis] });
  }
  sections.push({
    heading: "Source attribution",
    paragraphs: [
      `This story was reported using a public release from the ${it.source}. Keep TX Red rewrote the coverage independently and links to the official statement for verification.`,
    ],
  });

  return {
    slug,
    internal_url: `/news/${slug}`,
    is_ingested: true,
    category: cat,
    title: baseTitle.slice(0, 200),
    dek: (rw?.dek ?? (it.description || it.title)).slice(0, 155),
    body: rw?.summary ?? it.description ?? "",
    author: "Keep TX Red Newsroom",
    source_name: it.source,
    source_url: it.link,
    published_at: it.pub_date,
    kind: "ingested",
    is_breaking: false,
    score: 0,
    keywords: rw?.keywords ?? [],
    body_json: {
      updated: it.pub_date.slice(0, 10),
      intro: [rw?.summary ?? it.description ?? `${it.source} released a new update for Texans.`],
      sections,
      faq: rw?.faq ?? [],
      sources: [{ label: `${it.source} — official release`, url: it.link }],
      keyTakeaways:
        rw?.keyTakeaways && rw.keyTakeaways.length > 0
          ? rw.keyTakeaways
          : [
              `Source: ${it.source}.`,
              "Keep TX Red rewrites every ingested story into original editorial coverage.",
            ],
    },
  };
}

function parseFeed(xml: string, source: string): Item[] {
  const items: Item[] = [];
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) || [];
  for (const b of blocks) {
    const title = pick(b, "title");
    let link = pick(b, "link");
    if (!link) {
      const m = b.match(/<link[^>]*href=["']([^"']+)["']/i);
      if (m) link = m[1];
    }
    const rawDate = pick(b, "pubDate") || pick(b, "updated") || pick(b, "published") || "";
    const description = pick(b, "description") || pick(b, "summary") || pick(b, "content");
    const ts = Date.parse(rawDate);
    if (title && link) {
      items.push({
        title: title.slice(0, 500),
        link,
        pub_date: new Date(isNaN(ts) ? Date.now() : ts).toISOString(),
        source,
        description: description.slice(0, 1000),
      });
    }
  }
  return items;
}

export const Route = createFileRoute("/api/public/hooks/ingest-feeds")({
  server: {
    handlers: {
      POST: handler,
      GET: handler,
    },
  },
});

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const results = await Promise.all(
    SOURCES.map(async (s) => {
      try {
        const res = await fetch(s.url, {
          headers: {
            "User-Agent": "KeepTXRedBot/1.0 (+https://www.keeptxred.com)",
            Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
          },
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) return { source: s.name, url: s.url, status: res.status, items: [] as Item[] };
        const items = parseFeed(await res.text(), s.name).slice(0, 25);
        return { source: s.name, url: s.url, status: res.status, items };
      } catch (e) {
        return { source: s.name, url: s.url, status: 0, error: String(e), items: [] as Item[] };
      }
    }),
  );

  const all = results.flatMap((r) => r.items);
  const diag = results.map(({ items, ...rest }) => ({ ...rest, count: items.length }));
  if (all.length === 0) {
    return new Response(JSON.stringify({ ok: true, inserted: 0, fetched: 0, diag }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Dedupe by link against existing rows
  const links = Array.from(new Set(all.map((i) => i.link)));
  const { data: existing } = await supabaseAdmin
    .from("texas_news_feed")
    .select("link")
    .in("link", links);
  const have = new Set((existing ?? []).map((r: { link: string }) => r.link));
  const fresh = all.filter((i) => !have.has(i.link));

  let inserted = 0;
  if (fresh.length > 0) {
    const { error, count } = await supabaseAdmin
      .from("texas_news_feed")
      .upsert(fresh, { onConflict: "link", ignoreDuplicates: true, count: "exact" });
    if (error) {
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    inserted = count ?? fresh.length;
  }

  // Mint a native Keep TX Red article for every freshly ingested feed item so
  // Happening Now only ever links to internal /news/{slug} URLs.
  let nativeMinted = 0;
  if (fresh.length > 0) {
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    const rewrites: (Rewrite | null)[] = lovableApiKey
      ? await Promise.all(fresh.map((it) => rewriteItem(it, lovableApiKey)))
      : fresh.map(() => null);
    const articleRows = fresh.map((it, i) => buildArticleRow(it, rewrites[i]));

    const { error: artErr, count: artCount } = await supabaseAdmin
      .from("daily_articles")
      .upsert(articleRows, { onConflict: "slug", ignoreDuplicates: true, count: "exact" });
    if (!artErr) {
      nativeMinted = artCount ?? articleRows.length;
      // Write the internal slug back onto the feed row so cards can link to it.
      await Promise.all(
        articleRows.map((row: { slug: string }, i: number) =>
          supabaseAdmin
            .from("texas_news_feed")
            .update({ internal_slug: row.slug })
            .eq("link", fresh[i].link),
        ),
      );
    }
  }

  // Backfill internal_slug for any older feed rows that don't have one yet.
  const { data: orphans } = await supabaseAdmin
    .from("texas_news_feed")
    .select("id,title,link,source,description,pub_date")
    .is("internal_slug", null)
    .limit(25);
  if (orphans && orphans.length > 0) {
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    const items: Item[] = orphans.map((row) => ({
      title: row.title,
      link: row.link,
      source: row.source,
      pub_date: row.pub_date,
      description: row.description ?? "",
    }));
    const rewrites: (Rewrite | null)[] = lovableApiKey
      ? await Promise.all(items.map((it) => rewriteItem(it, lovableApiKey)))
      : items.map(() => null);
    const backRows = items.map((it, i) => buildArticleRow(it, rewrites[i]));
    await supabaseAdmin
      .from("daily_articles")
      .upsert(backRows, { onConflict: "slug", ignoreDuplicates: true });
    await Promise.all(
      backRows.map((row, i) =>
        supabaseAdmin.from("texas_news_feed").update({ internal_slug: row.slug }).eq("link", items[i].link),
      ),
    );
  }

  return new Response(
    JSON.stringify({ ok: true, fetched: all.length, candidates: fresh.length, inserted, nativeMinted, diag }),
    { headers: { "Content-Type": "application/json" } },
  );
}