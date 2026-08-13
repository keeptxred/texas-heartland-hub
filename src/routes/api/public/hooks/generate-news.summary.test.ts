import { describe, expect, it } from "vitest";
import { normalizeOverlongSummary } from "./generate-news";

const words = (count: number) => Array.from({ length: count }, (_, i) => `word${i + 1}`).join(" ");
const countWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

describe("normalizeOverlongSummary", () => {
  it("leaves in-range summaries untouched", () => {
    const summary = `${words(60)}.`;
    expect(normalizeOverlongSummary(summary)).toBe(summary);
  });

  it("leaves too-short summaries untouched so validation can reject them", () => {
    const summary = `${words(20)}.`;
    expect(normalizeOverlongSummary(summary)).toBe(summary);
  });

  it("prefers complete leading sentences when they yield at least 45 words", () => {
    const summary = `${words(50)}. ${words(50)}. ${words(50)}.`;
    const result = normalizeOverlongSummary(summary);
    expect(countWords(result)).toBe(50);
    expect(result.endsWith(".")).toBe(true);
    expect(summary.startsWith(result)).toBe(true);
  });

  it("truncates cleanly at 90 words when sentences cannot be used", () => {
    const summary = words(200);
    const result = normalizeOverlongSummary(summary);
    expect(countWords(result)).toBe(90);
    expect(result.endsWith(".")).toBe(true);
    expect(summary.startsWith(result.slice(0, -1))).toBe(true);
  });
});
