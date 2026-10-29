import { describe, expect, it } from "vitest";
import { LANDLORD_TENANT_RENTALS_LAW_TOPIC } from "@/data/law-topic-landlord-tenant-authority";

describe("Texas Property Code 92.331–92.335 landlord anti-retaliation", () => {
  const topic = LANDLORD_TENANT_RENTALS_LAW_TOPIC;
  const framework = topic.framework.join(" ");
  const rules = topic.keyRules.join(" ");

  it("lists protected activities and limited six-month retaliatory action prohibition", () => {
    expect(framework).toContain("Section 92.331(a)");
    expect(framework).toContain("tenant organizations");
    expect(framework).toContain("six months after such conduct");
    expect(framework).toContain("Section 92.331(b)");
    expect(rules).toContain("six-month period");
  });

  it("preserves lawful rent delinquency and nonretaliatory landlord options", () => {
    expect(framework).toContain("Section 92.332");
    expect(framework).toContain("unpaid rent");
    expect(framework).toContain("project-wide increases");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("six-month Texas tenant retaliation") &&
      a.includes("not a rent freeze") &&
      a.includes("otherwise valid eviction grounds")
    )).toBe(true);
  });

  it("distinguishes damage remedies from eviction defense and bad-faith claims", () => {
    expect(framework).toContain("Section 92.333");
    expect(framework).toContain("one month's rent plus $500");
    expect(framework).toContain("Section 92.335");
    expect(framework).toContain("cannot simply be joined");
    expect(framework).toContain("Section 92.334");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("remedies can a Texas tenant") &&
      a.includes("§92.333") &&
      a.includes("Section 92.335")
    )).toBe(true);
  });

  it("cites live official current law and preserves prior 2026 guide review dates", () => {
    expect(topic.sources.some((source) =>
      source.url === "https://tcss.legis.texas.gov/resources/PR/htm/PR.92.htm"
    )).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
    expect(framework).toContain("Section 24.005");
  });
});
