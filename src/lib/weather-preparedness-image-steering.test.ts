import { describe, expect, it } from "vitest";
import { buildImagePrompt, buildNegativeImagePrompt, inferArticleImageDomain } from "./featured-image-core";

describe("weather preparedness image steering", () => {
  const preparednessSubject = {
    title: "A Texas Household Emergency Plan That Works Year-Round",
    firstParagraph:
      "Texas households can face triple-digit heat, flash flooding, tornadoes, hurricanes, wildfire smoke, hard freezes, and power outages. Preparedness is about making ordinary decisions before stress removes time and options.",
    entities: ["Texas"],
    locations: ["statewide"],
    domain: "weather" as const,
    concreteSubject: "A Texas Household Emergency Plan That Works Year-Round",
  };

  it("keeps a multi-hazard preparedness guide in the weather domain", () => {
    expect(
      inferArticleImageDomain(
        "A Texas Household Emergency Plan That Works Year-Round. Preparedness checklist for hurricanes, tornadoes, floods, freezes, and heat.",
        preparednessSubject.firstParagraph,
      ),
    ).toBe("weather");
  });

  it("depicts concrete household planning instead of inventing one dramatic weather event", () => {
    const prompt = buildImagePrompt(preparednessSubject);
    expect(prompt).toContain("a believable Texas household actively preparing for multiple year-round hazards");
    expect(prompt).toContain("weather radio");
    expect(prompt).toContain("medication organizer");
    expect(prompt).toContain("packed evacuation bag");
    expect(prompt).toContain("do not invent one dramatic disaster as the main subject");
    expect(prompt).not.toContain("Depict the actual weather event affecting a recognizable Texas landscape");
  });

  it("rejects the generic disaster motif that failed production validation", () => {
    const negative = buildNegativeImagePrompt(preparednessSubject);
    expect(negative).toContain("family huddled in darkness");
    expect(negative).toContain("single dramatic storm");
    expect(negative).toContain("disaster movie scene");
  });

  it("does not change ordinary single-event weather-news steering", () => {
    const stormSubject = {
      title: "Hurricane approaches the Texas Gulf Coast",
      firstParagraph: "A hurricane is moving toward the Texas coast with heavy rain and storm surge expected.",
      entities: ["Texas Gulf Coast"],
      locations: ["Gulf Coast"],
      domain: "weather" as const,
      concreteSubject: "Hurricane approaching the Texas Gulf Coast",
    };
    const prompt = buildImagePrompt(stormSubject);
    expect(prompt).toContain("Depict the actual weather event affecting a recognizable Texas landscape");
    expect(prompt).not.toContain("household actively preparing for multiple year-round hazards");
  });
});
