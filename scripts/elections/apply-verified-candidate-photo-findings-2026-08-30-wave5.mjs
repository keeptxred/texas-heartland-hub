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
    candidateId: "candidate-julie-evans-democratic-race-2026-texas-house-64",
    imageUrl: "https://assets.communityimpact.com/uploads/elections/candidates/julie-evans.jpeg",
    sourceUrl: "https://communityimpact.com/denton/election/qa-meet-the-democratic-primary-candidates-for-texas-house-district-64/",
    altText: "Julie Evans, Democratic candidate for Texas House District 64",
    credit: "Julie Evans campaign / Community Impact",
    license: null,
    permissionBasis: "Community Impact's February 13, 2026 Texas House District 64 candidate Q&A identifies Julie Evans as a Democratic HD64 candidate and states that the candidate photos are courtesy of the candidates/Community Impact. The page exposes the candidate-specific Julie Evans image asset. Used only for editorial candidate identification with exact article attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-photo",
    discoveredAt: "2026-08-30T18:12:00.000Z"
  },
  {
    candidateId: "candidate-armin-mizani-republican-race-2026-texas-house-98",
    imageUrl: "https://beta2.communityimpact.com/uploads/images/qa/172889_2842.jpg",
    sourceUrl: "https://communityimpact.com/dallas-fort-worth/grapevine-colleyville-southlake/election/2026/02/12/qa-meet-the-republican-primary-candidates-for-texas-house-district-98/",
    altText: "Armin Mizani, Republican candidate for Texas House District 98",
    credit: "Armin Mizani campaign / Community Impact",
    license: null,
    permissionBasis: "Community Impact's February 13, 2026 Texas House District 98 candidate Q&A identifies Armin Mizani as an HD98 Republican candidate and explicitly states that the photos were submitted by the candidates. The candidate-specific Armin Mizani image is embedded directly with his Q&A entry. Used only for editorial candidate identification with exact article attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-photo",
    discoveredAt: "2026-08-30T18:15:00.000Z"
  },
  {
    candidateId: "candidate-cate-brennan-democratic-race-2026-texas-house-98",
    imageUrl: "https://cdn.durable.co/blocks/2fK5122NPsoOYS9oQ0P7jbml8H4YLXAMK1isltmeBHQMi9CiTfHlQlAmzLbscTL7.png",
    sourceUrl: "https://brennanforhd98.com/",
    altText: "Cate Brennan, Democratic candidate for Texas House District 98",
    credit: "Cate Brennan for Texas House District 98 campaign",
    license: null,
    permissionBasis: "Cate Brennan's official campaign homepage identifies her as a Texas House District 98 candidate and publishes a candidate-specific image labeled 'Cate Brennan, HD98'. Used only for editorial candidate identification with exact official-campaign source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:18:00.000Z"
  },
  {
    candidateId: "candidate-dawn-richardson-democratic-race-2026-texas-house-54",
    imageUrl: "https://static.wixstatic.com/media/76eb86_0dca96a374b241d4812a4aae72b4858f~mv2.png/v1/fill/w_489,h_489,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/76eb86_0dca96a374b241d4812a4aae72b4858f~mv2.png",
    sourceUrl: "https://www.dawn4texas.org/",
    altText: "Dawn Richardson, Democratic candidate for Texas House District 54",
    credit: "Committee to Elect Dawn Richardson campaign",
    license: null,
    permissionBasis: "Dawn Richardson's official campaign homepage identifies her as running for Texas Representative House District 54 and publishes the candidate-specific image named 'dawn new pic.png'. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:18:00.000Z"
  },
  {
    candidateId: "candidate-amelia-rabroker-democratic-race-2026-texas-house-55",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68dd66c9495e086feae30b48/be89976a-69ca-4b5b-88aa-2c82fde2211a/DSC_3803.jpg",
    sourceUrl: "https://www.ameliafortexas.com/",
    altText: "Amelia Rabroker, Democratic candidate for Texas House District 55",
    credit: "Amelia for Texas campaign",
    license: null,
    permissionBasis: "Amelia Rabroker's official campaign homepage identifies her as running for House District 55 and publishes a candidate-specific image with the alt text 'Amelia Rabroker is running to be the Texas State House District 55 representative.' Used only for editorial candidate identification with exact official-campaign attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:18:00.000Z"
  },
  {
    candidateId: "candidate-katie-o-brien-duzan-democratic-race-2026-texas-house-94",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6901306b9dd4073c760bd3f9/2bca5101-f25d-47c5-8af9-d57ea00ada45/Tasha%2BN_23-02-07_0791.JPG",
    sourceUrl: "https://www.katiefor94.com/",
    altText: "Katie O'Brien Duzan, Democratic candidate for Texas House District 94",
    credit: "Katie for Texas campaign",
    license: null,
    permissionBasis: "Katie O'Brien Duzan's official campaign homepage identifies her as the Democratic nominee for Texas House District 94 and publishes her campaign headshot prominently at the top of the page. Used only for editorial candidate identification with exact official-campaign attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:18:00.000Z"
  },
  {
    candidateId: "candidate-merrie-fox-democratic-race-2026-texas-house-73",
    imageUrl: "https://static.wixstatic.com/media/606466_0837bcce139b4c4b8d291d9d3b760c08~mv2.jpg/v1/fill/w_443,h_451,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Fox%20web%20pic_HomePageTop_edited.jpg",
    sourceUrl: "https://www.foxfortexas.com/",
    altText: "Merrie Fox, Democratic candidate for Texas House District 73",
    credit: "Merrie Fox for Texas House District 73 campaign",
    license: null,
    permissionBasis: "Merrie Fox's official campaign homepage identifies her as running for Texas House District 73 and publishes the candidate-specific image 'Fox web pic_HomePageTop_edited.jpg' immediately above that campaign identification. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:18:00.000Z"
  },
  {
    candidateId: "candidate-george-flint-republican-race-2026-texas-house-70",
    imageUrl: "https://texansforflint.com/images/headshot.png",
    sourceUrl: "https://texansforflint.com/",
    altText: "George Flint, Republican candidate for Texas House District 70",
    credit: "George Flint Campaign for HD 70",
    license: null,
    permissionBasis: "George Flint's official campaign homepage identifies him as a candidate for Texas House District 70 and publishes a candidate-specific headshot directly beside that identification. Used only for editorial candidate identification with exact official-campaign attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:18:00.000Z"
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
console.log(`Applied ${applied} verified candidate portraits from August 30 wave 5.`);
