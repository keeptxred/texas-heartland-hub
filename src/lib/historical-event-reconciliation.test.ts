import { describe, expect, it } from "vitest";
import {
  historicalArticleOwnershipCompatible,
  historicalEventIdentityCompatible,
  planHistoricalReconciliation,
  type HistoricalFeedItem,
} from "./historical-event-reconciliation";

function row(overrides: Partial<HistoricalFeedItem> & Pick<HistoricalFeedItem, "id" | "title" | "link" | "source">): HistoricalFeedItem {
  return {
    description: "Texas officials announced a new grid rule for large data centers after ERCOT review.",
    pub_date: "2026-08-10T12:00:00Z",
    created_at: "2026-08-10T12:05:00Z",
    internal_slug: null,
    event_cluster_id: null,
    target_site: "keeptxred",
    ...overrides,
  };
}

describe("historical event reconciliation", () => {
  it("backfills a matched legacy event when all reports point to one canonical slug", () => {
    const rows = [
      row({ id: 1, title: "ERCOT announces new rule for Texas data center grid connections", link: "https://ercot.com/rule", source: "ERCOT", internal_slug: "ercot-data-center-grid-rule" }),
      row({ id: 2, title: "Texas data centers face new ERCOT grid connection rule", link: "https://example.com/ercot-rule", source: "Texas Daily" }),
    ];
    const plans = planHistoricalReconciliation(rows);
    expect(plans).toHaveLength(1);
    expect(plans[0].kind).toBe("safe");
    expect(plans[0].canonicalSlug).toBe("ercot-data-center-grid-rule");
    expect(plans[0].publishedSlugs).toEqual(["ercot-data-center-grid-rule"]);
    expect(plans[0].sourceFamilies).toHaveLength(2);
  });

  it("holds an event when matched reports already point to different published URLs", () => {
    const rows = [
      row({ id: 10, title: "ERCOT announces new rule for Texas data center grid connections", link: "https://ercot.com/rule", source: "ERCOT", internal_slug: "ercot-grid-rule" }),
      row({ id: 11, title: "Texas data centers face new ERCOT grid connection rule", link: "https://example.com/ercot-rule", source: "Texas Daily", internal_slug: "texas-data-center-rule" }),
    ];
    const plans = planHistoricalReconciliation(rows);
    expect(plans).toHaveLength(1);
    expect(plans[0].kind).toBe("hold");
    expect(plans[0].canonicalSlug).toBeNull();
    expect(plans[0].publishedSlugs).toEqual(["ercot-grid-rule", "texas-data-center-rule"]);
  });

  it("rejects the live Whitmire false positive where only person/city/office overlap", () => {
    const mayor = row({
      id: 6111,
      title: "As John Whitmire turns 77, the ‘spry’ and ‘vigorous’ Houston mayor wants to stay in office into his 80s",
      link: "https://www.houstonpublicmedia.org/articles/news/city-of-houston/2026/08/13/559448/houston-mayor-john-whitmire-birthday-age-politics/",
      source: "Houston Public Media",
      internal_slug: "2026-08-13-houston-mayor-john-whitmire-77-seeks-second-term-as-age-sparks-political-debate",
      description: "After 50 years in the Texas Legislature and nearly three at City Hall, Whitmire says he will seek a second term as mayor.",
      pub_date: "2026-08-13T20:42:58Z",
    });
    const tickets = row({
      id: 19631,
      title: "Houston Dynamo and Dash partner with Mayor John Whitmire to provide 10,000 free tickets to 2026 matches for Houstonians",
      link: "https://www.houstondynamofc.com/houstondash/news/houston-dynamo-and-dash-partner-with-mayor-john-whitmire-to-provide-10-000-free-tickets-to-2026-matches-for-houstonians",
      source: "Houston Dash",
      description: "Houston Dynamo and Dash partner with Mayor John Whitmire to provide 10,000 free tickets to 2026 matches for Houstonians.",
      pub_date: "2026-08-14T04:17:02Z",
    });

    expect(historicalEventIdentityCompatible(mayor, tickets)).toBe(false);
    expect(planHistoricalReconciliation([mayor, tickets])).toEqual([]);
  });

  it("rejects a different named award even when generic watch-list wording overlaps", () => {
    const rayGuy = row({
      id: 47270,
      title: "Chance Added to Ray Guy Award Preseason Watch List",
      link: "https://gofrogs.com/ray-guy",
      source: "TCU Athletics",
      internal_slug: "ray-guy-watch-list",
    });
    const hornung = row({
      id: 36592,
      title: "Tyre Named to Paul Hornung Award Preseason Watch List",
      link: "https://meangreensports.com/paul-hornung",
      source: "North Texas Athletics",
    });

    expect(historicalEventIdentityCompatible(rayGuy, hornung)).toBe(false);
    expect(planHistoricalReconciliation([rayGuy, hornung])).toEqual([]);
  });

  it("validates a slug-owning row against published editorial evidence", () => {
    const austin = row({
      id: 88556,
      title: "Two Austin ISD schools receive fifth consecutive F accountability rating",
      link: "https://news.google.com/austin-isd",
      source: "KXAN Austin",
      internal_slug: "austin-isd-future",
      description: "Two Austin ISD schools received fifth consecutive F ratings and face potential state intervention.",
    });
    const badDataCenter = row({
      id: 41817,
      title: "Governor Abbott Announces Amazon, Lancium And Cipher Digital Commit To Comply With His Data Center Standards",
      link: "https://gov.texas.gov/data-centers",
      source: "Office of the Governor",
      internal_slug: "texas-airports-review",
    });

    expect(historicalArticleOwnershipCompatible(austin, {
      title: "Austin ISD's Future Hangs in the Balance",
      bodyText: "Austin ISD schools received fifth consecutive F ratings, triggering potential Texas Education Agency intervention and a state takeover.",
    })).toBe(true);

    expect(historicalArticleOwnershipCompatible(badDataCenter, {
      title: "Texas Airports Face Review Over Religious Facilities",
      bodyText: "Texas airports face a review of state grants over alleged religious discrimination and airport ablution facilities.",
    })).toBe(false);
  });

  it("never steals rows already owned by the modern event cluster system", () => {
    const rows = [
      row({ id: 20, title: "ERCOT announces new rule for Texas data center grid connections", link: "https://ercot.com/rule", source: "ERCOT", internal_slug: "ercot-grid-rule", event_cluster_id: "modern-cluster" }),
      row({ id: 21, title: "Texas data centers face new ERCOT grid connection rule", link: "https://example.com/ercot-rule", source: "Texas Daily" }),
    ];
    expect(planHistoricalReconciliation(rows)).toEqual([]);
  });

  it("does not reconcile weak or unrelated historical matches", () => {
    const rows = [
      row({ id: 30, title: "Houston council approves park renovation", link: "https://city.gov/park", source: "City of Houston", internal_slug: "houston-park-renovation", description: "Houston City Council approved a neighborhood park renovation project." }),
      row({ id: 31, title: "Dallas school district announces calendar", link: "https://district.edu/calendar", source: "Dallas ISD", description: "Dallas ISD announced its school calendar for the coming year." }),
    ];
    expect(planHistoricalReconciliation(rows)).toEqual([]);
  });

  it("does not treat same-lineage copies as independent historical support", () => {
    const rows = [
      row({ id: 35, title: "ERCOT announces new rule for Texas data center grid connections", link: "https://example.com/original", source: "Texas Daily", internal_slug: "ercot-grid-rule" }),
      row({ id: 36, title: "Texas data centers face new ERCOT grid connection rule", link: "https://example.com/copy", source: "Texas Daily" }),
    ];
    expect(planHistoricalReconciliation(rows)).toEqual([]);
  });

  it("ignores non-KeepTXRed target rows", () => {
    const rows = [
      row({ id: 40, title: "ERCOT announces new rule for Texas data center grid connections", link: "https://ercot.com/rule", source: "ERCOT", internal_slug: "ercot-grid-rule" }),
      row({ id: 41, title: "Texas data centers face new ERCOT grid connection rule", link: "https://example.com/ercot-rule", source: "Texas Daily", target_site: "texasdefined" }),
    ];
    expect(planHistoricalReconciliation(rows)).toEqual([]);
  });
});
