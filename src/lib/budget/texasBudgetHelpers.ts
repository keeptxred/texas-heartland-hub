import type {TexasBudgetResult} from "@/types/budget/TexasBudgetPlanner";
export const formatBudgetCurrency=(value:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
export const explainCashFlow=(r:TexasBudgetResult)=>r.summary.monthlyRemaining>=1000?`Your budget has approximately ${formatBudgetCurrency(r.summary.monthlyRemaining)} remaining each month.`:r.summary.monthlyRemaining>=0?`Your budget is positive, but only ${formatBudgetCurrency(r.summary.monthlyRemaining)} remains each month.`:"Your expenses exceed your monthly income.";
export const explainHousingRatio=(r:TexasBudgetResult)=>`Housing uses ${Math.round(r.ratios.housingRatio*100)}% of income.`;
export const explainDebtRatio=(r:TexasBudgetResult)=>`Debt payments are ${Math.round(r.ratios.debtRatio*100)}% of income.`;
export const explainSavingsRate=(r:TexasBudgetResult)=>`Your savings rate is ${Math.round(r.ratios.savingsRate*100)}%.`;
export const explainFinancialHealth=(r:TexasBudgetResult)=>`${r.health.category}: ${r.health.description}`;
export function explainLargestExpense(r:TexasBudgetResult){const items=[['Housing',r.summary.totalHousing],['Transportation',r.summary.totalTransportation],['Debt',r.summary.totalDebt],['Lifestyle',r.summary.totalLifestyle]] as const;const largest=[...items].sort((a,b)=>b[1]-a[1])[0];return `Your largest monthly expense is ${largest[0]} at approximately ${formatBudgetCurrency(largest[1])}.`}
export const generateBudgetSummary=(r:TexasBudgetResult)=>`This ${r.input.city} household has monthly expenses of ${formatBudgetCurrency(r.summary.totalMonthlyExpenses)} with a financial health score of ${r.health.score}/100.`;
export const generateBudgetSEODescription=(location="Texas")=>`Use this ${location} budget planner to analyze income, expenses, savings, debt, and financial health for your household.`;
