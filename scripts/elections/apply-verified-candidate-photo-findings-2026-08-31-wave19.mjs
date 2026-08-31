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
    candidateId: "candidate-oziel-ozzie-ochoa-jr-democratic-race-2026-texas-house-37",
    imageUrl: "https://static.wixstatic.com/media/99076a_b3ff6e870234429ea80dc5260936d2df~mv2.jpg/v1/crop/x_90%2Cy_0%2Cw_1821%2Ch_1766/fill/w_528%2Ch_499%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/006A0806_edited_edited.jpg",
    sourceUrl: "https://www.ochoafortx37.com/meet-ozzie",
    altText: "Oziel Ozzie Ochoa Jr., Democratic candidate for Texas House District 37",
    credit: "Ochoa for Texas House District 37 campaign",
    license: null,
    permissionBasis: "Oziel 'Ozzie' Ochoa Jr.'s official campaign biography identifies him as running for Texas House District 37 and publishes this candidate-specific photograph directly within the Meet Ozzie biography, immediately before the section describing his Rio Grande Valley background. Used only for editorial candidate identification with exact official-campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-31T10:32:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from August 31 wave 19.`);
