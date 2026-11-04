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
  "brent-money": {
    name: "Brent Money", office: "Texas House", district: "House District 2", party: "R",
    officialUrl: "https://house.texas.gov/members/2",
    biography: "Brent Money represents House District 2, covering Hunt, Hopkins, and Van Zandt counties. His official Texas House biography describes his work as an attorney and business owner. His House member record lists his capitol and district offices and links directly to authored and sponsored legislation; the separate research table on this page distinguishes his different legislative roles and recorded bill outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4670/biography",
  },
  "will-metcalf": {
    name: "Will Metcalf", office: "Texas House", district: "House District 16", party: "R",
    officialUrl: "https://house.texas.gov/members/2900",
    biography: "Will Metcalf represents House District 16, including the Conroe area of Montgomery County. According to his official Texas House biography, his professional background includes banking and business development, and he earned a criminal-justice degree from Sam Houston State University. The official House record provides legislative and district sources; the searchable 89th Legislature research below separates his authored and sponsored measures from coauthor and cosponsor roles.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/2900/biography",
  },
  "tan-parker": {
    name: "Tan Parker", office: "Texas Senate", district: "Senate District 12", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=12",
    biography: "Tan Parker represents Senate District 12. His official Texas Senate biography records service in the Texas House from 2007 through 2023, followed by Senate service beginning in 2023, along with business experience and education at the University of Dallas and the London School of Economics. His Senate page documents transportation and criminal-justice committee leadership, while the linked legislative histories distinguish each 89th Legislature bill role.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=12",
  },
  "royce-west": {
    name: "Royce West", office: "Texas Senate", district: "Senate District 23", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=23",
    biography: "Royce West represents Senate District 23 in the Dallas area and has served in the Texas Senate since 1993, according to the official Senate member record. An attorney and managing partner of West & Associates, he has pursued education and higher-education legislation and is listed as vice chair of the Senate Transportation Committee. This page separates source-recorded authorship, sponsorship, and other legislative roles rather than treating all participation as a vote.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=23",
  },
  "joanne-shofner": {
    name: "Joanne Shofner", office: "Texas House", district: "House District 11", party: "R",
    officialUrl: "https://house.texas.gov/members/11",
    biography: "Joanne Shofner represents House District 11, including Nacogdoches, Newton, Panola, Rusk, Shelby, and Sabine counties. Her official Texas House biography identifies her 89th Legislature committee appointments to Higher Education and Public Health, and describes work on House Bill 25. The accompanying bill-research records use the original Texas Legislature histories to distinguish individual bill roles and outcomes from statements about votes or overall legislative totals.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4755/biography",
  },
  "lois-kolkhorst": {
    name: "Lois Kolkhorst", office: "Texas Senate", district: "Senate District 18", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=18",
    biography: "Lois Kolkhorst represents Senate District 18 and is based in Brenham. The official Senate biography documents her Texas House service from 2001 to 2014, Senate service since 2014, a business background, and a degree from Texas Christian University. Her Senate responsibilities include Health and Human Services, and the official member page links legislative activity to independently checkable Texas Legislature bill histories and recorded outcomes.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=18",
  },
  "richard-hayes": {
    name: "Richard Hayes", office: "Texas House", district: "House District 57", party: "R",
    officialUrl: "https://house.texas.gov/members/4165",
    biography: "Richard Hayes represents House District 57 in Denton County. The official Texas House biography describes his election in 2022, work as a business and real-estate attorney, and education at Texas Christian University, Texas A&M University, and St. Mary's University School of Law. During the 89th Legislature he was appointed to the Judiciary and Civil Jurisprudence, pensions and financial-services, and Governmental Oversight committees; linked bill histories document his distinct legislative roles.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4165/biography",
  },
  "cesar-blanco": {
    name: "César Blanco", office: "Texas Senate", district: "Senate District 29", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=29",
    biography: "César Blanco represents Senate District 29, covering El Paso and several West Texas counties. His official Senate biography describes his Navy service, degree from the University of Texas at El Paso, Texas House service from 2015 through 2021, and Senate service beginning in 2021. His official committee work spans business, health, natural resources, and disaster preparedness; the legislative sample provides primary-source links for specific bills and distinguishes each recorded role.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=29",
  },
  "bob-hall": {
    name: "Bob Hall", office: "Texas Senate", district: "Senate District 2", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=2",
    biography: "Bob Hall represents Texas Senate District 2, and the official Texas Senate member page lists his service in the Senate beginning in 2015. A retired U.S. Air Force captain, he also worked as an aerospace systems engineer and established a business consulting company. His Senate committee work includes chairing Administration and participation in Finance, Health and Human Services, and State Affairs; individual legislative roles and outcomes are documented below against official bill histories.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=2",
  },
  "robert-nichols": {
    name: "Robert Nichols", office: "Texas Senate", district: "Senate District 3", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=3",
    biography: "Robert Nichols represents Texas Senate District 3, an East Texas district. According to the official Texas Senate biography, he has served since 2007, holds an industrial engineering degree from Lamar University, and worked in plastics manufacturing. The Senate identifies transportation policy as a central part of his legislative service and lists his roles on Transportation, Finance, Local Government, and Business and Commerce; official bill histories below identify specific recorded legislative roles.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=3",
  },
  "charles-schwertner": {
    name: "Charles Schwertner", office: "Texas Senate", district: "Senate District 5", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=5",
    biography: "Charles Schwertner represents Texas Senate District 5, covering parts of Central and East Texas. The official Senate biography identifies him as an orthopedic surgeon who earned a pharmacy degree from the University of Texas at Austin and a medical degree from the University of Texas Medical Branch. After serving in the Texas House from 2011 to 2013, he joined the Senate in 2013 and chairs Business and Commerce, with other responsibilities in Finance, State Affairs, and Economic Development.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=5",
  },
  "carol-alvarado": {
    name: "Carol Alvarado", office: "Texas Senate", district: "Senate District 6", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=6",
    biography: "Carol Alvarado represents Texas Senate District 6 in Harris County. Her official Texas Senate biography documents previous Houston City Council service from 2002 through 2008 and Texas House service beginning in 2009 before she won a 2018 Senate special election. She holds a political-science bachelor's degree and MBA from the University of Houston, chairs the Senate Democratic Caucus, and serves on committees covering finance, economic development, and natural resources.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=6",
  },
  "paul-bettencourt": {
    name: "Paul Bettencourt", office: "Texas Senate", district: "Senate District 7", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=7",
    biography: "Paul Bettencourt represents Texas Senate District 7 in the Houston area and has served since 2015. According to the Texas Senate's official member biography, he previously served as Harris County tax assessor-collector from 1998 through 2008 and earned an industrial-distribution degree from Texas A&M University. His Senate work includes chairing Local Government and work on property tax, education, finance and transportation legislation; each bill role in the research sample is linked to its original history.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=7",
  },
  "angela-paxton": {
    name: "Angela Paxton", office: "Texas Senate", district: "Senate District 8", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=8",
    biography: "Angela Paxton represents Texas Senate District 8 and was elected in 2018, beginning service in 2019. Her official Senate biography describes more than two decades as a secondary mathematics teacher and school counselor, a degree from Baylor University, and a graduate education degree from the University of Houston–Clear Lake. She chairs Economic Development and serves as vice chair of State Affairs and the Religious Liberty select committee, with additional duties in finance and education.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=8",
  },
  "phil-king": {
    name: "Phil King", office: "Texas Senate", district: "Senate District 10", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=10",
    biography: "Phil King represents Texas Senate District 10. The official Texas Senate member biography records his Texas House service from 1999 through 2022 and his Senate service beginning in 2023. An attorney and former Fort Worth police officer, he served in law enforcement for 15 years and holds degrees from Dallas Baptist University and Texas A&M University School of Law. His district encompasses parts of North and West Texas, including Brown and Parker counties.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=10",
  },
  "mayes-middleton": {
    name: "Mayes Middleton", office: "Texas Senate", district: "Senate District 11", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=11",
    biography: "Mayes Middleton represents Texas Senate District 11, covering portions of Brazoria, Galveston and Harris counties. The Texas Senate biography identifies him as president of an independent oil and gas company, with bachelor's and law degrees from the University of Texas at Austin. He served two terms in the Texas House before joining the Senate in 2023 and was formerly chair of the Texas House Freedom Caucus; his recorded bill roles and outcomes are traceable to individual Texas Legislature histories.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=11",
  },
};

export const SIX_PROFILE_PILOT = [
  "bryan-hughes", "judith-zaffirini",
  "terri-leo-wilson", "mihaela-plesa",
  "dan-crenshaw", "john-cornyn",
] as const;

/** Checked against current official member pages 2026-11-04. Each entry must
 * independently pass all A-F gates before appearing in the representative sitemap. */
export const SCRIPT2_REVIEWED_SLUGS = [
  "brent-money", "will-metcalf", "tan-parker", "royce-west",
  "joanne-shofner", "lois-kolkhorst", "richard-hayes", "cesar-blanco",
  "bob-hall", "robert-nichols", "charles-schwertner", "carol-alvarado",
  "paul-bettencourt", "angela-paxton", "phil-king", "mayes-middleton",
] as const;

export const CERTIFICATION_CANDIDATE_SLUGS = [
  ...SIX_PROFILE_PILOT,
  ...SCRIPT2_REVIEWED_SLUGS,
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
