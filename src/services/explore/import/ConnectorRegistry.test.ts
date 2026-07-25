import { describe, expect, it } from "vitest";
import type { ImportSourceConfig, ImportSourceType } from "@/types/explore/import";
import { ConnectorRegistry } from "./ConnectorRegistry";

const SOURCE_TYPES: ImportSourceType[] = [
  "tpwd",
  "nps",
  "usace",
  "usfs",
  "thc",
  "usgs",
  "noaa",
  "twdb",
  "osm",
  "county_gis",
  "municipality",
  "tourism",
  "custom",
];

describe("ConnectorRegistry", () => {
  it("registers every declared Explore import source type", () => {
    const registry = new ConnectorRegistry();
    expect(registry.list()).toEqual([...SOURCE_TYPES].sort());
    for (const sourceType of SOURCE_TYPES) {
      expect(registry.supports(sourceType)).toBe(true);
    }
  });

  it("creates an importer matching the requested source type", () => {
    const registry = new ConnectorRegistry();
    for (const sourceType of SOURCE_TYPES) {
      const config: ImportSourceConfig = {
        id: `${sourceType}-source`,
        name: sourceType,
        type: sourceType,
        enabled: true,
        endpoint: "https://example.test/data",
        metadata:
          sourceType === "custom"
            ? { entityType: "place", idFields: ["id"], nameFields: ["name"] }
            : {},
      };
      expect(registry.create(config).sourceType).toBe(sourceType);
    }
  });

  it("prevents accidental duplicate registration", () => {
    const registry = new ConnectorRegistry();
    const config: ImportSourceConfig = {
      id: "custom-source",
      name: "Custom",
      type: "custom",
      enabled: true,
      endpoint: "https://example.test/data",
      metadata: { entityType: "place", idFields: ["id"], nameFields: ["name"] },
    };
    expect(() => registry.register("custom", () => registry.create(config))).toThrow(
      "already registered",
    );
  });
});
