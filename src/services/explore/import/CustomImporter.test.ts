import { describe, expect, it } from "vitest";
import type { ImportContext, ImportSourceConfig } from "@/types/explore/import";
import { CustomImporter } from "./CustomImporter";

function context(source: ImportSourceConfig): ImportContext {
  return {
    jobId: "job-1",
    source,
    mode: "manual",
    executionMode: "preview",
    startedAt: "2026-07-25T12:00:00.000Z",
  };
}

describe("CustomImporter", () => {
  it("normalizes a configured custom record", async () => {
    const source: ImportSourceConfig = {
      id: "custom-1",
      name: "Partner Places",
      type: "custom",
      enabled: true,
      endpoint: "https://example.test/places",
      metadata: {
        entityType: "attraction",
        idFields: ["partner_id"],
        nameFields: ["display_name"],
        descriptionFields: ["summary"],
        taxonomy: ["partner"],
      },
    };
    const importer = new CustomImporter(source);
    const draft = await importer.normalize(
      {
        partner_id: "abc-123",
        display_name: "Texas Discovery Center",
        summary: "A public attraction.",
      },
      context(source),
    );

    expect(draft).toMatchObject({
      externalId: "abc-123",
      entityType: "attraction",
      name: "Texas Discovery Center",
      description: "A public attraction.",
      taxonomy: ["custom-source", "partner"],
    });
  });

  it("requires explicit field mappings", async () => {
    const source: ImportSourceConfig = {
      id: "custom-2",
      name: "Invalid Custom Source",
      type: "custom",
      enabled: true,
      endpoint: "https://example.test/places",
      metadata: {},
    };
    const importer = new CustomImporter(source);

    await expect(importer.normalize({ id: "1", name: "Place" }, context(source))).rejects.toThrow(
      "metadata.entityType",
    );
  });
});
