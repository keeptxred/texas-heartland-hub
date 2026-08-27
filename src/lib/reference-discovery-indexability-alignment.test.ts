import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { isDataDetailIndexable } from "@/lib/data-detail-indexability";

const read = (path: string) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const policyHub = read("../routes/policy.tsx");
const policyManifest = read("../routes/policy-trackers[.]txt.ts");
const lawHub = read("../routes/laws.topics.tsx");
const lawFinder = read("../routes/civic-tools.texas-law-finder.tsx");
const dataHub = read("../routes/data.tsx");
const agencyHub = read("../routes/texas-government.agencies.tsx");
const graph = read("./government-graph.ts");

describe("reference discovery indexability alignment", () => {
  it("has real data detail pages held out by the readiness gate", () => {
    const all = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS];
    expect(all.some((dataset) => !isDataDetailIndexable(dataset))).toBe(true);
  });

  it("filters policy hub, schema, and manifest through policy readiness", () => {
    for (const source of [policyHub, policyManifest]) {
      expect(source).toContain("isPolicyTrackerIndexable");
      expect(source).toContain("INDEXABLE_POLICY_TRACKERS");
    }
    expect(policyHub).toContain("numberOfItems: INDEXABLE_POLICY_TRACKERS.length");
    expect(policyHub).toContain("itemListElement: INDEXABLE_POLICY_TRACKERS.map");
    expect(policyManifest).toContain("...INDEXABLE_POLICY_TRACKERS.map");
  });

  it("filters law, data, and agency hub cards and schema through their page readiness gates", () => {
    expect(lawHub).toContain("LAW_TOPICS.filter(isLawTopicIndexable)");
    expect(lawHub).toContain("INDEXABLE_LAW_TOPICS.map");
    expect(lawHub).toContain("numberOfItems: INDEXABLE_LAW_TOPICS.length");

    expect(dataHub).toContain("ALL_DATA_SETS.filter(isDataDetailIndexable)");
    expect(dataHub).toContain("INDEXABLE_DATA_SETS.map");
    expect(dataHub).toContain("numberOfItems: INDEXABLE_DATA_SETS.length");

    expect(agencyHub).toContain("ALL_AGENCY_PROFILES.filter(isAgencyAuthorityIndexable)");
    expect(agencyHub).toContain("INDEXABLE_AGENCY_PROFILES.map");
    expect(agencyHub).toContain("numberOfItems: INDEXABLE_AGENCY_PROFILES.length");
  });

  it("keeps Texas Law Finder results inside the indexable law-topic cohort", () => {
    expect(lawFinder).toContain("const INDEXABLE_LAW_TOPICS = LAW_TOPICS.filter(isLawTopicIndexable)");
    expect(lawFinder).toContain("return INDEXABLE_LAW_TOPICS.map");
    expect(lawFinder).not.toContain("return LAW_TOPICS.map");
  });

  it("filters all detail-node families in the news reference graph", () => {
    expect(graph).toContain("POLICY_TRACKERS\n  .filter(isPolicyTrackerIndexable)");
    expect(graph).toContain("LAW_TOPICS\n  .filter(isLawTopicIndexable)");
    expect(graph).toContain("[...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS]\n  .filter(isDataDetailIndexable)");
    expect(graph).toContain("AGENCY_AUTHORITY_PROFILES\n  .filter(isAgencyAuthorityIndexable)");
  });
});
