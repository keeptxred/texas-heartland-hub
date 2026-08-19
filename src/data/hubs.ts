export type Hub = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  pillarSlug: string;
  articleSlugs: string[];
};

export const HUBS: Hub[] = [
  {
    slug: "texas-politics",
    title: "Texas Politics & Government",
    eyebrow: "Content Pillar",
    intro:
      "From the Capitol in Austin to statewide offices and local political power, this is Keep TX Red's map of Texas government, political leadership, elections, and the decisions that shape public policy.",
    pillarSlug: "texas-voting-guide-2026",
    articleSlugs: [
      "texas-voting-guide-2026",
      "how-a-bill-becomes-texas-law",
      "primary-vs-general-election",
      "beginners-guide-texas-elections",
      "texas-voter-registration-guide",
      "texas-political-terminology",
      "texas-attorney-general-powers",
      "texas-governor-powers",
    ],
  },
  {
    slug: "texas-economy",
    title: "Texas Economy & Small Business",
    eyebrow: "Content Pillar",
    intro:
      "Jobs, taxes, state spending, regulation, entrepreneurship, and the policy decisions that affect Texas employers and small businesses — with the numbers and legislation behind the headlines.",
    pillarSlug: "texas-property-tax-guide",
    articleSlugs: [
      "texas-property-tax-guide",
      "homestead-exemption-explained",
      "appraisal-protest-playbook",
      "county-appraisal-districts-explained",
      "why-texas-has-no-income-tax",
      "how-texas-counties-spend",
      "texas-energy-economy-overview",
    ],
  },
  {
    slug: "texas-border-security",
    title: "Texas Border & Immigration",
    eyebrow: "Content Pillar",
    intro:
      "Border security, immigration enforcement, Operation Lone Star, ports of entry, and the state-federal policy disputes that directly affect Texas communities along and beyond the Rio Grande.",
    pillarSlug: "texas-border-policy-full-guide",
    articleSlugs: [
      "texas-border-policy-full-guide",
      "border-security-state-role",
      "texas-border-geography-101",
    ],
  },
  {
    slug: "texas-energy",
    title: "Texas Energy & Oil",
    eyebrow: "Content Pillar",
    intro:
      "Oil and gas, the Permian Basin, ERCOT, electricity reliability, pipelines, refineries, LNG, and the state policy decisions behind the energy system that powers Texas.",
    pillarSlug: "texas-energy-economy-overview",
    articleSlugs: [
      "texas-energy-economy-overview",
      "texas-grid-ercot-explained",
      "texas-energy-policy-guide",
    ],
  },
  {
    slug: "texas-agriculture",
    title: "Texas Agriculture & Rural Texas",
    eyebrow: "Content Pillar",
    intro:
      "Farmers, ranchers, livestock, crops, drought, water, rural communities, and the public policy that shapes the Texas agricultural economy and life outside the state's largest metros.",
    pillarSlug: "",
    articleSlugs: [],
  },
  {
    slug: "texas-veterans",
    title: "Texas Veterans & Military",
    eyebrow: "Content Pillar",
    intro:
      "Texas veterans, active-duty service members, military installations, benefits, honors, deployments, and state and federal decisions with a direct Texas military impact.",
    pillarSlug: "",
    articleSlugs: [],
  },
  {
    slug: "texas-law-enforcement",
    title: "Texas Law Enforcement & Public Safety",
    eyebrow: "Content Pillar",
    intro:
      "Police, sheriffs, DPS, criminal justice, emergency response, major enforcement actions, and the laws and policies governing public safety across Texas.",
    pillarSlug: "",
    articleSlugs: [],
  },
  {
    slug: "texas-policy-law",
    title: "Texas Laws & Legislature",
    eyebrow: "Content Pillar",
    intro:
      "Texas statutes, bills, constitutional amendments, rulemaking, legislative sessions, committees, and the policy fights that determine what state government can and cannot do.",
    pillarSlug: "how-a-bill-becomes-texas-law",
    articleSlugs: [
      "how-a-bill-becomes-texas-law",
      "texas-constitutional-amendments-guide",
      "texas-open-meetings-public-info",
      "what-local-governments-control",
      "constitutional-carry-one-year-later",
      "texas-school-board-powers",
      "school-choice-esa-guide",
      "texas-school-finance-explained",
      "texas-water-rights-explained",
    ],
  },
];
