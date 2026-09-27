import fs from "node:fs";
import { test } from "vitest";

test("five-issue Flyover repair preserves gates and adds bounded sources/routes", () => {
  const migration = fs.readFileSync(
    "supabase/migrations/20260927170000_repair_flyover_five_discovery_and_routing.sql",
    "utf8",
  );

  const required = [
    "San Antonio Report",
    "https://sanantonioreport.org/feed/",
    "METRO Houston — Official News and Service Updates",
    "Texas State Historical Association — Handbook of Texas",
    "The Texas Flyover — Discovery Benchmark",
    "Discovery-only benchmark",
    "source_reputation_score",
    "route_flyover_five_authority_gaps",
    "zz_route_flyover_five_authority_gaps",
    "friesenhahn",
    "inbound books",
    "community connector",
    "greenspoint mall",
    "kfc.*(open house|concept|test).*texas",
    "muertos fest",
    "athena.*owlet",
    "mckinney.*avelo",
    "state fair of texas",
    "tarleton state.*rodeo",
    "new.classification_confidence := greatest",
    "coalesce(new.source_reputation_score, 0) >= 60",
    "coalesce(new.texas_relevance_score, 0) >= 70",
  ];

  for (const token of required) {
    if (!migration.includes(token)) {
      throw new Error(`Flyover five repair migration is missing: ${token}`);
    }
  }

  for (const forbidden of [
    "new.ready_for_rewrite := true",
    "new.routing_type := 'SEO_ARTICLE'",
    "new.source_reputation_score :=",
    "new.texas_relevance_score :=",
    "new.extracted_body :=",
  ]) {
    if (migration.includes(forbidden)) {
      throw new Error(`Flyover five repair must not bypass an existing quality gate: ${forbidden}`);
    }
  }

  if (!migration.includes("new.internal_slug IS NOT NULL OR new.texasdefined_slug IS NOT NULL OR locked")) {
    throw new Error("Published rows and routing locks must remain immutable.");
  }
});
