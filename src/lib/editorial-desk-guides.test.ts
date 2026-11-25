import { describe, expect, it } from "vitest";
import { getEditorialDeskGuide } from "@/data/editorial-desk-guides";
import { AUTHORS } from "@/data/authors";
describe("indexed desk research guidance", () => {
  it.each(["energy-desk", "education-desk", "elections-desk", "civics-desk", "border-bureau"])("offers distinct public research resources for %s", slug => {
    expect(AUTHORS.some(author => author.slug === slug)).toBe(true);
    const guide = getEditorialDeskGuide(slug)!;
    expect(guide.focus.length).toBeGreaterThan(100);
    expect(guide.sources.length).toBeGreaterThanOrEqual(3);
    expect(guide.sources.every(s => s.href.startsWith("https://"))).toBe(true);
    expect(guide.references.every(s => s.href.startsWith("/"))).toBe(true);
  });
  it("does not manufacture research guidance for unrelated authors", () => {
    expect(getEditorialDeskGuide("nonexistent")).toBeUndefined();
  });
});
