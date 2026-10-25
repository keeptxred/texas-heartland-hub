import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("hourly KTR publication recovery uses an adequate request budget", () => {
  const migration = readFileSync(
    "supabase/migrations/20261025222700_ktr_publishing_safety_net_http_timeout.sql",
    "utf8",
  );
  const server = readFileSync("src/routes/api/public/hooks/publishing-safety-net.ts", "utf8");

  it("keeps exactly one hourly reserve-check job with an explicit 480s timeout", () => {
    expect(migration).toContain("cron.unschedule('publishing-safety-net-hourly')");
    expect(migration).toContain("cron.schedule(");
    expect(migration).toContain("'17 * * * *'");
    expect(migration).toContain("timeout_milliseconds := 480000");
    expect(migration).toContain("https://keeptxred-site.freddy-coppola.workers.dev/api/public/hooks/publishing-safety-net");
    expect(migration).toContain("net.http_post(");
    expect(migration).not.toContain("https://keeptxred.com/api/public/hooks/publishing-safety-net");
  });

  it("leaves the actual guarded publication and image-preparation checks intact", () => {
    expect(server).toContain("isOlderThan24Hours");
    expect(server).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
    expect(server).toContain("if (!preparedImage.ok || !preparedImage.url || !preparedImage.imageValidationNote)");
    expect(server).toContain("reserve_newsroom_image_publication_hold:");
    expect(server).toContain('image_generation_status: "ready"');
    expect(server).toContain("Never publish more than one reserve article per stalled run");
  });
});
