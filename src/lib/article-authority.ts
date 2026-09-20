import {
  getSourceAuthorityProfile,
  isPrimaryOrOfficialSource,
  sourceAuthorityLabel,
} from "@/data/source-authority";
import { pickExactArticleAuthorityLinks } from "@/lib/article-authority-entity-links";

export type AuthorityInternalLink = { label: string; href: string };

type BodySource = { label?: string; url?: string };
type BodySection = { heading?: string; paragraphs?: string[]; bullets?: string[] };
type AuthorityBody = {
  intro?: string[];
  sections?: BodySection[];
  faq?: Array<{ q?: string; a?: string }>;
  sources?: BodySource[];
  keyTakeaways?: string[];
  authority?: Record<string, unknown>;
  [key: string]: unknown;
};

type AuthorityInput = {
  bodyJson: unknown;
  kind?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  internalLinks?: AuthorityInternalLink[];
};

export type AuthorityEnrichmentResult = {
  bodyJson: unknown;
  flags: string[];
};

const EXPLICIT_PRIMARY_SOURCE_RE = /primary\s*\/\s*official source|primary government source|official system source/i;

function normalizeSourceName(label: string): string {
  return label
    .replace(/\s+[—–-]\s+(?:primary\s*\/\s*official source|primary government source|official system source|reporting source|news and commentary source|policy and analysis source|published source|original report|source)$/i, "")
    .trim();
}

function hasHeading(sections: BodySection[], heading: string): boolean {
  return sections.some((section) => section.heading?.trim().toLowerCase() === heading.toLowerCase());
}

function uniqueSources(input: BodySource[]): BodySource[] {
  const seen = new Set<string>();
  const out: BodySource[] = [];
  for (const source of input) {
    const url = source.url?.trim();
    const label = source.label?.trim();
    if (!url && !label) continue;
    const key = (url || label || "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ label, url });
  }
  return out;
}

function bodyContextText(body: AuthorityBody): string {
  const parts: string[] = [];
  for (const paragraph of body.intro ?? []) parts.push(paragraph);
  for (const section of body.sections ?? []) {
    if (section.heading) parts.push(section.heading);
    for (const paragraph of section.paragraphs ?? []) parts.push(paragraph);
    for (const bullet of section.bullets ?? []) parts.push(bullet);
  }
  for (const faq of body.faq ?? []) {
    if (faq.q) parts.push(faq.q);
    if (faq.a) parts.push(faq.a);
  }
  for (const takeaway of body.keyTakeaways ?? []) parts.push(takeaway);
  return parts.join(" ");
}

function uniqueInternalLinks(input: readonly AuthorityInternalLink[]): AuthorityInternalLink[] {
  const seen = new Set<string>();
  const out: AuthorityInternalLink[] = [];
  for (const link of input) {
    const href = link.href?.trim();
    const label = link.label?.trim();
    if (!href || !label || href === "/news" || seen.has(href)) continue;
    seen.add(href);
    out.push({ label, href });
  }
  return out;
}

export function applyGeneratedNewsAuthority(input: AuthorityInput): AuthorityEnrichmentResult {
  if (input.kind !== "news" || !input.bodyJson || typeof input.bodyJson !== "object" || Array.isArray(input.bodyJson)) {
    return { bodyJson: input.bodyJson, flags: [] };
  }

  const body = { ...(input.bodyJson as AuthorityBody) };
  const contextualAuthorityLinks = pickExactArticleAuthorityLinks(bodyContextText(body));
  const sections = Array.isArray(body.sections) ? [...body.sections] : [];
  const existingSources = Array.isArray(body.sources) ? uniqueSources(body.sources) : [];

  if (existingSources.length === 0 && input.sourceUrl) {
    existingSources.push({
      label: input.sourceName || "Original source",
      url: input.sourceUrl,
    });
  }

  const sources = existingSources.map((source) => {
    const originalLabel = source.label || input.sourceName || "Published source";
    const wasExplicitPrimary = EXPLICIT_PRIMARY_SOURCE_RE.test(originalLabel);
    const sourceName = normalizeSourceName(originalLabel);
    const valueForClassification = `${sourceName} ${source.url || ""}`;
    return {
      label: sourceAuthorityLabel({
        source: sourceName,
        url: source.url,
        isPrimarySource: wasExplicitPrimary || isPrimaryOrOfficialSource(valueForClassification),
      }),
      url: source.url,
    };
  });

  const primarySourceCount = sources.filter((source) =>
    isPrimaryOrOfficialSource(`${source.label || ""} ${source.url || ""}`)
    || EXPLICIT_PRIMARY_SOURCE_RE.test(source.label || ""),
  ).length;
  const sourceCount = sources.length;
  const flags: string[] = [];
  if (sourceCount === 1 && primarySourceCount === 0) flags.push("single_source_aggregation");

  if (!hasHeading(sections, "How This Story Was Built")) {
    const sourceSentence = sourceCount > 1
      ? `This Keep TX Red article uses ${sourceCount} linked published sources${primarySourceCount ? `, including ${primarySourceCount} primary or official source${primarySourceCount === 1 ? "" : "s"}` : ""}. The source links are preserved below so readers can check the underlying material.`
      : sourceCount === 1
        ? `This Keep TX Red article is based on one linked published source. It was independently rewritten and structured for Texas readers; it is not presented as original Keep TX Red reporting.`
        : "This Keep TX Red article is an aggregation product. Source provenance should be reviewed before relying on claims that are not linked to supporting material.";
    sections.unshift({
      heading: "How This Story Was Built",
      paragraphs: [
        sourceSentence,
        "[Review Keep TX Red's source classifications and primary-source policy](/sources). Inclusion of a source does not imply endorsement.",
      ],
    });
  }

  const sourceProfileLinks = sources
    .map((source) => {
      const profile = getSourceAuthorityProfile(`${source.label || ""} ${source.url || ""}`);
      return profile ? `[About ${profile.name} as a Keep TX Red source](/sources/${profile.slug})` : null;
    })
    .filter((value): value is string => Boolean(value));
  const uniqueProfileLinks = [...new Set(sourceProfileLinks)].slice(0, 4);
  if (uniqueProfileLinks.length > 0 && !hasHeading(sections, "Source Context")) {
    sections.push({
      heading: "Source Context",
      paragraphs: uniqueProfileLinks,
    });
  }

  const relatedLinks = uniqueInternalLinks([
    ...contextualAuthorityLinks,
    ...(input.internalLinks ?? []),
  ])
    .slice(0, 5)
    .map((link) => `[${link.label}](${link.href})`);
  if (relatedLinks.length > 0 && !hasHeading(sections, "Related Keep TX Red Resources")) {
    sections.push({
      heading: "Related Keep TX Red Resources",
      paragraphs: relatedLinks,
    });
  }

  body.sections = sections;
  body.sources = sources;
  body.authority = {
    ...(body.authority ?? {}),
    model: sourceCount > 1 ? "aggregated" : "single-source-rewrite",
    sourceCount,
    primarySourceCount,
    contextualAuthorityLinkCount: contextualAuthorityLinks.length,
    transparentAggregation: true,
    originalReportingClaimed: false,
  };

  return { bodyJson: body, flags };
}
