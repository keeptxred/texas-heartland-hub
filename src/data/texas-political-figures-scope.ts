import type { PoliticalFigureCategory } from "./texas-political-figure-builder";

export const POLITICAL_FIGURE_CATEGORY_ORDER: PoliticalFigureCategory[] = [
  "Statewide executive leaders",
  "U.S. senators",
  "Texas judicial leaders",
  "Current U.S. representatives",
  "Historical U.S. House leaders",
  "Texas legislative leaders",
  "Reconstruction and early GOP leaders",
  "Party organizers and conservative activists",
];

export const politicalFigureCategoryAnchor = (category?: string) =>
  category?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? "";
