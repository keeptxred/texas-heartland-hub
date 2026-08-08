import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateMortgage = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("mortgage").calculate(inputs);
export const validateMortgageInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
