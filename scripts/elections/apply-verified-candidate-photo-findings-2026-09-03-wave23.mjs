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
    candidateId: "candidate-oscar-rosa-republican-race-2026-texas-house-35",
    imageUrl: "https://img1.wsimg.com/isteam/ip/895c72a3-8ce4-4888-8748-546eabdc28df/Oscar%20Rosa%20Banner%2001b.png/%3A/",
    sourceUrl: "https://rosafortexas.com/",
    altText: "Oscar Rosa, Republican candidate for Texas House District 35",
    credit: "Oscar Rosa for District 35 campaign",
    license: null,
    permissionBasis: "Oscar Rosa's official campaign homepage identifies him as the candidate for Texas House District 35 and directly publishes this candidate-specific campaign image containing a clear photographic portrait of Rosa alongside his name and District 35 campaign identification. TCTA independently lists his District 35 candidacy and official candidate social profile. Used only for editorial candidate identification with exact official-campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-09-03T11:40:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 3 wave 23.`);
