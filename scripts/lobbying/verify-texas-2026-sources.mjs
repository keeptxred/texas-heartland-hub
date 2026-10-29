/**
 * 2026 lobbying primary-source check. Fail closed: never mark a file checked when
 * the TEC server sends an error, an undersized body or a non-matching document.
 * The source monitor reports availability and changes; it does NOT claim that
 * KTR's illustrative sample is a real-time full registry.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const base = "https://www.ethics.state.tx.us";
const targets = [
  { id: "registration-list", url: base + "/search/lobby/loblistsREG2026-2030.php", kind: "html", minimum: 1000 },
  { id: "2026-client-pdf", url: base + "/data/search/lobby/2026/2026LobbyGroupByClient.pdf", kind: "pdf", minimum: 20000 },
  { id: "2026-client-excel", url: base + "/data/search/lobby/2026/2026LobbyGroupByClient.xlsx", kind: "xlsx", minimum: 10000 },
  { id: "compensation-2026", url: base + "/search/lobby/", kind: "html", minimum: 1000 },
  { id: "quarterly-expenditures", url: base + "/data/search/lobby/LobbyExpendituresByCategory.pdf", kind: "pdf", minimum: 5000 },
  { id: "adopted-rules", url: base + "/rules/adopted/2026-2030/adopted_May_2026.php", kind: "html", minimum: 1000 },
];
const outputPath = "src/data/lobbying-2026-source-status.json";
const previous = JSON.parse(readFileSync(outputPath, "utf8"));
const rows = [];

for (const target of targets) {
  let payload;
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(target.url, {
        redirect: "follow",
        signal: AbortSignal.timeout(30000),
        headers: {
          "User-Agent": "KeepTXRed-SourceVerification/1.0 (+https://keeptxred.com/texas-government/reference/texas-lobbying-2026)",
          "Accept": "*/*",
        },
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      payload = Buffer.from(await response.arrayBuffer());
      if (payload.byteLength < target.minimum) throw new Error("unexpectedly short document");
      if (target.kind === "pdf" && !payload.subarray(0, 5).equals(Buffer.from("%PDF-"))) throw new Error("non-PDF response");
      if (target.kind === "xlsx" && !payload.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) throw new Error("non-XLSX response");
      if (target.kind === "html") {
        const html = payload.toString("utf8");
        if (!/<html[\s>]/i.test(html)) throw new Error("non-HTML response");
        if (target.id === "compensation-2026" && !(html.includes("LOBBCOMP02") && html.includes("22,890") && html.includes("57,219"))) {
          throw new Error("2026 compensation codes no longer match verified source");
        }
        if (target.id === "adopted-rules" && !(html.includes("34.41") && html.includes("34.43") && html.includes("650") && html.includes("1,200"))) {
          throw new Error("2026 registration thresholds need editorial verification");
        }
      }
      lastError = null;
      break;
    } catch (error) {
      payload = null;
      lastError = error;
    }
  }
  if (!payload) throw new Error("Failed TEC source " + target.id + ": " + lastError);
  rows.push({
    id: target.id,
    url: target.url,
    sizeBytes: payload.byteLength,
    sha256: createHash("sha256").update(payload).digest("hex"),
  });
}

const previousById = new Map((previous.sources ?? []).map((entry) => [entry.id, entry.sha256]));
const changed = rows.filter((entry) => previousById.has(entry.id) && previousById.get(entry.id) !== entry.sha256).map((entry) => entry.id);
const output = {
  checkedAt: new Date().toISOString(),
  explanation: "Availability and SHA-256 of official sources, not the currentness of any individual registration or a complete 2026 lobbying total.",
  sourceChangesSinceLastCheck: changed,
  sources: rows,
};
writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import("node:fs");
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, "## 2026 TEC lobbying source check\n\n" +
    "Verified " + rows.length + " official sources.\n\n" +
    (changed.length ? "**Changed since prior verification:** " + changed.join(", ") : "No previously tracked source changed.") +
    "\n\nNo editorial facts or registration relationships were auto-inferred.\n");
}
console.log(JSON.stringify({ checkedAt: output.checkedAt, sourceCount: rows.length, changed }, null, 2));
