import type { IssueGuide } from "@/data/issue-guides";

const POLICY_OWNERSHIP_SECTION = {
  heading: "KTR covers policy; TexasDefined covers homeowner tasks",
  body: [
    "Keep TX Red uses this page for the policy side of Texas property taxes: legislation, constitutional amendments, school-finance changes, rate compression, appraisal-law changes, state budget choices, local taxing authority and implementation of enacted relief. Those are government and public-policy questions, so they remain part of KTR's Texas Legislature and fiscal-policy coverage.",
    "Practical homeowner tasks belong on TexasDefined. That includes estimating a bill, finding an appraisal district or tax office, claiming a homestead exemption, preparing an appraisal protest, checking deadlines, comparing county or taxing-unit rates and understanding payment logistics. Keeping those service questions on TexasDefined prevents the two sites from competing for the same search intent while preserving KTR's policy authority."
  ]
} satisfies IssueGuide["sections"][number];

export function applyPropertyTaxPolicyOwnershipPatch(guide: IssueGuide): IssueGuide {
  if (guide.slug !== "texas-property-tax-relief") return guide;

  return {
    ...guide,
    title: "Texas Property Tax Policy & Relief: Legislature, Rates and School Finance",
    dek: "How Texas lawmakers, constitutional rules, school-finance policy and local taxing authority shape property-tax relief. Practical homeowner tools and filing guidance live on TexasDefined.",
    quickAnswer: "Keep TX Red tracks Texas property-tax policy: legislation, constitutional amendments, school-finance changes, rate compression, appraisal-law changes and the implementation of state relief. Practical homeowner questions such as exemptions, appraisal protests, calculators, county offices and payment steps belong on TexasDefined so each site serves a distinct search intent.",
    sections: [POLICY_OWNERSHIP_SECTION, ...guide.sections],
  };
}
