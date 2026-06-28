import { createServerFn } from "@tanstack/react-start";

export type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
};

const SOURCES = [
  {
    name: "Office of the Governor",
    url: "https://gov.texas.gov/news/feed/",
  },
  {
    name: "Texas Legislature — House Bills Filed",
    url: "https://capitol.texas.gov/MnuBillsFiledRSS.aspx?Chamber=H",
  },
  {
    name: "Texas Legislature — Senate Bills Filed",
    url: "https://capitol.texas.gov/MnuBillsFiledRSS.aspx?Chamber=S",
  },
  {
    name: "Texas Secretary of State",
    url: "https://www.sos.state.tx.us/about/newsreleases.shtml",
  },
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

function parseFeed(xml: string, source: string): FeedItem[] {
  const items: FeedItem[] = [];
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) || [];
  for (const b of blocks) {
    const title = pick(b, "title");
    let link = pick(b, "link");
    if (!link) {
      const m = b.match(/<link[^>]*href=["']([^"']+)["']/i);
      if (m) link = m[1];
    }
    const pubDate = pick(b, "pubDate") || pick(b, "updated") || pick(b, "published") || "";
    const description = pick(b, "description") || pick(b, "summary") || pick(b, "content");
    if (title && link) {
      items.push({
        title: title.slice(0, 240),
        link,
        pubDate,
        source,
        description: description.slice(0, 320),
      });
    }
  }
  return items;
}

export const getStatewideFeeds = createServerFn({ method: "GET" }).handler(async () => {
  const results = await Promise.all(
    SOURCES.map(async (s) => {
      try {
        const res = await fetch(s.url, {
          headers: {
            "User-Agent": "KeepTXRedBot/1.0 (+https://www.keeptxred.com)",
            Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
          },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return [];
        const xml = await res.text();
        return parseFeed(xml, s.name).slice(0, 12);
      } catch {
        return [];
      }
    }),
  );
  const all = results.flat();
  all.sort((a, b) => {
    const da = Date.parse(a.pubDate) || 0;
    const db = Date.parse(b.pubDate) || 0;
    return db - da;
  });
  return { items: all, fetchedAt: new Date().toISOString() };
});