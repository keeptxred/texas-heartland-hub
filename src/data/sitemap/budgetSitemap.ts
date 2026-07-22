export const budgetSitemap = {
  url: "https://keeptxred.com/texas-budget-planner",
  lastModified: new Date().toISOString(),
  changeFrequency: "monthly",
  priority: 0.95,
};

export function generateCityBudgetPages(cities: string[]) {
  return cities.map((city) => ({
    url: `https://keeptxred.com/${city}-budget-planner`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));
}
