import { describe, expect, it } from "vitest";
import { ADMINISTRATIVE_RULEMAKING_LAW_TOPIC } from "@/data/law-topic-administrative-rulemaking-authority";

describe("Texas agency rulemaking and SB 14 judicial-review rules", () => {
  const topic = ADMINISTRATIVE_RULEMAKING_LAW_TOPIC;

  it("distinguishes narrow rule-adoption procedural challenge and remedial options", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 2001.035");
    expect(text).toContain("second anniversary");
    expect(text).toContain("Section 2001.040");
    expect(text).toContain("remand");
    expect(text).toContain("good cause");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("automatically invalid") &&
      a.includes("two-year") &&
      a.includes("September 1, 2025") &&
      a.includes("remand")
    )).toBe(true);
  });

  it("preserves new nondeference, legal de novo and meaningful SB14 application dates", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 2001.042");
    expect(text).toContain("Section 2001.1721");
    expect(text).toContain("de novo");
    expect(text).toContain("may still consider");
    expect(text).toContain("proceedings initiated on or after September 1, 2025");
    expect(text).toContain("rules first proposed on or after");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("accept a state agency") &&
      a.includes("not to defer") &&
      a.includes("September 1, 2025")
    )).toBe(true);
  });

  it("restricts section 2001.038 declaratory venue rather than suggesting statewide forum", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 2001.038");
    expect(text).toContain("Travis County district court");
    expect(text).toContain("legal right or privilege");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("Where can someone file") &&
      a.includes("Travis County district court") &&
      a.includes("the state agency")
    )).toBe(true);
  });

  it("retains dated authoritative rule publication and four-year review", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 2001.036");
    expect(text).toContain("20 days after filing");
    expect(text).toContain("Section 2001.039");
    expect(text).toContain("four years");
    expect(topic.sources.some(({ url }) => url.includes("SB00014F.HTM"))).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });
});
