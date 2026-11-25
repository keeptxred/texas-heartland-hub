import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
const checks = [
  ["texas-school-board-powers", "Three different routes for a school complaint", "45-calendar-day", "https://tea.texas.gov/families-students/resolving-concerns-and-complaints"],
  ["texas-governor-powers", "Veto deadlines and special-session limits in practice", "excluding Sundays", "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.3/CN.3.40.htm"],
  ["texas-attorney-general-powers", "Where to take a specific complaint or records dispute", "may be public records", "https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint"],
  ["what-local-governments-control", "Worked example: a road, a water bill and a school tax notice", "potential district boundaries", "https://www.tceq.texas.gov/gis/iwudview.html"],
] as const;
describe("Indexed civic decision guidance", () => {
  it.each(checks)("%s includes distinct procedural guidance and official sources", (slug, heading, marker, source) => {
    const body = ARTICLE_BODIES[slug];
    expect(body.updated).toBe("2026-11-25");
    expect(body.sections.some(section => section.heading === heading)).toBe(true);
    expect(JSON.stringify(body)).toContain(marker);
    expect(body.sources.some(item => item.url === source)).toBe(true);
  });
});
