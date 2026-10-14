import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(
  new URL("../../.github/workflows/export-supabase-cold-archives.yml", import.meta.url),
  "utf8",
);
const exporter = fs.readFileSync(
  new URL("../../scripts/data/export-supabase-cold-archives.mjs", import.meta.url),
  "utf8",
);

describe("private published news recovery backup cadence", () => {
  it("keeps daily lightweight snapshots and weekly full cold exports in the same job", () => {
    expect(workflow).toContain("33 7 * * 0");
    expect(workflow).toContain("43 7 * * 1-6");
    expect(workflow).toContain("ARTICLE_SNAPSHOT_ONLY:");
    expect(workflow).toContain("github.event.schedule == '43 7 * * 1-6'");
    expect(workflow).toContain("secrets.SUPABASE_SERVICE_ROLE_KEY");
  });

  it("verifies a complete private copy before skipping expensive weekday cold-archive export", () => {
    const snapshot = exporter.indexOf("await snapshotPublishedArticles();");
    const dailyExit = exporter.indexOf("if (process.env.ARTICLE_SNAPSHOT_ONLY === '1')");
    const fullArchive = exporter.indexOf("const metadata = await listMetadata();");
    expect(snapshot).toBeGreaterThan(0);
    expect(dailyExit).toBeGreaterThan(snapshot);
    expect(fullArchive).toBeGreaterThan(dailyExit);
    expect(exporter).toContain("await storeAndReadBack(path, zipped, 'application/gzip')");
    expect(exporter).toContain("sha256(Buffer.from(JSON.stringify(reopened.tables)))");
    expect(exporter).toContain("readSnapshotTable('daily_article_archive', 'archive_id')");
    expect(exporter).toContain("readSnapshotTable('article_url_registry', 'slug')");
    expect(exporter).toContain("readSnapshotTable('article_slug_redirects', 'old_slug')");
  });
});
