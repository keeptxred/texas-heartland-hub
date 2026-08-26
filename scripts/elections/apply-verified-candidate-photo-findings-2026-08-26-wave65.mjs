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
    candidateId: "candidate-brad-bailey-republican-race-2026-texas-house-15",
    imageUrl: "https://bradbaileycampaign.com/pojiman/themes/bailey-tx/assets/images/1_hero_fg.png",
    sourceUrl: "https://bradbaileycampaign.com/",
    altText: "Brad Bailey, Republican candidate for Texas House District 15",
    credit: "Brad Bailey campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published on Brad Bailey's official Texas House District 15 campaign website, which identifies Bailey as running for the Texas House. Used only for editorial candidate identification with exact campaign attribution and source provenance.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 65.`);
