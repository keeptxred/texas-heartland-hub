import pilot from "@/data/representative-research-pilot.json";
import expansion from "@/data/representative-research-script2.json";
import type { Rep } from "@/data/representatives";
import type { RepresentativeAuthority } from "@/data/representative-authority";

/** Internal publishing states, not Google's assessment of search quality. */
export type RepresentativeCertificationState =
  | "AUTHORITY_READY"
  | "NOT_READY"
  | "VERIFICATION_FAILED";

export type PilotResearchRecord = (typeof pilot.records)[number];

type EditorialReview = {
  name: string;
  office: "Texas Senate" | "Texas House";
  district: string;
  party: "R" | "D";
  officialUrl: string;
  biography: string;
  identityChecked: string;
  source: string;
};

/**
 * Explicit, dated identity reviews for the pilot. The summaries are written
 * against linked House/Senate primary biographies, not LLM-generated fillers.
 * A synchronized roster change that disagrees with a review FAILS CLOSED.
 */
export const EDITORIAL_REVIEWS: Record<string, EditorialReview> = {
  "bryan-hughes": {
    name: "Bryan Hughes", office: "Texas Senate", district: "Senate District 1", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=1",
    biography: "Bryan Hughes represents Texas Senate District 1. The official Senate biography records his House service from 2003 to 2017 and his Senate service from 2017 onward. It lists his occupation as an attorney and his hometown as Mineola.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=1",
  },
  "judith-zaffirini": {
    name: "Judith Zaffirini", office: "Texas Senate", district: "Senate District 21", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=21",
    biography: "Judith Zaffirini represents Texas Senate District 21. The official Senate member biography dates her service to 1987 and describes professional experience in communications and education, including 13 years of teaching.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=21",
  },
  "terri-leo-wilson": {
    name: "Terri Leo-Wilson", office: "Texas House", district: "House District 23", party: "R",
    officialUrl: "https://house.texas.gov/members/4290",
    biography: "Terri Leo-Wilson represents Texas House District 23, which includes Chambers County and part of Galveston County. Her official House biography describes prior work in elementary and special education and educational administration.",
    identityChecked: "2026-11-04", source: "https://www.house.texas.gov/members/4290/biography",
  },
  "mihaela-plesa": {
    name: "Mihaela Pleșa", office: "Texas House", district: "House District 70", party: "D",
    officialUrl: "https://house.texas.gov/members/4345",
    biography: "Mihaela Pleșa represents Texas House District 70 in parts of Collin County. The official House biography describes her as a vice chair of the Pensions, Investments and Financial Services committee and a member of the Elections committee.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4345/biography",
  },
};

export const SIX_PROFILE_PILOT = [
  "bryan-hughes", "judith-zaffirini",
  "terri-leo-wilson", "mihaela-plesa",
  "dan-crenshaw", "john-cornyn",
] as const;

export function applyPilotEditorial(
  slug: string,
  authority: RepresentativeAuthority | null,
): RepresentativeAuthority | null {
  const review = EDITORIAL_REVIEWS[slug];
  return authority && review ? { ...authority, biography: review.biography } : authority;
}

/**
 * All historical research is indexed by officeholder on the server. These
 * records are source-linked samples, not a complete bill or voting history.
 * Expansion records are not in themselves proof of member identity or
 * authority-page readiness; the six editorial gates remain fail-closed.
 */
const RESEARCH_BY_SLUG = new Map<string, PilotResearchRecord[]>();
for (const row of [...pilot.records, ...expansion.records]) {
  const records = RESEARCH_BY_SLUG.get(row.sponsor_slug) ?? [];
  records.push(row as PilotResearchRecord);
  RESEARCH_BY_SLUG.set(row.sponsor_slug, records);
}

export function pilotResearchFor(slug: string): PilotResearchRecord[] {
  return RESEARCH_BY_SLUG.get(slug) ?? [];
}

export type RepresentativeCertification = {
  state: RepresentativeCertificationState;
  evaluatedAt: string;
  gates: Record<"A" | "B" | "C" | "D" | "E" | "F", boolean>;
  reasons: string[];
  evidenceCount: number;
  officialSource?: string;
  researchCapture?: string;
  temporaryDataOutage?: boolean;
};

function isOfficialLegislativeSource(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "capitol.texas.gov" &&
      parsed.pathname.startsWith("/BillLookup/History.aspx") &&
      parsed.searchParams.has("LegSess") && parsed.searchParams.has("Bill");
  } catch { return false; }
}

function isOfficialMemberUrl(url: string, office: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    return parsed.protocol === "https:" &&
      (office === "Texas Senate"
        ? host === "senate.texas.gov" && parsed.pathname === "/member.php"
        : host === "house.texas.gov" && /^\/members\/\d+$/.test(parsed.pathname));
  } catch { return false; }
}

export function certifyRepresentative(input: {
  slug: string;
  representative: Rep | null | undefined;
  authority: RepresentativeAuthority | null;
  temporaryDataOutage?: boolean;
}): RepresentativeCertification {
  const { slug, representative, authority } = input;
  const review = EDITORIAL_REVIEWS[slug];
  const records = pilotResearchFor(slug);
  const reasons: string[] = [];
  const gates: RepresentativeCertification["gates"] =
    { A: false, B: false, C: false, D: false, E: false, F: false };

  const mismatch = Boolean(review && representative && (
    representative.name !== review.name ||
    representative.office !== review.office ||
    representative.district !== review.district ||
    representative.party !== review.party ||
    representative.website !== review.officialUrl ||
    representative.status === "former"
  ));
  gates.A = Boolean(review && representative && !mismatch &&
    authority?.slug === slug && isOfficialMemberUrl(representative.website, review.office));
  if (!gates.A) reasons.push(mismatch ? "A: official identity/office/URL conflicts with reviewed pilot record" :
    "A: individual official identity and office verification is incomplete");

  const unique = new Map(records.map((row) => [row.bill_id + ":" + row.sponsor_role, row]));
  const roles = new Set(records.map((row) => row.sponsor_role));
  const statuses = new Set(records.map((row) => row.current_status_label));
  // Capped role-stratified 89th-legislature sample, not a complete career count.
  gates.B = Boolean(review && unique.size >= 16 && roles.size >= 2 && statuses.size >= 2);
  if (!gates.B) reasons.push("B: distinctive, profile-specific official legislative role/outcome research not certified");

  gates.C = Boolean(review && authority?.reviewedAt && /^\d{4}-\d{2}-\d{2}$/.test(authority.reviewedAt) &&
    review.source.startsWith("https://") &&
    records.length >= 16 && records.every((row) =>
      isOfficialLegislativeSource(row.source_url) &&
      typeof row.bill_identifier === "string" && Boolean(row.caption?.trim()) &&
      !Number.isNaN(Date.parse(row.last_synced_at)) &&
      row.legislature_number === 89
    ) && authority.sources.some((source) => source.url.replace(/^https:\/\/www\./, "https://") === review.officialUrl));
  if (!gates.C) reasons.push("C: official bill histories, timestamps, or member source traceability incomplete");

  const cleanBiography = authority?.biography?.trim() ?? "";
  gates.D = Boolean(review && cleanBiography === review.biography &&
    !/this authority profile consolidates|consult the linked official biography/i.test(cleanBiography));
  if (!gates.D) reasons.push("D: generic profile copy or independent editorial review remains");

  gates.E = Boolean(review && authority &&
    authority.sources.every((source) => source.url.startsWith("https://")) &&
    representative && !representative.status && records.every((row) => row.bill_id));
  if (!gates.E) reasons.push("E: canonical office/source and research record linkage incomplete");

  const otherBiographies = Object.entries(EDITORIAL_REVIEWS)
    .filter(([other]) => other !== slug).map(([, data]) => data.biography);
  gates.F = Boolean(review && cleanBiography.length >= 140 &&
    !otherBiographies.includes(cleanBiography) &&
    new Set(records.map((row) => row.bill_identifier + ":" + row.sponsor_role)).size >= 16);
  if (!gates.F) reasons.push("F: profile-specific factual distinctiveness unverified");

  const state: RepresentativeCertificationState = mismatch ? "VERIFICATION_FAILED" :
    Object.values(gates).every(Boolean) ? "AUTHORITY_READY" : "NOT_READY";
  return {
    state,
    gates,
    reasons,
    evaluatedAt: review?.identityChecked ?? pilot.capturedAt,
    evidenceCount: records.length,
    ...(review ? { officialSource: review.source, researchCapture: pilot.capturedAt } : {}),
    temporaryDataOutage: Boolean(input.temporaryDataOutage),
  };
}
