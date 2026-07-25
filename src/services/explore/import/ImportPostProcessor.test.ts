import { describe, expect, it, vi } from "vitest";
import { ImportPostProcessor, type ImportPostProcessStep } from "./ImportPostProcessor";

const context = {
  jobId: "job-1",
  recordId: "record-1",
  sourceId: "source-1",
  entityId: "entity-1",
  draft: {
    externalId: "external-1",
    entityType: "park",
    name: "Test Park",
    relationships: [],
    media: [],
    metadata: {},
    raw: {},
  },
};

describe("ImportPostProcessor", () => {
  it("runs steps in order", async () => {
    const calls: string[] = [];
    const steps: ImportPostProcessStep[] = [
      { name: "taxonomy", execute: vi.fn(async () => { calls.push("taxonomy"); }) },
      { name: "media", execute: vi.fn(async () => { calls.push("media"); }) },
    ];

    const result = await new ImportPostProcessor(steps).process(context);

    expect(calls).toEqual(["taxonomy", "media"]);
    expect(result).toEqual({ completed: ["taxonomy", "media"], failed: [] });
  });

  it("continues after an isolated step failure", async () => {
    const steps: ImportPostProcessStep[] = [
      { name: "taxonomy", execute: async () => { throw new Error("taxonomy unavailable"); } },
      { name: "search", execute: vi.fn(async () => undefined) },
    ];

    const result = await new ImportPostProcessor(steps).process(context);

    expect(result.completed).toEqual(["search"]);
    expect(result.failed).toEqual([{ step: "taxonomy", message: "taxonomy unavailable" }]);
  });
});
