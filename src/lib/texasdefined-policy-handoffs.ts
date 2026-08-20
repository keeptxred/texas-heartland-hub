export type TexasDefinedPolicyHandoff = {
  href: string;
  label: string;
  description: string;
};

const TEXASDEFINED_POLICY_HANDOFFS: Record<string, TexasDefinedPolicyHandoff> = {
  "right-to-work": {
    href: "https://texasdefined.com/article/texas-jobs-economy-industries",
    label: "Texas jobs and industries",
    description: "See how right-to-work and at-will rules fit into the practical job market, major industry clusters and metro-by-metro employment landscape.",
  },
  "public-sector-labor": {
    href: "https://texasdefined.com/article/texas-jobs-economy-industries",
    label: "Texas jobs and industries",
    description: "Move from labor policy into the practical employment landscape across energy, technology, health care, finance, manufacturing and government-adjacent work.",
  },
  "e-verify-employment": {
    href: "https://texasdefined.com/article/texas-jobs-economy-industries",
    label: "Texas jobs and industries",
    description: "Use the practical employment guide for the broader Texas labor market while KTR keeps the compliance and policy questions here.",
  },
  "charter-schools": {
    href: "https://texasdefined.com/article/texas-schools-family-life",
    label: "Texas schools and family life",
    description: "See how charters fit beside ISDs, campus boundaries, STAAR, Pre-K, UIL and family relocation decisions.",
  },
  "homeschool-autonomy": {
    href: "https://texasdefined.com/article/texas-schools-family-life",
    label: "Texas schools and family life",
    description: "Use the family guide for the practical home-school and public-school transfer side while KTR tracks the legal and legislative framework.",
  },
  "parental-rights": {
    href: "https://texasdefined.com/article/texas-schools-family-life",
    label: "Texas schools and family life",
    description: "Compare school systems, enrollment choices and family logistics separately from the parental-rights policy debate.",
  },
  "medical-freedom": {
    href: "https://texasdefined.com/article/texas-health-safety-daily-living",
    label: "Texas health and daily safety",
    description: "Keep the policy questions here and use TexasDefined for practical provider, heat, storm, allergy and everyday health-system considerations.",
  },
  "property-taxes": {
    href: "https://texasdefined.com/property-tax-calculators",
    label: "Texas property-tax calculators",
    description: "Estimate the household impact of county, city, school-district and special-district taxes while KTR tracks the policy and legislative changes.",
  },
  housing: {
    href: "https://texasdefined.com/article/moving-to-texas-what-nobody-tells-you",
    label: "Moving to Texas: what nobody tells you",
    description: "Use the practical housing, insurance, MUD/PID, utility and relocation guide alongside KTR's housing and property-rights policy coverage.",
  },
  "energy-ercot": {
    href: "https://texasdefined.com/article/how-to-choose-electricity-plan-texas",
    label: "How to choose a Texas electricity plan",
    description: "Turn ERCOT and energy policy into a household decision by comparing Electricity Facts Labels, usage patterns and retail-plan fine print.",
  },
  "agriculture-family-farms": {
    href: "https://texasdefined.com/article/texas-major-cities-regional-differences",
    label: "Texas cities and regional differences",
    description: "See how rural, agricultural, suburban and metropolitan Texas differ on the ground while KTR follows farm, land and property-rights policy.",
  },
  "state-federal-power": {
    href: "https://texasdefined.com/article/texas-major-cities-regional-differences",
    label: "Texas cities and regional differences",
    description: "Use the regional guide for nonpolitical geographic and community context while KTR keeps federalism and government authority on this page.",
  },
};

export const texasDefinedPolicyHandoffFor = (slug: string) =>
  TEXASDEFINED_POLICY_HANDOFFS[slug] ?? null;
