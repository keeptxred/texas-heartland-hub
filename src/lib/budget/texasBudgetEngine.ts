import type { TexasBudgetInput, TexasBudgetResult, BudgetRecommendation } from "@/types/budget/TexasBudgetPlanner";

const sum = (values: object) => Object.values(values).reduce((total, value) => total + Number(value), 0);

export function analyzeTexasBudget(input: TexasBudgetInput): TexasBudgetResult {
  const totalHousing = sum(input.housing);
  const totalTransportation = sum(input.transportation);
  const totalDebt = sum(input.debt);
  const totalLifestyle = sum(input.lifestyle);
  const totalSavings = sum(input.savings);
  const totalMonthlyExpenses = totalHousing + totalTransportation + totalDebt + totalLifestyle + totalSavings;
  const income = input.income.monthlyTakeHomePay + input.income.additionalIncome;
  const monthlyRemaining = income - totalMonthlyExpenses;
  const ratios = {
    housingRatio: income ? totalHousing / income : 0,
    debtRatio: income ? totalDebt / income : 0,
    savingsRate: income ? totalSavings / income : 0,
    expenseRatio: income ? totalMonthlyExpenses / income : 0,
  };
  let score = 100;
  if (ratios.housingRatio > 0.36) score -= 25;
  else if (ratios.housingRatio > 0.28) score -= 10;
  if (ratios.debtRatio > 0.2) score -= 20;
  else if (ratios.debtRatio > 0.1) score -= 10;
  if (ratios.savingsRate >= 0.2) score += 5;
  else if (ratios.savingsRate < 0.1) score -= 20;
  score = Math.max(0, Math.min(100, score));
  const category = score >= 85 ? "Excellent" : score >= 70 ? "Healthy" : score >= 50 ? "Manageable" : "Needs Improvement";
  const recommendations: BudgetRecommendation[] = [];
  if (ratios.housingRatio > 0.36) recommendations.push({ priority: "high", message: "Consider reducing housing costs to improve monthly flexibility." });
  if (ratios.debtRatio > 0.2) recommendations.push({ priority: "high", message: "Reducing debt payments may significantly improve financial health." });
  if (ratios.savingsRate < 0.15) recommendations.push({ priority: "medium", message: "Increase monthly savings toward emergency funds and long-term goals." });
  if (!recommendations.length) recommendations.push({ priority: "low", message: "Your budget appears balanced with healthy financial habits." });

  return {
    input,
    summary: { totalHousing, totalTransportation, totalDebt, totalLifestyle, totalSavings, totalMonthlyExpenses, monthlyRemaining },
    ratios,
    health: { score: Math.round(score), category, description: `Your financial health score is ${Math.round(score)}/100.` },
    recommendations,
  };
}
