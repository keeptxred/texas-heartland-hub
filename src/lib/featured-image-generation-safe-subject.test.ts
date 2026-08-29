import { describe, expect, it } from "vitest";
import { buildGenerationOnlyImagePrompt, buildGenerationSafeSubject } from "./featured-image.functions";
import { buildNegativeImagePrompt, type SubjectExtract } from "./featured-image-core";

describe("buildGenerationSafeSubject", () => {
  it("removes violent incident language from both positive and negative generation inputs while preserving the truthful roadway setting", () => {
    const subject: SubjectExtract = {
      title: "Deadly I-20 road rage shooting in Fort Worth leaves woman dead",
      firstParagraph: "A woman was shot during a road rage incident on Interstate 20 in Fort Worth.",
      entities: ["Fort Worth", "Interstate 20"],
      locations: ["Fort Worth"],
      domain: "transportation",
      concreteSubject: "A fatal road rage shooting on Interstate 20 in Fort Worth.",
    };

    const safe = buildGenerationSafeSubject(subject);
    const prompt = buildGenerationOnlyImagePrompt(safe, "Use a completely new physical-camera composition");
    const negative = buildNegativeImagePrompt(safe, "Rejected image showed a gun and target illustration");

    expect(safe.title).toBe("Fort Worth interstate roadway infrastructure");
    expect(`${safe.title} ${safe.firstParagraph} ${safe.concreteSubject}`).not.toMatch(/shoot|road rage|gun|dead|victim|reenactment/i);
    expect(prompt).toContain("roadway");
    expect(prompt).not.toMatch(/shoot|road rage|gun|dead|victim|illustration|cartoon|poster|graphic design|speech bubble/i);
    expect(negative.replace(/rejected visual motif:.*$/i, "")).not.toMatch(/shoot|road rage|gun|dead|victim/i);
  });

  it("keeps data-center generation focused on infrastructure without putting politician terms into generation inputs", () => {
    const subject: SubjectExtract = {
      title: "Gov. Abbott orders pause on data center approvals",
      firstParagraph: "The governor ordered a pause while Texas reviews grid impacts from large data centers.",
      entities: ["Abbott", "Texas"],
      locations: ["Texas"],
      domain: "energy",
      concreteSubject: "Gov. Abbott paused approvals for large data centers while grid impacts are reviewed.",
    };

    const safe = buildGenerationSafeSubject(subject);
    const prompt = buildGenerationOnlyImagePrompt(safe, "Use a completely new physical-camera composition");
    const negative = buildNegativeImagePrompt(safe, "Rejected image showed Gov. Abbott at a podium");

    expect(safe.domain).toBe("general");
    expect(safe.title).toBe("Texas data-center and electrical infrastructure");
    expect(`${safe.title} ${safe.firstParagraph} ${safe.concreteSubject}`).not.toMatch(/abbott|governor|politician|podium/i);
    expect(prompt).toContain("data-center");
    expect(prompt).not.toMatch(/abbott|governor|politician|podium|illustration|cartoon|poster|graphic design/i);
    expect(negative.replace(/rejected visual motif:.*$/i, "")).not.toMatch(/abbott|governor|politician|podium/i);
  });
});
