import { describe, expect, it } from "vitest";
import { buildImagePrompt, buildNegativeImagePrompt, type SubjectExtract } from "./featured-image-core";

describe("sensitive news featured-image prompting", () => {
  it("steers violent roadway coverage to a non-graphic location photograph", () => {
    const subject: SubjectExtract = {
      title: "Deadly I-20 Road Rage Shooting in Fort Worth Leaves Woman Dead",
      firstParagraph: "A woman was shot and killed during a road rage incident on I-20 in Fort Worth.",
      entities: ["Fort Worth"],
      locations: ["Fort Worth"],
      domain: "transportation",
      concreteSubject: "A deadly road rage shooting on Interstate 20 in Fort Worth.",
    };

    const prompt = buildImagePrompt(subject);
    const negative = buildNegativeImagePrompt(subject);

    expect(prompt).toContain("NON-GRAPHIC REAL NEWS PHOTOGRAPH ONLY");
    expect(prompt).toContain("ZERO PEOPLE and ZERO VIOLENCE IN FRAME");
    expect(prompt).toContain("restrained local-news location photograph");
    expect(prompt).toContain("no victim, suspect, body, blood, injury, weapon, firearm, gun");
    expect(negative).toContain("gun");
    expect(negative).toContain("speech bubble");
    expect(negative).toContain("crime reconstruction");
  });

  it("steers data-center policy coverage to infrastructure without politicians", () => {
    const subject: SubjectExtract = {
      title: "Gov. Abbott orders pause on data center approvals",
      firstParagraph: "The governor ordered a pause on approvals while Texas reviews data-center energy and water use.",
      entities: ["Texas"],
      locations: ["Austin"],
      domain: "energy",
      concreteSubject: "Texas is pausing approvals for large data center projects during an energy and water audit.",
    };

    const prompt = buildImagePrompt(subject);
    const negative = buildNegativeImagePrompt(subject);

    expect(prompt).toContain("INFRASTRUCTURE-ONLY REAL NEWS PHOTOGRAPH");
    expect(prompt).toContain("ZERO PEOPLE IN FRAME");
    expect(prompt).toContain("data-center campus");
    expect(prompt).toContain("do not depict a governor, politician, public official");
    expect(negative).toContain("governor");
    expect(negative).toContain("politician");
    expect(negative).toContain("identifiable face");
  });
});
