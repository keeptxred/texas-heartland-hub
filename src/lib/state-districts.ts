export type StateDistrictChamber = "house" | "senate";

export type StateDistrictSummary = {
  slug: string;
  chamber: StateDistrictChamber;
  district: number;
  title: string;
  currentMember: string | null;
  currentMemberSlug: string | null;
  party: "R" | "D" | null;
  vacant: boolean;
  reviewedAt: string;
};

export type StateDistrictBill = {
  id: string;
  identifier: string;
  caption: string;
  status: string | null;
  path: string;
};

export type StateDistrictDetail = StateDistrictSummary & {
  planId: string;
  planEffective: string;
  ideal2020Population: number;
  memberWebsite: string | null;
  memberImageUrl: string | null;
  memberPhone: string | null;
  capitolAddress: string | null;
  districtAddress: string | null;
  biography: string | null;
  districtOverview: string;
  committees: string[];
  electionHistory: { year: string; result: string }[];
  financeUrl: string | null;
  financeLabel: string | null;
  sources: { label: string; url: string }[];
  bills: StateDistrictBill[];
};

export const STATE_DISTRICT_PLANS = {
  house: {
    chamberLabel: "Texas House",
    memberLabel: "State Representative",
    seats: 150,
    planId: "PLANH2316",
    planEffective: "January 2023",
    ideal2020Population: 194_303,
  },
  senate: {
    chamberLabel: "Texas Senate",
    memberLabel: "State Senator",
    seats: 31,
    planId: "PLANS2168",
    planEffective: "January 2023",
    ideal2020Population: 940_178,
  },
} as const;

export const STATE_DISTRICT_OFFICIAL_LINKS = {
  currentDistricts: "https://redistricting.capitol.texas.gov/Current-districts",
  whoRepresentsMe: "https://wrm.capitol.texas.gov/",
  legislature: "https://capitol.texas.gov/",
} as const;

export const TEXAS_SENATE_2026_ELECTION_DISTRICTS = new Set([1, 2, 3, 4, 5, 9, 11, 13, 18, 19, 21, 22, 24, 26, 28, 31]);

export function stateDistrictSlug(chamber: StateDistrictChamber, district: number) {
  return `texas-${chamber}-${district}`;
}

export function electionDistrictSlug(chamber: StateDistrictChamber, district: number) {
  return `texas-${chamber}-district-${district}`;
}

export function has2026ElectionDistrict(chamber: StateDistrictChamber, district: number) {
  return chamber === "house" || TEXAS_SENATE_2026_ELECTION_DISTRICTS.has(district);
}

export function partyLabel(party: "R" | "D" | null) {
  if (party === "R") return "Republican";
  if (party === "D") return "Democratic";
  return "Not published";
}
