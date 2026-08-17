import { describe, expect, it } from "vitest";
import { scoreQuality } from "./content-quality";
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

  it("satisfies the shared Why This Matters quality contract after normalization", () => {
    const normalized = normalizeNewsroomWhyThisMatters({
      intro: ["Texas regulators issued a statewide update affecting licensed providers."],
      sections: [{
        heading: "Texas relevance",
        paragraphs: ["The change affects licensed providers across Texas and changes their compliance timeline."],
      }],
    }, null);

    const quality = scoreQuality({
      slug: "test-newsroom-story",
      title: "Texas regulators issue statewide compliance update",
      dek: "The revised rule changes compliance requirements and timing for licensed providers across Texas.",
      author: "Keep TX Red Newsroom",
      published_at: "2026-08-17T12:00:00Z",
      kind: "news",
      body_json: normalized.bodyJson,
    });

    expect(quality.flags).not.toContain("missing_why_this_matters");
  });

  it("leaves unrelated article bodies unchanged", () => {
    const input = { sections: [{ heading: "What changed", paragraphs: ["Details"] }] };
    const result = normalizeNewsroomWhyThisMatters(input, "What changed Details");
    expect(result.changed).toBe(false);
    expect(result.bodyJson).toBe(input);
    expect(result.body).toBe("What changed Details");
  });
});
