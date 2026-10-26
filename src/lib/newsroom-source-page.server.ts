import { isGovernmentNewsClippingUrl } from "./newsroom-discovery-sources";

const MAX_SOURCE_TEXT_CHARS = 12_000;
const MIN_READABLE_CHARS = 500;
export const NEWSROOM_SUBSTANTIVE_SOURCE_CHARS = 4_000;

/**
 * Rank a bounded source-hydration queue without changing any publication gate.
 * Independently corroborated PENDING stories missing source evidence go first,
 * with the smallest evidence deficit first. Already-qualified stories receive
 * lower fetch priority because new fetches cannot unlock their word floor.
 * These are scheduling hints only: official-source/independence and evidence
 * validation still happen in the publisher.
 */
export function newsroomHydrationPriority(input: {
  pending: boolean;
  independentlySourced: boolean;
  evidenceChars: number;
  requiredEvidenceChars: number;
  editorialScore: number;
}): number {
  const score = Math.max(0, Math.min(100, input.editorialScore));
  if (!input.pending) return score;
  if (!input.independentlySourced) return 1_000 + score;
  const deficit = Math.max(0, input.requiredEvidenceChars - Math.max(0, input.evidenceChars));
  return deficit > 0 ? 20_000 - Math.min(deficit, 9_000) + score : 10_000 + score;
}

export function looksSyntheticNewsroomText(value: string | null | undefined): boolean {
  const text = (value ?? "").trim();
  return /MULTI-SOURCE STORY PACKET\.|RAW SOURCE PACKET|STRUCTURED FACT LEDGER/i.test(text);
}

export function shouldFetchNewsroomSourcePage(input: { url: string | null; extractedBody: string | null }): boolean {
  const url = (input.url ?? "").trim();
  if (!/^https?:\/\//i.test(url)) return false;
  if (/^https?:\/\/(?:www\.)?news\.google\.com\//i.test(url)) return false;
  // Government-hosted newspaper clipping indexes do not contain the underlying
  // publisher's independent report or an official event record. Do not spend
  // Worker CPU fetching these known discovery pointers.
  if (isGovernmentNewsClippingUrl(url)) return false;
  const body = (input.extractedBody ?? "").trim();
  return looksSyntheticNewsroomText(body) || body.length < NEWSROOM_SUBSTANTIVE_SOURCE_CHARS;
}

/** Avoid repeatedly spending CPU/network time on blocked or persistently thin pages.
 * A short successful extraction still cannot satisfy the 4k cached-body threshold.
 * Use the longer backoff until the next daily attempt; complete source extractions
 * retain their existing six-hour retry behavior. Manual verification is unaffected.
 */
export function isNewsroomSourceFetchCoolingDown(
  state: { last_attempt_at: string | null; last_result: string | null; chars?: number | null } | null | undefined,
  nowMs: number,
  normalCooldownMs: number,
  unreadableCooldownMs: number,
): boolean {
  if (!state) return false;
  const lastAttemptMs = Date.parse(state.last_attempt_at ?? "");
  if (!Number.isFinite(lastAttemptMs)) return false;
  const shortSuccessfulBody = state.last_result === "success"
    && typeof state.chars === "number"
    && state.chars < NEWSROOM_SUBSTANTIVE_SOURCE_CHARS;
  const cooldownMs = state.last_result === "no_readable_body" || shortSuccessfulBody
    ? unreadableCooldownMs
    : normalCooldownMs;
  return lastAttemptMs > nowMs - cooldownMs;
}

export function extractReadableNewsroomHtml(html: string): string | null {
  const stripped = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<(header|footer|nav|aside|form)\b[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const articleBlocks = stripped.match(/<article\b[^>]*>[\s\S]*?<\/article>/gi) ?? [];
  // A news page can contain a brief related-story <article> before its own
  // complete article. Previously the first element silently displaced the
  // real source and made legitimately reportable stories appear thin.
  // Only use entire-page fallback when no <article> elements exist; never
  // concatenate unrelated articles into false evidence for one source.
  const readableArticle = articleBlocks
    .map((html) => {
      const text = newsroomHtmlText(html);
      return text.length >= MIN_READABLE_CHARS && !looksSyntheticNewsroomText(text) ? text : "";
    })
    .sort((left, right) => right.length - left.length)[0] ?? "";
  const text = articleBlocks.length ? readableArticle : newsroomHtmlText(stripped);
  if (text.length < MIN_READABLE_CHARS || looksSyntheticNewsroomText(text)) return null;
  return text.slice(0, MAX_SOURCE_TEXT_CHARS);
}

function newsroomHtmlText(html: string): string {
  return html
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
