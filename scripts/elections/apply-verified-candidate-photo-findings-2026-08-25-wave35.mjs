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
    candidateId: "candidate-scott-bowen-republican-race-2026-texas-house-129",
    imageUrl: "https://bowenfortx.com/wp-content/uploads/2025/05/Scott-Bowen.jpg",
    sourceUrl: "https://bowenfortx.com/",
    altText: "Scott Bowen, Republican candidate for Texas House District 129",
    credit: "Scott Bowen Campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published on Scott Bowen's official Texas House District 129 campaign website, which identifies Bowen as the HD 129 Republican candidate and is paid for by the Scott Bowen Campaign. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-website"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, { ...finding, discoveredAt: new Date().toISOString() });
  applied += 1;
}

await writeFile(
  manifestPath,
  JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
);
console.log(`Applied ${applied} verified candidate portrait(s) from wave 35.`);
