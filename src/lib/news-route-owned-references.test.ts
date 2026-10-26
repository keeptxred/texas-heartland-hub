import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const footer = readFileSync("src/components/site-footer.tsx", "utf8");
const route = readFileSync("src/routes/news.$slug.tsx", "utf8");
const graph = readFileSync("src/components/news-government-graph-router.tsx", "utf8");

describe("route-owned evergreen policy links on newsroom stories", () => {
  it("keeps news context within the actual article route instead of loading full guide data in the root footer", () => {
    expect(route).toContain('import { NewsGovernmentGraphRouter } from "@/components/news-government-graph-router"');
    expect(route).toContain("<NewsGovernmentGraphRouter />");
    expect(footer).not.toContain("NewsGovernmentGraphRouter");
  });

  it("preserves server-renderable law and policy links for real news articles", () => {
    expect(graph).toContain("<ArticleIssueContext matches={issueMatches} />");
    expect(graph).toContain("links.length > 0");
    expect(graph).toContain("getGovernmentGraphLinksForText");
    expect(graph).toContain('match.routeId === "/news/$slug"');
    expect(route).toContain('createFileRoute("/news/$slug")');
  });
});
