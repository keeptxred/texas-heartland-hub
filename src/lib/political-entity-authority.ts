import authorityRegistry from "@/data/elections/2026/political-authority-registry.json";
import {
  STATE_LEADERSHIP,
  US_HOUSE_DELEGATION,
  US_SENATORS,
  type Rep,
} from "@/data/representatives";

export type PoliticalAuthorityAssertion = {
  relation: "candidate" | "officeholder";
  personName?: string | null;
  candidateId?: string | null;
  externalCandidateId?: string | null;
  raceId?: string | null;
  party?: string | null;
  office?: string | null;
  officeLevel?: string | null;
  district?: string | number | null;
  electionYear?: number | null;
};

export type PoliticalAuthorityInput = {
  headline: string;
  body: string;
  assertions?: readonly PoliticalAuthorityAssertion[];
};

export type PoliticalEntityValidation = {
  valid: boolean;
  errors: string[];
  resolvedCandidateIds: string[];
  authoritySources: string[];
};

type Contest = {
  raceId: string;
  electionYear: number;
  office: string;
  officeLevel: string;
  districtId: string | null;
  districtName: string | null;
  districtNumber: string | number | null;
};

type CandidateAuthority = {
  id: string;
  aliases: string[];
  party: string;
  externalIds: Record<string, string>;
  contests: Contest[];
};

const CANDIDATES = authorityRegistry.candidates as CandidateAuthority[];
const OFFICEHOLDERS = [...US_SENATORS, ...STATE_LEADERSHIP, ...US_HOUSE_DELEGATION];
const PARTY_ALIASES: Record<string, string> = {
  r: "republican",
  republican: "republican",
  gop: "republican",
  d: "democratic",
  democratic: "democratic",
  democrat: "democratic",
  libertarian: "libertarian",
  green: "green",
  independent: "independent",
  nonpartisan: "nonpartisan",
};

const OFFICE_PATTERNS: readonly [RegExp, string, string][] = [
  [/\b(?:U\.?S\.?|United States) Senate\b/i, "U.S. Senate", "federal"],
  [/\b(?:Texas|state) Senate\b/i, "Texas Senate", "state"],
  [/\b(?:U\.?S\.?|United States) House\b|\bCongress(?:ional)?\b/i, "U.S. House", "federal"],
  [/\b(?:Texas|state) House\b/i, "Texas House", "state"],
  [/\bLieutenant Governor\b/i, "Lieutenant Governor", "state"],
  [/\bAttorney General\b/i, "Attorney General", "state"],
  [/\bComptroller(?: of Public Accounts)?\b/i, "Comptroller of Public Accounts", "state"],
  [
    /\bLand Commissioner\b|\bCommissioner of the General Land Office\b/i,
    "Commissioner of the General Land Office",
    "state",
  ],
  [
    /\bAgriculture Commissioner\b|\bCommissioner of Agriculture\b/i,
    "Commissioner of Agriculture",
    "state",
  ],
  [/\bRailroad Commissioner\b/i, "Railroad Commissioner", "state"],
  [/\bGovernor\b/i, "Governor", "state"],
];

const CONTEST_CUE =
  /\b(candidate|campaign|running|runs|ran|seeking|seeks|sought|vying|nominee|race|election|ballot)\b/i;

/**
 * Fail-closed publication gate backed by verified election and officeholder
 * registries. A headline can trigger review, but can never resolve a person.
 * Candidate identity is resolved only from the article body or an exact,
 * structured candidate ID supplied by an upstream importer.
 */
export function validatePoliticalAuthority(
  input: PoliticalAuthorityInput,
): PoliticalEntityValidation {
  const headline = normalizeWhitespace(input.headline);
  const body = normalizeWhitespace(input.body);
  const errors: string[] = [];
  const bodyCandidates = candidatesMentionedIn(body);
  const headlineCandidates = candidatesMentionedIn(headline);

  for (const candidate of headlineCandidates) {
    if (!bodyCandidates.some((bodyCandidate) => bodyCandidate.id === candidate.id)) {
      errors.push(
        `Headline-only political identity is not authoritative: ${displayName(candidate)} must be corroborated in article body/source context.`,
      );
    }
  }

  for (const candidate of bodyCandidates) {
    validateCandidateTextClaims(candidate, body, errors);
  }

  for (const assertion of input.assertions ?? []) {
    if (assertion.relation === "candidate") validateCandidateAssertion(assertion, errors);
    else validateOfficeholderAssertion(assertion, errors);
  }

  return {
    valid: errors.length === 0,
    errors: [...new Set(errors)],
    resolvedCandidateIds: bodyCandidates.map((candidate) => candidate.id),
    authoritySources: [
      ...authorityRegistry.authoritySources,
      "Official government officeholder directory",
    ],
  };
}

/** Backward-compatible wrapper for callers that have a single body string. */
export function validatePoliticalEntityClaims(text: string): PoliticalEntityValidation {
  return validatePoliticalAuthority({ headline: "", body: text });
}

function validateCandidateAssertion(assertion: PoliticalAuthorityAssertion, errors: string[]) {
  if (!assertion.candidateId) {
    errors.push("Candidate assertion blocked: an exact verified candidateId is required.");
    return;
  }
  const candidate = CANDIDATES.find((record) => record.id === assertion.candidateId);
  if (!candidate) {
    errors.push(`Candidate assertion references unknown candidateId ${assertion.candidateId}.`);
    return;
  }
  if (
    assertion.personName &&
    !candidate.aliases.some((alias) => sameText(alias, assertion.personName!))
  ) {
    errors.push(`CandidateId ${candidate.id} does not match person name ${assertion.personName}.`);
  }
  if (assertion.externalCandidateId) {
    const knownIds = Object.values(candidate.externalIds);
    if (!knownIds.includes(assertion.externalCandidateId)) {
      errors.push(
        `External candidate ID ${assertion.externalCandidateId} does not match ${candidate.id}.`,
      );
    }
  }
  if (assertion.party && normalizeParty(assertion.party) !== candidate.party) {
    errors.push(`${displayName(candidate)} is not registered as ${assertion.party}.`);
  }
  const matchingContests = candidate.contests.filter((contest) =>
    contestMatchesAssertion(contest, assertion),
  );
  if (matchingContests.length === 0) {
    errors.push(
      `Candidate assertion for ${displayName(candidate)} conflicts with the verified race, office, level, district, or election year.`,
    );
  }
}

function validateOfficeholderAssertion(assertion: PoliticalAuthorityAssertion, errors: string[]) {
  if (!assertion.personName || !assertion.office) {
    errors.push("Officeholder assertion blocked: personName and office are required.");
    return;
  }
  const matches = OFFICEHOLDERS.filter((record) => sameText(record.name, assertion.personName!));
  if (matches.length !== 1) {
    errors.push(
      `Officeholder ${assertion.personName} is not uniquely resolved in the authority registry.`,
    );
    return;
  }
  const officeholder = matches[0];
  if (!officeEquivalent(officeholder.office, assertion.office)) {
    errors.push(
      `${officeholder.name} is registered as ${officeholder.office}, not ${assertion.office}.`,
    );
  }
  if (assertion.party && normalizeParty(assertion.party) !== normalizeParty(officeholder.party)) {
    errors.push(`${officeholder.name}'s registered party does not match ${assertion.party}.`);
  }
  if (assertion.district != null && !districtEquivalent(officeholder, assertion.district)) {
    errors.push(`${officeholder.name}'s registered district does not match ${assertion.district}.`);
  }
}

function validateCandidateTextClaims(
  candidate: CandidateAuthority,
  body: string,
  errors: string[],
) {
  for (const sentence of sentencesContainingCandidate(body, candidate)) {
    if (!CONTEST_CUE.test(sentence)) continue;
    const offices = officesIn(sentence);
    if (
      offices.length > 0 &&
      !offices.some((claim) =>
        candidate.contests.some(
          (contest) =>
            officeEquivalent(contest.office, claim.office) && contest.officeLevel === claim.level,
        ),
      )
    ) {
      errors.push(
        `${displayName(candidate)} was assigned to an office or race level that conflicts with the verified candidate registry.`,
      );
    }

    for (const partyClaim of partyClaimsForCandidate(sentence, candidate)) {
      if (partyClaim !== candidate.party) {
        errors.push(`${displayName(candidate)} was assigned to the wrong political party.`);
      }
    }

    const years = [...sentence.matchAll(/\b(20\d{2})\b/g)].map((match) => Number(match[1]));
    if (
      years.length > 0 &&
      !years.some((year) => candidate.contests.some((contest) => contest.electionYear === year))
    ) {
      errors.push(`${displayName(candidate)} was assigned to the wrong election year.`);
    }

    const districtClaims = districtsIn(sentence);
    for (const district of districtClaims) {
      const matches = candidate.contests.some(
        (contest) =>
          contest.districtNumber != null &&
          String(contest.districtNumber) === district.number &&
          (!district.level || contest.officeLevel === district.level),
      );
      if (!matches) errors.push(`${displayName(candidate)} was assigned to the wrong district.`);
    }
  }
}

function contestMatchesAssertion(contest: Contest, assertion: PoliticalAuthorityAssertion) {
  if (assertion.raceId && assertion.raceId !== contest.raceId) return false;
  if (assertion.electionYear != null && assertion.electionYear !== contest.electionYear)
    return false;
  if (assertion.office && !officeEquivalent(assertion.office, contest.office)) return false;
  if (assertion.officeLevel && normalizeLevel(assertion.officeLevel) !== contest.officeLevel)
    return false;
  if (assertion.district != null) {
    const expected = normalizeDistrict(assertion.district);
    const actual = normalizeDistrict(contest.districtNumber ?? contest.districtName ?? "statewide");
    if (expected !== actual) return false;
  }
  return true;
}

function candidatesMentionedIn(text: string) {
  if (!text) return [];
  return CANDIDATES.filter((candidate) =>
    candidate.aliases.some((alias) => containsWholeName(text, alias)),
  );
}

function sentencesContainingCandidate(text: string, candidate: CandidateAuthority) {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => candidate.aliases.some((alias) => containsWholeName(sentence, alias)));
}

function containsWholeName(text: string, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(?:^|[^A-Za-z0-9])${escaped}(?=$|[^A-Za-z0-9])`, "i").test(text);
}

function officesIn(text: string) {
  return OFFICE_PATTERNS.filter(([pattern]) => pattern.test(text)).map(([, office, level]) => ({
    office,
    level,
  }));
}

function districtsIn(text: string) {
  const claims: { number: string; level: string | null }[] = [];
  const pattern =
    /\b(?:(U\.?S\.?|United States|Congressional|Texas|state)\s+)?(?:House|Senate)?\s*District\s+(\d+)\b/gi;
  for (const match of text.matchAll(pattern)) {
    const prefix = (match[1] ?? "").toLowerCase();
    claims.push({
      number: match[2],
      level: /u\.?s\.?|united states|congressional/.test(prefix)
        ? "federal"
        : /texas|state/.test(prefix)
          ? "state"
          : null,
    });
  }
  return claims;
}

function partyClaimsForCandidate(text: string, candidate: CandidateAuthority) {
  const claims: string[] = [];
  const party = "(Republican|GOP|Democratic|Democrat|Libertarian|Green|Independent|Nonpartisan)";
  for (const alias of candidate.aliases) {
    const name = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    const before = text.match(
      new RegExp(`\\b${party}\\s+(?:candidate\\s+)?${name}(?=$|[^A-Za-z0-9])`, "i"),
    );
    const after = text.match(
      new RegExp(`(?:^|[^A-Za-z0-9])${name}\\s*(?:,|\\(|is\\s+(?:a|the))?\\s*${party}\\b`, "i"),
    );
    if (before) claims.push(normalizeParty(before[1]));
    if (after) claims.push(normalizeParty(after[1]));
  }
  return [...new Set(claims)];
}

function normalizeParty(value: string) {
  return PARTY_ALIASES[value.trim().toLowerCase()] ?? value.trim().toLowerCase();
}

function normalizeLevel(value: string) {
  const normalized = value.trim().toLowerCase();
  if (["federal", "u.s.", "us", "united states"].includes(normalized)) return "federal";
  if (["state", "texas"].includes(normalized)) return "state";
  return normalized;
}

function normalizeDistrict(value: string | number) {
  const normalized = String(value).trim().toLowerCase();
  if (/statewide|none|null/.test(normalized)) return "statewide";
  return normalized.match(/\d+/)?.[0] ?? normalized;
}

function districtEquivalent(record: Rep, district: string | number) {
  if (!record.district) return normalizeDistrict(district) === "statewide";
  return normalizeDistrict(record.district) === normalizeDistrict(district);
}

function officeEquivalent(left: string, right: string) {
  return canonicalOffice(left) === canonicalOffice(right);
}

function canonicalOffice(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  if (/^(u s|united states) senator?$|^u s senate$/.test(normalized)) return "us-senate";
  if (/^(u s|united states) house$|^congress(?:ional)?$/.test(normalized)) return "us-house";
  if (/^texas senate$|^state senate$/.test(normalized)) return "texas-senate";
  if (/^texas house$|^state house$/.test(normalized)) return "texas-house";
  if (/^comptroller/.test(normalized)) return "comptroller";
  if (/land commissioner|general land office/.test(normalized)) return "land-commissioner";
  if (/agriculture commissioner|commissioner of agriculture/.test(normalized))
    return "agriculture-commissioner";
  return normalized;
}

function sameText(left: string, right: string) {
  return left.localeCompare(right, undefined, { sensitivity: "base" }) === 0;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function displayName(candidate: CandidateAuthority) {
  return candidate.aliases[0]
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
