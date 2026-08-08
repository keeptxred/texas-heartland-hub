import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculatePropertyTaxImpact = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("propertyTaxImpact").calculate(inputs);
export const validatePropertyTaxImpactInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
