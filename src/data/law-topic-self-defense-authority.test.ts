import { describe, expect, it } from "vitest";
import { SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC } from "@/data/law-topic-self-defense-authority";

describe("Texas third-person property defense statutory prerequisites", () => {
  const topic = SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC;

  it("requires baseline property justification plus section 9.43 qualifying circumstances", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 9.43");
    expect(text).toContain("Section 9.41 or 9.42");
    expect(text).toContain("attempted or consummated theft");
    expect(text).toContain("criminal mischief");
    expect(text).toContain("legal duty");
    expect(text).toContain("under the actor's care");
    expect(text).toContain("third person's property being involved alone is not sufficient");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("neighbor's or friend's property") &&
      a.includes("Section 9.43") &&
      a.includes("Section 9.41 or 9.42") &&
      a.includes("Deadly force")
    )).toBe(true);
  });

  it("continues to distinguish strict deadly property force from ordinary force", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 9.42");
    expect(text).toContain("nighttime theft");
    expect(text).toContain("immediately necessary");
    expect(topic.sources.some(({ url }) =>
      url === "https://statutes.capitol.texas.gov/?artSec=9.43&chapter=PE.9&code=PE&tab=1"
    )).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });
});
