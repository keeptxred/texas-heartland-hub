import { describe, expect, it } from "vitest";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { AGENCY_AUTHORITY_PROFILES } from "@/data/agency-authority";
import { LAW_TOPICS } from "@/data/law-topics";
import { POLICY_TRACKERS } from "@/data/policy-trackers";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { isAgencyAuthorityIndexable } from "@/lib/agency-authority-indexability";
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

  it("exposes exactly the data detail pages that pass the page readiness gate", () => {
    const dataNodes = GOVERNMENT_GRAPH_NODES.filter(
      (node) => node.kind === "data" && node.href.startsWith("/data/"),
    );
    const indexableDataSets = allDataSets.filter((dataset) => isDataDetailIndexable(dataset));

    expect(dataNodes).toHaveLength(indexableDataSets.length);
    for (const node of dataNodes) {
      const dataset = allDataSets.find((item) => item.slug === node.href.slice("/data/".length));
      if (!dataset) throw new Error(`missing dataset for graph node ${node.href}`);
      expect(isDataDetailIndexable(dataset), `noindex data page leaked into graph: ${node.href}`).toBe(true);
    }
  });

  it("does not link held-out policy, law, data, or agency detail pages", () => {
    for (const tracker of POLICY_TRACKERS.filter((item) => !isPolicyTrackerIndexable(item))) {
      expect(graphHrefs.has(`/policy/${tracker.slug}`), `held-out policy leaked: ${tracker.slug}`).toBe(false);
    }
    for (const topic of LAW_TOPICS.filter((item) => !isLawTopicIndexable(item))) {
      expect(graphHrefs.has(`/laws/topic/${topic.slug}`), `held-out law topic leaked: ${topic.slug}`).toBe(false);
    }
    for (const dataset of allDataSets.filter((item) => !isDataDetailIndexable(item))) {
      expect(graphHrefs.has(`/data/${dataset.slug}`), `held-out dataset leaked: ${dataset.slug}`).toBe(false);
    }
    for (const agency of AGENCY_AUTHORITY_PROFILES.filter((item) => !isAgencyAuthorityIndexable(item))) {
      expect(graphHrefs.has(`/texas-government/agencies/${agency.slug}`), `held-out agency leaked: ${agency.slug}`).toBe(false);
    }
  });

  it("keeps every graph policy, law-topic, data-detail, and agency node aligned with page indexability", () => {
    for (const node of GOVERNMENT_GRAPH_NODES) {
      if (node.href.startsWith("/policy/")) {
        const tracker = POLICY_TRACKERS.find((item) => item.slug === node.href.slice(8));
        if (!tracker) throw new Error(`missing policy tracker for graph node ${node.href}`);
        expect(isPolicyTrackerIndexable(tracker), `noindex policy leaked: ${node.href}`).toBe(true);
      } else if (node.href.startsWith("/laws/topic/")) {
        const topic = LAW_TOPICS.find((item) => item.slug === node.href.slice(12));
        if (!topic) throw new Error(`missing law topic for graph node ${node.href}`);
        expect(isLawTopicIndexable(topic), `noindex law topic leaked: ${node.href}`).toBe(true);
      } else if (node.href.startsWith("/data/")) {
        const dataset = allDataSets.find((item) => item.slug === node.href.slice(6));
        if (!dataset) throw new Error(`missing dataset for graph node ${node.href}`);
        expect(isDataDetailIndexable(dataset), `noindex data page leaked: ${node.href}`).toBe(true);
      } else if (node.href.startsWith("/texas-government/agencies/")) {
        const agency = AGENCY_AUTHORITY_PROFILES.find((item) => item.slug === node.href.slice(27));
        if (!agency) throw new Error(`missing agency for graph node ${node.href}`);
        expect(isAgencyAuthorityIndexable(agency), `noindex agency leaked: ${node.href}`).toBe(true);
      }
    }
  });
});
