import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync("src/components/cornerstone-guide-page.tsx", "utf8");
const browser = readFileSync("tests/laws-deployed/tap-targets.spec.ts", "utf8");

describe("practical Texas law guide accessible navigation", () => {
  it("provides 44px keyboard-visible breadcrumb and reciprocal authority targets", () => {
    expect(component).toContain('to="/laws" className="inline-flex min-h-11');
    expect(component).toContain('to="/topics" className="inline-flex min-h-11');
    expect(component).toContain('href={guide.pillarHref} className="inline-flex min-h-11');
    expect(component).toContain('href={\x60/laws/topic/${topicAuthority.slug}\x60}'); // link stays dynamic
    expect(component).toContain('className="inline-flex min-h-11 items-center rounded px-2 text-primary');
    expect(component).toContain("focus-visible:outline-primary");
    expect(browser).toContain('"/guides/texas-child-support-guidelines-law"');
    expect(browser).toContain('"Parent Texas law framework"');
  });
  it("retains primary source URLs and visible related-guide links", () => {
    expect(component).toContain("href={source.url}");
    expect(component).toContain('target="_blank"');
    expect(component).toContain("href={item.href}");
    expect(component).toContain('rel="noopener noreferrer"');
  });
});
