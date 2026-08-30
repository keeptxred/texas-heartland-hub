import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const parent = readFileSync(new URL("../routes/laws.tsx", import.meta.url), "utf8");
const topics = readFileSync(new URL("../routes/laws_.topics.tsx", import.meta.url), "utf8");
const amendments = readFileSync(new URL("../routes/laws_.constitutional-amendments.tsx", import.meta.url), "utf8");
const effectiveDates = readFileSync(new URL("../routes/laws_.effective-dates.tsx", import.meta.url), "utf8");

describe("crawl-safe law route hierarchy", () => {
  it("keeps the /laws hub standalone and moves public child paths into pathless sibling routes", () => {
    expect(parent).not.toContain("<Outlet");
    expect(topics).toContain('createFileRoute("/laws/topics")');
    expect(amendments).toContain("createFileRoute('/laws/constitutional-amendments')");
    expect(effectiveDates).toContain("createFileRoute('/laws/effective-dates')");
  });
});
