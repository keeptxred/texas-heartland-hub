import type { RelatedResourceItem } from "@/components/elections/resources";

export interface ElectionInternalLinkTarget {
  href: string;
  label: string;
  context: string;
}

export interface ElectionInternalLinkReview {
  outgoingLinks: readonly ElectionInternalLinkTarget[];
  futureInboundSources: readonly string[];
}

export interface ElectionInternalLinkValidationResult {
  valid: boolean;
  errors: string[];
}

export const ELECTION_INTERNAL_LINK_RULES = {
  minimumContextualLinksPerPage: 2,
  requireExistingInternalRoutes: true,
  requireDescriptiveAnchorText: true,
  requireOutgoingLinkReview: true,
  requireFutureInboundLinkReview: true,
  prohibitPlaceholderRoutes: true,
} as const;

const PLACEHOLDER_ROUTE_PATTERNS = [
  /^#$/,
  /^javascript:/i,
  /\b(todo|tbd|placeholder)\b/i,
];

const GENERIC_ANCHOR_TEXT = new Set([
  "click here",
  "read more",
  "learn more",
  "more",
  "here",
]);

export function validateElectionInternalLinks(
  review: ElectionInternalLinkReview,
): ElectionInternalLinkValidationResult {
  const errors: string[] = [];

  if (review.outgoingLinks.length < ELECTION_INTERNAL_LINK_RULES.minimumContextualLinksPerPage) {
    errors.push(
      `Election pages should include at least ${ELECTION_INTERNAL_LINK_RULES.minimumContextualLinksPerPage} contextual internal links when relevant.`,
    );
  }

  for (const link of review.outgoingLinks) {
    if (!link.href.startsWith("/")) {
      errors.push(`Internal link must use a site-relative route: ${link.href}`);
    }

    if (PLACEHOLDER_ROUTE_PATTERNS.some((pattern) => pattern.test(link.href))) {
      errors.push(`Placeholder or invalid internal route is not allowed: ${link.href}`);
    }

    if (GENERIC_ANCHOR_TEXT.has(link.label.trim().toLowerCase())) {
      errors.push(`Use descriptive anchor text instead of \"${link.label}\".`);
    }

    if (!link.context.trim()) {
      errors.push(`Internal link ${link.href} must document why it is relevant.`);
    }
  }

  if (review.futureInboundSources.length === 0) {
    errors.push("Document at least one existing or future page that should link back to this Election Central page.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function toRelatedResources(
  links: readonly ElectionInternalLinkTarget[],
): RelatedResourceItem[] {
  return links.map((link) => ({
    title: link.label,
    href: link.href,
    description: link.context,
  }));
}
