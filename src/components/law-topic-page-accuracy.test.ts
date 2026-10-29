import fs from "node:fs";
import { describe, expect, it } from "vitest";

const topic = fs.readFileSync(new URL("./law-topic-page.tsx", import.meta.url), "utf8");
const hub = fs.readFileSync(new URL("./laws/law-guide-topic-grid.tsx", import.meta.url), "utf8");
const legacyGuide = fs.readFileSync(new URL("./laws/law-guide-ui.tsx", import.meta.url), "utf8");

describe("Texas law template verification-date accuracy and accessible sources", () => {
  it("labels the actual page modification date without implying complete claim review", () => {
    expect(topic).toContain('>Last updated {new Date(`${topic.updated}T12:00:00-05:00`)');
    expect(topic).not.toContain('>Reviewed {new Date(');
    expect(topic).toContain('modifiedTime: `${topic.updated}T12:00:00-05:00`');
    expect(topic).toContain('dateModified: topic.updated');
  });
  it("keeps law hub authority text links keyboard-focusable and at least 44px tall", () => {
    expect(hub).toContain('className="inline-flex min-h-11 items-center rounded px-2 font-semibold text-foreground underline');
    expect(hub).toContain("focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary");
  });
  it("keeps primary statute links in legacy guide cards focusable with 44px tap targets", () => {
    expect(legacyGuide).toContain('className="inline-flex min-h-11 items-center rounded px-2 py-2 font-semibold text-primary underline');
    expect(legacyGuide).toContain('hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary');
  });
});
