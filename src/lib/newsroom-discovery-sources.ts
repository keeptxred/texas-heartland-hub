/**
 * The Texas Legislative Reference Library's Daily Clipping Service catalogs
 * articles published by newspapers. Its government-hosted clipping pages are
 * discovery indexes, NOT direct records of the underlying court/agency event.
 * Do not confuse them with the Library's authentic bill and legislative records.
 */
export function isGovernmentNewsClippingUrl(rawUrl: string | null | undefined): boolean {
  if (!rawUrl) return false;
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== "lrl.state.tx.us" && host !== "lrl.texas.gov") return false;
    const path = url.pathname.toLowerCase();
    return path === "/cl.cfm" || path.startsWith("/currentissues/clips/");
  } catch {
    return false;
  }
}
