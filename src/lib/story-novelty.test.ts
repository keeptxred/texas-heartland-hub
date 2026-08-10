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
});
