import { describe, expect, it } from "vitest";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { LAW_TOPICS } from "@/data/law-topics";
import { POLICY_TRACKERS } from "@/data/policy-trackers";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { isDataDetailIndexable } from "@/lib/data-detail-indexability";
import { GOVERNMENT_GRAPH_NODES } from "@/lib/government-graph";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";
import { isPolicyTrackerIndexable } from "@/lib/policy-tracker-indexability";

const allDataSets = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS];
const graphHrefs = new Set(GOVERNMENT_GRAPH_NODES.map((node) => node.href));

describe("government graph detail readiness", () => {
  it("has data catalog entries intentionally held out of search by the detail readiness gate", () => {
    const heldOut = allDataSets.filter((dataset) => !isDataDetailIndexable(dataset));
    expect(heldOut.length).toBeGreaterThan(0);
  });

  it("only exposes indexable data detail pages through the news reference graph", () => {
    const bySlug = new Map(allDataSets.map((dataset) => [dataset.slug, dataset]));
    const dataNodes = GOVERNMENT_GRAPH_NODES.filter(
      (node) => node.kind === "data" && node.href.startsWith("/data/"),
    );
    expect(dataNodes.length).toBeGreaterThan(0);

    for (const node of dataNodes) {
      const dataset = bySlug.get(node.href.slice("/data/".length));
      expect(dataset, `missing dataset for graph node ${node.href}`).toBeTruthy();
      expect(isDataDetailIndexable(dataset), `noindex data page leaked into graph: ${node.href}`).toBe(true);
    }
  });

  it("does not link held-out policy, law, or data detail pages", () => {
    for (const tracker of POLICY_TRACKERS.filter((item) => !isPolicyTrackerIndexable(item))) {
      expect(graphHrefs.has(`/policy/${tracker.slug}`), `held-out policy leaked: ${tracker.slug}`).toBe(false);
    }
    for (const topic of LAW_TOPICS.filter((item) => !isLawTopicIndexable(item))) {
      expect(graphHrefs.has(`/laws/topic/${topic.slug}`), `held-out law topic leaked: ${topic.slug}`).toBe(false);
    }
    for (const dataset of allDataSets.filter((item) => !isDataDetailIndexable(item))) {
      expect(graphHrefs.has(`/data/${dataset.slug}`), `held-out dataset leaked: ${dataset.slug}`).toBe(false);
    }
  });

  it("keeps every graph policy, law-topic, and data-detail node aligned with page indexability", () => {
    const policyBySlug = new Map(POLICY_TRACKERS.map((item) => [item.slug, item]));
    const lawBySlug = new Map(LAW_TOPICS.map((item) => [item.slug, item]));
    const dataBySlug = new Map(allDataSets.map((item) => [item.slug, item]));

    for (const node of GOVERNMENT_GRAPH_NODES) {
      if (node.href.startsWith("/policy/")) {
        expect(isPolicyTrackerIndexable(policyBySlug.get(node.href.slice(8))), `noindex policy leaked: ${node.href}`).toBe(true);
      } else if (node.href.startsWith("/laws/topic/")) {
        expect(isLawTopicIndexable(lawBySlug.get(node.href.slice(12))), `noindex law topic leaked: ${node.href}`).toBe(true);
      } else if (node.href.startsWith("/data/")) {
        expect(isDataDetailIndexable(dataBySlug.get(node.href.slice(6))), `noindex data page leaked: ${node.href}`).toBe(true);
      }
    }
  });
});
