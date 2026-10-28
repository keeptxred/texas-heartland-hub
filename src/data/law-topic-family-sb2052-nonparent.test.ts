import { describe, expect, it } from "vitest";
import { FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC } from "@/data/law-topic-family-custody-authority";

describe("Enacted 2025 SB 2052 parent versus nonparent conservatorship rules", () => {
  const topic = FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC;
  const framework = topic.framework.join(" ");
  const rules = topic.keyRules.join(" ");

  it("requires a supported affidavit served with initial pleadings in covered nonparent suits or interventions", () => {
    expect(framework).toContain("Section 102.0031");
    expect(framework).toContain("serve with the initial pleading a sworn affidavit");
    expect(framework).toContain("dismiss the suit or strike the intervention");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("Can a nonparent obtain Texas custody") &&
      a.includes("Section 102.0031") &&
      a.includes("dismiss the suit or strike the intervention")
    )).toBe(true);
  });

  it("distinguishes parent presumption, clear-and-convincing significant impairment, and fact findings", () => {
    expect(framework).toContain("Section 153.002(b)");
    expect(framework).toContain("clear and convincing evidence");
    expect(framework).toContain("significantly impair");
    expect(framework).toContain("order granting relief must state the supporting facts");
    expect(rules).toContain("rebuttable parental presumption");
  });

  it("includes modification restriction and effective-date applicability for pending cases", () => {
    expect(framework).toContain("Section 156.008");
    expect(framework).toContain("prior order the parent agreed to");
    expect(framework).toContain("September 1, 2025");
    expect(framework).toContain("pending in a trial court on or after that date");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("earlier agreed nonparent custody order") &&
      a.includes("Section 156.008") &&
      a.includes("pending in a trial court")
    )).toBe(true);
  });

  it("retains prior support rules, primary sources, and the original full-guide reviewed date", () => {
    expect(framework).toContain("$11,700");
    expect(framework).toContain("Section 156.401(a)");
    expect(topic.sources.some(({ url }) => url.includes("FA.102.htm"))).toBe(true);
    expect(topic.sources.some(({ url }) => url.endsWith("SB02052F.HTM"))).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
  });
});
