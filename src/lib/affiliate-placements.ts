export type KtrAffiliatePlacement = {
  kind: "school-supplies";
  placementId: string;
};

const SCHOOL_SUPPLY_PATHS = new Set([
  "/news/2026-08-20-lt-gov-dan-patrick-proposes-penalties-for-schools-that-keep-vulgar-books-on-libr",
  "/news/2026-08-20-texas-families-ask-supreme-court-to-review-state-law-requiring-ten-commandments-",
  "/news/2026-08-21-gov-abbott-proposes-ban-on-h-1b-visa-use-for-texas-public-schools",
]);

export function getKtrAffiliatePlacement(pathname: string): KtrAffiliatePlacement | null {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (!SCHOOL_SUPPLY_PATHS.has(normalized)) return null;

  return {
    kind: "school-supplies",
    placementId: "ktr-school-story-resource",
  };
}
