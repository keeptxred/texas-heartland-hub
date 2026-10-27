import { describe, expect, it } from "vitest";
import { ELECTION_LAW_TOPIC } from "@/data/law-topic-election-authority";

describe("2025–26 Texas election equipment and pollbook safeguards", () => {
  const topic = ELECTION_LAW_TOPIC;

  it("protects the statutory 48th-DAY public voting-system test deadline", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 129.023(b)");
    expect(text).toContain("48th day before election day");
    expect(text).toContain("Section 129.023(b-3)");
    expect(text).toContain("within 24 hours");
    expect(text).toContain("Section 129.023(c-1)");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("both due 48 hours") &&
      a.includes("48th DAY") &&
      a.includes("48 HOURS")
    )).toBe(true);
  });

  it("separates new pollbook testing 48 hours before voting begins", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 129.0231");
    expect(text).toContain("48 hours before voting begins");
    expect(text).toContain("voter files");
    expect(text).toContain("ballot styles");
    expect(text).toContain("September 1, 2025");
  });

  it("preserves 2026 network limits only for covered voting systems", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 129.054");
    expect(text).toContain("September 1, 2026");
    expect(text).toContain("external or internal communications networks");
    expect(text).toContain("wireless");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("connect to networks") &&
      a.includes("electronic pollbooks") &&
      a.includes("September 1, 2026")
    )).toBe(true);
    expect(topic.sources.some(({ url }) =>
      url === "https://tcss.legis.texas.gov/resources/EL/htm/EL.129.htm"
    )).toBe(true);
  });

  it("retains distinct 2026 election-day, early-voting, and mail-ballot deadlines", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("October 19 through October 30");
    expect(text).toContain("October 23, 2026");
    expect(text).toContain("November 3, 2026");
    expect(text).toContain("November 4");
    expect(topic.updated).toBe("2026-09-06");
  });
});
