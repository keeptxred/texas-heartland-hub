type UpgradeCandidate = {
  updated?: string;
  editorNote?: string;
  intro?: string[];
  sections?: Array<{ heading?: string; paragraphs?: string[]; bullets?: string[]; [key: string]: unknown }>;
  faq?: Array<{ q?: string; a?: string }>;
  sources?: Array<{ label?: string; url?: string }>;
  [key: string]: unknown;
};

const INTRO_AGE_FINGERPRINT =
  "allowing eligible Texans 21 and older to carry a handgun in most public places without a state-issued License to Carry (LTC).";
const FFL_AGE_FINGERPRINT =
  "Federal law sets the floor: 18 to purchase a long gun from an FFL, 21 to purchase a handgun from an FFL.";
const CARRY_AGE_FINGERPRINT =
  "constitutional carry and the License to Carry both require you to be 21";

const CURRENT_SOURCES = [
  {
    label: "ATF — Minimum Age for Gun Sales and Transfers",
    url: "https://www.atf.gov/resource-center/infographics/minimum-age-gun-sales-and-transfers",
  },
  {
    label: "Texas DPS — License to Carry Eligibility FAQs",
    url: "https://www.dps.texas.gov/section/handgun-licensing/faq/eligibility-faqs",
  },
  {
    label: "Texas State Law Library — Permitless Carry FAQ",
    url: "https://www.sll.texas.gov/faqs/permitless-carry-guns/",
  },
] as const;

function isLegacyGunLawBody(body: UpgradeCandidate): boolean {
  const hasLegacyIntro = body.intro?.some((paragraph) => paragraph.includes(INTRO_AGE_FINGERPRINT));
  const hasLegacySection = body.sections?.some((section) =>
    section.paragraphs?.some((paragraph) =>
      paragraph.includes(FFL_AGE_FINGERPRINT) || paragraph.includes(CARRY_AGE_FINGERPRINT),
    ),
  );
  return Boolean(hasLegacyIntro || hasLegacySection);
}

function replaceIntroParagraph(paragraph: string): string {
  if (!paragraph.includes(INTRO_AGE_FINGERPRINT)) return paragraph;
  return "House Bill 1927 — Texas' 'constitutional carry' law — took effect September 1, 2021, creating permitless handgun carry for people who otherwise meet Texas eligibility requirements. Texas statutes still contain general age-21 language, but a federal court ruling prevents Texas from prosecuting otherwise eligible 18-to-20-year-olds for permitless carry based solely on age. Purchase and transfer rules are separate from carry rules.";
}

function replaceParagraph(paragraph: string): string {
  if (paragraph.includes(FFL_AGE_FINGERPRINT)) {
    return "Federal age rules depend on who is transferring the firearm. ATF states that a federal firearms licensee generally may not transfer a handgun to a person under 21 or a long gun to a person under 18. An unlicensed same-state transfer is different: federal law generally allows an otherwise eligible person age 18 to 20 to acquire a handgun from an unlicensed resident of the same state. State law, prohibited-person rules, and other transfer restrictions still apply.";
  }
  if (paragraph.includes(CARRY_AGE_FINGERPRINT)) {
    return "Texas statutes still contain age-21 language for general handgun carry and LTC eligibility, but current enforcement is affected by federal court rulings. Texas DPS says it no longer denies an otherwise eligible License to Carry application solely because the applicant is 18 to 20. The Texas State Law Library likewise explains that Texas may not prosecute an 18-to-20-year-old for permitless carry based solely on age. Purchase rules are separate from carry rules, so eligibility to carry does not by itself make an under-21 buyer eligible to purchase a handgun from an FFL.";
  }
  return paragraph;
}

/**
 * Narrow current-law correction for the legacy Texas gun-laws explainer. The
 * fingerprint prevents this transform from touching unrelated articles or a
 * future intentional rewrite that no longer contains the superseded language.
 */
export function applyGunLawsCurrentUpgrade<T extends UpgradeCandidate>(body: T): T {
  if (!isLegacyGunLawBody(body)) return body;

  const intro = body.intro?.map(replaceIntroParagraph);
  const sections = body.sections?.map((section) => ({
    ...section,
    paragraphs: section.paragraphs?.map(replaceParagraph),
  }));

  const existingSources = body.sources ?? [];
  const sourceUrls = new Set(existingSources.map((source) => source.url).filter(Boolean));
  const sources = [
    ...existingSources,
    ...CURRENT_SOURCES.filter((source) => !sourceUrls.has(source.url)),
  ];

  return {
    ...body,
    updated: "2026-09-02",
    editorNote:
      "Reviewed September 2, 2026. Age-related carry and purchase guidance was updated to reflect current Texas DPS enforcement after federal court rulings and ATF guidance distinguishing licensed-dealer transfers from qualifying same-state unlicensed transfers. Firearm law changes quickly; readers should confirm current rules with the cited official sources.",
    intro,
    sections,
    sources,
  } as T;
}
