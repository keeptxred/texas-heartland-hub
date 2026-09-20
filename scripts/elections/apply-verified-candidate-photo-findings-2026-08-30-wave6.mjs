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
    candidateId: "candidate-brittany-black-democratic-race-2026-texas-house-61",
    imageUrl: "https://beta2.communityimpact.com/uploads/images/qa/173486_2902.jpg",
    sourceUrl: "https://communityimpact.com/dallas-fort-worth/mckinney/election/2026/02/18/qa-meet-the-candidates-running-the-texas-house-district-61-democratic-primary-race/",
    altText: "Brittany Black, Democratic candidate for Texas House District 61",
    credit: "Brittany Black campaign / Community Impact",
    license: null,
    permissionBasis: "Community Impact's February 18, 2026 Texas House District 61 Democratic primary Q&A identifies Brittany Black and explicitly states that the candidate photos were submitted by the candidates. The candidate-specific Brittany Black image is embedded directly with her Q&A entry. Used only for editorial candidate identification with exact article attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-photo",
    discoveredAt: "2026-08-30T18:22:00.000Z"
  },
  {
    candidateId: "candidate-beth-llewellyn-mclaughlin-democratic-race-2026-texas-house-97",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6938770b1b9b992db7673d80/948640b6-bc6a-4bf8-b06c-f182e204d464/unnamed.jpg?format=2500w",
    sourceUrl: "https://www.bethfor97.com/",
    altText: "Beth Llewellyn McLaughlin, Democratic candidate for Texas House District 97",
    credit: "Beth Llewellyn McLaughlin campaign",
    license: null,
    permissionBasis: "Beth Llewellyn McLaughlin's official campaign homepage identifies her as the Democratic candidate for Texas House District 97 and publishes this candidate-specific portrait as a campaign image. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:22:00.000Z"
  },
  {
    candidateId: "candidate-denise-wooten-democratic-race-2026-texas-house-63",
    imageUrl: "https://static.wixstatic.com/media/a4b169_40dc6c9ba7d14fe2aaeedceadcbe15f9~mv2.jpeg/v1/crop/x_0,y_314,w_1170,h_525/fill/w_1002,h_450,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Image.jpeg",
    sourceUrl: "https://www.wooten-for-texas.com/",
    altText: "H. Denise Wooten, Democratic candidate for Texas House District 63",
    credit: "H. Denise Wooten for Texas House District 63 campaign",
    license: null,
    permissionBasis: "H. Denise Wooten's official campaign homepage identifies her as running for Texas State Representative House District 63 and publishes a candidate-specific campaign portrait. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:22:00.000Z"
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
console.log(`Applied ${applied} verified candidate portraits from August 30 wave 6.`);
