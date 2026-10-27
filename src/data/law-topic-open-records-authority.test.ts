import { describe, expect, it } from "vitest";
import { OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC } from "@/data/law-topic-open-records-authority";

describe("Texas Public Information Act distinct requester and agency duties", () => {
  const topic = OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC;

  it("distinguishes the 40-dollar itemized estimate from ordinary prompt production", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 552.2615(a)");
    expect(text).toContain("exceed $40");
    expect(text).toContain("Section 552.271");
    expect(text).toContain("less-costly");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("estimate over $40") &&
      a.includes("Section 552.2615(a)") &&
      a.includes("itemized written estimate")
    )).toBe(true);
  });

  it("protects requester 10-business-day response and projected cost-change trigger", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 552.2615(b)");
    expect(text).toContain("10 business days after the estimate was sent");
    expect(text).toContain("Section 552.2615(c)");
    expect(text).toContain("20 percent or more");
    expect(text).toContain("withdrawn");
  });

  it("does not suspend the separate attorney-general ruling deadlines", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 552.2615(g)");
    expect(text).toContain("Subchapter G");
    expect(text).toContain("Section 552.301");
    expect(text).toContain("15th business day");
    expect(topic.sources.some(({ url }) =>
      url === "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=GV&Value=552.2615"
    )).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });

  it("requires written certification and a reasonable access date if records cannot be produced in ten business days", () => {
    const framework = topic.framework.join(" ");
    expect(framework).toContain("Section 552.221(d)");
    expect(framework).toContain("must certify that fact in writing");
    expect(framework).toContain("set a date and hour within a reasonable time");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("cannot produce my records within ten business days") &&
      a.includes("Section 552.221(d)") &&
      a.includes("certify in writing")
    )).toBe(true);
  });

  it("requires conspicuous alternative access notice when government emails a records URL", () => {
    const framework = topic.framework.join(" ");
    expect(framework).toContain("Section 552.221(b-1)");
    expect(framework).toContain("subsection (b-2)");
    expect(framework).toContain("conspicuous font");
    expect(framework).toContain("United States mail");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("sending a website link") &&
      a.includes("subsection (b-2)") &&
      a.includes("conspicuous statement") &&
      a.includes("inspection or duplication")
    )).toBe(true);
    expect(topic.sources.some(({ url }) =>
      url === "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=GV&Value=552.221"
    )).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });
});
