export type MoveDistance = "local" | "regional" | "long-distance";

export interface RelocationBudgetInputs {
  householdSize: number;
  bedrooms: number;
  moveDistance: MoveDistance;
  miles: number;
  monthlyRentOrMortgage: number;
  utilityDeposit: number;
  insuranceDeposit: number;
  vehicles: number;
  adultsNeedingLicense: number;
  travelCost: number;
  temporaryLodgingNights: number;
  lodgingNightlyRate: number;
  packingSupplies: number;
  professionalMovers: boolean;
  emergencyFundMonths: number;
  monthlyLivingExpenses: number;
}

export interface RelocationBudgetResult {
  movingCost: number;
  housingSetup: number;
  utilitiesAndInsurance: number;
  vehicleAndLicenseFees: number;
  travelAndLodging: number;
  emergencyFund: number;
  subtotal: number;
  contingency: number;
  total: number;
  recommendedCashTarget: number;
  breakdown: Array<{ label: string; amount: number }>;
}

const clamp = (value: number, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  Math.min(Math.max(Number.isFinite(value) ? value : 0, min), max);

export function calculateRelocationBudget(
  raw: RelocationBudgetInputs
): RelocationBudgetResult {
  const householdSize = clamp(raw.householdSize, 1, 12);
  const bedrooms = clamp(raw.bedrooms, 1, 8);
  const miles = clamp(raw.miles, 0, 4000);
  const vehicles = clamp(raw.vehicles, 0, 8);
  const adultsNeedingLicense = clamp(raw.adultsNeedingLicense, 0, 8);

  const distanceBase = {
    local: 450,
    regional: 1250,
    "long-distance": 2800,
  }[raw.moveDistance];

  const perMile = raw.professionalMovers ? 1.15 : 0.42;
  const moverPremium = raw.professionalMovers ? bedrooms * 520 : bedrooms * 115;
  const householdPremium = Math.max(0, householdSize - 2) * 120;
  const movingCost =
    distanceBase + miles * perMile + moverPremium + householdPremium + clamp(raw.packingSupplies);

  const housingSetup = clamp(raw.monthlyRentOrMortgage) * 2;
  const utilitiesAndInsurance = clamp(raw.utilityDeposit) + clamp(raw.insuranceDeposit);

  // Planning allowances only. Actual Texas state and county charges vary.
  const vehicleAndLicenseFees = vehicles * 125 + adultsNeedingLicense * 33;

  const travelAndLodging =
    clamp(raw.travelCost) +
    clamp(raw.temporaryLodgingNights, 0, 60) * clamp(raw.lodgingNightlyRate, 0, 1500);

  const emergencyFund =
    clamp(raw.emergencyFundMonths, 0, 12) * clamp(raw.monthlyLivingExpenses);

  const subtotal =
    movingCost +
    housingSetup +
    utilitiesAndInsurance +
    vehicleAndLicenseFees +
    travelAndLodging;
  const contingency = subtotal * 0.1;
  const total = subtotal + contingency;
  const recommendedCashTarget = total + emergencyFund;

  const breakdown = [
    { label: "Moving and packing", amount: movingCost },
    { label: "Housing move-in funds", amount: housingSetup },
    { label: "Utility and insurance deposits", amount: utilitiesAndInsurance },
    { label: "Vehicle registration and licenses", amount: vehicleAndLicenseFees },
    { label: "Travel and temporary lodging", amount: travelAndLodging },
    { label: "10% relocation contingency", amount: contingency },
    { label: "Emergency fund", amount: emergencyFund },
  ];

  return {
    movingCost,
    housingSetup,
    utilitiesAndInsurance,
    vehicleAndLicenseFees,
    travelAndLodging,
    emergencyFund,
    subtotal,
    contingency,
    total,
    recommendedCashTarget,
    breakdown,
  };
}
