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
    candidateId: "candidate-chris-jimenez-democratic-race-2026-texas-house-52",
    imageUrl: "https://run.imgix.net/a568c529-7b55-4b2d-bb76-91c780efdce5/7ceb5c1e-3f74-4909-9fd7-b9d27bdb17c4/7ceb5c1e-3f74-4909-9fd7-b9d27bdb17c4.jpg?auto=compress%2Cformat&bri=0&con=0&fit=fillmax&high=0&ixlib=js-3.8.0&q=75&rect=0%2C0%2C1104%2C632&sat=0&shad=0&usm=0&w=2048",
    sourceUrl: "https://www.chrisjimenezforhd52.com/meetchris",
    altText: "Chris Jimenez, Democratic candidate for Texas House District 52",
    credit: "Chris Jimenez for Texas House District 52 campaign",
    license: null,
    permissionBasis: "Chris Jimenez's official campaign biography identifies him as a candidate for Texas House District 52 and directly publishes this candidate-specific image as the 'Introductory photo' within the Meet Chris biography. The campaign site is explicitly paid for by Chris Jimenez for Texas House District 52 and separately states that use of photographs in uniform does not imply Department of the Navy or Department of Defense endorsement. Used only for narrow editorial candidate identification with exact official-campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-09-05T05:08:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 5 wave 26.`);
