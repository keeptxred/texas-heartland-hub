/**
 * Official sports discovery may not turn a crawl time into a publish time.
 * RSS/Atom timestamps must originate in the actual entry; HTML archives need
 * a date in the original publisher's own permanent article path. This parser
 * does NOT confer independence, article approval, credibility or freshness to
 * any news draft.
 */
const RECENT_SOURCE_MAX_AGE_MS = 21 * 86_400_000;
const FUTURE_TOLERANCE_MS = 24 * 60 * 60 * 1000;

function reasonableSourceDate(when: Date, nowMs: number): boolean {
  const ms = when.getTime();
  return Number.isFinite(ms) && ms <= nowMs + FUTURE_TOLERANCE_MS
    && ms >= nowMs - RECENT_SOURCE_MAX_AGE_MS;
}

export function originalSportsRssPublishedAt(raw: string | undefined, nowMs = Date.now()): string | null {
  if (!raw?.trim() || !/\b20\d{2}\b/.test(raw)) return null;
  const parsed = new Date(raw.trim());
  if (!reasonableSourceDate(parsed, nowMs)) return null;
  return parsed.toISOString();
}

export function originalSportsPermalinkPublishedAt(articleUrl: string, nowMs = Date.now()): string | null {
  let pathname: string;
  try {
    const u = new URL(articleUrl);
    if (u.protocol !== "https:") return null;
    pathname = u.pathname;
  } catch {
    return null;
  }

  // Require the actual original article permalink: a listing page such as
  // /news/2026/11/ or an event calendar does not qualify. Dates displayed
  // only elsewhere in the index are not credited to this story.
  const match = pathname.match(/^\/(?:news\/)?(20\d{2})\/(\d{1,2})\/(\d{1,2})\/[^/]+\/?$/i);
  if (!match) return null;
  const [, year, month, day] = match;
  const ymd = year + "-" + month.padStart(2, "0") + "-" + day.padStart(2, "0");
  const date = new Date(ymd + "T12:00:00Z");
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== ymd
      || !reasonableSourceDate(date, nowMs)) return null;
  // A publisher date-only URL justifies the calendar date, not the actual
  // hour of publication. The fixed noon marker prevents pretending a scrape
  // time is an original event timestamp.
  return date.toISOString();
}


/**
 * Texas A&M's official article listing emits equivalent /11/09/ and /11/9/
 * URLs for the SAME original dated report. Treat these as a single publisher
 * permalink before the unique-link upsert. Do not canonicalize other schools,
 * cross-domain URLs, invalid dates, or undated archive/index pages.
 */
export function canonicalSportsOriginalPublisherUrl(raw: string): string {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" || !/^(?:www\.)?12thman\.com$/i.test(parsed.hostname)) return raw;
    const match = parsed.pathname.match(/^\/news\/(20\d{2})\/0?(\d{1,2})\/0?(\d{1,2})\/([a-z0-9-]+)\/?$/i);
    if (!match) return raw;
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) return raw;
    return \`https://12thman.com/news/\${year}/\${month}/\${day}/\${match[4]}\`;
  } catch {
    return raw;
  }
}
