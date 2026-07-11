export interface TaxEntity {
  name: string;
  rate: number;
}

export interface PropertyTaxInputs {
  homeValue: number;

  entities: TaxEntity[];

  homesteadExemption?: number;

  additionalExemptions?: number;
}

export interface TaxBreakdown {
  name: string;
  rate: number;
  taxableValue: number;
  annualTax: number;
  monthlyTax: number;
}

export interface PropertyTaxResults {
  marketValue: number;

  taxableValue: number;

  combinedRate: number;

  annualTax: number;

  monthlyTax: number;

  breakdown: TaxBreakdown[];
}


export function calculatePropertyTax(
  inputs: PropertyTaxInputs
): PropertyTaxResults {

  const {
    homeValue,
    entities,

    homesteadExemption = 0,

    additionalExemptions = 0,
  } = inputs;


  const totalExemptions =
    homesteadExemption +
    additionalExemptions;


  const taxableValue =
    Math.max(
      homeValue - totalExemptions,
      0
    );


  const combinedRate =
    entities.reduce(
      (total, entity) =>
        total + entity.rate,
      0
    );


  const breakdown =
    entities.map((entity) => {

      const annualTax =
        taxableValue *
        (entity.rate / 100);


      return {
        name: entity.name,

        rate: entity.rate,

        taxableValue,

        annualTax,

        monthlyTax:
          annualTax / 12,
      };

    });


  const annualTax =
    breakdown.reduce(
      (total, item) =>
        total + item.annualTax,
      0
    );


  return {

    marketValue:
      homeValue,

    taxableValue,

    combinedRate,

    annualTax,

    monthlyTax:
      annualTax / 12,

    breakdown,

  };

}