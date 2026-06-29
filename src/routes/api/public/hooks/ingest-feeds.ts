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
    const articleRows = fresh.map((it) => {
      const datePrefix = it.pub_date.slice(0, 10);
      const slug = `live-${datePrefix}-${slugify(it.title)}-${hashStr(it.link)}`;
      const cat = categoryFor(it.source);
      return {
        slug,
        internal_url: `/news/${slug}`,
        is_ingested: false,
        category: cat,
        title: it.title,
        dek: (it.description || it.title).slice(0, 380),
        body: it.description ?? "",
        author: "Keep TX Red Newsroom",
        source_name: it.source,
        source_url: it.link,
        published_at: it.pub_date,
        kind: "ingested",
        is_breaking: false,
        score: 0,
        body_json: {
          updated: it.pub_date.slice(0, 10),
          intro: [it.description || `${it.source} released a new update for Texans.`],
          sections: [
            {
              heading: "What we know",
              paragraphs: [
                it.description || "Details from the official source are being added as they become available.",
                `This update was originally published by the ${it.source}. Keep TX Red is monitoring the story and will expand coverage as new details emerge.`,
              ],
            },
          ],
          faq: [],
          sources: [{ label: `${it.source} — official release`, url: it.link }],
          keyTakeaways: [
            `Source: ${it.source}.`,
            "Keep TX Red republishes official Texas government updates with attribution.",
          ],
        },
      };
    });

    const { error: artErr, count: artCount } = await supabaseAdmin
      .from("daily_articles")
      .upsert(articleRows, { onConflict: "slug", ignoreDuplicates: true, count: "exact" });
    if (!artErr) {
      nativeMinted = artCount ?? articleRows.length;
      // Write the internal slug back onto the feed row so cards can link to it.
      await Promise.all(
        articleRows.map((row, i) =>
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
    .limit(50);
  if (orphans && orphans.length > 0) {
    const backRows = orphans.map((row) => {
      const it: Item = {
        title: row.title,
        link: row.link,
        source: row.source,
        pub_date: row.pub_date,
        description: row.description ?? "",
      };
      const datePrefix = it.pub_date.slice(0, 10);
      const slug = `live-${datePrefix}-${slugify(it.title)}-${hashStr(it.link)}`;
      return { slug, item: it };
    });
    await supabaseAdmin.from("daily_articles").upsert(
      backRows.map(({ slug, item }) => ({
        slug,
        internal_url: `/news/${slug}`,
        is_ingested: false,
        category: categoryFor(item.source),
        title: item.title,
        dek: (item.description || item.title).slice(0, 380),
        body: item.description ?? "",
        author: "Keep TX Red Newsroom",
        source_name: item.source,
        source_url: item.link,
        published_at: item.pub_date,
        kind: "ingested",
        is_breaking: false,
        score: 0,
        body_json: {
          updated: item.pub_date.slice(0, 10),
          intro: [item.description || `${item.source} released a new update for Texans.`],
          sections: [
            {
              heading: "What we know",
              paragraphs: [
                item.description || "Details from the official source are being added as they become available.",
                `This update was originally published by the ${item.source}. Keep TX Red is monitoring the story and will expand coverage as new details emerge.`,
              ],
            },
          ],
          faq: [],
          sources: [{ label: `${item.source} — official release`, url: item.link }],
          keyTakeaways: [
            `Source: ${item.source}.`,
            "Keep TX Red republishes official Texas government updates with attribution.",
          ],
        },
      })),
      { onConflict: "slug", ignoreDuplicates: true },
    );
    await Promise.all(
      backRows.map(({ slug, item }) =>
        supabaseAdmin.from("texas_news_feed").update({ internal_slug: slug }).eq("link", item.link),
      ),
    );
  }

  return new Response(
    JSON.stringify({ ok: true, fetched: all.length, candidates: fresh.length, inserted, nativeMinted, diag }),
    { headers: { "Content-Type": "application/json" } },
  );
}