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
    candidateId: "candidate-michelle-williams-democratic-race-2026-texas-house-127",
    imageUrl: "https://michelleforstaterep.com/wp-content/uploads/elementor/thumbs/MWilliams_20180127_BH4A2887edited-scaled-rqnc6csi6mmedr9ffq4jun3ldm7qwczobwnrjwt8gg.webp",
    sourceUrl: "https://michelleforstaterep.com/",
    altText: "Michelle Williams, Democratic candidate for Texas House District 127",
    credit: "Campaign Fund for Michelle Williams",
    license: null,
    permissionBasis: "Candidate portrait published on the official campaign website and used for editorial candidate identification with attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile-via-party-directory-bridge",
    discoveredAt: "2026-08-24T12:55:00.000Z"
  },
  {
    candidateId: "candidate-stefanie-bord-democratic-race-2026-texas-house-126",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68f10775ea87e2614c98b521/d5740126-ab7c-42cb-b293-c6b367a9bf62/sitting.jpg",
    sourceUrl: "https://www.stefaniebordfortexas.com/",
    altText: "Stefanie Bord, Democratic candidate for Texas House District 126",
    credit: "Stefanie Bord for Texas 126",
    license: null,
    permissionBasis: "Candidate image published on the official campaign website and used for editorial candidate identification with attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile-via-party-directory-bridge",
    discoveredAt: "2026-08-24T12:55:00.000Z"
  },
  {
    candidateId: "candidate-desiree-klaus-democratic-race-2026-texas-house-128",
    imageUrl: "https://content.campaignpartner.net/images/145700/471915869_10162020540179291_8617183942708209124_n.jpg",
    sourceUrl: "https://desireeklaustx.com/meet-desiree",
    altText: "Desiree Klaus, Democratic candidate for Texas House District 128",
    credit: "Desiree Klaus Campaign",
    license: null,
    permissionBasis: "Candidate family image published on the official campaign biography page and used for editorial candidate identification with attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile-via-party-directory-bridge",
    discoveredAt: "2026-08-24T12:55:00.000Z"
  },
  {
    candidateId: "candidate-junior-ezeonu-democratic-race-2026-texas-house-101",
    imageUrl: "https://static.wixstatic.com/media/0a8871_b84abb8e458e4538b14306836c003da0~mv2.jpeg/v1/fill/w_980,h_968,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2026%20headshot.jpeg",
    sourceUrl: "https://www.votejuniorezeonu.com/",
    altText: "Junior Ezeonu, Democratic candidate for Texas House District 101",
    credit: "Junior Ezeonu Campaign",
    license: null,
    permissionBasis: "Image explicitly labeled as the candidate's 2026 headshot on the official campaign website and used for editorial candidate identification with attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-labeled-headshot-via-voter-guide-bridge",
    discoveredAt: "2026-08-24T13:01:00.000Z"
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
console.log(`Applied ${applied} verified candidate portraits from official campaign sites.`);
