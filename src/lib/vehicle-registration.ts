export type VehicleKind = "passenger" | "heavy-pickup" | "motorcycle" | "trailer";

export type VehicleRegistrationEstimateInput = {
  vehicleKind: VehicleKind;
  titleFee: 28 | 33;
  countyLocalFee: number;
  qualifiesForNewResidentTax: boolean;
  electricVehicle: boolean;
  emissionsCounty: boolean;
};

export type VehicleRegistrationLineItem = {
  label: string;
  amount: number;
  note?: string;
};

const BASE_REGISTRATION: Record<VehicleKind, number> = {
  passenger: 50.75,
  "heavy-pickup": 54,
  motorcycle: 30,
  trailer: 45,
};

export const EMISSIONS_COUNTIES = new Set([
  "Brazoria",
  "Collin",
  "Dallas",
  "Denton",
  "El Paso",
  "Ellis",
  "Fort Bend",
  "Galveston",
  "Harris",
  "Johnson",
  "Kaufman",
  "Montgomery",
  "Parker",
  "Rockwall",
  "Tarrant",
  "Travis",
  "Williamson",
]);

function clampCurrency(value: number, maximum: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), maximum);
}

export function estimateVehicleRegistration(input: VehicleRegistrationEstimateInput): {
  lineItems: VehicleRegistrationLineItem[];
  total: number;
  excludesUseTax: boolean;
} {
  const isMotorVehicle = input.vehicleKind !== "trailer";
  const localFee = clampCurrency(input.countyLocalFee, 31.5);
  const lineItems: VehicleRegistrationLineItem[] = [
    {
      label: "Base registration",
      amount: BASE_REGISTRATION[input.vehicleKind],
    },
    {
      label: "TexasSure insurance verification",
      amount: isMotorVehicle ? 1 : 0,
    },
    {
      label: "Title or registration-only fee",
      amount: input.titleFee,
      note: "Texas counties use either a $28 or $33 fee.",
    },
    {
      label: "County local fee",
      amount: localFee,
      note: "Set this to the amount confirmed by your county tax office.",
    },
    {
      label: "Processing and handling",
      amount: 4.75,
    },
  ];

  if (isMotorVehicle) {
    lineItems.push({
      label: "Inspection program replacement fee",
      amount: 7.5,
      note: "Most noncommercial safety inspections ended January 1, 2025, but this fee remains.",
    });
  }

  if (input.emissionsCounty && isMotorVehicle) {
    lineItems.push({
      label: "Estimated state emissions fee",
      amount: 2.75,
      note: "Testing-station and local charges can vary and are not included.",
    });
  }

  if (input.qualifiesForNewResidentTax && isMotorVehicle) {
    lineItems.push({
      label: "New resident motor vehicle tax",
      amount: 90,
      note: "Generally applies when the vehicle was previously registered in your name in another state or country.",
    });
  }

  if (input.electricVehicle && isMotorVehicle) {
    lineItems.push({
      label: "Electric vehicle annual fee",
      amount: 200,
    });
  }

  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
  return {
    lineItems,
    total: Math.round(total * 100) / 100,
    excludesUseTax: isMotorVehicle && !input.qualifiesForNewResidentTax,
  };
}
