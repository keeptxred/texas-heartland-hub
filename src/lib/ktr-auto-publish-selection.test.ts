import { describe, expect, it } from "vitest";
import { shouldAttemptKtrAutoPublish } from "@/lib/ktr-auto-publish-selection";

const now = Date.parse("2026-10-14T14:00:00Z");
const valid = { eligible: true, targetSite: "keeptxred", internalSlug: null };

describe("KeepTXRed scheduled auto-publication selection", () => {
  it("attempts fresh explicit KTR candidates", () => {
    expect(shouldAttemptKtrAutoPublish(valid, now)).toBe(true);
  });
  it("never spends publishing attempts on TexasDefined or review routes", () => {
    for (const targetSite of ["texasdefined", "review", null, ""]) {
      expect(shouldAttemptKtrAutoPublish({ ...valid, targetSite }, now)).toBe(false);
    }
  });
  it("does not republish or select ineligible rows", () => {
    expect(shouldAttemptKtrAutoPublish({ ...valid, internalSlug: "existing-story" }, now)).toBe(false);
    expect(shouldAttemptKtrAutoPublish({ ...valid, eligible: false }, now)).toBe(false);
  });
  it("skips a recent failure but retries after the cooldown expires", () => {
    const held = { ...valid, retryAfter: "2026-10-14T16:00:00Z" };
    expect(shouldAttemptKtrAutoPublish(held, now)).toBe(false);
    expect(shouldAttemptKtrAutoPublish(held, Date.parse(held.retryAfter))).toBe(true);
  });
  it("does not strand a candidate when retry metadata is malformed", () => {
    expect(shouldAttemptKtrAutoPublish({ ...valid, retryAfter: "invalid" }, now)).toBe(true);
  });
});
