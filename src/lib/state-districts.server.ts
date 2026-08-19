import { TEXAS_LEGISLATIVE_SEATS } from "@/data/texas-legislators.generated";
import { canonicalBillPath, getRepresentativeLegislation } from "@/lib/bills";
import {
  STATE_DISTRICT_PLANS,
  stateDistrictSlug,
  type StateDistrictDetail,
  type StateDistrictSummary,
} from "@/lib/state-districts";

const FALLBACK_REVIEWED_AT = "2026-07-31";

export async function loadStateDistrictDirectory(): Promise<StateDistrictSummary[]> {
  return TEXAS_LEGISLATIVE_SEATS
    .map((seat) => ({
      slug: stateDistrictSlug(seat.chamber, seat.district),
      chamber: seat.chamber,
      district: seat.district,
      title: `${STATE_DISTRICT_PLANS[seat.chamber].chamberLabel} District ${seat.district}`,
      currentMember: seat.name,
      currentMemberSlug: seat.name ? seat.slug : null,
      party: seat.party,
      vacant: seat.vacant,
      reviewedAt: seat.authority?.reviewedAt ?? FALLBACK_REVIEWED_AT,
    }))
    .sort((a, b) => a.chamber.localeCompare(b.chamber) || a.district - b.district);
}

export async function loadStateDistrictDetail(slug: string): Promise<StateDistrictDetail | null> {
  const seat = TEXAS_LEGISLATIVE_SEATS.find(
    (candidate) => stateDistrictSlug(candidate.chamber, candidate.district) === slug,
  );
  if (!seat) return null;

  const plan = STATE_DISTRICT_PLANS[seat.chamber];
  const authority = seat.authority;
  let bills: StateDistrictDetail["bills"] = [];
  if (seat.name && seat.slug) {
    try {
      const legislation = await getRepresentativeLegislation(seat.slug);
      bills = legislation.bills.slice(0, 8).map((bill) => ({
        id: String(bill.id),
        identifier: bill.bill_identifier,
        caption: bill.caption ?? bill.bill_identifier,
        status: bill.current_status_label ?? null,
        path: canonicalBillPath(bill),
      }));
    } catch (error) {
      console.error(`state district legislation lookup failed for ${seat.slug}`, error);
    }
  }

  return {
    slug,
    chamber: seat.chamber,
    district: seat.district,
    title: `${plan.chamberLabel} District ${seat.district}`,
    currentMember: seat.name,
    currentMemberSlug: seat.name ? seat.slug : null,
    party: seat.party,
    vacant: seat.vacant,
    reviewedAt: authority?.reviewedAt ?? FALLBACK_REVIEWED_AT,
    planId: plan.planId,
    planEffective: plan.planEffective,
    ideal2020Population: plan.ideal2020Population,
    memberWebsite: seat.website || null,
    memberImageUrl: seat.imageUrl,
    memberPhone: seat.phone,
    capitolAddress: seat.capitolAddress,
    districtAddress: seat.districtAddress,
    biography: authority?.biography ?? null,
    districtOverview:
      authority?.districtOverview ??
      `${plan.chamberLabel} District ${seat.district}. Address-level representation and current boundaries should be verified through the Texas Legislature's official Who Represents Me service.`,
    committees: authority?.committees ?? [],
    electionHistory: authority?.electionHistory ?? [],
    financeUrl: authority?.financeUrl ?? null,
    financeLabel: authority?.financeLabel ?? null,
    sources: authority?.sources ?? [],
    bills,
  };
}
