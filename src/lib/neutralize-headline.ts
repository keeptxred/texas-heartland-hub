// Detects first-person / personal-experience phrasing in a source headline
// and rewrites it into a neutral, third-person news-style title before that
// title is used for KeepTXRed article generation, AI prompting, or social
// captions. KeepTXRed staff have not personally experienced the event, so
// any headline written as if they did must be normalized.
//
// Deterministic and dependency-free — safe to call inside the ingestion
// hot path. Returns the input unchanged when no first-person cue is found.

const FIRST_PERSON_RE =
  /\b(i\s+(?:visited|went|booked|tried|tested|stayed|ate|bought|found|drove|saw|met|attended|spent|took|paid|noticed|witnessed|experienced|toured|explored|checked|ordered|rented|hired|watched|joined|shopped|traveled|travelled|moved|arrived|lived|worked)|my\s+(?:parents|family|trip|experience|kids|wife|husband|spouse|partner|friend|friends|mom|dad|son|daughter|neighbor|neighbors|boss|coworker|coworkers|company|home|house|apartment|car|dog|cat|kid|child|children))\b/i;

const CITY_RE =
  /\b(Austin|Houston|Dallas|Fort Worth|San Antonio|El Paso|Arlington|Plano|Corpus Christi|Lubbock|Laredo|Irving|Garland|Frisco|McKinney|Amarillo|Grand Prairie|Brownsville|Killeen|Pasadena|McAllen|Waco|Denton|Midland|Odessa|Round Rock|Sugar Land|Tyler|Beaumont|College Station|Comfort|Galveston|The Woodlands|Katy)\b/i;

export function isFirstPersonTitle(title: string): boolean {
  return FIRST_PERSON_RE.test(title ?? "");
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Rewrite a first-person / personal-experience headline into a neutral,
 * third-person news headline. Preserves any Texas location mentioned and
 * never invents facts.
 */
export function neutralizeFirstPersonTitle(rawTitle: string): string {
  const title = (rawTitle ?? "").trim();
  if (!title || !isFirstPersonTitle(title)) return title;

  const cityMatch = title.match(CITY_RE);
  const city = cityMatch ? titleCase(cityMatch[0]) : "";

  // Strip the leading first-person clause up through the next comma or
  // conjunction so the remainder can seed a neutral topic phrase.
  const stripped = title
    .replace(/^[^,.:;]*?(,|\bwhere\b|\bthat\b|\bwhen\b|\band\b|\bbut\b|:|\.|;)/i, "")
    .replace(/^\s*[,:;\.\-]\s*/, "")
    .trim();

  const topic = stripped.length > 0 ? stripped.replace(/\s+/g, " ") : title;

  if (city) {
    return `${city}, Texas Draws Attention as ${topic.replace(/^./, (c) => c.toUpperCase())}`.slice(0, 180);
  }
  return `Texas Report: ${topic.replace(/^./, (c) => c.toUpperCase())}`.slice(0, 180);
}