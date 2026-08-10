#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const files = {
  entity: await readFile('src/lib/authority-entity.ts', 'utf8'),
  paths: await readFile('src/lib/authority-entity-paths.ts', 'utf8'),
  candidate: await readFile('src/lib/candidate-authority.ts', 'utf8'),
  race: await readFile('src/lib/race-authority.ts', 'utf8'),
  registry: await readFile('src/lib/election-authority-registry.ts', 'utf8'),
};

const required = [
  [files.entity, "'race'"],
  [files.paths, "race: '/elections/races/'"],
  [files.candidate, 'raceSlugById'],
  [files.candidate, "createAuthorityEntityKey('race', slug)"],
  [files.race, "entityType: 'race'"],
  [files.race, 'candidateSlugById'],
  [files.race, 'districtSlug'],
  [files.race, "createAuthorityEntityKey('candidate'"],
  [files.race, "createAuthorityEntityKey('district'"],
  [files.registry, 'createElectionAuthorityRegistry'],
];

const forbidden = [
  [files.candidate, '`election:${String(raceId)}`'],
  [files.candidate, "createAuthorityEntityKey('race', String(raceId))"],
  [files.race, "createAuthorityEntityKey('candidate', String(candidateId))"],
  [files.race, "createAuthorityEntityKey('district', String(race.districtId))"],
];

const errors = [
  ...required
    .filter(([source, token]) => !source.includes(token))
    .map(([, token]) => `Missing race authority token: ${token}`),
  ...forbidden
    .filter(([source, token]) => source.includes(token))
    .map(([, token]) => `Unsafe unresolved election identifier remains: ${token}`),
];

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Race authority graph validation passed.');
