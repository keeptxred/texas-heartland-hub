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
    candidateId: "candidate-a-yonna-kellum-democratic-race-2026-texas-house-150",
    imageUrl: "https://beta2.communityimpact.com/uploads/images/qa/171623_2721.jpg",
    sourceUrl: "https://communityimpact.com/houston/spring-klein/election/2026/01/29/qa-meet-the-democratic-candidates-for-the-house-district-150-race/",
    altText: "A'Yonna Kellum, Democratic candidate for Texas House District 150",
    credit: "A'Yonna Kellum campaign, via Community Impact",
    license: null,
    permissionBasis: "Community Impact's 2026 Texas House District 150 candidate Q&A explicitly states that all candidate photos were submitted by the respective candidates. This candidate-specific image appears with A'Yonna Kellum's profile and is used only for editorial candidate identification with candidate/newsroom attribution and an exact source link.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-photo",
    discoveredAt: "2026-08-30T17:20:00.000Z"
  },
  {
    candidateId: "candidate-jacqueline-jacky-hernandez-democratic-race-2026-texas-house-21",
    imageUrl: "https://i.imgur.com/7NnZwe9.jpeg",
    sourceUrl: "https://votejacky21.com/about",
    altText: "Jacqueline Jacky Hernandez, Democratic candidate for Texas House District 21",
    credit: "Jacqueline Jacky Hernandez for Texas House District 21 campaign",
    license: null,
    permissionBasis: "Candidate-identifying headshot published directly on Jacqueline 'Jacky' Hernandez's official Texas House District 21 campaign biography page, where the campaign identifies her by name and states that she is running for State Representative. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T17:20:00.000Z"
  },
  {
    candidateId: "candidate-ray-callas-republican-race-2026-texas-house-21",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68a8a06803c3f043bcfd5e70/abd42aab-81e3-49a8-9144-a447d2924ed1/Untitled%2Bdesign%2B%281%29.png",
    sourceUrl: "https://www.raycallasfortexas.com/",
    altText: "Ray Callas, Republican candidate for Texas House District 21",
    credit: "Ray Callas for Texas campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published directly on Ray Callas's official Texas House District 21 campaign homepage beside the campaign biography identifying him as Dr. Ray Callas for Texas House District 21. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile",
    discoveredAt: "2026-08-30T17:24:00.000Z"
  },
  {
    candidateId: "candidate-moniqua-s-scott-democratic-race-2026-texas-house-15",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68e6f12b33e3341b28415264/faef0d88-a67e-4874-ae74-22afdbf60ee6/M-83.jpg",
    sourceUrl: "https://www.scottforhd15.com/",
    altText: "Moniqua S. Scott, Democratic candidate for Texas House District 15",
    credit: "Moniqua S. Scott for Texas House District 15 campaign",
    license: null,
    permissionBasis: "Candidate-specific image is published on Moniqua S. Scott's official Texas House District 15 campaign homepage immediately following the campaign's Meet Moniqua biography, which identifies her and her HD15 candidacy. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T17:28:00.000Z"
  },
  {
    candidateId: "candidate-alexandria-nicole-butler-republican-race-2026-texas-house-146",
    imageUrl: "https://alexandriabutlercampaign.org/wp-content/uploads/2025/04/Butler-post-800x533-1.jpg",
    sourceUrl: "https://alexandriabutlercampaign.org/",
    altText: "Alexandria Nicole Butler, Republican candidate for Texas House District 146",
    credit: "Alex Butler campaign",
    license: null,
    permissionBasis: "Candidate-identifying image is published directly on Alexandria Butler's campaign website beside the campaign biography naming Alexandria Butler. The Harris County GOP 2026 candidate directory identifies this campaign domain for Alexandria Nicole Butler in Texas House District 146. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile",
    discoveredAt: "2026-08-30T17:28:00.000Z"
  },
  {
    candidateId: "candidate-liz-ramos-republican-race-2026-texas-house-135",
    imageUrl: "https://storage.mlcdn.com/account_image/1376546/Ml0DfonkYQ8l8gLIJr3n0SPkHHc6o9gnkl7uoyho.jpg",
    sourceUrl: "https://lizramosfortexas.com/",
    altText: "Liz Ramos, Republican candidate for Texas House District 135",
    credit: "Liz Ramos for Texas campaign",
    license: null,
    permissionBasis: "Candidate-identifying headshot is published directly at the start of the About Liz Ramos section on the official Liz Ramos campaign website, which explicitly identifies her as the Republican candidate for Texas House District 135. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T17:30:00.000Z"
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
console.log(`Applied ${applied} verified candidate portraits from August 30 wave 2.`);
