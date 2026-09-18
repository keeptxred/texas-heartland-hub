export type KtrAffiliateMarket = "Dallas" | "Houston" | "San Antonio";

export type KtrAffiliatePlacement =
  | { kind: "school-supplies"; placementId: string }
  | { kind: "sports-travel"; placementId: string; market: KtrAffiliateMarket }
  | { kind: "homeowner-resources"; placementId: string }
  | { kind: "energy-resources"; placementId: string };

export type KtrAffiliatePlacementInput = {
  pathname: string;
  title?: string | null;
  dek?: string | null;
  category?: string | null;
};

const SCHOOL_SUPPLY_PATHS = new Set([
  "/news/2026-08-20-lt-gov-dan-patrick-proposes-penalties-for-schools-that-keep-vulgar-books-on-libr",
  "/news/2026-08-20-texas-families-ask-supreme-court-to-review-state-law-requiring-ten-commandments-",
  "/news/2026-08-20-gov-abbott-proposes-ban-on-h-1b-visa-use-for-texas-public-schools",
]);

const AUTOMATED_MONETIZATION_BLOCKED_CATEGORIES = /^(elections?|politics|legislature|laws?)$/i;
const HOMEOWNER_SIGNAL =
  /\b(property taxes?|homestead(?: exemption)?|appraisal district|property appraisal|home insurance|homeowner(?:ship)?|housing market|mortgage|property value)\b/i;
const ENERGY_SIGNAL =
  /\b(ercot|electricity|electric rates?|electric bill|utility bill|power bill|power grid|energy provider|energy prices?|electricity plan|power plan)\b/i;
const SPORTS_EVENT_SIGNAL =
  /\b(game|home opener|stadium|arena|ballpark|concert|festival|rodeo|event|match|series|playoffs?|tournament|race|weekend)\b/i;

const MARKET_SIGNALS: ReadonlyArray<[KtrAffiliateMarket, RegExp]> = [
  [
    "Dallas",
    /\b(dallas|fort worth|arlington|dfw|cowboys|texas rangers|mavericks|dallas stars|at&t stadium|globe life field|american airlines center)\b/i,
  ],
  [
    "Houston",
    /\b(houston|astros|texans|rockets|dynamo|nrg stadium|toyota center|shell energy stadium)\b/i,
  ],
  [
    "San Antonio",
    /\b(san antonio|spurs|alamodome|frost bank center)\b/i,
  ],
];

function normalizePath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function marketForText(text: string): KtrAffiliateMarket | null {
  for (const [market, signal] of MARKET_SIGNALS) {
    if (signal.test(text)) return market;
  }
  return null;
}

export function getKtrAffiliatePlacement(
  value: string | KtrAffiliatePlacementInput,
): KtrAffiliatePlacement | null {
  const input: KtrAffiliatePlacementInput =
    typeof value === "string" ? { pathname: value } : value;
  const pathname = normalizePath(input.pathname);

  if (SCHOOL_SUPPLY_PATHS.has(pathname)) {
    return {
      kind: "school-supplies",
      placementId: "ktr-school-story-resource",
    };
  }

  if (!pathname.startsWith("/news/")) return null;

  const category = String(input.category ?? "").trim();
  if (AUTOMATED_MONETIZATION_BLOCKED_CATEGORIES.test(category)) return null;

  const text = `${input.title ?? ""} ${input.dek ?? ""}`.trim();

  if (HOMEOWNER_SIGNAL.test(text)) {
    return {
      kind: "homeowner-resources",
      placementId: "ktr-homeowner-story-resource",
    };
  }

  if (ENERGY_SIGNAL.test(text)) {
    return {
      kind: "energy-resources",
      placementId: "ktr-energy-story-resource",
    };
  }

  if (/^(sports|non-political)$/i.test(category) && SPORTS_EVENT_SIGNAL.test(text)) {
    const market = marketForText(text);
    if (market) {
      return {
        kind: "sports-travel",
        placementId: "ktr-sports-event-travel",
        market,
      };
    }
  }

  return null;
}
