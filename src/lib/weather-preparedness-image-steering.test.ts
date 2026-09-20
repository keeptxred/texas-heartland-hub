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

  it("uses an object-only multi-hazard preparedness inventory", () => {
    const prompt = buildImagePrompt(preparednessSubject);
    expect(prompt).toContain("OBJECT-ONLY TEXAS PREPAREDNESS DOCUMENTARY PHOTOGRAPH");
    expect(prompt).toContain("ZERO PEOPLE IN FRAME");
    expect(prompt).toContain("battery-powered fan");
    expect(prompt).toContain("outdoor faucet covers or pipe insulation");
    expect(prompt).toContain("N95 masks");
    expect(prompt).toContain("waterproof document pouch");
    expect(prompt).toContain("medication organizer");
    expect(prompt).toContain("pet carrier or leash");
    expect(prompt).not.toContain("Anonymous household members may organize");
    expect(prompt).not.toContain("Depict the actual weather event affecting a recognizable Texas landscape");
  });

  it("prioritizes people and failed disaster motifs in the compact negative prompt", () => {
    const negative = buildNegativeImagePrompt(preparednessSubject);
    expect(negative.startsWith("people, person, family, adults, children, faces, hands, human figures, silhouettes")).toBe(true);
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
    expect(prompt).not.toContain("OBJECT-ONLY TEXAS PREPAREDNESS DOCUMENTARY PHOTOGRAPH");
  });
});
