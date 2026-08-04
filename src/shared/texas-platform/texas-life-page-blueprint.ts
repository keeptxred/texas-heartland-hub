import {
  TEXAS_LIFE_PAGE_STANDARDS,
  createTrustStatement,
  type TexasLifePillarId,
  type TexasLifeTrustStatement,
  validateTexasLifePage,
} from './texas-life-platform';

export type TexasLifePageBlueprint = {
  id: string;
  title: string;
  pillar: TexasLifePillarId;
  what: string;
  why: string;
  next: string;
  verify: string;
  else: string;
  trust: TexasLifeTrustStatement;
  nextSteps: Array<{ title: string; href: string }>;
};

export type TexasLifeBlueprintValidation = {
  complete: boolean;
  missing: string[];
  errors: string[];
};

function isInternalHref(href: string) {
  return href.startsWith('/') && !href.startsWith('//');
}

export function validateTexasLifeBlueprint(
  blueprint: Partial<TexasLifePageBlueprint>,
): TexasLifeBlueprintValidation {
  const page = validateTexasLifePage({
    what: blueprint.what,
    why: blueprint.why,
    next: blueprint.next,
    verify: blueprint.verify,
    else: blueprint.else,
  });
  const errors: string[] = [];

  if (!blueprint.id?.trim()) errors.push('Page ID is required.');
  if (!blueprint.title?.trim()) errors.push('Page title is required.');
  if (!blueprint.pillar) errors.push('Texas Life pillar is required.');

  if (!blueprint.trust) {
    errors.push('Trust statement is required.');
  } else {
    try {
      createTrustStatement(blueprint.trust);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Trust statement is invalid.');
    }
  }

  if (!blueprint.nextSteps?.length) {
    errors.push('At least one natural next step is required.');
  } else {
    const seen = new Set<string>();
    for (const step of blueprint.nextSteps) {
      if (!step.title.trim()) errors.push('Next-step title is required.');
      if (!isInternalHref(step.href)) errors.push(`Next-step URL must be internal: ${step.href}`);
      if (seen.has(step.href)) errors.push(`Duplicate next-step URL: ${step.href}`);
      seen.add(step.href);
    }
  }

  return {
    complete: page.complete && errors.length === 0,
    missing: page.missing.map((id) => TEXAS_LIFE_PAGE_STANDARDS.find((item) => item.id === id)?.question ?? id),
    errors,
  };
}

export function createTexasLifeBlueprint(blueprint: TexasLifePageBlueprint) {
  const validation = validateTexasLifeBlueprint(blueprint);
  if (!validation.complete) {
    throw new Error([...validation.missing, ...validation.errors].join(' '));
  }
  return {
    ...blueprint,
    id: blueprint.id.trim(),
    title: blueprint.title.trim(),
    what: blueprint.what.trim(),
    why: blueprint.why.trim(),
    next: blueprint.next.trim(),
    verify: blueprint.verify.trim(),
    else: blueprint.else.trim(),
    trust: createTrustStatement(blueprint.trust),
    nextSteps: blueprint.nextSteps.map((step) => ({ title: step.title.trim(), href: step.href })),
  };
}
