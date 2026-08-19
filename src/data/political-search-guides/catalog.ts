import { POLITICAL_SEARCH_GUIDES } from "./index";

export const POLITICAL_REFERENCE_COUNT = POLITICAL_SEARCH_GUIDES.length;

export const POLITICAL_REFERENCE_PATHS = POLITICAL_SEARCH_GUIDES.map(
  (guide) => `/texas-political-reference/${guide.slug}`,
);
