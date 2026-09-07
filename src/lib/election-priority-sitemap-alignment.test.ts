import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import priorityUrls from "../data/search-console-priority-sitemap-urls.json";

const electionSitemapSource = readFileSync(
  new URL("../routes/sitemap-elections[.]xml.ts", import.meta.url),
  "utf8",
);

function primaryElectionPaths() {
  const match = electionSitemapSource.match(
    /const PRIORITY_ELECTION_PATHS = \[([\s\S]*?)\] as const;/,
  );
  if (!match) throw new Error("Could not locate PRIORITY_ELECTION_PATHS in sitemap-elections.xml source");
  return [...match[1].matchAll(/"([^"\n]+)"/g)].map((item) => item[1]);
}

function priorityElectionPaths() {
  return priorityUrls
    .map((url) => new URL(url).pathname.replace(/\/+$/, "") || "/")
    .filter((path) => path.startsWith("/elections/"));
}

describe("priority election sitemap ownership", () => {
  it("gives every priority election URL primary ownership in sitemap-elections.xml", () => {
    const primary = new Set(primaryElectionPaths());
    const priority = priorityElectionPaths();

    expect(priority.length).toBeGreaterThan(0);
    for (const path of priority) {
      expect(primary.has(path), `${path} is in the derivative priority sitemap but not sitemap-elections.xml`).toBe(true);
    }
  });

  it("keeps the redirecting legacy election root out of the primary election sitemap", () => {
    expect(primaryElectionPaths()).not.toContain("/elections");
  });

  it("spends the scarce priority-overlay slot on the still-unindexed forecast page", () => {
    const priority = priorityElectionPaths();
    expect(priority).toContain("/elections/forecast");
    expect(priority).not.toContain("/elections/methodology");
  });

  it("keeps methodology explicitly in the primary election crawl queue", () => {
    expect(primaryElectionPaths()).toContain("/elections/methodology");
  });
});
