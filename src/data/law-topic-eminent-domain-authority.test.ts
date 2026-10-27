import { describe, expect, it } from "vitest";
import { EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC } from "@/data/law-topic-eminent-domain-authority";

describe("Texas eminent-domain statutory claim safeguards", () => {
  const topic = EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC;

  it("distinguishes complete offer-time appraisal history and hearing disclosures", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 21.0111");
    expect(text).toContain("10 years");
    expect(text).toContain("certified mail, return receipt requested");
    expect(text).toContain("third business day before");
    expect(text).toContain("10 days after receipt");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("prior appraisals") &&
      a.includes("Section 21.0111(a)") &&
      a.includes("10 years") &&
      a.includes("confidentiality provision")
    )).toBe(true);
  });

  it("separates failure to offer from a mere valuation dispute", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 21.047(d)");
    expect(text).toContain("Section 21.0113");
    expect(text).toContain("must abate");
    expect(text).toContain("directly related to that violation");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("bona fide acquisition offer") &&
      a.includes("Section 21.047(d)") &&
      a.includes("court must abate")
    )).toBe(true);
  });

  it("protects 2025 clerk notice change without changing the award objection clock", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 21.049");
    expect(text).toContain("December 4, 2025");
    expect(text).toContain("next working day");
    expect(text).toContain("Rule of Civil Procedure 21a");
    expect(text).toContain("Section 21.018");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("special commissioners' award") &&
      a.includes("Section 21.049") &&
      a.includes("Section 21.018(a)")
    )).toBe(true);
    expect(topic.sources.some(({ url }) =>
      url === "https://tcss.legis.texas.gov/docs/PR/htm/PR.21.htm"
    )).toBe(true);
  });

  it("retains original review date and constitutional condemnation conditions", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Article I, Section 17");
    expect(text).toContain("Government Code Section 2206.001");
    expect(text).toContain("at least 14 days");
    expect(topic.updated).toBe("2026-09-06");
  });
});
