import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(path, "utf8");
}

describe("laws route layout crawlability", () => {
  it("keeps /laws as an Outlet layout so nested law routes can render their own bodies", () => {
    const layout = source("src/routes/laws.tsx");

    expect(layout).toContain('createFileRoute("/laws")');
    expect(layout).toContain("Outlet");
    expect(layout).toContain("return <Outlet />");
    expect(layout).not.toContain("Texas Laws Explained:");
  });

  it("keeps the substantive laws hub on the exact /laws index route", () => {
    const index = source("src/routes/laws.index.tsx");

    expect(index).toContain('createFileRoute("/laws/")');
    expect(index).toContain('href: `${SITE_URL}/laws`');
    expect(index).toContain('title="Texas Laws Explained:"');
  });

  it("retains the real topic-detail route under the laws layout", () => {
    const topic = source("src/routes/laws.topic.$slug.tsx");

    expect(topic).toContain('createFileRoute("/laws/topic/$slug")');
    expect(topic).toContain("component: LawTopicRoute");
  });
});
