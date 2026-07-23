export interface RelocationProfile {
  currentCity: string;
  destinationCity: string;
  householdSize: number;
  annualIncome: number;
  monthlyHousing: number;
  vehicles: number;
  commuteMiles: number;
}

export const defaultRelocationProfile: RelocationProfile = {
  currentCity: "",
  destinationCity: "Houston",
  householdSize: 2,
  annualIncome: 85000,
  monthlyHousing: 1900,
  vehicles: 2,
  commuteMiles: 20,
};

export function calculateLivingCosts(input: RelocationProfile & {
  childcare: number;
  healthcare: number;
  savingsRate: number;
}) {
  const utilities = 210 + input.householdSize * 45;
  const groceries = 280 + input.householdSize * 235;
  const transportation = input.vehicles * 465 + input.commuteMiles * 21;
  const insurance = 225 + input.vehicles * 155;
  const entertainment = 180 + input.householdSize * 80;
  const savings = (input.annualIncome / 12) * (input.savingsRate / 100);
  const monthlyTotal = input.monthlyHousing + utilities + groceries + transportation +
    insurance + input.healthcare + input.childcare + entertainment + savings;
  return {
    monthlyTotal,
    annualTotal: monthlyTotal * 12,
    incomeRemaining: input.annualIncome / 12 - monthlyTotal,
    breakdown: [
      ["Housing", input.monthlyHousing], ["Utilities", utilities], ["Groceries", groceries],
      ["Transportation", transportation], ["Insurance", insurance], ["Healthcare", input.healthcare],
      ["Childcare", input.childcare], ["Entertainment", entertainment], ["Savings", savings],
    ] as [string, number][],
  };
}

export function calculateCommute(input: {
  roundTripMiles: number; workDaysPerMonth: number; mpg: number; gasPrice: number;
  monthlyTolls: number; monthlyParking: number; hourlyValue: number; minutesPerDay: number;
}) {
  const monthlyMiles = input.roundTripMiles * input.workDaysPerMonth;
  const fuel = (monthlyMiles / Math.max(input.mpg, 1)) * input.gasPrice;
  const wear = monthlyMiles * 0.18;
  const time = (input.minutesPerDay / 60) * input.workDaysPerMonth * input.hourlyValue;
  const monthlyTotal = fuel + wear + input.monthlyTolls + input.monthlyParking;
  return { monthlyMiles, fuel, wear, time, monthlyTotal, annualTotal: monthlyTotal * 12, economicTotal: monthlyTotal + time };
}

export function calculateVehicleFees(input: { vehicles: number; titleTransfers: number; countyFee: number }) {
  const registration = input.vehicles * 50.75;
  const localFees = input.vehicles * input.countyFee;
  const processing = input.vehicles * 4.75;
  const titleFees = input.titleTransfers * 33;
  const newResidentTax = input.titleTransfers * 90;
  const total = registration + localFees + processing + titleFees + newResidentTax;
  return { registration, localFees, processing, titleFees, newResidentTax, total };
}

export function buildRelocationChecklist(input: RelocationProfile) {
  return [
    { phase: "6–8 weeks before", items: ["Set a moving budget", "Compare movers and insurance", `Research housing in ${input.destinationCity || "your Texas destination"}`, "Collect school and medical records"] },
    { phase: "2–4 weeks before", items: ["Schedule utilities and internet", "Submit address changes", "Review renters or homeowners insurance", `Plan transportation for ${input.vehicles} vehicle${input.vehicles === 1 ? "" : "s"}`] },
    { phase: "First week in Texas", items: ["Confirm utility service", "Update auto insurance garaging address", "Locate county tax office", "Secure important documents"] },
    { phase: "First 30 days", items: ["Transfer vehicle title and registration", "Apply for a Texas driver license", "Register to vote if eligible", "File homestead exemption after qualifying home purchase"] },
  ];
}
