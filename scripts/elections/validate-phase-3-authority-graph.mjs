#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const files = {
  authority: await readFile('src/lib/authority-entity.ts', 'utf8'),
  paths: await readFile('src/lib/authority-entity-paths.ts', 'utf8'),
  candidate: await readFile('src/lib/candidate-authority.ts', 'utf8'),
  race: await readFile('src/lib/race-authority.ts', 'utf8'),
  registry: await readFile('src/lib/election-authority-registry.ts', 'utf8'),
  candidateProjection: await readFile('src/types/elections/candidateProjections.ts', 'utf8'),
  raceProjection: await readFile('src/types/elections/raceProjections.ts', 'utf8'),
};

const checks = [
  ['race canonical entity type', files.authority.includes("'race'")],
  ['race canonical route', files.paths.includes("race: '/elections/races/'")],
  ['candidate race IDs resolved to slugs', files.candidate.includes('raceSlugById') && !files.candidate.includes("createAuthorityEntityKey('race', String(raceId))")],
  ['race candidate IDs resolved to slugs', files.race.includes('candidateSlugById')],
  ['race district IDs resolved to slugs', files.race.includes('districtSlug')],
  ['unified election authority registry', files.registry.includes('createElectionAuthorityRegistry')],
  ['unresolved relationship diagnostics', files.registry.includes('unresolvedCandidateRaceIds') && files.registry.includes('unresolvedRaceCandidateIds') && files.registry.includes('unresolvedRaceDistrictIds')],
  ['candidate finance projection', files.candidateProjection.includes('CandidateFundraisingSummary') && files.candidateProjection.includes('campaignFinanceUrl')],
  ['candidate endorsement projection', files.candidateProjection.includes('CandidateEndorsementSummary')],
  ['candidate issues and voting records', files.candidateProjection.includes('issuePositions?') && files.candidateProjection.includes('votingRecord?')],
  ['candidate polling projection', files.candidateProjection.includes('CandidatePollingComparisonSummary')],
  ['race polling forecast results', files.raceProjection.includes('latestPoll') && files.raceProjection.includes('latestForecast') && files.raceProjection.includes('latestResult')],
  ['race winner relationship', files.raceProjection.includes('winnerCandidateId')],
  ['race geography and official links', files.raceProjection.includes('officialCountyElectionLinks') && files.raceProjection.includes('geographySource')],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
if (failed.length) {
  console.error(`Phase 3 validation failed: ${failed.map(([label]) => label).join(', ')}`);
  process.exit(1);
}
console.log('Phase 3 election graph validation passed.');
