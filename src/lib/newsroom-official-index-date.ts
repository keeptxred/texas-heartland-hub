/**
 * Strict first-party HTML source discovery. Read only a bounded number of URLs
 * under an explicitly configured publisher + permalink pattern. Date must be
 * provable on the publisher's *article page*, never inferred from crawl time.
 */
function textOnly(s: string): string {
  return s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#8217;|&rsquo;/gi, "'")
    .replace(/\s+/g, " ").trim();
}

export function verifiedOfficialIndexLinks(html: string, sourceUrl: string, requiredPath: RegExp, max = 5): string[] {
  const base = new URL(sourceUrl);
  const seen = new Set<string>();
  const links: string[] = [];
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi;
  for (const match of html.matchAll(re)) {
    let link: URL;
    try { link = new URL(match[1], sourceUrl); } catch { continue; }
    if (link.protocol !== "https:" || link.hostname !== base.hostname || !requiredPath.test(link.pathname)) continue;
    const canonical = link.origin + link.pathname; // discard trackable query strings
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    links.push(canonical);
    if (links.length >= max) break;
  }
  return links;
}

export function verifiedOfficialArticleTitle(html: string): string | null {
  // A university or city article can include a site-wide "Newsfeed" H1
  // before its real article H1. Previously we stopped at that navigation H1
  // and silently discarded every otherwise valid official story.
  for (const match of html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)) {
    const title = textOnly(match[1] || "");
    // Never turn an error or blocked page into a story by scanning further.
    if (/^(404\b|page not found\b|access denied\b|error\b|login\b)/i.test(title)) return null;
    if (/^(news|newsfeed|latest|home)$/i.test(title)) continue;
    if (title.length >= 18 && title.length <= 240) return title;
  }
  return null;
}

function publicationCandidates(html: string): string[] {
  const candidates: string[] = [];
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags.slice(0, 250)) {
    const name = tag.match(/\b(?:name|property|itemprop)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    const value = tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1];
    if (name && value && /^(article:published_time|datepublished|publishdate|pubdate|publication_date|datecreated)$/.test(name)) {
      candidates.push(value);
    }
  }
  // Modern schema.org datePublished and semantic <time> are trustworthy
  // *article-page* timestamps, unlike dates in unrelated index cards.
  const json = html.match(/["']datePublished["']\s*:\s*["']([^"']+)["']/i)?.[1];
  if (json) candidates.push(json);
  const time = html.match(/<time\b[^>]*\bdatetime\s*=\s*["']([^"']+)["'][^>]*>/i)?.[1];
  if (time) candidates.push(time);
  // Some official institutions mark original publication in visible copy.
  // Do not accept the *updated* date as the initial article date.
  const original = textOnly(html.slice(0, 175_000)).match(/\bOriginally published\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i)?.[1];
  if (original) candidates.push(original);
  const published = textOnly(html.slice(0, 45_000)).match(/\bPublished on\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i)?.[1];
  if (published) candidates.push(published);
  return candidates;
}

export function verifiedOfficialArticlePublishedAt(html: string, nowMs = Date.now()): string | null {
  for (const raw of publicationCandidates(html)) {
    const d = new Date(raw.trim());
    if (Number.isNaN(d.getTime())) continue;
    const eventDate = d.toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) continue;
    const age = nowMs - d.getTime();
    // Bounded freshness protects searches from inventing "new" archival news.
    // A valid older original date is authoritative: never fall through to
    // a newer update/listing date and relabel archival news as breaking.
    if (age < -24 * 60 * 60 * 1000 || age > 14 * 86_400_000) return null;
    return d.toISOString();
  }
  return null;
}
