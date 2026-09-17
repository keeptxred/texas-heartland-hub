import { describe, expect, it } from "vitest";
import { getKtrAffiliatePlacement } from "./affiliate-placements";

describe("KTR contextual affiliate placement guard", () => {
  it("enables school-supply offers only on the approved school-story cohort", () => {
    expect(
      getKtrAffiliatePlacement(
        "/news/2026-08-20-gov-abbott-proposes-ban-on-h-1b-visa-use-for-texas-public-schools",
      ),
    ).toEqual({ kind: "school-supplies", placementId: "ktr-school-story-resource" });

    expect(
      getKtrAffiliatePlacement(
        "/news/2026-08-20-lt-gov-dan-patrick-proposes-penalties-for-schools-that-keep-vulgar-books-on-libr/",
      ),
    ).toEqual({ kind: "school-supplies", placementId: "ktr-school-story-resource" });
  });

  it("does not monetize election, candidate, or unrelated news pages", () => {
    expect(getKtrAffiliatePlacement("/elections/candidates/ken-paxton")).toBeNull();
    expect(getKtrAffiliatePlacement("/elections/races/texas-2026-us-senate-2026")).toBeNull();
    expect(getKtrAffiliatePlacement("/news/texas-policing-agencies-compared")).toBeNull();
    expect(getKtrAffiliatePlacement("/")).toBeNull();
  });
});
