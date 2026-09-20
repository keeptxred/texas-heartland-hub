import { describe, expect, it } from "vitest";
import { editorialMinimumFor } from "./editorial-pipeline";

describe("evidence-driven editorial minimums", () => {
  it("allows a substantive compact-source article instead of forcing 1200 words", () => {
    expect(editorialMinimumFor("business", "x".repeat(3_000))).toBe(650);
    expect(editorialMinimumFor("politics", "x".repeat(3_000))).toBe(650);
  });

  it("uses 800 words for standard evidence packets", () => {
    expect(editorialMinimumFor("politics", "x".repeat(6_000))).toBe(800);
    expect(editorialMinimumFor("business", "x".repeat(6_000))).toBe(800);
  });

  it("reserves 1200 words for source-rich analysis categories", () => {
    expect(editorialMinimumFor("business", "x".repeat(10_000))).toBe(1200);
    expect(editorialMinimumFor("sports", "x".repeat(12_000))).toBe(1200);
  });

  it("preserves historical category defaults when no evidence packet is supplied", () => {
    expect(editorialMinimumFor("business")).toBe(1200);
    expect(editorialMinimumFor("politics")).toBe(800);
  });
});
