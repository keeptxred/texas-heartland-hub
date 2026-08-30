import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routeUrl = (name: string) => new URL(`../routes/${name}`, import.meta.url);
const parent = readFileSync(routeUrl("laws.tsx"), "utf8");
const index = readFileSync(routeUrl("laws.index.tsx"), "utf8");
const topics = readFileSync(routeUrl("laws.topics.tsx"), "utf8");
const amendments = readFileSync(routeUrl("laws.constitutional-amendments.tsx"), "utf8");
const effectiveDates = readFileSync(routeUrl("laws.effective-dates.tsx"), "utf8");
const topicDetail = readFileSync(routeUrl("laws.topic.$slug.tsx"), "utf8");

describe("crawl-safe law route hierarchy", () => {
  it("keeps /laws as an Outlet layout and the substantive hub on its exact index route", () => {
    expect(parent).toContain('createFileRoute("/laws")');
    expect(parent).toContain("Outlet");
    expect(parent).toContain("return <Outlet />");
    expect(parent).not.toContain("Texas Laws Explained:");

    expect(index).toContain('createFileRoute("/laws/")');
    expect(index).toContain('href: `${SITE_URL}/laws`');
    expect(index).toContain('title="Texas Laws Explained:"');
  });

  it("uses standard nested filenames now that the laws parent owns an Outlet", () => {
    expect(topics).toContain('createFileRoute("/laws/topics")');
    expect(amendments).toContain("createFileRoute('/laws/constitutional-amendments')");
    expect(effectiveDates).toContain("createFileRoute('/laws/effective-dates')");
    expect(topicDetail).toContain('createFileRoute("/laws/topic/$slug")');

    for (const retired of [
      "laws_.topics.tsx",
      "laws_.constitutional-amendments.tsx",
      "laws_.effective-dates.tsx",
    ]) {
      expect(existsSync(routeUrl(retired))).toBe(false);
    }
  });
});
