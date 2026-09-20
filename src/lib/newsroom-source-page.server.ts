const MAX_SOURCE_TEXT_CHARS = 12_000;
const MIN_READABLE_CHARS = 500;

export function looksSyntheticNewsroomText(value: string | null | undefined): boolean {
  const text = (value ?? "").trim();
  return /MULTI-SOURCE STORY PACKET\.|RAW SOURCE PACKET|STRUCTURED FACT LEDGER/i.test(text);
}

export function shouldFetchNewsroomSourcePage(input: { url: string | null; extractedBody: string | null }): boolean {
  const url = (input.url ?? "").trim();
  if (!/^https?:\/\//i.test(url)) return false;
  if (/^https?:\/\/(?:www\.)?news\.google\.com\//i.test(url)) return false;
  const body = (input.extractedBody ?? "").trim();
  return looksSyntheticNewsroomText(body) || body.length < 4_000;
}

export function extractReadableNewsroomHtml(html: string): string | null {
  const stripped = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<(header|footer|nav|aside|form)\b[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const article = stripped.match(/<article\b[^>]*>[\s\S]*?<\/article>/i)?.[0] ?? stripped;
  const text = article
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#8217;|&rsquo;/gi, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
  if (text.length < MIN_READABLE_CHARS || looksSyntheticNewsroomText(text)) return null;
  return text.slice(0, MAX_SOURCE_TEXT_CHARS);
}

export async function fetchReadableNewsroomSource(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.2; +https://keeptxred.com)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml/i.test(type)) return null;
    return extractReadableNewsroomHtml(await response.text());
  } catch {
    return null;
  }
}
