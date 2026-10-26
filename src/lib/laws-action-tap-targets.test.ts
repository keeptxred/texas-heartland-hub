import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const authority = readFileSync("src/components/law-topic-page.tsx", "utf8");
const hub = readFileSync("src/routes/laws.index.tsx", "utf8");

describe("mobile laws action target sizing before deployment", () => {
  it("keeps each shared law topic section anchor at a full 44px height", () => {
    expect(authority).toContain('inline-flex min-h-11 items-center rounded px-3 py-2');
    expect(authority).toContain('aria-label="On this page"');
  });
  it("preserves 44px legal hub navigation actions without changing their targets", () => {
    expect((hub.match(/inline-flex min-h-11 items-center px-2 py-2/g) || []).length).toBeGreaterThanOrEqual(4);
    for(const url of ['/laws/topics','/laws/topic/$slug','https://statutes.capitol.texas.gov/','https://www.sos.state.tx.us/elections/']){
      expect(hub).toContain(url);
    }
  });
});