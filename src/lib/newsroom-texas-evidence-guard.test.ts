import { describe, expect, it } from "vitest";
import { buildResearchPacket } from "./newsroom-research-packet";
import { newsroomPacketHasTexasIncidentEvidence, sourceDescriptionMatchesHeadline } from "./newsroom-texas-evidence-guard";

const packet = (subject: string, title: string, extractedBody: string, url: string, source = "KTRE Lufkin — Direct Local Headlines") =>
  buildResearchPacket({
    clusterId: "guard-regression-cluster",
    subject,
    pillar: "texas-law-enforcement-public-safety",
    recommendedFormat: "MERGE",
    editorialScore: 95,
    sources: [{
      feedItemId: 10, title, source, url, publishedAt: "2026-11-09",
      description: "", extractedBody, sourceReputationScore: 90,
      isPrimarySource: true,
    }],
  });

describe("prevent unrelated national syndication from becoming Texas hard news", () => {
  it("rejects actual observed British court story despite 3 local Texas news sources", () => {
    const p = packet(
      "russell brand has been sentenced 10 1 2 years british prison rape sexual assault",
      "Russell Brand sentenced to 10 1/2 years in a British prison",
      "Share Add Us On Google LONDON (AP) — A British judge sentenced the comedian after a trial in London.",
      "https://www.kltv.com/2026/11/09/russell-brand-faces-sentencing-significant-prison-term-rape-sexual-assaults/",
      "KLTV Tyler — Direct Local Headlines",
    );
    expect(newsroomPacketHasTexasIncidentEvidence(p)).toBe(false);
  });

  it("accepts specific Texas public-safety news with a meaningful Texas location in the event", () => {
    const p = packet(
      "odessa hotel stairwell shooting suspect investigation",
      "Odessa hotel stairwell shooting under police investigation",
      "Odessa police confirmed investigators found a victim at the MCM Grande property.",
      "https://www.firstalert7.com/2026/11/08/warrant-issued-man-mcm-grande-hotel-stairwell-shooting/",
      "First Alert 7 — Permian Basin Local",
    );
    expect(newsroomPacketHasTexasIncidentEvidence(p)).toBe(true);
  });

  it("accepts the Texas Legislature's official bill despite a short SB-number headline", () => {
    const p = packet(
      "sb 49 introduced",
      "SB 49 Introduced",
      "90th Legislature regular session introduced version of SB 49.",
      "https://capitol.texas.gov/tlodocs/90R/billtext/html/SB00049I.htm",
      "Texas Legislature Online",
    );
    expect(newsroomPacketHasTexasIncidentEvidence(p)).toBe(true);
  });

  it("does not inherit unrelated Dallas location from corrupted RSS synopsis", () => {
    const title = "Russell Brand sentenced to 10 1/2 years in prison for rape and sexual assault";
    const wrong = "A major crash has shut down a High Five interchange ramp in North Dallas.";
    expect(sourceDescriptionMatchesHeadline(title, wrong)).toBe(false);
    expect(sourceDescriptionMatchesHeadline(title,
      "Russell Brand sentenced by a London judge to more than 10 years after his criminal trial.")).toBe(true);
  });

  it("does not quarantine unrelated Texas election or sports context under other pillars", () => {
    const p = packet("Texas Tech football result", "Texas Tech wins football game",
      "The team played in Lubbock.", "https://example.com/sport");
    expect(newsroomPacketHasTexasIncidentEvidence({...p, pillar:"texas-sports"})).toBe(true);
  });
});
