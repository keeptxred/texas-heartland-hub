export const LAW_TOPICS = {
  driving: {
    label: "Driving & Traffic",
    description: "Traffic stops, licensing, insurance, vehicle rules, DWI, towing, parking, and road-safety laws.",
  },
  "landlord-tenant": {
    label: "Landlord & Tenant",
    description: "Leases, deposits, repairs, eviction, privacy, rent, utilities, and other rental-property rules.",
  },
  "hoa-property": {
    label: "HOA & Property",
    description: "HOAs, fences, trees, easements, liens, trespass, nuisance, eminent domain, and property-owner rights.",
  },
  "self-defense-firearms": {
    label: "Self-Defense & Firearms",
    description: "Self-defense, deadly force, carry rules, prohibited places, firearm signs, and vehicle/property rules.",
  },
  criminal: {
    label: "Everyday Criminal Law",
    description: "Frequently encountered Texas Penal Code issues explained for ordinary readers.",
  },
  family: {
    label: "Marriage & Family",
    description: "Marriage, divorce, custody, support, parental rights, adoption, paternity, and related family law.",
  },
  probate: {
    label: "Wills, Probate & Inheritance",
    description: "Wills, intestacy, probate, powers of attorney, inheritance, guardianship, and estate administration.",
  },
  employment: {
    label: "Employment",
    description: "Pay, termination, leave, overtime, workers' compensation, unemployment, and workplace rights.",
  },
  consumer: {
    label: "Consumer Rights",
    description: "Deceptive practices, vehicle and contractor disputes, debt collection, small claims, and consumer remedies.",
  },
  business: {
    label: "Small Business",
    description: "Texas LLCs, assumed names, licenses, sales tax, franchise tax, records, and business compliance.",
  },
  education: {
    label: "Schools & Parental Rights",
    description: "Attendance, homeschooling, discipline, records, transfers, enrollment, and parental rights.",
  },
  "open-government": {
    label: "Open Government & Civic Rights",
    description: "Public records, open meetings, government transparency, notice rules, and civic access.",
  },
  elections: {
    label: "Elections & Voting",
    description: "Registration, voter ID, early voting, mail ballots, Election Day, and polling-place rules.",
  },
  outdoors: {
    label: "Outdoors, Hunting & Fishing",
    description: "Hunting, fishing, boating, off-road vehicles, parks, licenses, and outdoor recreation rules.",
  },
  alcohol: {
    label: "Alcohol & Everyday Regulations",
    description: "Alcohol sales, public drinking, minors, fireworks, noise, burning, and other common regulations.",
  },
  animals: {
    label: "Animals & Pets",
    description: "Dogs, livestock, service animals, pet rules, cruelty, estrays, and other animal-law topics.",
  },
  "property-tax": {
    label: "Property Tax",
    description: "Homestead exemptions, appraisal protests, tax relief, and Texas property-tax procedure.",
  },
  "legislative-process": {
    label: "Legislative Process",
    description: "How bills become law, effective dates, sessions, constitutional amendments, and statutory change tracking.",
  },
} as const;

export type LawTopic = keyof typeof LAW_TOPICS;
export type LawGuideStatus = "legacy" | "draft" | "verified" | "needs-review";

export type LawSource = {
  label: string;
  url: string;
  primary?: boolean;
};

export type LawGuideMeta = {
  slug: string;
  topic: LawTopic;
  status: LawGuideStatus;
  canonicalPath?: string;
  statutes?: string[];
  sources?: LawSource[];
  lastVerified?: string;
  effectiveDate?: string;
  related?: string[];
  reviewNote?: string;
};

const verifiedDate = "2026-08-13";
const guidePath = (slug: string) => `/guides/${slug}`;
const statuteSource = (label: string, url: string): LawSource => ({ label, url, primary: true });

export const LAW_GUIDES: readonly LawGuideMeta[] = [
  { slug: "texas-gun-laws-explained", topic: "self-defense-firearms", status: "legacy" },
  { slug: "texas-property-tax-laws-explained", topic: "property-tax", status: "legacy" },
  { slug: "texas-election-laws-explained", topic: "elections", status: "legacy" },
  { slug: "constitutional-carry-one-year-later", topic: "self-defense-firearms", status: "legacy" },
  { slug: "how-a-bill-becomes-texas-law", topic: "legislative-process", status: "legacy" },
  { slug: "homestead-exemption-explained", topic: "property-tax", status: "legacy" },
  { slug: "texas-open-meetings-public-info", topic: "open-government", status: "legacy" },
  { slug: "appraisal-protest-playbook", topic: "property-tax", status: "legacy" },
  { slug: "texas-voter-registration-guide", topic: "elections", status: "legacy" },
  { slug: "texas-new-laws-2026", topic: "legislative-process", status: "legacy" },
  { slug: "property-tax-relief-package", topic: "property-tax", status: "legacy" },
  { slug: "speaker-special-session", topic: "legislative-process", status: "legacy" },
  { slug: "texas-constitutional-amendments-guide", topic: "legislative-process", status: "legacy" },

  {
    slug: "texas-speeding-laws-guide",
    topic: "driving",
    status: "verified",
    canonicalPath: guidePath("texas-speeding-laws-guide"),
    statutes: ["Tex. Transp. Code § 545.351", "Tex. Transp. Code § 545.352"],
    lastVerified: verifiedDate,
    sources: [
      statuteSource("Texas Transportation Code § 545.351", "https://statutes.capitol.texas.gov/?artSec=545.351&chapter=TN.545&code=TN&tab=1"),
      statuteSource("Texas Transportation Code § 545.352", "https://statutes.capitol.texas.gov/?artSec=545.352&chapter=TN.545&code=TN&tab=1"),
      { label: "TxDOT highway driving safety", url: "https://www.txdot.gov/safety/driving-laws/tips-highway-driving.html" },
    ],
    related: ["texas-left-lane-passing-law", "texas-move-over-slow-down-law"],
  },
  {
    slug: "texas-seat-belt-child-safety-seat-laws",
    topic: "driving",
    status: "verified",
    canonicalPath: guidePath("texas-seat-belt-child-safety-seat-laws"),
    statutes: ["Tex. Transp. Code § 545.412", "Tex. Transp. Code § 545.4121", "Tex. Transp. Code § 545.413"],
    lastVerified: verifiedDate,
    sources: [
      statuteSource("Texas Transportation Code § 545.412", "https://statutes.capitol.texas.gov/?artSec=545.412&chapter=TN.545&code=TN&tab=1"),
      statuteSource("Texas Transportation Code § 545.413", "https://statutes.capitol.texas.gov/?artSec=545.413&chapter=TN.545&code=TN&tab=1"),
    ],
    related: ["texas-school-bus-stop-law", "texas-texting-driving-phone-laws"],
  },
  {
    slug: "texas-texting-driving-phone-laws",
    topic: "driving",
    status: "verified",
    canonicalPath: guidePath("texas-texting-driving-phone-laws"),
    statutes: ["Tex. Transp. Code § 545.425", "Tex. Transp. Code § 545.4251"],
    lastVerified: verifiedDate,
    sources: [
      statuteSource("Texas Transportation Code § 545.4251", "https://statutes.capitol.texas.gov/?artSec=545.4251&chapter=TN.545&code=TN&tab=1"),
      statuteSource("Texas Transportation Code § 545.425", "https://statutes.capitol.texas.gov/?artSec=545.425&chapter=TN.545&code=TN&tab=1"),
      { label: "Texas DPS distracted-driving enforcement", url: "https://www.dps.texas.gov/news/dps-increases-enforcement-annual-distracted-driving-campaign" },
    ],
    related: ["texas-speeding-laws-guide", "texas-school-bus-stop-law"],
  },
  {
    slug: "texas-move-over-slow-down-law",
    topic: "driving",
    status: "verified",
    canonicalPath: guidePath("texas-move-over-slow-down-law"),
    statutes: ["Tex. Transp. Code § 545.157", "2025 Tex. S.B. 305 (89R)"],
    lastVerified: verifiedDate,
    effectiveDate: "September 1, 2025 (SB 305 expansion)",
    sources: [
      statuteSource("Texas Transportation Code § 545.157", "https://statutes.capitol.texas.gov/?artSec=545.157&chapter=TN.545&code=TN&tab=1"),
      statuteSource("Texas Legislature — SB 305 enrolled text", "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00305F.HTM"),
      { label: "TxDOT — Move Over or Slow Down", url: "https://www.txdot.gov/safety/traffic-safety-campaigns/move-over-or-slow-down.html" },
    ],
    related: ["texas-speeding-laws-guide", "texas-left-lane-passing-law"],
  },
  {
    slug: "texas-auto-insurance-requirements",
    topic: "driving",
    status: "verified",
    canonicalPath: guidePath("texas-auto-insurance-requirements"),
    statutes: ["Tex. Transp. Code ch. 601", "Tex. Transp. Code § 601.051"],
    lastVerified: verifiedDate,
    sources: [
      statuteSource("Texas Transportation Code Chapter 601", "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.601.htm"),
      { label: "Texas Department of Insurance — Auto insurance guide", url: "https://www.tdi.texas.gov/pubs/consumer/cb020.html" },
      { label: "Texas DPS — SR-22 information", url: "https://www.dps.texas.gov/section/driver-license/financial-responsibility-insurance-certificate-sr-22" },
    ],
    related: ["texas-expired-registration-law", "texas-dwi-law-guide"],
  },
  {
    slug: "texas-expired-registration-law",
    topic: "driving",
    status: "verified",
    canonicalPath: guidePath("texas-expired-registration-law"),
    statutes: ["Tex. Transp. Code § 502.407", "Tex. Transp. Code § 502.472"],
    lastVerified: verifiedDate,
    sources: [
      statuteSource("Texas Transportation Code § 502.407", "https://statutes.capitol.texas.gov/?artSec=502.407&chapter=TN.502&code=TN&tab=1"),
      { label: "TxDMV — HB 718 dealer plate changes", url: "https://www.txdmv.gov/dealers/HB718" },
    ],
    related: ["texas-front-license-plate-law", "texas-auto-insurance-requirements"],
  },
  {
    slug: "texas-front-license-plate-law",
    topic: "driving",
    status: "verified",
    canonicalPath: guidePath("texas-front-license-plate-law"),
    statutes: ["Tex. Transp. Code § 504.943"],
    lastVerified: verifiedDate,
    sources: [
      statuteSource("Texas Transportation Code § 504.943", "https://statutes.capitol.texas.gov/?artSec=504.943&chapter=TN.504&code=TN&tab=1"),
      { label: "TxDMV — License Plates", url: "https://www.txdmv.gov/motorists/license-plates" },
      { label: "TxDMV — HB 718 dealer plate changes", url: "https://www.txdmv.gov/dealers/HB718" },
    ],
    related: ["texas-expired-registration-law", "texas-auto-insurance-requirements"],
  },
  {
    slug: "texas-left-lane-passing-law",
    topic: "driving",
    status: "verified",
    canonicalPath: guidePath("texas-left-lane-passing-law"),
    statutes: ["Tex. Transp. Code § 545.051", "Tex. Transp. Code § 545.053"],
    lastVerified: verifiedDate,
    sources: [
      statuteSource("Texas Transportation Code § 545.051", "https://statutes.capitol.texas.gov/?artSec=545.051&chapter=TN.545&code=TN&tab=1"),
      statuteSource("Texas Transportation Code § 545.053", "https://statutes.capitol.texas.gov/?artSec=545.053&chapter=TN.545&code=TN&tab=1"),
      { label: "TxDOT — Highway driving tips", url: "https://www.txdot.gov/safety/driving-laws/tips-highway-driving.html" },
    ],
    related: ["texas-speeding-laws-guide", "texas-move-over-slow-down-law"],
  },
  {
    slug: "texas-school-bus-stop-law",
    topic: "driving",
    status: "verified",
    canonicalPath: guidePath("texas-school-bus-stop-law"),
    statutes: ["Tex. Transp. Code § 545.066"],
    lastVerified: verifiedDate,
    sources: [
      statuteSource("Texas Transportation Code § 545.066", "https://statutes.capitol.texas.gov/?artSec=545.066&chapter=TN.545&code=TN&tab=1"),
      { label: "TxDOT — School bus safety", url: "https://www.txdot.gov/safety/driving-laws/school-bus-safety.html" },
    ],
    related: ["texas-seat-belt-child-safety-seat-laws", "texas-speeding-laws-guide"],
  },
  {
    slug: "texas-dwi-law-guide",
    topic: "driving",
    status: "verified",
    canonicalPath: guidePath("texas-dwi-law-guide"),
    statutes: ["Tex. Penal Code § 49.01", "Tex. Penal Code § 49.04"],
    lastVerified: verifiedDate,
    sources: [
      statuteSource("Texas Penal Code § 49.01", "https://statutes.capitol.texas.gov/?artSec=49.01&chapter=PE.49&code=PE&tab=1"),
      statuteSource("Texas Penal Code § 49.04", "https://statutes.capitol.texas.gov/?artSec=49.04&chapter=PE.49&code=PE&tab=1"),
      { label: "Texas DPS — Administrative License Revocation", url: "https://www.dps.texas.gov/section/driver-license/administrative-license-revocation-alr-program" },
    ],
    related: ["texas-auto-insurance-requirements", "texas-speeding-laws-guide"],
  },
];

const LAW_GUIDE_BY_SLUG = new Map(LAW_GUIDES.map((guide) => [guide.slug, guide] as const));

export function getLawGuideMeta(slug: string): LawGuideMeta | null {
  return LAW_GUIDE_BY_SLUG.get(slug) ?? null;
}

export function lawGuideCanonicalPath(slug: string): string {
  return getLawGuideMeta(slug)?.canonicalPath ?? `/news/${slug}`;
}

export function lawGuidesForTopic(topic: LawTopic): LawGuideMeta[] {
  return LAW_GUIDES.filter((guide) => guide.topic === topic);
}

export function isLawGuideMetaIndexable(guide: LawGuideMeta): boolean {
  return guide.status === "legacy" || guide.status === "verified";
}

export function isLawGuideIndexable(slug: string): boolean {
  const guide = getLawGuideMeta(slug);
  if (!guide) return true;
  return isLawGuideMetaIndexable(guide);
}

export function validateLawGuideMeta(guide: LawGuideMeta): string[] {
  const errors: string[] = [];

  if (!guide.slug.trim()) errors.push("slug is required");
  if (!(guide.topic in LAW_TOPICS)) errors.push(`unknown law topic: ${guide.topic}`);
  if (guide.related?.includes(guide.slug)) errors.push("related guides cannot include the guide itself");

  if (guide.status === "verified") {
    if (!guide.lastVerified || !/^\d{4}-\d{2}-\d{2}$/.test(guide.lastVerified)) {
      errors.push("verified guides require lastVerified in YYYY-MM-DD format");
    }
    if (!guide.sources?.length) errors.push("verified guides require at least one source");
    if (!guide.sources?.some((source) => source.primary)) {
      errors.push("verified guides require at least one primary source");
    }
    for (const source of guide.sources ?? []) {
      try {
        const parsed = new URL(source.url);
        if (parsed.protocol !== "https:") errors.push(`source must use https: ${source.url}`);
      } catch {
        errors.push(`invalid source URL: ${source.url}`);
      }
    }
  }

  return errors;
}

export function createDraftLawGuideMeta(
  slug: string,
  topic: LawTopic,
  related: string[] = [],
): LawGuideMeta {
  return {
    slug,
    topic,
    status: "draft",
    canonicalPath: `/news/${slug}`,
    statutes: [],
    sources: [],
    related,
    reviewNote: "Requires primary-source legal verification before verified publication.",
  };
}
