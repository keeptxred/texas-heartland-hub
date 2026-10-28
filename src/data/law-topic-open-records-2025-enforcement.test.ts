import { describe, expect, it } from "vitest";
import { OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC } from "@/data/law-topic-open-records-authority";

describe("Texas 2025 PIA nonresponse enforcement and board access", () => {
  const topic = OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC;
  const framework = topic.framework.join(" ");
  const rules = topic.keyRules.join(" ");

  it("requires an Attorney General nonresponse finding before no-cost/training consequences", () => {
    expect(framework).toContain("House Bill 4219");
    expect(framework).toContain("Section 552.328(c)");
    expect(framework).toContain("five business days");
    expect(framework).toContain("within six months");
    expect(framework).toContain("compelling reason to withhold");
    expect(topic.questions.some(({ q, a }) => q.includes("improperly ignored") &&
      a.includes("Section 552.328") && a.includes("Merely filing a complaint") &&
      a.includes("within five business days"))).toBe(true);
  });

  it("distinguishes governmental appeal venue and 30 calendar day deadline from requester remedies", () => {
    expect(framework).toContain("Sections 552.324(a)-(b) and 552.325");
    expect(framework).toContain("Travis County district court");
    expect(framework).toContain("30th calendar day");
    expect(rules).toContain("30 calendar days");
    expect(topic.questions.some(({ q, a }) => q.includes("sue me") &&
      a.includes("against the Attorney General") && a.includes("right to be informed and to intervene"))).toBe(true);
  });

  it("makes the governing-board access right official-capacity, free and privilege-limited", () => {
    expect(framework).toContain("House Bill 4310");
    expect(framework).toContain("Subchapter K");
    expect(framework).toContain("Section 552.403");
    expect(framework).toContain("promptly and without charge");
    expect(framework).toContain("attorney-client privileged material");
    expect(framework).toContain("45-business-day decision target");
    expect(framework).toContain("Section 552.402 excludes");
    expect(framework).toContain("Section 552.406");
    expect(topic.questions.some(({ q, a }) => q.includes("school board members") &&
      a.includes("official capacity") &&
      a.includes("attorney-client material can be withheld"))).toBe(true);
  });

  it("preserves prior 2025 no-records notices and existing statutory PIA protections", () => {
    expect(framework).toContain("Section 552.221(f)");
    expect(framework).toContain("Section 552.221(d)");
    expect(framework).toContain("Section 552.2615(b)");
    expect(topic.sources.some(s => s.url.includes("Code=GV&Value=552.328"))).toBe(true);
    expect(topic.sources.some(s => s.url.includes("GV.552.htm#552.401"))).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });
});
