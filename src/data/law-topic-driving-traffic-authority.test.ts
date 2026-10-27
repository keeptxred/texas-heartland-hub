import { describe, expect, it } from "vitest";
import { DRIVING_TRAFFIC_INSURANCE_LAW_TOPIC } from "@/data/law-topic-driving-traffic-authority";

describe("Texas driving law primary-source distinctions", () => {
  const topic = DRIVING_TRAFFIC_INSURANCE_LAW_TOPIC;

  it("separates required financial responsibility, approved alternatives, and narrow exemptions", () => {
    const text = [topic.quickAnswer, ...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 601.051");
    expect(text).toContain("Section 601.052");
    expect(text).toContain("601.121–601.124");
    expect(text).toContain("owner-filed affidavit");
    expect(text).toContain("regular transportation");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("25 years old") && a.includes("§601.052(a)(1)") &&
      a.includes("daily driver") && a.includes("affidavit")
    )).toBe(true);
    expect(topic.questions.some(({ q, a }) =>
      q.includes("proof of insurance") && a.includes("Section 601.053")
    )).toBe(true);
    expect(topic.sources.some(({ url }) => url ===
      "https://tcss.legis.texas.gov/docs/TN/htm/TN.601.htm"
    )).toBe(true);
  });

  it("preserves title, registration, inspection, and effective-date distinctions", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 502.040(a)");
    expect(text).toContain("30 days");
    expect(text).toContain("January 1, 2025");
    expect(text).toContain("emissions");
    expect(text).toContain("commercial");
    expect(text).toContain("replacement fee");
    expect(topic.sources.some(({ url }) => url ===
      "https://tcss.legis.texas.gov/resources/TN/htm/TN.502.htm"
    )).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });

  it("retains the separate licensing, speed, and liability coverage rules", () => {
    const text = [topic.quickAnswer, ...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 521.021");
    expect(text).toContain("30/60/25");
    expect(text).toContain("Chapter 545");
    expect(topic.sources.some(({ url }) => url.includes("www.tdi.texas.gov"))).toBe(true);
  });
});
