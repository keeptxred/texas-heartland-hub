import type { TexasPoliticalFigure } from "@/data/texas-political-figures";
import { TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures";
import { ADDITIONAL_TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures-expanded";

export type TexasPoliticalFigurePage = TexasPoliticalFigure & {
  sources?: Array<{ href: string; label: string }>;
};

export const ALL_TEXAS_POLITICAL_FIGURES: TexasPoliticalFigurePage[] = [
  ...TEXAS_POLITICAL_FIGURES,
  ...ADDITIONAL_TEXAS_POLITICAL_FIGURES,
];

export const texasPoliticalFigureBySlug = (slug: string) =>
  ALL_TEXAS_POLITICAL_FIGURES.find((figure) => figure.slug === slug);
