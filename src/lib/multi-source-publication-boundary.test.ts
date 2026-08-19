import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./multi-source-publish.ts", import.meta.url), "utf8");

describe("core newsroom publication boundary", () => {
  it("loads target_site for the primary feed item and rejects non-KTR routes", () => {
    expect(source).toContain('select("id,title,link,source,description,pub_date,internal_slug,extracted_body,target_site")');
    expect(source).toContain('primary.target_site !== "keeptxred"');
    expect(source).toContain('Publication held: feed item is routed to ${primary.target_site}, not KeepTXRed.');
  });

  it("excludes non-KTR feed rows from multi-source clustering", () => {
    expect(source).toContain("const recentKeepTxRed = (recent ?? []).filter(");
    expect(source).toContain('!row.target_site || row.target_site === "keeptxred"');
    expect(source).toContain("buildStoryCluster(primary, recentKeepTxRed as ClusterableFeedItem[]");
  });
});
