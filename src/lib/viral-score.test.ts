import { describe, expect, it } from "vitest";
import { classifySourceReputation, scoreFeedItem } from "@/lib/viral-score";

const fresh = () => new Date().toISOString();

const cases = [
  {
    title: "Abbott activates Panhandle wildfire resources",
    source: "Office of the Governor",
    description: "Texas Division of Emergency Management and Texas A&M Forest Service resources were activated for Panhandle fire danger.",
  },
  {
    title: "Professors sue A&M over teaching limits",
    source: "Texas A&M University",
    description: "Four professors filed a First Amendment lawsuit challenging Texas A&M System teaching restrictions.",
  },
  {
    title: "Houston Methodist tops Texas hospital rankings",
    source: "Houston Methodist",
    description: "Houston Methodist Hospital ranked first in Texas, with UT Southwestern and Baylor University Medical Center also recognized.",
  },
  {
    title: "Tarrant County considers reduction in Election Day polling locations",
    source: "Tarrant County",
    description: "County commissioners discussed cutting voting sites in Fort Worth from 316 to 176.",
  },
  {
    title: "Mothers sue Texas school districts over Ten Commandments posters",
    source: "Houston Chronicle",
    description: "A Harris County court will hear a religious-freedom challenge involving three Texas school districts.",
  },
  {
    title: "Texas awards healthcare workforce training grant",
    source: "Texas Workforce Commission",
    description: "A Skills Development Fund grant will train healthcare workers at rural Texas hospitals in the Permian Basin.",
  },
  {
    title: "Texas is top Gen Z moving destination",
    source: "U-Haul",
    description: "A migration report found Dallas-Fort Worth, Houston, Austin and Brownsville-McAllen among leading destinations.",
  },
  {
    title: "Perot Museum plans $90 million expansion",
    source: "Texas Department of Licensing and Regulation",
    description: "Dallas filings describe a parking structure, entrance, walkway and event space for the Perot Museum.",
  },
  {
    title: "Whataburger marks 76th birthday with Texas deals",
    source: "Whataburger",
    description: "The San Antonio-founded restaurant announced August app deals and National Whataburger Day offers.",
  },
];

describe("Texas statewide coverage scoring", () => {
  it.each(cases)("keeps $title eligible for a native article", (item) => {
    const result = scoreFeedItem({ ...item, pub_date: fresh() });
    expect(result.texasRelevanceScore).toBeGreaterThanOrEqual(50);
    expect(result.routingType).toBe("SEO_ARTICLE");
  });

  it("does not reject a relevant story merely because it is non-political", () => {
    const result = scoreFeedItem({
      title: "Houston Methodist tops Texas hospital rankings",
      source: "Houston Methodist",
      description: "U.S. News evaluated hospitals across Texas.",
      pub_date: fresh(),
    });
    expect(result.signals.category).toBe("Non-Political");
    expect(result.routingType).toBe("SEO_ARTICLE");
  });

  it("recognizes institutional and statewide discovery sources", () => {
    expect(classifySourceReputation("Texas A&M University").score).toBeGreaterThanOrEqual(85);
    expect(classifySourceReputation("Houston Methodist").score).toBeGreaterThanOrEqual(85);
    expect(classifySourceReputation("Texas Workforce Commission").score).toBeGreaterThanOrEqual(85);
  });
});
