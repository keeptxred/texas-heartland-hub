import { describe, expect, it } from "vitest";
import { WILLS_PROBATE_INHERITANCE_LAW_TOPIC } from "./law-topic-wills-probate-authority";

describe("Texas Estates Code §253.002 will revocation methods", () => {
  const topic = WILLS_PROBATE_INHERITANCE_LAW_TOPIC;
  it("requires qualified formal writing or physical cancellation, not oral changes", () => {
    const framework = topic.framework.join(" ");
    expect(framework).toContain("Section 253.002");
    expect(framework).toContain("with like formalities");
    expect(framework).toContain("destroying or canceling");
    expect(framework).toContain("spoken wish");
    expect(topic.keyRules.some(x => x.includes("§253.002"))).toBe(true);
    expect(topic.questions.some(x => x.q.includes("just by saying") && x.a.includes("oral statement"))).toBe(true);
    expect(topic.sources.some(x => x.url === "https://tcss.legis.texas.gov/resources/ES/htm/ES.253.htm")).toBe(true);
  });
  it("does not reset review metadata or dilute existing probate safeguards", () => {
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
    expect(topic.questions.some(x => x.q.includes("small-estate affidavit"))).toBe(true);
  });
});
