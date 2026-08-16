import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildStoryCluster,
  combinationScore,
  likelySameLineage,
  strongMergeThreshold,
} from "./story-clustering";

const migration = readFileSync(
  "supabase/migrations/20260816142000_add_durable_news_event_clusters.sql",
  "utf8",
);

function item(source: string, title: string, description: string, link: string, pub_date = "2026-08-16T17:00:00Z") {
  return { source, title, description, link, pub_date };
}

describe("multi-source clustering phases 1-2", () => {
  it("persists one durable event identity on feed rows", () => {
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.news_event_clusters");
    expect(migration).toContain("ADD COLUMN IF NOT EXISTS event_cluster_id uuid");
    expect(migration).toContain("REFERENCES public.news_event_clusters(id)");
    expect(migration).toContain("'collecting','ready','synthesized','published','archived'");
  });

  it("preserves source provenance instead of deleting related reports", () => {
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.news_event_cluster_sources");
    expect(migration).toContain("source_name text NOT NULL");
    expect(migration).toContain("source_url text NOT NULL");
    expect(migration).toContain("raw_text text");
    expect(migration).toContain("normalized_text text");
    expect(migration).toContain("is_primary_record boolean");
    expect(migration).toContain("is_independent_source boolean");
    expect(migration).toContain("UNIQUE (feed_item_id)");
  });

  it("requires stronger evidence for high-risk crime clustering than ordinary coverage", () => {
    const crime = item(
      "Local News",
      "Man killed in Houston shooting",
      "Police are investigating a fatal shooting in Houston.",
      "https://example.com/houston-shooting",
    );
    const sports = item(
      "Dallas Cowboys",
      "Cowboys announce roster move before preseason game",
      "Dallas made a roster transaction before its preseason game.",
      "https://example.com/cowboys-roster",
    );
    expect(strongMergeThreshold(crime)).toBeGreaterThan(strongMergeThreshold(sports));
  });

  it("merges complementary independent reports about one event", () => {
    const primary = item(
      "Texas Education Agency",
      "Texas releases 2026 A-F school accountability ratings",
      "TEA released statewide accountability grades based largely on STAAR results. Districts may appeal the ratings.",
      "https://tea.texas.gov/ratings",
    );
    const local = item(
      "Austin American-Statesman",
      "Austin ISD schools receive fifth straight F in Texas accountability ratings",
      "Two Austin middle schools received a fifth consecutive F under the Texas Education Agency accountability ratings and the district may appeal.",
      "https://statesman.com/austin-isd-ratings",
      "2026-08-16T18:00:00Z",
    );
    expect(combinationScore(primary, local).score).toBeGreaterThanOrEqual(strongMergeThreshold(primary));
    const cluster = buildStoryCluster(primary, [local]);
    expect(cluster.strongMerge).toBe(true);
    expect(cluster.sourceCount).toBe(2);
  });

  it("does not count syndicated copies as independent evidence", () => {
    const copy = "Texas officials released the statewide report Friday after months of review. The report includes district-level results, campus-level results, statewide comparisons, an appeals process, final publication dates, and supporting methodology for the accountability system.";
    const a = item("Wire Partner A", "Texas releases statewide school report", copy, "https://a.example/report");
    const b = item("Wire Partner B", "Texas releases statewide school report", copy, "https://b.example/report");
    expect(likelySameLineage(a, b)).toBe(true);
  });

  it("keeps unrelated same-city events separate", () => {
    const court = item(
      "Houston Chronicle",
      "Houston judge issues ruling in city contract lawsuit",
      "A judge ruled on a Houston city contracting dispute after a hearing.",
      "https://chron.com/city-contract-case",
    );
    const crime = item(
      "KPRC",
      "Houston police investigate fatal shooting overnight",
      "Police are investigating a fatal shooting in Houston after an overnight call.",
      "https://kprc.com/houston-shooting",
    );
    expect(combinationScore(court, crime).score).toBeLessThan(strongMergeThreshold(crime));
  });
});
