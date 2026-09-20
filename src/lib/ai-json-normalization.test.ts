import { describe, expect, it } from "vitest";
import { normalizeArticleJsonValue, normalizeJsonContent } from "./ai-json-normalization";

describe("AI JSON normalization", () => {
  it("recovers a missing article title from the analyzed primary event", () => {
    const value = normalizeArticleJsonValue({
      brief: {
        hasClearNewsEvent: true,
        primaryEvent: "Tarrant County backed a statewide property-tax relief proposal.",
      },
      title: "",
      summary: "Tarrant County commissioners backed the proposal during a public meeting.",
      sections: [{ heading: "What happened", paragraphs: ["Details."] }],
    }) as Record<string, unknown>;

    expect(value.title).toBe("Tarrant County backed a statewide property-tax relief proposal");
  });

  it("preserves an existing usable title", () => {
    const input = {
      brief: { hasClearNewsEvent: true, primaryEvent: "Different analyzed event" },
      title: "Texas grid grant expands reliability work in Northwest Texas",
      summary: "Summary",
      sections: [],
    };
    expect(normalizeArticleJsonValue(input)).toEqual(input);
  });

  it("does not invent a title for unrelated JSON", () => {
    const input = { brief: { primaryEvent: "An event long enough for a title" }, status: "ok" };
    expect(normalizeArticleJsonValue(input)).toEqual(input);
  });

  it("normalizes string provider payloads and rejects malformed JSON", () => {
    const normalized = normalizeJsonContent(JSON.stringify({
      brief: { primaryEvent: "Texas officials announced a new reliability grant." },
      summary: "Summary",
      sections: [],
    }));
    expect(JSON.parse(normalized ?? "{}").title).toBe(
      "Texas officials announced a new reliability grant",
    );
    expect(normalizeJsonContent("not-json")).toBeNull();
  });
});
