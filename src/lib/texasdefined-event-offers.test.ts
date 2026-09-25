import { describe, expect, it } from "vitest";
import {
  TEXASDEFINED_EVENT_OFFER_SEED,
  buildTexasDefinedOfferDashboard,
  isTexasDefinedCommissionSafeOffer,
  searchTexasDefinedEventOffers,
} from "./texasdefined-event-offers";

describe("texasdefined event offers", () => {
  it("prioritizes commission-safe offers by default search filters", () => {
    const results = searchTexasDefinedEventOffers(TEXASDEFINED_EVENT_OFFER_SEED, {
      location: "Houston",
      commissionSafeOnly: true,
      limit: 10,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every(isTexasDefinedCommissionSafeOffer)).toBe(true);
  });

  it("keeps unknown Ticketmaster discount economics out of safe-only placements", () => {
    const safeResults = searchTexasDefinedEventOffers(TEXASDEFINED_EVENT_OFFER_SEED, {
      query: "Disney",
      commissionSafeOnly: true,
      limit: 10,
    });

    const reviewResults = searchTexasDefinedEventOffers(TEXASDEFINED_EVENT_OFFER_SEED, {
      query: "Disney",
      commissionSafeOnly: false,
      limit: 10,
    });

    expect(safeResults).toHaveLength(0);
    expect(reviewResults.some((offer) => offer.advertiser === "Ticketmaster" && offer.commissionStatus === "unknown")).toBe(true);
  });

  it("summarizes offers for the admin dashboard", () => {
    const summary = buildTexasDefinedOfferDashboard(TEXASDEFINED_EVENT_OFFER_SEED);

    expect(summary.totalOffers).toBe(TEXASDEFINED_EVENT_OFFER_SEED.length);
    expect(summary.commissionSafeOffers).toBeGreaterThan(0);
    expect(summary.needsReview).toBeGreaterThan(0);
    expect(summary.byNetwork.impact).toBeGreaterThan(0);
  });
});
