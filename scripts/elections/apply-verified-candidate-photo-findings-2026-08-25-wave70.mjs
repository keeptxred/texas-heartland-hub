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
    candidateId: "candidate-tyler-smith-democratic-race-2026-texas-house-138",
    imageUrl: "https://tylerfortx.com/wp-content/uploads/2026/08/PbWdp0QY-1024x683.jpeg",
    sourceUrl: "https://tylerfortx.com/",
    altText: "Tyler Smith, Democratic candidate for Texas House District 138",
    credit: "Tyler Smith campaign",
    license: null,
    permissionBasis: "Candidate-identifying photograph published on Tyler Smith's official campaign website, which identifies him as a Democratic candidate for State Representative, District 138. The photograph appears in the campaign's About Tyler section and is used only for editorial candidate identification with campaign attribution and an exact source link.",
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 70.`);
