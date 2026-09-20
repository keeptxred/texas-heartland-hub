import { describe, expect, it } from "vitest";
import { getKtrAffiliatePlacement } from "./affiliate-placements";

describe("KTR contextual affiliate placement guard", () => {
  it("keeps the approved school-supply cohort explicit", () => {
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

  it("routes high-intent homeowner stories to the TexasDefined planning funnel", () => {
    expect(
      getKtrAffiliatePlacement({
        pathname: "/news/texas-property-tax-appraisal-changes",
        title: "Texas Property Tax Appraisal Changes Hit Homeowners",
        dek: "Homestead exemptions and appraisal values shape household costs.",
        category: "Tax & Spending",
      }),
    ).toEqual({ kind: "homeowner-resources", placementId: "ktr-homeowner-story-resource" });
  });

  it("routes household energy stories to utility-cost tools", () => {
    expect(
      getKtrAffiliatePlacement({
        pathname: "/news/texas-electricity-rates-rise",
        title: "Texas Electricity Rates Rise as Summer Demand Climbs",
        dek: "Households are watching electric bills and ERCOT demand.",
        category: "Energy",
      }),
    ).toEqual({ kind: "energy-resources", placementId: "ktr-energy-story-resource" });
  });

  it("routes Dallas, Houston and San Antonio sports-event stories to approved travel partners", () => {
    expect(
      getKtrAffiliatePlacement({
        pathname: "/news/cowboys-home-opener-arlington",
        title: "Cowboys Home Opener Brings Weekend Crowds to Arlington",
        dek: "AT&T Stadium hosts the game Saturday.",
        category: "Sports",
      }),
    ).toEqual({ kind: "sports-travel", placementId: "ktr-sports-event-travel", market: "Dallas" });

    expect(
      getKtrAffiliatePlacement({
        pathname: "/news/astros-weekend-series-houston",
        title: "Astros Weekend Series Brings Fans to Houston",
        dek: "The three-game series starts Friday.",
        category: "Sports",
      }),
    ).toEqual({ kind: "sports-travel", placementId: "ktr-sports-event-travel", market: "Houston" });

    expect(
      getKtrAffiliatePlacement({
        pathname: "/news/spurs-game-san-antonio",
        title: "Spurs Return to San Antonio for Saturday Game",
        dek: "Fans head to Frost Bank Center this weekend.",
        category: "Sports",
      }),
    ).toEqual({ kind: "sports-travel", placementId: "ktr-sports-event-travel", market: "San Antonio" });
  });

  it("monetizes a real San Antonio festival story without requiring a team signal", () => {
    expect(
      getKtrAffiliatePlacement({
        pathname: "/news/2026-08-09-san-antonio-frida-fest-record",
        title: "San Antonio’s Frida Fest Wants a World Record Sea of Flower Crowns and Unibrows",
        dek: "The 10th annual festival is inviting Texans to dress as Frida Kahlo for a Guinness World Record attempt.",
        category: "Non-Political",
      }),
    ).toEqual({ kind: "sports-travel", placementId: "ktr-sports-event-travel", market: "San Antonio" });
  });

  it("does not treat a casual pickup game as travel-booking intent", () => {
    expect(
      getKtrAffiliatePlacement({
        pathname: "/news/2026-08-08-victor-wembanyama-soccer-katy",
        title: "Victor Wembanyama Surprises Katy Soccer Players With a Casual Pickup Game",
        dek: "Videos of the Spurs star joining a local soccer game spread quickly online.",
        category: "Sports",
      }),
    ).toBeNull();
  });

  it("does not turn ordinary team news into travel intent", () => {
    expect(
      getKtrAffiliatePlacement({
        pathname: "/news/astros-trade-deadline-move",
        title: "Astros Complete Trade Ahead of Deadline",
        dek: "Houston adds a veteran pitcher for the stretch run.",
        category: "Sports",
      }),
    ).toBeNull();
  });

  it("keeps automated commercial placement off election, candidate and unrelated pages", () => {
    expect(
      getKtrAffiliatePlacement({
        pathname: "/news/candidate-property-tax-plan",
        title: "Candidate Discusses Property Tax Plan",
        dek: "The proposal was outlined during the campaign.",
        category: "Elections",
      }),
    ).toBeNull();
    expect(getKtrAffiliatePlacement("/elections/candidates/example")).toBeNull();
    expect(getKtrAffiliatePlacement("/news/texas-policing-agencies-compared")).toBeNull();
    expect(getKtrAffiliatePlacement("/")).toBeNull();
  });
});
