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
    candidateId: "candidate-janet-tycelia-dudding-democratic-race-2026-texas-house-14",
    imageUrl: "https://run.imgix.net/6331b142-e6c6-4aeb-ada3-14cd7a88352b/89253d2c-b059-4139-bd64-d5a497421334/89253d2c-b059-4139-bd64-d5a497421334.jpeg?auto=compress%2Cformat&bri=0&con=18&fit=fillmax&high=0&ixlib=js-3.8.0&q=75&rect=247%2C0%2C322%2C435&sat=-42&shad=0&usm=0&w=2048",
    sourceUrl: "https://www.janetdudding4texas.com/",
    altText: "Janet Tycelia Dudding, Democratic candidate for Texas House District 14",
    credit: "Janet Dudding for HD14 campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published on Janet Dudding's official Texas House District 14 campaign homepage, which identifies Dudding as the HD14 candidate and carries the campaign's paid-political-advertising disclaimer. Used only for editorial candidate identification with exact campaign attribution and source provenance.",
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 62.`);
