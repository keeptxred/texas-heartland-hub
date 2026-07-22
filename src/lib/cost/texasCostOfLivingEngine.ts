import type { TexasCostOfLivingInput, TexasCostOfLivingResult } from "@/types/cost/TexasCostOfLiving";
export function analyzeTexasCostOfLiving(input:TexasCostOfLivingInput):TexasCostOfLivingResult {
  const housing=Object.values(input.housing).reduce((a,b)=>a+b,0);
  const utilities=Object.values(input.utilities).reduce((a,b)=>a+b,0);
  const transportation=Object.values(input.transportation).reduce((a,b)=>a+b,0);
  const lifestyle=Object.values(input.lifestyle).reduce((a,b)=>a+b,0);
  const totalMonthlyCost=housing+utilities+transportation+lifestyle;
  const annualExpenses=totalMonthlyCost*12;
  const incomeAfterExpenses=input.annualIncome-annualExpenses;
  const housingRatio=input.annualIncome>0?(housing*12)/input.annualIncome:0;
  const savingsRate=input.annualIncome>0?incomeAfterExpenses/input.annualIncome:0;
  let affordabilityScore=50+(housingRatio<=.28?25:housingRatio<=.36?10:-15)+(savingsRate>=.2?20:savingsRate>=.1?10:0);
  affordabilityScore=Math.max(0,Math.min(100,Math.round(affordabilityScore)));
  return {input,summary:{housing,utilities,transportation,lifestyle,totalMonthlyCost},analysis:{annualExpenses,incomeAfterExpenses,housingRatio,savingsRate,affordabilityScore},recommendation:affordabilityScore>=80?"Your income appears well positioned for this Texas lifestyle.":affordabilityScore>=60?"Your budget appears manageable, but monitoring major expenses may improve flexibility.":"Your current expenses may create financial pressure."};
}
