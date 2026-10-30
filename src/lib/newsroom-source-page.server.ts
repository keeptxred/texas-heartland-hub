import { isGovernmentNewsClippingUrl } from "./newsroom-discovery-sources";
import { trimTdemPressReleaseArchive } from "./tdem-press-release-body";

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
  return /MULTI-SOURCE STORY PACKET\.|RAW SOURCE PACKET|STRUCTURED FACT LEDGER|PRIMARY-RECORD-AUGMENTED SOURCE PACKET\.|RELATED OFFICIAL RELEASE SERIES:/i.test(text);
}

/** Prefer a verifiable publisher body over any longer synthetic packet
 * accidentally cached in extracted_body. Length comparisons apply only when
 * BOTH versions are real, standalone publisher text.
 */
export function shouldReplaceNewsroomSourceBody(existingText: string | null | undefined, fetchedText: string | null | undefined, sourceUrl?: string | null): boolean {
  const fetched = (fetchedText ?? "").trim();
  if (fetched.length < MIN_READABLE_CHARS || looksSyntheticNewsroomText(fetched)) return false;
  const existing = (existingText ?? "").trim();
  if (looksSyntheticNewsroomText(existing)) return true;
  // A previously cached TDEM HTML extraction includes a long unrelated
  // release archive. Prefer the shorter, newly fetched clean original instead
  // of preserving polluted evidence solely because its byte count was longer.
  if (trimTdemPressReleaseArchive(sourceUrl, existing) !== existing
    && trimTdemPressReleaseArchive(sourceUrl, fetched) === fetched) return true;
  return fetched.length > existing.length + 100;
}

export function shouldFetchNewsroomSourcePage(input: { url: string | null; extractedBody: string | null; minSubstantiveChars?: number }): boolean {
  const url = (input.url ?? "").trim();
  if (!/^https?:\/\//i.test(url)) return false;
  if (/^https?:\/\/(?:www\.)?news\.google\.com\//i.test(url)) return false;
  // Government-hosted newspaper clipping indexes do not contain the underlying
  // publisher's independent report or an official event record. Do not spend
  // Worker CPU fetching these known discovery pointers.
  if (isGovernmentNewsClippingUrl(url)) return false;
  const body = (input.extractedBody ?? "").trim();
  // Stale TDEM archive pollution is always eligible for a *bounded* real-page
  // refresh, even when navigation made the cached text appear substantive.
  if (trimTdemPressReleaseArchive(url, body) !== body) return true;
  // A primary record can be the only independently authoritative source.
  // It still must meet the unchanged 5k newsroom evidence gate. Give a
  // 4k–5k primary record a bounded opportunity to retrieve its fuller page.
  const threshold = Math.max(NEWSROOM_SUBSTANTIVE_SOURCE_CHARS, input.minSubstantiveChars ?? NEWSROOM_SUBSTANTIVE_SOURCE_CHARS);
  return looksSyntheticNewsroomText(body) || body.length < threshold;
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

/**
 * Many Texas news publishers supply the actual article in schema.org
 * NewsArticle.articleBody even when their public HTML has only a short
 * client-rendered shell. Parse ONLY explicit articleBody from a JSON-LD
 * NewsArticle/Article node; never substitute page description, webpage cards
 * or synthetic/aggregated text as an independent reported source.
 *
 * This is an alternate representation of the same fetched source URL, not a
 * newly invented source or an additional corroborating publisher.
 */
export function extractNewsroomArticleJsonLd(html: string): string | null {
  const scripts = html.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) ?? [];
  let best = "";
  for (const script of scripts.slice(0, 40)) {
    const openTag = script.match(/^<script\b[^>]*>/i)?.[0] ?? "";
    if (!/\btype\s*=\s*["']application\/ld\+json["']/i.test(openTag)) continue;
    const raw = script.slice(openTag.length).replace(/<\/script>\s*$/i, "").trim();
    if (!raw || raw.length > 500_000) continue;
    let json: unknown;
    try { json = JSON.parse(raw); } catch { continue; }
    const nodes: unknown[] = [json];
    // Bound traversal to prevent an unrelated embedded site graph from
    // producing expensive work, and only inspect relevant graph/item nodes.
    for (let i = 0; i < nodes.length && i < 100; i++) {
      const node = nodes[i];
      if (Array.isArray(node)) {
        nodes.push(...node.slice(0, 40));
        continue;
      }
      if (!node || typeof node !== "object") continue;
      const obj = node as Record<string, unknown>;
      const kinds = Array.isArray(obj["@type"]) ? obj["@type"] : [obj["@type"]];
      const isArticle = kinds.some((v) =>
        typeof v === "string" && /^(?:NewsArticle|Article|ReportageNewsArticle|AnalysisNewsArticle|BackgroundNewsArticle)$/i.test(v));
      if (isArticle && typeof obj.articleBody === "string") {
        const text = newsroomHtmlText(obj.articleBody);
        if (text.length >= MIN_READABLE_CHARS && !looksSyntheticNewsroomText(text) && text.length > best.length) {
          best = text;
        }
      }
      if (obj["@graph"]) nodes.push(obj["@graph"]);
      if (obj.mainEntity) nodes.push(obj.mainEntity);
    }
  }
  return best ? best.slice(0, MAX_SOURCE_TEXT_CHARS) : null;
}

/**
 * A growing class of publisher templates renders the actual article in a
 * nested <div class="article-body"> / itemprop="articleBody" while their
 * <article> elements are only related-story cards. Use ONE explicitly marked
 * article-body container, never the entire <main>, cards, nav, or concatenated
 * unrelated excerpts as purported source evidence.
 *
 * Balance nested root tags rather than stopping at the first child </div>.
 * This is a narrow zero-AI extraction path for the exact fetched publisher
 * URL, not a corroborating second source and not an editorial gate bypass.
 */
export function extractNewsroomMarkedArticleBody(html: string): string | null {
  const open = /<(div|section)\b([^>]*)>/gi;
  let found: RegExpExecArray | null;
  let best = "";
  let checked = 0;
  while ((found = open.exec(html)) !== null && checked < 48) {
    const attrs = found[2];
    const itemprop = /\bitemprop\s*=\s*(?:"articlebody"|'articlebody'|articlebody\b)/i.test(attrs);
    const explicitData = /\bdata-(?:testid|component)\s*=\s*["'](?:article|story)[-_]?(?:body|content)["']/i.test(attrs);
    const classText = attrs.match(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find(Boolean) ?? "";
    const articleClass = /(?:^|\s)(?:article|story|entry)(?:-|__)(?:body|content|text)(?:\b|[-_])/i.test(classText);
    if (!itemprop && !explicitData && !articleClass) continue;
    checked += 1;
    const tag = found[1].toLowerCase();
    const rest = html.slice(found.index);
    const matchingTag = new RegExp('<\\/?' + tag + '\\b[^>]*>', 'gi');
    let match: RegExpExecArray | null;
    let depth = 0;
    let closingAt = -1;
    while ((match = matchingTag.exec(rest)) !== null) {
      if (/^<\//.test(match[0])) {
        depth -= 1;
        if (depth === 0) {
          closingAt = matchingTag.lastIndex;
          break;
        }
      } else if (!/\/>$/.test(match[0])) {
        depth += 1;
      }
      if (matchingTag.lastIndex > 550_000) break;
    }
    if (closingAt <= 0) continue;
    const oneArticle = rest.slice(found[0].length, closingAt - match![0].length)
      .replace(/<(?:script|style|noscript)\b[^>]*>[\s\S]*?<\/(?:script|style|noscript)>/gi, " ")
      .replace(/<(?:aside|nav|footer|header|form)\b[^>]*>[\s\S]*?<\/(?:aside|nav|footer|header|form)>/gi, " ");
    const text = newsroomHtmlText(oneArticle);
    if (text.length >= MIN_READABLE_CHARS && !looksSyntheticNewsroomText(text) && text.length > best.length) {
      best = text;
    }
  }
  return best ? best.slice(0, MAX_SOURCE_TEXT_CHARS) : null;
}

export function extractReadableNewsroomHtml(html: string): string | null {
  const structuredArticle = extractNewsroomArticleJsonLd(html);
  const markedArticle = extractNewsroomMarkedArticleBody(html);
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
  // Never concatenate two partly overlapping article representations, and
  // never use unrelated teaser cards as padding. Choose one substantive body.
  const winner = [structuredArticle, markedArticle, text].filter((body): body is string => Boolean(body))
    .sort((a, b) => b.length - a.length)[0] ?? "";
  if (winner.length < MIN_READABLE_CHARS || looksSyntheticNewsroomText(winner)) return null;
  return winner.slice(0, MAX_SOURCE_TEXT_CHARS);
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
    const extracted = extractReadableNewsroomHtml(await response.text());
    return extracted ? trimTdemPressReleaseArchive(url, extracted) : null;
  } catch {
    return null;
  }
}
