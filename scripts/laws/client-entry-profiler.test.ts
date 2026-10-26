import { describe, expect, it } from "vitest";
import { clientEntryProfile } from "./client-entry-profiler";

describe("opt-in client-entry bundle attribution", () => {
  it("normalizes source paths and sorts render attribution without touching JS output", () => {
    const js = "const x = 1;\n";
    const result = clientEntryProfile("assets/index-abcdef.js", js, {
      "/repo/src/routeTree.gen.ts": { renderedLength: 2400 },
      "/repo/node_modules/react/index.js": { renderedLength: 9900 },
      "/repo/src/routes/laws.index.tsx": { renderedLength: 120 },
    }, "/repo");
    expect(result.rawBytes).toBe(Buffer.byteLength(js, "utf8"));
    expect(result.totalAttributedBytes).toBe(12420);
    expect(result.modules.map((row) => row.source)).toEqual([
      "node_modules/react/index.js",
      "src/routeTree.gen.ts",
      "src/routes/laws.index.tsx",
    ]);
  });
  it("does not manufacture bytes for empty module attribution", () => {
    const result = clientEntryProfile("assets/index-test.js", "", {}, "/repo");
    expect(result.rawBytes).toBe(0);
    expect(result.totalAttributedBytes).toBe(0);
    expect(result.modules).toEqual([]);
  });
});
