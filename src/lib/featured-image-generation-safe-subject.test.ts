import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { buildGenerationSafeSubject } from "./featured-image.functions";
import { buildImagePrompt, buildNegativeImagePrompt, type SubjectExtract } from "./featured-image-core";

describe("buildGenerationSafeSubject", () => {
  it("removes violent story language from the positive generation subject while preserving rejected motifs only as negative constraints", () => {
    const subject: SubjectExtract = {
      title: "Deadly I-20 road rage shooting in Fort Worth leaves woman dead",
      firstParagraph: "A woman was shot during a road rage incident on Interstate 20 in Fort Worth.",
      entities: ["Fort Worth", "Interstate 20"],
      locations: ["Fort Worth"],
      domain: "transportation",
      concreteSubject: "A fatal road rage shooting on Interstate 20 in Fort Worth.",
    };

    const safe = buildGenerationSafeSubject(subject);
    const prompt = buildImagePrompt(safe, "Use a completely new physical-camera composition");
    const negative = buildNegativeImagePrompt(safe, "Rejected image showed a gun and target illustration");

    expect(safe.title).toBe("Fort Worth interstate roadway exterior");
    expect(`${safe.title} ${safe.firstParagraph} ${safe.concreteSubject}`).not.toMatch(/shoot|road rage|gun|dead|victim|incident|reenactment/i);
    expect(prompt).toContain("roadway");
    expect(prompt).not.toMatch(/shoot|road rage|gun|dead|victim|incident/i);
    expect(negative).toContain("rejected visual motif: Rejected image showed a gun and target illustration");
  });

  it("keeps data-center generation focused on physical infrastructure while retaining rejected political imagery only as a negative constraint", () => {
    const subject: SubjectExtract = {
      title: "Gov. Abbott orders pause on data center approvals",
      firstParagraph: "The governor ordered a pause while Texas reviews grid impacts from large data centers.",
      entities: ["Abbott", "Texas"],
      locations: ["Texas"],
      domain: "energy",
      concreteSubject: "Gov. Abbott paused approvals for large data centers while grid impacts are reviewed.",
    };

    const safe = buildGenerationSafeSubject(subject);
    const prompt = buildImagePrompt(safe, "Use a completely new physical-camera composition");
    const negative = buildNegativeImagePrompt(safe, "Rejected image showed Gov. Abbott at a podium");

    expect(safe.domain).toBe("general");
    expect(safe.title).toBe("Texas data center exterior and electrical infrastructure");
    expect(`${safe.title} ${safe.firstParagraph} ${safe.concreteSubject}`).not.toMatch(/abbott|governor|politician|podium|policy|review|approval|pause/i);
    expect(prompt).toContain("data-center");
    expect(prompt).not.toMatch(/abbott|governor|politician|podium|policy|review|approval|pause/i);
    expect(negative).toContain("rejected visual motif: Rejected image showed Gov. Abbott at a podium");
  });

  it("uses the existing Schnell path only for sanitized hard-failure subjects while retaining strict validation", () => {
    const source = fs.readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");
    expect(source).toContain("generationSubject !== subject");
    expect(source).toContain("CLOUDFLARE_IMAGE_FALLBACK_MODEL");
    expect(source).toContain("validateImageMatchesArticle(bytes, subject)");
    expect(source).toContain("attempt <= 3");
  });
});
