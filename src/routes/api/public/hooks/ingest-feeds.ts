import { createFileRoute } from "@tanstack/react-router";

const SOURCES = [
  { name: "Office of the Governor", url: "https://gov.texas.gov/news/feed/" },
  { name: "Texas Legislature — House Bills Filed", url: "https://capitol.texas.gov/MnuBillsFiledRSS.aspx?Chamber=H" },
  { name: "Texas Legislature — Senate Bills Filed", url: "https://capitol.texas.gov/MnuBillsFiledRSS.aspx?Chamber=S" },
  { name: "Texas Secretary of State", url: "https://www.sos.state.tx.us/about/newsreleases.shtml" },
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
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) return [];
        return parseFeed(await res.text(), s.name).slice(0, 25);
      } catch {
        return [];
      }
    }),
  );

  const all = results.flat();
  if (all.length === 0) {
    return new Response(JSON.stringify({ ok: true, inserted: 0, fetched: 0 }), {
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

  return new Response(
    JSON.stringify({ ok: true, fetched: all.length, candidates: fresh.length, inserted }),
    { headers: { "Content-Type": "application/json" } },
  );
}