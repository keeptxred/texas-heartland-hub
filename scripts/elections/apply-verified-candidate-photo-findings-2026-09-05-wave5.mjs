#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));

const findings = [
  {
    candidateId: "candidate-andrew-turner-democratic-race-2026-texas-house-59",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68eecab6436a303c7c97c3f1/e9f333b4-fd36-4423-826b-47606ae9b92d/Screenshot%2B2025-12-27%2B013922.png",
    sourceUrl: "https://www.turnerforstatehouse.com/",
    altText: "Andrew Turner, Democratic candidate for Texas House District 59",
    credit: "Andrew Turner for Texas HD 59 campaign",
    license: null,
    permissionBasis: "Andrew Turner's official Texas House District 59 campaign website identifies him as the candidate and directly publishes this candidate-specific portrait on the campaign-controlled site. Used only for narrow editorial candidate identification with exact campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-site-portrait",
    discoveredAt: "2026-09-05T18:41:00.000Z"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, finding);
  applied += 1;
}

await writeFile(
  manifestPath,
  JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
);
console.log(`Applied ${applied} verified official campaign portrait(s).`);

// Current-main replay marker: September 6, 2026 after source registry wave 1 merge #2013.
