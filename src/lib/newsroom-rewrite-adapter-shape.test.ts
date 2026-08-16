import { describe, expect, it } from "vitest";
import { validateNewsroomDraft } from "./newsroom-rewrite-adapter";
import type { ResearchPacket } from "./newsroom-research-packet";

const packet = {} as ResearchPacket;

describe("newsroom rewrite draft shape validation", () => {
  it("rejects a parseable but incomplete JSON object without throwing", () => {
    expect(() => validateNewsroomDraft({ brief: { hasClearNewsEvent: true }, title: "Texas update" }, packet)).not.toThrow();
    const validation = validateNewsroomDraft({ brief: { hasClearNewsEvent: true }, title: "Texas update" }, packet);
    expect(validation.ok).toBe(false);
    expect(validation.mainWordCount).toBe(0);
    expect(validation.reasons).toContain("invalid_dek");
    expect(validation.reasons).toContain("invalid_sections");
  });

  it("rejects non-object provider output deterministically", () => {
    expect(validateNewsroomDraft(null, packet)).toEqual({
      ok: false,
      reasons: ["invalid_draft_object"],
      mainWordCount: 0,
    });
  });
});
