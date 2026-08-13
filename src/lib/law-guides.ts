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
  /** Canonical route currently used by KTR evergreen articles. */
  canonicalPath?: string;
  /** Plain-English statutory citations such as "Tex. Prop. Code § 92.109". */
  statutes?: string[];
  /** Primary authority links used to verify substantive legal claims. */
  sources?: LawSource[];
  /** ISO date of the most recent legal/source verification. */
  lastVerified?: string;
  /** ISO date or human-readable effective-date note when the rule has a specific effective date. */
  effectiveDate?: string;
  /** Related law-guide slugs. */
  related?: string[];
  /** Optional reason the guide is held from verified publication. */
  reviewNote?: string;
};

/**
 * Existing law-related guides currently surfaced by /laws.
 *
 * They are intentionally marked `legacy` until each is migrated through the
 * new source-verification workflow. Legacy means "preserve existing indexability";
 * it does not imply a fresh legal review. New guides should begin as `draft`
 * and move to `verified` only after primary-source review.
 */
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

/**
 * Safe sitemap/publication guard for guides that have entered the new registry.
 * Unknown slugs preserve existing behavior so this migration cannot silently
 * de-index unrelated legacy content. Once the inventory is complete, this can
 * be tightened to require registration for every `contentCategory: "laws"` item.
 */
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
