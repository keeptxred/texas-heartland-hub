import { issueGuideBySlug, type IssueGuide } from "@/data/issue-guides";

type Rule = {
  slug: string;
  patterns: RegExp[];
};

const RULES: Rule[] = [
  { slug: "texas-oil-gas-federal-regulation", patterns: [/oil\b/i, /natural gas/i, /permian/i, /eagle ford/i, /lng\b/i, /pipeline/i, /railroad commission/i, /drilling/i, /refiner/i] },
  { slug: "ercot-grid-reliability", patterns: [/ercot/i, /power grid/i, /electric grid/i, /blackout/i, /power plant/i, /electricity/i, /transmission/i, /data center.*power/i] },
  { slug: "texas-border-security-operation-lone-star", patterns: [/operation lone star/i, /border security/i, /border wall/i, /illegal immigration/i, /illegal entr/i, /migrant/i, /cartel/i, /human smuggling/i, /texas national guard/i] },
  { slug: "texas-election-law", patterns: [/election integrity/i, /voter id/i, /mail ballot/i, /mail-in ballot/i, /poll watcher/i, /voter roll/i, /election code/i, /voting machine/i, /early voting/i] },
  { slug: "texas-school-choice-esas", patterns: [/school choice/i, /education savings account/i, /\besa\b/i, /private school/i, /voucher/i] },
  { slug: "parental-rights-texas-schools", patterns: [/parental rights/i, /school curriculum/i, /instructional material/i, /school library/i, /school board/i, /student records/i] },
  { slug: "texas-gun-laws", patterns: [/constitutional carry/i, /permitless carry/i, /gun law/i, /firearm/i, /second amendment/i, /license to carry/i] },
  { slug: "texas-property-tax-relief", patterns: [/property tax/i, /homestead exemption/i, /appraisal district/i, /tax appraisal/i, /school tax/i, /tax compression/i] },
  { slug: "texas-state-federal-power", patterns: [/federal overreach/i, /tenth amendment/i, /10th amendment/i, /federal preemption/i, /state sovereignty/i, /texas v\.? /i, /sues? (the )?(federal government|biden|trump|epa|doj)/i] },
  { slug: "texas-water-policy", patterns: [/water supply/i, /water rights/i, /groundwater/i, /aquifer/i, /reservoir/i, /drought/i, /water infrastructure/i] },
  { slug: "rural-texas", patterns: [/rural texas/i, /rural hospital/i, /rural broadband/i, /farmers?\b/i, /ranchers?\b/i, /agriculture/i] },
  { slug: "texas-economy-no-income-tax", patterns: [/state income tax/i, /no income tax/i, /sales tax/i, /severance tax/i, /franchise tax/i, /texas economy/i, /state spending/i, /state budget/i] },
  { slug: "texas-dei-higher-education", patterns: [/\bdei\b/i, /diversity.*equity.*inclusion/i, /sb\s*17/i, /university.*diversity/i] },
  { slug: "texas-medical-transition-minors-law", patterns: [/sb\s*14/i, /gender[- ]transition/i, /gender[- ]affirm/i, /transgender.*minor/i, /minor.*transition/i] },
];

export function matchIssueGuides(text: string, limit = 3): IssueGuide[] {
  const normalized = text.replace(/\s+/g, " ");
  const scored = RULES.map((rule) => ({
    guide: issueGuideBySlug[rule.slug],
    score: rule.patterns.reduce((score, pattern) => score + (pattern.test(normalized) ? 1 : 0), 0),
  }))
    .filter((entry): entry is { guide: IssueGuide; score: number } => Boolean(entry.guide) && entry.score > 0)
    .sort((a, b) => b.score - a.score || a.guide.title.localeCompare(b.guide.title));

  return scored.slice(0, Math.max(0, limit)).map((entry) => entry.guide);
}
