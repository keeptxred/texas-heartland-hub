import {
  getContentPillar,
  getRelatedContentPillars,
  type ContentPillarSlug,
} from "@/lib/content-pillars";
import { issueGuideBySlug, type IssueGuide } from "@/data/issue-guides";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";

const PILLAR_ISSUE_GUIDES: Partial<Record<ContentPillarSlug, readonly string[]>> = {
  "texas-politics-government": [
    "texas-state-federal-power",
    "texas-election-law",
    "texas-economy-no-income-tax",
  ],
  "texas-elections": [
    "texas-election-law",
    "texas-state-federal-power",
  ],
  "texas-border-immigration": [
    "texas-border-security-operation-lone-star",
    "texas-state-federal-power",
    "rural-texas",
  ],
  "texas-energy-oil": [
    "ercot-grid-reliability",
    "texas-oil-gas-federal-regulation",
    "texas-state-federal-power",
  ],
  "texas-economy-small-business": [
    "texas-economy-no-income-tax",
    "texas-property-tax-relief",
    "texas-water-policy",
  ],
  "texas-agriculture-rural": [
    "rural-texas",
    "texas-water-policy",
    "texas-property-tax-relief",
  ],
  "texas-law-enforcement-public-safety": [
    "texas-gun-laws",
    "texas-border-security-operation-lone-star",
    "texas-state-federal-power",
  ],
  "texas-laws-legislature": [
    "texas-election-law",
    "texas-gun-laws",
    "parental-rights-texas-schools",
  ],
};

export function PillarRelationshipNav({ pillarSlug }: { pillarSlug: ContentPillarSlug }) {
  const pillar = getContentPillar(pillarSlug);
  const related = getRelatedContentPillars(pillarSlug);
  const issueGuides = (PILLAR_ISSUE_GUIDES[pillarSlug] ?? [])
    .map((slug) => issueGuideBySlug[slug])
    .filter((guide): guide is IssueGuide => Boolean(guide) && isIssueGuideIndexable(guide));

  return (
    <section className="mt-10 max-w-4xl border-t border-border pt-6" aria-labelledby={`${pillarSlug}-coverage-map`}>
      <h2 id={`${pillarSlug}-coverage-map`} className="font-display text-xl tracking-tight">Explore this Texas topic</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>

      <div className="mt-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Covered here</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {pillar.subtopics.map((subtopic) => (
            <li key={subtopic} className="border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold">
              {subtopic}
            </li>
          ))}
        </ul>
      </div>

      {issueGuides.length > 0 ? (
        <nav className="mt-5" aria-label={`Issue guides for ${pillar.title}`}>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Issue guides & explainers</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {issueGuides.map((guide) => (
              <a key={guide.slug} href={`/issues/${guide.slug}`} className="border border-border bg-muted/20 px-3 py-3 transition hover:border-primary">
                <span className="block text-sm font-semibold text-primary">{guide.title} →</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">{guide.dek}</span>
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      <nav className="mt-5" aria-label={`Related coverage for ${pillar.title}`}>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Related coverage</h3>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {related.map((item) => (
            <a key={item.slug} href={item.href} className="text-primary hover:underline underline-offset-4">
              {item.title} →
            </a>
          ))}
        </div>
      </nav>
    </section>
  );
}
