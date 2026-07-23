export const texasCities = [
  { city: "Houston", housing: 92, jobs: 96, family: 82, outdoors: 70, nightlife: 88, commute: 62 },
  { city: "Dallas", housing: 86, jobs: 95, family: 84, outdoors: 68, nightlife: 90, commute: 64 },
  { city: "Fort Worth", housing: 94, jobs: 86, family: 91, outdoors: 76, nightlife: 76, commute: 72 },
  { city: "Austin", housing: 68, jobs: 92, family: 78, outdoors: 94, nightlife: 95, commute: 58 },
  { city: "San Antonio", housing: 97, jobs: 82, family: 92, outdoors: 82, nightlife: 78, commute: 74 },
  { city: "El Paso", housing: 99, jobs: 68, family: 89, outdoors: 88, nightlife: 66, commute: 88 },
];

export function rankTexasCities(weights: Record<string, number>) {
  return texasCities
    .map((item) => ({
      city: item.city,
      score: Math.round((item.housing * weights.housing + item.jobs * weights.jobs + item.family * weights.family + item.outdoors * weights.outdoors + item.nightlife * weights.nightlife + item.commute * weights.commute) / Object.values(weights).reduce((a, b) => a + b, 0)),
    }))
    .sort((a, b) => b.score - a.score);
}

export function salaryEquivalent(currentSalary: number, currentIndex: number, texasIndex: number) {
  const equivalent = currentSalary * (texasIndex / currentIndex);
  return { equivalent, difference: currentSalary - equivalent, monthlyDifference: (currentSalary - equivalent) / 12 };
}

export function compareLivingCosts(currentMonthly: number, currentIndex: number, texasIndex: number) {
  const texasMonthly = currentMonthly * (texasIndex / currentIndex);
  return { texasMonthly, monthlySavings: currentMonthly - texasMonthly, annualSavings: (currentMonthly - texasMonthly) * 12 };
}

export function electricitySavings(kwh: number, currentCents: number, newCents: number, monthlyFee = 0) {
  const currentMonthly = kwh * currentCents / 100;
  const newMonthly = kwh * newCents / 100 + monthlyFee;
  return { currentMonthly, newMonthly, monthlySavings: currentMonthly - newMonthly, annualSavings: (currentMonthly - newMonthly) * 12 };
}