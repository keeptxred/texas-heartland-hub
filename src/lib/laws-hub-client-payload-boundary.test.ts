import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const client = readFileSync("src/components/laws/law-guide-topic-grid.tsx", "utf8");
const route = readFileSync("src/routes/laws.index.tsx", "utf8");
const provider = readFileSync("src/lib/laws-hub-summaries.functions.ts", "utf8");

describe("Texas laws hub full-guide payload boundary", () => {
  it("keeps full supporting-guide article bodies and indexability validation in server execution", () => {
    expect(provider).toContain('createServerFn({ method: "GET" })');
    expect(provider).toContain('import { ALL_GUIDES } from "@/data/all-guides"');
    expect(provider).toContain("isSupportingGuideIndexable(guide)");
    expect(provider).toContain('meta.status === "verified"');
    expect(provider).toContain("lastVerified: meta.lastVerified ?? null");
    expect(client).not.toContain('import { ALL_GUIDES }');
    expect(client).not.toContain('import { LAW_TOPICS');
    expect(client).not.toContain("isSupportingGuideIndexable(");
  });

  it("retains SSR discovery links, dates and indexable child support guide", () => {
    expect(route).toContain("loader: () => getLawsHubSummaries()");
    expect(route).toContain("Route.useLoaderData()");
    expect(route).toContain('<LawGuideTopicGrid topic="driving" summaries={lawHubSummaries} />');
    expect(client).toContain('to="/guides/$slug"');
    expect(client).toContain("dateTime={guide.lastVerified}");
    expect(client).toContain("visible={summaries.showChildSupportGuide}");
  });
});
