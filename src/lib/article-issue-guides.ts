import { issueGuideBySlug } from "@/data/issue-guides";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";

export type ArticleIssueMatchInput = {
  title: string;
  dek?: string | null;
  category?: string | null;
  text?: string | null;
};

export type ArticleIssueMatch = {
  slug: string;
  score: number;
  reasons: string[];
};

type Rule = {
  slug: string;
  phrases: string[];
  categoryHints?: string[];
};

const RULES: Rule[] = [
  {
    slug: "ercot-grid-reliability",
    phrases: ["ercot", "power grid", "grid reliability", "electric reliability", "power generation", "dispatchable", "winter storm uri", "puc", "public utility commission"],
    categoryHints: ["energy"],
  },
  {
    slug: "texas-oil-gas-federal-regulation",
    phrases: ["oil and gas", "oil & gas", "permian basin", "eagle ford", "railroad commission", "drilling", "fracking", "lng", "refinery", "pipeline"],
    categoryHints: ["energy", "business"],
  },
  {
    slug: "texas-border-security-operation-lone-star",
    phrases: ["operation lone star", "border security", "texas border", "border wall", "illegal entry", "illegal reentry", "cartel", "human smuggling", "texas national guard", "border barrier"],
    categoryHints: ["border", "immigration"],
  },
  {
    slug: "texas-election-law",
    phrases: ["voter id", "mail ballot", "mail-in ballot", "poll watcher", "voter roll", "election integrity", "election code", "voting machine", "ballot security", "signature verification"],
    categoryHints: ["election", "politics"],
  },
  {
    slug: "texas-school-choice-esas",
    phrases: ["school choice", "education savings account", "education savings accounts", "esa program", "private school choice", "school voucher"],
    categoryHints: ["education"],
  },
  {
    slug: "parental-rights-texas-schools",
    phrases: ["parental rights", "parents' rights", "parents rights", "school library", "instructional materials", "curriculum transparency", "parental consent", "school board"],
    categoryHints: ["education"],
  },
  {
    slug: "texas-gun-laws",
    phrases: ["constitutional carry", "permitless carry", "campus carry", "open carry", "gun law", "firearm law", "second amendment", "red flag law"],
    categoryHints: ["law", "public safety"],
  },
  {
    slug: "texas-property-tax-relief",
    phrases: ["property tax", "property taxes", "homestead exemption", "appraisal cap", "school property tax", "m&o tax", "maintenance and operations tax"],
    categoryHints: ["economy", "business", "property tax"],
  },
  {
    slug: "texas-state-federal-power",
    phrases: ["federal overreach", "state sovereignty", "states' rights", "states rights", "federal preemption", "tenth amendment", "10th amendment", "state-federal", "state versus federal", "state vs federal"],
    categoryHints: ["politics", "law"],
  },
  {
    slug: "texas-water-policy",
    phrases: ["texas water", "water supply", "water plan", "groundwater", "aquifer", "water infrastructure", "water rights", "reservoir"],
    categoryHints: ["environment", "agriculture"],
  },
  {
    slug: "rural-texas",
    phrases: ["rural texas", "rural hospital", "rural broadband", "family farm", "family farms", "ranching", "rural county", "rural counties"],
    categoryHints: ["agriculture", "rural"],
  },
  {
    slug: "texas-economy-no-income-tax",
    phrases: ["state income tax", "no income tax", "texas economy", "business relocation", "right-to-work", "right to work", "franchise tax", "rainy day fund"],
    categoryHints: ["economy", "business"],
  },
  {
    slug: "texas-dei-higher-education",
    phrases: ["dei", "diversity equity and inclusion", "diversity, equity and inclusion", "university dei", "campus dei", "sb 17"],
    categoryHints: ["education"],
  },
  {
    slug: "texas-medical-transition-minors-law",
    phrases: ["gender transition", "gender-transition", "gender reassignment", "puberty blocker", "puberty blockers", "gender-affirming care", "sb 14"],
    categoryHints: ["health", "social issues"],
  },
];

function normalize(value: string | null | undefined) {
  return ` ${String(value ?? "").toLowerCase().replace(/[^a-z0-9&'-]+/g, " ").replace(/\s+/g, " ").trim()} `;
}

function phrasePresent(haystack: string, phrase: string) {
  const normalizedPhrase = normalize(phrase).trim();
  return normalizedPhrase.length > 0 && haystack.includes(` ${normalizedPhrase} `);
}

export function matchArticleIssueGuides(input: ArticleIssueMatchInput, limit = 3): ArticleIssueMatch[] {
  if (limit <= 0) return [];

  const title = normalize(input.title);
  const dek = normalize(input.dek);
  const category = normalize(input.category);
  const text = normalize(input.text);

  return RULES.map((rule) => {
    let score = 0;
    const reasons: string[] = [];

    for (const phrase of rule.phrases) {
      if (phrasePresent(title, phrase)) {
        score += 6;
        reasons.push(`title:${phrase}`);
      } else if (phrasePresent(dek, phrase)) {
        score += 4;
        reasons.push(`dek:${phrase}`);
      } else if (phrasePresent(text, phrase)) {
        score += 2;
        reasons.push(`body:${phrase}`);
      }
    }

    for (const hint of rule.categoryHints ?? []) {
      if (phrasePresent(category, hint)) {
        score += 1;
        reasons.push(`category:${hint}`);
      }
    }

    return { slug: rule.slug, score, reasons };
  })
    .filter((match) => {
      const guide = issueGuideBySlug[match.slug];
      return Boolean(guide)
        && isIssueGuideIndexable(guide)
        && match.score >= 2
        && match.reasons.some((reason) => !reason.startsWith("category:"));
    })
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, Math.min(3, limit));
}
