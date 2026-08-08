import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateTexasPropertyTaxCounty = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("texasPropertyTaxCounty").calculate(inputs);
export const validateTexasPropertyTaxCountyInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
