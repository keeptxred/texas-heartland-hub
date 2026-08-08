import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculatePropertyTax = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("propertyTax").calculate(inputs);
export const validatePropertyTaxInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
