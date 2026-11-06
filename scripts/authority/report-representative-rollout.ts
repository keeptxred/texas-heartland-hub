#!/usr/bin/env bun
/**
 * Deterministic source-level inventory of every current KTR representative.
 * This is NOT a claim that production is deployed, Google has indexed a URL,
 * or that an unreviewed profile has insufficient public source material.
 *
 * Run with: bun scripts/authority/report-representative-rollout.ts
 * Keep this as a separate publication ledger from external GSC monitoring.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  US_SENATORS, STATE_LEADERSHIP, US_HOUSE_DELEGATION,
  TEXAS_SENATE_MEMBERS, TEXAS_HOUSE_MEMBERS,
  FORMER_TEXAS_HOUSE_MEMBERS, TEXAS_ROSTER_REVIEWED_AT,
  representativeSlug, type Rep,
} from "../../src/data/representatives";
import { getRepresentativeAuthority } from "../../src/data/representative-authority";
import {
  applyPilotEditorial, certifyRepresentative, type RepresentativeCertificationState,
} from "../../src/lib/representative-quality-gates";

const DATA_PATH = "docs/operations/representative-authority-inventory.json";
const REPORT_PATH = "docs/operations/representative-authority-inventory.md";
const ORIGIN = "https://keeptxred.com";
const ownerExceptions = new Set(["dan-crenshaw", "john-cornyn"]);
const validStates = new Set<RepresentativeCertificationState>([
  "AUTHORITY_READY", "NOT_READY", "VERIFICATION_FAILED",
]);

const current: Rep[] = [
  ...US_SENATORS, ...STATE_LEADERSHIP, ...US_HOUSE_DELEGATION,
  ...TEXAS_SENATE_MEMBERS, ...TEXAS_HOUSE_MEMBERS,
];
const former: Rep[] = [...FORMER_TEXAS_HOUSE_MEMBERS];

function inventory(representatives: Rep[], group: "current" | "historical") {
  const seen = new Set<string>();
  return representatives.map((member) => {
    const slug = representativeSlug(member.name);
    if (!slug || seen.has(slug)) {
      throw new Error(`Duplicate or empty ${group} representative slug: ${slug}`);
    }
    seen.add(slug);
    const authority = applyPilotEditorial(slug, getRepresentativeAuthority(slug) ?? null);
    const certification = certifyRepresentative({ slug, representative: member, authority });
    if (!validStates.has(certification.state)) {
      throw new Error(`Unknown certification state: ${slug} ${certification.state}`);
    }
    if (group === "historical" && certification.state === "AUTHORITY_READY") {
      throw new Error(`Historical officeholder incorrectly indexable: ${slug}`);
    }
    const eligible = group === "current" && certification.state === "AUTHORITY_READY";
    const detailPath = `/representatives/${slug}`;
    return {
      slug,
      name: member.name,
      office: member.office,
      district: member.district ?? null,
      party: member.party,
      canonicalUrl: `${ORIGIN}${detailPath}`,
      officialWebsite: member.website,
      group,
      certification: certification.state,
      gates: certification.gates,
      failureReasons: certification.reasons,
      officialSource: certification.officialSource ?? null,
      lastIdentityReview: certification.evaluatedAt,
      researchCapture: certification.researchCapture ?? null,
      officialResearchRecords: certification.evidenceCount,
      qualifiedForRepresentativeSitemap: eligible,
      serverRobotsPolicy: eligible ? "index,follow" : "noindex,follow",
      ownerApprovedException: ownerExceptions.has(slug),
    };
  }).sort((a, b) => a.slug.localeCompare(b.slug));
}

const rows = inventory(current, "current");
const archived = inventory(former, "historical");
const overlap = new Set(rows.map((row) => row.slug));
for (const entry of archived) {
  if (overlap.has(entry.slug)) {
    throw new Error(`Current and historical profile collide at ${entry.canonicalUrl}`);
  }
}
for (const slug of ownerExceptions) {
  const item = rows.find((row) => row.slug === slug);
  if (!item || item.certification !== "NOT_READY" || item.qualifiedForRepresentativeSitemap) {
    throw new Error(`Owner exception is missing or improperly certified: ${slug}`);
  }
}

const counts = {
  totalCurrentProfiles: rows.length,
  authorityReady: rows.filter((row) => row.certification === "AUTHORITY_READY").length,
  notReady: rows.filter((row) => row.certification === "NOT_READY").length,
  verificationFailed: rows.filter((row) => row.certification === "VERIFICATION_FAILED").length,
  limitedOwnerExceptions: rows.filter((row) => row.ownerApprovedException).length,
  historicalPublicNoindex: archived.length,
};
if (counts.totalCurrentProfiles !== counts.authorityReady + counts.notReady + counts.verificationFailed) {
  throw new Error("Representative inventory lost an unclassified profile");
}
if (counts.limitedOwnerExceptions !== ownerExceptions.size) {
  throw new Error("Expected both limited owner exceptions to remain explicit");
}

const manifest = {
  schemaVersion: 1,
  purpose: "Exhaustive internal KTR representative authority and indexability disposition, not Google's indexing verdict.",
  officialTexasRosterReviewedAt: TEXAS_ROSTER_REVIEWED_AT,
  policy: "Six independent evidence/identity/editorial gates A-F; excluded pages remain available with SSR noindex,follow and outside the representative XML sitemap.",
  productionVerification: "NOT ASSERTED: verify the exact main release, dual-host server HTML, actual sitemap and Chromium in GitHub Actions before counting deployed certification.",
  googleSearchConsole: "NOT ASSERTED: a technical readiness state is not a GSC coverage/ranking signal.",
  counts,
  currentProfiles: rows,
  historicalRetainedProfiles: archived,
};

const report = [
  "# KTR representative authority — exhaustive source-level inventory",
  "",
  "> This inventory is generated from the same six-gate calculation as the site. It is a source-level disposition, **not** a production deployment certificate or a Google indexing decision.",
  "",
  `Official Texas roster last source review: ${TEXAS_ROSTER_REVIEWED_AT}.`,
  "",
  `- Current profiles: **${counts.totalCurrentProfiles}**`,
  `- Authority-ready source candidates: **${counts.authorityReady}**`,
  `- Not ready, public noindex: **${counts.notReady}**`,
  `- Verification failed, public noindex: **${counts.verificationFailed}**`,
  `- Named owner exceptions (within not-ready): **${counts.limitedOwnerExceptions}**`,
  `- Separate historical, public noindex: **${counts.historicalPublicNoindex}**`,
  "",
  "Every current profile has a canonical URL, identity/source coverage, six gate booleans, individual failure reasons, and its sitemap/robots disposition in [the complete JSON ledger](./representative-authority-inventory.json).",
  "",
  "## Indexing guardrails",
  "",
  "Only six-gate AUTHORITY_READY candidates belong in /sitemap-representatives.xml, with matching server-rendered index/follow; unready or identity-conflicting profiles remain user accessible with noindex/follow. A missing bill record does **not** mean zero legislative activity. The two existing exceptions are Dan Crenshaw and John Cornyn; this manifest does not grant any others.",
  "",
  "## Verification and outstanding scope",
  "",
  "This generator does not contact government sites, mutate an official source, promote unknown pages, or mistake an upstream outage for a content failure. Official roster refresh, source review, protected CI, full custom-domain/Worker smoke, and Google Search Console monitoring are distinct. See [master issue #3428](https://github.com/keeptxred/texas-heartland-hub/issues/3428) for verified deploy SHA, actual production count, pending cohort work and Google reports. Never close this issue merely because the ledger covers the roster.",
  "",
].join("\n");

await mkdir(dirname(DATA_PATH), { recursive: true });
await writeFile(DATA_PATH, JSON.stringify(manifest, null, 2) + "\n");
await writeFile(REPORT_PATH, report);
console.log(JSON.stringify({ counts, paths: [DATA_PATH, REPORT_PATH] }));
