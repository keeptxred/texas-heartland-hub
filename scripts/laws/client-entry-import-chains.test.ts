import { describe, expect, it } from "vitest";
import { traceEntryStaticImporterChains } from "./client-entry-import-chains";

describe("client entry static import provenance", () => {
  const included = new Set(["candidate-json", "race-json", "entity-registry", "news-quality", "site-root"]);
  const graph: Record<string, string[]> = {
    "candidate-json": ["entity-registry"],
    "race-json": ["entity-registry"],
    "entity-registry": ["news-quality"],
    "news-quality": ["site-root"],
    "site-root": [],
  };
  const get = (id: string) => ({ importers: graph[id] ?? [] });

  it("traces the exact static import chain to the root without counting lazy imports", () => {
    expect(traceEntryStaticImporterChains("candidate-json", included, get)).toEqual([
      ["candidate-json", "entity-registry", "news-quality", "site-root"],
    ]);
    expect(traceEntryStaticImporterChains("race-json", included, get)).toEqual([
      ["race-json", "entity-registry", "news-quality", "site-root"],
    ]);
  });
  it("ignores a dynamic-only importer and external modules not in the emitted entry", () => {
    const cb = (id: string) => ({
      importers: id === "candidate-json" ? ["entity-registry", "dynamic-election-page"] : graph[id] ?? [],
    });
    expect(traceEntryStaticImporterChains("candidate-json", included, cb)[0]).toEqual([
      "candidate-json", "entity-registry", "news-quality", "site-root",
    ]);
  });
  it("handles cycles, unavailable metadata, and absent modules safely", () => {
    expect(traceEntryStaticImporterChains("candidate-json", new Set(["candidate-json"]), () => null))
      .toEqual([["candidate-json"]]);
    expect(traceEntryStaticImporterChains("unknown", included, get)).toEqual([]);
    expect(traceEntryStaticImporterChains("candidate-json", included, get, 0)).toEqual([]);
    const loop = new Set(["a", "b"]);
    expect(traceEntryStaticImporterChains("a", loop, (id) => ({
      importers: id === "a" ? ["b"] : ["a"],
    }))).toEqual([["a", "b"]]);
  });
});
