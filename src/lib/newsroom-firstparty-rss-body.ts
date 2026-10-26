/**
 * Only the actual article-body payload embedded by a direct publisher can
 * seed newsroom source evidence at RSS ingestion time. This is a faster
 * representation of the SAME original publisher, not extra corroboration.
 *
 * Do not promote Google News discovery snippets, relay summaries, HTML nav,
 * promotional cards, or one-line abstracts into full-length reporting.
 */
export function extractFirstPartyRssArticleBody(
  entryXml: string,
  sourceName: string,
  articleUrl: string,
): string | null {
  if (/google news/i.test(sourceName)) return null;
  let url: URL;
  try { url = new URL(articleUrl); } catch { return null; }
  if (!["https:", "http:"].includes(url.protocol)) return null;
  if (/^(?:news\.google\.com|(?:[^.]+\.)?supabase\.co|youtube\.com|www\.youtube\.com)$/i.test(url.hostname)) return null;

  // RSS publishers may put the actual article in content:encoded. Atom's
  // content type=html is acceptable only if it is an explicit content node.
  const rss = entryXml.match(/<content:encoded\b[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1];
  const atom = entryXml.match(/<content\b[^>]*\btype\s*=\s*["'](?:html|xhtml)["'][^>]*>([\s\S]*?)<\/content>/i)?.[1];
  const raw = rss ?? atom;
  if (!raw || raw.length > 300_000) return null;

  const html = raw
    .replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&");
  const text = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<(?:nav|footer|aside)\b[^>]*>[\s\S]*?<\/(?:nav|footer|aside)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length < 500 || text.split(/\s+/).length < 85) return null;
  if (/MULTI-SOURCE STORY PACKET\.|RAW SOURCE PACKET|STRUCTURED FACT LEDGER|PRIMARY-RECORD-AUGMENTED SOURCE PACKET\\.|RELATED OFFICIAL RELEASE SERIES:/i.test(text)) return null;
  return text.slice(0, 8000);
}
