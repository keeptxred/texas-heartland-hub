type ElectionRecord = Record<string, unknown>;

type SourceRecord = {
  sourceName?: unknown;
  sourceType?: unknown;
  sourceUrl?: unknown;
  retrievedAt?: unknown;
};

export type PublicSource = {
  sourceName: string;
  sourceType: string;
  sourceUrl: string;
  retrievedAt: string | null;
};

export type ElectionReferenceRace = {
  id: string;
  slug: string;
  name: string;
  officeName: string;
  officeLevel: string;
  electionType: string;
  jurisdictionType: string;
  districtName: string | null;
  districtNumber: string | null;
  electionDate: string;
  status: string;
  candidateIds: string[];
  canonicalUrl: string;
  source: PublicSource | null;
  verifiedAt: string | null;
  updatedAt: string | null;
  dataAsOf: string | null;
};

export type ElectionReferenceCandidate = {
  id: string;
  slug: string;
  fullName: string;
  ballotName: string;
  party: string;
  partyLabel: string | null;
  status: string;
  filingStatus: string;
  incumbencyType: string;
  raceIds: string[];
  primaryRaceId: string | null;
  canonicalUrl: string;
  source: PublicSource | null;
  verifiedAt: string | null;
  updatedAt: string | null;
  dataAsOf: string | null;
};

export type ElectionReferenceExport = {
  schemaVersion: 1;
  site: 'Keep TX Red';
  electionCycle: '2026';
  canonicalHub: 'https://keeptxred.com/elections/2026';
  generatedFrom: 'published_verified_records';
  asOf: string | null;
  methodologyUrl: 'https://keeptxred.com/elections/methodology';
  races: ElectionReferenceRace[];
  candidates: ElectionReferenceCandidate[];
};

export function buildElectionReferenceExport(
  raceRecords: readonly ElectionRecord[],
  candidateRecords: readonly ElectionRecord[],
): ElectionReferenceExport {
  const races = raceRecords
    .filter(isPublicVerified)
    .flatMap(projectRace)
    .sort((a, b) => a.electionDate.localeCompare(b.electionDate) || a.name.localeCompare(b.name));

  const candidates = candidateRecords
    .filter(isPublicVerified)
    .flatMap(projectCandidate)
    .sort((a, b) => a.ballotName.localeCompare(b.ballotName));

  const asOf = newestDate([
    ...races.flatMap((race) => [race.verifiedAt, race.updatedAt, race.dataAsOf]),
    ...candidates.flatMap((candidate) => [candidate.verifiedAt, candidate.updatedAt, candidate.dataAsOf]),
  ]);

  return {
    schemaVersion: 1,
    site: 'Keep TX Red',
    electionCycle: '2026',
    canonicalHub: 'https://keeptxred.com/elections/2026',
    generatedFrom: 'published_verified_records',
    asOf,
    methodologyUrl: 'https://keeptxred.com/elections/methodology',
    races,
    candidates,
  };
}

function isPublicVerified(record: ElectionRecord) {
  return record.publicationStatus === 'published' && record.verificationStatus === 'verified';
}

function projectRace(record: ElectionRecord): ElectionReferenceRace[] {
  const id = requiredString(record.id);
  const slug = requiredString(record.slug);
  const name = requiredString(record.name);
  const officeName = requiredString(record.officeName);
  const electionDate = requiredString(record.electionDate);
  if (!id || !slug || !name || !officeName || !electionDate) return [];

  return [{
    id,
    slug,
    name,
    officeName,
    officeLevel: requiredString(record.officeLevel) ?? 'unknown',
    electionType: requiredString(record.electionType) ?? 'unknown',
    jurisdictionType: requiredString(record.jurisdictionType) ?? 'unknown',
    districtName: nullableString(record.districtName),
    districtNumber: nullableString(record.districtNumber),
    electionDate,
    status: requiredString(record.status) ?? 'unknown',
    candidateIds: stringArray(record.candidateIds),
    canonicalUrl: `https://keeptxred.com/elections/races/${slug}`,
    source: publicSource(record.source),
    verifiedAt: nullableDate(record.verifiedAt),
    updatedAt: nullableDate(record.updatedAt),
    dataAsOf: nullableDate(record.dataAsOf),
  }];
}

function projectCandidate(record: ElectionRecord): ElectionReferenceCandidate[] {
  const id = requiredString(record.id);
  const slug = requiredString(record.slug);
  const fullName = requiredString(record.fullName);
  const ballotName = requiredString(record.ballotName);
  if (!id || !slug || !fullName || !ballotName) return [];

  return [{
    id,
    slug,
    fullName,
    ballotName,
    party: requiredString(record.party) ?? 'unknown',
    partyLabel: nullableString(record.partyLabel),
    status: requiredString(record.status) ?? 'unknown',
    filingStatus: requiredString(record.filingStatus) ?? 'unknown',
    incumbencyType: requiredString(record.incumbencyType) ?? 'unknown',
    raceIds: stringArray(record.raceIds),
    primaryRaceId: nullableString(record.primaryRaceId),
    canonicalUrl: `https://keeptxred.com/elections/candidates/${slug}`,
    source: publicSource(record.source),
    verifiedAt: nullableDate(record.verifiedAt),
    updatedAt: nullableDate(record.updatedAt),
    dataAsOf: nullableDate(record.dataAsOf),
  }];
}

function publicSource(value: unknown): PublicSource | null {
  if (!value || typeof value !== 'object') return null;
  const source = value as SourceRecord;
  const sourceName = requiredString(source.sourceName);
  const sourceType = requiredString(source.sourceType);
  const sourceUrl = requiredString(source.sourceUrl);
  if (!sourceName || !sourceType || !sourceUrl) return null;
  return { sourceName, sourceType, sourceUrl, retrievedAt: nullableDate(source.retrievedAt) };
}

function requiredString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function nullableString(value: unknown) {
  return requiredString(value);
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
    : [];
}

function nullableDate(value: unknown) {
  const candidate = requiredString(value);
  return candidate && !Number.isNaN(Date.parse(candidate)) ? candidate : null;
}

function newestDate(values: Array<string | null>) {
  const dates = values.filter(
    (value): value is string =>
      typeof value === 'string' && value.length > 0 && !Number.isNaN(Date.parse(value)),
  );
  dates.sort((a, b) => Date.parse(b) - Date.parse(a));
  return dates[0] ?? null;
}
