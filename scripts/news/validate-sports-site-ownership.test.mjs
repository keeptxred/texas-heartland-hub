import fs from "node:fs";
import { describe, expect, it } from "vitest";

const migration = fs.readFileSync(
  "supabase/migrations/20260922133526_align_routine_sports_ownership_to_texasdefined.sql",
  "utf8",
);
const contentIntelligence = fs.readFileSync(
  "src/shared/platform-core/content-intelligence.ts",
  "utf8",
);
const publicReadiness = fs.readFileSync(
  "src/lib/public-article-readiness.ts",
  "utf8",
);

const routeContracts = [
  ["src/routes/texas-sports.tsx", '/texas-sports'],
  ["src/routes/texas-sports.index.tsx", '/texas-sports/'],
  ["src/routes/texas-sports.$league.tsx", '/texas-sports/$league'],
  ["src/routes/texas-sports.team.$team.tsx", '/texas-sports/team/$team'],
  ["src/routes/texas-sports.topic.$topic.tsx", '/texas-sports/topic/$topic'],
];

describe("TexasDefined sports ownership boundary", () => {
  it("keeps every retired KTR sports route as a permanent one-hop TexasDefined handoff", () => {
    for (const [path, route] of routeContracts) {
      const source = fs.readFileSync(path, "utf8");
      expect(source).toContain(`createFileRoute("${route}")`);
      expect(source).toContain("https://texasdefined.com/sports");
      expect(source).toContain("statusCode: 301");
      expect(source).toContain("location.searchStr");
      expect(source).not.toContain("rel: \"canonical\"");
      expect(source).not.toContain("Keep TX Red Sports");
    }
  });

  it("makes the database ownership boundary final and preserves already-published rows", () => {
    for (const token of [
      "create or replace function public.enforce_texasdefined_sports_ownership()",
      "zzzzzzzzzzzz_enforce_texasdefined_sports_ownership",
      "new.target_site := 'texasdefined'",
      "new.target_section := 'Sports'",
      "new.ready_for_rewrite := false",
      "new.internal_slug is not null or new.texasdefined_slug is not null",
      "internal_slug is null",
      "texasdefined_slug is null",
      "'site_ownership', 'texasdefined'",
      "'ownership_reason', 'Routine Texas sports coverage belongs on TexasDefined'",
    ]) {
      expect(migration).toContain(token);
    }
  });

  it("retains public-affairs sports stories on KTR without restoring routine sports ownership", () => {
    for (const section of ["Elections", "Politics", "Business", "Texas News"]) {
      expect(migration).toContain(`new.target_section := '${section}'`);
    }
    expect(contentIntelligence).toContain("Current Texas sports news belongs to TexasDefined.");
    expect(publicReadiness).toContain('"sports"');
    expect(publicReadiness).toContain('"sports culture"');
  });
});
