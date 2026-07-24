import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";
export const calculateUtilityCost = (inputs: Record<string, number>) => getPhaseCalculatorDefinition("utilityCost").calculate(inputs);
export const validateUtilityCostInputs = (inputs: Record<string, number>) => Object.values(inputs).every(Number.isFinite);
