import { describe, expect, it } from "vitest";
import { normalizeNewsroomWhyThisMatters } from "./newsroom-postpublish";

describe("normalizeNewsroomWhyThisMatters", () => {
  it("renames the newsroom relevance section without changing its paragraphs", () => {
    const input = {
      intro: ["Lead"],
      sections: [
        { heading: "Texas relevance", paragraphs: ["This affects Texans statewide."] },
        { heading: "What changed", paragraphs: ["Details"] },
      ],
    };

    const result = normalizeNewsroomWhyThisMatters(input, "Lead Texas relevance This affects Texans statewide.");

    expect(result.changed).toBe(true);
    expect(result.bodyJson).toEqual({
      intro: ["Lead"],
      sections: [
        { heading: "Why This Matters", paragraphs: ["This affects Texans statewide."] },
        { heading: "What changed", paragraphs: ["Details"] },
      ],
    });
    expect(result.body).toContain("Why This Matters");
    expect(result.body).not.toContain("Texas relevance");
  });

  it("leaves unrelated article bodies unchanged", () => {
    const input = { sections: [{ heading: "What changed", paragraphs: ["Details"] }] };
    const result = normalizeNewsroomWhyThisMatters(input, "What changed Details");
    expect(result.changed).toBe(false);
    expect(result.bodyJson).toBe(input);
    expect(result.body).toBe("What changed Details");
  });
});
