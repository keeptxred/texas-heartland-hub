/**
 * The official TDEM /press-release/MM-DD-YY template appends a site-wide
 * "Related Pages" release archive to the fetched story. Dates and navigation
 * about other events are not original reporting for this release.
 *
 * Scope this clean-up to the verified first-party dated press-release URL.
 * Return other source bodies unchanged; never remove a story's own text merely
 * because it includes the words "related pages".
 */
export function trimTdemPressReleaseArchive(sourceUrl: string | null | undefined, body: string): string {
  try {
    const url = new URL(sourceUrl ?? "");
    if (url.hostname.replace(/^www\./i, "").toLowerCase() !== "tdem.texas.gov"
      || !/^\/press-release\/\d{1,2}-\d{1,2}-\d{2}\/?$/i.test(url.pathname)) return body;
    const cleaned = body.replace(/\bRelated Pages(?=\s+[A-Z][a-z]+\s+\d{1,2},\s+20\d{2}\b)[\s\S]*$/i, "");
    return cleaned === body ? body : cleaned.trim();
  } catch {
    return body;
  }
}
