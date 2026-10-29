import { describe, expect, it } from "vitest";
import { BUSINESS_FORMATION_LLC_LAW_TOPIC } from "@/data/law-topic-business-formation-authority";

describe("Texas LLC registered agent consent versus filing under BOC §5.201", () => {
  const topic = BUSINESS_FORMATION_LLC_LAW_TOPIC;
  const text = topic.framework.join(" ");

  it("requires a consent but avoids inventing a mandatory registered-agent consent filing", () => {
    expect(text).toContain("Section 5.201(b)");
    expect(text).toContain("kept by the represented entity rather than filed");
    expect(text).toContain("separate public filing of the consent is optional");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("file my Texas LLC's registered agent consent") &&
      a.includes("Usually no") &&
      a.includes("writing or electronically") &&
      a.includes("kept by the represented LLC")
    )).toBe(true);
  });

  it("preserves physical registered office and continuous designation duties", () => {
    expect(text).toContain("Section 5.201(c)");
    expect(text).toContain("cannot consist solely of a mailbox");
    expect(text).toContain("Form 401");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("only a mailbox service") &&
      a.includes("Texas street address") &&
      a.includes("Form 401")
    )).toBe(true);
  });

  it("links the current SOS registered-agent instructions and does not reset old guide dates", () => {
    for (const url of [
      "https://www.sos.state.tx.us/corp/instructions/401-a.shtml",
      "https://www.sos.state.tx.us/corp/registeredagentfaqs.shtml"
    ]) {
      expect(topic.sources.some((s) => s.url === url)).toBe(true);
    }
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
    expect(text).toContain("August 11, 2026 final rule");
  });
});
