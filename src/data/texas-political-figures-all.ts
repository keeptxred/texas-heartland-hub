import type { TexasPoliticalFigure } from "@/data/texas-political-figures";
import { TEXAS_POLITICAL_FIGURES as ESTABLISHED_FIGURES } from "@/data/texas-political-figures";
import { withPoliticalFigureDepthSupplements } from "@/data/texas-political-figure-depth-supplements";
import { ADDITIONAL_TEXAS_POLITICAL_FIGURES as CURATED_EXPANDED_FIGURES } from "@/data/texas-political-figures-expanded";
import { MORE_TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures-expanded-2";
import { RECONSTRUCTION_TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures-reconstruction";
import {
  TEXAS_POLITICAL_FIGURES as TARGET_FIGURES,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADERS,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_SOURCE_ALIASES,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS,
  texasPoliticalFigureByName,
} from "./texas-political-figures-target";
import type { PoliticalFigureCategory } from "./texas-political-figure-builder";

export type TexasPoliticalFigurePage = TexasPoliticalFigure & {
  sources?: Array<{ href: string; label: string }>;
  category?: PoliticalFigureCategory;
  seoKeywords?: string[];
  relatedFigureSlugs?: string[];
  aliases?: string[];
};

const establishedFigures = ESTABLISHED_FIGURES.map(withPoliticalFigureDepthSupplements);

const preferredFigures: TexasPoliticalFigurePage[] = [
  ...establishedFigures,
  ...CURATED_EXPANDED_FIGURES,
  ...MORE_TEXAS_POLITICAL_FIGURES,
  ...RECONSTRUCTION_TEXAS_POLITICAL_FIGURES,
];

const normalizedIdentity = (value: string) => value.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, " ").trim();
const identityKeys = (figure: Pick<TexasPoliticalFigurePage, "name" | "aliases">) =>
  Array.from(new Set([figure.name, ...(figure.aliases ?? [])].map(normalizedIdentity).filter(Boolean)));

const preferredByIdentity = new Map<string, TexasPoliticalFigurePage>();
for (const figure of preferredFigures) {
  for (const key of identityKeys(figure)) {
    if (!preferredByIdentity.has(key)) preferredByIdentity.set(key, figure);
  }
}

const preferredFigureForTarget = (figure: TexasPoliticalFigurePage) => {
  for (const key of identityKeys(figure)) {
    const preferred = preferredByIdentity.get(key);
    if (preferred) return preferred;
  }
  return undefined;
};

const targetFigureMatches = TARGET_FIGURES.map((figure) => ({
  figure,
  preferred: preferredFigureForTarget(figure),
}));

export const ALL_TEXAS_POLITICAL_FIGURES: TexasPoliticalFigurePage[] = [
  ...preferredFigures,
  ...targetFigureMatches.filter(({ preferred }) => !preferred).map(({ figure }) => figure),
];

const legacySlugRedirectEntries: Array<[string, string]> = [];
for (const { figure, preferred } of targetFigureMatches) {
  if (preferred && preferred.slug !== figure.slug) legacySlugRedirectEntries.push([figure.slug, preferred.slug]);
}

export const POLITICAL_FIGURE_LEGACY_SLUG_REDIRECTS: Record<string, string> = Object.fromEntries(legacySlugRedirectEntries);

export const TEXAS_POLITICAL_FIGURES = ALL_TEXAS_POLITICAL_FIGURES;
export {
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADERS,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_SOURCE_ALIASES,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS,
  texasPoliticalFigureByName,
};

export const texasPoliticalFigureBySlug = (slug: string) =>
  ALL_TEXAS_POLITICAL_FIGURES.find((figure) => figure.slug === slug);

export const texasPoliticalFigurePageByName = (name: string) => {
  const target = texasPoliticalFigureByName(name);
  if (target) {
    const preferred = preferredFigureForTarget(target);
    if (preferred) return preferred;
    return texasPoliticalFigureBySlug(target.slug);
  }

  const key = normalizedIdentity(name);
  return preferredByIdentity.get(key) ?? ALL_TEXAS_POLITICAL_FIGURES.find((figure) => identityKeys(figure).includes(key));
};
