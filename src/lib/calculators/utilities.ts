export interface UtilityInputs {
  homeSizeSqFt: number;

  residents?: number;

  electricityRatePerSqFt?: number;

  waterBaseMonthly?: number;

  gasMonthly?: number;

  trashMonthly?: number;

  internetMonthly?: number;

  hasPool?: boolean;

  poolMonthlyAdjustment?: number;
}

export interface UtilityBreakdown {
  label: string;
  monthlyCost: number;
  annualCost: number;
}

export interface UtilityResults {
  monthlyTotal: number;

  annualTotal: number;

  breakdown: UtilityBreakdown[];
}


export function calculateUtilities(
  inputs: UtilityInputs
): UtilityResults {

  const {

    homeSizeSqFt,

    residents = 3,

    electricityRatePerSqFt = 0.18,

    waterBaseMonthly = 90,

    gasMonthly = 45,

    trashMonthly = 25,

    internetMonthly = 70,

    hasPool = false,

    poolMonthlyAdjustment = 50,

  } = inputs;


  /*
    Texas electricity usage varies heavily
    by season, HVAC size, and provider.

    This provides a planning estimate.
  */

  const electricity =
    homeSizeSqFt *
    electricityRatePerSqFt;


  const waterAdjustment =
    residents > 4
      ? 1.25
      : residents < 2
        ? 0.85
        : 1;


  const water =
    waterBaseMonthly *
    waterAdjustment;


  const poolAdjustment =
    hasPool
      ? poolMonthlyAdjustment
      : 0;


  const breakdown: UtilityBreakdown[] = [

    {
      label: "Electricity",
      monthlyCost: electricity,
      annualCost: electricity * 12,
    },

    {
      label: "Water & Sewer",
      monthlyCost: water,
      annualCost: water * 12,
    },

    {
      label: "Natural Gas",
      monthlyCost: gasMonthly,
      annualCost: gasMonthly * 12,
    },

    {
      label: "Trash Service",
      monthlyCost: trashMonthly,
      annualCost: trashMonthly * 12,
    },

    {
      label: "Internet",
      monthlyCost: internetMonthly,
      annualCost: internetMonthly * 12,
    },

  ];


  if (hasPool) {

    breakdown.push({

      label: "Pool Maintenance Adjustment",

      monthlyCost: poolAdjustment,

      annualCost:
        poolAdjustment * 12,

    });

  }


  const monthlyTotal =
    breakdown.reduce(
      (sum, item) =>
        sum + item.monthlyCost,
      0
    );


  const annualTotal =
    monthlyTotal * 12;


  return {

    monthlyTotal,

    annualTotal,

    breakdown,

  };

}