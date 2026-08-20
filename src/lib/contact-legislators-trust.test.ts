import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../routes/contact-legislators.tsx", import.meta.url), "utf8");

describe("legislator contact trust contract", () => {
  it("grounds process guidance in official Legislature sources", () => {
    expect(source).toContain("TLO_CONTACT");
    expect(source).toContain("TLO_COMMITTEES");
    expect(source).toContain("HOUSE_WITNESS");
    expect(source).toContain("CitationTrustPanel");
    expect(source).toContain('lastVerified="August 20, 2026"');
  });

  it("does not revive undocumented persuasion claims", () => {
    expect(source).not.toContain("40 phone calls");
    expect(source).not.toContain("morning briefing sheet");
    expect(source).not.toContain("Tuesday through Thursday");
    expect(source).not.toContain("count for almost nothing");
    expect(source).not.toContain("According to internal interviews");
  });

  it("keeps the official House witness-registration process visible", () => {
    expect(source).toContain("electronic witness registration");
    expect(source).toContain("committee hearing");
    expect(source).toContain("committee clerk");
  });
});
