import { describe, expect, it } from "vitest";
import { requiresSensitiveNewsroomReview } from "./newsroom-sensitive-story-review";

describe("pre-publication sensitivity review", () => {
  it.each([
    "FBI raids Midlothian oil and gas business facing multiple fraud lawsuits: sources",
    "Harris County sheriff deputy arrested during Lone Star Rally in Galveston County",
    "Authorities investigate alleged investor fraud claims in Texas",
    "Judge hears civil lawsuit over utility contract",
    "Police suspect accused after murder investigation",
    "Federal agents searched three homes",
  ])("holds potentially defamatory or active-investigation reporting before auto-publish: %s", (title) => {
    expect(requiresSensitiveNewsroomReview({ title })).toBe(true);
  });

  it.each([
    "McKinney National Airport prepares for first commercial passenger flights",
    "Credit Union of Texas gives away turkeys and hams in Kilgore",
    "SpaceX sets target date for 15th Starship launch at Starbase",
    "What should Buda's giant wiener dog be named?",
    "Holly Hop Ice Cream Shoppe closing after 18 years",
  ])("does not impose criminal-allegation hold on benign visitor and community stories: %s", (title) => {
    expect(requiresSensitiveNewsroomReview({ title })).toBe(false);
  });

  it("detects material allegations disclosed only in the description", () => {
    expect(requiresSensitiveNewsroomReview({
      title: "Midlothian energy company offices searched",
      description: "The company faces investor fraud lawsuits, but no criminal charges were announced.",
    })).toBe(true);
  });

  it("does not invent a sensitive case from an empty feed record", () => {
    expect(requiresSensitiveNewsroomReview({})).toBe(false);
  });
});
