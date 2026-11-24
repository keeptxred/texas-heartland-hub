import { ELECTION_FEATURE_FLAGS } from "./elections/featureFlags";
import { isRetiredElectionCentralPath } from "./retired-election-central";

export function publicElectionReference(enabled = ELECTION_FEATURE_FLAGS.homepagePromotion) {
  return enabled
    ? { href: "/elections/2026", label: "Texas Election Central", description: "Statewide and local election coverage for the active cycle." }
    : { href: "/county-elections", label: "Texas county election offices", description: "Official county election offices, ballot resources and election administration." };
}

export function isAvailableElectionReference(href: string, enabled = ELECTION_FEATURE_FLAGS.homepagePromotion): boolean {
  if (enabled) return true;
  try {
    const target = new URL(href, "https://keeptxred.com");
    if (target.hostname !== "keeptxred.com" && target.hostname !== "www.keeptxred.com") return true;
    return !isRetiredElectionCentralPath(target.pathname, enabled);
  } catch {
    return false;
  }
}

export function availableElectionReferences<T extends { href: string }>(links: readonly T[], enabled = ELECTION_FEATURE_FLAGS.homepagePromotion): T[] {
  return links.filter((link) => isAvailableElectionReference(link.href, enabled));
}
