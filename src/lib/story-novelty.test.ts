import { describe, expect, it } from "vitest";
import { assessStoryNovelty } from "./story-novelty";

describe("developing story novelty", () => {
  it("treats another outlet confirming the same facts as confirmation", () => {
    const result = assessStoryNovelty(
      {
        title: "San Antonio weighs data center moratorium",
        description: "City leaders are considering a moratorium while ERCOT studies large-load demand.",
        extracted_body: null,
      },
      "San Antonio city leaders are considering a data center moratorium while ERCOT studies large-load power demand.",
    );
    expect(result.material).toBe(false);
    expect(result.score).toBeLessThan(48);
  });

  it("detects a material follow-up when a decision and new figure arrive", () => {
    const result = assessStoryNovelty(
      {
        title: "San Antonio approves six-month data center moratorium",
        description: "Council approved the pause after officials said projected demand could rise by 2,400 MW.",
        extracted_body: null,
      },
      "San Antonio leaders were considering a data center moratorium while ERCOT reviewed expected power demand.",
    );
    expect(result.material).toBe(true);
    expect(result.newActions).toContain("approved");
    expect(result.newNumbers.some((value) => value.includes("2,400"))).toBe(true);
  });

  it("detects multiple substantive actions even without a new number", () => {
    const result = assessStoryNovelty(
      {
        title: "Agency files case and judge issues ruling",
        description: "The agency filed the case and a judge ruled on the request the same day.",
        extracted_body: null,
      },
      "Officials said a legal dispute was possible but no case had been filed.",
    );
    expect(result.material).toBe(true);
    expect(result.newActions).toContain("filed");
    expect(result.newActions).toContain("ruled");
  });

  it("tracks a newly reported calendar date", () => {
    const result = assessStoryNovelty(
      {
        title: "Agency sets September 1 deadline",
        description: "The agency announced that applications are due September 1.",
        extracted_body: null,
      },
      "The agency said a filing deadline would be announced later.",
    );
    expect(result.newDates).toContain("september 1");
  });

  it("recognizes a new primary record carrying a substantive update", () => {
    const result = assessStoryNovelty(
      {
        title: "Texas Secretary of State announces September 1 filing deadline",
        description: "The office announced the September 1 filing deadline in an official notice.",
        extracted_body: null,
        source: "Texas Secretary of State",
        link: "https://www.sos.state.tx.us/elections/notice.shtml",
      },
      "Campaign officials had expected a filing deadline but no official notice had been released.",
    );
    expect(result.hasNewPrimaryDocument).toBe(true);
    expect(result.newActions).toContain("announced");
    expect(result.newDates).toContain("september 1");
    expect(result.material).toBe(true);
  });
});
