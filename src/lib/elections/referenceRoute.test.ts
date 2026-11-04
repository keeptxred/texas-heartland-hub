import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const route = read("../../routes/elections.reference[.]json.ts");
const middleware = read("../../start.ts");
const citationGuide = read("../../routes/citation-guide.tsx");
const llms = read("../../../public/llms.txt");

describe("retired public election reference endpoint", () => {
  it("preserves its source data while denying public requests before routing", () => {
    expect(route).toContain("createFileRoute('/elections/reference.json')");
    expect(middleware).toContain("isRetiredElectionCentralPath(url.pathname)");
    expect(middleware).toContain("status: 404");
  });

  it("does not promote the retired endpoint from public discovery materials", () => {
    expect(citationGuide).not.toContain('href="/elections/reference.json"');
    expect(llms).not.toContain("(/elections/reference.json)");
  });
});
