import { describe, expect, it } from "vitest";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { isDataDetailIndexable } from "@/lib/data-detail-indexability";
import { GOVERNMENT_GRAPH_NODES } from "@/lib/government-graph";

const allDataSets = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS];
const dataDetailNodes = GOVERNMENT_GRAPH_NODES.filter(
  (node) => node.kind === "data" && node.href.startsWith("/data/"),
);

describe("government graph data readiness", () => {
  it("has data catalog entries intentionally held out of search by the detail readiness gate", () => {
    const heldOut = allDataSets.filter((dataset) => !isDataDetailIndexable(dataset));
    expect(heldOut.length).toBeGreaterThan(0);
  });

  it("only exposes indexable data detail pages through the news reference graph", () => {
    const bySlug = new Map(allDataSets.map((dataset) => [dataset.slug, dataset]));
    expect(dataDetailNodes.length).toBeGreaterThan(0);

    for (const node of dataDetailNodes) {
      const slug = node.href.slice("/data/".length);
      const dataset = bySlug.get(slug);
      expect(dataset, `missing dataset for graph node ${node.href}`).toBeTruthy();
      expect(isDataDetailIndexable(dataset), `noindex data page leaked into graph: ${node.href}`).toBe(true);
    }
  });

  it("does not link any held-out data detail page from the graph", () => {
    const hrefs = new Set(dataDetailNodes.map((node) => node.href));
    for (const dataset of allDataSets.filter((item) => !isDataDetailIndexable(item))) {
      expect(hrefs.has(`/data/${dataset.slug}`), `held-out dataset leaked: ${dataset.slug}`).toBe(false);
    }
  });
});
