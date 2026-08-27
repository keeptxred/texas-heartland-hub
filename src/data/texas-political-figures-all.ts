import type { TexasPoliticalFigure } from "@/data/texas-political-figures";
import { TEXAS_POLITICAL_FIGURES as ESTABLISHED_FIGURES } from "@/data/texas-political-figures";
import { ADDITIONAL_TEXAS_POLITICAL_FIGURES as CURATED_EXPANDED_FIGURES } from "@/data/texas-political-figures-expanded";
import { MORE_TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures-expanded-2";
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

const preferredFigures: TexasPoliticalFigurePage[] = [
  ...ESTABLISHED_FIGURES,
  ...CURATED_EXPANDED_FIGURES,
  ...MORE_TEXAS_POLITICAL_FIGURES,
];
const preferredNames = new Set(preferredFigures.map((figure) => figure.name.toLocaleLowerCase("en-US")));

export const ALL_TEXAS_POLITICAL_FIGURES: TexasPoliticalFigurePage[] = [
  ...preferredFigures,
  ...TARGET_FIGURES.filter((figure) => !preferredNames.has(figure.name.toLocaleLowerCase("en-US"))),
];

export const TEXAS_POLITICAL_FIGURES = ALL_TEXAS_POLITICAL_FIGURES;
export {
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADERS,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_SOURCE_ALIASES,
  TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS,
  texasPoliticalFigureByName,
};

export const texasPoliticalFigureBySlug = (slug: string) =>
  ALL_TEXAS_POLITICAL_FIGURES.find((figure) => figure.slug === slug);
