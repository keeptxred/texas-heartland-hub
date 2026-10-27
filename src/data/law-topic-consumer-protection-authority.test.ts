import { describe, expect, it } from "vitest";
import { CONSUMER_PROTECTION_LAW_TOPIC } from "@/data/law-topic-consumer-protection-authority";

describe("Texas consumer-law enacted identity-theft debt protections", () => {
  const topic = CONSUMER_PROTECTION_LAW_TOPIC;

  it("describes enacted HB 4238 and the actual court-order trigger without applying draft-bill alternatives", () => {
    const framework = topic.framework.join(" ");
    expect(framework).toContain("House Bill 4238");
    expect(framework).toContain("September 1, 2025");
    expect(framework).toContain("Section 392.308(c)");
    expect(framework).toContain("Section 521.103");
    expect(framework).toContain("seventh business day");
    expect(framework).toContain("home-loan");
    expect(framework).toContain("judgment already obtained");
    expect(framework).toContain("A police report or FTC affidavit by itself is not the qualifying court order");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("identity theft") &&
      a.includes("Section 521.103") &&
      a.includes("seventh business day") &&
      a.includes("prior") === false &&
      a.includes("judgments already obtained")
    )).toBe(true);
  });

  it("retains correct collector scope and official enactment and code citations", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain('broad Texas "debt collector"');
    expect(text).toContain('narrower "third-party debt collector"');
    expect(text).toContain("Section 392.001");
    expect(topic.sources.some(({ url }) =>
      url === "https://tcss.legis.texas.gov/docs/fi/htm/fi.392.htm"
    )).toBe(true);
    expect(topic.sources.some(({ url }) =>
      url === "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB04238F.htm"
    )).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });

  it("does not collapse identity-theft procedures into DTPA presuit notice or limitations", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 17.505(a)");
    expect(text).toContain("Section 17.565");
    expect(text).toContain("60 days");
    expect(text).toContain("two years");
  });
});
