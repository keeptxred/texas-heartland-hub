/**
 * 2026 lobbying primary-source check. Fail closed: never mark a file checked when
 * the TEC server sends an error, an undersized body or a non-matching document.
 * The source monitor reports availability and changes; it does NOT claim that
 * KTR's illustrative sample is a real-time full registry.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseTexasLobbyExpenditures } from "./parse-texas-expenditures.mjs";

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
let expenditureReport = null;

for (const target of targets) {
  let payload;
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
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
      } catch (networkError) {
        // GitHub-hosted Node fetch can fail before receiving an HTTP response.
        // Retry through system curl with normal certificate validation and
        // forced IPv4; never use a stale cached copy or ignore source checks.
        if (!(networkError instanceof TypeError && String(networkError).includes("fetch failed"))) throw networkError;
        payload = execFileSync("curl", [
          "--fail-with-body", "--location", "--silent", "--show-error",
          "--ipv4", "--retry", "2", "--retry-delay", "2",
          "--connect-timeout", "15", "--max-time", "60",
          "--user-agent", "KeepTXRed-SourceVerification/1.0",
          target.url,
        ], { maxBuffer: 32 * 1024 * 1024, timeout: 90000 });
      }
      if (payload.byteLength < target.minimum) throw new Error("unexpectedly short document");
      if (target.kind === "pdf" && !payload.subarray(0, 5).equals(Buffer.from("%PDF-"))) throw new Error("non-PDF response");
      if (target.kind === "xlsx" && !payload.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) throw new Error("non-XLSX response");
      if (target.kind === "html") {
        const html = payload.toString("utf8");
        if (!/<html[\s>]/i.test(html)) throw new Error("non-HTML response");
        if (target.id === "registration-list" &&
            !(html.includes("2026 Registered Lobbyists with Clients") &&
              html.includes("2026LobbyGroupByClient.pdf"))) {
          throw new Error("TEC registration directory structure not found");
        }
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
  if (target.id === "quarterly-expenditures") {
    const directory = mkdtempSync(join(tmpdir(), "ktr-tec-pdf-"));
    try {
      const file = join(directory, "tec-expenditures.pdf");
      writeFileSync(file, payload);
      const text = execFileSync("pdftotext", ["-layout", file, "-"], {
        encoding: "utf8", maxBuffer: 1024 * 1024, timeout: 30000,
      });
      expenditureReport = parseTexasLobbyExpenditures(text);
      // A mirror/CDN must never silently roll a source-dated report backwards.
      if (previous.expenditures?.reportPrintedAt &&
          new Date(expenditureReport.reportPrintedAt) < new Date(previous.expenditures.reportPrintedAt)) {
        throw new Error("TEC expenditure PDF report date regressed behind the published snapshot");
      }
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }
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
  explanation: "Last changed fingerprints of official sources, not the date of the latest GitHub Actions check or the currentness of any individual registration.",
  sourceChangesSinceLastCheck: changed,
  expenditures: expenditureReport,
  registrationChangedSinceEditorialReview: Boolean(previous.registrationChangedSinceEditorialReview) || changed.some((id) => id === "2026-client-pdf" || id === "2026-client-excel"),
  sources: rows,
};
const unchanged = previous.sources?.length === rows.length
  && rows.every((entry) => previousById.get(entry.id) === entry.sha256)
  && Boolean(previous.registrationChangedSinceEditorialReview) === output.registrationChangedSinceEditorialReview
  && JSON.stringify(previous.expenditures ?? null) === JSON.stringify(output.expenditures);
if (!unchanged) {
  writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");
} else {
  console.log("No source-content changes; skipping unnecessary status commit and site rebuild.");
}
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import("node:fs");
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, "## 2026 TEC lobbying source check\n\n" +
    "Verified " + rows.length + " official sources and reconciled PDF totals.\n\n" +
    (changed.length ? "**Changed since prior verification:** " + changed.join(", ") : "No previously tracked source changed.") +
    "\n\nNo editorial facts or registration relationships were auto-inferred.\n");
}
console.log(JSON.stringify({ checkedAt: output.checkedAt, sourceCount: rows.length, changed }, null, 2));
