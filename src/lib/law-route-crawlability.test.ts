import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const parent = readFileSync(new URL("../routes/laws.tsx", import.meta.url), "utf8");
const index = readFileSync(new URL("../routes/laws.index.tsx", import.meta.url), "utf8");
const topics = readFileSync(new URL("../routes/laws_.topics.tsx", import.meta.url), "utf8");
const amendments = readFileSync(new URL("../routes/laws_.constitutional-amendments.tsx", import.meta.url), "utf8");
const effectiveDates = readFileSync(new URL("../routes/laws_.effective-dates.tsx", import.meta.url), "utf8");

describe("crawl-safe law route hierarchy", () => {
  it("keeps /laws as an Outlet layout and the substantive hub on its exact index route", () => {
    expect(parent).toContain('createFileRoute("/laws")');
    expect(parent).toContain("Outlet");
    expect(parent).toContain("return <Outlet />");
    expect(parent).not.toContain("Texas Laws Explained:");

    expect(index).toContain('createFileRoute("/laws/")');
    expect(index).toContain('href: `${SITE_URL}/laws`');
    expect(index).toContain('title="Texas Laws Explained:"');

    expect(topics).toContain('createFileRoute("/laws/topics")');
    expect(amendments).toContain("createFileRoute('/laws/constitutional-amendments')");
    expect(effectiveDates).toContain("createFileRoute('/laws/effective-dates')");
  });
});
