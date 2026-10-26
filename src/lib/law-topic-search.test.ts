import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getLawTopic } from "@/data/law-topics";
import { lawTopicMatchesQuery } from "@/lib/law-topic-search";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";

describe("meaningful Texas law-topic search", () => {
  it("matches substantive answers and FAQs, not only SEO headings", () => {
    const employment = getLawTopic("employment-wages-workplace-rights-law")!;
    const consumer = getLawTopic("consumer-protection-deceptive-trade-law")!;
    const landlord = getLawTopic("landlord-tenant-rentals-law")!;
    expect(isLawTopicIndexable(employment)).toBe(true);
    expect(lawTopicMatchesQuery(employment, "final paycheck")).toBe(true);
    expect(lawTopicMatchesQuery(consumer, "DTPA")).toBe(true);
    expect(lawTopicMatchesQuery(landlord, "security deposit")).toBe(true);
    expect(lawTopicMatchesQuery(consumer, "no_such_statute_zzzyxx")).toBe(false);
  });
  it("supports case-insensitive, whitespace-tolerant multi-term queries", () => {
    const traffic = getLawTopic("driving-traffic-insurance-law")!;
    expect(lawTopicMatchesQuery(traffic, "  Driving   INSURANCE  ")).toBe(true);
    expect(lawTopicMatchesQuery(traffic, "   ")).toBe(true);
  });
  it("preserves indexability filtering, informative no-results and accessible result context", () => {
    const route = readFileSync(new URL("../routes/laws_.topics.tsx", import.meta.url), "utf8");
    const server = readFileSync(new URL("./law-library-route.functions.ts", import.meta.url), "utf8");
    expect(server).toContain("LAW_TOPICS.filter(isLawTopicIndexable)");
    expect(route).toContain("loader: () => getIndexableLawTopics()");
    expect(route).toContain("lawTopicMatchesQuery(topic, query)");
    expect(route).toContain('id="law-topic-results"');
    expect(route).toContain("No law topics match that search");
  });
});
