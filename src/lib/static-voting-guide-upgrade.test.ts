import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { dedupeArticleBody } from "@/lib/article-dedupe";

const upgraded = dedupeArticleBody(ARTICLE_BODIES["texas-voting-guide-2026"]);
const calendar = upgraded.sections.find((section) => section.heading === "The 2026 Calendar");
const mail = upgraded.sections.find((section) => section.heading.startsWith("Mail Ballots"));

describe("2026 voting guide reviewed corrections", () => {
  it("uses the official filing and primary early-voting dates", () => {
    expect(calendar?.bullets).toContain(
      "Saturday, November 8, 2025 — first day Republican or Democratic Party candidates may file an application for a place on the 2026 primary ballot.",
    );
    expect(calendar?.bullets).toContain(
      "Tuesday, February 17 – Friday, February 27, 2026 — early voting by personal appearance for the March primary.",
    );
    expect(calendar?.bullets?.some((bullet) => bullet.includes("Monday, February 16"))).toBe(false);
  });

  it("lists the current statutory vote-by-mail eligibility categories", () => {
    expect(mail?.bullets).toContain("Expected to give birth within three weeks before or after Election Day.");
    expect(mail?.bullets).toContain("Civilly committed under Chapter 841 of the Texas Health and Safety Code.");
    expect(mail?.paragraphs?.join(" ")).not.toContain("one of four conditions");
  });

  it("keeps elapsed dates historical and directs voters to current official resources", () => {
    const intro = upgraded.intro.join(" ");
    expect(intro).toContain("Those dates have passed");
    expect(intro).toContain("/register-to-vote");
    expect(intro).toContain("/county-elections");
    const content = JSON.stringify(upgraded);
    expect(content).toContain("Qualifying DPS online transactions");
    expect(content).toContain("Reasonable Impediment Declaration");
    expect(content).not.toContain("November is the formality");
    expect(upgraded.sources.some(source => source.url.includes("elections-results-archive"))).toBe(true);
  });

  it("records the reviewed correction date after publication", () => {
    expect(upgraded.updated).toBe("2026-11-24");
  });
});
