import { describe, expect, it } from "vitest";
import { classifySourceReputation, scoreFeedItem } from "@/lib/viral-score";

const fresh = () => new Date().toISOString();

const keepTxRedCases = [
  {
    title: "Abbott activates Panhandle wildfire resources",
    source: "Office of the Governor",
    description: "Texas Division of Emergency Management and Texas A&M Forest Service resources were activated for Panhandle fire danger.",
  },
  {
    title: "Professors sue A&M over teaching limits",
    source: "Texas Universities — Google News",
    description: "Four professors filed a First Amendment lawsuit challenging Texas A&M System teaching restrictions.",
  },
  {
    title: "Tarrant County considers reduction in Election Day polling locations",
    source: "Texas Local Government — Google News",
    description: "County commissioners discussed cutting voting sites in Fort Worth from 316 to 176.",
  },
  {
    title: "Mothers sue Texas school districts over Ten Commandments posters",
    source: "Texas Courts and Civil Rights — Google News",
    description: "A Harris County court will hear a religious-freedom challenge involving three Texas school districts.",
  },
  {
    title: "Texas awards healthcare workforce training grant",
    source: "Texas Business and Workforce — Google News",
    description: "A Skills Development Fund grant will train healthcare workers at rural Texas hospitals in the Permian Basin.",
  },
];

const texasDefinedCases = [
  {
    title: "Houston Methodist tops Texas hospital rankings",
    source: "Texas Hospitals and Health — Google News",
    description: "Houston Methodist Hospital ranked first in Texas, with UT Southwestern and Baylor University Medical Center also recognized.",
  },
  {
    title: "Texas is top Gen Z moving destination",
    source: "Moving to Texas and Demographics — Google News",
    description: "A migration report found Dallas-Fort Worth, Houston, Austin and Brownsville-McAllen among leading destinations.",
  },
  {
    title: "Perot Museum plans $90 million expansion",
    source: "Texas Culture and Attractions — Google News",
    description: "Dallas filings describe a parking structure, entrance, walkway and event space for the Perot Museum.",
  },
  {
    title: "Whataburger marks 76th birthday with Texas deals",
    source: "Texas Culture and Attractions — Google News",
    description: "The San Antonio-founded restaurant announced August app deals and National Whataburger Day offers.",
  },
];

describe("Texas statewide coverage scoring", () => {
  it.each(keepTxRedCases)("keeps $title eligible for a native KeepTXRed article", (item) => {
    const result = scoreFeedItem({ ...item, pub_date: fresh() });
    expect(result.texasRelevanceScore).toBeGreaterThanOrEqual(50);
    expect(result.sourceReputationScore).toBeGreaterThanOrEqual(55);
    expect(result.routingType).toBe("SEO_ARTICLE");
  });

  it.each(texasDefinedCases)("routes $title away from KeepTXRed native publishing", (item) => {
    const result = scoreFeedItem({ ...item, pub_date: fresh() });
    expect(result.texasRelevanceScore).toBe(0);
    expect(result.sourceReputationScore).toBe(0);
    expect(result.editorialValueScore).toBe(0);
    expect(result.routingType).toBe("FACEBOOK_ONLY");
  });

  it("keeps nonpartisan public-affairs stories eligible", () => {
    const result = scoreFeedItem({
      title: "Texas awards healthcare workforce training grant",
      source: "Texas Workforce Commission",
      description: "A statewide Skills Development Fund grant will train healthcare workers at rural Texas hospitals.",
      pub_date: fresh(),
    });
    expect(result.texasRelevanceScore).toBeGreaterThanOrEqual(50);
    expect(result.routingType).toBe("SEO_ARTICLE");
  });

  it("recognizes configured KeepTXRed discovery feeds", () => {
    expect(classifySourceReputation("Texas Universities — Google News").score).toBeGreaterThanOrEqual(55);
    expect(classifySourceReputation("Texas Local Government — Google News").score).toBeGreaterThanOrEqual(55);
    expect(classifySourceReputation("Texas Courts and Civil Rights — Google News").score).toBeGreaterThanOrEqual(55);
  });

  it("recognizes direct institutional and local-government sources", () => {
    expect(classifySourceReputation("Texas A&M University").score).toBeGreaterThanOrEqual(85);
    expect(classifySourceReputation("Houston Methodist").score).toBeGreaterThanOrEqual(85);
    expect(classifySourceReputation("Tarrant County").score).toBeGreaterThanOrEqual(55);
    expect(classifySourceReputation("Lampasas ISD").score).toBeGreaterThanOrEqual(55);
  });

  it("does not promote an unrelated national hospital story", () => {
    const result = scoreFeedItem({
      title: "Regional hospital receives national quality award",
      source: "Unknown News Network",
      description: "The hospital serves residents in another state and has no Texas connection.",
      pub_date: fresh(),
    });
    expect(result.texasRelevanceScore).toBeLessThan(50);
    expect(result.routingType).toBe("FACEBOOK_ONLY");
  });

  it("does not treat a generic county source as Texas without Texas context", () => {
    const result = scoreFeedItem({
      title: "County commissioners approve routine meeting minutes",
      source: "Washington County",
      description: "Commissioners approved minutes and adjourned the meeting.",
      pub_date: fresh(),
    });
    expect(result.texasRelevanceScore).toBeLessThan(50);
    expect(result.routingType).not.toBe("SEO_ARTICLE");
  });
});